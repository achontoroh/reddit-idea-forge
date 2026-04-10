# IdeaForge

AI-powered Reddit pain point scanner that generates scored startup ideas.

## What is this?

IdeaForge is a SaaS MVP that scans Reddit for user pain points and uses AI to generate scored product ideas. It's built for indie hackers and product teams who want data-driven startup inspiration without manually trawling through subreddits. Each idea is scored 0-100 across four dimensions: pain intensity, willingness to pay, competition gap, and total addressable market.

## 🚀 Live Demo

**[https://reddit-idea-forge.vercel.app](https://reddit-idea-forge.vercel.app)**

> After registration, confirm your email and log in manually to access the dashboard.

## Tech Stack

- **Next.js 14+** (App Router) + **TypeScript**
- **Tailwind CSS**
- **Supabase** (Auth + Postgres + RLS)
- **Anthropic Claude API** (claude-sonnet) — idea generation + scoring
- **Resend** — email notifications
- **Zod** — validation

## Prerequisites

- Node.js 22+
- pnpm (`npm install -g pnpm`)
- Supabase account (free tier works)
- Anthropic API key
- Resend API key (free tier for dev)

## Getting Started

### 1. Clone & install

```bash
git clone <repo-url>
cd reddit-idea-forge
pnpm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local` with secrets and environment-specific URLs:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL (Settings > API) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key (Settings > API) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key — server only, never expose to client |
| `ANTHROPIC_API_KEY` | If using Anthropic | From console.anthropic.com |
| `GROQ_API_KEY` | If using Groq | From console.groq.com |
| `GEMINI_API_KEY` | If using Gemini | From ai.google.dev |
| `RESEND_API_KEY` | Yes | From resend.com |
| `RESEND_FROM_EMAIL` | No | Sender email shown to recipients. Falls back to `onboarding@resend.dev` in dev |
| `CRON_SECRET` | No | Shared secret for authenticating cron-triggered email sends |
| `NEXT_PUBLIC_APP_URL` | No | App base URL, defaults to `http://localhost:3000` |

### Configuration

Non-secret configuration (LLM provider, model names, Reddit data source, email limits) lives in `src/config/app.ts` and can be changed directly in code. No env vars needed for these — just edit the config object and redeploy.

### 3. Supabase setup

Run the SQL from `docs/DATABASE_SCHEMA.md` in the Supabase SQL Editor. This creates:

- `profiles` — user profiles (auto-created on signup via trigger)
- `ideas` — generated product ideas with scoring
- `subscriptions` — email notification preferences
- `email_logs` — sent email tracking
- Row Level Security policies for all tables

### 4. Run locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Architecture Overview

```
src/
├── app/           # Next.js App Router — pages, layouts, API routes
├── components/    # UI primitives (ui/) and feature composites (features/)
├── lib/           # Business logic — supabase, llm, email, reddit integrations
├── config/        # Constants, prompt templates, categories
├── hooks/         # Client-side React hooks
└── data/          # Static mock data
```

Key principle: `app/` handles routing, `components/` handles UI, `lib/` handles logic. Never mix.

See `docs/PROJECT_STRUCTURE.md` for the full file tree with explanations.

## Key Features

- **Mock Reddit data source** — works out of the box, switchable to real API via env var
- **LLM-powered idea generation** with 0-100 scoring across four dimensions (pain intensity, willingness to pay, competition gap, TAM)
- **Multi-provider LLM support** — Anthropic Claude, Groq, or Google Gemini
- **Manual "Generate" trigger** from dashboard (cron-ready for future automation)
- **Email subscription** with category preferences
- **Unsubscribe** via token link (no auth required) or settings page

## Data Source

By default, IdeaForge uses mock Reddit data so you can run the full pipeline without Reddit API credentials. To switch to real Reddit data, set `dataSource: 'api'` in `src/config/app.ts`.

## Deployment

Deployed on [Vercel](https://vercel.com). To deploy your own instance:

1. Fork this repo
2. Import to Vercel — Next.js is auto-detected
3. Add all environment variables from `.env.example`
4. Set `NEXT_PUBLIC_APP_URL` to your Vercel URL
5. In Supabase → Authentication → URL Configuration:
   - Set **Site URL** to your Vercel URL
   - Add your Vercel URL to **Redirect URLs**

No other configuration needed.

## License

MIT
