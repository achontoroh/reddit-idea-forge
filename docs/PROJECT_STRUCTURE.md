# Project Structure

## Directory tree

```
src/
├── app/                          # Next.js App Router — file-based routing
│   ├── (marketing)/              # Route group: public pages (no auth)
│   │   ├── page.tsx              # Landing page (/)
│   │   └── layout.tsx            # Marketing layout (no header nav)
│   ├── (auth)/                   # Route group: auth pages
│   │   ├── login/page.tsx        # Login form
│   │   ├── register/page.tsx     # Register form
│   │   └── layout.tsx            # Auth layout (centered card)
│   ├── dashboard/                # Protected route group
│   │   ├── page.tsx              # Ideas feed (/dashboard)
│   │   ├── settings/page.tsx     # Email subscription settings
│   │   └── layout.tsx            # Dashboard layout (header + nav)
│   ├── unsubscribe/page.tsx      # Token-based unsubscribe (public, no auth)
│   ├── api/                      # Server-only API routes
│   │   ├── ideas/
│   │   │   ├── route.ts          # GET /api/ideas — fetch ideas with filters
│   │   │   └── generate/route.ts # POST /api/ideas/generate — trigger LLM pipeline
│   │   ├── subscribe/
│   │   │   └── route.ts          # POST, PUT /api/subscribe — manage subscriptions
│   │   ├── unsubscribe/
│   │   │   └── route.ts          # GET /api/unsubscribe?token=xxx
│   │   └── email/
│   │       └── send/route.ts     # POST /api/email/send — trigger email dispatch
│   ├── layout.tsx                # Root layout (html, body, fonts, providers)
│   └── globals.css               # Tailwind directives + minimal global styles
│
├── components/
│   ├── ui/                       # Generic UI primitives (no business logic)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── input.tsx
│   │   └── score-badge.tsx       # Score display: number + color bar
│   ├── layout/                   # Layout pieces
│   │   ├── header.tsx            # Top nav bar
│   │   └── footer.tsx            # Footer (landing only)
│   └── features/                 # Feature-specific composites
│       ├── idea-card.tsx         # Single idea card (title, pitch, score, source)
│       ├── idea-feed.tsx         # List of idea cards with loading/empty states
│       ├── category-filter.tsx   # Category pill tabs
│       └── subscription-form.tsx # Email subscription form with category checkboxes
│
├── lib/                          # Business logic & external integrations
│   ├── supabase/
│   │   ├── client.ts             # Browser client (anon key, respects RLS)
│   │   ├── server.ts             # Server client (service_role, bypasses RLS)
│   │   └── middleware.ts         # Auth session refresh helper
│   ├── llm/
│   │   ├── client.ts             # Anthropic SDK wrapper — callLLM(), callLLMWithRetry()
│   │   ├── prompts.ts            # All prompt templates as exported functions
│   │   ├── schemas.ts            # Zod schemas: SignalSchema, GeneratedIdeaSchema
│   │   └── generate-ideas.ts     # Main pipeline: posts → signals → ideas → validate
│   ├── email/
│   │   ├── client.ts             # Resend SDK wrapper
│   │   └── templates.ts          # HTML email template builder
│   ├── reddit/
│   │   ├── types.ts              # RedditPost interface
│   │   ├── source.ts             # RedditDataSource interface (abstraction)
│   │   ├── mock-source.ts        # MockRedditSource — reads from data/reddit-mock.ts
│   │   └── api-source.ts         # RealRedditSource — OAuth + fetch (IF-42, optional)
│   └── types/
│       ├── idea.ts               # Idea, ScoreBreakdown, GeneratedIdea
│       ├── subscription.ts       # Subscription, SubscriptionFormData
│       └── database.ts           # Supabase-generated or manual DB row types
│
├── data/
│   └── reddit-mock.ts            # 15-20 mock Reddit posts with pain points
│
├── config/
│   ├── categories.ts             # CATEGORIES array — source of truth for UI + API + LLM
│   ├── llm.ts                    # Model name, temperature, max_tokens
│   └── site.ts                   # Site name, description, URLs
│
├── hooks/
│   ├── use-ideas.ts              # Fetch + filter ideas from API
│   ├── use-subscription.ts       # Subscription CRUD
│   └── use-auth.ts               # Auth state + user info
│
└── middleware.ts                  # Next.js middleware — auth redirect for /dashboard/*
```

## Route groups explained

Next.js route groups use `(parentheses)` — they organize files without affecting the URL:
- `(marketing)/page.tsx` → serves at `/` (not `/marketing`)
- `(auth)/login/page.tsx` → serves at `/login`
- This lets each group have its own `layout.tsx`

## What goes where — decision guide

| I need to... | Put it in... |
|---|---|
| Add a new page | `src/app/` following route conventions |
| Create a reusable button/card/input | `src/components/ui/` |
| Build a feature-specific widget (idea card, filter) | `src/components/features/` |
| Add Supabase query logic | `src/lib/supabase/` |
| Work with LLM prompts or parsing | `src/lib/llm/` |
| Add a new TypeScript interface | `src/lib/types/` |
| Add a constant or config value | `src/config/` |
| Add client-side data fetching | `src/hooks/` |
| Add server-side API logic | `src/app/api/` |
