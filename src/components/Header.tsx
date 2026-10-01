"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  Bell,
  Flame,
  Zap,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const pathname = usePathname();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [studentProfile, setStudentProfile] = useState<{
    username: string;
    avatar_url: string;
    xp_points: number;
    current_streak: number;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadStudentProfile() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseAnonKey) return;

        const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user?.id) {
          const res = await fetch(`/api/student-profile?userId=${user.id}`);
          if (res.ok) {
            const data = await res.json();
            if (isMounted) {
              setStudentProfile({
                username: data.profile?.username || "",
                avatar_url: data.profile?.avatar_url || "",
                xp_points: data.profile?.xp_points ?? data.xp_points ?? 0,
                current_streak: data.profile?.current_streak ?? data.current_streak ?? 0,
              });
            }
          }
        } else if (isMounted) {
          setStudentProfile({
            username: "",
            avatar_url: "",
            xp_points: 0,
            current_streak: 0,
          });
        }
      } catch (err) {
        console.warn("Could not load student profile in Header:", err);
      }
    }

    loadStudentProfile();

    // Listen to real-time persona updates from onboarding modal
    const handleProfileUpdate = (e: any) => {
      if (e.detail && isMounted) {
        setStudentProfile((prev) => ({
          username: e.detail.username || prev?.username || "",
          avatar_url: e.detail.avatar_url || prev?.avatar_url || "",
          xp_points: e.detail.xp_points ?? prev?.xp_points ?? 0,
          current_streak: e.detail.current_streak ?? prev?.current_streak ?? 0,
        }));
      }
    };

    window.addEventListener("student-profile-updated", handleProfileUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("student-profile-updated", handleProfileUpdate);
    };
  }, []);

  if (pathname === "/") {
    return null;
  }

  return (
    <header className="sticky top-0 z-30 bg-[#0C0A14]/95 backdrop-blur-md border-b border-[#26213B] text-white">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile Sidebar Trigger + Context Greeting */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onToggleSidebar}
              className="p-2 text-[#94A3B8] hover:text-[#A855F7] hover:bg-[#161326] rounded-md transition-colors lg:hidden"
              aria-label="Open Navigation Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-white font-sans truncate">
                Welcome to NextGen Realm
                {studentProfile?.username ? `, @${studentProfile.username}` : ""}! ⚡
              </span>
            </div>
          </div>

          {/* Right: Gamified Badges + Notifications + Profile Avatar */}
          <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs">
            {/* Streak Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full font-bold text-[11px] shadow-[0_0_10px_rgba(245,158,11,0.2)]">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>
                {studentProfile?.current_streak ?? 0}{" "}
                {(studentProfile?.current_streak ?? 0) === 1 ? "Day" : "Days"}
              </span>
            </div>

            {/* XP Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 text-[#C084FC] rounded-full font-bold text-[11px] shadow-[0_0_14px_rgba(139,92,246,0.3)]">
              <Zap className="w-3.5 h-3.5 fill-[#8B5CF6] text-[#A855F7]" />
              <span>{studentProfile?.xp_points ?? 0} XP</span>
            </div>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-[#94A3B8] hover:text-white hover:bg-[#161326] rounded-full transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#D946EF] rounded-full shadow-[0_0_6px_rgba(217,70,239,0.8)]" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#120F1D] border border-[#26213B] shadow-2xl p-3 z-50 text-xs font-sans animate-in fade-in duration-150 rounded-xl">
                  <div className="font-bold text-white uppercase font-mono pb-2 border-b border-[#26213B] flex justify-between items-center text-[11px]">
                    <Link
                      href="/notifications"
                      onClick={() => setNotificationsOpen(false)}
                      className="hover:text-[#A855F7] transition-colors"
                    >
                      Notifications
                    </Link>
                    <Link
                      href="/notifications"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-[10px] text-[#A855F7] hover:underline"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="py-2 space-y-2 text-[#94A3B8]">
                    <div className="p-2 bg-[#161326] border border-[#26213B] rounded-lg text-[11px]">
                      <span className="font-bold text-white">Daily Streak Active:</span> Keep your streak going by finishing a lesson today.
                    </div>
                    <div className="p-2 bg-[#161326] border border-[#26213B] rounded-lg text-[11px]">
                      <span className="font-bold text-white">Live SDET Gauntlet:</span> Starts this Saturday at 10:00 AM IST.
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#26213B] mt-2 flex justify-between items-center text-[10px] font-mono">
                    <span className="text-[#64748B]">Web Push Alerts</span>
                    <Link
                      href="/notifications"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-[#A855F7] hover:underline font-bold"
                    >
                      Configure Push →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Student Custom Avatar & Homies Username */}
            <Link
              href="/settings"
              className="flex items-center gap-2 px-2 py-1 rounded-full bg-[#161326] border border-[#26213B] hover:border-[#8B5CF6]/60 transition-all group shadow-sm"
              title="Settings & Persona Profile"
            >
              <div className="w-7 h-7 rounded-full overflow-hidden border border-[#8B5CF6]/70 bg-[#08070D] flex items-center justify-center text-xs font-bold shrink-0 shadow-[0_0_8px_rgba(139,92,246,0.35)]">
                {studentProfile?.avatar_url ? (
                  <Image
                    src={studentProfile.avatar_url}
                    alt={studentProfile.username || "Persona"}
                    width={28}
                    height={28}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-[10px]">
                    {studentProfile?.username?.slice(0, 2).toUpperCase() || "SD"}
                  </span>
                )}
              </div>
              <span className="font-bold text-white text-[11px] font-mono group-hover:text-[#A855F7] transition-colors truncate max-w-[110px] hidden sm:inline">
                @{studentProfile?.username || "Learner"}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
