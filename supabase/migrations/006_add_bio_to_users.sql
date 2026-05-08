-- ============================================
-- Add bio column to users table
-- ============================================
-- Allows users to set a short bio/tagline on their profile

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS bio VARCHAR(160);
