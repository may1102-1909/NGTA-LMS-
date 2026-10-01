"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Bell,
  Users,
  Trophy,
  Zap,
  Award,
  Calendar,
  Settings,
  LogOut,
  Flame,
  X,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [streak, setStreak] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

    async function loadUserStreak() {
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
              setStreak(data.profile?.current_streak ?? data.current_streak ?? 0);
            }
          }
        } else if (isMounted) {
          setStreak(0);
        }
      } catch (err) {
        console.warn("Could not load streak in Sidebar:", err);
      }
    }

    loadUserStreak();

    const handleProfileUpdate = (e: any) => {
      if (e.detail && isMounted) {
        if (typeof e.detail.current_streak === "number") {
          setStreak(e.detail.current_streak);
        }
      }
    };

    window.addEventListener("student-profile-updated", handleProfileUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("student-profile-updated", handleProfileUpdate);
    };
  }, []);

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard" || pathname === "/lms",
    },
    {
      label: "My Courses",
      href: "/courses",
      icon: BookOpen,
      active: pathname === "/courses" || pathname.startsWith("/courses/"),
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: Bell,
      badge: "3",
      active: pathname === "/notifications",
    },
    {
      label: "Community",
      href: "/community",
      icon: Users,
      active: pathname === "/community",
    },
    {
      label: "30-Day Challenge",
      href: "/challenge",
      icon: Trophy,
      active: pathname === "/challenge" || pathname === "/30-day-challenge",
    },
    {
      label: "Leaderboard",
      href: "/leaderboard",
      icon: Zap,
      active: pathname === "/leaderboard",
    },
    {
      label: "My Certificates",
      href: "/certificates",
      icon: Award,
      active: pathname === "/certificates" || pathname === "/verify",
    },
    {
      label: "1-on-1 Mentorship",
      href: "/mentorship",
      icon: Calendar,
      active: pathname === "/mentorship" || pathname === "/1-on-1-mentorship",
    },
    {
      label: "Settings & Profile",
      href: "/settings",
      icon: Settings,
      active: pathname === "/settings" || pathname === "/profile",
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0C0A14] border-r border-[#26213B] flex flex-col justify-between transition-transform duration-300 ease-in-out font-mono lg:static lg:translate-x-0 shrink-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Top Header / Brand */}
        <div>
          <div className="h-16 px-5 border-b border-[#26213B] flex items-center justify-between bg-[#120F1D]">
            <Link
              href="/dashboard"
              onClick={onClose}
              className="flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 flex items-center justify-center text-[#A855F7] group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(139,92,246,0.3)]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-white tracking-wider uppercase group-hover:text-[#A855F7] transition-colors leading-tight">
                  NGTA REALM
                </span>
                <span className="text-[10px] text-[#94A3B8] tracking-tight font-sans">
                  Academy Citadel
                </span>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="p-1.5 text-[#94A3B8] hover:text-white lg:hidden"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items List */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)] text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group ${
                    item.active
                      ? "bg-[#8B5CF6]/15 text-[#C084FC] font-bold border-l-2 border-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.18)]"
                      : "text-[#94A3B8] hover:text-white hover:bg-[#161326] border-l-2 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        item.active
                          ? "text-[#8B5CF6]"
                          : "text-[#64748B] group-hover:text-[#A855F7]"
                      }`}
                    />
                    <span className="font-sans text-[13px]">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="w-5 h-5 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white flex items-center justify-center font-bold text-[11px] shrink-0 shadow-[0_0_8px_rgba(139,92,246,0.5)]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Streak Badge & Sign Out */}
        <div className="p-3 border-t border-[#26213B] bg-[#120F1D] space-y-2">
          {/* User Streak Pill Card */}
          <div className="p-3 rounded-lg border border-[#26213B] bg-[#161326] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/15 text-amber-400">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
              </span>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-white font-sans">
                  {streak} {streak === 1 ? "Day" : "Days"} Streak
                </span>
                <span className="text-[10px] text-[#94A3B8] font-sans">
                  {streak > 0 ? "Active Learning Streak" : "Start Your Streak Today"}
                </span>
              </div>
            </div>
            <span className={`w-2 h-2 rounded-full ${streak > 0 ? "bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse" : "bg-[#3A2E59]"}`} />
          </div>

          {/* Sign Out Button */}
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#94A3B8] hover:text-white hover:bg-[#161326] rounded-lg transition-colors w-full"
          >
            <LogOut className="w-4 h-4 text-[#64748B]" />
            <span className="font-sans text-[13px]">Sign Out</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
