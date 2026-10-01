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
      {/* Page Header matching Rune Realms LMS standard style */}
      <div className="border-b border-[#26213B] pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="font-mono text-xs text-[#64748B] uppercase tracking-widest mb-1 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 text-[#C084FC] font-bold text-[10px]">
              COMMUNITY
            </span>
            <span>•</span>
            <span className="text-[#94A3B8]">NEXTGEN ACADEMY TRIBE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span>THE TRIBE WHERE EVERYONE COOKS</span>
            <Zap className="w-8 h-8 text-[#F59E0B] shrink-0" />
          </h1>
          <p className="text-sm text-[#94A3B8] mt-2 max-w-2xl">
            Stop being an NPC. Lock in with real builders and level up your skills.
          </p>
        </div>
      </div>

      {/* Main Hero Card Container */}
      <div className="border border-[#26213B] bg-[#120F1D] p-8 sm:p-12 relative overflow-hidden flex flex-col items-center justify-center text-center space-y-8 shadow-2xl rounded-lg">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-[#8B5CF6]/15 via-[#F59E0B]/10 to-[#06B6D4]/15 rounded-full blur-3xl pointer-events-none" />

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
              stroke="#8B5CF6"
              strokeWidth="1"
              strokeDasharray="3 4"
              transform="rotate(-25 160 160)"
              opacity="0.5"
            />
            {/* Ellipse 2 (Intersecting Tilted Orbit) */}
            <ellipse
              cx="160"
              cy="160"
              rx="140"
              ry="80"
              fill="none"
              stroke="#06B6D4"
              strokeWidth="1"
              strokeDasharray="3 4"
              transform="rotate(35 160 160)"
              opacity="0.5"
            />
            {/* Ellipse 3 (Vertical Dotted Orbit) */}
            <ellipse
              cx="160"
              cy="160"
              rx="140"
              ry="85"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="1"
              strokeDasharray="3 4"
              transform="rotate(90 160 160)"
              opacity="0.35"
            />

            {/* Connecting Star Lines to Center */}
            <line x1="160" y1="160" x2="160" y2="50" stroke="#C084FC" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.4" />
            <line x1="160" y1="160" x2="60" y2="120" stroke="#C084FC" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.4" />
            <line x1="160" y1="160" x2="260" y2="120" stroke="#C084FC" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.4" />
            <line x1="160" y1="160" x2="80" y2="230" stroke="#C084FC" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.4" />
            <line x1="160" y1="160" x2="240" y2="230" stroke="#C084FC" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.4" />
          </svg>

          {/* Central Node Avatar (Hub) */}
          <div className="relative z-20">
            <div className="relative w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-[#8B5CF6] via-[#F59E0B] to-[#06B6D4] shadow-xl shadow-[#8B5CF6]/20">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#0C0A14] border-2 border-[#120F1D]">
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
            <div className="w-11 h-11 rounded-full p-0.5 bg-[#F59E0B]/80 shadow-md shadow-[#F59E0B]/30">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#0C0A14]">
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
            <div className="w-11 h-11 rounded-full p-0.5 bg-[#06B6D4]/80 shadow-md shadow-[#06B6D4]/30">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#0C0A14]">
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
            <div className="w-11 h-11 rounded-full p-0.5 bg-[#A855F7]/80 shadow-md shadow-[#A855F7]/30">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#0C0A14]">
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
            <div className="w-11 h-11 rounded-full p-0.5 bg-[#D946EF]/80 shadow-md shadow-[#D946EF]/30">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#0C0A14]">
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
            <div className="w-11 h-11 rounded-full p-0.5 bg-emerald-400/80 shadow-md shadow-emerald-400/30">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#0C0A14]">
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
          <div className="absolute top-12 left-4 z-20 w-9 h-9 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/40 text-[#F59E0B] flex items-center justify-center shadow-md">
            <Music className="w-4 h-4" />
          </div>

          {/* Code / Laptop Badge (Top Right) */}
          <div className="absolute top-12 right-4 z-20 w-9 h-9 rounded-full bg-[#120F1D] border border-[#8B5CF6]/40 text-[#C084FC] flex items-center justify-center shadow-md">
            <Code className="w-4 h-4" />
          </div>

          {/* Palette / Design Badge (Far Left) */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-[#06B6D4]/20 border border-[#06B6D4]/40 text-[#06B6D4] flex items-center justify-center shadow-md">
            <Palette className="w-4 h-4" />
          </div>

          {/* Camera / Media Badge (Far Right) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-[#D946EF]/20 border border-[#D946EF]/40 text-[#D946EF] flex items-center justify-center shadow-md">
            <Camera className="w-4 h-4" />
          </div>

          {/* Headphones Badge (Bottom Left) */}
          <div className="absolute bottom-2 left-6 z-20 w-8 h-8 rounded-full bg-[#A855F7]/20 border border-[#A855F7]/40 text-[#A855F7] flex items-center justify-center shadow-md">
            <Headphones className="w-4 h-4" />
          </div>

          {/* Chat Badge (Bottom Right) */}
          <div className="absolute bottom-2 right-6 z-20 w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-md">
            <MessageSquare className="w-4 h-4" />
          </div>

          {/* Accent Small Colored Glow Dots */}
          <span className="absolute top-8 left-14 w-2 h-2 rounded-full bg-[#8B5CF6] shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
          <span className="absolute top-20 right-14 w-2 h-2 rounded-full bg-[#D946EF] shadow-[0_0_8px_rgba(217,70,239,0.6)]" />
          <span className="absolute bottom-16 left-2 w-2 h-2 rounded-full bg-[#06B6D4] shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
          <span className="absolute bottom-20 right-2 w-2.5 h-2.5 rounded-full bg-[#A855F7] shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
          <span className="absolute top-1/2 left-20 w-1.5 h-1.5 rounded-full bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
          <span className="absolute bottom-10 left-1/2 w-2 h-2 rounded-full bg-[#00F2FE] shadow-[0_0_8px_rgba(0,242,254,0.6)]" />
        </div>

        {/* Bottom: Typography & Call To Actions */}
        <div className="max-w-xl mx-auto space-y-4 z-10">
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            The Tribe Where Everyone Cooks
          </h2>
          <p className="text-sm text-[#94A3B8] max-w-md mx-auto leading-relaxed">
            Stop being an NPC. Lock in with real builders and level up your skills.
          </p>

          {/* Primary Action Button: "Get Started" */}
          <div className="pt-2 flex items-center justify-center">
            <Link
              href="/community/feed"
              className="px-8 py-3.5 bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#06B6D4] text-white font-mono text-xs uppercase font-bold hover:opacity-95 transition-all shadow-rune-purple flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] rounded"
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
