import yfinance as yf
from datetime import datetime, time as dtime
from functools import lru_cache
from zoneinfo import ZoneInfo

_MARKET_TICKERS = {
    "india": [
        {"ticker": "^NSEI",    "name": "NIFTY 50"},
        {"ticker": "^BSESN",   "name": "SENSEX"},
        {"ticker": "^NSEBANK", "name": "BANK NIFTY"},
    ],
    "eu": [
        {"ticker": "^GDAXI",    "name": "DAX"},
        {"ticker": "^FCHI",     "name": "CAC 40"},
        {"ticker": "^AEX",      "name": "AEX"},
        {"ticker": "^STOXX50E", "name": "EURO STOXX 50"},
        {"ticker": "^IBEX",     "name": "IBEX 35"},
        {"ticker": "FTSEMIB.MI","name": "FTSE MIB"},
        {"ticker": "^OMX",      "name": "OMX Stockholm 30"},
    ],
    "us": [
        {"ticker": "^GSPC", "name": "S&P 500"},
        {"ticker": "^IXIC", "name": "NASDAQ"},
        {"ticker": "^DJI",  "name": "Dow Jones"},
    ],
}

# Sector ETF proxies (India: sectoral indices, EU/US: ETFs)
_SECTOR_TICKERS = {
    "india": {
        "IT":      "^CNXIT",
        "Banking": "^NSEBANK",
        "Pharma":  "^CNXPHARMA",
        "Energy":  "^CNXENERGY",
        "Metal":   "^CNXMETAL",
        "Realty":  "^CNXREALTY",
    },
    "eu": {
        "Auto":       "^STOXXAUTO",
        "Finance":    "^STOXXFIN",
        "Industrial": "^STOXXIND",
        "Tech":       "^STOXXTECH",
    },
    "us": {
        "Tech":       "XLK",
        "Finance":    "XLF",
        "Healthcare": "XLV",
        "Energy":     "XLE",
        "Consumer":   "XLY",
        "Industrial": "XLI",
    },
}


# Market trading hours — used to skip API calls after close
_MARKET_HOURS: dict[str, dict] = {
    "india": {"tz": ZoneInfo("Asia/Kolkata"),     "open": dtime(9, 15),  "close": dtime(15, 30)},
    "us":    {"tz": ZoneInfo("America/New_York"),  "open": dtime(9, 30),  "close": dtime(16, 0)},
    "eu":    {"tz": ZoneInfo("Europe/Berlin"),     "open": dtime(9, 0),   "close": dtime(17, 30)},
}


def _cache_key(market_id: str) -> str:
    """10-min bucket during market hours; day-level key when closed/weekend."""
    config = _MARKET_HOURS.get(market_id)
    if not config:
        return datetime.now().strftime("%Y-%m-%d-%H-%M")[:-1] + "0"

    now = datetime.now(config["tz"])
    if now.weekday() >= 5 or not (config["open"] <= now.time() <= config["close"]):
        return now.strftime("%Y-%m-%d-closed")

    return now.strftime("%Y-%m-%d-%H-") + str(now.minute // 10)


@lru_cache(maxsize=256)
def _get_quote_cached(ticker: str, cache_key: str) -> dict:
    stock = yf.Ticker(ticker)
    info = stock.fast_info
    try:
        change_pct = round(info.last_price / info.previous_close * 100 - 100, 2)
    except Exception:
        change_pct = 0.0
    return {
        "ticker":     ticker,
        "price":      round(float(info.last_price), 2),
        "change_pct": change_pct,
        "volume":     int(info.last_volume),
        "currency":   info.currency,
    }


def get_quote(ticker: str, market_id: str = "") -> dict:
    return _get_quote_cached(ticker, _cache_key(market_id))


def get_market_indices(market_id: str) -> list[dict]:
    tickers = _MARKET_TICKERS.get(market_id, [])
    results = []
    for t in tickers:
        try:
            quote = get_quote(t["ticker"], market_id)
            results.append({"name": t["name"], **quote})
        except Exception:
            results.append({"name": t["name"], "ticker": t["ticker"], "error": True})
    return results


def get_sector_performance(market_id: str) -> list[dict]:
    sectors = _SECTOR_TICKERS.get(market_id, {})
    results = []
    for name, ticker in sectors.items():
        try:
            quote = get_quote(ticker, market_id)
            results.append({"sector": name, "change_pct": quote["change_pct"]})
        except Exception:
            results.append({"sector": name, "change_pct": 0.0, "error": True})
    return results


def get_chart_data(ticker: str, period: str = "3mo") -> list[dict]:
    hist = yf.Ticker(ticker).history(period=period)
    return [
        {
            "date":   str(idx.date()),
            "open":   round(float(row.Open),  2),
            "high":   round(float(row.High),  2),
            "low":    round(float(row.Low),   2),
            "close":  round(float(row.Close), 2),
            "volume": int(row.Volume),
        }
        for idx, row in hist.iterrows()
    ]
