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
**Context:** Phase 4 — building the main dashboard UI. Need Header, dashboard layout with auth guard, ideas feed with category filtering, score breakdown visualization, and generate button.
**Prompt:**
```
Build the main dashboard UI for IdeaForge (IF-25). Create: dashboard layout
with Header (logo + user email + logout), dashboard page (server component
fetching ideas from Supabase ordered by score/date), IdeaCard (title, category
badge, pitch, score breakdown bars, ScoreBadge, NEW badge, footer with pain
point + subreddit link), IdeaFeed (client component with category filter state),
CategoryFilter (color-coded chips for all/devtools/health/education/finance/
productivity), GenerateButton (POST /api/ideas/generate with loading + error).
Grid: 1 col mobile, 2 tablet, 3 desktop.
```
**Result:** Created 7 files: `components/layout/header.tsx` (brand + email + LogoutButton),
`app/dashboard/layout.tsx` (auth guard via Supabase getUser + redirect, Header + max-w-6xl container),
`app/dashboard/page.tsx` (server component fetching ideas ordered by score DESC, empty state),
`components/ideas/idea-card.tsx` (score breakdown with labeled bars 0-25, category badge colors,
NEW badge for <24h, pain_point + subreddit footer), `components/ideas/idea-feed.tsx` (client filter
state + grid layout), `components/ideas/category-filter.tsx` (color-coded active/outline chips),
`components/ideas/generate-button.tsx` (fetch with loading/error states + router.refresh).
Reused existing Button, Card, Badge, ScoreBadge components. Build passes cleanly.

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

### Prompt 10: Fix Ideas Not Scoped to User
**Ticket:** IF-55
**Context:** Ideas were visible to ALL users — no data isolation. The `ideas` table lacked a `user_id` column entirely, RLS policies allowed any authenticated user to read all ideas, and the generate route didn't associate ideas with the session user.
**Prompt:**
```
Fix data isolation so each user only sees their own ideas. Add user_id to ideas table,
set user_id from session in POST /api/ideas/generate, create GET /api/ideas with user_id
filtering + auth check, update dashboard query to filter by user_id, fix RLS policies
(SELECT/INSERT/DELETE scoped to auth.uid() = user_id). Update migration, Database type,
Idea interface. Output SQL for manual Supabase Dashboard execution.
```
**Result:** Added `user_id UUID NOT NULL REFERENCES profiles(id)` to ideas table in migration + Database type + Idea interface. Generate route now sets `user_id: user.id` on every insert. Created new GET /api/ideas/route.ts with auth check + `.eq('user_id', user.id)`. Dashboard page also filters by user_id for defense-in-depth. RLS policies changed from "any authenticated user can read" to three scoped policies (SELECT/INSERT/DELETE all check `auth.uid() = user_id`). Build passes cleanly.

---

### Prompt 11: Prevent Duplicate Ideas for Same Reddit Post
**Ticket:** IF-56
**Context:** Clicking "Generate Ideas" multiple times creates duplicate ideas from the same Reddit posts. Need deduplication before running LLM pipeline.
**Prompt:**
```
Prevent duplicate ideas for the same Reddit post (IF-56). Before running LLM generation,
query existing source_url values from the ideas table for the current user. Filter mock
Reddit posts — skip any post whose URL already has a matching idea in DB. If ALL posts
already processed, return { message: "All posts already analyzed", generated: 0 }. Also
fix insert to store the Reddit post URL in source_url (was null before) by mapping ideas
back to source posts via category:subreddit key. No new DB columns.
```
**Result:** Modified `src/app/api/ideas/generate/route.ts`: added dedup query before LLM call
(fetches existing source_url values for user via service role client, builds Set of processed
URLs, filters mockRedditPosts). Returns early with `{ message, generated: 0 }` when all posts
covered. Fixed insert to populate `source_url` with actual Reddit post URL by mapping
`category:subreddit` → post URL (each mock post has a unique subreddit). Build passes cleanly.

---

### Prompt 12: Fix Email Confirmation Flow
**Ticket:** IF-57
**Context:** When a user clicks the email confirmation link, Supabase redirects to localhost:3000/ but there's no handler for the PKCE token_hash. The user lands without an active session because the OTP is never exchanged.
**Prompt:**
```
Fix email confirmation flow (IF-57). Create src/app/auth/confirm/route.ts — GET handler that
reads token_hash and type from URL search params, calls supabase.auth.verifyOtp({ token_hash, type })
to exchange token for session. On success → redirect /dashboard, on error → redirect
/login?error=confirmation_failed. Also update signUp call in register-form.tsx to pass
emailRedirectTo: `${window.location.origin}/auth/confirm`.
```
**Result:** Created `src/app/auth/confirm/route.ts` with GET handler: reads token_hash + type from
searchParams, calls verifyOtp to exchange for session, redirects to /dashboard on success or
/login?error=confirmation_failed on failure. Updated `src/components/auth/register-form.tsx` to
include `emailRedirectTo` option in signUp call pointing to /auth/confirm. Build passes cleanly.

---

### Prompt 13: Fix profile_name Not Saved During Registration
**Ticket:** IF-58
**Context:** After sign up, the profiles table has no profile_name — the username from the registration form is only stored in auth.users metadata but never written to the profiles table. Need to add the column and upsert it after signUp.
**Prompt:**
```
Fix profile_name not saved during registration (IF-58). Read DATABASE_SCHEMA.md to confirm
column names. Add profile_name column to profiles table type. After successful signUp in
register-form.tsx, upsert profile_name to profiles table. Update schema docs.
```
**Result:** Added `profile_name TEXT` column to Database type (Row/Insert/Update) in `src/lib/types/database.ts`.
Also added required `Relationships: []` to all table types to fix supabase-js v2.102+ compatibility (was
causing `never` type errors on `.from().upsert()`). Added upsert call in `src/components/auth/register-form.tsx`
after successful signUp — writes `profile_name: fullName.trim()` to profiles table. Updated
`docs/DATABASE_SCHEMA.md` with the new column. Removed unused `Enums` from Database type. Build passes cleanly.

---

### Prompt 14: Final Review
**Ticket:** IF-40
**Context:** [TO BE FILLED — final polish, cleanup, review prompt]
**Prompt:**
```
[TO BE FILLED]
```
**Result:** [TO BE FILLED]
