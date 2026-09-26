"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import CommunityHeaderNav, { SparkLogo } from "@/components/community/CommunityHeaderNav";
import MobileStatusBar from "@/components/community/MobileStatusBar";
import { Music, Code, Palette, Camera, MessageSquare, Headphones, Zap } from "lucide-react";

export default function CommunityWelcomePage() {
  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col items-center">
      {/* Top 3-Page Switcher Bar */}
      <CommunityHeaderNav />

      {/* Main Container - Framed like the reference mobile mockup */}
      <div className="w-full flex-1 flex items-center justify-center p-3 sm:p-6 lg:p-8">
        <div className="w-full max-w-[410px] min-h-[780px] bg-[#141418] border border-white/10 rounded-[44px] shadow-2xl shadow-black/80 flex flex-col justify-between p-6 sm:p-7 relative overflow-hidden">
          
          {/* Background Ambient Glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-tr from-purple-600/15 via-[#EFFF4F]/10 to-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top: Mobile Status Bar & Spark Logo */}
          <div className="w-full flex flex-col items-center z-10">
            <MobileStatusBar />
            <div className="mt-4">
              <SparkLogo className="w-12 h-12" />
            </div>
          </div>

          {/* Middle: Interactive Network Constellation Web */}
          <div className="relative w-full aspect-square max-w-[340px] mx-auto my-3 flex items-center justify-center z-10">
            {/* SVG Connecting Orbits and Dotted Ellipses */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
              viewBox="0 0 320 320"
            >
              {/* Ellipse 1 (Horizontal Dotted Orbit) */}
              <ellipse
                cx="160"
                cy="160"
                rx="140"
                ry="80"
                fill="none"
                stroke="#6B7280"
                strokeWidth="1"
                strokeDasharray="3 4"
                transform="rotate(-25 160 160)"
              />
              {/* Ellipse 2 (Intersecting Tilted Orbit) */}
              <ellipse
                cx="160"
                cy="160"
                rx="140"
                ry="80"
                fill="none"
                stroke="#6B7280"
                strokeWidth="1"
                strokeDasharray="3 4"
                transform="rotate(35 160 160)"
              />
              {/* Ellipse 3 (Vertical Dotted Orbit) */}
              <ellipse
                cx="160"
                cy="160"
                rx="140"
                ry="85"
                fill="none"
                stroke="#6B7280"
                strokeWidth="1"
                strokeDasharray="3 4"
                transform="rotate(90 160 160)"
              />

              {/* Connecting Star Lines to Center */}
              <line x1="160" y1="160" x2="160" y2="50" stroke="#E5E7EB" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.4" />
              <line x1="160" y1="160" x2="60" y2="120" stroke="#E5E7EB" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.4" />
              <line x1="160" y1="160" x2="260" y2="120" stroke="#E5E7EB" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.4" />
              <line x1="160" y1="160" x2="80" y2="230" stroke="#E5E7EB" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.4" />
              <line x1="160" y1="160" x2="240" y2="230" stroke="#E5E7EB" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.4" />
            </svg>

            {/* Central Node Avatar (Hub) */}
            <div className="relative z-20">
              <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 via-[#EFFF4F] to-cyan-400 shadow-xl shadow-purple-500/20">
                <div className="w-full h-full rounded-full overflow-hidden bg-neutral-900 border-2 border-neutral-950">
                  <Image
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
                    alt="Center Community Member"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Node 1: Top Avatar */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
              <div className="w-10 h-10 rounded-full p-0.5 bg-amber-400/80 shadow-md">
                <div className="w-full h-full rounded-full overflow-hidden bg-neutral-900">
                  <Image
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                    alt="Community Member"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Node 2: Left Avatar (Beard) */}
            <div className="absolute left-6 top-1/3 -translate-y-1/2 z-20">
              <div className="w-10 h-10 rounded-full p-0.5 bg-cyan-400/80 shadow-md">
                <div className="w-full h-full rounded-full overflow-hidden bg-neutral-900">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                    alt="Community Member"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Node 3: Right Avatar (Phone) */}
            <div className="absolute right-6 top-1/3 -translate-y-1/2 z-20">
              <div className="w-10 h-10 rounded-full p-0.5 bg-purple-400/80 shadow-md">
                <div className="w-full h-full rounded-full overflow-hidden bg-neutral-900">
                  <Image
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80"
                    alt="Community Member"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Node 4: Bottom-Left Avatar */}
            <div className="absolute left-10 bottom-10 z-20">
              <div className="w-10 h-10 rounded-full p-0.5 bg-pink-400/80 shadow-md">
                <div className="w-full h-full rounded-full overflow-hidden bg-neutral-900">
                  <Image
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80"
                    alt="Community Member"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Node 5: Bottom-Right Avatar (Smiling) */}
            <div className="absolute right-10 bottom-10 z-20">
              <div className="w-10 h-10 rounded-full p-0.5 bg-emerald-400/80 shadow-md">
                <div className="w-full h-full rounded-full overflow-hidden bg-neutral-900">
                  <Image
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80"
                    alt="Community Member"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* FLOATING INTEREST BADGE NODES (matching screenshot) */}
            {/* Music Badge (Top Left) */}
            <div className="absolute top-12 left-4 z-20 w-8 h-8 rounded-full bg-[#E8DAB2] text-neutral-800 flex items-center justify-center shadow-md">
              <Music className="w-4 h-4" />
            </div>

            {/* Code / Laptop Badge (Top Right) */}
            <div className="absolute top-12 right-4 z-20 w-8 h-8 rounded-full bg-[#1F2937] border border-white/20 text-[#EFFF4F] flex items-center justify-center shadow-md">
              <Code className="w-4 h-4" />
            </div>

            {/* Palette / Design Badge (Far Left) */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#BEE1E6] text-neutral-800 flex items-center justify-center shadow-md">
              <Palette className="w-4 h-4" />
            </div>

            {/* Camera / Media Badge (Far Right) */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#FDE2E4] text-neutral-800 flex items-center justify-center shadow-md">
              <Camera className="w-4 h-4" />
            </div>

            {/* Headphones Badge (Bottom Left) */}
            <div className="absolute bottom-2 left-6 z-20 w-7 h-7 rounded-full bg-[#DFCCF1] text-neutral-800 flex items-center justify-center shadow-md">
              <Headphones className="w-3.5 h-3.5" />
            </div>

            {/* Chat Badge (Bottom Right) */}
            <div className="absolute bottom-2 right-6 z-20 w-7 h-7 rounded-full bg-[#C5EFCB] text-neutral-800 flex items-center justify-center shadow-md">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>

            {/* Accent Small Colored Glow Dots */}
            <span className="absolute top-8 left-14 w-2 h-2 rounded-full bg-purple-500 shadow-sm" />
            <span className="absolute top-20 right-14 w-2 h-2 rounded-full bg-pink-500 shadow-sm" />
            <span className="absolute bottom-16 left-2 w-2 h-2 rounded-full bg-cyan-400 shadow-sm" />
            <span className="absolute bottom-20 right-2 w-2.5 h-2.5 rounded-full bg-purple-400 shadow-sm" />
            <span className="absolute top-1/2 left-20 w-1.5 h-1.5 rounded-full bg-[#EFFF4F] shadow-sm" />
            <span className="absolute bottom-10 left-1/2 w-2 h-2 rounded-full bg-orange-400 shadow-sm" />
          </div>

          {/* Bottom: Typography & Call To Actions */}
          <div className="w-full text-center space-y-4 z-10 pb-2">
            <h1 className="text-2xl sm:text-[28px] font-black text-white leading-tight tracking-tight">
              Where Interest Become<br />
              Community
            </h1>
            <p className="text-xs sm:text-[13px] text-zinc-400 max-w-[280px] mx-auto leading-relaxed">
              Join communities built around your interest, not just the people you know.
            </p>

            {/* Primary Action Button: "Get Started" */}
            <div className="pt-2">
              <Link
                href="/community/signup"
                className="w-full block py-3.5 px-6 rounded-full bg-white text-black font-bold text-sm hover:bg-neutral-200 active:scale-[0.98] transition-all shadow-xl shadow-white/10"
              >
                Get Started
              </Link>
            </div>

            {/* Secondary Action Link */}
            <div className="pt-1">
              <p className="text-xs text-zinc-400">
                Already have an account?{" "}
                <Link
                  href="/community/feed"
                  className="text-white font-semibold underline underline-offset-4 hover:text-[#EFFF4F] transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
