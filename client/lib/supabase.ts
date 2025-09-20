import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://lecxlfydxnayerxjxraz.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlY3hsZnlkeG5heWVyeGp4cmF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0Nzg1MTAsImV4cCI6MjA3MjA1NDUxMH0.rjMcmfV9dDqXubMXa0j767kV6GlCX4tr5ii3DBBL1PE";

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database types for better TypeScript support
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url?: string;
          provider: "google" | "github" | "email";
          first_name?: string;
          last_name?: string;
          phone?: string;
          date_of_birth?: string;
          location?: string;
          bio?: string;
          job_title?: string;
          company?: string;
          experience?: string;
          education?: string;
          skills?: string[];
          interests?: string[];
          social_links?: {
            linkedin?: string;
            github?: string;
            twitter?: string;
            portfolio?: string;
          };
          preferences?: {
            email_notifications?: boolean;
            sms_notifications?: boolean;
            career_tips?: boolean;
            goal_reminders?: boolean;
            profile_visibility?: "public" | "private";
          };
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          avatar_url?: string;
          provider: "google" | "github" | "email";
          first_name?: string;
          last_name?: string;
          phone?: string;
          date_of_birth?: string;
          location?: string;
          bio?: string;
          job_title?: string;
          company?: string;
          experience?: string;
          education?: string;
          skills?: string[];
          interests?: string[];
          social_links?: {
            linkedin?: string;
            github?: string;
            twitter?: string;
            portfolio?: string;
          };
          preferences?: {
            email_notifications?: boolean;
            sms_notifications?: boolean;
            career_tips?: boolean;
            goal_reminders?: boolean;
            profile_visibility?: "public" | "private";
          };
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar_url?: string;
          provider?: "google" | "github" | "email";
          first_name?: string;
          last_name?: string;
          phone?: string;
          date_of_birth?: string;
          location?: string;
          bio?: string;
          job_title?: string;
          company?: string;
          experience?: string;
          education?: string;
          skills?: string[];
          interests?: string[];
          social_links?: {
            linkedin?: string;
            github?: string;
            twitter?: string;
            portfolio?: string;
          };
          preferences?: {
            email_notifications?: boolean;
            sms_notifications?: boolean;
            career_tips?: boolean;
            goal_reminders?: boolean;
            profile_visibility?: "public" | "private";
          };
          updated_at?: string;
        };
      };
    };
  };
}
