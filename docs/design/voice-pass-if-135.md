# IF-135 · Voice pass migration report

Scope: sweep `src/` and `supabase/` for banned words, emoji in UI chrome, CTA
format, and generic empty/loading/error copy. Source of truth: `voice.md`.

## Categories

- **banned-word** — term from the banned list in `voice.md §2 › Don't`
- **emoji** — unicode emoji in UI chrome, nav, buttons, or email subject
- **cta** — primary CTA missing trailing ` →` or using banned phrasing
- **empty** — empty-state copy rewritten to the `voice.md §6` pattern
- **error** — validation/auth/network/generic error copy rewritten to `§6`
- **email** — email template subject or sign-off per `§7`

## Files touched

| File | Category | Change |
| --- | --- | --- |
| `src/app/(marketing)/page.tsx` | cta | `Sign up` → `Create account →`; `Log in` → `Sign in →` |
| `src/app/(marketing)/page.tsx` | emoji | removed `🛠️` from example badge, `↑` and `♡` from sample action buttons, category-grid emoji tile |
| `src/components/features/header.tsx` | cta | header `Sign in` → `Sign in →` |
| `src/components/auth/login-form.tsx` | cta | submit button `Sign in` → `Sign in →` |
| `src/components/auth/login-form.tsx` | error | `Enter a valid email` → `Email must be valid.`; supabase pass-through → `Email or password didn't match.` (no hint about which) |
| `src/components/auth/register-form.tsx` | cta | submit button `Create account` → `Create account →` |
| `src/components/auth/register-form.tsx` | error | `Enter a valid email` → `Email must be valid.`; `Password does not meet all requirements` → `Password must meet all requirements.` |
| `src/app/dashboard/onboarding/page.tsx` | cta | `Start Exploring` → `Start reading →` |
| `src/app/dashboard/onboarding/page.tsx` | error | pass-through error messages → `Something didn't work. Try again in a moment.` |
| `src/components/features/subscription/subscription-form.tsx` | cta | `Save preferences` → `Save changes` (canonical save copy from `§6 › Buttons`) |
| `src/components/features/subscription/subscription-form.tsx` | error | `Select at least one category` → `Select at least one category.`; pass-through error → `Something didn't work. Try again in a moment.` |
| `src/components/features/subscription/subscription-form.tsx` | exclamation | `Settings saved!` → `Settings saved.` |
| `src/components/features/dashboard-feed.tsx` | empty | three tabs rewritten: `No ideas published yet this week.` + `New issue drops Monday.`; `No ideas in this range.` + `Try a different window.`; `No ideas in your categories this week.` + `Add more categories in Settings.` |
| `src/components/ideas/idea-feed.tsx` | empty | `No ideas in this category yet.` → `No ideas in this category this week.` |
| `src/app/dashboard/ideas/[id]/idea-detail-client.tsx` | exclamation / error | `Copied to clipboard!` → `Copied to clipboard.`; share-fail / favorite-fail toasts → `Something didn't work. Try again in a moment.`; `Sign in to save ideas` → `Sign in to save ideas.` |
| `src/hooks/useVote.ts` | error | `Failed to save your vote. Please try again.` → `Something didn't work. Try again in a moment.` |
| `src/config/categories.ts` | emoji | removed `icon` field from `Category` interface and all 8 category records |
| `src/components/features/category-card.tsx` | emoji | removed `<span>{category.icon}</span>` from the card |
| `src/lib/email/client.ts` | email | subject `Your IdeaForge digest — <date>` → `ideaforge. N ideas this week.` (deadpan per `§7`) |
| `src/lib/email/template.ts` | email | header replaced with `ideaforge.` wordmark; added `—` / `ideaforge.` (italic) sign-off per `§7 › Closing`; footer note rephrased to `You subscribed at ideaforge.` |

## Not touched (intentional)

- `src/app/api/cron/generate/route.ts` — Telegram pipeline notifications use
  emoji (✅ ❌ 📥 💡 💥). These are ops messages to an admin channel, not UI
  chrome or email subjects; `voice.md` doesn't apply.
- `src/components/ui/spinner.tsx` — `aria-label="Loading"` kept. It's assistive
  text on a visual skeleton (not visible `Loading...` text), which is exactly
  what `§6 › Loading` prescribes.
- `src/app/dev/design-system/**` — dev-only design-system preview pages contain
  example strings like `"Read more →"` wrapped in quotes as anti-pattern
  illustrations. They're didactic, not chrome.
- `src/components/features/dev-pipeline-panel.tsx` — dev-only tool;
  admin-facing, not user-facing UI chrome.
- Broader marketing-page rewrite (`Discover your next SaaS idea`, `Ready to
  build?`, `Browse Ideas By Category`, the 3-step explainer, etc.) — out of
  scope for this ticket. The marketing page still has SaaS register strings
  that don't match `voice.md §1–3`; flag for a follow-up ticket.

## Banned-words sweep

Grep on `src/` + `supabase/` for `unlock|empower|supercharge|seamless|delightful|revolutionary|game-changing|next-gen|click here|loading\.\.\.` returned **no matches**. No rewrites needed in that category — the codebase was already clean.
