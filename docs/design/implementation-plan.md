# Implementation plan

Ordered phases. Each task has explicit acceptance criteria — Claude Code (or any implementer) can self-check before handing back.

**Sequence matters.** Phase 1 is foundation; don't start Phase 2 before Phase 1 is green. Phases 3–5 can parallelize.

---

## Phase 0 · Housekeeping

### Task 0.1 — Install fonts

Add the Google Fonts `<link>` from `tokens.md §2.1` to `<head>` in the app shell (root layout / `_document` / `_app` / `index.html` depending on stack).

**Acceptance:**
- [ ] `Fraunces`, `Instrument Serif`, `Inter`, `JetBrains Mono` all visible in devtools Fonts pane
- [ ] No FOUC longer than 200ms — add `display=swap` (already in the href)
- [ ] If using Next.js, use `next/font/google` instead for proper self-hosting

### Task 0.2 — Install tokens.css

Copy `docs/design/tokens.css` into the app's global stylesheet. Import it **first**, before any other styles, so CSS vars are defined globally.

**Acceptance:**
- [ ] `getComputedStyle(document.documentElement).getPropertyValue('--ink-paper')` returns `#faf8f3`
- [ ] Page bg is `var(--ink-paper)` (not `#ffffff`)
- [ ] Body text is `var(--ink-900)` and uses `Inter`

### Task 0.3 — Wire up Tailwind theme (if using Tailwind)

Merge `docs/design/tailwind.config.snippet.js` into project `tailwind.config.{js,ts}` under `theme.extend`.

**Acceptance:**
- [ ] `bg-ink-paper`, `text-ink-900`, `font-serif`, `text-h1`, `rounded-sm` all compile
- [ ] No hard-coded Tailwind colors (`bg-white`, `text-gray-800`) remain in `src/`

---

## Phase 1 · Primitives

### Task 1.1 — Wordmark + Glyph

Build `Wordmark` and `Glyph` components per `components.md`.

**Acceptance:**
- [ ] `<Wordmark size={22} />` renders `ideaforge.` with italic "idea", Fraunces 500 "forge", accent period
- [ ] At size 16, letters scale proportionally; no pixel blur
- [ ] Glyph renders a square at any size (tested: 16, 24, 32, 48)
- [ ] Favicon replaced with Glyph PNG export at 32×32 and 16×16

### Task 1.2 — Button

Build `Button` with intents `primary | secondary | ghost | danger` and sizes `sm | md`.

**Acceptance:**
- [ ] `data-intent` drives styling; no per-intent CSS classes in consumers
- [ ] `data-accent="true"` swaps primary to accent bg
- [ ] `:focus-visible` shows `--shadow-focus` halo, no default browser ring
- [ ] Trailing-arrow variant renders " →" in the same font (not an SVG icon)
- [ ] Only **one** `data-accent="true"` button rendered per page — add a console warning in dev if more are found

### Task 1.3 — Tag + InterestChip

Build `Tag` (the category dot+label, transparent bg) and `InterestChip` (pill toggle). These are two distinct components — don't merge.

**Acceptance:**
- [ ] `Tag` has NO background color (`background: transparent` in all states)
- [ ] Category color appears only on the 6px dot
- [ ] Label is always `var(--font-mono)`, uppercase, `--ink-400` color, letter-spacing 0.12em
- [ ] `Tag[active=true]` shows accent bottom border and `--ink-900` color
- [ ] `InterestChip[data-selected=true]` inverts bg/color
- [ ] Storybook story (or equivalent preview) exists with all 16 categories rendered as Tags

### Task 1.4 — Input, Toggle

Build `Input` (text/email/password/number) and `Toggle` per `components.md`.

**Acceptance:**
- [ ] Input label uses mono-caps kicker style
- [ ] Focus state: `border-color: var(--accent)` + `box-shadow: var(--shadow-focus)`
- [ ] Error state: `border-color: var(--danger)` + red text below
- [ ] Toggle has `role="switch"` and `aria-checked`
- [ ] Toggle includes paired `ON`/`OFF` mono-caps label to its right

### Task 1.5 — Kicker, typography utilities

Add utility classes: `.kicker`, `.italic-accent`, `.prose-reading` (640px max-width, Fraunces lede).

**Acceptance:**
- [ ] `.kicker` renders JetBrains Mono 10.5px uppercase letter-spacing 0.12em `--ink-400`
- [ ] `.italic-accent` renders Instrument Serif italic 400
- [ ] Utility classes work inline without needing to wrap in a component

---

## Phase 2 · Composed components

### Task 2.1 — ScoreDial

Build `ScoreDial` with sizes `sm | md | lg`, ring animation, and three score-color thresholds.

**Acceptance:**
- [ ] SVG-based, not canvas
- [ ] Ring `stroke-dashoffset` animates from empty to target on mount over `--dur-dial`
- [ ] Number is Fraunces 700, centered in the ring
- [ ] `/10` is Instrument Serif italic 400 immediately after the number, not below it
- [ ] With `prefers-reduced-motion: reduce`, no animation; value is shown immediately
- [ ] Color threshold: `>= 8.0` → `--signal-high`; `6.0–7.9` → `--signal-mid`; `< 6.0` → `--signal-low`
- [ ] Does not break at value `0` or `10` (edge cases render cleanly)

### Task 2.2 — IdeaCard (all 4 variants)

Build `IdeaCard` with `variant: 'list' | 'featured' | 'compact' | 'grid'`.

**Acceptance:**
- [ ] All four variants share the same `Idea` data contract (see `screens.md §2`)
- [ ] `list` variant has hairline bottom border only, no left or right border
- [ ] `featured` variant has full hairline border + `--ink-paper-2` background
- [ ] Hover: bg → `--ink-paper-2`, no lift/scale/shadow
- [ ] Title is Fraunces 500 (never Inter)
- [ ] Score is rendered via `ScoreDial`, never as a bar or badge
- [ ] `compact` variant fits in one row ≤ 300px wide
- [ ] Whole card is clickable (no "Read more →" sub-affordance)

### Task 2.3 — Header

Build the global `Header` component.

**Acceptance:**
- [ ] Height 63px, `--border-hair` bottom
- [ ] Wordmark at size 18 on the left
- [ ] Optional breadcrumb slot: `/` separator + mono-caps section name
- [ ] Logged-in variant shows email + 30×30 avatar tile
- [ ] Logged-out variant shows "Sign in" ghost button
- [ ] Does NOT become sticky on scroll (scrolls away with the page)

### Task 2.4 — SettingsShell, SettingsHead, SettingsRow

Build the three settings layout primitives.

**Acceptance:**
- [ ] `SettingsShell` renders header + 260px left tabs + content area
- [ ] Active tab has `--ink-900` bg, `--ink-paper` text, accent `•` right-aligned
- [ ] `SettingsHead` renders kicker + h2 + optional lede, with `1px --ink-900` bottom border
- [ ] `SettingsRow` is a 3-col grid (240px / 1fr / auto), hairline bottom (omit on last row via `last` prop)

---

## Phase 3 · Pages

### Task 3.1 — Landing page

Implement `/` per `screens.md §1`.

**Acceptance:**
- [ ] Display headline uses `--type-display` (96px) and italic-accent on "your time"
- [ ] Exactly one accent-colored element in the hero (the primary CTA)
- [ ] 3 featured IdeaCards render real data (not Lorem ipsum)
- [ ] No gradient backgrounds
- [ ] No emoji
- [ ] Pull-quote section uses `--font-italic` 48px, centered, max-width 800px
- [ ] Lighthouse mobile score ≥ 90 for Performance and Accessibility

### Task 3.2 — Dashboard

Implement `/dashboard` per `screens.md §2`.

**Acceptance:**
- [ ] Issue kicker renders current issue number + date
- [ ] Featured card is the week's highest-scored idea (computed, not hard-coded)
- [ ] Filter tags are multi-select; active tags have accent bottom border
- [ ] Right rail collapses below main feed at < 1024px viewport
- [ ] Empty and loading states match `screens.md §2 › States`

### Task 3.3 — Idea Detail

Implement `/ideas/[slug]` per `screens.md §3`.

**Acceptance:**
- [ ] Body column is `max-width: var(--container-prose)` (640px)
- [ ] h1 is Fraunces 500 56px, max 2 lines (ellipsis if over)
- [ ] ScoreDial(lg) renders with animated ring on first paint
- [ ] Signal breakdown uses 10-dot discrete indicators, NOT a progress bar
- [ ] Pull-quote is Instrument Serif italic 32px, centered, with mono-caps attribution
- [ ] "Weekend shape" section renders as a bordered box with `--ink-paper-2` bg
- [ ] Footer has tag row + ghost "Next idea →" link that navigates to next-by-date

### Task 3.4 — Auth

Implement `/auth/signin` and `/auth/signup` per `screens.md §4`.

**Acceptance:**
- [ ] Sign-in is split `1.1fr 1fr`, sign-up is split `1fr 1.1fr`
- [ ] OAuth buttons (Google, Reddit) above the email fallback
- [ ] Legal microcopy is 11.5px `--ink-400` at bottom
- [ ] Sign-up interest picker requires min 3, max 5 selections; submit blocked if out of range
- [ ] Password input has no "show/hide" eye control
- [ ] After signup, user is routed to `/dashboard` (even if empty)

### Task 3.5 — Settings

Implement `/settings/[tab]` for tabs `profile | subscription | newsletter | appearance`.

**Acceptance:**
- [ ] Side tabs navigate via URL (`/settings/subscription`), browser back works
- [ ] Mobile: tabs collapse to horizontal scrollable strip at top
- [ ] Profile: all 5 rows per spec; save button disabled until dirty
- [ ] Subscription: 3-plan grid; current plan is inverted (black bg, white text)
- [ ] Newsletter: 4 rows; daily-ping threshold `<select>` has options 8.0 / 8.5 / 9.0 / Off
- [ ] Appearance: theme switch updates `data-theme` on `<html>` instantly (no reload)
- [ ] Density switch toggles a `data-density` attribute that affects IdeaCard padding

### Task 3.6 — Account tab (new, not in current design)

Design + implement `/settings/account`. Not in the redesign mockups yet — placeholder structure in `screens.md §5e`.

**Acceptance:**
- [ ] Change password flow (current → new → confirm)
- [ ] 2FA: TOTP enrollment with QR code
- [ ] Export data: JSON download of all user ideas/preferences
- [ ] Delete account: typed-confirmation modal, 30-day soft-delete

---

## Phase 4 · Polish

### Task 4.1 — Dark mode ("Ink")

Enable dark mode via `data-theme="dark"` on `<html>`.

**Acceptance:**
- [ ] All pages render correctly in dark mode — no white flashes, no unreadable text
- [ ] Accent color unchanged from light mode
- [ ] System-preference mode respects `prefers-color-scheme`
- [ ] Theme picker in settings persists choice to localStorage AND respects SSR
- [ ] No `!important` overrides required

### Task 4.2 — Reduced motion

Implement `prefers-reduced-motion: reduce` support globally.

**Acceptance:**
- [ ] Score dial animation disabled
- [ ] All duration tokens collapsed to `0ms` (via `tokens.css` media query, already written)
- [ ] No opacity/transform entries used in place of reduced-motion-incompatible animations

### Task 4.3 — Accessibility audit

Run a full audit on every page.

**Acceptance:**
- [ ] All images have `alt` (descriptive or `alt=""` for decorative)
- [ ] All form inputs have associated `<label>`
- [ ] Tab order is logical — skip navigation link at top of every page
- [ ] Color contrast: AA minimum for all text (use axe or Lighthouse)
- [ ] Focus rings visible on every interactive element (buttons, links, inputs, toggles)
- [ ] Screen reader test: VoiceOver on macOS reads each page correctly

### Task 4.4 — Copy audit

Apply `voice.md` to every user-facing string.

**Acceptance:**
- [ ] No banned words from `voice.md §2 › Don't` anywhere in the app
- [ ] No emoji in UI chrome, nav, buttons, email subjects
- [ ] All primary CTAs end with ` →`
- [ ] All headlines follow the noun-phrase + italic-emphasis pattern
- [ ] Error messages name the field (not "This field is required")

---

## Phase 5 · Validation

### Task 5.1 — Regression check against HTML artifacts

For each page built in Phase 3, place it side-by-side with the corresponding HTML artifact in project root (`Site Redesign.html`, `Auth & Settings.html`).

**Acceptance:**
- [ ] Layout matches within ±8px at viewport 1440×900
- [ ] All typography weights, sizes, colors match tokens exactly
- [ ] All components render identically at all documented variants
- [ ] Deviations are documented — there must be a written reason for any that remain

### Task 5.2 — Design-system story

Publish every component in Storybook (or equivalent preview catalog).

**Acceptance:**
- [ ] One story per component × variant × state
- [ ] Tokens page renders all colors, type scale, spacing visually
- [ ] Can be linked from PR descriptions for review

### Task 5.3 — Final sign-off

Hand back to design (i.e., share a running build) for visual sign-off.

**Acceptance:**
- [ ] No Phase 3 pages have outstanding TODO comments referencing design
- [ ] Performance budget met: LCP < 2.5s on mid-tier mobile
- [ ] Lighthouse scores ≥ 90 on Performance, Accessibility, Best Practices, SEO across all pages

---

## Dependency graph (quick reference)

```
0.1 Fonts ─┐
0.2 tokens.css ─┴─▶ 0.3 Tailwind ─▶ 1.1–1.5 Primitives ─▶ 2.1–2.4 Composed
                                                                    │
                                                                    ▼
                                                        3.1–3.6 Pages ─▶ 4.1–4.4 Polish ─▶ 5.1–5.3 Validate
```

## Estimated effort (rough, not a promise)

| Phase | Effort |
|---|---|
| 0 — Housekeeping | 0.5 day |
| 1 — Primitives | 2 days |
| 2 — Composed | 2 days |
| 3 — Pages | 4 days |
| 4 — Polish | 2 days |
| 5 — Validation | 1 day |
| **Total** | **~11.5 days of focused work** |
