"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Bell,
  Flame,
  Zap,
  BookOpen,
} from "lucide-react";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const pathname = usePathname();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

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
                Welcome back to NextGen Academy! 🚀
              </span>
            </div>
          </div>

          {/* Right: Gamified Badges + Notifications + Profile Avatar */}
          <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs">
            {/* Quick Catalog Link */}
            <Link
              href="/courses"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#3E3E43] bg-[#333336] text-[#A0A5B5] hover:text-[#EFFF4F] hover:border-[#EFFF4F]/40 transition-colors text-[11px] font-bold uppercase"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Catalog</span>
            </Link>

            {/* Streak Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-full font-bold text-[11px]">
              <Flame className="w-3.5 h-3.5 fill-orange-400" />
              <span>1 Days</span>
            </div>

            {/* XP Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 text-[#EFFF4F] rounded-full font-bold text-[11px] shadow-lemon-sm">
              <Zap className="w-3.5 h-3.5 fill-[#EFFF4F]" />
              <span>4220 XP</span>
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
                      <span className="font-bold text-white">Daily Streak Active:</span> Keep your streak going by finishing Module 1.2 today.
                    </div>
                    <div className="p-2 bg-[#28282B] border border-[#3E3E43] rounded text-[11px]">
                      <span className="font-bold text-white">Live SDET Bootcamp:</span> Starts this Saturday at 10:00 AM IST.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar Circle Badge */}
            <Link
              href="/settings"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 font-bold text-xs hover:border-[#EFFF4F] hover:text-[#EFFF4F] transition-all"
              title="Settings & Profile"
            >
              SD
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
