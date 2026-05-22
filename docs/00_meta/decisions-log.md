# Decisions Log

Append-only architectural / design decisions. Newest at top.

Use `/forge:log-decision` to add new entries.

---

## 2026-05-22 — Adopted forge plugin conventions

**Decision:** Aligned the project with the `forge` Claude Code plugin: scaffolded `docs/00_meta/` + `docs/owner-overview.md`, wired `code-review-graph` via `.mcp.json`, added `platforms[]` to `tracker.json`, removed legacy `.claude/commands/` duplicates (canonical skills live in `.claude/skills/`).

**Why:** All shared skills, rules, and conventions now live in the forge plugin (`forge:*` skills + `plugins/forge/docs/conventions/`). The project should consume them rather than carry stale local copies.

**How to apply:** Use `forge:*` skills for workflow (create-epic, execute-ticket, commit, review, epic-close…) and the project's `kit-*` skills for IdeaForge-specific UI/API/LLM patterns.

---

## 2026-05 — Migrated tracker from Linear to GitHub Issues

**Decision:** Dropped Linear; GitHub Issues + Projects v2 (`emberworks-lab/reddit-idea-forge`, project #1) is the system of record.

**Why:** Consolidate code + tracker in one place; remove the Linear MCP dependency.

**How to apply:** Tickets are GitHub issues. Link commits with `Closes #N` / `Fixes #N` / `Refs #N`. Evergreen Linear docs were migrated under `docs/migrated/`.

---

## (historical) — Architecture & data-source decisions

Earlier decisions are captured in code docs rather than this log:

- **Pragmatic layered architecture** — `docs/migrated/adr-001-pragmatic-layered-architecture.md`
- **Arctic Shift as primary Reddit source** (public JSON returns 403 on Vercel) — `CLAUDE.md` › Reddit Integration
- **Vercel PKCE cookie fix** (write cookies onto the redirect response) — `CLAUDE.md` › Auth Flow
- **Score scale: store /100, display /10** — `CLAUDE.md` › Mandatory Rules
