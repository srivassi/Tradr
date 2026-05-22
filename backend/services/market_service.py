import yfinance as yf
from datetime import datetime
from functools import lru_cache

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


def get_quote(ticker: str) -> dict:
    cache_key = datetime.now().strftime("%Y-%m-%d-%H-%M")[:-1] + "0"  # 10-min buckets
    return _get_quote_cached(ticker, cache_key)


def get_market_indices(market_id: str) -> list[dict]:
    tickers = _MARKET_TICKERS.get(market_id, [])
    results = []
    for t in tickers:
        try:
            quote = get_quote(t["ticker"])
            results.append({"name": t["name"], **quote})
        except Exception:
            results.append({"name": t["name"], "ticker": t["ticker"], "error": True})
    return results


def get_sector_performance(market_id: str) -> list[dict]:
    sectors = _SECTOR_TICKERS.get(market_id, {})
    results = []
    for name, ticker in sectors.items():
        try:
            quote = get_quote(ticker)
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
