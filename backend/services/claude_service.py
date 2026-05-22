import os
import logging
import anthropic

logger = logging.getLogger(__name__)

_client = anthropic.AsyncAnthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
_MODEL  = "claude-sonnet-4-20250514"

_MARKET_CTX = {
    "india": "Indian stock market (NSE/BSE, SEBI regulation, RBI monetary policy)",
    "eu":    "European markets (ECB, ESMA regulation, euro-denominated)",
    "us":    "US markets (Fed, SEC regulation, dollar-denominated)",
}


async def explain_wrong_answer(
    question: str,
    user_answer: str,
    correct_answer: str,
    short_explanation: str,
    user_level: int,
    market: str,
) -> str:
    """Tradr track: explain a wrong answer in 60–75 words with market context."""
    market_ctx = _MARKET_CTX.get(market, _MARKET_CTX["india"])
    prompt = f"""You are Pip, Mastr's friendly financial coach. A user just got a question wrong.

Market context: {market_ctx}
Question: {question}
They answered: {user_answer}
Correct answer: {correct_answer}
Hint: {short_explanation}
User level: {user_level}/50

Explain why they were wrong in 60–75 words. Be warm and encouraging, never condescending.
Use a real-world analogy relevant to their market where possible.
End with one short sentence of encouragement.
Do not start with "I" or "As Pip". Jump straight into the explanation."""

    response = await _client.messages.create(
        model=_MODEL,
        max_tokens=200,
        timeout=10.0,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.content[0].text  # type: ignore[union-attr]


async def explain_code_wrong_answer(
    question: str,
    user_answer: str,
    correct_answer: str,
    short_explanation: str,
    user_level: int,
    question_type: str = "mcq",
) -> str:
    """Codr track: explain a wrong code/DSA answer in 60–75 words."""
    prompt = f"""You are Pip, a friendly coding interview coach on Mastr.

Question type: {question_type}
Question: {question}
They answered: {user_answer}
Correct answer: {correct_answer}
Hint: {short_explanation}
User level: {user_level}/50

Explain why they were wrong in 60–75 words. Be encouraging.
If it's a fill-in-the-blank, explain WHY that specific token is correct — the mechanism, not just the name.
If it's a bug, explain what would actually happen at runtime with that bug present.
End with one sentence of encouragement.
Do not start with "I" or "As Pip"."""

    response = await _client.messages.create(
        model=_MODEL,
        max_tokens=200,
        timeout=10.0,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.content[0].text  # type: ignore[union-attr]


async def explain_headline(
    headline: str,
    body_snippet: str,
    market: str,
    user_level: int,
) -> str:
    """Markets tab: explain a financial headline in plain English."""
    prompt = f"""You are Pip, a friendly financial educator on Mastr.

Market: {market}
User level: {user_level}/50
Headline: "{headline}"
Context: {body_snippet}

Explain what this means for someone learning about markets.
100–120 words. Plain English — define jargon inline.
Structure: [what happened] → [why it matters] → [what to watch next].
End with: "What to watch: [one specific follow-up]".
Do not start with "I" or "As Pip"."""

    response = await _client.messages.create(
        model=_MODEL,
        max_tokens=250,
        timeout=10.0,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.content[0].text  # type: ignore[union-attr]


async def generate_live_scenario(
    market: str,
    recent_event: str,
    lesson_tags: list[str],
    difficulty: int,
) -> dict:
    """Weekly cron: generate a scenario JSON from a real market event."""
    import json as _json
    prompt = f"""Create a Mastr scenario question based on this real market event.
Market: {market} | Event context: {recent_event}
Tags: {', '.join(lesson_tags)} | Difficulty: {difficulty}/5

Return valid JSON only — no markdown fences, no extra text:
{{
  "context": "2-3 sentences setting the scene with specific numbers from the event",
  "question": "A reasoning question — why did this happen / what does it mean / what would you do",
  "options": ["option A", "option B", "option C", "option D"],
  "correct": 0,
  "explanation_short": "1-2 sentences. Explain the mechanism, not just the answer.",
  "media_literacy_note": "Deconstruct how this event is typically framed in financial media. Leave as empty string if not applicable.",
  "tags": ["tag1", "tag2"]
}}"""

    response = await _client.messages.create(
        model=_MODEL,
        max_tokens=700,
        timeout=30.0,
        messages=[{"role": "user", "content": prompt}],
    )
    raw = response.content[0].text.strip()  # type: ignore[union-attr]
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return _json.loads(raw.strip())


async def explain_tech_headline(
    headline: str,
    body_snippet: str,
    user_level: int,
) -> str:
    """Codr track: TLDR a tech/AI headline for a CS student audience."""
    prompt = f"""You are Pip, a friendly coding and tech educator on Mastr.

User level: {user_level}/50
Headline: "{headline}"
Context: {body_snippet}

Explain what this means for a CS student or early-career developer.
80–100 words. Plain English — define any jargon inline.
Structure: [what happened] → [why it matters for developers/hiring] → [what to watch].
End with: "What to watch: [one specific follow-up]".
Do not start with "I" or "As Pip"."""

    response = await _client.messages.create(
        model=_MODEL,
        max_tokens=200,
        timeout=10.0,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.content[0].text  # type: ignore[union-attr]


async def generate_question_variant(
    track: str,
    topic: str,
    market_context: str,
    difficulty: int,
) -> dict:
    """Generate a single MCQ question variant using real context. Used by question_builder."""
    import json as _json

    if track == "tradr":
        prompt = f"""Create a financial education MCQ question for Mastr.
Topic: {topic}
Real market context (use specific numbers from this): {market_context}
Difficulty: {difficulty}/5

The question MUST reference real data from the context above — not generic hypotheticals.
Return valid JSON only, no markdown:
{{
  "question": "question text referencing real numbers/events from the context",
  "options": ["option A", "option B", "option C", "option D"],
  "correct": 0,
  "explanation_short": "1-2 sentences. Explain the mechanism.",
  "tags": ["tag1", "tag2"]
}}"""
    else:
        prompt = f"""Create a DSA/coding MCQ question for Mastr Codr track.
Pattern/Topic: {topic}
Difficulty: {difficulty}/5

Create a FRESH variant with different examples than the canonical ones (no [1,2,3,4,5], no standard textbook examples).
Return valid JSON only, no markdown:
{{
  "question": "question text with a concrete fresh example",
  "options": ["option A", "option B", "option C", "option D"],
  "correct": 0,
  "explanation_short": "1-2 sentences. Explain the mechanism, not just the answer.",
  "tags": ["tag1", "tag2"]
}}"""

    response = await _client.messages.create(
        model=_MODEL,
        max_tokens=500,
        timeout=20.0,
        messages=[{"role": "user", "content": prompt}],
    )
    raw = response.content[0].text.strip()  # type: ignore[union-attr]
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return _json.loads(raw.strip())


async def deep_dive(topic: str, context: str, market: str, user_level: int) -> str:
    """User-initiated deep dive on a topic after a lesson question."""
    prompt = f"""You are a financial educator on Mastr.
Market: {market} | User level: {user_level}/50
Topic: {topic}
What the user just learned: {context}

130–160 words. Use a real historical example from {market} markets if possible.
Make it feel like insight, not a textbook. Write in prose, no bullet points."""

    response = await _client.messages.create(
        model=_MODEL,
        max_tokens=300,
        timeout=10.0,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.content[0].text  # type: ignore[union-attr]
