-- ============================================================
-- IdeaForge — Initial schema migration
-- Tables: profiles, ideas, subscriptions, email_logs
-- ============================================================

-- profiles — extends Supabase auth.users
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ideas — generated product ideas with scoring
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  pitch TEXT NOT NULL,
  pain_point TEXT NOT NULL,
  category TEXT NOT NULL,
  source_subreddit TEXT NOT NULL,
  source_url TEXT,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  score_breakdown JSONB NOT NULL DEFAULT '{}',
  is_new BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ideas_user_id ON ideas(user_id);
CREATE INDEX idx_ideas_category ON ideas(category);
CREATE INDEX idx_ideas_score ON ideas(score DESC);
CREATE INDEX idx_ideas_created_at ON ideas(created_at DESC);

-- subscriptions — email notification preferences per user
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  categories TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  unsubscribe_token UUID DEFAULT gen_random_uuid() UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- email_logs — tracks sent email notifications
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  idea_ids UUID[] NOT NULL DEFAULT '{}'
);

-- ============================================================
-- RLS Policies
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: users read/update own
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Ideas: users can only view their own ideas
CREATE POLICY "Users can view own ideas"
  ON ideas FOR SELECT USING (auth.uid() = user_id);
-- Ideas: users can only insert their own ideas
CREATE POLICY "Users can insert own ideas"
  ON ideas FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Ideas: users can only delete their own ideas
CREATE POLICY "Users can delete own ideas"
  ON ideas FOR DELETE USING (auth.uid() = user_id);

-- Subscriptions: users CRUD own
CREATE POLICY "Users can read own subscriptions"
  ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscriptions"
  ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscriptions"
  ON subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- Email logs: users read own
CREATE POLICY "Users can read own email logs"
  ON email_logs FOR SELECT USING (
    subscription_id IN (SELECT id FROM subscriptions WHERE user_id = auth.uid())
  );
