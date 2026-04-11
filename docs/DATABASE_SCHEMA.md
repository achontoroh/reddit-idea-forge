# Database Schema

## Tables

### profiles
Extends Supabase `auth.users`. Created on registration.

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### reddit_posts
Raw Reddit posts fetched by the pipeline. Processed posts feed the LLM for idea generation.

```sql
CREATE TABLE public.reddit_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reddit_id TEXT UNIQUE NOT NULL,
  subreddit TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  url TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  num_comments INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  processed BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ
);
```

### ideas
Generated product ideas with AI scoring and community engagement metrics.

```sql
CREATE TABLE public.ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  pitch TEXT NOT NULL,
  pain_point TEXT NOT NULL,
  category TEXT NOT NULL,
  source_subreddit TEXT NOT NULL,
  source_url TEXT,
  ai_score INTEGER NOT NULL,
  ai_score_breakdown JSONB NOT NULL DEFAULT '{}',
  target_audience TEXT,
  source_post_ids UUID[],
  community_score INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  mvp_complexity TEXT CHECK (mvp_complexity IN ('low', 'medium', 'high')),
  monetization_model TEXT CHECK (monetization_model IN ('subscription', 'one-time', 'freemium', 'marketplace')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**ai_score_breakdown JSONB structure:**
```json
{
  "pain_intensity": 22,
  "willingness_to_pay": 18,
  "competition": 20,
  "tam": 15
}
```
Each component: 0–25. Sum = total score (0–100).

### idea_votes
User upvotes/downvotes on ideas. Drives `community_score` via trigger.

```sql
CREATE TABLE public.idea_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote SMALLINT NOT NULL CHECK (vote IN (-1, 1)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(idea_id, user_id)
);
```

### idea_views
Tracks which users have viewed which ideas. Drives `view_count` via trigger.

```sql
CREATE TABLE public.idea_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(idea_id, user_id)
);
```

### user_favorites
Saved/bookmarked ideas per user. No cascade on idea delete — favorites persist as tombstones.

```sql
CREATE TABLE public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES public.ideas(id),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(idea_id, user_id)
);
```

### user_preferences
Per-user settings: selected categories, onboarding state, explore token budget.

```sql
CREATE TABLE public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  categories TEXT[] NOT NULL DEFAULT '{}',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  last_seen_at TIMESTAMPTZ,
  explore_tokens_today INTEGER DEFAULT 0,
  explore_tokens_reset_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### subscriptions
Email notification preferences per user (one per user).

```sql
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  categories TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  unsubscribe_token UUID DEFAULT gen_random_uuid() UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### email_logs
Tracks sent email notifications.

```sql
CREATE TABLE public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  idea_ids UUID[] NOT NULL DEFAULT '{}',
  sent_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Indexes

```sql
-- reddit_posts
CREATE INDEX idx_reddit_posts_subreddit ON public.reddit_posts(subreddit);
CREATE INDEX idx_reddit_posts_processed ON public.reddit_posts(processed);
CREATE INDEX idx_reddit_posts_expires_at ON public.reddit_posts(expires_at);

-- ideas
CREATE INDEX idx_ideas_category ON public.ideas(category);
CREATE INDEX idx_ideas_ai_score ON public.ideas(ai_score DESC);
CREATE INDEX idx_ideas_created_at ON public.ideas(created_at DESC);
CREATE INDEX idx_ideas_expires_at ON public.ideas(expires_at);
CREATE INDEX idx_ideas_community_score ON public.ideas(community_score DESC);

-- idea_votes
CREATE INDEX idx_idea_votes_idea_id ON public.idea_votes(idea_id);
CREATE INDEX idx_idea_votes_user_id ON public.idea_votes(user_id);

-- idea_views
CREATE INDEX idx_idea_views_idea_user ON public.idea_views(idea_id, user_id);

-- user_favorites
CREATE INDEX idx_user_favorites_user_id ON public.user_favorites(user_id);

-- user_preferences
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);
```

---

## Row Level Security (RLS)

All tables have RLS enabled.

| Table | Operation | Policy |
|-------|-----------|--------|
| **profiles** | SELECT | `auth.uid() = id` |
| **profiles** | INSERT | `auth.uid() = id` |
| **profiles** | UPDATE | `auth.uid() = id` |
| **reddit_posts** | SELECT | authenticated users can read all |
| **reddit_posts** | INSERT/UPDATE/DELETE | service_role only (no policy) |
| **ideas** | SELECT | authenticated, `expires_at IS NULL OR expires_at > now()` |
| **ideas** | INSERT/UPDATE/DELETE | service_role only (no policy) |
| **idea_votes** | SELECT | authenticated users can read all |
| **idea_votes** | INSERT | `auth.uid() = user_id` |
| **idea_votes** | UPDATE | `auth.uid() = user_id` |
| **idea_votes** | DELETE | `auth.uid() = user_id` |
| **idea_views** | SELECT | `auth.uid() = user_id` |
| **idea_views** | INSERT | `auth.uid() = user_id` |
| **user_favorites** | SELECT | `auth.uid() = user_id` |
| **user_favorites** | INSERT | `auth.uid() = user_id` |
| **user_favorites** | DELETE | `auth.uid() = user_id` |
| **user_preferences** | SELECT | `auth.uid() = user_id` |
| **user_preferences** | INSERT | `auth.uid() = user_id` |
| **user_preferences** | UPDATE | `auth.uid() = user_id` |
| **subscriptions** | SELECT | `auth.uid() = user_id` |
| **subscriptions** | INSERT | `auth.uid() = user_id` |
| **subscriptions** | UPDATE | `auth.uid() = user_id` |
| **email_logs** | SELECT | subscription owned by `auth.uid()` |

---

## Triggers

### update_community_score
After INSERT, UPDATE, or DELETE on `idea_votes`, recalculates `ideas.community_score` as `SUM(vote)` for the affected idea.

### increment_view_count
After INSERT on `idea_views`, increments `ideas.view_count` by 1 for the affected idea.

### handle_new_user (on auth.users)
After INSERT on `auth.users`, creates a corresponding row in `profiles`.

---

## TypeScript Types

```typescript
// src/lib/types/idea.ts
export interface ScoreBreakdown {
  pain_intensity: number
  willingness_to_pay: number
  competition: number
  tam: number
}

export type MvpComplexity = 'low' | 'medium' | 'high'
export type MonetizationModel = 'subscription' | 'one-time' | 'freemium' | 'marketplace'

export interface Idea {
  id: string
  title: string
  pitch: string
  pain_point: string
  category: string
  source_subreddit: string
  source_url: string | null
  ai_score: number
  ai_score_breakdown: ScoreBreakdown
  target_audience: string | null
  source_post_ids: string[] | null
  community_score: number
  view_count: number
  mvp_complexity: MvpComplexity | null
  monetization_model: MonetizationModel | null
  expires_at: string | null
  created_at: string
}

// src/lib/types/reddit-post.ts
export interface RedditPost {
  id: string
  reddit_id: string
  subreddit: string
  title: string
  body: string | null
  url: string
  score: number
  num_comments: number
  category: string
  fetched_at: string
  processed: boolean
  expires_at: string | null
}

// src/lib/types/idea-vote.ts
export interface IdeaVote {
  id: string
  idea_id: string
  user_id: string
  vote: -1 | 1
  created_at: string
}

// src/lib/types/idea-view.ts
export interface IdeaView {
  id: string
  idea_id: string
  user_id: string
  viewed_at: string
}

// src/lib/types/user-favorite.ts
export interface UserFavorite {
  id: string
  idea_id: string
  user_id: string
  saved_at: string
}

// src/lib/types/user-preferences.ts
export interface UserPreferences {
  id: string
  user_id: string
  categories: string[]
  onboarding_completed: boolean
  last_seen_at: string | null
  explore_tokens_today: number
  explore_tokens_reset_at: string | null
  created_at: string
  updated_at: string
}

// src/lib/types/subscription.ts
export interface Subscription {
  id: string
  user_id: string
  categories: string[]
  is_active: boolean
  unsubscribe_token: string
  created_at: string
  updated_at: string
}
```
