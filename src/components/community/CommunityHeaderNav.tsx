"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, ArrowRight, UserPlus, Compass } from "lucide-react";

export function SparkLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-white text-[#0A0A0C] shadow-lg shadow-white/20 hover:scale-105 transition-transform ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3/5 h-3/5">
        <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
      </svg>
    </div>
  );
}

export default function CommunityHeaderNav() {
  const pathname = usePathname();

  const pages = [
    {
      title: "1. Welcome",
      href: "/community",
      active: pathname === "/community" || pathname === "/community/welcome",
      icon: Sparkles,
      desc: "Constellation Landing",
    },
    {
      title: "2. Sign Up",
      href: "/community/signup",
      active: pathname === "/community/signup",
      icon: UserPlus,
      desc: "Auth & Interests",
    },
    {
      title: "3. Spaces & Feed",
      href: "/community/feed",
      active: pathname === "/community/feed",
      icon: Compass,
      desc: "Live Social Feed",
    },
  ];

  return (
    <div className="w-full bg-[#121216]/90 backdrop-blur-md border-b border-white/10 sticky top-16 z-30 px-4 py-2.5">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Branding badge */}
        <div className="flex items-center gap-2">
          <SparkLogo className="w-6 h-6" />
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            NGTA Community Hub
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#EFFF4F]/20 text-[#EFFF4F] text-[10px] font-mono font-bold">
            3 App Pages
          </span>
        </div>

        {/* Right: The 3 Page Route Switchers */}
        <div className="flex items-center gap-1.5 p-1 bg-[#1A1A20] rounded-full border border-white/10 text-xs font-mono">
          {pages.map((p) => {
            const Icon = p.icon;
            return (
              <Link
                key={p.href}
                href={p.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                  p.active
                    ? "bg-white text-black font-bold shadow-md shadow-white/20"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{p.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
