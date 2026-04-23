# IdeaForge — Design Handoff

**Owner:** design review + redesign by Claude (design agent)
**For:** implementation by Claude Code (dev agent)
**Status:** v1.0 — ready to implement
**Direction chosen:** V1 "Editorial" (paper-tone, Fraunces + Instrument Serif italics, accent `#D97757` Ember)

---

## What this is

A complete, self-contained design system for the IdeaForge redesign. Built from:

1. **Diagnosis** — audit of the current site with 9 concrete findings (see `Design Review.html` in project root)
2. **Brand exploration** — 6 logo concepts → chosen wordmark + editorial identity (see `Brand System.html`)
3. **Screen redesign** — Landing, Dashboard, Idea Detail, Auth, Settings, each with 2 variants (see `Site Redesign.html` and `Auth & Settings.html`)
4. **This package** — everything above, consolidated into code-ready specs

The HTML artifacts in the project root are the **visual source of truth**. The markdown files in this folder are the **implementation source of truth**. If they disagree, the HTML wins and this folder gets updated.

---

## How to use this with Claude Code

Drop this `docs/design/` folder into your repo. Then, for any implementation task, point Claude Code at the specific spec file it needs:

```
Read docs/design/tokens.md and docs/design/components.md.
Implement the Tag component as specified. Must pass acceptance criteria
listed in implementation-plan.md §Phase 1 · Task 3.
```

Or for a whole phase:

```
Read docs/design/README.md and docs/design/implementation-plan.md.
Execute Phase 1 in order. Stop after each task and show me the result.
```

Each task in `implementation-plan.md` has explicit acceptance criteria — Claude Code can self-check before asking you to review.

---

## File map

| File | What's in it | When to read |
|---|---|---|
| `README.md` | This file — index, how to use | Start here |
| `tokens.md` | Color, type, spacing, radii, shadows, motion — every design token with a name and a value | Implementing anything visual |
| `tokens.css` | CSS variables — paste into your global stylesheet | Wire up tokens |
| `tailwind.config.snippet.js` | Tailwind theme extension | If using Tailwind |
| `components.md` | Spec for every reusable component: Tag, ScoreDial, IdeaCard, Button, Input, Toggle, Shell | Building components |
| `screens.md` | Per-screen specs: Landing, Dashboard, Idea Detail, Auth, Settings | Building pages |
| `voice.md` | Copy principles, UI microcopy, email tone, voice do/don't | Writing any user-facing text |
| `implementation-plan.md` | Ordered phases & tasks with acceptance criteria | Executing the work |

---

## Design principles (the 5-line version)

1. **Editorial, not SaaS.** Fraunces + Instrument Serif italics carry headlines. No stock icons, no gradient mesh backgrounds.
2. **Earned attention.** Every element justifies its pixels. If you can't explain why a section is there, delete it.
3. **Signal > hype.** Scores are displayed as deliberate, hand-set typography (`8.4/10` with italic `/10`), not as progress bars.
4. **Paper physics.** Background is `#faf8f3` (warm off-white), not pure white. Borders are hairlines (`1px rgba(15,15,16,0.1)`), not card shadows.
5. **Tags over chips.** Categories are **dot + MONO CAPS label**, never colored rounded rectangles.

---

## What NOT to do (anti-patterns from the current site)

These are the behaviors the redesign explicitly corrects. Don't regress:

- ❌ Colored pill-shaped category badges → ✅ dot + mono caps
- ❌ Generic progress-bar scores → ✅ large serif number with italic `/10`
- ❌ Emoji in UI chrome → ✅ remove entirely (or replace with a muted dot)
- ❌ Multiple gradient CTAs on one screen → ✅ one primary action per viewport
- ❌ `Inter` for headlines → ✅ `Fraunces` for all h1-h3, `Instrument Serif` italic for accents
- ❌ Tailwind-default `bg-white` → ✅ `--ink-paper` (`#faf8f3`)
- ❌ Category colors as fills → ✅ category colors only as 6px dots

See `Design Review.html` (project root) for the full diagnostic with before/after visuals.
