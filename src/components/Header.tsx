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
import { supabase } from "@/lib/supabaseClient";

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
    <header className="sticky top-0 z-30 bg-[#28282B]/95 backdrop-blur-md border-b border-[#3E3E43] text-white">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile Sidebar Trigger + Context Greeting */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onToggleSidebar}
              className="p-2 text-[#A0A5B5] hover:text-[#EFFF4F] hover:bg-[#333336] rounded-md transition-colors lg:hidden"
              aria-label="Open Navigation Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-white font-sans truncate">
                Welcome back to NextGen Academy
                {studentProfile?.username ? `, @${studentProfile.username}` : ""}! 🚀
              </span>
            </div>
          </div>

          {/* Right: Gamified Badges + Notifications + Profile Avatar */}
          <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs">
            {/* Streak Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-full font-bold text-[11px]">
              <Flame className="w-3.5 h-3.5 fill-orange-400" />
              <span>
                {studentProfile?.current_streak ?? 0}{" "}
                {(studentProfile?.current_streak ?? 0) === 1 ? "Day" : "Days"}
              </span>
            </div>

            {/* XP Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 text-[#EFFF4F] rounded-full font-bold text-[11px] shadow-lemon-sm">
              <Zap className="w-3.5 h-3.5 fill-[#EFFF4F]" />
              <span>{studentProfile?.xp_points ?? 0} XP</span>
            </div>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-[#A0A5B5] hover:text-white hover:bg-[#333336] rounded-full transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#202023] border border-[#3E3E43] shadow-2xl p-3 z-50 text-xs font-sans animate-in fade-in duration-150">
                  <div className="font-bold text-white uppercase font-mono pb-2 border-b border-[#3E3E43] flex justify-between items-center text-[11px]">
                    <Link
                      href="/notifications"
                      onClick={() => setNotificationsOpen(false)}
                      className="hover:text-[#EFFF4F] transition-colors"
                    >
                      Notifications
                    </Link>
                    <Link
                      href="/notifications"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-[10px] text-[#EFFF4F] hover:underline"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="py-2 space-y-2 text-[#A0A5B5]">
                    <div className="p-2 bg-[#28282B] border border-[#3E3E43] rounded text-[11px]">
                      <span className="font-bold text-white">Daily Streak Active:</span> Keep your streak going by finishing a lesson today.
                    </div>
                    <div className="p-2 bg-[#28282B] border border-[#3E3E43] rounded text-[11px]">
                      <span className="font-bold text-white">Live SDET Bootcamp:</span> Starts this Saturday at 10:00 AM IST.
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#3E3E43] mt-2 flex justify-between items-center text-[10px] font-mono">
                    <span className="text-[#5A5F70]">Web Push Alerts</span>
                    <Link
                      href="/notifications"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-[#EFFF4F] hover:underline font-bold"
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
              className="flex items-center gap-2 px-2 py-1 rounded-full bg-[#333336] border border-[#3E3E43] hover:border-[#EFFF4F]/50 transition-all group"
              title="Settings & Persona Profile"
            >
              <div className="w-7 h-7 rounded-full overflow-hidden border border-[#EFFF4F]/60 bg-neutral-900 flex items-center justify-center text-xs font-bold shrink-0">
                {studentProfile?.avatar_url ? (
                  <Image
                    src={studentProfile.avatar_url}
                    alt={studentProfile.username || "Persona"}
                    width={28}
                    height={28}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-white text-[10px]">
                    {studentProfile?.username?.slice(0, 2).toUpperCase() || "SD"}
                  </span>
                )}
              </div>
              <span className="font-bold text-white text-[11px] font-mono group-hover:text-[#EFFF4F] transition-colors truncate max-w-[110px] hidden sm:inline">
                @{studentProfile?.username || "Learner"}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
