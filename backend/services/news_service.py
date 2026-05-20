"""
Fetches financial headlines per market.
Priority: NewsAPI (if key set) → RSS feeds → curated mock data.
"""

import hashlib
import logging
import os
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

import httpx

logger = logging.getLogger(__name__)

_NEWSAPI_KEY = os.getenv("NEWSAPI_KEY", "")
_GNEWS_KEY = os.getenv("GNEWS_KEY", "")

_GNEWS_QUERIES: dict[str, str] = {
    "india": "Nifty OR SEBI OR RBI OR NSE stock market",
    "us":    "S&P 500 OR Fed OR NASDAQ OR Wall Street",
    "eu":    "ECB OR DAX OR eurozone OR European stocks",
}

_NEWSAPI_KEYWORDS: dict[str, str] = {
    "india": "NSE OR BSE OR SEBI OR RBI OR Nifty OR Sensex",
    "eu":    "ECB OR DAX OR eurozone OR \"European stocks\"",
    "us":    "\"S&P 500\" OR Fed OR NASDAQ OR \"Wall Street\"",
}

_RSS_FEEDS: dict[str, list[str]] = {
    "india": [
        "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
    ],
    "us": [
        "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114",
    ],
    "eu": [
        "https://feeds.bbci.co.uk/news/business/rss.xml",
    ],
}

_MOCK_HEADLINES: dict[str, list[dict]] = {
    "india": [
        {
            "title": "RBI holds repo rate at 6.5% for third consecutive meeting",
            "source": "Economic Times",
            "body_snippet": "The RBI's MPC unanimously voted to hold at 6.5%, citing persistent food inflation and global uncertainty.",
        },
        {
            "title": "Nifty 50 crosses 23,000 as IT stocks rally on strong Q4 results",
            "source": "Moneycontrol",
            "body_snippet": "Tech heavyweights led the advance after Infosys and TCS reported better-than-expected earnings.",
        },
        {
            "title": "FII outflows cross ₹15,000 crore in April amid dollar strength",
            "source": "Business Standard",
            "body_snippet": "Foreign investors continued to pull money from Indian equities as the US dollar strengthened.",
        },
        {
            "title": "SEBI tightens F&O rules to curb retail speculation",
            "source": "Mint",
            "body_snippet": "The regulator raised margin requirements for futures and options, targeting the surge in retail derivatives trading.",
        },
        {
            "title": "Bank Nifty falls 2.1% after RBI signals tighter liquidity",
            "source": "NDTV Profit",
            "body_snippet": "Banking stocks fell as the central bank signalled it would drain excess liquidity sooner than expected.",
        },
    ],
    "us": [
        {
            "title": "Fed signals 'higher for longer' as core PCE stays above 2% target",
            "source": "CNBC",
            "body_snippet": "Fed officials reinforced their data-dependent stance after core PCE remained stubbornly elevated.",
        },
        {
            "title": "S&P 500 hits record as Nvidia earnings beat by wide margin",
            "source": "MarketWatch",
            "body_snippet": "The benchmark index hit an all-time high after the chipmaker reported revenues 18% above consensus.",
        },
        {
            "title": "Treasury yields rise after stronger-than-expected jobs report",
            "source": "Reuters",
            "body_snippet": "Non-farm payrolls came in at 275,000 vs a 230,000 forecast, reducing expectations for near-term rate cuts.",
        },
        {
            "title": "Big Tech earnings drag Nasdaq lower despite broad market gains",
            "source": "Bloomberg",
            "body_snippet": "Meta and Alphabet disappointed investors with cautious forward guidance on advertising revenue.",
        },
        {
            "title": "US CPI eases to 3.1%, boosting rate cut hopes for September",
            "source": "Financial Times",
            "body_snippet": "Softer-than-expected inflation data revived hopes for Fed easing, sending equities higher.",
        },
    ],
    "eu": [
        {
            "title": "ECB cuts rates by 25bps as eurozone inflation returns to target",
            "source": "Reuters",
            "body_snippet": "The ECB reduced its key deposit rate after headline eurozone inflation fell to the 2.0% target.",
        },
        {
            "title": "DAX hits record high as German manufacturing PMI surprises to the upside",
            "source": "Bloomberg",
            "body_snippet": "A stronger PMI reading lifted European equities broadly, with the DAX briefly crossing 19,000.",
        },
        {
            "title": "Euro weakens against dollar as ECB signals faster easing path",
            "source": "Financial Times",
            "body_snippet": "The euro fell to a six-month low after ECB President Lagarde indicated more aggressive cuts ahead.",
        },
        {
            "title": "LVMH and Hermès slide as luxury demand weakens in China",
            "source": "Le Monde",
            "body_snippet": "European luxury goods giants fell sharply after data showed a slowdown in Chinese high-end spending.",
        },
        {
            "title": "EU energy stocks rally as gas prices rebound on supply concerns",
            "source": "BBC Business",
            "body_snippet": "Energy companies advanced after Middle East supply concerns drove wholesale gas prices higher.",
        },
    ],
}


def _parse_rss(xml_text: str) -> list[dict]:
    """Parse RSS 2.0 XML and return headline dicts."""
    try:
        root = ET.fromstring(xml_text)
        items = root.findall(".//item")
        results: list[dict] = []
        for item in items[:8]:
            title = (item.findtext("title") or "").strip()
            link = (item.findtext("link") or "").strip()
            pub_date = (item.findtext("pubDate") or "").strip()
            description = (item.findtext("description") or "").strip()
            source_el = item.find("source")
            source = source_el.text.strip() if source_el is not None else "RSS"
            if title:
                results.append(
                    {
                        "id": hashlib.md5(title.encode()).hexdigest()[:12],
                        "title": title,
                        "url": link,
                        "source": source,
                        "published_at": pub_date or datetime.now(timezone.utc).isoformat(),
                        "body_snippet": description[:200] if description else "",
                    }
                )
        return results
    except ET.ParseError:
        return []


async def _fetch_gnews(market: str, page_size: int) -> list[dict]:
    q = _GNEWS_QUERIES.get(market, "stock market")
    url = (
        "https://gnews.io/api/v4/search"
        f"?q={q}&lang=en&max={page_size}&sortby=publishedAt"
        f"&apikey={_GNEWS_KEY}"
    )
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        articles = resp.json().get("articles", [])
    return [
        {
            "id": hashlib.md5((a.get("url") or a.get("title", "")).encode()).hexdigest()[:12],
            "title": a.get("title", ""),
            "source": (a.get("source") or {}).get("name", ""),
            "published_at": a.get("publishedAt", ""),
            "url": a.get("url", ""),
            "body_snippet": (a.get("description") or "")[:300],
        }
        for a in articles
    ]


async def _fetch_newsapi(market: str, page_size: int) -> list[dict]:
    q = _NEWSAPI_KEYWORDS.get(market, "stock market")
    url = (
        "https://newsapi.org/v2/everything"
        f"?q={q}&language=en&sortBy=publishedAt&pageSize={page_size}"
        f"&apiKey={_NEWSAPI_KEY}"
    )
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        articles = resp.json().get("articles", [])
    return [
        {
            "id": hashlib.md5((a.get("url") or a.get("title", "")).encode()).hexdigest()[:12],
            "title": a.get("title", ""),
            "source": (a.get("source") or {}).get("name", ""),
            "published_at": a.get("publishedAt", ""),
            "url": a.get("url", ""),
            "body_snippet": (a.get("description") or "")[:300],
        }
        for a in articles
    ]


async def _fetch_rss(market: str) -> list[dict]:
    for url in _RSS_FEEDS.get(market, []):
        try:
            async with httpx.AsyncClient(
                timeout=6.0,
                follow_redirects=True,
                headers={"User-Agent": "Mastr/1.0"},
            ) as client:
                resp = await client.get(url)
            if resp.status_code == 200:
                items = _parse_rss(resp.text)
                if items:
                    return items
        except httpx.RequestError as exc:
            logger.warning("RSS fetch failed for %s: %s", url, exc)
    return []


def _mock(market: str) -> list[dict]:
    mocks = _MOCK_HEADLINES.get(market, [])
    now = datetime.now(timezone.utc).isoformat()
    return [
        {
            "id": hashlib.md5(h["title"].encode()).hexdigest()[:12],
            "title": h["title"],
            "source": h["source"],
            "published_at": now,
            "url": "",
            "body_snippet": h.get("body_snippet", ""),
        }
        for h in mocks
    ]


async def get_headlines(market: str, page_size: int = 10) -> list[dict]:
    """Return headlines for the given market. Priority: GNews → NewsAPI → RSS → mock."""
    if _GNEWS_KEY:
        try:
            return await _fetch_gnews(market, page_size)
        except Exception as exc:
            logger.warning("GNews failed: %s", exc)

    if _NEWSAPI_KEY:
        try:
            return await _fetch_newsapi(market, page_size)
        except Exception as exc:
            logger.warning("NewsAPI failed: %s", exc)

    rss = await _fetch_rss(market)
    if rss:
        return rss

    return _mock(market)
