# Design Tokens

Every value below is final. Token names are the source of truth — don't inline hex codes.

See `tokens.css` for ready-to-paste CSS variables, and `tailwind.config.snippet.js` for a Tailwind theme extension.

---

## 1. Color

### 1.1 Ink scale (neutrals)

12-step warm neutral. `ink-paper` is the canonical background. `ink-900` is the canonical text color. Never use pure `#000` or `#fff`.

| Token | Hex | Usage |
|---|---|---|
| `--ink-paper` | `#faf8f3` | Canvas / page background (default) |
| `--ink-paper-2` | `#f3efe7` | Secondary surfaces, quiet panels, sidebar |
| `--ink-paper-3` | `#ece7dc` | Hover surfaces, dividers between panels |
| `--ink-100` | `#e0dbd0` | Disabled surfaces |
| `--ink-200` | `#c7c1b4` | Subtle borders (rare) |
| `--ink-300` | `#a8a39a` | Disabled text |
| `--ink-400` | `#8b8b90` | Muted metadata, mono-caps kicker color |
| `--ink-500` | `#6d6d72` | Secondary labels |
| `--ink-600` | `#555558` | Body secondary, descriptions |
| `--ink-700` | `#3a3a3c` | Body text on warm panels |
| `--ink-800` | `#2a2a2c` | Strong body text |
| `--ink-900` | `#0f0f10` | Headlines, primary text, primary button bg |

**Borders.** Use `rgba(15,15,16,0.1)` for hairlines, `rgba(15,15,16,0.15)` for form inputs, `rgba(15,15,16,0.2)` for secondary buttons. Also exposed as `--border-hair`, `--border-input`, `--border-button`.

### 1.2 Accent

| Token | Hex | Usage |
|---|---|---|
| `--accent` | `#D97757` | Ember — primary accent. CTAs, focus ring, emphasized punctuation, NEW badge, brand period after wordmark. |
| `--accent-ink` | `#ffffff` | Foreground on accent background (buttons) |
| `--accent-hover` | `#c56a4c` | Hover state (`accent` × 0.92 luminance) |
| `--accent-soft` | `#f3e2d8` | Tinted surfaces (selected row, subtle highlight) |

**Single-accent rule.** Use `--accent` in at most **one cluster per viewport**. If a page has a primary CTA, the score dial must not use accent; if the score dial uses accent, the CTA is `--ink-900`. This prevents the "three orange things shouting" effect.

### 1.3 Category hues

Muted pastels. Used **only as 6px dots** next to category labels. Never as backgrounds, text, or fills > 12px. The label itself is always `--ink-400` in mono caps — color lives only in the dot.

| Category | Token | Hex |
|---|---|---|
| DevTools | `--cat-devt` | `#E8C994` |
| AI/ML | `--cat-ai` | `#A8C4E8` |
| Productivity | `--cat-prod` | `#F0B89C` |
| Fintech | `--cat-fin` | `#B8D9A8` |
| SaaS | `--cat-saas` | `#D4B8E8` |
| Creator | `--cat-creator` | `#E8A8B8` |
| Health | `--cat-health` | `#A8E8C4` |
| Climate | `--cat-climate` | `#94C4A8` |
| Education | `--cat-edu` | `#E8D4A8` |
| E-commerce | `--cat-ecom` | `#C4A8E8` |
| Hardware | `--cat-hw` | `#C4C4C4` |
| Media | `--cat-media` | `#E8A894` |
| Gaming | `--cat-gaming` | `#A894E8` |
| Legal | `--cat-legal` | `#94A8C4` |
| Travel | `--cat-travel` | `#94C4C4` |
| Real Estate | `--cat-realestate` | `#C4947C` |

Exposed in code as a map: `CATS_HEX[key] → hex`. Keys are short-codes (`devt`, `ai`, `prod`, `fin`, `saas`, `creator`, `health`, `climate`, `edu`, `ecom`, `hw`, `media`, `gaming`, `legal`, `travel`, `realestate`).

### 1.4 Semantic

| Token | Hex | Usage |
|---|---|---|
| `--signal-high` | `#2d7a3f` | Score ≥ 8.0 — rare, used only on score dial stroke |
| `--signal-mid` | `#7a6a2d` | Score 6.0–7.9 |
| `--signal-low` | `#8b8b90` | Score < 6.0 — same as `--ink-400` |
| `--danger` | `#a84a1c` | Cancel plan, destructive links |

### 1.5 Dark mode ("Ink")

Invert the scale; keep accent identical.

| Light token | Dark equivalent |
|---|---|
| `--ink-paper` | `#0f0f10` |
| `--ink-paper-2` | `#18181a` |
| `--ink-paper-3` | `#222224` |
| `--ink-900` | `#fafafa` |
| `--ink-800` | `#ebebec` |
| `--ink-700` | `#c7c7ca` |
| `--ink-600` | `#a8a8ac` |
| `--ink-400` | `#7a7a80` |
| `--accent` | `#D97757` (unchanged) |
| Border hair | `rgba(255,255,255,0.08)` |

Theme toggle: `data-theme="dark"` on `<html>`. See `tokens.css` for the dark selector block.

---

## 2. Typography

### 2.1 Type families

| Token | Family | Weights | Usage |
|---|---|---|---|
| `--font-serif` | `'Fraunces', serif` | 400, 500, 700 | All headlines (h1–h3), large numerals, idea titles |
| `--font-italic` | `'Instrument Serif', serif` | 400 italic only | Emphasis within headlines (one word per headline, max), score denominator `/10`, pull-quotes |
| `--font-sans` | `'Inter', system-ui, sans-serif` | 400, 500, 600, 700 | Body, buttons, form labels, UI chrome |
| `--font-mono` | `'JetBrains Mono', ui-monospace, monospace` | 400, 500 | Kickers, metadata, timestamps, section numbers |

Google Fonts import (`<link>` in `<head>`):

```html
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,700&family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>
```

### 2.2 Type scale

| Token | Font | Size | Line | Letter-spacing | Weight | Usage |
|---|---|---|---|---|---|---|
| `--type-display` | serif | 96px | 0.95 | -0.03em | 500 | Landing hero headline |
| `--type-h1` | serif | 56px | 1.0 | -0.025em | 500 | Page hero (dashboard, auth) |
| `--type-h2` | serif | 40px | 1.05 | -0.025em | 500 | Section heads |
| `--type-h3` | serif | 28px | 1.15 | -0.02em | 500 | Idea title on detail page |
| `--type-h4` | serif | 20px | 1.25 | -0.015em | 500 | Idea title on card |
| `--type-body-lg` | sans | 17px | 1.55 | 0 | 400 | Lead paragraph |
| `--type-body` | sans | 15px | 1.55 | 0 | 400 | Body default |
| `--type-body-sm` | sans | 13.5px | 1.5 | 0 | 400 | Descriptions, secondary |
| `--type-label` | sans | 13px | 1.4 | 0 | 500 | Buttons, inline labels |
| `--type-meta` | sans | 12.5px | 1.45 | 0 | 400 | Metadata inline |
| `--type-kicker` | mono | 10.5px | 1.4 | 0.12em | 400 | UPPERCASE kickers above headlines |
| `--type-tag` | mono | 10px | 1.3 | 0.12em | 400 | UPPERCASE tag labels |
| `--type-caption` | mono | 10px | 1.3 | 0.08em | 400 | Issue numbers, timestamps |
| `--type-numeral-xl` | serif | 48px | 1.0 | -0.03em | 700 | Score on detail page, plan price |
| `--type-numeral-lg` | serif | 30px | 1.0 | -0.02em | 700 | Score on featured card |
| `--type-numeral-md` | serif | 22px | 1.0 | -0.02em | 700 | Score on list card |
| `--type-numeral-denom` | italic | 14px | 1.0 | 0 | 400 italic | The `/10` after any score |

**Italic emphasis rule.** Never more than one italicized word per headline. Italic is a structural device (it indicates the "editorial voice moment"), not decoration. See `voice.md` for examples.

### 2.3 Text color rules

- Headlines: `--ink-900`
- Body on paper: `--ink-700` or `--ink-800`
- Body on `ink-paper-2`: `--ink-800`
- Kickers, meta, tags: `--ink-400`
- Descriptions: `--ink-600`
- Inverse (on `--ink-900` bg): `--ink-paper`

---

## 3. Spacing

Base unit: **4px**. All spacing is a multiple of 4.

| Token | Value | Typical use |
|---|---|---|
| `--space-1` | 4px | Tight gaps (icon↔label) |
| `--space-2` | 8px | Between related inline items |
| `--space-3` | 12px | Between list items, compact |
| `--space-4` | 16px | Default gap |
| `--space-5` | 20px | Card internal padding (compact) |
| `--space-6` | 24px | Card internal padding (default) |
| `--space-8` | 32px | Section internal gaps |
| `--space-10` | 40px | Major section padding |
| `--space-12` | 48px | Between sections (dense) |
| `--space-16` | 64px | Between sections (default) |
| `--space-24` | 96px | Between sections (editorial) |
| `--space-32` | 128px | Between landing sections |

### Container widths

| Token | Value | Usage |
|---|---|---|
| `--container-prose` | 640px | Long-form reading (idea detail main column) |
| `--container-content` | 960px | Dashboard content |
| `--container-wide` | 1200px | Landing sections |
| `--container-bleed` | 1440px | Full layout cap |
| `--gutter-page` | 40px | Side padding on desktop |
| `--gutter-page-mobile` | 20px | Side padding on mobile |

---

## 4. Borders, radii, shadows

### 4.1 Borders

| Token | Value | Usage |
|---|---|---|
| `--border-hair` | `1px solid rgba(15,15,16,0.1)` | Dividers, card outlines |
| `--border-input` | `1px solid rgba(15,15,16,0.15)` | Form fields, secondary buttons |
| `--border-button` | `1px solid rgba(15,15,16,0.2)` | Outline buttons |
| `--border-focus` | `1.5px solid #D97757` | Focus ring, active state |
| `--border-strong` | `1px solid #0f0f10` | Section dividers in editorial layouts |

### 4.2 Radii

We're a low-radius system. Most surfaces are `3px` or `0`. Never exceed `8px` except on pills and the avatar ring.

| Token | Value | Usage |
|---|---|---|
| `--radius-none` | `0` | Editorial blocks, full-bleed sections |
| `--radius-xs` | `2px` | Badges (NEW, kicker chips) |
| `--radius-sm` | `3px` | Buttons, inputs, cards, panels (**default**) |
| `--radius-md` | `8px` | Modal surfaces (rare) |
| `--radius-pill` | `999px` | Tag chips **only in contexts where they must look like pills** (interest picker). Default tags are borderless — see `components.md`. |
| `--radius-circle` | `50%` | Dots, avatars |

### 4.3 Shadows

Almost no shadows. We use borders, not elevation.

| Token | Value | Usage |
|---|---|---|
| `--shadow-none` | `none` | Default. Use this. |
| `--shadow-xs` | `0 1px 2px rgba(15,15,16,0.04)` | Toggle knob, sticky header (rare) |
| `--shadow-sm` | `0 1px 3px rgba(15,15,16,0.08)` | Dropdowns, menus |
| `--shadow-focus` | `0 0 0 3px rgba(217,119,87,0.15)` | Focus halo outside the border |

**Don't use elevation shadows on cards.** Cards are hairline-bordered. If everything floats, nothing does.

---

## 5. Motion

Restrained, editorial motion. Never bouncy. Prefer transforms and opacity.

| Token | Value | Usage |
|---|---|---|
| `--dur-instant` | `80ms` | Hover color shifts |
| `--dur-fast` | `160ms` | Button press, toggle |
| `--dur-base` | `240ms` | Default transitions |
| `--dur-slow` | `400ms` | Panel/modal enter |
| `--dur-dial` | `900ms` | Score dial fill-in on page load |
| `--ease-out` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Default ease |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Panel transitions |
| `--ease-dial` | `cubic-bezier(0.16, 1, 0.3, 1)` | Score dial (expo out) |

**Reduced motion.** When `prefers-reduced-motion: reduce`, disable score dial animation, reduce all durations to `0ms`, and swap transform-based entries for opacity-only.

---

## 6. Z-index scale

| Token | Value |
|---|---|
| `--z-base` | 0 |
| `--z-raised` | 10 |
| `--z-sticky` | 50 |
| `--z-dropdown` | 100 |
| `--z-modal-bg` | 900 |
| `--z-modal` | 1000 |
| `--z-toast` | 1100 |
