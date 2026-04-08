# Task Specification — IdeaForge MVP

> Adapted from original test task. Differences from original marked with ✏️.

## Goal
Build a minimally viable SaaS that helps aspiring founders discover product ideas. The service tracks popular subreddits where users discuss their problems and generates AI-scored product ideas based on discovered insights.

## MVP Flow
1. **Data collection** — service fetches/receives a list of popular subreddits where people share problems
   - ✏️ Using mock data (JSON) for MVP. Real Reddit API available as optional IF-42
2. **Signal extraction** — from fresh posts/comments, extract problem statements, pain triggers, frequency/engagement
   - ✏️ Real LLM API call (Anthropic Claude Sonnet), not mocked
3. **Idea generation** — LLM generates short product ideas (name, elevator pitch, target audience, pain being solved)
   - ✏️ Real LLM API call with Zod-validated structured output
4. **Viability scoring** — LLM gives numeric/text scoring (pain, willingness to pay, competition, TAM — simplified)
   - ✏️ 0-100 total score with 4-component breakdown (each 0-25)
5. **Delivery** — user sees a feed of fresh recommendations, can subscribe to email notifications with category filter
   - ✏️ Manual trigger via "Generate" button. Email via Resend API. Cron-ready for optional IF-52

## Functional Requirements

### Landing page
- One page with product description
- Inspired by Tosnos SaaS Landing (Dribbble) — clean, simple layout
- Hero block, value proposition, CTA "Get started"

### Authentication
- Registration, login, logout
- ✏️ Supabase Auth (email + password)

### Ideas feed
- List of fresh product ideas with category filter (devtools, health, education, finance, productivity)
- Fields per idea:
  - Idea title
  - Short pitch (1-2 sentences)
  - Key pain point / insight
  - Source (subreddit / link)
  - Score (0-100)
  - "New" badge

### Email subscriptions
- Subscription form with category filter
- ✏️ Resend as email provider
- Real sending not required for testing, but API client and integration code must be correct
- Keys/config via environment variables (.env)

### Unsubscribe
- Correct unsubscribe via link in email or from profile/settings

### LLM integration
- ✏️ Anthropic Claude API (Sonnet model)
- Prompts and settings in config (externalized, not hardcoded)
- Typed responses (Zod validation)

## Tech Stack
- GitHub (repository with commit history)
- React + Node.js + TypeScript → ✏️ Next.js 14+ (App Router)
- Supabase (Auth + Postgres)
- LLM → ✏️ Anthropic Claude API
- Email SaaS → ✏️ Resend
- ✏️ AI development tool: **Claude Code CLI** (replaces Cursor)

## Required Artifacts

### GitHub repository (public or accessible via link)

### Required AI artifacts:
- ✏️ `CLAUDE.md` in project root (our AI config — replaces Cursor's rules.md since we use Claude Code)
- `PROMPTS.md` in project root — 5-10 key prompts with brief context and result
- Full AI interaction history export

### README.md with:
- How to run locally

## Prioritization
Task scope: maximum useful functionality within ~8 hours.
Feature prioritization is part of the evaluation.

### Our priority order:
1. Auth + Supabase schema (foundation)
2. LLM pipeline with real API calls (core differentiator)
3. Dashboard with ideas feed and scoring (main UI)
4. Email subscriptions + Resend (feature completeness)
5. Landing page (presentation)
6. Documentation + delivery
7. Optional: Vercel deploy, real Reddit API, cron jobs

## What to Submit
- Link to GitHub repository
- Full export/screenshots of AI interaction history
- README.md
