# Voice & copy

How IdeaForge sounds. This file is binding — deviations need a reason.

---

## 1. The short version

**Editorial, not SaaS.** You're a weekly magazine, not an app. Every piece of copy should sound like it was written by a person, not drafted by a growth team.

**Opinionated, not enthusiastic.** "Don't build this if X" beats "Perfect for X!". We're here to save people time, which means telling them when to skip.

**Concrete, not aspirational.** "40 minutes per standup conflict × 5 engineers" beats "unlock productivity".

**Low ego.** The app doesn't have personality quirks, mascot voice, or jokes about Monday. The *writing* does the lifting.

---

## 2. Register & tone

### Do

- Second person ("you") sparingly, only when giving direct advice
- Em-dashes for editorial cadence — like this — used deliberately
- Specific numbers over adjectives: "420k devs" > "a large audience"
- Sentence fragments when rhythm calls for it. Fine.
- Mix of Ukrainian and English where it's natural in context (the team is Ukrainian, audience is bilingual). Keep consistency within a single screen.

### Don't

- "Unlock", "empower", "supercharge", "seamless", "delightful" — banned
- Exclamation marks anywhere in UI chrome. Use them only inside editorial essays and only rarely.
- Emoji — never in UI, never in email subject lines. Tolerated inline in a manifesto essay if it's earned.
- "Built for founders who ship" or any variation — this is copy-shop filler
- "Revolutionary", "game-changing", "next-gen" — banned
- Questions as headlines ("Tired of scattered ideas?") — banned
- Stock analogies ("your idea management, reinvented") — banned

---

## 3. Headline patterns

The system uses a **noun-phrase + italic emphasis** pattern. One word per headline is italicized; it's always the semantic anchor.

### Landing hero
> **Ideas that earn *your time.***

### Dashboard issue title
> **This *week.***
> ISSUE 017 · JAN 20, 2026

### Section heads
> **The *signal*.**  (score breakdown section)
> **The *build*.**  (weekend shape section)
> **Your *plan*.**  (subscription settings)
> **Your *signal*.**  (profile settings)
> **Paper or *ink*.**  (appearance settings)

### Anti-patterns
> ❌ **Unlock your best ideas** (generic SaaS filler)
> ❌ **🚀 Ideas that actually work!** (emoji + exclamation)
> ❌ **Discover trending ideas with AI** (feature-first, not benefit-first)

---

## 4. Idea titles (writing ideas themselves)

Each idea entry has a title. Titles are **subject-line craft**, not taglines.

### Good
- Postgres branching for feature environments
- Calendar holds that decay if unused
- Prompt version control for teams
- Invoicing that waits out the payment window

### Bad
- "AI-powered Postgres copilot that revolutionizes DevOps"
- "The Postgres tool you didn't know you needed"
- "Postgres: Redefined" (anything with a colon followed by one word is banned)

### Rules
- 3–8 words
- Start with the thing, not a verb
- No product-name clichés (`-ly`, `-ify`, `.ai`, `Hyper-`)
- Use lowercase except proper nouns
- No emoji, no icons, no brackets

---

## 5. Score explanation copy

When we show a score, we justify it in one sentence. Format:

> **[Score]** · [one-clause justification in 12 words or fewer]

Examples:
- **8.4** · Frequent, expensive pain with a clear payment path.
- **6.9** · Real audience, but the willingness-to-pay signal is soft.
- **9.1** · Almost everything lines up — competition is the only risk.

The sentence is always a single clause. No "because", no "due to the fact that".

---

## 6. UI microcopy

### Buttons

| Action | Copy | Never use |
|---|---|---|
| Primary CTA (landing) | `Start reading →` | "Get started", "Try it free" |
| Sign in | `Sign in →` | "Login", "Log in" |
| Sign up | `Create account →` | "Sign up now", "Join the wait­list" |
| Upgrade plan | `Upgrade →` | "Go Pro", "Unlock Builder" |
| Save | `Save changes` | "Update settings" |
| Cancel | `Cancel` | "Back", "Nevermind" |
| Danger confirm | `Yes, cancel plan` | "Confirm", "Proceed" |
| Secondary | `Browse archive` | "Learn more", "Read more" |

**Trailing arrow rule.** Primary CTAs end with ` →`. Secondary ghost links don't. Never use `▶︎`, `>`, or `»`.

### Empty states

- No ideas this week: `No ideas published yet this week. New issue drops Monday.`
- No filter results: `No ideas in [FILTER] this week.` + ghost link `Clear filters`
- No connected account: `Not connected.` + accent mono-caps link `CONNECT`

### Loading

- Never use "Loading..."
- Show skeleton rows instead (see components.md)
- If you *must* use text: `Reading this week's signal.` (in `--font-italic`)

### Errors

- Generic: `Something didn't work. Try again in a moment.`
- Validation: `[Field name] is required.` — never "This field is required", always name the field.
- Auth failure: `Email or password didn't match.` (no hint about which)
- Network: `Can't reach the server. Check your connection.`

---

## 7. Email voice

### Subject lines

- `Issue 017. Three ideas.` (digest — deadpan, no hype)
- `ideaforge. daily — 8.7 signal.` (daily ping, only when threshold crossed)
- `A note on what we score.` (manifesto essay)
- `Your Builder plan renews tomorrow.` (billing)

### Opening lines

Emails open with a **location + time** stamp, editorial-style:

> `Kyiv, Monday morning.`
>
> Three ideas this week. The first one — DevTools Postgres branching — is the strongest signal we've seen this year…

### Closing

Sign off with the wordmark in text form, not a name:

> *—*
> *ideaforge.*

No "Best,", no "Cheers,", no "Thanks for reading!".

---

## 8. Manifesto paragraphs

The brand has 5 short manifesto paragraphs that show up across marketing and the in-app welcome. They're the tonal calibration. Don't rewrite these casually.

### M01 · The thesis
> Every week, a few ideas are worth your weekend. Most aren't. We read the signal, score the shape, and tell you which three deserve Saturday.

### M02 · On scoring
> A score isn't a verdict. It's a bet, marked in ink. 8.4 means we think the pain is frequent, the audience has cash, and the competition hasn't closed the door yet. 6.2 means something's soft. We show the breakdown so you can argue with us.

### M03 · On not building
> The best advice we can give, most weeks, is *don't*. Every unbuilt idea is a weekend back.

### M04 · On the weekend shape
> We only list ideas that a competent builder could ship a v0 of in a weekend. Not finished — shipped. Real URL, real users who could sign up. If it takes six weeks to make a dent, it's not a weekend shape.

### M05 · On signal
> Signal is the sum of: how often the pain shows up (r/programming, HN, customer interviews), how much people already pay to avoid it, how much they'd pay us to fix it, and how many other people are already fixing it. We weight frequency highest. You can argue.

---

## 9. Accessibility-first copy

- Screen reader: every icon has a `<span class="sr-only">` label
- Buttons without visible text (like toggles) have `aria-label`
- Error states are announced via `aria-live="polite"`
- Link text is descriptive: `Read this week's issue →`, not `Click here`
- Never use color alone to convey state — always add a label, icon, or text

---

## 10. One-line heuristic

If you're not sure whether a piece of copy fits the brand, read it aloud. If it sounds like a product manager wrote it, rewrite it. If it sounds like a columnist wrote it, keep it.
