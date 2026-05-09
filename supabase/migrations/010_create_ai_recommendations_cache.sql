-- ============================================
-- CineCircle: AI Recommendations Daily Cache
-- ============================================
-- Caches the N8N webhook response per user per day
-- so we only call the AI service once daily.

CREATE TABLE IF NOT EXISTS ai_recommendations_cache (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    fetch_date      DATE NOT NULL,
    response_data   JSONB NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- One cached response per user per day
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_ai_rec_user_date') THEN
    ALTER TABLE ai_recommendations_cache
      ADD CONSTRAINT uq_ai_rec_user_date UNIQUE (user_id, fetch_date);
  END IF;
END $$;

-- Fast lookup by user + date
CREATE INDEX IF NOT EXISTS idx_ai_rec_user_date ON ai_recommendations_cache(user_id, fetch_date);

-- Enable Row Level Security
ALTER TABLE ai_recommendations_cache ENABLE ROW LEVEL SECURITY;

-- Anyone can read (needed by the API route which uses anon key)
DROP POLICY IF EXISTS "Anyone can read ai_recommendations_cache" ON ai_recommendations_cache;
CREATE POLICY "Anyone can read ai_recommendations_cache"
    ON ai_recommendations_cache FOR SELECT
    USING (true);

-- Allow inserts from API route
DROP POLICY IF EXISTS "Allow ai_rec inserts" ON ai_recommendations_cache;
CREATE POLICY "Allow ai_rec inserts"
    ON ai_recommendations_cache FOR INSERT
    WITH CHECK (true);

-- Allow updates for upsert
DROP POLICY IF EXISTS "Allow ai_rec updates" ON ai_recommendations_cache;
CREATE POLICY "Allow ai_rec updates"
    ON ai_recommendations_cache FOR UPDATE
    USING (true);

-- Allow deletes for cleanup of old cache entries
DROP POLICY IF EXISTS "Allow ai_rec deletes" ON ai_recommendations_cache;
CREATE POLICY "Allow ai_rec deletes"
    ON ai_recommendations_cache FOR DELETE
    USING (true);
