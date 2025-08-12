-- CareerCompass AI Database Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  provider TEXT CHECK (provider IN ('google', 'github', 'email')) DEFAULT 'email',
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  location TEXT,
  bio TEXT,
  job_title TEXT,
  company TEXT,
  experience TEXT,
  education TEXT,
  skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  interests TEXT[] DEFAULT ARRAY[]::TEXT[],
  social_links JSONB DEFAULT '{}'::JSONB,
  preferences JSONB DEFAULT '{
    "email_notifications": true,
    "sms_notifications": false,
    "career_tips": true,
    "goal_reminders": true,
    "profile_visibility": "public"
  }'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger to profiles table
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create user_goals table for goal tracking
CREATE TABLE user_goals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('career', 'skill', 'education', 'personal')) DEFAULT 'career',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed', 'paused')) DEFAULT 'not_started',
  target_date DATE,
  milestones JSONB DEFAULT '[]'::JSONB,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add updated_at trigger to user_goals table
CREATE TRIGGER user_goals_updated_at
  BEFORE UPDATE ON user_goals
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create career_tips table for daily tips
CREATE TABLE career_tips (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT CHECK (category IN ('interview', 'resume', 'networking', 'skills', 'salary', 'general')) DEFAULT 'general',
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  author TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add updated_at trigger to career_tips table
CREATE TRIGGER career_tips_updated_at
  BEFORE UPDATE ON career_tips
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create user_interactions table for tracking user engagement
CREATE TABLE user_interactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  interaction_type TEXT NOT NULL, -- 'chat_message', 'tip_read', 'goal_created', etc.
  content JSONB DEFAULT '{}'::JSONB,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create chat_sessions table for AI chat history
CREATE TABLE chat_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  session_name TEXT,
  messages JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add updated_at trigger to chat_sessions table
CREATE TRIGGER chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Public profiles policy (for public visibility)
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (
    preferences->>'profile_visibility' = 'public'
  );

-- User goals policies
CREATE POLICY "Users can manage their own goals" ON user_goals
  FOR ALL USING (auth.uid() = user_id);

-- Career tips policies (public read access)
CREATE POLICY "Anyone can read career tips" ON career_tips
  FOR SELECT USING (true);

-- User interactions policies
CREATE POLICY "Users can manage their own interactions" ON user_interactions
  FOR ALL USING (auth.uid() = user_id);

-- Chat sessions policies
CREATE POLICY "Users can manage their own chat sessions" ON chat_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name, provider, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_app_meta_data->>'provider', 'email'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Insert some sample career tips
INSERT INTO career_tips (title, content, category, difficulty, tags) VALUES 
(
  'Master the STAR Method for Interviews',
  'Use the STAR method (Situation, Task, Action, Result) to structure your behavioral interview answers. This helps you tell compelling stories that demonstrate your skills and experience.',
  'interview',
  'beginner',
  ARRAY['interview', 'behavioral', 'storytelling']
),
(
  'Optimize Your LinkedIn Profile',
  'Use keywords relevant to your industry in your headline and summary. Post regularly and engage with others'' content to increase your visibility to recruiters.',
  'networking',
  'intermediate',
  ARRAY['linkedin', 'networking', 'personal-brand']
),
(
  'Negotiate Your Salary Effectively',
  'Research market rates using sites like Glassdoor and PayScale. Practice your negotiation pitch and always negotiate the entire compensation package, not just base salary.',
  'salary',
  'advanced',
  ARRAY['salary', 'negotiation', 'compensation']
),
(
  'Build a Strong Portfolio',
  'Showcase 3-5 of your best projects that demonstrate different skills. Include the problem you solved, your approach, and the results achieved.',
  'skills',
  'intermediate',
  ARRAY['portfolio', 'projects', 'showcase']
),
(
  'Network Strategically',
  'Focus on building genuine relationships rather than just collecting contacts. Offer help to others before asking for favors.',
  'networking',
  'beginner',
  ARRAY['networking', 'relationships', 'community']
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_provider ON profiles(provider);
CREATE INDEX idx_user_goals_user_id ON user_goals(user_id);
CREATE INDEX idx_user_goals_status ON user_goals(status);
CREATE INDEX idx_career_tips_category ON career_tips(category);
CREATE INDEX idx_career_tips_featured ON career_tips(is_featured);
CREATE INDEX idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX idx_user_interactions_type ON user_interactions(interaction_type);
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
