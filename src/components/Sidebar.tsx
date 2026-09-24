"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Bell,
  Video,
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

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

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
      href: "/dashboard",
      icon: Bell,
      badge: "3",
      active: false,
    },
    {
      label: "Live Classes",
      href: "/live",
      icon: Video,
      active: pathname === "/live",
    },
    {
      label: "Community",
      href: "/community",
      icon: Users,
      active: pathname === "/community",
    },
    {
      label: "30-Day Challenge",
      href: "/dashboard#challenge",
      icon: Trophy,
      active: false,
    },
    {
      label: "Leaderboard",
      href: "/community#leaderboard",
      icon: Zap,
      active: false,
    },
    {
      label: "My Certificates",
      href: "/verify",
      icon: Award,
      active: pathname === "/verify",
    },
    {
      label: "1-on-1 Mentorship",
      href: "/courses",
      icon: Calendar,
      active: false,
    },
    {
      label: "Settings & Profile",
      href: "/dashboard#profile",
      icon: Settings,
      active: false,
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
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#202023] border-r border-[#3E3E43] flex flex-col justify-between transition-transform duration-300 ease-in-out font-mono lg:static lg:translate-x-0 shrink-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Top Header / Brand */}
        <div>
          <div className="h-16 px-5 border-b border-[#3E3E43] flex items-center justify-between bg-[#242428]">
            <Link
              href="/dashboard"
              onClick={onClose}
              className="flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 flex items-center justify-center text-[#EFFF4F] group-hover:scale-105 transition-transform shadow-lemon-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-white tracking-wider uppercase group-hover:text-[#EFFF4F] transition-colors leading-tight">
                  NGTA STUDENT
                </span>
                <span className="text-[10px] text-[#A0A5B5] tracking-tight font-sans">
                  Classroom Hub
                </span>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="p-1.5 text-[#A0A5B5] hover:text-white lg:hidden"
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
                  className={`flex items-center justify-between px-3 py-2.5 rounded transition-all group ${
                    item.active
                      ? "bg-[#EFFF4F]/10 text-[#EFFF4F] font-bold border-l-2 border-[#EFFF4F]"
                      : "text-[#A0A5B5] hover:text-white hover:bg-[#28282B] border-l-2 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        item.active
                          ? "text-[#EFFF4F]"
                          : "text-[#5A5F70] group-hover:text-[#EFFF4F]"
                      }`}
                    />
                    <span className="font-sans text-[13px]">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#EFFF4F] text-[#28282B]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Streak Badge & Sign Out */}
        <div className="p-3 border-t border-[#3E3E43] bg-[#242428] space-y-2">
          {/* User Streak Pill Card */}
          <div className="p-3 rounded border border-[#3E3E43] bg-[#28282B] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500/15 text-orange-400">
                <Flame className="w-3.5 h-3.5 fill-orange-400" />
              </span>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-white font-sans">
                  1 Day Streak
                </span>
                <span className="text-[10px] text-[#A0A5B5] font-sans">
                  Principal Test Architect
                </span>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-[#EFFF4F] animate-pulse" />
          </div>

          {/* Sign Out Button */}
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#A0A5B5] hover:text-white hover:bg-[#28282B] rounded transition-colors w-full"
          >
            <LogOut className="w-4 h-4 text-[#5A5F70]" />
            <span className="font-sans text-[13px]">Sign Out</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
