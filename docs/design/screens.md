# Screen specs

One section per screen. Each section lists layout, exact components used, data contract, states, and copy.

See the HTML artifacts in project root (`Site Redesign.html`, `Auth & Settings.html`) for the visual source of truth.

---

## 1. Landing

**Route:** `/`
**Goal:** convey the editorial / scored-ideas premise in 3 seconds, one primary CTA.
**Container:** `--container-wide` (1200px), `--gutter-page` side padding.

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Header (Wordmark ·  Manifesto · Archive · Sign in)         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ISSUE 017 · JAN 20, 2026                                   │  ← kicker
│                                                             │
│  Ideas that earn                                            │  ← display (96px)
│    your time.                   ← italic accent word        │
│                                                             │
│  Lede paragraph, 17px body-lg, max-width 560px.             │
│                                                             │
│  [Start reading →]   [Browse archive]                       │  ← primary + secondary
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  THIS WEEK · 3 FEATURED                                     │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ IdeaCard(featured)  × 3 stacked                         ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│  HOW IT WORKS · 3 STEPS                                     │
│   3 columns, each: number (Fraunces 700 64px), serif h3,    │
│   body paragraph. No icons. No illustrations.               │
├─────────────────────────────────────────────────────────────┤
│  MANIFESTO PULL-QUOTE (full bleed, Instrument Serif italic  │
│   48px, max-width 800px, centered)                          │
├─────────────────────────────────────────────────────────────┤
│  Footer                                                     │
└─────────────────────────────────────────────────────────────┘
```

### Components

- Header
- Kicker (issue number)
- Display headline with italic accent on "your time"
- Button(primary, accent) × 1 + Button(secondary) × 1
- IdeaCard(variant=featured) × 3
- Pull-quote block (custom — see copy in voice.md)

### Acceptance

- Primary CTA is the only accent-colored element in the hero
- Display headline wraps onto 2 lines at viewport ≥ 1024, 3 lines below
- The 3 featured ideas come from the week's highest scores — real data, never placeholder
- No gradient backgrounds anywhere on the page
- Max of one italic word per headline

---

## 2. Dashboard (the "issue")

**Route:** `/dashboard` or `/` when signed in
**Goal:** "what's new this week" scannable list with scores.
**Container:** `--container-content` (960px) on mobile / tablet, `--container-wide` (1200px) on desktop with right-rail.

### Layout

Two-column at ≥ 1024px: main feed (720px) + right rail (320px). Single column below.

```
┌───────────────────────────────────────────────────────────────┐
│  Header                                                       │
├───────────────────────────────────────────────────────────────┤
│  ISSUE 017 · JAN 20, 2026                 [All ▾] [DEV] [AI]  │  ← issue meta + filter tags
├──────────────────────────────────┬────────────────────────────┤
│                                  │                            │
│  IdeaCard(featured)              │  THIS WEEK                 │
│                                  │  ──────────────            │
│                                  │  IdeaCard(compact) × 6     │
│  ─────────────────────────       │                            │
│  IdeaCard(list) × 8              │  ARCHIVE                   │
│                                  │  ──────────────            │
│                                  │  Month links               │
│                                  │                            │
└──────────────────────────────────┴────────────────────────────┘
```

### Components

- Header (logged-in variant, with avatar)
- Kicker (issue meta)
- Tag(size=md, active=true on selected filter) row for category filters
- IdeaCard(featured) × 1 at top of main feed
- IdeaCard(list) × N in chronological feed
- IdeaCard(compact) × 6 in right rail "This week" digest
- Archive link list (mono-caps, one month per row, `--ink-600`)

### Data contract

```ts
interface DashboardData {
  issue: { number: number; publishedAt: Date; };
  featured: Idea;             // highest-scored of the week
  feed: Idea[];               // newest first, paginated 20
  weekDigest: Idea[];         // 6 highest-scored of the current week
  availableCategories: CategoryKey[];
  activeFilters: CategoryKey[];  // [] = "All"
}
```

### States

- **Empty (no ideas this week yet):** "No ideas published yet this week — check back Monday." in `--font-italic` 20px centered.
- **Filtered, no results:** "No ideas in `DEVTOOLS + AI` this week." + ghost button "Clear filters".
- **Loading:** skeleton rows with `--ink-paper-2` bg + 120ms pulse. Max 6 skeletons.

### Acceptance

- Featured card is visually distinct (bordered + `--ink-paper-2`)
- Category tags in the filter row are functional toggles (multi-select), active = bottom accent border
- Right rail collapses below main feed at < 1024px
- No card ever uses a colored background except the featured one (and only `--ink-paper-2`, not accent)

---

## 3. Idea Detail

**Route:** `/ideas/[slug]`
**Goal:** deep-read of a single idea — the "article".
**Container:** `--container-prose` (640px) for body, full-bleed for hero.

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Header                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ● DEVTOOLS  ·  JAN 18, 2026  ·  5 min read                 │  ← meta row
│                                                             │
│  Postgres branching for                                     │  ← h1 (56px)
│  feature environments.                                      │
│                                                             │
│  ┌───────────────────┐                                      │
│  │                   │   Signal: 8.4/10                     │
│  │   ScoreDial(lg)   │   Audience: ≈420k devs              │
│  │      8.4/10       │   Willingness to pay: high           │
│  │                   │   Competition: moderate              │
│  └───────────────────┘                                      │
│                                                             │
│                                                             │
│  Lede paragraph, 17px Fraunces 400, --ink-800,              │  ← prose, 640px column
│  first-line indent, no drop cap.                            │
│                                                             │
│  ## Section heading (h3, 28px)                              │
│  Body paragraph, 15px Inter, 1.6 line height.               │
│                                                             │
│  > Pull-quote, Instrument Serif italic 32px, centered,      │
│  > with em-dash attribution below in mono-caps.             │
│                                                             │
│  ## The Build                                               │
│  Ordered list with serif numerals.                          │
│                                                             │
│  ## Weekend shape                                           │
│  A single box: "What you could ship by Sunday."             │
│  → bullet list in body font.                                │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Footer: tag row + "Next idea →" link                       │
└─────────────────────────────────────────────────────────────┘
```

### Components

- Header
- Meta row: Tag + date + read-time (mono 12.5px)
- h1 (Fraunces 500, 56px, max 2 lines)
- Hero block: ScoreDial(lg) + signal breakdown table
- Prose: mix of `<p>`, `<h3>`, `<ol>`, `<blockquote>`
- Pull-quote (blockquote styled as italic editorial quote)
- Weekend shape box (bordered, `--ink-paper-2` bg, `--space-6` padding)
- Tag row in footer + ghost "Next idea →" link

### Signal breakdown (right of ScoreDial)

5 rows, each:
- Mono-caps label (`--ink-400`)
- Score bar: 10 dots in a row, filled dots in `--ink-900`, empty in `--ink-paper-3`
- NOT a progress bar — discrete dots

### Acceptance

- Body column is 640px max-width, left-aligned, not centered text
- ScoreDial(lg) animates ring on first paint (`--dur-dial`, `--ease-dial`)
- Pull-quote is never the score — pull-quotes are editorial, not metrics
- Footer "Next idea →" loads the next idea in descending publish-date order

---

## 4. Auth

### 4a. Sign in

**Route:** `/auth/signin`
**Goal:** OAuth-first, email as fallback, no friction.
**Layout:** full-viewport, split at `1.1fr 1fr` columns (left = manifesto panel, right = form).

**Left panel** (`--ink-paper-2` bg):
- Wordmark top
- Kicker "MANIFESTO · 01"
- Headline "Ideas that earn / *your time.*" (Fraunces 48px, italic accent on "your time")
- Lede paragraph
- Issue caption at bottom

**Right panel** (`--ink-paper` bg, form centered at 420px):
- Kicker "SIGN IN"
- h2 "Welcome back." with accent period
- Sub-link "New here? [Create an account →]"
- Button(secondary) "Continue with Google"
- Button(secondary) "Continue with Reddit"
- Divider "OR EMAIL"
- Input (email)
- Input (password) + FORGOT? link in accent mono-caps
- Button(primary, accent) "Sign in →"
- Legal microcopy (11.5px, `--ink-400`)

### 4b. Sign up

**Route:** `/auth/signup`
**Layout:** mirror of sign-in, form on left, preview on right.

**Right panel — preview** shows 3 ghost IdeaCard(list)'s with scores 8.4 / 6.9 / 7.1 and one italic pull-quote below. This sets expectations.

**Form includes:**
- Name, email, password inputs
- InterestChip grid (pick 3–5 categories; pre-select a sensible starter set)
- Button(primary, accent) "Create account →"

### Acceptance

- No social proof counters ("Join 12k users") — editorial tone doesn't do growth-theater
- Password field has no "show/hide" eye — use native browser
- Interest picker requires 3 minimum, 5 maximum — validation blocks submit below 3
- After signup, route to `/dashboard` with empty-state message

---

## 5. Settings

**Route:** `/settings/[tab]` where tab ∈ `profile | subscription | newsletter | appearance | account`

**Shell:** SettingsShell component with side tabs (260px) + content (1fr).

### 5a. Profile

Rows (SettingsRow × 5):
1. **Display name** — Input (280px)
2. **Email** — Input (280px), with "verification required on change" note
3. **Avatar** — 44×44 initial tile + "Upload" button
4. **Interests** — InterestChip grid (right-aligned, wraps)
5. **Connected accounts** — Reddit (connected), Google (connect)

Footer: `[Cancel]` `[Save changes]` right-aligned.

### 5b. Subscription

- SettingsHead "Your *plan.*"
- **Plan cards** (3-column grid): Free / Builder (current, inverted) / Studio
- Rows: Payment method · Next invoice · Cancel plan (danger)

### 5c. Newsletter

Rows (SettingsRow × 4):
1. **Weekly digest** — Toggle(on) + "ON" label
2. **Daily ping** — score-threshold `<select>` (8.0 / 8.5 / 9.0 / Off) + Toggle
3. **Manifesto essays** — Toggle(off)
4. **Sender email** — Input (280px)

### 5d. Appearance

- Theme picker: 3 tiles (Paper / Ink / System). Each tile is a live 200px-tall preview of a real IdeaCard in that theme. Active tile has `--border-focus` and "ACTIVE" kicker badge.
- **Reduce motion** — Toggle
- **Density** — segmented control (Roomy / Compact), default Roomy

### 5e. Account (not yet designed — see implementation-plan.md)

Placeholder structure:
- Change password
- Two-factor authentication
- Export data (JSON)
- Delete account (danger row)

### Acceptance

- All form values persist between sessions
- Theme switch updates instantly without reload
- "Save changes" button is disabled until form is dirty
- Cancel plan is always confirmation-gated (modal)
- Mobile: side tabs collapse to a horizontal scrollable strip at the top
