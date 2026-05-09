-- ============================================
-- CineCircle: Follows Table (Social Graph)
-- ============================================
-- Enables the CineMates follow/unfollow system.
-- Powers follower/following counts, friend circles,
-- and "From Your Circle" recommendations.

CREATE TABLE IF NOT EXISTS follows (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Each user can only follow another user once
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_follow') THEN
    ALTER TABLE follows ADD CONSTRAINT uq_follow UNIQUE (follower_id, following_id);
  END IF;
END $$;

-- Prevent self-follows
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'no_self_follow') THEN
    ALTER TABLE follows ADD CONSTRAINT no_self_follow CHECK (follower_id != following_id);
  END IF;
END $$;

-- Fast lookups: "who do I follow?" and "who follows me?"
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);

-- Enable Row Level Security
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Everyone can see follow relationships (needed for counts on profiles)
DROP POLICY IF EXISTS "Anyone can read follows" ON follows;
CREATE POLICY "Anyone can read follows" ON follows FOR SELECT USING (true);

-- Users can follow others
DROP POLICY IF EXISTS "Users can insert follows" ON follows;
CREATE POLICY "Users can insert follows" ON follows FOR INSERT WITH CHECK (true);

-- Users can unfollow
DROP POLICY IF EXISTS "Users can delete follows" ON follows;
CREATE POLICY "Users can delete follows" ON follows FOR DELETE USING (true);
