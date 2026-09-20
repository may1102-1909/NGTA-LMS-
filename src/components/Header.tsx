"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
    <header className="sticky top-0 z-50 bg-[#10131A]/95 backdrop-blur-md border-b border-[#252A36] text-white">
      {/* Top Notice Bar */}
      <div className="bg-[#0C0E14] text-[#A0A5B5] text-xs px-4 py-1.5 flex justify-between items-center font-mono border-b border-[#252A36]">
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 rounded-full bg-[#EFFF4F] animate-pulse"></span>
          <span>NGTA_SYSTEM: V1.0.0</span>
          <span className="text-[#5A5F70]">|</span>
          <span className="text-[#A0A5B5]">STATUS: AUTONOMOUS_ACTIVE</span>
        </div>

        {/* Role Emulator Selector */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 hover:text-white bg-[#181C26] px-2 py-0.5 border border-[#252A36] hover:border-[#EFFF4F]/30 transition-colors"
          >
            <span className="text-[#A0A5B5]">ROLE:</span>
            <span className="font-bold text-[#EFFF4F]">{currentRole}</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-[#181C26] border border-[#252A36] shadow-xl z-50 py-1 font-mono text-xs">
              <div className="px-3 py-1 text-[#5A5F70] border-b border-[#252A36] text-[10px] uppercase tracking-wider">
                Simulate RBAC Role
              </div>
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    if (onRoleChange) onRoleChange(r);
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-[#252A36] transition-colors flex items-center justify-between ${
                    currentRole === r ? "text-[#EFFF4F] font-bold bg-[#252A36]/50" : "text-[#A0A5B5]"
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

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/logo.png"
                alt="NGTA LMS Logo"
                width={36}
                height={36}
                className="w-9 h-9 object-contain rounded-md"
                priority
              />
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black tracking-tighter text-white group-hover:text-[#EFFF4F] transition-colors">
                  NGTA
                </span>
                <span className="text-xs font-mono font-bold px-1.5 py-0.5 bg-[#EFFF4F] text-[#10131A] tracking-widest uppercase">
                  LMS
                </span>
              </div>
            </Link>
            <span className="hidden md:inline-block text-[11px] font-mono text-[#5A5F70] tracking-tight">
              NEXTGEN TESTING ACADEMY
            </span>
          </div>

          {/* Primary Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-mono text-xs tracking-wider uppercase font-semibold">
            <Link href="/courses" className="text-[#A0A5B5] hover:text-[#EFFF4F] transition-colors flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Courses
            </Link>
            <Link href="/live" className="text-[#A0A5B5] hover:text-[#EFFF4F] transition-colors flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5" /> Live Training
            </Link>
            <Link href="/community" className="text-[#A0A5B5] hover:text-[#EFFF4F] transition-colors flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Community
            </Link>
            <Link href="/verify" className="text-[#A0A5B5] hover:text-[#EFFF4F] transition-colors flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Verify Cert
            </Link>
          </nav>

          {/* User Controls & Action */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider px-3.5 py-2 border border-[#252A36] text-[#A0A5B5] hover:border-[#EFFF4F] hover:text-[#EFFF4F] transition-all"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </Link>
            <Link
              href="/courses"
              className="hidden sm:inline-flex text-xs font-mono font-bold uppercase tracking-wider px-4 py-2 bg-[#EFFF4F] text-[#10131A] hover:bg-[#EFFF4F]/90 transition-colors shadow-lemon-sm"
            >
              Enroll Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
