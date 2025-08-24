import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass, Sun, Moon, User } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { useLanguage } from "@/components/ui/language-provider";
import { LanguageSelector } from "@/components/ui/language-selector";
import { authService } from "@/lib/auth";

interface HeaderProps {
  pageTitle?: string;
  pageSubtitle?: string;
}

export function Header({ pageTitle, pageSubtitle }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [user, setUser] = useState(authService.getCurrentUser());
  const [isLoggedIn, setIsLoggedIn] = useState(
    authService.isAuthenticatedSync(),
  );

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 border-b border-emerald-200/30 dark:border-emerald-700/30 shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="p-3 bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-600 rounded-2xl shadow-xl transition-transform group-hover:scale-105">
              <Compass className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                CareerCompass AI
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {pageSubtitle || "Your Future Starts Here"}
              </p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium dark:text-gray-300 dark:hover:text-emerald-400 relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/careers"
              className="text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium dark:text-gray-300 dark:hover:text-emerald-400 relative group"
            >
              {t('header.compareCareers')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/resume-analyzer"
              className="text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium dark:text-gray-300 dark:hover:text-emerald-400 relative group"
            >
              {t('header.resumeAnalyzer')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/chat"
              className="text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium dark:text-gray-300 dark:hover:text-emerald-400 relative group"
            >
              {t('header.aiAssistant')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/tips"
              className="text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium dark:text-gray-300 dark:hover:text-emerald-400 relative group"
            >
              Daily Tips
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/goals"
              className="text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium dark:text-gray-300 dark:hover:text-emerald-400 relative group"
            >
              Goal Tracker
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
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
                  <Link to="/login">{t('header.login')}</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 hover:from-emerald-600 hover:via-teal-600 hover:to-blue-700 shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  <Link to="/register">{t('header.getStarted')}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
