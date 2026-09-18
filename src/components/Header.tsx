"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole } from "@/types";
import { ShieldCheck, BookOpen, Video, Users, Award, LayoutDashboard, ChevronDown } from "lucide-react";

interface HeaderProps {
  currentRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
}

export default function Header({ currentRole = "LEARNER", onRoleChange }: HeaderProps) {
  const pathname = usePathname();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  if (pathname === "/") {
    return null;
  }

  const roles: UserRole[] = [
    "LEARNER",
    "INSTRUCTOR",
    "ADMIN",
    "SUPER_ADMIN",
    "CONTENT_MANAGER",
    "SUPPORT_STAFF",
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-zinc-200 text-zinc-900">
      {/* Top Swiss Notice Bar */}
      <div className="bg-zinc-950 text-zinc-300 text-xs px-4 py-1.5 flex justify-between items-center font-mono border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>NGTA_SYSTEM: V1.0.0</span>
          <span className="text-zinc-500">|</span>
          <span className="text-zinc-400">STATUS: AUTONOMOUS_ACTIVE</span>
        </div>

        {/* Role Emulator Selector */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 hover:text-white bg-zinc-900 px-2 py-0.5 border border-zinc-700 hover:border-zinc-500 transition-colors"
          >
            <span className="text-zinc-400">ROLE:</span>
            <span className="font-bold text-amber-400">{currentRole}</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-zinc-900 border border-zinc-700 shadow-xl z-50 py-1 font-mono text-xs">
              <div className="px-3 py-1 text-zinc-400 border-b border-zinc-800 text-[10px] uppercase tracking-wider">
                Simulate RBAC Role
              </div>
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    if (onRoleChange) onRoleChange(r);
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-zinc-800 transition-colors flex items-center justify-between ${
                    currentRole === r ? "text-emerald-400 font-bold bg-zinc-800/50" : "text-zinc-300"
                  }`}
                >
                  {r}
                  {currentRole === r && <span className="text-[10px]">●</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Swiss Grid Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-baseline gap-2 group">
              <span className="text-2xl font-black tracking-tighter text-zinc-950 group-hover:text-blue-600 transition-colors">
                NGTA
              </span>
              <span className="text-xs font-mono font-bold px-1.5 py-0.5 bg-zinc-900 text-white tracking-widest uppercase">
                LMS
              </span>
            </Link>
            <span className="hidden md:inline-block text-[11px] font-mono text-zinc-400 tracking-tight">
              NEXTGEN TESTING ACADEMY
            </span>
          </div>

          {/* Primary Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-mono text-xs tracking-wider uppercase font-semibold">
            <Link href="/courses" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Courses
            </Link>
            <Link href="/live" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5" /> Live Training
            </Link>
            <Link href="/community" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Community
            </Link>
            <Link href="/verify" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Verify Cert
            </Link>
          </nav>

          {/* User Controls & Action */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider px-3.5 py-2 border border-zinc-900 hover:bg-zinc-900 hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </Link>
            <Link
              href="/courses"
              className="hidden sm:inline-flex text-xs font-mono font-bold uppercase tracking-wider px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Enroll Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
