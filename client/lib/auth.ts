// OAuth Authentication Service
// In a real application, this would integrate with actual OAuth providers

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'github' | 'email';
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
    profileVisibility?: 'public' | 'private';
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

  // Simulate Google OAuth flow
  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      // In a real app, this would redirect to Google OAuth
      // For demo purposes, we'll simulate the process
      
      console.log('Initiating Google OAuth...');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful Google auth response
      const mockGoogleUser: User = {
        id: 'google_' + Math.random().toString(36).substr(2, 9),
        email: 'user@gmail.com',
        name: 'John Doe',
        avatar: 'https://via.placeholder.com/40',
        provider: 'google'
      };
      
      this.currentUser = mockGoogleUser;
      
      // Store auth token in localStorage
      const mockToken = 'google_token_' + Math.random().toString(36).substr(2, 20);
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockGoogleUser));
      
      return {
        success: true,
        user: mockGoogleUser,
        token: mockToken
      };
    } catch (error) {
      return {
        success: false,
        error: 'Google authentication failed'
      };
    }
  }

  // Simulate GitHub OAuth flow
  async signInWithGitHub(): Promise<AuthResponse> {
    try {
      console.log('Initiating GitHub OAuth...');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful GitHub auth response
      const mockGitHubUser: User = {
        id: 'github_' + Math.random().toString(36).substr(2, 9),
        email: 'user@github.com',
        name: 'Jane Developer',
        avatar: 'https://via.placeholder.com/40',
        provider: 'github'
      };
      
      this.currentUser = mockGitHubUser;
      
      // Store auth token in localStorage
      const mockToken = 'github_token_' + Math.random().toString(36).substr(2, 20);
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockGitHubUser));
      
      return {
        success: true,
        user: mockGitHubUser,
        token: mockToken
      };
    } catch (error) {
      return {
        success: false,
        error: 'GitHub authentication failed'
      };
    }
  }

  // Email/password authentication
  async signInWithEmail(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('Signing in with email:', email);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Basic validation (in real app, this would be server-side)
      if (!email || !password) {
        return {
          success: false,
          error: 'Email and password are required'
        };
      }
      
      // Mock successful email auth
      const mockEmailUser: User = {
        id: 'email_' + Math.random().toString(36).substr(2, 9),
        email: email,
        name: email.split('@')[0],
        provider: 'email'
      };
      
      this.currentUser = mockEmailUser;
      
      const mockToken = 'email_token_' + Math.random().toString(36).substr(2, 20);
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockEmailUser));
      
      return {
        success: true,
        user: mockEmailUser,
        token: mockToken
      };
    } catch (error) {
      return {
        success: false,
        error: 'Email authentication failed'
      };
    }
  }

  // Registration with email
  async registerWithEmail(name: string, email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('Registering with email:', email);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Basic validation
      if (!name || !email || !password) {
        return {
          success: false,
          error: 'All fields are required'
        };
      }
      
      // Mock successful registration
      const mockNewUser: User = {
        id: 'new_' + Math.random().toString(36).substr(2, 9),
        email: email,
        name: name,
        provider: 'email'
      };
      
      this.currentUser = mockNewUser;
      
      const mockToken = 'new_token_' + Math.random().toString(36).substr(2, 20);
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockNewUser));
      
      return {
        success: true,
        user: mockNewUser,
        token: mockToken
      };
    } catch (error) {
      return {
        success: false,
        error: 'Registration failed'
      };
    }
  }

  // Sign out
  signOut(): void {
    this.currentUser = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  // Get current user
  getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }
    
    // Try to get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
        return this.currentUser;
      } catch {
        // Invalid stored user data
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
      }
    }
    
    return null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Update user profile
  async updateProfile(profileData: Partial<User>): Promise<AuthResponse> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          error: 'User not logged in'
        };
      }

      const updatedUser = { ...currentUser, ...profileData };
      this.currentUser = updatedUser;
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return {
        success: true,
        user: updatedUser
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update profile'
      };
    }
  }

  // Upload profile picture
  async uploadProfilePicture(file: File): Promise<{success: boolean; url?: string; error?: string}> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = () => {
          const url = reader.result as string;
          resolve({ success: true, url });
        };
        reader.readAsDataURL(file);
      }, 1000); // Simulate upload delay
    });
  }
}

// Export singleton instance
export const authService = new AuthService();

// OAuth Provider URLs (for real implementation)
export const OAUTH_URLS = {
  google: {
    authUrl: 'https://accounts.google.com/oauth/authorize',
    clientId: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id',
    redirectUri: `${window.location.origin}/auth/google/callback`,
    scope: 'openid email profile'
  },
  github: {
    authUrl: 'https://github.com/login/oauth/authorize',
    clientId: process.env.GITHUB_CLIENT_ID || 'your-github-client-id',
    redirectUri: `${window.location.origin}/auth/github/callback`,
    scope: 'user:email'
  }
};

// Helper function to build OAuth URL (for real implementation)
export function buildOAuthUrl(provider: 'google' | 'github'): string {
  const config = OAUTH_URLS[provider];
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope,
    response_type: 'code',
    state: Math.random().toString(36).substr(2, 15) // CSRF protection
  });
  
  return `${config.authUrl}?${params.toString()}`;
}
