from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.news_service import get_headlines

router = APIRouter()


class ExplainRequest(BaseModel):
    headline: str
    body_snippet: str = ""
    market: str = "india"
    user_level: int = 1


@router.get("/{market_id}")
async def headlines(market_id: str):
    """Return top headlines for the given market (india | eu | us)."""
    if market_id not in ("india", "eu", "us"):
        raise HTTPException(status_code=400, detail="Invalid market_id")
    items = await get_headlines(market_id)
    return {"market": market_id, "headlines": items}


@router.post("/explain")
async def explain_headline(req: ExplainRequest):
    """Use Claude to explain a financial headline in plain English."""
    try:
        from services.claude_service import explain_headline as _explain
        text = await _explain(req.headline, req.body_snippet, req.market, req.user_level)
        return {"explanation": text}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
