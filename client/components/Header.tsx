import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Compass, 
  Sun, 
  Moon, 
  User 
} from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { LanguageSelector } from "@/components/ui/language-selector";
import { authService } from "@/lib/auth";

interface HeaderProps {
  pageTitle?: string;
  pageSubtitle?: string;
}

export function Header({ pageTitle, pageSubtitle }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState(authService.getCurrentUser());
  const [isLoggedIn, setIsLoggedIn] = useState(
    authService.isAuthenticatedSync(),
  );

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 rounded-2xl shadow-lg">
              <Compass className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                CareerCompass AI
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {pageSubtitle || "Your Future Starts Here"}
              </p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/careers"
              className="text-slate-600 hover:text-indigo-600 transition-colors font-medium dark:text-slate-300 dark:hover:text-indigo-400"
            >
              Explore Careers
            </Link>
            <Link
              to="/resume-analyzer"
              className="text-slate-600 hover:text-indigo-600 transition-colors font-medium dark:text-slate-300 dark:hover:text-indigo-400"
            >
              Resume AI
            </Link>
            <Link
              to="/chat"
              className="text-slate-600 hover:text-indigo-600 transition-colors font-medium dark:text-slate-300 dark:hover:text-indigo-400"
            >
              AI Assistant
            </Link>
            <Link
              to="/tips"
              className="text-slate-600 hover:text-indigo-600 transition-colors font-medium dark:text-slate-300 dark:hover:text-indigo-400"
            >
              Daily Tips
            </Link>
            <Link
              to="/goals"
              className="text-slate-600 hover:text-indigo-600 transition-colors font-medium dark:text-slate-300 dark:hover:text-indigo-400"
            >
              Goal Tracker
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="w-10 h-10 rounded-xl"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {isLoggedIn && user ? (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" asChild className="rounded-xl">
                  <Link to="/profile" className="flex items-center space-x-2">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    <span>Profile</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={async () => {
                    await authService.signOut();
                    setUser(null);
                    setIsLoggedIn(false);
                  }}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" asChild className="rounded-xl">
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 hover:from-indigo-600 hover:via-purple-700 hover:to-cyan-600 shadow-lg rounded-xl"
                >
                  <Link to="/register">Get Started Free</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
