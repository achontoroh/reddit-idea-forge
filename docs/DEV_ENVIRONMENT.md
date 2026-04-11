# Development Environment Setup

## Why a Separate Dev Supabase Project?

IdeaForge uses two isolated Supabase projects:

| Environment | Supabase Project | Used By |
|---|---|---|
| **Production** | `reddit-idea-forge` (existing) | `main` branch, Vercel production deployment |
| **Development** | `reddit-idea-forge-dev` (new) | Feature branches, Vercel preview deployments, local dev |

**Reasons:**
- **Safe migration testing** — run `ALTER TABLE`, new RLS policies, or destructive schema changes without risking production data
- **Data isolation** — dev users, test ideas, and email logs don't pollute production
- **Independent auth** — dev Supabase has its own auth config, so test accounts don't appear in production
- **Preview deployments** — Vercel preview builds (from PRs) use dev credentials, so reviewers can test without touching prod

## Step-by-Step: Create a Dev Supabase Project

### 1. Create the project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **New Project**
3. Name it `reddit-idea-forge-dev` (or similar)
4. Choose the same region as production for consistency
5. Set a strong database password — save it somewhere secure

### 2. Copy credentials

Once the project is created, go to **Settings → API** and copy:

| Credential | Where to find | Env var |
|---|---|---|
| Project URL | `Settings → API → Project URL` | `NEXT_PUBLIC_SUPABASE_URL` |
| Anon/public key | `Settings → API → Project API keys → anon public` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Service role key | `Settings → API → Project API keys → service_role` | `SUPABASE_SERVICE_ROLE_KEY` |

### 3. Run migrations

Apply the same schema to your dev project. Two options:

**Option A: SQL Editor (quickest)**

1. Open **SQL Editor** in your dev Supabase dashboard
2. Copy the full SQL from `docs/DATABASE_SCHEMA.md`
3. Run it — this creates all tables, indexes, RLS policies, and triggers

**Option B: Supabase CLI (recommended for ongoing work)**

```bash
# Install CLI if not already
brew install supabase/tap/supabase

# Link to your dev project
supabase link --project-ref your-dev-project-ref

# Push migrations
supabase db push
```

> The project ref is the subdomain of your Supabase URL: `https://<project-ref>.supabase.co`

### 4. Configure Auth

In your dev Supabase dashboard → **Authentication → URL Configuration**:

- **Site URL**: `http://localhost:3000` (for local dev)
- **Redirect URLs**: add both:
  - `http://localhost:3000/**`
  - `https://*-your-vercel-team.vercel.app/**` (for preview deployments)

### 5. Set up local env files

```bash
# Copy the example files
cp .env.local.example .env.local
cp .env.development.example .env.development.local

# Edit .env.local — fill in shared secrets (LLM keys, Resend, etc.)
# Edit .env.development.local — fill in dev Supabase credentials
```

## Environment File Hierarchy

Next.js loads env files in this order (later files override earlier):

| File | Loaded when | Committed? |
|---|---|---|
| `.env` | Always | Yes (if exists) |
| `.env.local` | Always (except test) | **No** — gitignored |
| `.env.development` | `next dev` only | **No** — gitignored |
| `.env.development.local` | `next dev` only | **No** — gitignored |
| `.env.production` | `next build` / `next start` | **No** — gitignored |
| `.env.production.local` | `next build` / `next start` | **No** — gitignored |

For local development, `.env.development.local` overrides `.env.local`, so you can keep shared secrets (LLM keys, Resend) in `.env.local` and only put dev Supabase credentials in `.env.development.local`.

## Vercel Environment Variables

Vercel supports scoping environment variables to specific environments:

### How to configure

1. Go to **Vercel → Project → Settings → Environment Variables**
2. For each variable, select which environments it applies to:
   - **Production** — only deployed from `main` branch
   - **Preview** — deployed from PRs and non-production branches
   - **Development** — used by `vercel dev` (optional)

### Recommended setup

| Variable | Production | Preview |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | prod Supabase URL | dev Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | prod anon key | dev anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | prod service role key | dev service role key |
| `GOOGLE_GENERATIVE_AI_API_KEY` | same key | same key |
| `RESEND_API_KEY` | same key | same key |
| `CRON_SECRET` | prod secret | dev secret (or same) |
| `NEXT_PUBLIC_APP_URL` | `https://reddit-idea-forge.vercel.app` | (auto-set by Vercel) |

This way, every Vercel preview deployment (from PRs) automatically uses the dev Supabase project, while production deploys use the production project.

## Branching Strategy

```
feature/IF-XX-title  →  commit (IF-YY), commit (IF-ZZ), ...
                              ↓
                         PR → develop  →  Vercel Preview (dev Supabase)
                                              ↓
                                         PR → main  →  Vercel Production (prod Supabase)
```

1. **Epic branch** (`feature/IF-XX-feature-title`) — created per epic, contains commits for all related tickets (stories, tasks)
2. **Commits** — each commit references its Linear ticket: `[IF-YY] Ticket title — description`
3. **PR to `develop`** — feature branch merges into `develop` for validation on Vercel Preview with dev Supabase
4. **PR to `main`** — after validation on develop, a PR from `develop` to `main` deploys to production

### Vercel deployment setup

- **Production**: deploys from `main` only
- **Preview**: deploys from `develop` only (not from every feature branch)

### Testing migrations

1. Write your SQL migration or schema change in `supabase/setup.sql`
2. Apply it to the dev Supabase project (SQL Editor or CLI)
3. Test locally and validate on `develop` preview deployment
4. After merge to `main`, apply the same migration to production Supabase
