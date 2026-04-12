# Conventions

## File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Pages | `page.tsx` (Next.js convention) | `app/dashboard/page.tsx` |
| Layouts | `layout.tsx` | `app/dashboard/layout.tsx` |
| API routes | `route.ts` | `app/api/ideas/route.ts` |
| Components | `kebab-case.tsx` | `components/ui/score-badge.tsx` |
| Lib modules | `kebab-case.ts` | `lib/llm/generate-ideas.ts` |
| Types | `kebab-case.ts` | `lib/types/idea.ts` |
| Config | `kebab-case.ts` | `config/categories.ts` |
| Hooks | `use-kebab-case.ts` | `hooks/use-ideas.ts` |
| Docs | `UPPER_SNAKE_CASE.md` | `docs/DATABASE_SCHEMA.md` |

## Component Pattern

```typescript
// 1. Imports
import { type FC } from 'react'
import { type Idea } from '@/lib/types/idea'

// 2. Props interface
interface IdeaCardProps {
  idea: Idea
  isNew?: boolean
}

// 3. Named export, FC typed
export const IdeaCard: FC<IdeaCardProps> = ({ idea, isNew = false }) => {
  return (
    <article className="...">
      {/* content */}
    </article>
  )
}
```

Rules:
- Named exports only (not `export default`)
- `FC<Props>` with typed props interface
- Props interface defined above component
- Destructure props in function signature

## API Route Pattern

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Auth check (protected routes)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Logic...
    return NextResponse.json({ data: result })
  } catch (error) {
    console.error('[API] endpoint-name:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

Rules:
- Always wrap in try/catch
- Always log errors with `[API] prefix`
- Consistent response shape: `{ data }` or `{ error }`
- Auth check at the top for protected routes

## Response Format

```typescript
// Success
{ data: T }
{ data: T, meta: { page: number, total: number } }

// Error
{ error: string }
```

## Environment Variables

| Variable | Public? | Used by |
|----------|---------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Browser Supabase client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Browser Supabase client |
| `SUPABASE_SERVICE_ROLE_KEY` | **No** | Server Supabase client (API routes) |
| `ANTHROPIC_API_KEY` | **No** | LLM pipeline (Anthropic provider) |
| `ANTHROPIC_MODEL` | **No** | Anthropic model override. Default: `claude-sonnet-4-20250514` |
| `LLM_PROVIDER` | **No** | LLM provider selection (`anthropic` \| `groq` \| `gemini`) |
| `GROQ_API_KEY` | **No** | LLM pipeline (Groq provider) |
| `GROQ_MODEL` | **No** | Groq model override. Default: `meta-llama/llama-4-scout-17b-16e-instruct` |
| `GEMINI_API_KEY` | **No** | LLM pipeline (Gemini provider) |
| `GEMINI_MODEL` | **No** | Gemini model override. Default: `gemini-2.0-flash` |
| `RESEND_API_KEY` | **No** | Email sending |
| `REDDIT_CLIENT_ID` | **No** | Reddit API (optional) |
| `REDDIT_CLIENT_SECRET` | **No** | Reddit API (optional) |
| `REDDIT_DATA_SOURCE` | **No** | `mock` or `api` — switches Reddit data source |
| `CRON_SECRET` | **No** | Bearer token for cron API endpoints. Must also be set in GitHub repo secrets |
| `SENTRY_DSN` | **No** | Sentry error tracking DSN (server-side) |
| `NEXT_PUBLIC_SENTRY_DSN` | Yes | Sentry error tracking DSN (client-side) |
| `SENTRY_ORG` | **No** | Sentry org slug (for source map uploads) |
| `SENTRY_PROJECT` | **No** | Sentry project slug (for source map uploads) |

`NEXT_PUBLIC_` prefix = exposed to browser, safe for public data only.
No prefix = server-only, never import in client components.

## Git Conventions

### Commit messages (Conventional Commits)
```
feat: add category filter to dashboard (IF-25)
fix: handle empty LLM response gracefully (IF-22)
chore: update dependencies
docs: add setup instructions to README (IF-34)
style: fix dashboard layout on mobile
refactor: extract ScoreBadge component
```

### Rules
- One logical change per commit
- Reference Linear ticket in parentheses
- Never commit `.env.local` or secrets
- Meaningful commit messages — not "fix stuff"

## Tailwind Conventions

### Color palette
- **Primary:** indigo (buttons, links, brand accents)
- **Success / high score:** green
- **Warning / mid score:** amber
- **Neutral / low score:** gray
- **Danger:** red (errors, destructive actions)

### Layout defaults
- Content max-width: `max-w-4xl mx-auto px-4`
- Cards: `rounded-lg border border-gray-200 bg-white p-4`
- Primary button: `bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg px-4 py-2`
- Secondary button: `border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-4 py-2`

### Responsive approach
- Mobile-first: base styles for mobile
- Add `md:` for tablet, `lg:` for desktop
- No dark mode for MVP

## TypeScript Rules
- Strict mode enabled
- No `any` — use `unknown` + type guard if needed
- No `as` casts without a comment explaining why
- Explicit return types on all `lib/` functions
- Zod for validating external data (LLM responses, API inputs)
- Interfaces for object shapes, types for unions/aliases
