import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        if (data.session) {
          // Authentication successful, redirect to dashboard
          navigate("/", { replace: true });
        } else {
          // No session found, redirect to login
          navigate("/login", { replace: true });
        }
      } catch (err) {
        setError("Authentication failed");
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Completing authentication...
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Please wait while we set up your account.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="text-red-500 text-5xl">⚠️</div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Authentication Error
          </h2>
          <p className="text-slate-600 dark:text-slate-400">{error}</p>
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
}
