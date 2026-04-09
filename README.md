# IdeaForge — Reddit-Powered Product Idea Generator

SaaS MVP that scans Reddit for user pain points and uses AI to generate scored product ideas for aspiring founders.

## How it works

1. **Collect signals** — scans popular subreddits where users share problems and frustrations
2. **Extract insights** — AI analyzes posts to identify pain points, frequency, and target audiences
3. **Generate ideas** — produces product concepts with elevator pitches and category tags
4. **Score viability** — rates each idea 0-100 across four dimensions: pain intensity, willingness to pay, competition, and market size
5. **Deliver results** — browse a scored feed with category filters, or subscribe to email notifications

## Tech Stack

- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Auth & DB:** Supabase (Auth + Postgres + Row Level Security)
- **AI:** Anthropic, Groq, or Gemini via `LLM_PROVIDER` — signal extraction + idea generation + scoring
- **Email:** Resend — subscription notifications with unsubscribe support
- **Validation:** Zod — runtime validation of LLM responses

## Getting Started

### Prerequisites
- Node.js 22+ and pnpm
- Supabase account (free plan)
- Anthropic API key
- Resend API key (free plan)

### Setup

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/reddit-idea-generator.git
cd reddit-idea-generator

# Install dependencies
pnpm install

# Environment variables
cp .env.example .env.local
# Fill in your keys — see Environment Variables below

# Setup database
# Copy contents of supabase/migrations/001_init.sql
# Paste into Supabase Dashboard → SQL Editor → Run

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create `.env.local` with:

```env
# Supabase (from Settings → API in Supabase Dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# LLM provider selection
LLM_PROVIDER=anthropic

# Anthropic (from console.anthropic.com)
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-4-20250514

# Groq (from console.groq.com)
GROQ_API_KEY=gsk_...
GROQ_MODEL=meta-llama/llama-4-scout-17b-16e-instruct

# Gemini (from aistudio.google.com)
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.0-flash

# Resend (from resend.com/api-keys)
RESEND_API_KEY=re_...

# Reddit data source (mock = use mock data, api = real Reddit API)
REDDIT_DATA_SOURCE=mock
```

Default models if env vars are omitted:

- `ANTHROPIC_MODEL=claude-sonnet-4-20250514`
- `GROQ_MODEL=meta-llama/llama-4-scout-17b-16e-instruct`
- `GEMINI_MODEL=gemini-2.0-flash`

## Features

- [ ] Landing page with product description and CTA
- [ ] Auth: registration, login, logout (Supabase Auth)
- [ ] Ideas feed with category filtering and score visualization
- [ ] AI-powered idea generation from Reddit posts (Claude API)
- [ ] Viability scoring with 4-component breakdown (0-100)
- [ ] Email subscriptions with category preferences
- [ ] Unsubscribe via email link or settings page

## Project Structure

```
src/
├── app/            # Pages, layouts, API routes (Next.js App Router)
├── components/     # UI primitives and feature components
├── lib/            # Business logic (Supabase, LLM, email, Reddit)
├── config/         # Constants, categories, LLM config
├── hooks/          # React hooks for data fetching
└── data/           # Mock Reddit data
```

See `docs/PROJECT_STRUCTURE.md` for full file tree.

## AI Development

This project was built using **Claude Code** (Anthropic's CLI development tool). Key AI artifacts:

- 
- `PROMPTS.md` — documented key prompts with context and results
- `CLAUDE.md` — project context file for Claude Code
- `.claude/skills/` — reusable skill definitions (API, UI, LLM patterns)

## License

MIT
