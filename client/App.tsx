import "./global.css";

import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { LanguageProvider } from "@/components/ui/language-provider";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import ChatAssistant from "./pages/ChatAssistant";
import CareerComparison from "./pages/CareerComparison";
import DailyTips from "./pages/DailyTips";
import GoalTracker from "./pages/GoalTracker";
import Profile from "./pages/Profile";
import AuthCallback from "./pages/AuthCallback";
import Settings from "./pages/Settings";
import SplashScreen from "./components/SplashScreen";
import { authService } from "@/lib/auth";

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

const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const isAuthed = authService.isAuthenticatedSync();
  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const RedirectIfAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const isAuthed = authService.isAuthenticatedSync();
  if (isAuthed) {
    return <Navigate to="/" replace />;
  }
  return children;
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
              <BrowserRouter>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <RequireAuth>
                        <Index />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/home"
                    element={
                      <RequireAuth>
                        <Index />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <RedirectIfAuth>
                        <Login />
                      </RedirectIfAuth>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <RedirectIfAuth>
                        <Register />
                      </RedirectIfAuth>
                    }
                  />
                  <Route path="/admin" element={<Admin />} />
                  <Route
                    path="/resume-analyzer"
                    element={
                      <RequireAuth>
                        <ResumeAnalyzer />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/chat"
                    element={
                      <RequireAuth>
                        <ChatAssistant />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/compare"
                    element={
                      <RequireAuth>
                        <CareerComparison />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/careers"
                    element={
                      <RequireAuth>
                        <CareerComparison />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/roadmaps"
                    element={
                      <RequireAuth>
                        <Index />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/tips"
                    element={
                      <RequireAuth>
                        <DailyTips />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/goals"
                    element={
                      <RequireAuth>
                        <GoalTracker />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <RequireAuth>
                        <Profile />
                      </RequireAuth>
                    }
                  />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route
                    path="/settings"
                    element={
                      <RequireAuth>
                        <Settings />
                      </RequireAuth>
                    }
                  />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </ThemeProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
