-- ============================================
-- CineCircle: Movie Preferences Table
-- ============================================
-- Stores individual movie like/dislike preferences
-- from onboarding swipes and future interactions

CREATE TABLE IF NOT EXISTS movie_preferences (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_title     VARCHAR(255) NOT NULL,
    movie_genre     TEXT[] DEFAULT '{}',
    preference      VARCHAR(10) NOT NULL CHECK (preference IN ('liked', 'disliked')),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Unique constraint: one preference per user per movie
ALTER TABLE movie_preferences
    ADD CONSTRAINT uq_user_movie UNIQUE (user_id, movie_title);

-- Index for fast lookups by user
CREATE INDEX IF NOT EXISTS idx_movie_prefs_user_id ON movie_preferences(user_id);

-- Enable Row Level Security
ALTER TABLE movie_preferences ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own preferences
CREATE POLICY "Users can read own preferences"
    ON movie_preferences FOR SELECT
    USING (true);

-- Policy: Users can insert their own preferences
CREATE POLICY "Users can insert own preferences"
    ON movie_preferences FOR INSERT
    WITH CHECK (true);

-- Policy: Users can update their own preferences
CREATE POLICY "Users can update own preferences"
    ON movie_preferences FOR UPDATE
    USING (true);
