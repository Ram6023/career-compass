# 🚀 Supabase Setup Guide for CareerCompass AI

This guide will walk you through setting up Supabase database integration for user authentication and data storage.

## 📋 Prerequisites

- [Supabase account](https://app.supabase.com) (free tier available)
- Node.js 18+ installed
- Basic understanding of SQL

## 🛠️ Step 1: Create Supabase Project

1. **Sign up/Log in** to [Supabase](https://app.supabase.com)
2. **Create a new project**:

   - Click "New project"
   - Choose your organization
   - Name: `career-compass-ai`
   - Database password: Choose a strong password
   - Region: Select closest to your users
   - Click "Create new project"

3. **Wait for setup** (usually takes 2-3 minutes)

## 🔑 Step 2: Get API Keys

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the following values:
   - **Project URL** (looks like: `https://xxx.supabase.co`)
   - **Anon public key** (safe to use in frontend)
   - **Service role key** (keep secret, for server operations)

## 📝 Step 3: Configure Environment Variables

1. **Copy the environment template**:

   ```bash
   cp .env.example .env
   ```

2. **Update `.env` file** with your Supabase values:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

## 🗃️ Step 4: Set Up Database Schema

1. **Open SQL Editor** in your Supabase dashboard
2. **Copy and paste** the contents of `supabase-schema.sql`
3. **Run the query** to create all tables and policies

The schema includes:

- ✅ User profiles table
- ✅ User goals table
- ✅ Career tips table
- ✅ Chat sessions table
- ✅ User interactions table
- ✅ Row Level Security (RLS) policies
- ✅ Storage bucket for avatars
- ✅ Automatic profile creation triggers

## 🔐 Step 5: Configure Authentication

### Enable Auth Providers

1. Go to **Authentication** → **Settings** in Supabase
2. **Configure Site URL**:

   - Development: `http://localhost:5173`
   - Production: `https://your-domain.com`

3. **Add Redirect URLs**:
   - `http://localhost:5173/auth/callback`
   - `https://your-domain.com/auth/callback`

### Set Up OAuth (Optional)

#### Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
6. Copy Client ID to your `.env` file:
   ```env
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```
7. In Supabase, go to **Authentication** → **Settings** → **Auth Providers**
8. Enable Google and paste your Client ID and Client Secret

#### GitHub OAuth:

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Create a new OAuth App:
   - Homepage URL: `http://localhost:5173`
   - Authorization callback URL: `https://your-project-ref.supabase.co/auth/v1/callback`
3. Copy Client ID to your `.env` file:
   ```env
   VITE_GITHUB_CLIENT_ID=your-github-client-id
   ```
4. In Supabase, enable GitHub provider with your credentials

## 📦 Step 6: Install Dependencies

```bash
npm install
```

This will install the Supabase client library and other dependencies.

## 🚀 Step 7: Start Development Server

```bash
npm run dev
```

Your app should now be running with Supabase integration!

## ✅ Step 8: Test Authentication

1. **Open your app** at `http://localhost:5173`
2. **Try registering** a new account with email/password
3. **Check Supabase dashboard** → **Authentication** to see the new user
4. **Check Table Editor** → **profiles** to see the auto-created profile
5. **Test OAuth** (if configured) with Google/GitHub

## 📊 Step 9: Monitor and Debug

### Useful Supabase Dashboard Sections:

- **Authentication**: View users and sessions
- **Table Editor**: Browse and edit data
- **SQL Editor**: Run custom queries
- **Logs**: Debug authentication and database issues
- **Storage**: Manage uploaded files

### Common Issues:

#### Authentication not working:

- Check redirect URLs are correct
- Verify API keys in environment variables
- Check browser console for errors

#### Database connection issues:

- Ensure RLS policies are set up correctly
- Check if user has proper permissions
- Verify schema was created successfully

#### OAuth redirect issues:

- Double-check callback URLs in OAuth provider settings
- Ensure Supabase auth settings match your domain

## 🔧 Advanced Configuration

### Custom Email Templates

1. Go to **Authentication** → **Settings** → **Email Templates**
2. Customize signup, recovery, and other email templates

### Database Backups

1. Go to **Settings** → **Database**
2. Set up automated backups for production

### Performance Monitoring

1. Go to **Reports** to monitor database performance
2. Set up alerts for high usage

## 🏗️ Database Schema Overview

```sql
-- Main tables created:
profiles              -- User profile information
user_goals           -- Goal tracking system
career_tips          -- Daily career advice
user_interactions    -- User activity tracking
chat_sessions        -- AI chat history

-- Storage buckets:
avatars              -- Profile picture uploads
```

## 🔄 Next Steps

1. **Deploy to production** and update environment variables
2. **Set up monitoring** and error tracking
3. **Configure email notifications** for user actions
4. **Add additional features** like file uploads, advanced analytics
5. **Implement real-time features** using Supabase realtime subscriptions

## 🆘 Getting Help

- **Supabase Documentation**: [docs.supabase.com](https://docs.supabase.com)
- **Community Discord**: [discord.supabase.com](https://discord.supabase.com)
- **GitHub Issues**: [github.com/supabase/supabase](https://github.com/supabase/supabase)

## 📈 Production Checklist

Before going live:

- [ ] Update environment variables for production
- [ ] Configure proper redirect URLs
- [ ] Set up database backups
- [ ] Enable 2FA on Supabase account
- [ ] Monitor rate limits and usage
- [ ] Set up proper error handling
- [ ] Test all authentication flows

---

🎉 **Congratulations!** Your CareerCompass AI app is now connected to Supabase with full authentication and database capabilities.
