"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Music,
  Code,
  Palette,
  Camera,
  MessageSquare,
  Headphones,
  Zap,
  ArrowRight,
  Users,
  Compass,
} from "lucide-react";

export default function CommunityWelcomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans text-white">
      {/* Page Header matching LMS standard style */}
      <div className="border-b border-[#3E3E43] pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="font-mono text-xs text-[#5A5F70] uppercase tracking-widest mb-1 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 text-[#EFFF4F] font-bold text-[10px]">
              COMMUNITY
            </span>
            <span>•</span>
            <span className="text-[#A0A5B5]">NEXTGEN ACADEMY TRIBE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span>THE TRIBE WHERE EVERYONE COOKS</span>
            <Zap className="w-8 h-8 text-[#EFFF4F] shrink-0" />
          </h1>
          <p className="text-sm text-[#A0A5B5] mt-2 max-w-2xl">
            Stop being an NPC. Lock in with real builders and level up your skills.
          </p>
        </div>
      </div>

      {/* Main Hero Card Container */}
      <div className="border border-[#3E3E43] bg-[#202023] p-8 sm:p-12 relative overflow-hidden flex flex-col items-center justify-center text-center space-y-8 shadow-2xl">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-purple-600/15 via-[#EFFF4F]/10 to-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Constellation Web Graphic */}
        <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center z-10">
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
            <div className="relative w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-[#EFFF4F] to-cyan-400 shadow-xl shadow-purple-500/20">
              <div className="w-full h-full rounded-full overflow-hidden bg-neutral-900 border-2 border-neutral-950">
                <Image
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
                  alt="Center Community Member"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Node 1: Top Avatar */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
            <div className="w-11 h-11 rounded-full p-0.5 bg-amber-400/80 shadow-md">
              <div className="w-full h-full rounded-full overflow-hidden bg-neutral-900">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                  alt="Community Member"
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Node 2: Left Avatar (Beard) */}
          <div className="absolute left-6 top-1/3 -translate-y-1/2 z-20">
            <div className="w-11 h-11 rounded-full p-0.5 bg-cyan-400/80 shadow-md">
              <div className="w-full h-full rounded-full overflow-hidden bg-neutral-900">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                  alt="Community Member"
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Node 3: Right Avatar (Phone) */}
          <div className="absolute right-6 top-1/3 -translate-y-1/2 z-20">
            <div className="w-11 h-11 rounded-full p-0.5 bg-purple-400/80 shadow-md">
              <div className="w-full h-full rounded-full overflow-hidden bg-neutral-900">
                <Image
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80"
                  alt="Community Member"
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Node 4: Bottom-Left Avatar */}
          <div className="absolute left-10 bottom-10 z-20">
            <div className="w-11 h-11 rounded-full p-0.5 bg-pink-400/80 shadow-md">
              <div className="w-full h-full rounded-full overflow-hidden bg-neutral-900">
                <Image
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80"
                  alt="Community Member"
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Node 5: Bottom-Right Avatar (Smiling) */}
          <div className="absolute right-10 bottom-10 z-20">
            <div className="w-11 h-11 rounded-full p-0.5 bg-emerald-400/80 shadow-md">
              <div className="w-full h-full rounded-full overflow-hidden bg-neutral-900">
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80"
                  alt="Community Member"
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* FLOATING INTEREST BADGE NODES */}
          {/* Music Badge (Top Left) */}
          <div className="absolute top-12 left-4 z-20 w-9 h-9 rounded-full bg-[#E8DAB2] text-neutral-800 flex items-center justify-center shadow-md">
            <Music className="w-4 h-4" />
          </div>

          {/* Code / Laptop Badge (Top Right) */}
          <div className="absolute top-12 right-4 z-20 w-9 h-9 rounded-full bg-[#1F2937] border border-white/20 text-[#EFFF4F] flex items-center justify-center shadow-md">
            <Code className="w-4 h-4" />
          </div>

          {/* Palette / Design Badge (Far Left) */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-[#BEE1E6] text-neutral-800 flex items-center justify-center shadow-md">
            <Palette className="w-4 h-4" />
          </div>

          {/* Camera / Media Badge (Far Right) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-[#FDE2E4] text-neutral-800 flex items-center justify-center shadow-md">
            <Camera className="w-4 h-4" />
          </div>

          {/* Headphones Badge (Bottom Left) */}
          <div className="absolute bottom-2 left-6 z-20 w-8 h-8 rounded-full bg-[#DFCCF1] text-neutral-800 flex items-center justify-center shadow-md">
            <Headphones className="w-4 h-4" />
          </div>

          {/* Chat Badge (Bottom Right) */}
          <div className="absolute bottom-2 right-6 z-20 w-8 h-8 rounded-full bg-[#C5EFCB] text-neutral-800 flex items-center justify-center shadow-md">
            <MessageSquare className="w-4 h-4" />
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
        <div className="max-w-xl mx-auto space-y-4 z-10">
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            The Tribe Where Everyone Cooks
          </h2>
          <p className="text-sm text-[#A0A5B5] max-w-md mx-auto leading-relaxed">
            Stop being an NPC. Lock in with real builders and level up your skills.
          </p>

          {/* Primary Action Button: "Get Started" */}
          <div className="pt-2 flex items-center justify-center">
            <Link
              href="/community/feed"
              className="px-8 py-3.5 bg-[#EFFF4F] text-[#28282B] font-mono text-xs uppercase font-bold hover:bg-[#EFFF4F]/90 transition-all shadow-lemon-sm flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
