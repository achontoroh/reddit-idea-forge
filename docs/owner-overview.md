<!--
  Owner overview — high-level project snapshot for the human owner.

  Auto-update contract: scaffolded once; refreshed by `/forge:update-docs`
  on epic close, dependency changes, milestone changes. Sections OUTSIDE
  `<!-- manual -->` guards may be regenerated. Content INSIDE
  `<!-- manual --> ... <!-- /manual -->` is preserved verbatim.

  Format spec: `plugins/forge/docs/conventions/owner-overview.md`.
  Cap: ≤ 300 lines total.
-->

# IdeaForge — Owner overview

> Single-page snapshot of what this project is, where it is, and where it's going. Skim before any planning conversation.

---

## 1. Overview

<!-- manual -->
IdeaForge is an AI-powered web platform that scans Reddit for user pain points and turns them into scored SaaS product ideas with community voting. Solo-dev project; the v2 shared-idea-feed architecture is operational and the editorial design system is being applied page by page.
<!-- /manual -->

---

## 2. Features

### Shipped

<!-- auto:features.shipped -->
- Shared idea feed (v2 architecture) — _shipped 2026_
- Smart dashboard: tabs (Latest / Rating / For You), category chips, voting, badges (#26) — _shipped 2026_
- Reddit pipeline: Arctic Shift fetch + enrichment + two-step LLM generation + dedup (#37) — _shipped 2026_
- Editorial Design System foundation: tokens, primitives, ScoreDial, IdeaCard variants (#15) — _shipped 2026_
<!-- /auto:features.shipped -->

### In progress

<!-- auto:features.in_progress -->
- Editorial redesign of all pages + dark mode + a11y — _epic #125, Phase 11_
<!-- /auto:features.in_progress -->

### Planned

<!-- manual -->
- User features: favorites vault, explore mode, deep dive — _epic #126, priority: high_
- Email v2: queue + rate-limited digest cron — _epic #95, priority: med_
- Flutter mobile app — _epic #119, priority: low_
- Prompt intelligence: dedup + tuning — _epic #102, priority: med_
<!-- /manual -->

---

## 3. Phases & Milestones

### Active phase

<!-- auto:phases.active -->
**Phase 11 — Editorial Redesign — Pages & Polish** — _rolling_

Apply the Phase 10 design system to Landing, Dashboard, Idea Detail, Auth, Settings; then dark mode, reduced-motion, a11y audit, and validation against `docs/design/*.html`.
<!-- /auto:phases.active -->

### Upcoming

<!-- auto:phases.upcoming -->
- **Phase 12 — User Features** — _TBD_ — favorites, explore mode, deep dive (#126)
- **Phase 13 — Email v2** — _TBD_ — queue + rate-limited digest cron (#95)
- **Phase 14 — Prompt Intelligence** — _TBD_ — dedup + prompt tuning (#102)
<!-- /auto:phases.upcoming -->

### Milestones (optional)

<!-- manual -->
_Solo-dev backlog-driven workflow — no external-deadline milestones currently._
<!-- /manual -->

---

## 4. Tech stack

<!-- auto:tech_stack -->

### Web (web-nextjs)

| Layer | Choice |
|---|---|
| Language / framework | Next.js 16 (App Router) + TypeScript (strict) |
| Styling | Tailwind CSS v4 + design tokens (`tokens.css`) |
| Data fetching | SWR (client revalidation) |
| Persistence | Supabase (Auth + Postgres + RLS) |
| LLM | Multi-provider via `src/config/app.ts` — Gemini (active), Anthropic, Groq |
| Reddit | Arctic Shift API (primary) + public JSON (fallback) |
| Hosting / CI | Vercel + GitHub Actions (cron pipeline) |

<!-- /auto:tech_stack -->

---

## 5. Libraries & tools

<!-- auto:libraries -->
- **Supabase** — auth + Postgres + RLS; URL/keys in env, not VCS
- **Zod** — runtime validation of all LLM responses before use
- **Resend** — transactional + digest email
- **Sentry** — error tracking for the cron pipeline
- **Telegram** — optional pipeline success/failure notifications
- **code-review-graph** — local MCP code graph for `forge:review` / `forge:epic-close`
<!-- /auto:libraries -->

<!-- manual -->
_Add "why we picked this" notes for non-obvious choices here._
<!-- /manual -->

---

## 6. Conventions cheatsheet

Full rules live in `CLAUDE.md` + `plugins/forge/docs/conventions/`.

| Topic | Rule |
|---|---|
| Branch naming | `feature/<epic-NN>-<slug>` — one branch per epic; sub-issues commit on it |
| Commit magic words | `Closes #N` / `Fixes #N` (auto-close on merge) · `Refs #N` (link only) |
| Tracker backend | `github` — Issues + Projects v2 (`emberworks-lab/reddit-idea-forge`, project #1) |
| Ticket reference | `#N` (GitHub issue number — no alpha prefix) |
| PR target | `develop` for day-to-day; `main` for releases — never push to either directly |
| Decisions | `/forge:log-decision` appends to `docs/00_meta/decisions-log.md` |
| Docs refresh | `/forge:update-docs` after an epic close or stack-touching change |

---

## How this file stays fresh

- **Auto-updated by:** `/forge:update-docs` on epic close, dependency changes, milestone changes.
- **Hand-edited zones:** anything inside `<!-- manual --> ... <!-- /manual -->` is preserved verbatim.
- **Cap:** ≤ 300 lines.
