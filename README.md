# Mastr

> Master finance. Ace interviews.

Duolingo-style gamified learning with two tracks — **Tradr** (stock markets, financial literacy, live market data) and **Codr** (DSA patterns, system design, coding interview prep). Built with Expo + FastAPI + Claude AI.

---

## Download

### Android APK (no Expo Go needed)

Download and install directly on any Android device:

[**Download APK**](https://expo.dev/artifacts/eas/i14rNS6Fmn8QRnXjg7poMs.apk)

---

## What's inside

| Track | What you learn |
|---|---|
| 📈 Tradr | Stocks, macro, central banks, reading markets — India 🇮🇳 / EU 🇪🇺 / US 🇺🇸 |
| 💻 Codr | Two pointers, sliding window, trees, graphs, system design, REST APIs |

**Gamification:** XP · Streaks · Hearts · Leagues (Bronze → Obsidian) · Pip the mascot (bear cub → golden bull)

**Live data:** yfinance indices + sector heatmap, auto-refreshing every 5 min during market hours. AI-explained headlines via Claude.

---

## Tech stack

| Layer | Tech |
|---|---|
| Mobile | Expo (React Native) + TypeScript |
| Navigation | Expo Router (file-based) |
| State | Zustand |
| Backend | FastAPI (Python) |
| Database | Supabase (auth, progress, leaderboard) |
| AI | Claude API (`claude-sonnet-4-20250514`) |
| Market data | yfinance |
| News | RSS feeds + GNews/NewsAPI |

---

## Local development

### Prerequisites
- Node.js 18+, Python 3.11+
- Expo Go on your phone
- Supabase project (free tier)
- Anthropic API key

### Frontend

```bash
git clone https://github.com/srivassi/mastr && cd mastr
npm install
cp .env.example .env.local   # fill in Supabase keys
npx expo start               # scan QR with Expo Go
```

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
cp .env.example .env         # fill in keys
python -m uvicorn main:app --reload --host 0.0.0.0
```

### Environment variables

```bash
# .env.local (frontend)
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_BACKEND_URL=http://localhost:8000   # omit to use production backend

# .env (backend)
ANTHROPIC_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
ENVIRONMENT=development
```

---

## Deployment

| Service | Platform | Notes |
|---|---|---|
| Backend | [Render](https://render.com) | Auto-deploys from `main` via `render.yaml` |
| Frontend | Expo EAS | `eas update --branch production --message "..."` |

Live backend: `https://mastr-backend.onrender.com`

---

## Project structure

```
app/          Expo Router screens (auth, tabs, lesson, scenario)
components/   Reusable UI (pip/, lesson/, path/, markets/, gamification/)
backend/      FastAPI — routers/, services/, models/
lib/          Frontend utilities (supabase, backend URL, lesson data)
store/        Zustand state (userStore)
constants/    Theme, markets, pip stages
assets/pip/   Pip mascot PNGs (7 images, transparent background)
```

---

## Disclaimer

Mastr is for educational purposes only. Nothing in this app constitutes financial advice.
