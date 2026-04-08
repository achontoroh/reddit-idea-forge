# Data Flow

## How idea generation works

### MVP approach: manual trigger

The MVP uses a **manual trigger** model — ideas are generated on demand, not automatically.

```
User clicks "Generate new ideas" on dashboard
  → Frontend calls POST /api/ideas/generate
    → Server loads Reddit data (mock or real API, based on REDDIT_DATA_SOURCE env var)
    → Server calls LLM Step 1: signal extraction (pain points from posts)
    → Server calls LLM Step 2: idea generation + scoring
    → Server validates responses with Zod
    → Server inserts ideas into Supabase `ideas` table
    → Server returns generated ideas
  → Dashboard refreshes to show new ideas
```

### Why manual trigger for MVP
- Automatic daily cron requires Vercel Cron Jobs or an external scheduler
- Manual trigger lets us demonstrate the full pipeline without infrastructure complexity
- The code is cron-ready — the API endpoint works the same whether called by a button or a cron job

### Future: automatic daily generation
To make it automatic, add to `vercel.json`:
```json
{
  "crons": [
    { "path": "/api/ideas/generate", "schedule": "0 8 * * *" }
  ]
}
```
This would call the same endpoint daily at 8:00 UTC. No code changes needed.

## How the dashboard works

```
User visits /dashboard
  → Middleware checks auth (redirects to /login if not authenticated)
  → Page loads with current ideas from Supabase
  → CategoryFilter shows pill tabs (All, devtools, health, etc.)
  → User clicks a category → URL updates to /dashboard?category=devtools
  → Page re-fetches ideas filtered by category
  → Ideas sorted by: score DESC, then created_at DESC
  → "New" badge shown on ideas created within last 24 hours
```

### Dashboard has a "Generate" button
- Visible on the dashboard (secondary button or floating action)
- Calls POST /api/ideas/generate
- Shows loading state while LLM processes
- Refreshes feed after completion
- Note: each generation adds new ideas, doesn't replace old ones

## How email subscriptions work

```
User goes to /dashboard/settings
  → Sees category checkboxes (from config/categories.ts)
  → Selects categories → clicks "Save"
  → POST /api/subscribe creates subscription with:
      - user_id (from auth)
      - categories (selected list)
      - unsubscribe_token (auto-generated UUID)
      - is_active = true
```

## How email sending works

```
POST /api/email/send (called manually or by future cron)
  → Query all subscriptions WHERE is_active = true
  → For each subscription:
      → Get subscriber's email from profiles table
      → Query ideas WHERE category IN subscriber.categories
        AND created_at > last_email_sent (or last 24h)
      → If no new matching ideas → skip
      → Build HTML email with idea cards + unsubscribe link
      → Send via Resend API
      → Insert row in email_logs table
```

### Email trigger for MVP
- Manual: admin calls POST /api/email/send (or there's a button in admin area)
- Future: Vercel Cron at `"0 9 * * *"` (daily at 9:00 UTC)

## How unsubscribe works

### Path 1: Email link (no auth required)
```
User clicks unsubscribe link in email
  → Opens /unsubscribe?token=abc-123-def
  → Page calls GET /api/unsubscribe?token=abc-123-def
  → Server finds subscription by token (using service_role — bypasses RLS)
  → Sets is_active = false
  → Shows "You've been unsubscribed" confirmation
```

### Path 2: Settings page (requires auth)
```
User goes to /dashboard/settings
  → Clicks "Unsubscribe" button
  → Calls PUT /api/subscribe with { is_active: false }
  → Subscription deactivated
  → UI updates to show "Unsubscribed" state
```

## Reddit data source abstraction

```typescript
// src/lib/reddit/source.ts
interface RedditDataSource {
  fetchPosts(): Promise<RedditPost[]>
}

// Switched by env var REDDIT_DATA_SOURCE
if (process.env.REDDIT_DATA_SOURCE === 'api') {
  // Use RealRedditSource — fetches from Reddit API
} else {
  // Use MockRedditSource — reads from data/reddit-mock.ts
}
```

This abstraction means:
- MVP works with mock data out of the box
- Switching to real Reddit API = change one env var
- LLM pipeline doesn't know or care where data comes from
