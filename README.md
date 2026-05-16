# Mastr

Gamified learning platform. Duolingo's UI and habit loop — applied to finance and coding.

Mobile-first (Expo Go, install via QR). Two tracks: **Tradr** (markets) and **Codr** (DSA/interviews).

---

## What is this?

Mastr is a gamified learning platform for the 18–26 year old who finds both investing and technical interviews intimidating. Pick your track on onboarding — or do both and become a quant.

**📈 Tradr** — stock market education, multi-market (India 🇮🇳 / EU 🇪🇺 / US 🇺🇸)
- Structured lesson paths (beginner → advanced, unit-by-unit unlock)
- Live market data via yfinance (Nifty 50, DAX, S&P 500)
- Scenario engine — real recent events turned into coached questions
- Media literacy curriculum — Unit 3+ teaches users to read headlines critically
- AI explanations via Claude (wrong answers, headlines, deep dives)

**💻 Codr** — DSA patterns and coding interview prep (Python 🐍 / Java ☕)
- Arrays & Hashing, Two Pointers, Sliding Window, Stack/Queue, Binary Search, Trees
- Language-specific units (Pythonic patterns vs Java data structures)
- Fill-in-the-blank code exercises, spot-the-bug, approach ordering
- Interview simulation scenarios

**Both tracks share:** Pip the mascot (bear cub → golden bull), XP, streaks, hearts, leagues, badges.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Mobile | Expo (React Native) + TypeScript |
| Navigation | Expo Router (file-based) |
| Animations | React Native Reanimated |
| State | Zustand |
| Backend | FastAPI (Python) |
| Database | Supabase (auth, progress, leaderboard) |
| AI | Claude API (`claude-sonnet-4-20250514`) |
| Market data | yfinance |
| News | NewsAPI / RSS |

---

## Setup

### Prerequisites
- Node.js 18+, Python 3.11+
- `npm install -g expo`
- Expo Go app on your phone
- Supabase account (free tier)
- Anthropic API key

### Run

```bash
git clone https://github.com/srivassi/mastr && cd mastr

# Frontend
npm install
cp .env.example .env.local
npx expo start    # scan QR with Expo Go

# Backend
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```

### Environment Variables

```bash
# .env.local (frontend)
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_BACKEND_URL=http://localhost:8000

# backend/.env
ANTHROPIC_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
ENVIRONMENT=development
```

---

## Project Structure

```
mastr/
├── app/                    # Expo Router screens
│   ├── (auth)/             # welcome, onboarding (track + market/language), login, signup
│   ├── (tabs)/             # Learn, Markets, Practice, League, Profile
│   ├── lesson/[id].tsx     # question-by-question lesson flow
│   └── scenario/[id].tsx
├── components/             # UI (lesson, path map, gamification, markets)
├── backend/                # FastAPI
│   ├── routers/            # lessons, scenarios, markets, news, users, leaderboard
│   ├── services/           # claude_service, market_service, sm2, scenario_builder
│   └── models/
├── content/                # Lesson JSON (source of truth)
│   ├── markets/            # shared, india, eu, us
│   └── code/               # unit_1–unit_5 shared DSA, language-specific units
├── lib/                    # curriculum.ts, lessonData.ts, supabase.ts
├── store/                  # Zustand (userStore — XP, streak, hearts, track, market)
├── constants/              # theme, markets, languages, pip
└── types/
```

---

> **Disclaimer:** Mastr is for educational purposes only. Nothing here constitutes financial advice.
