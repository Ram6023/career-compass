import { supabase, checkSupabaseConnection } from "./supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: "google" | "github" | "email";
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  location?: string;
  bio?: string;
  jobTitle?: string;
  company?: string;
  experience?: string;
  education?: string;
  skills?: string[];
  interests?: string[];
  // Education details
  degree?: string;
  university?: string;
  yearOfStudy?: string;
  stream?: string;
  // Career preferences
  preferredRoles?: string[];
  preferredDomains?: string[];
  workType?: "remote" | "hybrid" | "onsite" | "";
  preferredLocations?: string[];
  // Resume
  resumeScore?: number;
  resumeUrl?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
  };
  preferences?: {
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    careerTips?: boolean;
    goalReminders?: boolean;
    profileVisibility?: "public" | "private";
  };
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

class AuthService {
  private currentUser: User | null = null;

  constructor() {
    // Listen for auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        this.loadUserProfile(session.user.id).then(() => {
          // Dispatch custom event when auth state changes
          window.dispatchEvent(new CustomEvent('authStateChanged'));
        });
      } else if (event === "SIGNED_OUT") {
        this.currentUser = null;
        // Dispatch custom event when auth state changes
        window.dispatchEvent(new CustomEvent('authStateChanged'));
      }
    });

    // Initialize user on startup
    this.initializeUser();
  }

  private async initializeUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.user) {
      await this.loadUserProfile(session.user.id);
    }
  }

  private async loadUserProfile(userId: string): Promise<User | null> {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        // Silently handle profile not found (expected for new users)
        if (error.code !== 'PGRST116') {
          console.warn("Profile not found or error:", error.message);
        }
        return null;
      }

      if (profile) {
        this.currentUser = this.transformSupabaseProfile(profile);
        return this.currentUser;
      }

      return null;
    } catch (error) {
      // Only log unexpected errors
      console.warn("Unexpected error in loadUserProfile:", error);
      return null;
    }
  }

  private transformSupabaseProfile(profile: any): User {
    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      avatar: profile.avatar_url,
      provider: profile.provider,
      firstName: profile.first_name,
      lastName: profile.last_name,
      phone: profile.phone,
      dateOfBirth: profile.date_of_birth,
      location: profile.location,
      bio: profile.bio,
      jobTitle: profile.job_title,
      company: profile.company,
      experience: profile.experience,
      education: profile.education,
      skills: profile.skills,
      interests: profile.interests,
      // Education details
      degree: profile.degree,
      university: profile.university,
      yearOfStudy: profile.year_of_study,
      stream: profile.stream,
      // Career preferences
      preferredRoles: profile.preferred_roles,
      preferredDomains: profile.preferred_domains,
      workType: profile.work_type,
      preferredLocations: profile.preferred_locations,
      // Resume
      resumeScore: profile.resume_score,
      resumeUrl: profile.resume_url,
      socialLinks: profile.social_links
        ? {
          linkedin: profile.social_links.linkedin,
          github: profile.social_links.github,
          twitter: profile.social_links.twitter,
          portfolio: profile.social_links.portfolio,
        }
        : undefined,
      preferences: profile.preferences
        ? {
          emailNotifications: profile.preferences.email_notifications,
          smsNotifications: profile.preferences.sms_notifications,
          careerTips: profile.preferences.career_tips,
          goalReminders: profile.preferences.goal_reminders,
          profileVisibility: profile.preferences.profile_visibility,
        }
        : undefined,
    };
  }

  private async createUserProfile(
    user: SupabaseUser,
    additionalData?: Partial<User>,
  ): Promise<User | null> {
    try {
      const profileData = {
        id: user.id,
        email: user.email || "",
        name:
          additionalData?.name ||
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "User",
        avatar_url: user.user_metadata?.avatar_url || additionalData?.avatar,
        provider:
          (user.app_metadata?.provider as "google" | "github" | "email") ||
          "email",
        first_name: additionalData?.firstName || user.user_metadata?.first_name,
        last_name: additionalData?.lastName || user.user_metadata?.last_name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        preferences: {
          email_notifications: true,
          sms_notifications: false,
          career_tips: true,
          goal_reminders: true,
          profile_visibility: "public",
        },
      };

      const { data: profile, error } = await supabase
        .from("profiles")
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error("Error creating profile:", error);
        return null;
      }

      this.currentUser = this.transformSupabaseProfile(profile);
      return this.currentUser;
    } catch (error) {
      console.error("Error in createUserProfile:", error);
      return null;
    }
  }

  // Google OAuth authentication
  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      // Check Supabase connection first
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        return {
          success: false,
          error: "Unable to connect to authentication service. Please check your internet connection or try again later.",
        };
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        user: this.currentUser || undefined,
      };
    } catch (error) {
      return {
        success: false,
        error: "Google authentication failed. The authentication service may be unavailable.",
      };
    }
  }

  // GitHub OAuth authentication
  async signInWithGitHub(): Promise<AuthResponse> {
    try {
      // Check Supabase connection first
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        return {
          success: false,
          error: "Unable to connect to authentication service. Please check your internet connection or try again later.",
        };
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        user: this.currentUser || undefined,
      };
    } catch (error) {
      return {
        success: false,
        error: "GitHub authentication failed. The authentication service may be unavailable.",
      };
    }
  }

  // Email/password authentication
  async signInWithEmail(
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    try {
      // Check Supabase connection first
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        return {
          success: false,
          error: "Unable to connect to authentication service. Please check your internet connection or try again later.",
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      if (data.user) {
        const user = await this.loadUserProfile(data.user.id);
        return {
          success: true,
          user: user || undefined,
          token: data.session?.access_token,
        };
      }

      return {
        success: false,
        error: "Authentication failed",
      };
    } catch (error) {
      return {
        success: false,
        error: "Email authentication failed. The authentication service may be unavailable.",
      };
    }
  }

  // Dev-only: Sign in as guest (no Supabase session)
  async signInAsGuest(): Promise<AuthResponse> {
    try {
      const enabled = import.meta.env.VITE_ENABLE_GUEST_LOGIN === "true";
      if (!enabled) {
        return { success: false, error: "Guest login disabled" };
      }
      this.currentUser = {
        id: "guest-user",
        email: "guest@example.com",
        name: "Guest User",
        provider: "email",
      };
      // Dispatch custom event when auth state changes
      window.dispatchEvent(new CustomEvent('authStateChanged'));
      return { success: true, user: this.currentUser };
    } catch (error) {
      return { success: false, error: "Guest login failed" };
    }
  }

  // Registration with email
  async registerWithEmail(
    name: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    try {
      // Check Supabase connection first
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        return {
          success: false,
          error: "Unable to connect to authentication service. Please check your internet connection or try again later.",
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      if (data.user) {
        // Create user profile
        const user = await this.createUserProfile(data.user, { name });

        return {
          success: true,
          user: user || undefined,
          token: data.session?.access_token,
        };
      }

      return {
        success: false,
        error: "Registration failed",
      };
    } catch (error) {
      return {
        success: false,
        error: "Registration failed. The authentication service may be unavailable.",
      };
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await supabase.auth.signOut();
      this.currentUser = null;
      // Dispatch custom event when auth state changes
      window.dispatchEvent(new CustomEvent('authStateChanged'));
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return !!session?.user;
    } catch {
      return false;
    }
  }

  // Synchronous version for immediate checks
  isAuthenticatedSync(): boolean {
    return !!this.currentUser;
  }

  // Update user profile
  async updateProfile(profileData: Partial<User>): Promise<AuthResponse> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          error: "User not logged in",
        };
      }

      // Transform camelCase to snake_case for database
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (profileData.name) updateData.name = profileData.name;
      if (profileData.firstName) updateData.first_name = profileData.firstName;
      if (profileData.lastName) updateData.last_name = profileData.lastName;
      if (profileData.phone) updateData.phone = profileData.phone;
      if (profileData.dateOfBirth)
        updateData.date_of_birth = profileData.dateOfBirth;
      if (profileData.location) updateData.location = profileData.location;
      if (profileData.bio) updateData.bio = profileData.bio;
      if (profileData.jobTitle) updateData.job_title = profileData.jobTitle;
      if (profileData.company) updateData.company = profileData.company;
      if (profileData.experience)
        updateData.experience = profileData.experience;
      if (profileData.education) updateData.education = profileData.education;
      if (profileData.skills) updateData.skills = profileData.skills;
      if (profileData.interests) updateData.interests = profileData.interests;
      if (profileData.avatar) updateData.avatar_url = profileData.avatar;
      // Education details
      if (profileData.degree !== undefined) updateData.degree = profileData.degree;
      if (profileData.university !== undefined) updateData.university = profileData.university;
      if (profileData.yearOfStudy !== undefined) updateData.year_of_study = profileData.yearOfStudy;
      if (profileData.stream !== undefined) updateData.stream = profileData.stream;
      // Career preferences
      if (profileData.preferredRoles) updateData.preferred_roles = profileData.preferredRoles;
      if (profileData.preferredDomains) updateData.preferred_domains = profileData.preferredDomains;
      if (profileData.workType !== undefined) updateData.work_type = profileData.workType;
      if (profileData.preferredLocations) updateData.preferred_locations = profileData.preferredLocations;
      // Resume
      if (profileData.resumeScore !== undefined) updateData.resume_score = profileData.resumeScore;
      if (profileData.resumeUrl !== undefined) updateData.resume_url = profileData.resumeUrl;

      if (profileData.socialLinks) {
        updateData.social_links = {
          linkedin: profileData.socialLinks.linkedin,
          github: profileData.socialLinks.github,
          twitter: profileData.socialLinks.twitter,
          portfolio: profileData.socialLinks.portfolio,
        };
      }

      if (profileData.preferences) {
        updateData.preferences = {
          email_notifications: profileData.preferences.emailNotifications,
          sms_notifications: profileData.preferences.smsNotifications,
          career_tips: profileData.preferences.careerTips,
          goal_reminders: profileData.preferences.goalReminders,
          profile_visibility: profileData.preferences.profileVisibility,
        };
      }

      const { data: updatedProfile, error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", currentUser.id)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      this.currentUser = this.transformSupabaseProfile(updatedProfile);

      return {
        success: true,
        user: this.currentUser,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to update profile",
      };
    }
  }

  // Upload profile picture to Supabase Storage
  async uploadProfilePicture(
    file: File,
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return { success: false, error: "User not logged in" };
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${currentUser.id}/avatar.${fileExt}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        return { success: false, error: uploadError.message };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const avatarUrl = urlData.publicUrl;

      // Update user profile with new avatar URL
      await this.updateProfile({ avatar: avatarUrl });

      return { success: true, url: avatarUrl };
    } catch (error) {
      return { success: false, error: "Upload failed" };
    }
  }

  // Reset password
  async resetPassword(
    email: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: "Password reset failed" };
    }
  }

  // Update password
  async updatePassword(
    newPassword: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: "Password update failed" };
    }
  }

  // Get session
  async getSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  }
}

// Export singleton instance
export const authService = new AuthService();

// OAuth Provider URLs (still available for manual implementation if needed)
export const OAUTH_URLS = {
  google: {
    authUrl: "https://accounts.google.com/oauth/authorize",
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id",
    redirectUri: `${window.location.origin}/auth/callback`,
    scope: "openid email profile",
  },
  github: {
    authUrl: "https://github.com/login/oauth/authorize",
    clientId: import.meta.env.VITE_GITHUB_CLIENT_ID || "your-github-client-id",
    redirectUri: `${window.location.origin}/auth/callback`,
    scope: "user:email",
  },
};

// Helper function to build OAuth URL (for manual implementation if needed)
export function buildOAuthUrl(provider: "google" | "github"): string {
  const config = OAUTH_URLS[provider];
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope,
    response_type: "code",
    state: Math.random().toString(36).substr(2, 15), // CSRF protection
  });

  return `${config.authUrl}?${params.toString()}`;
}
