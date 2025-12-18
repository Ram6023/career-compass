import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass, Sun, Moon, User, Settings, LogOut, UserCircle2, Target, MessageSquare, BookOpen, Briefcase } from "lucide-react";
import logoUrl from "@/assets/logo.svg";

import { useTheme } from "@/components/ui/theme-provider";
import { useLanguage } from "@/components/ui/language-provider";
import { LanguageSelector } from "@/components/ui/language-selector";
import { authService } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  useEffect(() => {
    // Listen for auth state changes
    const handleAuthStateChange = () => {
      const currentUser = authService.getCurrentUser();
      const authenticated = authService.isAuthenticatedSync();
      setUser(currentUser);
      setIsLoggedIn(authenticated);
    };

    // Set up event listener for auth changes
    window.addEventListener('authStateChanged', handleAuthStateChange);
    
    // Also check auth state on component mount
    handleAuthStateChange();

    // Cleanup event listener
    return () => {
      window.removeEventListener('authStateChanged', handleAuthStateChange);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 border-b border-emerald-200/30 dark:border-emerald-700/30 shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/home" className="flex items-center space-x-4 group">
            <div className="p-2 rounded-2xl shadow-xl transition-transform group-hover:scale-105 bg-white/10 dark:bg-white/5 border border-white/20">
              <img src={logoUrl} alt="CareerCompass" className="h-9 w-9" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-orbitron bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                CareerCompass AI
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {pageSubtitle || "Your Future Starts Here"}
              </p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/home"
              className="text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium dark:text-gray-300 dark:hover:text-emerald-400 relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/careers"
              className="text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium dark:text-gray-300 dark:hover:text-emerald-400 relative group"
            >
              {t("header.compareCareers")}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/resume-analyzer"
              className="text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium dark:text-gray-300 dark:hover:text-emerald-400 relative group"
            >
              {t("header.resumeAnalyzer")}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/chat"
              className="text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium dark:text-gray-300 dark:hover:text-emerald-400 relative group"
            >
              {t("header.aiAssistant")}
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="rounded-xl px-2">
                      <div className="flex items-center space-x-2">
                        {user.avatar ? (
                          <img src={user.avatar} alt="Profile" className="w-7 h-7 rounded-full" />
                        ) : (
                          <UserCircle2 className="w-6 h-6" />
                        )}
                        <span className="hidden md:inline text-sm font-medium">{user.name || user.email}</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>
                      <div className="flex items-center space-x-3">
                        {user.avatar ? (
                          <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full" />
                        ) : (
                          <UserCircle2 className="w-8 h-8" />
                        )}
                        <div>
                          <div className="font-medium">{user.name || "User"}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center">
                          <User className="mr-2 h-4 w-4" /> Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/goals" className="flex items-center">
                          <Target className="mr-2 h-4 w-4" /> Goal Tracker
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/chat" className="flex items-center">
                          <MessageSquare className="mr-2 h-4 w-4" /> AI Assistant
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/resume-analyzer" className="flex items-center">
                          <BookOpen className="mr-2 h-4 w-4" /> Resume Analyzer
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/careers" className="flex items-center">
                          <Briefcase className="mr-2 h-4 w-4" /> Compare Careers
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link to="/settings" className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" /> Settings
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={async () => {
                        await authService.signOut();
                        setUser(null);
                        setIsLoggedIn(false);
                        window.location.href = "/login";
                      }}
                      className="text-red-600 focus:text-red-700"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Login and Register buttons removed per requirements */}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
