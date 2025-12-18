import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Compass, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { authService } from "@/lib/auth";
import { toast } from "@/components/ui/use-toast";

// SVG Icons for OAuth providers
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const GitHubIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);

  useEffect(() => {
    if (authService.isAuthenticatedSync()) {
      window.location.replace("/home");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await authService.signInWithEmail(email, password);
    setIsLoading(false);
    if (!res.success) {
      toast({ title: "Login failed", description: res.error || "Invalid credentials", duration: 3000 });
      return;
    }
    window.location.href = "/";
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      const res = await authService.signInWithGoogle();
      if (!res.success) {
        toast({ title: "Google sign-in failed", description: res.error || "Please try again", duration: 3000 });
      }
      // OAuth will redirect on success
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    try {
      setIsGitHubLoading(true);
      const res = await authService.signInWithGitHub();
      if (!res.success) {
        toast({ title: "GitHub sign-in failed", description: res.error || "Please try again", duration: 3000 });
      }
    } finally {
      setIsGitHubLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    const res = await authService.signInAsGuest();
    if (res.success) {
      window.location.href = "/";
    } else {
      toast({ title: "Guest login failed", description: res.error || "Guest login disabled", duration: 3000 });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-indigo-950/20 dark:to-purple-950">

      <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md shadow-2xl border-indigo-200/50 dark:border-indigo-700/40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="p-4 w-fit mx-auto">
              <div className="p-3 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl shadow-lg">
                <Compass className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 text-base mt-2">
                Sign in to your Career Compass account
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* OAuth Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading || isGitHubLoading || isLoading}
                variant="outline"
                className="w-full h-12 bg-white hover:bg-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 transition-colors duration-200"
              >
                {isGoogleLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-3" />
                ) : (
                  <GoogleIcon />
                )}
                <span className="ml-3 font-medium">Continue with Google</span>
              </Button>

              <Button
                onClick={handleGitHubLogin}
                disabled={isGitHubLoading || isGoogleLoading || isLoading}
                variant="outline"
                className="w-full h-12 bg-white hover:bg-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 transition-colors duration-200"
              >
                {isGitHubLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-3" />
                ) : (
                  <GitHubIcon />
                )}
                <span className="ml-3 font-medium">Continue with GitHub</span>
              </Button>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-slate-700 dark:text-slate-300 font-medium"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-white/70 dark:bg-slate-800/60 border-indigo-200/60 dark:border-indigo-700/40"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-slate-700 dark:text-slate-300 font-medium"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-white/70 dark:bg-slate-800/60 border-indigo-200/60 dark:border-indigo-700/40"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>

            {import.meta.env.VITE_ENABLE_GUEST_LOGIN === "true" && (
              <div className="pt-2">
                <Button variant="outline" className="w-full h-10" onClick={handleGuestLogin}>
                  Continue as Guest (Local)
                </Button>
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                >
                  Register
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
