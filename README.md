# IdeaForge

AI-powered Reddit pain point scanner that generates scored startup ideas.

## What is this?

IdeaForge is a SaaS MVP that scans Reddit for user pain points and uses AI to generate scored product ideas. It's built for indie hackers and product teams who want data-driven startup inspiration without manually trawling through subreddits. Each idea is scored 0-100 across four dimensions: pain intensity, willingness to pay, competition gap, and total addressable market.

## 🚀 Live Demo

**[https://reddit-idea-forge.vercel.app](https://reddit-idea-forge.vercel.app)**

> After registration, confirm your email — you'll be redirected to the dashboard automatically.

## Tech Stack

- **Next.js 14+** (App Router) + **TypeScript**
- **Tailwind CSS** + custom design tokens
- **Supabase** (Auth + Postgres + RLS)
- **Multi-provider LLM** — Google Gemini (active), Anthropic, Groq supported
- **Resend** — email notifications
- **Zod** — validation
- **GitHub Actions** — cron pipeline (v2)

## Prerequisites

- Node.js 22+
- pnpm (`npm install -g pnpm`)
- Supabase account (free tier works)
- LLM API key — Gemini (default), Anthropic, or Groq
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

Copy the contents of [`supabase/setup.sql`](supabase/setup.sql) and paste into **Supabase Dashboard → SQL Editor → Run**.

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
├── lib/           # Business logic — supabase, llm, email, reddit, pipeline
├── config/        # Constants, prompt templates, categories
└── hooks/         # Client-side React hooks
```

Key principle: `app/` handles routing, `components/` handles UI, `lib/` handles logic. Never mix.

See `docs/PROJECT_STRUCTURE.md` for the full file tree with explanations.

## Key Features

- **Shared idea feed** — AI-generated SaaS ideas from Reddit, browsable by all users (v2 architecture)
- **8 categories** (DevTools, SaaS, Productivity, Finance, Health, Education, eCommerce, AI) mapped to ~30 subreddits
- **Dual scoring** — AI score (0-100) + Community score (upvotes/downvotes)
- **Real Reddit data** via public JSON API (no API key needed), with mock fallback
- **Multi-provider LLM** — Google Gemini (active), Anthropic Claude, Groq
- **Design system** — light/dark theme, CSS tokens, mobile-first responsive
- **Auto-redirect** — authenticated users skip the landing page and go straight to the dashboard
- **Email subscription** with category preferences
- **Unsubscribe** via token link (no auth required) or settings page

## Data Source

IdeaForge fetches real posts from Reddit's public JSON API (`reddit.com/r/{sub}/hot.json`) — no API key or OAuth token required. 8 categories are mapped to ~30 subreddits in `src/config/categories.ts` and `src/config/reddit.ts`, pulling hot posts with a 200ms rate-limit delay between requests. Fetching runs on a cron schedule (every 6 hours via GitHub Actions) with category rotation — 3 categories per run.

## Development Setup

For feature development and DB migration testing, we use a **separate dev Supabase project** so changes never touch production data.

**Quick start:**

```bash
# 1. Copy env template and fill in your values
cp .env.example .env.local

# 2. For dev Supabase, also create dev overrides
cp .env.development.example .env.development.local

# 3. Run migrations on dev Supabase (see docs)

pnpm dev
```

See **[docs/DEV_ENVIRONMENT.md](docs/DEV_ENVIRONMENT.md)** for the full guide: creating a dev Supabase project, configuring Vercel preview deployments, and the branching strategy.

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
