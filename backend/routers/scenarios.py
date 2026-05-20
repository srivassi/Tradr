from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

# Curated daily scenarios per market — rotated by day-of-week
_DAILY_SCENARIOS: dict[str, list[dict]] = {
    "india": [
        {
            "id": "india-rbi-hold",
            "market": "india",
            "context": (
                "The RBI has announced it is holding the repo rate at 6.5% for the third "
                "consecutive meeting. Markets had priced in a 60% chance of a 25bps cut. "
                "The Nifty 50 is down 1.2% in the first 30 minutes. Bank Nifty is down 2.8%."
            ),
            "question": (
                "Bank Nifty fell harder than the broader Nifty 50. "
                "Why would banking stocks be more sensitive to this RBI decision?"
            ),
            "options": [
                "Banks wanted rates to fall so they could borrow more cheaply and lend at higher margins",
                "Lower rates would have boosted loan demand and improved net interest margins for banks",
                "Banks benefit when rates fall because savers withdraw deposits and buy stocks instead",
                "Banking stocks always fall when any government announcement is made",
            ],
            "correct": 1,
            "explanation_short": (
                "Banks profit from the spread between borrowing and lending rates. "
                "A cut would have reduced their cost of funds while maintaining lending rates — "
                "boosting NIM. No cut means that margin expansion doesn't happen."
            ),
            "media_literacy_note": (
                "Notice how headlines said 'RBI disappoints markets'. But rates being held is "
                "neutral policy — 'disappointment' is relative to what was priced in, not absolute bad news."
            ),
            "difficulty": 3,
            "tags": ["rbi", "interest-rates", "banking"],
        },
        {
            "id": "india-fii-sell",
            "market": "india",
            "context": (
                "Foreign Institutional Investors (FIIs) have sold ₹22,000 crore worth of Indian "
                "equities over the past 10 trading sessions. The rupee has weakened to ₹84.5 per dollar. "
                "The Nifty 50 has corrected 4.5% from its recent high."
            ),
            "question": "Why do FII outflows typically weaken the Indian rupee alongside equity markets?",
            "options": [
                "FIIs always sell rupees when they sell stocks — it is a rule set by SEBI",
                "FIIs must convert rupee proceeds back to dollars to repatriate funds, creating dollar demand and rupee selling pressure",
                "The RBI forces FIIs to sell their rupees whenever they exit equities",
                "FII outflows reduce India's GDP, which automatically weakens the rupee",
            ],
            "correct": 1,
            "explanation_short": (
                "When FIIs sell Indian stocks, they receive rupees. To send money home, "
                "they sell those rupees and buy dollars — increasing dollar demand and weakening the rupee. "
                "Simultaneous stock and currency selling creates a double pressure."
            ),
            "difficulty": 2,
            "tags": ["fii", "rupee", "currency"],
        },
        {
            "id": "india-sebi-fo",
            "market": "india",
            "context": (
                "SEBI has announced new rules increasing the minimum lot size for index F&O contracts "
                "from ₹5 lakh to ₹15 lakh. Retail participation in NSE options had grown 300% in 2 years, "
                "with 93% of retail traders losing money according to SEBI's own study."
            ),
            "question": "What is the primary reason SEBI raised the lot size for F&O contracts?",
            "options": [
                "To increase revenue for stock exchanges",
                "To reduce retail participation and protect small investors from complex, high-risk instruments",
                "To attract more institutional investors to Indian derivatives",
                "To comply with international regulatory requirements",
            ],
            "correct": 1,
            "explanation_short": (
                "SEBI's own data showed 93% of retail F&O traders lost money. Higher lot sizes "
                "mean traders need more capital, pricing out smaller retail participants who are statistically "
                "most likely to lose to algorithms and institutions."
            ),
            "difficulty": 2,
            "tags": ["sebi", "regulation", "derivatives"],
        },
        {
            "id": "india-it-results",
            "market": "india",
            "context": (
                "Infosys just reported Q4 results: revenue grew 5.1% YoY (in rupee terms) but only "
                "2.3% in constant currency. The CEO guided for 4–7% revenue growth in FY26. "
                "Analysts had expected 6–8% guidance. The stock is down 6% on the day."
            ),
            "question": "Why does the market react negatively even though Infosys grew its revenue?",
            "options": [
                "Markets always fall after earnings reports regardless of results",
                "Guidance of 4–7% missed analyst expectations of 6–8% — the market prices future earnings, not past performance",
                "Constant currency growth being lower than rupee growth is always a sell signal",
                "Infosys must have announced layoffs",
            ],
            "correct": 1,
            "explanation_short": (
                "Markets are forward-looking. The past quarter was fine, but the 4–7% guidance "
                "disappointed those expecting 6–8%. Analysts will now revise their models lower, "
                "reducing their target prices — which is why the stock sold off."
            ),
            "media_literacy_note": (
                "Headlines will say 'Infosys CRASHES on results'. The stock fell 6% — significant, "
                "but 'crashes' implies catastrophic loss. The mechanism is soft guidance, not a business failure."
            ),
            "difficulty": 3,
            "tags": ["earnings", "guidance", "it-sector"],
        },
        {
            "id": "india-nifty-ath",
            "market": "india",
            "context": (
                "The Nifty 50 has hit an all-time high of 24,500. P/E ratio of the index stands at 24x "
                "vs its 10-year average of 20x. Retail investor demat accounts have grown from 40M to 160M "
                "in 4 years. Social media is full of posts about stock market success stories."
            ),
            "question": "The Nifty is at an all-time high with a premium valuation. What should a disciplined investor be thinking?",
            "options": [
                "Buy aggressively — all-time highs always go higher",
                "Sell everything — valuations above historical averages always mean a crash is imminent",
                "Be more selective and cautious; high valuations mean lower expected future returns, not necessarily an imminent crash",
                "Follow the social media crowd — retail investors moving in is always a positive sign",
            ],
            "correct": 2,
            "explanation_short": (
                "High P/E doesn't guarantee a crash — valuations can stay elevated for years. "
                "But at 24x vs a 20x average, expected future returns are lower. Disciplined investors "
                "don't time the market, but they do size positions appropriately given risk."
            ),
            "media_literacy_note": (
                "Retail participation surging is historically a late-cycle signal, not a bullish one — "
                "retail enters last, near peaks. This doesn't mean 'sell everything', but 'be thoughtful'."
            ),
            "difficulty": 3,
            "tags": ["valuation", "pe-ratio", "market-timing"],
        },
        {
            "id": "india-inflation",
            "market": "india",
            "context": (
                "India's retail inflation (CPI) rose to 6.8%, above the RBI's 6% upper tolerance band "
                "for the second consecutive month. Vegetable prices are up 28% YoY. "
                "The 10-year government bond yield has risen to 7.4%."
            ),
            "question": "Why did the government bond yield rise when CPI came in above expectations?",
            "options": [
                "Higher inflation means the government earns more money and can pay higher yields",
                "Above-target inflation reduces the chance of RBI rate cuts — or raises hike risk — pushing yields higher",
                "Bond yields always move in the same direction as food prices",
                "Foreign investors always sell Indian bonds when vegetables become expensive",
            ],
            "correct": 1,
            "explanation_short": (
                "Bond yields rise when investors demand higher compensation for holding fixed-rate debt "
                "during inflation. High CPI also signals the RBI can't cut rates — possibly needs to hike — "
                "which reduces bond prices and pushes yields up."
            ),
            "difficulty": 3,
            "tags": ["inflation", "bonds", "rbi"],
        },
        {
            "id": "india-dii-support",
            "market": "india",
            "context": (
                "As FIIs sold ₹30,000 crore of Indian equities last month, Domestic Institutional Investors "
                "(DIIs) — primarily mutual funds via SIP inflows — bought ₹28,000 crore. "
                "The Nifty fell only 1.8% despite the heavy foreign selling."
            ),
            "question": "What role did DIIs play in limiting the market's decline during the FII sell-off?",
            "options": [
                "DIIs made it worse by also selling their holdings",
                "DIIs provided buying support — their purchases absorbed most of the FII selling pressure",
                "DIIs bought bonds instead of stocks, which helped the equity market indirectly",
                "DIIs are not allowed to buy during FII sell-offs",
            ],
            "correct": 1,
            "explanation_short": (
                "When FIIs sell and DIIs buy, the selling pressure is absorbed. ₹28,000 crore of DII "
                "buying offset ₹30,000 crore of FII selling — only ₹2,000 crore of net selling hit the market. "
                "SIP-driven DII flows have become a structural buffer for Indian equities."
            ),
            "difficulty": 2,
            "tags": ["fii", "dii", "flows"],
        },
    ],
    "us": [
        {
            "id": "us-fed-hike",
            "market": "us",
            "context": (
                "The Federal Reserve raised rates by 25bps to 5.5%, in line with expectations. "
                "In the press conference, Chair Powell said 'we may need to keep rates higher for longer'. "
                "The S&P 500 fell 1.8% after initially rising on the in-line decision."
            ),
            "question": "Why did the S&P 500 fall after the in-line rate hike, when the hike itself was expected?",
            "options": [
                "Rate hikes always cause stocks to fall regardless of expectations",
                "Powell's 'higher for longer' language surprised markets that had been pricing in cuts for later this year",
                "The 25bps hike was larger than the 0bps the market expected",
                "Tech stocks always fall on Fed days",
            ],
            "correct": 1,
            "explanation_short": (
                "The hike was priced in — no surprise there. But 'higher for longer' was more hawkish "
                "than the market's expectation of cuts by year-end. Markets had to reprice: if rates stay "
                "high longer, future earnings are discounted at a higher rate, reducing stock valuations."
            ),
            "media_literacy_note": (
                "Headlines will read 'Stocks PLUNGE after Fed hike'. The actual mechanism: "
                "one sentence in a press conference changed rate-cut expectations. That's the real story."
            ),
            "difficulty": 3,
            "tags": ["fed", "rates", "sp500"],
        },
        {
            "id": "us-nvidia-earnings",
            "market": "us",
            "context": (
                "Nvidia reported quarterly revenue of $26B, 18% above analyst consensus of $22B. "
                "EPS came in at $6.12 vs $5.16 expected. The stock jumped 12% after hours. "
                "The company also announced a 10-for-1 stock split."
            ),
            "question": "Nvidia's stock jumped 12% after the results. Which factor most likely drove this?",
            "options": [
                "The 10-for-1 stock split increased the number of shares, creating value",
                "The significant revenue and EPS beat caused investors to revise future earnings estimates sharply higher",
                "Nvidia announced a new product that will launch next year",
                "12% gains always follow quarterly reports in tech",
            ],
            "correct": 1,
            "explanation_short": (
                "An 18% revenue beat is massive. It signals AI data centre demand is far stronger than "
                "analysts modelled. Investors revise their future earnings estimates upward — "
                "which raises target prices. The split is cosmetic and doesn't create real value."
            ),
            "difficulty": 2,
            "tags": ["earnings", "nvidia", "ai"],
        },
        {
            "id": "us-cpi-surprise",
            "market": "us",
            "context": (
                "US CPI came in at 3.5% — hotter than the 3.1% forecast. Core CPI (excluding food and energy) "
                "was 3.8% vs 3.6% expected. The 10-year Treasury yield jumped from 4.3% to 4.6%. "
                "The S&P 500 fell 1.2% on the day."
            ),
            "question": "Why did Treasury yields rise sharply on the hotter-than-expected CPI print?",
            "options": [
                "Higher inflation means the government needs to borrow more money",
                "Hotter inflation reduces Fed cut expectations — investors demand higher yields to hold bonds in a high-rate environment",
                "Treasury yields always rise when stock prices fall",
                "The CPI data was released during market hours, creating volatility",
            ],
            "correct": 1,
            "explanation_short": (
                "Hot CPI = Fed will likely keep rates higher for longer (or hike again). "
                "Existing bonds with lower yields become less attractive — investors sell them, "
                "pushing prices down and yields up. Rate cut expectations for the year got pushed back."
            ),
            "difficulty": 3,
            "tags": ["cpi", "fed", "bonds", "yields"],
        },
    ],
    "eu": [
        {
            "id": "eu-ecb-cut",
            "market": "eu",
            "context": (
                "The ECB cut rates by 25bps — its first rate cut in 5 years — as eurozone inflation "
                "returned to 2.1%, near its 2% target. President Lagarde signalled the bank remains "
                "'data dependent' and did not commit to further cuts. The EUR/USD fell 0.6%."
            ),
            "question": "The euro weakened despite the ECB cutting rates. Why does a rate cut typically weaken a currency?",
            "options": [
                "Lower rates reduce the return on euro-denominated assets, making them less attractive to foreign investors",
                "Rate cuts always cause currencies to weaken — it is a law of economics",
                "The ECB's rate cut reduced confidence in the European economy",
                "Foreign investors prefer countries with higher inflation",
            ],
            "correct": 0,
            "explanation_short": (
                "Higher interest rates attract foreign capital seeking better returns — boosting a currency. "
                "Lower rates reduce this incentive. When the ECB cuts, euro deposits and bonds yield less, "
                "so investors move capital to higher-yielding currencies like the dollar."
            ),
            "difficulty": 2,
            "tags": ["ecb", "currency", "euro"],
        },
        {
            "id": "eu-dax-record",
            "market": "eu",
            "context": (
                "The DAX hit an all-time high of 19,200 despite Germany's economy being in recession "
                "(GDP contracted 0.3% in Q1). German exports rose 4.2% driven by auto and industrial sectors."
            ),
            "question": "How can the DAX hit a record high while Germany is technically in recession?",
            "options": [
                "The DAX index is wrong — it doesn't track German companies",
                "DAX companies generate most revenue globally, not domestically — export strength matters more than domestic GDP",
                "A recession always follows an all-time high by 6 months",
                "The DAX rose because investors expect the recession to end immediately",
            ],
            "correct": 1,
            "explanation_short": (
                "The DAX represents Germany's largest exporters — Volkswagen, BASF, Siemens, SAP. "
                "These companies earn the majority of their revenue outside Germany. "
                "Strong global demand for German industrial and auto exports boosts their profits even when domestic Germany is weak."
            ),
            "difficulty": 3,
            "tags": ["dax", "germany", "exports"],
        },
    ],
}


class AnswerSubmission(BaseModel):
    selected_index: int
    user_level: int = 1
    market: str = "india"


@router.get("/daily")
def get_daily_scenario(market: str = "india"):
    """Return a daily scenario for the given market, rotated by day of week."""
    from datetime import date

    scenarios = _DAILY_SCENARIOS.get(market, _DAILY_SCENARIOS["india"])
    day_index = date.today().toordinal() % len(scenarios)
    return {"market": market, "scenario": scenarios[day_index]}


@router.post("/{scenario_id}/answer")
async def submit_scenario_answer(scenario_id: str, body: AnswerSubmission):
    """Submit an answer to a scenario. Returns correctness + explanation."""
    # Find the scenario across all markets
    scenario = None
    for scenarios in _DAILY_SCENARIOS.values():
        for s in scenarios:
            if s["id"] == scenario_id:
                scenario = s
                break
        if scenario:
            break

    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")

    correct = body.selected_index == scenario["correct"]
    explanation = scenario["explanation_short"]
    claude_explanation = None

    if not correct:
        try:
            from services.claude_service import explain_wrong_answer
            claude_explanation = await explain_wrong_answer(
                question=scenario["question"],
                user_answer=scenario["options"][body.selected_index],
                correct_answer=scenario["options"][scenario["correct"]],
                short_explanation=explanation,
                user_level=body.user_level,
                market=body.market,
            )
        except Exception:
            claude_explanation = explanation

    return {
        "correct": correct,
        "correct_index": scenario["correct"],
        "explanation_short": explanation,
        "media_literacy_note": scenario.get("media_literacy_note"),
        "claude_explanation": claude_explanation,
    }
