# Components

Every reusable UI primitive, with props, states, and exact tokens.

All components:
- Use tokens from `tokens.md` — never inline values
- Support `data-theme="dark"` (inherited from `<html>`)
- Respect `prefers-reduced-motion`
- Have a visible `:focus-visible` state (`--shadow-focus` halo)

---

## Wordmark

The brand mark. Renders `ideaforge.` as editorial type: `idea` in Instrument Serif italic, `forge` in Fraunces 500, period in `--accent`.

**Props:**
```ts
interface WordmarkProps {
  size?: number;           // px, default 22
  accent?: string;         // hex, default var(--accent)
  mono?: boolean;          // if true, period uses --ink-900 instead of accent
  href?: string;           // wraps in <a> if set
}
```

**Markup:**
```html
<span class="wordmark" style="font-size: 22px; line-height: 1;">
  <span class="italic-accent">idea</span><span style="font-family: var(--font-serif); font-weight: 500; letter-spacing: -0.02em;">forge</span><span style="color: var(--accent);">.</span>
</span>
```

**Where used:** nav header, auth screens, footer, email header.

**Don'ts:** no drop shadow, no background plate, no gradient. The mark lives on `--ink-paper` directly.

---

## Glyph (compact mark)

Fallback for favicons, 32px-and-below contexts. Italic lowercase `f` with a dot.

**Props:**
```ts
interface GlyphProps {
  size?: number;  // default 24
  accent?: string;
}
```

**Rendering:** 1:1 square. Italic `f` (Instrument Serif, 72% of height) + `.` (Fraunces 700, same size) in accent, positioned at baseline.

**Where used:** favicon (32, 16), app icon, loading placeholder, avatar when no uploaded image exists.

---

## Tag (category chip)

**The single most important correction from the audit.** Replaces the colored pill chips with a dot + mono-caps label.

**Props:**
```ts
interface TagProps {
  category: CategoryKey;   // 'devt' | 'ai' | ... (see tokens.md §1.3)
  label?: string;          // override display label (default: uppercase category name)
  size?: 'sm' | 'md';      // default 'md'
  active?: boolean;        // when used as filter button; adds --accent bottom border
}
```

**Markup:**
```html
<span class="tag" data-category="devt">
  <span class="tag-dot" style="background: var(--cat-devt);"></span>
  <span class="tag-label">DEVTOOLS</span>
</span>
```

**CSS:**
```css
.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: var(--type-tag-size);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-400);
  background: transparent;
  padding: 0;
  border: 0;
}
.tag-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-circle);
  flex-shrink: 0;
}
.tag[data-size='sm'] .tag-dot { width: 5px; height: 5px; }
.tag[data-active='true'] {
  color: var(--ink-900);
  border-bottom: 1.5px solid var(--accent);
  padding-bottom: 2px;
}
```

**Don'ts:**
- ❌ Never set `background` on `.tag` — it stays transparent
- ❌ Never apply category color to `color` — the dot carries it
- ❌ Never use `border-radius: 999px` — it's flat text, not a pill
- ❌ Never use category color for > 6px of surface area

**Exception — interest picker (auth, settings):** in that one context, the tag *does* become a pill for toggle affordance. Pill version is a separate component called `InterestChip` below.

---

## InterestChip

Used only in category/interest pickers. Pill-shaped toggle.

**Markup:**
```html
<button class="interest-chip" data-selected="true">Productivity</button>
```

**CSS:**
```css
.interest-chip {
  padding: 7px 12px;
  border-radius: var(--radius-pill);
  border: var(--border-input);
  background: var(--ink-paper);
  color: var(--ink-900);
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background var(--dur-fast) var(--ease-out);
}
.interest-chip[data-selected='true'] {
  background: var(--ink-900);
  color: var(--ink-paper);
}
```

---

## ScoreDial

Displays a 0–10 score. Three sizes; the number is always the emphasis — the ring is supporting.

**Props:**
```ts
interface ScoreDialProps {
  value: number;                    // 0–10, one decimal
  size?: 'sm' | 'md' | 'lg';        // default 'md'
  label?: string;                   // optional mono-caps label above ('SIGNAL' etc)
  animate?: boolean;                // default true — fill animates on first render
}
```

**Sizes:**
- `sm` (inline in list cards): 44×44 dial, number `--type-numeral-md` (22px)
- `md` (featured card): 72×72 dial, number `--type-numeral-lg` (30px)
- `lg` (detail page hero): 128×128 dial, number `--type-numeral-xl` (48px)

**Visual:**
- Ring: 2px stroke, `stroke-dasharray` proportional to `value/10`, color `--ink-900` (or `--signal-high` if ≥8.0, `--signal-mid` if 6.0–7.9, `--signal-low` if <6.0)
- Background track: 2px stroke, `--ink-paper-3`
- Number: Fraunces 700, centered, `--ink-900`
- `/10`: Instrument Serif italic 400, immediately after number inline, 30% smaller, `--ink-400`

**Animation:** on first render, `stroke-dashoffset` animates from full (empty ring) to target over `--dur-dial` with `--ease-dial`. The number counts up in lockstep. Skip both when `prefers-reduced-motion`.

**Don'ts:**
- ❌ No progress bar — this replaces all progress-bar scores
- ❌ No color-gradient scores (rainbow, heat map)
- ❌ No percentage sign — always `/10`, never `/100` or `%`

---

## IdeaCard

The most common component. Four variants, same primitives.

**Props:**
```ts
interface IdeaCardProps {
  idea: {
    id: string;
    title: string;
    category: CategoryKey;
    score: number;
    summary?: string;         // one-line, used in 'featured' and 'detail' variants
    publishedAt: Date;
    isNew?: boolean;          // adds NEW badge
  };
  variant: 'list' | 'featured' | 'compact' | 'grid';
  onClick?: () => void;
}
```

**Variants:**

### `list` — the default, used on dashboard index
Full-width row. Left: category dot + tag, title (h4), summary one-liner. Right: ScoreDial (sm). Hairline border bottom only.

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ● DEVTOOLS                                                       NEW    │
│ Postgres branching for feature environments                             │
│ Dev teams waste 40min/day on staging conflicts. $340/mo ceiling.  8.4   │
└─────────────────────────────────────────────────────────────────────────┘
```

### `featured` — top-of-dashboard hero card
Larger, bordered on all sides (`--border-hair`), background `--ink-paper-2`. Title = h3. ScoreDial (md). Optional pull-quote in `--font-italic`.

### `compact` — sidebar, email digest
One line. Dot + title (h4 clamped to 1 line) + score inline (`22px` numeral). No summary.

### `grid` — category page (3-col)
Square-ish card, vertical stack. Tag at top, title center-body, ScoreDial bottom-right.

**Hover state (all variants):** background → `--ink-paper-2`, title color unchanged, transition `--dur-fast`. No lift, no scale, no shadow.

**Don'ts:**
- ❌ No colored left border
- ❌ No "Read more →" affordance — the whole card is clickable
- ❌ No score as a badge in the corner — it's always the ScoreDial component

---

## Button

Two intents, two sizes. That's it.

**Props:**
```ts
interface ButtonProps {
  intent: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';   // default 'md'
  trailingIcon?: boolean;  // renders ' →' after label in same type
}
```

**CSS:**
```css
.btn {
  font-family: var(--font-sans);
  font-size: var(--type-label-size);
  font-weight: 500;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background var(--dur-fast) var(--ease-out);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.btn[data-size='md'] { padding: 13px 18px; }
.btn[data-size='sm'] { padding: 9px 14px; font-size: 12.5px; }

.btn[data-intent='primary'] {
  background: var(--ink-900);
  color: var(--ink-paper);
  border: 0;
}
.btn[data-intent='primary']:hover { background: #1f1f22; }

.btn[data-intent='secondary'] {
  background: var(--ink-paper);
  color: var(--ink-900);
  border: var(--border-button);
}
.btn[data-intent='secondary']:hover { background: var(--ink-paper-2); }

.btn[data-intent='ghost'] {
  background: transparent;
  color: var(--ink-900);
  border: 0;
  padding-inline: 8px;
}
.btn[data-intent='ghost']:hover { background: var(--ink-paper-2); }

.btn[data-intent='danger'] {
  background: transparent;
  color: var(--danger);
  border: var(--border-button);
}
```

**Accent variant (rare):** for exactly one CTA per viewport where emphasis is earned (landing hero, upgrade to Studio). Use `data-accent="true"` which swaps `background` → `var(--accent)`, `color` → `var(--accent-ink)`.

**Don'ts:**
- ❌ Don't use two accent buttons on the same screen
- ❌ Don't use `border-radius: 999px` — buttons are `--radius-sm`
- ❌ Don't use icons except the literal `→` character in trailing position

---

## Input & Textarea

**Props:**
```ts
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'url';
  label?: string;       // rendered as mono-caps kicker above field
  hint?: string;        // below field, --ink-600
  error?: string;       // below field, --danger
  state?: 'default' | 'focus' | 'error' | 'disabled';
}
```

**CSS:**
```css
.input-label {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-600);
  display: block;
  margin-bottom: 6px;
}
.input {
  width: 100%;
  padding: 12px 14px;
  background: var(--ink-paper);
  border: var(--border-input);
  border-radius: var(--radius-sm);
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--ink-900);
  outline: none;
  transition: border-color var(--dur-fast) var(--ease-out);
}
.input:focus { border-color: var(--accent); box-shadow: var(--shadow-focus); }
.input[data-error='true'] { border-color: var(--danger); }
```

---

## Toggle (switch)

Used for on/off preferences. Accent when on, muted when off.

**Markup:**
```html
<button class="toggle" data-on="true" role="switch" aria-checked="true">
  <span class="toggle-knob"></span>
</button>
```

**CSS:**
```css
.toggle {
  width: 44px; height: 24px;
  background: rgba(15, 15, 16, 0.15);
  border-radius: 999px;
  border: 0;
  padding: 2px;
  position: relative;
  cursor: pointer;
  transition: background var(--dur-fast) var(--ease-out);
}
.toggle[data-on='true'] { background: var(--accent); }
.toggle-knob {
  width: 20px; height: 20px;
  background: #fff;
  border-radius: 50%;
  box-shadow: var(--shadow-xs);
  position: absolute;
  top: 2px; left: 2px;
  transition: left var(--dur-fast) var(--ease-out);
}
.toggle[data-on='true'] .toggle-knob { left: 22px; }
```

Pair with a mono-caps `ON`/`OFF` label to the right — small detail that ties back to editorial voice.

---

## Header (nav)

Fixed at top. Wordmark left, nav center/right, actions right.

**Layout:** `display: flex; justify-content: space-between; padding: 18px 40px; border-bottom: var(--border-hair);`

**Sections:**
- Logo (left): Wordmark size=18
- Breadcrumb (optional, after logo): `/` separator in `--ink-400`, then section name in mono-caps
- Actions (right): email + avatar, or "Sign in" button

No shadow. No blur. No sticky scroll behavior (page scrolls past it).

---

## SettingsShell

Two-pane layout: side tabs (260px) + content area.

**Tabs:** mono-caps kicker "SETTINGS" at top, then tab rows. Active tab: `--ink-900` bg, `--ink-paper` text, `•` in accent on the right. Inactive: transparent bg, `--ink-900` text.

**Content:** 48px 56px padding. Section heads use the `SettingsHead` sub-component (kicker + h2 + optional lede paragraph).

---

## SettingsRow

A single row of a settings table. Three columns: label (240px), spacer (1fr), control (right-aligned).

```
┌──────────────────────────┬─────────┬───────────────────────────┐
│ Display name             │         │  [Yaroslav_______________]│
│ Shown in exported briefs │         │                           │
└──────────────────────────┴─────────┴───────────────────────────┘
```

Label is Fraunces 500 17px. Desc below is 12.5px `--ink-600`. Hairline border-bottom (except last row).

---

## Plan card (subscription)

Grid of 3 cards: Free, Builder (current), Studio. Current plan is `--ink-900` background with `--ink-paper` text; others are `--ink-paper` on hairline border.

Structure:
- Kicker: plan name (mono-caps)
- Price: Fraunces 700 48px + `/mo` in italic
- Feature list: `→` bullet in accent, then `--ink-700` text, 13px
- Button at bottom: "Current plan" (disabled ghost on current), "Upgrade →" (primary) on higher, "Downgrade" (ghost) on lower

---

## Kicker

Tiny standalone element used everywhere above headlines.

```html
<span class="kicker">01 · Profile</span>
```

Class defined in `tokens.css`. Font: JetBrains Mono, 10.5px, letter-spacing 0.12em, uppercase, `--ink-400`.

Prefix with a two-digit number when it anchors a section (editorial reference numbering).

---

## Component index (what each screen uses)

| Screen | Components |
|---|---|
| Landing | Wordmark, Button(primary+secondary), IdeaCard(featured), Kicker |
| Dashboard | Header, Wordmark, Tag, IdeaCard(list,featured), ScoreDial(sm,md), Kicker |
| Idea Detail | Header, Tag, ScoreDial(lg), Kicker, pull-quote (inline italic) |
| Auth | Wordmark, Input, Button(primary,secondary), InterestChip, Kicker |
| Settings | Wordmark, SettingsShell, SettingsRow, Toggle, Input, Plan card, InterestChip, Kicker |
