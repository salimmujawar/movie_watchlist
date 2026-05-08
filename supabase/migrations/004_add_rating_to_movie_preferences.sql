-- ============================================
-- Add rating column to movie_preferences
-- ============================================
-- Allows users to rate movies 1-5 stars from the
-- movie detail page, stored alongside like/dislike

-- Add rating column (nullable — onboarding swipes won't have one)
ALTER TABLE movie_preferences
    ADD COLUMN IF NOT EXISTS rating SMALLINT CHECK (rating >= 1 AND rating <= 5);

-- Add tmdb_id so we can look up preferences by TMDB movie ID
ALTER TABLE movie_preferences
    ADD COLUMN IF NOT EXISTS tmdb_id INTEGER;

-- Expand the preference check to allow 'rated' for star-only ratings
ALTER TABLE movie_preferences
    DROP CONSTRAINT IF EXISTS movie_preferences_preference_check;

ALTER TABLE movie_preferences
    ADD CONSTRAINT movie_preferences_preference_check
    CHECK (preference IN ('liked', 'disliked', 'rated'));

-- Index for fast lookup by tmdb_id
CREATE INDEX IF NOT EXISTS idx_movie_prefs_tmdb_id ON movie_preferences(tmdb_id);
