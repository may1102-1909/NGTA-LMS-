"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserRole } from "@/types";
import { ShieldCheck, BookOpen, Video, Users, LayoutDashboard } from "lucide-react";

interface HeaderProps {
  currentRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
}

export default function Header({ currentRole = "LEARNER", onRoleChange }: HeaderProps) {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-[#28282B]/95 backdrop-blur-md border-b border-[#3E3E43] text-white">
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
                <span className="text-xs font-mono font-bold px-1.5 py-0.5 bg-[#EFFF4F] text-[#28282B] tracking-widest uppercase">
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
              className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider px-3.5 py-2 border border-[#3E3E43] text-[#A0A5B5] hover:border-[#EFFF4F] hover:text-[#EFFF4F] transition-all"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </Link>
            <Link
              href="/courses"
              className="hidden sm:inline-flex text-xs font-mono font-bold uppercase tracking-wider px-4 py-2 bg-[#EFFF4F] text-[#28282B] hover:bg-[#EFFF4F]/90 transition-colors shadow-lemon-sm"
            >
              Enroll Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
