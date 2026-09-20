"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface GoogleOAuthButtonProps {
  label?: string;
  redirectTo?: string;
  className?: string;
  disabled?: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export default function GoogleOAuthButton({
  label = "Sign in with Google",
  redirectTo,
  className = "",
  disabled = false,
  onSuccess,
  onError,
}: GoogleOAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    if (isLoading || disabled) return;

    try {
      setIsLoading(true);
      setErrorMessage(null);

      // Determine redirect URL, fallback to window.location.origin + /auth/callback
      const targetRedirect =
        redirectTo ||
        (typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : "/auth/callback");

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: targetRedirect,
        },
      });

      if (error) {
        console.error("Supabase Google OAuth login error:", error.message, error);
        setErrorMessage(error.message);
        if (onError) onError(new Error(error.message));
        setIsLoading(false);
        return;
      }

      if (onSuccess) onSuccess();
      // Supabase redirects automatically when OAuth URL is opened
    } catch (err: any) {
      console.error("Unexpected Google OAuth error:", err);
      const msg = err?.message || "An unexpected error occurred during Google sign in.";
      setErrorMessage(msg);
      if (onError) onError(err instanceof Error ? err : new Error(msg));
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading || disabled}
        className={`inline-flex items-center justify-center gap-3 px-4 py-2.5 bg-white text-zinc-900 border-2 border-zinc-900 font-mono text-xs uppercase font-bold tracking-wider hover:bg-zinc-100 active:translate-x-[1px] active:translate-y-[1px] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] select-none ${className}`}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-zinc-900"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>CONNECTING TO GOOGLE...</span>
          </>
        ) : (
          <>
            {/* Google Vector Icon */}
            <svg
              className="w-4 h-4 shrink-0"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span>{label}</span>
          </>
        )}
      </button>

      {/* Graceful error display */}
      {errorMessage && (
        <div className="font-mono text-[10px] text-red-600 bg-red-50 border border-red-200 px-2 py-1">
          <span>ERROR: </span>
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
