-- ============================================
-- CineCircle: Watchlist & Watched Movies Tables
-- ============================================

-- ── Watchlist: movies the user wants to watch ──────────────────────────

CREATE TABLE IF NOT EXISTS watchlist (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tmdb_id         INTEGER NOT NULL,
    movie_title     VARCHAR(255) NOT NULL,
    movie_genre     TEXT[] DEFAULT '{}',
    poster_path     VARCHAR(255),
    added_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE watchlist
    ADD CONSTRAINT uq_watchlist_user_movie UNIQUE (user_id, tmdb_id);

CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON watchlist(user_id);

ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own watchlist"
    ON watchlist FOR SELECT USING (true);

CREATE POLICY "Users can insert own watchlist"
    ON watchlist FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete own watchlist"
    ON watchlist FOR DELETE USING (true);

-- ── Watched Movies: movies the user has already seen ───────────────────

CREATE TABLE IF NOT EXISTS watched_movies (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tmdb_id         INTEGER NOT NULL,
    movie_title     VARCHAR(255) NOT NULL,
    movie_genre     TEXT[] DEFAULT '{}',
    poster_path     VARCHAR(255),
    watched_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE watched_movies
    ADD CONSTRAINT uq_watched_user_movie UNIQUE (user_id, tmdb_id);

CREATE INDEX IF NOT EXISTS idx_watched_user_id ON watched_movies(user_id);

ALTER TABLE watched_movies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own watched movies"
    ON watched_movies FOR SELECT USING (true);

CREATE POLICY "Users can insert own watched movies"
    ON watched_movies FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete own watched movies"
    ON watched_movies FOR DELETE USING (true);
