import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sun, Moon, User, Settings, LogOut, UserCircle2, Target, MessageSquare, BookOpen, Briefcase, ChevronDown, Bookmark, History } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

interface HeaderProps {
  pageTitle?: string;
  pageSubtitle?: string;
}

export function Header({ pageTitle, pageSubtitle }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const location = useLocation();
  const [user, setUser] = useState(authService.getCurrentUser());
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isAuthenticatedSync());
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for header shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleAuthStateChange = () => {
      const currentUser = authService.getCurrentUser();
      const authenticated = authService.isAuthenticatedSync();
      setUser(currentUser);
      setIsLoggedIn(authenticated);
    };

    window.addEventListener('authStateChanged', handleAuthStateChange);
    handleAuthStateChange();

    return () => {
      window.removeEventListener('authStateChanged', handleAuthStateChange);
    };
  }, []);

  const navLinks = [
    { to: "/assessment", label: "Assessment" },
    { to: "/careers", label: t("header.compareCareers") },
    { to: "/resume-analyzer", label: t("header.resumeAnalyzer") },
    { to: "/chat", label: t("header.aiAssistant") },
    { to: "/tips", label: "Daily Tips" },
    { to: "/goals", label: "Goal Tracker" },
  ];

  const isActiveLink = (path: string) => location.pathname === path;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
        ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm border-b border-slate-200/50 dark:border-slate-700/50'
        : 'bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-b border-transparent'
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-3 group">
            <div className="relative p-2 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 border border-emerald-200/50 dark:border-emerald-700/30 transition-transform duration-300 group-hover:scale-105">
              <img src={logoUrl} alt="CareerCompass" className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-900 via-emerald-700 to-teal-700 dark:from-white dark:via-emerald-300 dark:to-teal-300 bg-clip-text text-transparent">
                CareerCompass
                <span className="font-normal text-emerald-600 dark:text-emerald-400"> AI</span>
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActiveLink(link.to)
                  ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-900/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/50'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <LanguageSelector />

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="h-9 w-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" id="mobile-menu-trigger">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-80 p-0">
                  <SheetHeader className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                    <SheetTitle className="text-left text-lg font-semibold">
                      Navigation
                    </SheetTitle>
                    <SheetDescription className="sr-only">
                      Navigation menu
                    </SheetDescription>
                  </SheetHeader>
                  <nav className="flex flex-col p-4 gap-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => document.getElementById('mobile-menu-trigger')?.click()}
                        className={`px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActiveLink(link.to)
                          ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

            {/* User Menu - Always visible as per user request */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-9 rounded-lg px-2 gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {(user?.avatar) ? (
                    <img src={user.avatar} alt="Profile" className="w-6 h-6 rounded-full ring-2 ring-emerald-200 dark:ring-emerald-800" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        {((user?.name || user?.email || "G").charAt(0).toUpperCase())}
                      </span>
                    </div>
                  )}
                  <span className="hidden md:inline text-sm font-medium text-slate-700 dark:text-slate-300 max-w-24 truncate">
                    {user?.name || user?.email?.split('@')[0] || "Guest"}
                  </span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 p-2">
                <DropdownMenuLabel className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 mb-2">
                  <div className="flex items-center gap-3">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                        <span className="text-sm font-semibold text-white">
                          {((user?.name || user?.email || "G").charAt(0).toUpperCase())}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {user?.name || "Guest User"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user?.email || "Sign in to save progress"}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuGroup>
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" /> My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                    <Link to="/profile?tab=dashboard" className="flex items-center gap-2">
                      <Bookmark className="h-4 w-4" /> Saved Careers
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                    <Link to="/profile?tab=interviews" className="flex items-center gap-2">
                      <History className="h-4 w-4" /> Assessment History
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                    <Link to="/goals" className="flex items-center gap-2">
                      <Target className="h-4 w-4" /> Goal Tracker
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                    <Link to="/chat" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" /> AI Assistant
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                    <Link to="/resume-analyzer" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" /> Resume Analyzer
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                    <Link to="/careers" className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" /> Compare Careers
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-2" />

                <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                  <Link to="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-2" />

                <DropdownMenuItem
                  onClick={async () => {
                    await authService.signOut();
                    setUser(null);
                    setIsLoggedIn(false);
                    window.location.reload();
                  }}
                  className="rounded-lg cursor-pointer text-red-600 dark:text-red-400 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-900/20"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Clear Session
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
