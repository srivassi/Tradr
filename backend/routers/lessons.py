import json
import math
import logging
from datetime import date, timedelta
from typing import Annotated

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field

from dependencies import get_current_user, AuthUser
from database.supabase_client import get_client
import services.claude_service as claude

logger = logging.getLogger(__name__)
router = APIRouter()


class CompleteRequest(BaseModel):
    xp_earned: int = Field(..., ge=0, le=300, description="XP to award (calculated by client)")
    correct:   int = Field(..., ge=0, description="Number of correct answers")
    total:     int = Field(..., ge=1, description="Total questions in the lesson")
    perfect:   bool = Field(..., description="All questions answered correctly")
    is_quiz:   bool = Field(..., description="Whether this is a unit quiz")
    track:     str  = Field(..., pattern="^(tradr|codr)$", description="Learning track")
    market:    str  = Field("shared", description="Market context: india | eu | us | shared (for foundation lessons)")


class CompleteResponse(BaseModel):
    xp_earned:      int
    new_xp:         int
    new_level:      int
    streak_days:    int
    streak_updated: bool
    perfect:        bool


class AnswerRequest(BaseModel):
    question:          str = Field(..., description="Full question text")
    user_answer:       str = Field(..., description="Text of the option the user selected")
    correct_answer:    str = Field(..., description="Text of the correct option")
    short_explanation: str = Field(..., description="Brief hint from lesson data")
    track:             str = Field(..., pattern="^(tradr|codr)$", description="Learning track")
    question_type:     str = Field("mcq", description="Codr question type: mcq | fill_blank | ordering | spot_bug")


class AnswerResponse(BaseModel):
    claude_explanation: str


@router.get("", summary="List lessons (stub)", include_in_schema=False)
def get_lessons(market: str = "india"):
    return {"market": market, "lessons": []}


@router.get("/{lesson_id}", summary="Get lesson content (stub)", include_in_schema=False)
def get_lesson(lesson_id: str):
    return {"lesson_id": lesson_id, "questions": []}


@router.get(
    "/{lesson_id}/questions",
    summary="Get live-generated question variants for a lesson",
    description="Returns Claude-generated MCQ variants from Supabase. Returns [] if none exist yet — the client falls back to local lesson data.",
)
async def get_live_questions(lesson_id: str, track: str = "tradr", market: str = "india") -> dict:
    """Return generated question variants from Supabase for this lesson/track."""
    db = get_client()
    try:
        result = (
            db.table("questions")
            .select("id,type,question,options,correct,explanation_short,tags,difficulty")
            .eq("track", track)
            .eq("active", True)
            .order("generated_at", desc=True)
            .limit(15)
            .execute()
        )
        rows: list[dict] = result.data or []
        for row in rows:
            if isinstance(row.get("options"), str):
                row["options"] = json.loads(row["options"])
        return {"questions": rows}
    except Exception as exc:
        logger.warning("Live questions fetch failed for %s: %s", lesson_id, exc)
        return {"questions": []}


@router.post(
    "/{lesson_id}/answer",
    response_model=AnswerResponse,
    summary="Get Claude explanation for a wrong answer",
)
async def submit_answer(
    lesson_id: str,
    body: AnswerRequest,
    auth_user: Annotated[AuthUser, Depends(get_current_user)],
) -> AnswerResponse:
    try:
        if body.track == "codr":
            explanation = await claude.explain_code_wrong_answer(
                question=body.question,
                user_answer=body.user_answer,
                correct_answer=body.correct_answer,
                short_explanation=body.short_explanation,
                user_level=auth_user.level,
                question_type=body.question_type,
            )
        else:
            explanation = await claude.explain_wrong_answer(
                question=body.question,
                user_answer=body.user_answer,
                correct_answer=body.correct_answer,
                short_explanation=body.short_explanation,
                user_level=auth_user.level,
                market=auth_user.market,
            )
        return AnswerResponse(claude_explanation=explanation)
    except Exception as e:
        logger.error("Claude call failed for lesson %s user %s: %s", lesson_id, auth_user.id, e)
        return AnswerResponse(claude_explanation=body.short_explanation)


@router.post(
    "/{lesson_id}/complete",
    response_model=CompleteResponse,
    summary="Record lesson completion, award XP, update streak",
)
async def complete_lesson(
    lesson_id: str,
    body: CompleteRequest,
    auth_user: Annotated[AuthUser, Depends(get_current_user)],
) -> CompleteResponse:
    db = get_client()
    today = date.today().isoformat()

    try:
        # Idempotency: if already completed, return current state with 0 new XP
        existing = (
            db.from_("lesson_progress")
            .select("completed")
            .eq("user_id", auth_user.id)
            .eq("lesson_id", lesson_id)
            .execute()
        )
        already_completed = bool(existing.data and existing.data[0]["completed"])
        xp_to_award = 0 if already_completed else body.xp_earned

        # Upsert lesson_progress
        db.from_("lesson_progress").upsert({
            "user_id":      auth_user.id,
            "lesson_id":    lesson_id,
            "track":        body.track,
            "market":       body.market,
            "completed":    True,
            "score":        body.correct,
            "xp_earned":    xp_to_award,
            "perfect":      body.perfect,
            "completed_at": f"{today}T00:00:00Z",
        }).execute()

        # Read current user stats
        user_result = (
            db.from_("users")
            .select("xp,level,streak_days,last_active")
            .eq("id", auth_user.id)
            .single()
            .execute()
        )
        if not user_result.data:
            raise HTTPException(status_code=404, detail="User not found")

        current  = user_result.data
        new_xp   = current["xp"] + xp_to_award
        new_level = min(math.floor(new_xp / 100) + 1, 50)

        # Streak: increment if active yesterday, reset to 1 if gap > 1 day, no-op if already today
        streak_updated = False
        streak_days    = current["streak_days"]
        last_active    = current.get("last_active")

        if last_active != today:
            yesterday      = (date.today() - timedelta(days=1)).isoformat()
            streak_days    = (streak_days + 1) if last_active == yesterday else 1
            streak_updated = True

        db.from_("users").update({
            "xp":          new_xp,
            "level":       new_level,
            "streak_days": streak_days,
            "last_active": today,
        }).eq("id", auth_user.id).execute()

        # Accumulate weekly XP for leaderboard (read-then-write; low concurrency risk acceptable)
        if xp_to_award > 0:
            week_start    = (date.today() - timedelta(days=date.today().weekday())).isoformat()
            weekly_result = (
                db.from_("weekly_xp")
                .select("xp")
                .eq("user_id", auth_user.id)
                .eq("week_start", week_start)
                .execute()
            )
            current_weekly = weekly_result.data[0]["xp"] if weekly_result.data else 0
            db.from_("weekly_xp").upsert({
                "user_id":    auth_user.id,
                "week_start": week_start,
                "xp":         current_weekly + xp_to_award,
            }).execute()

        return CompleteResponse(
            xp_earned=xp_to_award,
            new_xp=new_xp,
            new_level=new_level,
            streak_days=streak_days,
            streak_updated=streak_updated,
            perfect=body.perfect,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error("complete_lesson failed for user %s lesson %s: %s", auth_user.id, lesson_id, e)
        raise HTTPException(status_code=500, detail="Internal server error")
