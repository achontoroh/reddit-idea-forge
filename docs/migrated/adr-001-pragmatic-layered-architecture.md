# ADR-001 — Pragmatic Layered Architecture (over full Clean)

> **Historical snapshot** migrated from Linear document
> [Architecture Decision — CLAUDE.md Summary](https://linear.app/emberworks-lab/document/architecture-decision-claudemd-summary-c5a822bedfa1)
> _Authored 2026-04-08, near the start of the project. File structure described below has evolved since — see live `CLAUDE.md` and `docs/PROJECT_STRUCTURE.md` for the current layout. The decision rationale is preserved here for traceability._

## Why NOT full Clean Architecture for this project

In Flutter, Clean Architecture (domain → data → presentation) is standard because Flutter gives you full freedom to organize code. In Next.js, the framework dictates more structure — App Router = file-based routing, Server Components = data fetching, API Routes = server logic.

**Full Clean (with UseCases, Repository interfaces) for an 8-hour MVP would:**

* Signal that you don't understand the web ecosystem
* Add unnecessary abstraction for a small project
* Slow down development significantly

**Instead, we use Pragmatic Layered Architecture:**

* `app/` — routing and pages (framework layer)
* `components/` — UI components (presentation)
* `lib/` — business logic and integrations (domain + data combined)
* `config/` — constants and configuration
* `hooks/` — client-side state management

This is what senior Next.js developers actually use. Clean principles (separation of concerns, typed abstractions, config-driven) are applied — but without the ceremony of formal Clean Architecture.

## Key architectural decisions

1. **LLM behind abstraction** — `lib/llm/` with typed client, externalized prompts, Zod validation. The route never calls Anthropic directly.
2. **Reddit data source pattern** — `RedditDataSource` interface with `MockSource` and `ApiSource` implementations. Switchable via env var.
3. **Supabase dual client** — browser client (anon key, respects RLS) vs server client (service_role, bypasses RLS for admin ops).
4. **Config-driven categories** — single source of truth in `config/categories.ts`, used by UI filter, API queries, and LLM prompts.

## Original file structure (v1, MVP-era)

```
src/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Public: landing
│   ├── (auth)/             # Auth: login, register
│   ├── dashboard/          # Protected: feed, settings
│   ├── unsubscribe/        # Public: token-based
│   └── api/                # Server-only API routes
├── components/
│   ├── ui/                 # Button, Card, Badge, Input, ScoreBadge
│   ├── layout/             # Header, Footer, Nav
│   └── features/           # IdeaCard, CategoryFilter, SubscriptionForm
├── lib/
│   ├── supabase/           # client.ts, server.ts, middleware.ts
│   ├── llm/                # client.ts, prompts.ts, schemas.ts, generate-ideas.ts
│   ├── email/              # client.ts, templates.ts
│   ├── reddit/             # types.ts, source.ts, mock-source.ts, api-source.ts
│   └── types/              # idea.ts, subscription.ts, database.ts
├── data/                   # reddit-mock.ts
├── config/                 # categories.ts, llm.ts, site.ts
├── hooks/                  # use-ideas.ts, use-subscription.ts, use-auth.ts
└── middleware.ts            # Auth redirect middleware
```

## Conventions (original)

* **Files:** kebab-case.tsx/ts
* **Components:** PascalCase, named exports
* **Commits:** Conventional (feat/fix/chore) + Linear ticket ref
* **Types:** explicit, no `any`, Zod for external data
* **Tailwind:** utility-first, no custom CSS, indigo primary palette

> _Note: Tailwind palette later evolved to ember-accent + paper-tone (see Phase 10 editorial design system)._
