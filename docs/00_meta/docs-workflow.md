# Docs Workflow (project instance)

Project-specific routing and rules for `docs/`. The universal pattern lives in
`plugins/forge/docs/conventions/docs-workflow.md` (forge plugin).

## Folder layout

- `00_meta/` — meta-docs (decisions-log, roadmap, this file, glossary)
- `design/` — editorial design system source-of-truth (tokens, components, screens, voice)
- `migrated/` — evergreen docs migrated from Linear (ADRs, wireframes)
- top-level `*.md` — technical references (PROJECT_STRUCTURE, DATABASE_SCHEMA, CONVENTIONS, DATA_FLOW, DEV_ENVIRONMENT, TASK_SPEC)

## Per-file conventions

- `owner-overview.md` — auto-maintained by `/forge:update-docs`; hand-edit only inside `<!-- manual -->` guards
- `decisions-log.md` — append-only; add via `/forge:log-decision`
- `DATABASE_SCHEMA.md` — must be updated alongside `supabase/setup.sql` on any schema change

## Mandatory cross-doc updates

- Locking a decision → append `decisions-log.md`; update related tech doc; add to `glossary.md` if a new term appears
- Changing roadmap scope → update `roadmap.md`; reflect epic state on GitHub
- DB schema change → update `supabase/setup.sql` AND `docs/DATABASE_SCHEMA.md`

## What does NOT belong in `docs/`

- Code (lives in the source tree)
- Active tickets (GitHub Issues is the system of record)
- Session-only chat output
- Secrets / credentials

---

*Last updated: 2026-05-22*
