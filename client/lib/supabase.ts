import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key";

// Track connection status
let isSupabaseConnected: boolean | null = null;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Check if Supabase is reachable
export async function checkSupabaseConnection(): Promise<boolean> {
  if (isSupabaseConnected !== null) {
    return isSupabaseConnected;
  }

  try {
    // Simple ping to check connectivity - this won't throw on 401
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'apikey': supabaseAnonKey,
      }
    });

    clearTimeout(timeout);
    isSupabaseConnected = response.ok || response.status === 400; // 400 means connected but no table specified
    return isSupabaseConnected;
  } catch (error) {
    console.warn('Supabase connection check failed:', error);
    isSupabaseConnected = false;
    return false;
  }
}

// Get connection status (synchronous)
export function getSupabaseConnectionStatus(): boolean | null {
  return isSupabaseConnected;
}

// Reset connection status (for retry)
export function resetConnectionStatus(): void {
  isSupabaseConnected = null;
}

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
