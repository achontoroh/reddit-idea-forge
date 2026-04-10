# PROMPTS.md — Key AI Prompts Log

This document captures the most significant prompts used during development with Claude Code. Each entry includes the context, the prompt, and the outcome.

### Prompt 1: Project Scaffolding
**Context:** Phase 0 — initial Next.js project setup
**Prompt:** npx create-next-app@latest reddit-idea-generator --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
**Result:** Next.js 14 project scaffolded with TypeScript, Tailwind CSS, App Router, src/ directory structure

---

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

### Prompt 9: Email Subscription Form + API
**Ticket:** IF-27
**Context:** Phase 4 — building the email subscription settings page so users can choose which categories they want in their weekly digest. Requires API route for upsert/update, a client form component with category toggles, a settings page, and nav link.
**Prompt:**
```
Build email subscription settings page and API route.
POST /api/subscribe — upsert subscription (Zod validation, auth required).
PUT /api/subscribe — partial update categories/is_active.
SubscriptionForm client component with category toggle grid, email display,
weekly digest checkbox, success/error states.
Settings page at /dashboard/settings (server component, auth guard, fetch existing sub).
Add Settings link to Header nav.
```
**Result:** Created 3 new files: `src/app/api/subscribe/route.ts` (POST upsert + PUT partial update
with Zod validation, typed update fields), `src/components/features/subscription/subscription-form.tsx`
(category toggle grid using CATEGORIES from config, email read-only from session, checkbox toggle,
success auto-dismiss after 3s), `src/app/dashboard/settings/page.tsx` (server component with auth
guard + subscription fetch). Updated `src/components/layout/header.tsx` to add Settings nav link.
Build passes cleanly.

---

### Prompt 10: Landing Page
**Ticket:** IF-32
**Context:** Building the public landing page with hero, value props, how-it-works, and CTA sections. Includes marketing layout with auth-aware header and footer component.
**Prompt:**
```
Create the IdeaForge landing page with 3 files: footer.tsx (copyright, centered, border-t),
(marketing)/layout.tsx (header with IdeaForge logo, auth-aware nav — Login/Get started for
anonymous, Dashboard for logged-in users, footer), (marketing)/page.tsx (5 sections: hero
with gradient bg + h1 + CTA, 3 value prop cards in responsive grid using Card component,
3-step "how it works" with numbered circles, bottom CTA with indigo bg + white button).
All Tailwind, responsive, using existing Button and Card components.
```
**Result:** Created 3 new files: `src/components/layout/footer.tsx` (centered copyright with border-t),
`src/app/(marketing)/layout.tsx` (client component with useEffect auth check via Supabase getUser,
conditional nav — ghost Login + primary Get started for anon, primary Dashboard for logged-in),
`src/app/(marketing)/page.tsx` (server component with 4 sections: gradient hero with h1 + CTA button,
3 value prop Cards with icons in responsive grid, how-it-works with numbered indigo circles in 3-col
grid, bottom CTA with indigo-600 bg + white button). Removed default Next.js root page.tsx.
Reused existing Button and Card components. Build passes cleanly — `/` renders as static page.

---

### Prompt 11: Fix Ideas Not Scoped to User
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

### Prompt 12: Prevent Duplicate Ideas for Same Reddit Post
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

### Prompt 13: Fix Email Confirmation Flow
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

### Prompt 14: Fix profile_name Not Saved During Registration
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

### Prompt 15: Centralized Toast/Snackbar System
**Ticket:** IF-59
**Context:** Inline error text near buttons was inconsistent across the app. Need a global toast system for unified user feedback (errors, success messages).
**Prompt:**
```
Install sonner library. Create src/components/ui/toaster.tsx re-exporting Toaster
from sonner. Add <Toaster /> to root layout. Replace all inline error states in
login-form, register-form, and generate-button with toast.error() / toast.success().
```
**Result:** Installed sonner 2.0.7. Created `src/components/ui/toaster.tsx` with position top-right,
richColors, closeButton. Added `<Toaster />` to `src/app/layout.tsx`. Updated three components:
`login-form.tsx` (error → toast.error), `register-form.tsx` (error → toast.error, success → toast.success),
`generate-button.tsx` (error → toast.error, success → toast.success). Removed inline error state
(`useState<string | null>`) and error JSX from all three. Exported Toaster from `components/ui/index.ts`.
Build passes cleanly.

---

### Prompt 16: Quick UI Fixes — Validation, Cursor, Modal Overlap
**Ticket:** IF-60
**Context:** Polish pass — three small UX issues: no client-side validation hints on auth forms, missing cursor-pointer on interactive elements, and close button overlapping content in the idea detail modal.
**Prompt:**
```
Three small fixes:
1. Frontend validation hints on login/register forms — email "Enter a valid email"
   on blur, password "Min 8 characters" hint below field.
2. Add cursor-pointer to all clickable elements missing it.
3. Fix close button overlap in modal — add padding so it doesn't overlap ScoreBadge.
```
**Result:** Updated 6 files. Added `onBlur` and `hint` props to `Input` component. Added email
validation on blur + password hint to both `login-form.tsx` and `register-form.tsx`. Added
`cursor-pointer` to `Button`, `CategoryFilter` buttons, and modal close button. Added `pr-8`
to modal header to prevent close button overlapping ScoreBadge. Build passes cleanly.

---

### Prompt 17: Password Strength Indicator & Inline Validation
**Ticket:** IF-60 (followup)
**Context:** Improving auth form UX — removing misplaced password hint from login, replacing toast errors with inline form errors, and adding a real-time password strength indicator on register that matches Supabase password policy.
**Prompt:**
```
Fix password validation UX:
1. Remove "Min 8 characters" hint from login (only belongs on register)
2. Replace toast errors with inline errors shown under the fields
3. Build password strength indicator on register — progress bar + checklist
   for 5 requirements (8 chars, uppercase, lowercase, number, special char).
   Show only when focused or has value. Tailwind only.
```
**Result:** Created `components/auth/password-strength.tsx` with progress bar (color shifts red→green
as requirements met) and checklist with green dots. Exported `isPasswordValid()` helper used by
register form to block submit. Replaced `toast.error` with inline `formError` state in both
`login-form.tsx` and `register-form.tsx` — shown as red banner above form. Added `onFocus` prop
to `Input` component. Removed password hint from login. Build passes cleanly.

---

### Prompt 18: Resend Integration + Email Template
**Ticket:** IF-28
**Context:** Phase 4 — integrating Resend for email delivery, building the digest HTML template, and creating the internal send endpoint. Also includes a UX fix to replace the disabled email input with a static display block in SubscriptionForm.
**Prompt:**
```
IF-28 — Resend integration + email template. Part 0: Replace email input in
SubscriptionForm with info block showing "Digests will be sent to" + email,
pass email as prop from settings page. Part 1: pnpm add resend. Part 2: Create
src/lib/email/client.ts — sendIdeaDigest() using Resend SDK, returns {success, error?}.
Part 3: src/lib/email/template.ts — buildDigestHtml() with inline styles, max 3 ideas,
score color coding, unsubscribe link. Part 4: POST /api/email/send — auth via
CRON_SECRET or session, fetch active subscriptions, send digests, log to email_logs.
Part 5: Add CRON_SECRET + NEXT_PUBLIC_APP_URL to env files.
```
**Result:** Created 3 new files: `src/lib/email/client.ts` (Resend SDK wrapper with typed params,
error-safe return), `src/lib/email/template.ts` (inline-styled HTML template with escapeHtml,
score color coding green/amber/gray, max 3 idea cards, unsubscribe footer),
`src/app/api/email/send/route.ts` (dual auth: Bearer CRON_SECRET or Supabase session, iterates
active subscriptions, fetches top 3 ideas from last 7 days, sends via Resend, logs to email_logs
with Zod-validated insert, returns {sent, skipped, failed}). Updated SubscriptionForm to accept
`email` prop and display static info block instead of disabled input. Updated settings page to
pass `email={user.email}`. Updated database.ts email_logs type to match new schema (user_id,
email, status, ideas_count, error_message). Added CRON_SECRET and NEXT_PUBLIC_APP_URL to
.env.local and .env.example. Build passes cleanly.

---

### Prompt 19: Unsubscribe Mechanism
**Ticket:** IF-30
**Context:** Phase 4 — implementing two unsubscribe paths: token-based link from emails (no auth) and settings page toggle (auth required). Needed for CAN-SPAM compliance and UX.
**Prompt:**
```
IF-30 — Unsubscribe mechanism (token-based email link + settings toggle).
Part 1: GET /api/unsubscribe?token=<uuid> — validate token, find subscription by
unsubscribe_token using service_role (bypasses RLS), set is_active=false, redirect
to /unsubscribe/success. Return 400 if missing, 404 if not found.
Part 2: /unsubscribe/success — static page with checkmark, heading, subtext, link home.
Part 3: Add "Unsubscribe from digest emails" ghost button to SubscriptionForm, only
when initialData exists. Calls PUT /api/subscribe with { is_active: false }. Shows
"Unsubscribed" static text on success.
```
**Result:** Created 2 new files: `src/app/api/unsubscribe/route.ts` (GET handler using
supabaseServiceRole to bypass RLS, token validation, redirect to success page),
`src/app/unsubscribe/success/page.tsx` (static server component with centered layout,
SVG checkmark, heading, subtext, link home). Updated `subscription-form.tsx` with
handleUnsubscribe function, unsubscribed/unsubscribing state, conditional ghost button
in red below the form. Build passes cleanly.

---

### Prompt 20: Settings Page Bugs + Header Navigation
**Ticket:** IF-70
**Context:** Polish pass — four UX bugs in the subscription settings page and header. Unsubscribe was plain red text instead of a proper button, re-subscribing didn't reset the "Unsubscribed" state, checkbox stayed checked after unsubscribe, and the IdeaForge logo wasn't clickable.
**Prompt:**
```
FIX 1: Replace plain red text unsubscribe with outlined red button
(border border-red-300 rounded-md hover:bg-red-50).
FIX 2: After re-subscribe (form submit success), reset isUnsubscribed to false.
FIX 3: After unsubscribe, set isActive to false so checkbox unchecks.
FIX 4: Wrap "IdeaForge" text in header with Next.js Link to /dashboard.
Verify pnpm build passes.
```
**Result:** Updated 2 files: `subscription-form.tsx` (replaced plain text with outlined red button,
added `setUnsubscribed(false)` in submit success handler — FIX 3 was already implemented in prior
PR). Updated `header.tsx` (wrapped IdeaForge span with `<Link href="/dashboard">`). Build passes cleanly.

---

### Prompt 21: Full Codebase Audit — Env Vars + Hardcoded Values
**Ticket:** —
**Context:** Pre-ship audit — reading every file in src/ to find env var gaps and hardcoded values that would break between environments. Three tasks: env var inventory, hardcoded values report, README accuracy.
**Prompt:**
```
Full codebase audit. Read every file in src/. Task 1: Find ALL process.env.* usage, compare with
.env.example, add missing vars. Task 2: Find ALL hardcoded values (URLs, emails, model names,
magic numbers) that should be env vars or config constants — report but don't fix. Task 3: Rewrite
README.md env vars section to reflect reality.
```
**Result:** Read all 63 source files. Found 15 unique env vars in code, all present in .env.example.
Discovered 2 vars in .env.example NOT used in code (RESEND_FROM_EMAIL, REDDIT_DATA_SOURCE — intended
but not wired up). Found 6 actionable hardcoded values: email sender 'IdeaForge <onboarding@resend.dev>'
should use RESEND_FROM_EMAIL, root layout metadata still says "Create Next App", footer year hardcoded
to 2025, email digest magic numbers (3 ideas, 7 days), duplicated isWithin24Hours logic. Updated
README.md env vars table to 16 rows with Required column and accurate descriptions. Logged findings
for user decision on what to fix.

---

### Prompt 22: Fix All Hardcoded Values from Audit
**Ticket:** —
**Context:** Applying all 6 fixes identified in the codebase audit (Prompt 21), plus syncing .env.example and README.md with reality.
**Prompt:**
```
Fix all hardcoded values: (1) RESEND_FROM_EMAIL env var in email client, (2) root layout metadata,
(3) wire up REDDIT_DATA_SOURCE via data source abstraction, (4) dynamic footer year, (5) extract
email magic numbers to constants, (6) deduplicate isWithin24Hours to shared util. Then sync
.env.example and README.md with all process.env.* usage in code.
```
**Result:** Modified 8 existing files, created 4 new files. (1) `lib/email/client.ts` — reads
`RESEND_FROM_EMAIL` with fallback. (2) `app/layout.tsx` — metadata now says "IdeaForge". (3) Created
`lib/reddit/source.ts` (interface), `lib/reddit/mock-source.ts` (MockRedditSource class),
`lib/reddit/index.ts` (factory with `REDDIT_DATA_SOURCE` switch). Updated `api/ideas/generate/route.ts`
to use `getRedditSource()` instead of importing mock data directly. (4) `footer.tsx` — dynamic year
via `new Date().getFullYear()`. (5) `api/email/send/route.ts` — extracted `MAX_IDEAS_PER_EMAIL = 3`
and `IDEAS_WINDOW_DAYS = 7`. `lib/email/template.ts` — same constant. (6) Created
`lib/utils/date.ts` with shared `isWithin24Hours`, imported in both `idea-card.tsx` and
`idea-detail-modal.tsx`. All 16 env vars in code now match `.env.example` exactly. README.md env
table updated with accurate descriptions. Build passes cleanly.

---

### Prompt 23: Replace Mock Reddit Data with Public JSON Endpoints
**Ticket:** IF-42
**Context:** Phase 3 — Reddit closed self-service OAuth API access in 2024. Using public JSON endpoints (no auth token needed) as an interim solution until Reddit approves our API request. Need to wire real Reddit data into the existing data source abstraction.
**Prompt:**
```
Replace mock Reddit data with real Reddit public JSON endpoints. Create
src/lib/reddit/types.ts (raw API shapes + mapping function), update
src/config/reddit.ts (TARGET_SUBREDDITS, POSTS_PER_SUBREDDIT, subreddit-to-category
map), create src/lib/reddit/client.ts (PublicJsonRedditSource class fetching
/r/{subreddit}/hot.json with rate limiting and error handling), update factory in
src/lib/reddit/index.ts to return PublicJsonRedditSource when REDDIT_DATA_SOURCE=api.
Update .env.example. Verify pnpm build passes.
```
**Result:** Created 2 new files, modified 2 existing files. `src/lib/reddit/types.ts` — RedditApiResponse,
RedditApiPost interfaces + mapRawToRedditPost() that maps raw Reddit fields to RedditPost and classifies
subreddits into app categories via SUBREDDIT_CATEGORY_MAP. `src/lib/reddit/client.ts` —
PublicJsonRedditSource class that iterates TARGET_SUBREDDITS, fetches hot.json with User-Agent header,
200ms delay between requests, logs warnings and skips on error. `src/config/reddit.ts` — added
TARGET_SUBREDDITS (8 subreddits), POSTS_PER_SUBREDDIT=15, SUBREDDIT_CATEGORY_MAP, REDDIT_REQUEST_DELAY_MS.
`src/lib/reddit/index.ts` — replaced stub warning with actual PublicJsonRedditSource instantiation.
`.env.example` — added REDDIT_DATA_SOURCE=mock with comment. Build passes cleanly.
