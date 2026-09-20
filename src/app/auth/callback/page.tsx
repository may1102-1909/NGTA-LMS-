"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const code = searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        // Redirect to dashboard upon successful session establishment
        router.push("/dashboard");
      } catch (err: any) {
        console.error("Auth callback error:", err);
        setError(err?.message || "Failed to complete authentication.");
        setTimeout(() => router.push("/"), 3000);
      }
    };

    handleAuth();
  }, [router, searchParams]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center font-mono text-xs space-y-4">
      <div className="border-2 border-zinc-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center space-y-3 max-w-sm">
        <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
          [SUPABASE OAUTH HANDSHAKE]
        </div>
        {error ? (
          <div className="text-red-600 font-bold">
            ERROR: {error}
            <div className="text-[10px] text-zinc-500 font-normal mt-1">
              Redirecting to homepage...
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-zinc-900 font-bold">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <span>FINALIZING AUTHENTICATION...</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center font-mono text-xs text-zinc-500">
          [INITIALIZING OAUTH...]
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
