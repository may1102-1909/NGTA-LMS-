"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Loader2 } from "lucide-react";

export default function DashboardRouterPage() {
  const router = useRouter();

  useEffect(() => {
    async function determineRoleAndRedirect() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseAnonKey) {
          router.replace("/dashboard/learner");
          return;
        }

        const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user?.id) {
          const res = await fetch(`/api/student-profile?userId=${user.id}`);
          if (res.ok) {
            const data = await res.json();
            const role = String(data.role || "LEARNER").toUpperCase();

            switch (role) {
              case "SUPER_ADMIN":
                router.replace("/dashboard/super-admin");
                return;
              case "ADMIN":
                router.replace("/dashboard/admin");
                return;
              case "INSTRUCTOR":
                router.replace("/dashboard/instructor");
                return;
              case "CONTENT_MANAGER":
                router.replace("/dashboard/content");
                return;
              case "SUPPORT_STAFF":
                router.replace("/dashboard/support");
                return;
              case "LEARNER":
              case "GUEST":
              default:
                router.replace("/dashboard/learner");
                return;
            }
          }
        }

        // Fallback for guest
        router.replace("/dashboard/learner");
      } catch (err) {
        console.error("Error directing to role dashboard:", err);
        router.replace("/dashboard/learner");
      }
    }

    determineRoleAndRedirect();
  }, [router]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-8 h-8 animate-spin text-[#EFFF4F]" />
      <span className="font-mono text-xs text-[#A0A5B5] uppercase tracking-wider">
        Directing to your authorized workspace...
      </span>
    </div>
  );
}
