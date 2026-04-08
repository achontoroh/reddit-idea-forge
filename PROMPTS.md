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

### Prompt 5: LLM Pipeline — Signal Extraction + Idea Generation
**Ticket:** IF-22
**Context:** Building the core LLM pipeline with Anthropic Claude API. Two-step process: extract signals from Reddit posts, then generate scored product ideas.
**Prompt:**
```
[TO BE FILLED]
```
**Result:** [TO BE FILLED]

---

### Prompt 6: Dashboard — Ideas Feed
**Ticket:** IF-25
**Context:** Building the main dashboard with idea cards, category filter, score visualization.
**Prompt:**
```
[TO BE FILLED]
```
**Result:** [TO BE FILLED]

---

### Prompt 7: Email Integration (Resend)
**Ticket:** IF-27, IF-28
**Context:** Email subscription form, Resend SDK integration, HTML email template.
**Prompt:**
```
[TO BE FILLED]
```
**Result:** [TO BE FILLED]

---

### Prompt 8: Landing Page
**Ticket:** IF-32
**Context:** Building the public landing page with hero, value prop, and CTA.
**Prompt:**
```
[TO BE FILLED]
```
**Result:** [TO BE FILLED]

---

### Prompt 9: Bug Fix / Iteration
**Ticket:** [TO BE FILLED]
**Context:** [TO BE FILLED — document an interesting debugging or iteration session]
**Prompt:**
```
[TO BE FILLED]
```
**Result:** [TO BE FILLED]

---

### Prompt 10: Final Review
**Ticket:** IF-40
**Context:** [TO BE FILLED — final polish, cleanup, review prompt]
**Prompt:**
```
[TO BE FILLED]
```
**Result:** [TO BE FILLED]
