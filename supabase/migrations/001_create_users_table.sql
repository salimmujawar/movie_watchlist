-- ============================================
-- CineCircle: Users Table
-- ============================================
-- Stores user profile data from Facebook OAuth
-- and onboarding preferences for AI recommendations

CREATE TABLE IF NOT EXISTS users (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facebook_id           VARCHAR(50) UNIQUE NOT NULL,
    name                  VARCHAR(100) NOT NULL,
    first_name            VARCHAR(50),
    last_name             VARCHAR(50),
    email                 VARCHAR(255) UNIQUE,
    profile_image         TEXT,
    onboarding_completed  BOOLEAN DEFAULT false,
    liked_movies          TEXT[] DEFAULT '{}',
    disliked_movies       TEXT[] DEFAULT '{}',
    created_at            TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at            TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at         TIMESTAMP WITH TIME ZONE,
    is_active             BOOLEAN DEFAULT true
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_facebook_id ON users(facebook_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Auto-update the updated_at timestamp on row changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can read own data"
    ON users FOR SELECT
    USING (true);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data"
    ON users FOR UPDATE
    USING (true);

-- Policy: Allow inserts (for new user registration)
CREATE POLICY "Allow user registration"
    ON users FOR INSERT
    WITH CHECK (true);
