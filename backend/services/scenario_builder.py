"""
Weekly cron: build fresh scenarios from real market events.
Called by APScheduler in main.py every Monday at 06:00 UTC.
"""

import asyncio
import hashlib
import json
import logging
from datetime import date, datetime, timezone

logger = logging.getLogger(__name__)

_TAGS_BY_MARKET: dict[str, list[list[str]]] = {
    "india": [
        ["rbi", "interest-rates", "monetary-policy"],
        ["nifty", "sensex", "indices"],
        ["fii", "dii", "flows"],
        ["sebi", "regulation"],
        ["earnings", "results", "it-sector"],
        ["inflation", "cpi", "bonds"],
        ["banking", "bank-nifty"],
    ],
    "us": [
        ["fed", "rates", "monetary-policy"],
        ["sp500", "nasdaq", "indices"],
        ["earnings", "big-tech"],
        ["cpi", "inflation"],
        ["treasury", "yields", "bonds"],
        ["jobs", "nfp", "labour-market"],
    ],
    "eu": [
        ["ecb", "rates", "monetary-policy"],
        ["dax", "cac40", "indices"],
        ["euro", "currency", "fx"],
        ["earnings", "luxury", "autos"],
        ["pmi", "manufacturing", "germany"],
    ],
}

_MARKET_TICKERS: dict[str, list[tuple[str, str]]] = {
    "india": [("^NSEI", "Nifty 50"), ("^BSESN", "Sensex"), ("^NSEBANK", "Bank Nifty")],
    "us":    [("^GSPC", "S&P 500"), ("^IXIC", "NASDAQ"), ("^DJI", "Dow Jones")],
    "eu":    [("^GDAXI", "DAX"), ("^FCHI", "CAC 40"), ("^STOXX50E", "Euro Stoxx 50")],
}


async def _build_market_context(market: str) -> str:
    """Return a plain-English summary of recent market moves and headlines."""
    from services.market_service import get_quote
    from services.news_service import get_headlines

    moves: list[str] = []
    for ticker, name in _MARKET_TICKERS.get(market, []):
        try:
            quote = await asyncio.to_thread(get_quote, ticker)
            direction = "up" if quote["change_pct"] >= 0 else "down"
            moves.append(
                f"{name} {direction} {abs(quote['change_pct']):.1f}% "
                f"at {quote['price']:.0f} {quote.get('currency', '')}"
            )
        except Exception as exc:
            logger.debug("Quote fetch failed for %s: %s", ticker, exc)

    headlines = await get_headlines(market, page_size=4)
    hl_text = "; ".join(h["title"] for h in headlines[:4]) if headlines else "no recent headlines available"

    lines = [f"Date: {date.today().isoformat()}"]
    if moves:
        lines.append("Market moves today: " + ", ".join(moves))
    lines.append(f"Recent headlines: {hl_text}")
    return "\n".join(lines)


async def build_scenarios_for_market(market: str, count: int = 3) -> list[dict]:
    """Generate `count` scenarios for a market using live data + Claude."""
    from services.claude_service import generate_live_scenario

    market_context = await _build_market_context(market)
    tags_pool = _TAGS_BY_MARKET.get(market, [["market", "finance"]])
    scenarios: list[dict] = []

    for i in range(count):
        tags = tags_pool[i % len(tags_pool)]
        difficulty = (i % 3) + 2  # cycles 2, 3, 4
        try:
            data = await generate_live_scenario(
                market=market,
                recent_event=market_context,
                lesson_tags=tags,
                difficulty=difficulty,
            )
            id_seed = f"{market}-{date.today().isoformat()}-{i}"
            data["id"] = "gen-" + hashlib.md5(id_seed.encode()).hexdigest()[:10]
            data["market"] = market
            data["track"] = "tradr"
            data["difficulty"] = int(data.get("difficulty") or difficulty)
            data["active"] = True
            data["generated_at"] = datetime.now(timezone.utc).isoformat()
            # Normalise media_literacy_note: drop empty strings
            if not data.get("media_literacy_note"):
                data["media_literacy_note"] = None
            scenarios.append(data)
            logger.info("Generated scenario %s for %s (difficulty=%d)", data["id"], market, difficulty)
        except Exception as exc:
            logger.error("Scenario generation failed for %s (i=%d): %s", market, i, exc)

    return scenarios


async def store_scenarios(scenarios: list[dict]) -> None:
    """Upsert generated scenarios into Supabase."""
    from database.supabase_client import get_client

    if not scenarios:
        return
    db = get_client()
    rows = [
        {
            "id":                  s["id"],
            "track":               s.get("track", "tradr"),
            "market":              s.get("market"),
            "context":             s["context"],
            "question":            s["question"],
            "options":             json.dumps(s["options"]),
            "correct":             s["correct"],
            "explanation_short":   s.get("explanation_short", ""),
            "media_literacy_note": s.get("media_literacy_note"),
            "tags":                s.get("tags", []),
            "difficulty":          s.get("difficulty", 2),
            "active":              True,
            "generated_at":        s.get("generated_at"),
        }
        for s in scenarios
    ]
    db.table("scenarios").upsert(rows).execute()
    logger.info("Stored %d scenarios in Supabase", len(rows))


async def run_weekly_build() -> None:
    """Entry point called by APScheduler every Monday 06:00 UTC."""
    logger.info("Weekly scenario build starting")
    for market in ("india", "us", "eu"):
        try:
            scenarios = await build_scenarios_for_market(market, count=3)
            await store_scenarios(scenarios)
        except Exception as exc:
            logger.error("Weekly build failed for %s: %s", market, exc)
    logger.info("Weekly scenario build complete")
