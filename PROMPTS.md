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
**Context:** Creating shared component library — Button, Card, Input, Badge, ScoreBadge, Header.
**Prompt:**
```
[TO BE FILLED]
```
**Result:** [TO BE FILLED]

---

### Prompt 4: Auth Implementation
**Ticket:** IF-18
**Context:** Register, login, logout with Supabase Auth + protected routes middleware.
**Prompt:**
```
[TO BE FILLED]
```
**Result:** [TO BE FILLED]

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
