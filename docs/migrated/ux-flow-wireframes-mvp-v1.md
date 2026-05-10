# UX Flow & Wireframes — IdeaForge MVP (v1, snapshot)

> **Historical snapshot** migrated from Linear document
> [UX Flow & Wireframes — IdeaForge MVP](https://linear.app/emberworks-lab/document/ux-flow-and-wireframes-ideaforge-mvp-046da269ddd8)
> _Authored 2026-04-08 as the original UX spec. The live product has since evolved through 10+ design phases (Phase 7 architecture v2, Phase 9 smart dashboard, Phase 10 editorial design system). This document is preserved for tracking UX drift; for current spec see `docs/design/`._

## User flow (v1)

```
Landing (/)
  │
  ├─ CTA "Get started" ──→ Register (/auth/register)
  │                              │
  │                              ├─ toggle ──→ Login (/auth/login)
  │                              │                    │
  │                              └────────────────────┘
  │                                        │
  │                              redirect after auth
  │                                        │
  │                                        ▼
  └─ (logged in) ────────→ Dashboard (/dashboard?category=all)
                                   │
                      ┌────────────┼────────────┐
                      │            │            │
                      ▼            ▼            ▼
               Email Settings   Idea Detail   Logout
             (/dashboard/       (modal or      → /
              settings)         expand)
                      │
                      ▼
               Unsubscribe (/unsubscribe?token=...)
               (also reachable via link in email, no auth required)
```

### Pages summary

| Route | Auth required | Purpose |
| -- | -- | -- |
| `/` | No | Landing page: hero, value prop, CTA |
| `/auth/register` | No | Email + password registration |
| `/auth/login` | No | Email + password login |
| `/dashboard` | Yes | Main ideas feed with category filter |
| `/dashboard/settings` | Yes | Email subscription preferences |
| `/unsubscribe?token=xxx` | No | Token-based unsubscribe |

### Navigation (header)

**Logged out:** Logo | Login | Get started
**Logged in:** Logo | Dashboard | Settings | Logout

---

## Wireframes

### 1. Landing page (/)

```
┌─────────────────────────────────────────────┐
│  Logo                     [Login] [Get started] │
├─────────────────────────────────────────────┤
│                                              │
│        Reddit pain points → product ideas    │
│        AI scans Reddit for problems and      │
│        generates scored startup ideas        │
│                                              │
│           [ Get started — it's free ]        │
│                                              │
├─────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │ Reddit   │ │ AI       │ │ Email    │     │
│  │ signals  │ │ scoring  │ │ alerts   │     │
│  │          │ │          │ │          │     │
│  │ Pain     │ │ Each     │ │ Get new  │     │
│  │ points   │ │ idea     │ │ ideas    │     │
│  │ from     │ │ rated    │ │ for your │     │
│  │ real     │ │ 0-100    │ │ topics   │     │
│  │ users    │ │          │ │ daily    │     │
│  └──────────┘ └──────────┘ └──────────┘     │
├─────────────────────────────────────────────┤
│  How it works:                               │
│  1. We scan Reddit → 2. AI generates → 3. You get ideas │
├─────────────────────────────────────────────┤
│           [ Get started ]                    │
└─────────────────────────────────────────────┘
```

### 2. Auth pages (/auth/login, /auth/register)

```
┌─────────────────────────────────────────────┐
│                                              │
│         ┌──────────────────────┐             │
│         │  Welcome back        │             │
│         │  Sign in to your     │             │
│         │  account             │             │
│         │                      │             │
│         │  Email               │             │
│         │  ┌──────────────┐    │             │
│         │  │              │    │             │
│         │  └──────────────┘    │             │
│         │  Password            │             │
│         │  ┌──────────────┐    │             │
│         │  │              │    │             │
│         │  └──────────────┘    │             │
│         │                      │             │
│         │  [ Sign in ]         │             │
│         │                      │             │
│         │  No account?         │             │
│         │  Register            │             │
│         └──────────────────────┘             │
└─────────────────────────────────────────────┘
```

### 3. Dashboard (/dashboard)

```
┌─────────────────────────────────────────────┐
│  Logo     Dashboard  Settings  Logout        │
├─────────────────────────────────────────────┤
│                                              │
│  [All] [devtools] [health] [education]       │
│  [finance] [productivity]                    │
│                                              │
├─────────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐     │
│  │  CodeReview AI            [NEW] 82  │     │
│  │  AI code review catching bugs       │     │
│  │  before PR merge                    │     │
│  │  ▰▰▰▰▰▰▰▰▱▱ 82/100               │     │
│  │  Pain: "Code reviews take hours"    │     │
│  │  Source: r/webdev                   │     │
│  └─────────────────────────────────────┘     │
│                                              │
│  ┌─────────────────────────────────────┐     │
│  │  MealPrepBot                    67  │     │
│  │  Weekly meal planner with auto      │     │
│  │  shopping lists                     │     │
│  │  ▰▰▰▰▰▰▱▱▱▱ 67/100               │     │
│  │  Pain: "Planning meals is tiring"   │     │
│  │  Source: r/productivity             │     │
│  └─────────────────────────────────────┘     │
│                                              │
│  ┌─────────────────────────────────────┐     │
│  │  GradeSync                      45  │     │
│  │  Auto-sync grades across LMS        │     │
│  │  platforms for teachers             │     │
│  │  ▰▰▰▰▱▱▱▱▱▱ 45/100               │     │
│  │  Pain: "Updating grades in 3 apps"  │     │
│  │  Source: r/teachers                 │     │
│  └─────────────────────────────────────┘     │
└─────────────────────────────────────────────┘
```

**Idea card fields:**

* Title (idea name)
* "New" badge (green, for ideas < 24h old)
* Score (0-100, color-coded: green 70+, amber 40-69, gray < 40)
* Short pitch (1-2 sentences)
* Progress bar visualization of score
* Key pain point / insight (italic or muted)
* Source subreddit (link to Reddit)

**Score color mapping (v1):**

* 70-100: green (high viability)
* 40-69: amber (moderate)
* 0-39: gray (low)

> _Note: Score scale later changed to /10 with `signal-high` / `signal-mid` / `signal-low` thresholds (Phase 10)._

### 4. Email settings (/dashboard/settings)

```
┌─────────────────────────────────────────────┐
│  Logo     Dashboard  Settings  Logout        │
├─────────────────────────────────────────────┤
│                                              │
│  ┌──────────────────────────────┐            │
│  │  Email notifications         │            │
│  │  Get new ideas in your inbox │            │
│  │                              │            │
│  │  Categories:                 │            │
│  │  ☑ devtools  ☑ health       │            │
│  │  ☐ education ☐ finance      │            │
│  │  ☑ productivity              │            │
│  │                              │            │
│  │  [Save preferences]          │            │
│  │  [Unsubscribe]               │            │
│  └──────────────────────────────┘            │
└─────────────────────────────────────────────┘
```

### 5. Unsubscribe confirmation

```
┌─────────────────────────────────────────────┐
│                                              │
│        ✓ You've been unsubscribed            │
│                                              │
│        You will no longer receive             │
│        email notifications.                   │
│                                              │
│        [ Back to dashboard ]                 │
│                                              │
└─────────────────────────────────────────────┘
```

---

## Design decisions (v1)

* **Style**: Clean, flat, SaaS-minimal. Tailwind CSS utility classes.
* **Colors**: Indigo/purple primary (brand), green for success/high score, amber for warning/medium, gray for low.
* **Typography**: System font stack via Tailwind defaults (Inter-like).
* **Layout**: Max-width container (~1024px), centered. Cards are full-width within container.
* **Mobile**: Responsive — category pills wrap, cards stack vertically.
* **Inspiration**: Tosnos SaaS Landing on Dribbble — clean hero, clear CTA, feature cards.

> _Phase 10 replaced this palette with editorial design system: paper-tone neutrals + ember accent, Fraunces/Instrument Serif/Inter/JetBrains Mono typography. See `docs/design/` for current spec._

## Hosting (original choice)

**Primary: Vercel** (free plan)

* Native Next.js platform, auto-deploy from GitHub
* Environment variables via Vercel dashboard
* Custom domain + SSL included
* Every push = automatic redeploy
