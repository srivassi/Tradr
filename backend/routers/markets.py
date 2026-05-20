import asyncio

from fastapi import APIRouter, HTTPException

from services.market_service import get_chart_data, get_market_indices, get_sector_performance

router = APIRouter()


@router.get("/{market_id}/indices")
async def indices(market_id: str):
    """Live index prices for the given market (india | eu | us). 5-min cached."""
    if market_id not in ("india", "eu", "us"):
        raise HTTPException(status_code=400, detail="Invalid market_id")
    return await asyncio.to_thread(get_market_indices, market_id)


@router.get("/{market_id}/sectors")
async def sectors(market_id: str):
    """Sector performance for the given market. 5-min cached."""
    if market_id not in ("india", "eu", "us"):
        raise HTTPException(status_code=400, detail="Invalid market_id")
    return await asyncio.to_thread(get_sector_performance, market_id)


@router.get("/{market_id}/chart/{ticker}")
async def chart(market_id: str, ticker: str, period: str = "3mo"):
    """OHLCV chart data for a ticker. 1-hour cached."""
    return await asyncio.to_thread(get_chart_data, ticker, period)
