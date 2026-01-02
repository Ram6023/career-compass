-- Profile Schema Update for Education & Career Preferences
-- Run this in your Supabase SQL Editor

-- Education details
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS degree TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS university TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS year_of_study TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stream TEXT;

-- Career preferences
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_roles TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_domains TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS work_type TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_locations TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Resume score (cached from AI analysis)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS resume_score INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS resume_url TEXT;
