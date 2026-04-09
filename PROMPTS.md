# PROMPTS.md — Key AI Prompts Log

This document captures the most significant prompts used during development with Claude Code. Each entry includes the context, the prompt, and the outcome.

### Prompt 2: Supabase Schema + Migration
**Ticket:** IF-16
**Context:** Creating database tables, RLS policies, and Supabase client helpers.
**Prompt:**
```
Install @supabase/supabase-js and @supabase/ssr. Create migration SQL (001_init.sql) with all tables
(profiles, ideas, subscriptions, email_logs), indexes, RLS policies, and auto-profile trigger from
DATABASE_SCHEMA.md. Create Supabase client helpers: browser client (client.ts), server client with
cookie handling (server.ts), and middleware session refresh (middleware.ts). Create TypeScript types:
Database type with full public schema, Idea/ScoreBreakdown interfaces, Subscription interface. Create
categories config as single source of truth. Verify with pnpm build.
```
**Result:** All files created and build passes. Migration covers 4 tables with RLS. Three Supabase client
helpers follow @supabase/ssr patterns (browser, server with cookies(), middleware with NextRequest).
Database type matches schema exactly. Categories exported as const tuple with derived Category type.

---

### Prompt 3: Base UI Components
**Ticket:** IF-44
**Context:** Phase 2 Foundation — creating the base UI component library that all feature components will build on. Need consistent styling with Tailwind, proper TypeScript types, and accessibility.
**Prompt:**
```
Read docs/CONVENTIONS.md and docs/PROJECT_STRUCTURE.md first.
Create the base UI component library in src/components/ui/:
1. button.tsx — variant (primary/secondary/ghost/danger), size, loading state with spinner
2. input.tsx — label, error message, accessible htmlFor/id linking
3. card.tsx — white rounded shadow container with padding sizes
4. badge.tsx — pill-shaped label with color variants
5. score-badge.tsx — color-coded score circle (red <40, yellow 40-69, green 70+)
6. spinner.tsx — animated SVG loading spinner
7. index.ts — barrel export
All TypeScript with proper prop types, Tailwind only, 'use client' where needed.
Run pnpm build to verify.
```
**Result:** Created 7 files in src/components/ui/. Button supports 4 variants and loading state
with integrated Spinner. Input uses useId() for accessible label linking with aria-invalid/describedby
for errors. ScoreBadge uses green/amber/red color coding matching CLAUDE.md score thresholds.
All components follow FC<Props> pattern from CONVENTIONS.md. Build passes cleanly.

---

### Prompt 4: Auth Implementation
**Ticket:** IF-18
**Context:** Phase 2 Foundation — implementing Supabase Auth with protected routes. Need middleware to guard /dashboard/*, auth pages with login/register forms, OAuth callback handler, and logout functionality.
**Prompt:**
```
Implement Supabase Auth with protected routes:
1. src/middleware.ts — protect /dashboard/*, redirect authenticated users from /login and /register
2. src/app/(auth)/layout.tsx — centered card layout for auth pages
3. src/app/(auth)/login/page.tsx and register/page.tsx
4. LoginForm, RegisterForm (email+password, Supabase Auth SDK), LogoutButton
5. src/app/auth/callback/route.ts — OAuth callback, exchange code for session
Verify pnpm build passes and /dashboard redirects to /login when unauthenticated.
```
**Result:** Created 8 files. Updated lib/supabase/middleware.ts to return user alongside response
for proper auth checks (not cookie-sniffing). Root middleware.ts uses updateSession() result to
guard /dashboard/* and redirect authenticated users from auth pages. Auth layout uses Card component
for centered form. LoginForm calls signInWithPassword, RegisterForm calls signUp with optional
full_name metadata and shows "check your email" success state. OAuth callback exchanges code for
session via createClient(). Build passes, dev server verified: /login 200, /register 200,
/dashboard 307→/login.

---

### Prompt 5: Mock Reddit Data for LLM Pipeline
**Ticket:** IF-22
**Context:** Phase 3 — creating realistic mock Reddit posts that feed the real LLM pipeline. The app uses REDDIT_DATA_SOURCE=mock to bypass Reddit API during development while still testing the full idea generation flow.
**Prompt:**
```
Create src/data/reddit-mock.ts with mock Reddit posts that feed the REAL LLM pipeline.
Export interface RedditPost with fields: id, subreddit, title, body, score, num_comments,
url, created_utc, category. Category type from config/categories.ts. Create 15-20 posts,
minimum 3 per category, with specific believable pain points (not generic). Export typed
array as mockRedditPosts and helper getPostsByCategory(category).
```
**Result:** Created src/data/reddit-mock.ts with 18 posts (4 devtools, 3 health, 4 education,
3 finance, 4 productivity). Each post has a specific, realistic pain point — e.g. debugging
silent middleware, CGM-meal correlation gaps, tutorial hell in learning. Used Category type
from config/categories.ts for type safety. Exported RedditPost interface, mockRedditPosts
array, and getPostsByCategory helper. TypeScript compiles clean.

---

### Prompt 6: LLM Pipeline — Signal Extraction + Idea Generation
**Ticket:** IF-22
**Context:** Phase 3 — building the complete LLM pipeline with real Anthropic API calls. Two-step architecture: extract signals from Reddit posts, then generate scored product ideas. All responses validated with Zod schemas.
**Prompt:**
```
Build the complete LLM pipeline for IdeaForge. All Anthropic API calls must be REAL (no mocks).
Create: src/lib/anthropic.ts (client singleton), src/lib/llm/prompts.ts (externalized prompts),
src/lib/llm/schemas.ts (Zod validation), src/lib/services/idea-generator.ts (signal extraction
+ idea generation), src/lib/services/idea-scorer.ts (independent scoring with 4 dimensions),
src/app/api/ideas/generate/route.ts (POST endpoint, auth required, saves to Supabase).
Use claude-sonnet-4-20250514, validate all LLM responses with Zod, wrap in try/catch.
```
**Result:** Created 8 files: config/llm.ts (model config), lib/anthropic.ts (SDK client with
callLLM + callLLMWithRetry), lib/llm/prompts.ts (signal extraction + idea generation system
prompts with typed user prompt builders), lib/llm/schemas.ts (Zod schemas for Signal,
GeneratedIdea, ScoreBreakdown), lib/llm/parse-response.ts (generic Zod-validated JSON parser
with markdown fence stripping), lib/services/idea-generator.ts (two-step pipeline: signals →
ideas with score validation), lib/services/idea-scorer.ts (independent 4-dimension scoring
with reasoning), api/ideas/generate/route.ts (auth-protected POST, uses service-role client
for DB insert). Also created lib/supabase/service.ts for service-role operations. Build passes.

---

### Prompt 7: Provider-Agnostic LLM Wrapper
**Ticket:** IF-53
**Context:** Phase 3 — decoupling the LLM pipeline from Anthropic so we can switch between Anthropic, Groq, and Gemini via a single `LLM_PROVIDER` env variable. This enables cost optimization and fallback strategies.
**Prompt:**
```
Implement a provider-agnostic LLM wrapper (IF-53). Create LLMProvider interface,
three provider implementations (Anthropic, Groq, Gemini), a factory with caching,
and a consistent LLMError class. Refactor idea-generator.ts and idea-scorer.ts to
use getLLMProvider() instead of direct Anthropic client. Add LLM_PROVIDER, GROQ_API_KEY,
GEMINI_API_KEY to .env.local. Create .env.example.
```
**Result:** Created 6 new files: `lib/llm/provider.ts` (interface + LLMError), `lib/llm/providers/anthropic.ts`,
`lib/llm/providers/groq.ts`, `lib/llm/providers/gemini.ts`, `lib/llm/factory.ts` (cached singleton with
startup log), `lib/llm/index.ts` (barrel export). Refactored `idea-generator.ts` and `idea-scorer.ts` to
use `getLLMProvider()`. Created `.env.example`. Installed `groq-sdk` and `@google/generative-ai`.
Build passes. Setting `LLM_PROVIDER=groq` or `gemini` switches the entire pipeline with no code changes.

---

### Prompt 8: Dashboard — Ideas Feed
**Ticket:** IF-25
**Context:** Building the main dashboard with idea cards, category filter, score visualization.
**Prompt:**
```
[TO BE FILLED]
```
**Result:** [TO BE FILLED]

---

### Prompt 8: Email Integration (Resend)
**Ticket:** IF-27, IF-28
**Context:** Email subscription form, Resend SDK integration, HTML email template.
**Prompt:**
```
[TO BE FILLED]
```
**Result:** [TO BE FILLED]

---

### Prompt 9: Landing Page
**Ticket:** IF-32
**Context:** Building the public landing page with hero, value prop, and CTA.
**Prompt:**
```
[TO BE FILLED]
```
**Result:** [TO BE FILLED]

---

### Prompt 10: Bug Fix / Iteration
**Ticket:** [TO BE FILLED]
**Context:** [TO BE FILLED — document an interesting debugging or iteration session]
**Prompt:**
```
[TO BE FILLED]
```
**Result:** [TO BE FILLED]

---

### Prompt 11: Final Review
**Ticket:** IF-40
**Context:** [TO BE FILLED — final polish, cleanup, review prompt]
**Prompt:**
```
[TO BE FILLED]
```
**Result:** [TO BE FILLED]
