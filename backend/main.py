import logging
import os

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from routers import lessons, scenarios, markets, news, users, leaderboard

logger = logging.getLogger(__name__)
ENV = os.getenv("ENVIRONMENT", "development")

_scheduler = AsyncIOScheduler()

app = FastAPI(
    title="Mastr API",
    description="""
## Mastr — Gamified Learning Platform

Backend API for the Mastr app. Powers lessons, scenarios, live market data,
gamification (XP, streaks, hearts, leagues), and Claude AI integrations.

### Authentication
All protected routes require a Supabase JWT in the `Authorization` header:
```
Authorization: Bearer <supabase_access_token>
```

### Market IDs
All market-scoped endpoints accept `market_id` as one of: `india` · `eu` · `us`

### Rate Limits
Claude-powered endpoints (explain-headline, wrong-answer coaching) are limited to
**20 calls per user per hour**.
    """,
    version="0.1.0",
    docs_url="/docs"            if ENV != "production" else None,
    redoc_url="/redoc"          if ENV != "production" else None,
    openapi_url="/openapi.json" if ENV != "production" else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(lessons.router,     prefix="/lessons",     tags=["Lessons"])
app.include_router(scenarios.router,   prefix="/scenarios",   tags=["Scenarios"])
app.include_router(markets.router,     prefix="/markets",     tags=["Markets"])
app.include_router(news.router,        prefix="/news",        tags=["News"])
app.include_router(users.router,       prefix="/user",        tags=["User & Gamification"])
app.include_router(leaderboard.router, prefix="/leaderboard", tags=["Leaderboard"])


@app.on_event("startup")
async def startup() -> None:
    async def _run_scenario_build() -> None:
        from services.scenario_builder import run_weekly_build
        await run_weekly_build()

    async def _run_question_build() -> None:
        from services.question_builder import run_weekly_question_build
        await run_weekly_question_build()

    _scheduler.add_job(
        _run_scenario_build,
        CronTrigger(day_of_week="mon", hour=6, minute=0, timezone="UTC"),
        id="weekly_scenario_build",
        replace_existing=True,
    )
    _scheduler.add_job(
        _run_question_build,
        CronTrigger(day_of_week="mon", hour=6, minute=30, timezone="UTC"),
        id="weekly_question_build",
        replace_existing=True,
    )
    _scheduler.start()
    logger.info("APScheduler started — scenario build Mon 06:00 UTC, question build Mon 06:30 UTC")


@app.on_event("shutdown")
def shutdown() -> None:
    _scheduler.shutdown(wait=False)


@app.get("/health", include_in_schema=False)
def health() -> dict:
    return {"status": "ok", "version": "0.1.0", "environment": ENV}


@app.post("/admin/trigger-scenario-build", include_in_schema=False)
async def trigger_scenario_build() -> dict:
    """Dev-only: manually kick off the weekly scenario + question build."""
    if ENV == "production":
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Not available in production")
    from services.scenario_builder import run_weekly_build
    from services.question_builder import run_weekly_question_build
    await run_weekly_build()
    await run_weekly_question_build()
    return {"status": "done"}
