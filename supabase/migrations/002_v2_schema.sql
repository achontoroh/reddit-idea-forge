-- ============================================================
-- IdeaForge v2 — Schema Migration
-- ============================================================
-- DESTRUCTIVE: drops ideas.user_id, ideas.is_new columns.
-- Run against dev Supabase first. Do NOT run in production
-- without verifying data loss is acceptable.
-- ============================================================

-- ============================================================
-- NEW TABLES
-- ============================================================

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

CREATE TABLE public.idea_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote SMALLINT NOT NULL CHECK (vote IN (-1, 1)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(idea_id, user_id)
);

CREATE TABLE public.idea_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(idea_id, user_id)
);

CREATE TABLE public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES public.ideas(id),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(idea_id, user_id)
);

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

-- ============================================================
-- ALTER ideas TABLE
-- ============================================================

-- Drop old RLS policies that reference user_id
DROP POLICY IF EXISTS "Users can view own ideas" ON public.ideas;
DROP POLICY IF EXISTS "Users can insert own ideas" ON public.ideas;
DROP POLICY IF EXISTS "Users can delete own ideas" ON public.ideas;

-- Drop old index on user_id
DROP INDEX IF EXISTS idx_ideas_user_id;
-- Drop old index on score (will recreate as ai_score)
DROP INDEX IF EXISTS idx_ideas_score;

-- Drop columns
ALTER TABLE public.ideas DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.ideas DROP COLUMN IF EXISTS is_new;
ALTER TABLE public.ideas DROP COLUMN IF EXISTS read_at;

-- Rename columns
ALTER TABLE public.ideas RENAME COLUMN score TO ai_score;
ALTER TABLE public.ideas RENAME COLUMN score_breakdown TO ai_score_breakdown;

-- Add new columns
ALTER TABLE public.ideas ADD COLUMN target_audience TEXT;
ALTER TABLE public.ideas ADD COLUMN source_post_ids UUID[];
ALTER TABLE public.ideas ADD COLUMN community_score INTEGER DEFAULT 0;
ALTER TABLE public.ideas ADD COLUMN view_count INTEGER DEFAULT 0;
ALTER TABLE public.ideas ADD COLUMN mvp_complexity TEXT CHECK (mvp_complexity IN ('low', 'medium', 'high'));
ALTER TABLE public.ideas ADD COLUMN monetization_model TEXT CHECK (monetization_model IN ('subscription', 'one-time', 'freemium', 'marketplace'));
ALTER TABLE public.ideas ADD COLUMN expires_at TIMESTAMPTZ;

-- ============================================================
-- ALTER profiles TABLE
-- ============================================================

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- ============================================================
-- INDEXES
-- ============================================================

-- reddit_posts
CREATE INDEX idx_reddit_posts_subreddit ON public.reddit_posts(subreddit);
CREATE INDEX idx_reddit_posts_processed ON public.reddit_posts(processed);
CREATE INDEX idx_reddit_posts_expires_at ON public.reddit_posts(expires_at);

-- ideas (new indexes for renamed/new columns)
CREATE INDEX idx_ideas_ai_score ON public.ideas(ai_score DESC);
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

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.reddit_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- reddit_posts: authenticated can read, service_role manages writes
CREATE POLICY "Authenticated users can read reddit posts"
  ON public.reddit_posts FOR SELECT
  TO authenticated
  USING (TRUE);

-- ideas: authenticated can read non-expired, service_role manages writes
CREATE POLICY "Authenticated users can read active ideas"
  ON public.ideas FOR SELECT
  TO authenticated
  USING (expires_at IS NULL OR expires_at > NOW());

-- idea_votes
CREATE POLICY "Authenticated users can read all votes"
  ON public.idea_votes FOR SELECT
  TO authenticated
  USING (TRUE);
CREATE POLICY "Users can insert own votes"
  ON public.idea_votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own votes"
  ON public.idea_votes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own votes"
  ON public.idea_votes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- idea_views
CREATE POLICY "Users can read own views"
  ON public.idea_views FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own views"
  ON public.idea_views FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- user_favorites
CREATE POLICY "Users can read own favorites"
  ON public.user_favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites"
  ON public.user_favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites"
  ON public.user_favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- user_preferences
CREATE POLICY "Users can read own preferences"
  ON public.user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences"
  ON public.user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences"
  ON public.user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- TRIGGER FUNCTIONS
-- ============================================================

-- Recalculate community_score on ideas when votes change
CREATE OR REPLACE FUNCTION update_community_score()
RETURNS TRIGGER AS $$
DECLARE
  target_idea_id UUID;
BEGIN
  -- Determine which idea_id to update
  IF TG_OP = 'DELETE' THEN
    target_idea_id := OLD.idea_id;
  ELSE
    target_idea_id := NEW.idea_id;
  END IF;

  UPDATE public.ideas
  SET community_score = COALESCE(
    (SELECT SUM(vote) FROM public.idea_votes WHERE idea_id = target_idea_id),
    0
  )
  WHERE id = target_idea_id;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_idea_vote_change
  AFTER INSERT OR UPDATE OR DELETE ON public.idea_votes
  FOR EACH ROW EXECUTE FUNCTION update_community_score();

-- Increment view_count on ideas when a new view is recorded
CREATE OR REPLACE FUNCTION increment_view_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.ideas
  SET view_count = view_count + 1
  WHERE id = NEW.idea_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_idea_view_insert
  AFTER INSERT ON public.idea_views
  FOR EACH ROW EXECUTE FUNCTION increment_view_count();
