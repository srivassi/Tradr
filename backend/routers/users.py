import logging
from datetime import date, timedelta
from typing import Annotated

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field

from dependencies import get_current_user, AuthUser
from database.supabase_client import get_client

logger = logging.getLogger(__name__)
router = APIRouter()


class MarketUpdate(BaseModel):
    market: str = Field(..., pattern="^(india|eu|us)$")


class StreakResponse(BaseModel):
    streak_days:    int
    streak_updated: bool


class HeartsResponse(BaseModel):
    hearts_remaining: int


@router.get("/profile", summary="Get full user profile")
def get_profile(auth_user: Annotated[AuthUser, Depends(get_current_user)]):
    db = get_client()
    result = db.from_("users").select("*").eq("id", auth_user.id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")
    return result.data


@router.patch("/market", summary="Update user's market preference")
def update_market(
    body: MarketUpdate,
    auth_user: Annotated[AuthUser, Depends(get_current_user)],
):
    db = get_client()
    db.from_("users").update({"market": body.market}).eq("id", auth_user.id).execute()
    return {"market": body.market}


@router.post("/streak/check", response_model=StreakResponse, summary="Check and update streak on app open")
def check_streak(auth_user: Annotated[AuthUser, Depends(get_current_user)]) -> StreakResponse:
    """Called once on app open. Increments streak if active yesterday, resets if gap > 1 day."""
    db = get_client()
    today = date.today().isoformat()

    result = (
        db.from_("users")
        .select("streak_days,last_active")
        .eq("id", auth_user.id)
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")

    streak_days = result.data["streak_days"]
    last_active = result.data.get("last_active")

    if last_active == today:
        return StreakResponse(streak_days=streak_days, streak_updated=False)

    yesterday   = (date.today() - timedelta(days=1)).isoformat()
    streak_days = (streak_days + 1) if last_active == yesterday else 1

    db.from_("users").update({
        "streak_days": streak_days,
        "last_active": today,
    }).eq("id", auth_user.id).execute()

    return StreakResponse(streak_days=streak_days, streak_updated=True)


@router.post("/hearts/use", response_model=HeartsResponse, summary="Consume one heart")
def use_heart(auth_user: Annotated[AuthUser, Depends(get_current_user)]) -> HeartsResponse:
    db = get_client()
    result = db.from_("users").select("hearts").eq("id", auth_user.id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")

    hearts = max(0, result.data["hearts"] - 1)
    db.from_("users").update({"hearts": hearts}).eq("id", auth_user.id).execute()
    return HeartsResponse(hearts_remaining=hearts)


@router.get("/reviews/due", summary="Get SM-2 review queue (stub)")
def get_due_reviews(auth_user: Annotated[AuthUser, Depends(get_current_user)]):
    return {"reviews": []}
