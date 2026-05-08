-- ============================================
-- CineCircle: Trending Movies Cache Table
-- ============================================
-- Caches daily trending movies from TMDB API
-- to reduce API calls and speed up page loads

CREATE TABLE IF NOT EXISTS trending_movies (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tmdb_id         INTEGER NOT NULL,
    title           VARCHAR(255) NOT NULL,
    overview        TEXT,
    poster_path     VARCHAR(255),
    backdrop_path   VARCHAR(255),
    release_date    VARCHAR(20),
    vote_average    DECIMAL(3,1),
    vote_count      INTEGER,
    genre_ids       INTEGER[] DEFAULT '{}',
    popularity      DECIMAL(10,3),
    rank            INTEGER NOT NULL,
    region          VARCHAR(10) DEFAULT 'global',
    fetch_date      DATE NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Unique constraint: one entry per movie per region per day
ALTER TABLE trending_movies
    ADD CONSTRAINT uq_trending_movie UNIQUE (tmdb_id, region, fetch_date);

-- Index for fast daily lookups
CREATE INDEX IF NOT EXISTS idx_trending_region_date ON trending_movies(region, fetch_date);

-- Enable Row Level Security
ALTER TABLE trending_movies ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read trending movies (public data)
CREATE POLICY "Anyone can read trending movies"
    ON trending_movies FOR SELECT
    USING (true);

-- Policy: Allow inserts (from API route)
CREATE POLICY "Allow trending inserts"
    ON trending_movies FOR INSERT
    WITH CHECK (true);

-- Policy: Allow deletes (for cleanup of old data)
CREATE POLICY "Allow trending deletes"
    ON trending_movies FOR DELETE
    USING (true);
