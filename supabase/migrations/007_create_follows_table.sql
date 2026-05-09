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
ALTER TABLE follows
    ADD CONSTRAINT uq_follow UNIQUE (follower_id, following_id);

-- Prevent self-follows
ALTER TABLE follows
    ADD CONSTRAINT no_self_follow CHECK (follower_id != following_id);

-- Fast lookups: "who do I follow?" and "who follows me?"
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);

-- Enable Row Level Security
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Everyone can see follow relationships (needed for counts on profiles)
CREATE POLICY "Anyone can read follows"
    ON follows FOR SELECT USING (true);

-- Users can follow others
CREATE POLICY "Users can insert follows"
    ON follows FOR INSERT WITH CHECK (true);

-- Users can unfollow
CREATE POLICY "Users can delete follows"
    ON follows FOR DELETE USING (true);
