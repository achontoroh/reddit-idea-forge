# CLAUDE.md

## Project Overview
IdeaForge — SaaS MVP that scans Reddit for user pain points and generates AI-scored product ideas. Test task, ~8hr scope.

## Engineering Mindset
- Think as a strong senior fullstack TypeScript developer
- Apply SOLID where practical — especially Single Responsibility and Dependency Inversion
- Keep server logic in API routes — never leak secrets to client
- Every external integration (LLM, email, Reddit) behind a typed abstraction
- TypeScript strict mode — no `any`, no `as` casts without comment
- When modifying existing code, assess if surrounding code needs cleanup
- Flag technical debt when you encounter it

## Essential Commands
```bash
pnpm install          # Install deps
pnpm dev              # Dev server (http://localhost:3000)
pnpm build            # Production build
pnpm lint             # ESLint
```

## Architecture
- **src/app/** — Next.js App Router: pages, layouts, API routes
- **src/components/** — UI primitives (`ui/`) and feature composites (`features/`)
- **src/lib/** — Business logic, integrations (Supabase, LLM, email, Reddit)
- **src/config/** — Constants, prompt templates, categories
- **src/hooks/** — Client-side React hooks
- **src/data/** — Mock data (fallback only — real Reddit API is default)

Key principle: `app/` handles routing, `components/` handles UI, `lib/` handles logic. Never mix.

### Reddit Integration
- Public JSON API: `reddit.com/r/{sub}/hot.json` — no API key needed
- Data source toggleable in `src/config/app.ts` (`'mock' | 'api'`, default `'api'`)
- 8 subreddits configured in `src/config/reddit.ts` with category mapping
- `select-posts.ts` does round-robin category-balanced selection before feeding LLM (limit: 8 posts)
- Strategy pattern: `RedditDataSource` interface in `lib/reddit/source.ts`, swapped via factory in `lib/reddit/index.ts`

### Auth Flow (Vercel PKCE Fix)
- Auth callback/confirm routes write cookies directly to the `NextResponse.redirect()` response — NOT via `cookieStore()`
- This fixes Supabase PKCE flow on Vercel where `set-cookie` headers were dropped from redirects
- Pattern: create redirect response first → pass to `createServerClient` cookies config → return same response

### Middleware Auth Redirects
- `src/proxy.ts` handles route protection via `updateSession` + redirect rules
- Authenticated users on `/`, `/login`, `/register` → redirect to `/dashboard`
- Unauthenticated users on `/dashboard/*` → redirect to `/login`

Full file tree with explanations → `docs/PROJECT_STRUCTURE.md`

## Mandatory Rules

| Rule | Skill |
|------|-------|
| Server secrets (`SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`) — NEVER in client components | `/kit-create-api` |
| LLM prompts in `lib/llm/prompts.ts` — NEVER hardcoded in routes | `/kit-llm` |
| Validate ALL LLM responses with Zod schemas before using | `/kit-llm` |
| Category list from `config/categories.ts` — single source of truth for UI, API, and LLM | `/kit-create-ui` |
| Score colors: green (70+), amber (40-69), gray (<40) | `/kit-create-ui` |
| Typed responses — ALL API responses conform to interfaces from `lib/types/` | `/kit-create-api` |
| Error handling — every API route wrapped in try/catch with consistent error format | `/kit-create-api` |
| Components: kebab-case files, PascalCase named exports, FC with typed props | `/kit-create-ui` |
| New UI component? Check existing list first, extract to `components/ui/` if reusable, update registry | `/kit-create-ui` |
| Mobile-first Tailwind: start mobile, add `md:` and `lg:` breakpoints | `/kit-create-ui` |
| DB schema changes → update `supabase/setup.sql` AND `docs/DATABASE_SCHEMA.md` | `/kit-create-api` |

## Linear Workflow
- **Before starting a ticket:** read the Linear ticket (via MCP) to understand full context and acceptance criteria — don't rely only on the user's prompt
- **After completing a ticket:** if the implementation diverged from the original ticket description, update the ticket with what was actually done
- Linear project: IdeaForge (IF)

## Commit Convention
- **NEVER commit without asking the user first** — always ask "can I commit?" and wait for confirmation
- Use `/linear-commit` skill for all commits — it handles Linear magic words, ticket linking, and format
- Linear project prefix: **IF**

## Branching Strategy
- `main` — production, protected
- `develop` — integration branch, day-to-day work
- Branches are named after **epics** (not individual tickets) to link to Linear epics
- Feature branches merge into `develop` via PR, `develop` merges into `main` for releases

## Stack
- Next.js 14+ (App Router) + TypeScript + Tailwind CSS
- Supabase (Auth + Postgres + RLS)
- LLM: multi-provider via `src/config/app.ts` — Gemini (active), Anthropic, Groq supported
- Reddit: public JSON API (no auth token), configurable mock fallback
- Resend for email
- Zod for validation

## Environment Variables
See full list with descriptions → `docs/CONVENTIONS.md`
```
NEXT_PUBLIC_SUPABASE_URL=         # Public
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Public
SUPABASE_SERVICE_ROLE_KEY=        # Secret — server only
ANTHROPIC_API_KEY=                # Secret — server only
RESEND_API_KEY=                   # Secret — server only
```
Non-secret config (LLM provider, models, Reddit data source, email limits) → `src/config/app.ts`

## Documentation
Detailed references in `docs/` — point Claude Code to specific doc when needed.

| Doc | Contents |
|-----|----------|
| `docs/PROJECT_STRUCTURE.md` | Full file tree, route groups, "what goes where" guide |
| `docs/DATABASE_SCHEMA.md` | SQL tables, RLS policies, TypeScript types, migration |
| `docs/CONVENTIONS.md` | Naming, component patterns, API patterns, env vars, git, Tailwind |
| `docs/DATA_FLOW.md` | How generation, dashboard, email, and unsubscribe work end-to-end |
| `docs/TASK_SPEC.md` | Original task requirements adapted for our implementation |

## Available Skills
All skills use `kit-` prefix. Read the relevant skill BEFORE starting a task.

| Skill | When to use |
|-------|-------------|
| `/kit-create-api` | API routes, Supabase queries, auth checks, error handling |
| `/kit-create-ui` | Pages, components, Tailwind patterns, score visualization |
| `/kit-llm` | LLM pipeline, prompt design, Zod schemas, Anthropic SDK |
