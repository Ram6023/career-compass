import "./global.css";

import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { LanguageProvider } from "@/components/ui/language-provider";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import ChatAssistant from "./pages/ChatAssistant";
import CareerComparison from "./pages/CareerComparison";
import DailyTips from "./pages/DailyTips";
import GoalTracker from "./pages/GoalTracker";
import Profile from "./pages/Profile";
import AuthCallback from "./pages/AuthCallback";
import Onboarding from "./pages/Onboarding";
import Settings from "./pages/Settings";
import AssessmentSetup from "./pages/AssessmentSetup";
import InterviewSession from "./pages/InterviewSession";
import InterviewResult from "./pages/InterviewResult";
import SplashScreen from "./components/SplashScreen";


const queryClient = new QueryClient();

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">Please refresh the page and try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Authentication disabled - all routes are public

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        classNames="fade"
        timeout={500}
      >
        <Routes location={location}>
          {/* All routes are now public - no authentication required */}
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Index />} />
          {/* Login/Register redirect to home since auth is disabled */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="/chat" element={<ChatAssistant />} />
          <Route path="/compare" element={<CareerComparison />} />
          <Route path="/careers" element={<CareerComparison />} />
          <Route path="/roadmaps" element={<Index />} />
          <Route path="/tips" element={<DailyTips />} />
          <Route path="/goals" element={<GoalTracker />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/assessment" element={<AssessmentSetup />} />
          <Route path="/interview/session" element={<InterviewSession />} />
          <Route path="/interview/result" element={<InterviewResult />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = React.useState(true);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider defaultLanguage="en">
          <ThemeProvider defaultTheme="system" storageKey="career-compass-theme">
            <TooltipProvider>
              <Toaster />
              <Sonner />
              {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
              <BrowserRouter basename={import.meta.env.PROD ? "/career-compass" : "/"}>
                <AnimatedRoutes />
              </BrowserRouter>
            </TooltipProvider>
          </ThemeProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
