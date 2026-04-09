# Database Schema

## Tables

### profiles
Extends Supabase `auth.users`. Created automatically on registration via trigger.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
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
```

### ideas
Generated product ideas with scoring.

```sql
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
```

**score_breakdown JSONB structure:**
```json
{
  "pain_intensity": 22,
  "willingness_to_pay": 18,
  "competition": 20,
  "tam": 15
}
```
Each component: 0-25. Sum = total score (0-100).

### subscriptions
Email notification preferences per user.

```sql
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
```

### email_logs
Tracks sent email notifications.

```sql
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  idea_ids UUID[] NOT NULL DEFAULT '{}'
);
```

## RLS Policies

```sql
-- Enable RLS on all tables
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
-- Unsubscribe by token (no auth required — uses service_role on server)

-- Email logs: users read own
CREATE POLICY "Users can read own email logs"
  ON email_logs FOR SELECT USING (
    subscription_id IN (SELECT id FROM subscriptions WHERE user_id = auth.uid())
  );
```

## TypeScript Types

```typescript
// src/lib/types/idea.ts
export interface ScoreBreakdown {
  pain_intensity: number
  willingness_to_pay: number
  competition: number
  tam: number
}

export interface Idea {
  id: string
  user_id: string
  title: string
  pitch: string
  pain_point: string
  category: string
  source_subreddit: string
  source_url: string | null
  score: number
  score_breakdown: ScoreBreakdown
  is_new: boolean
  created_at: string
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

## Migration file
Save as `supabase/migrations/001_init.sql` and execute via Supabase Dashboard → SQL Editor.
