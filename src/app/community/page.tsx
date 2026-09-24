"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Bot,
  ShieldCheck,
  Layers,
  Terminal,
  ArrowRight,
  Users,
  Compass,
  CheckCircle2,
} from "lucide-react";
import CommunityFeed from "@/components/community/CommunityFeed";

export default function CommunityPage() {
  const feedRef = useRef<HTMLDivElement>(null);

  const scrollToFeed = () => {
    feedRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white font-sans selection:bg-[#EFFF4F] selection:text-black">
      {/* ======================================================== */}
      {/* HERO NETWORK DIAGRAM COMPONENT (Prompt 1)                */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        {/* Ambient Dark Gradient & Radial Backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-[#EFFF4F]/5 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10 space-y-10">
          {/* Central Orbit Network Graphic */}
          <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
            {/* Outer Circular Orbit 1 (Dotted) */}
            <div className="absolute inset-0 rounded-full border border-dashed border-white/10 animate-[spin_60s_linear_infinite]" />

            {/* Intersecting Tilted Orbital Ring 2 */}
            <div className="absolute w-[340px] h-[340px] rounded-full border border-dashed border-white/15 rotate-12" />

            {/* Inner Orbital Ring 3 */}
            <div className="absolute w-[220px] h-[220px] rounded-full border border-dotted border-white/20 animate-[spin_40s_linear_infinite_reverse]" />

            {/* SVG Connecting Ray Lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
              viewBox="0 0 384 384"
            >
              <line
                x1="192"
                y1="192"
                x2="60"
                y2="90"
                stroke="white"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <line
                x1="192"
                y1="192"
                x2="324"
                y2="90"
                stroke="white"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <line
                x1="192"
                y1="192"
                x2="60"
                y2="294"
                stroke="white"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <line
                x1="192"
                y1="192"
                x2="324"
                y2="294"
                stroke="white"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            </svg>

            {/* Central Node Avatar (The Hub) */}
            <div className="relative z-20 flex flex-col items-center">
              <div className="relative">
                <span className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-400 via-[#EFFF4F] to-emerald-400 opacity-75 blur-md animate-pulse" />
                <div className="relative w-20 h-20 rounded-full p-1 bg-[#121216] border-2 border-white/30 shadow-2xl flex items-center justify-center overflow-hidden">
                  <Image
                    src="/instructor/rahul-kamat.png"
                    alt="Central Community Hub Avatar"
                    width={80}
                    height={80}
                    className="object-cover w-full h-full rounded-full"
                  />
                </div>
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#0A0A0C]" />
              </div>
            </div>

            {/* Outer Orbit Node 1: AUTOMATION (Top Left) */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center gap-2 bg-[#141418]/90 backdrop-blur-md border border-cyan-500/30 px-3 py-1.5 rounded-full shadow-lg shadow-cyan-500/10 hover:scale-105 transition-transform cursor-pointer">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-white/90">Automation</span>
            </div>

            {/* Outer Orbit Node 2: SDET (Top Right) */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-2 bg-[#141418]/90 backdrop-blur-md border border-emerald-500/30 px-3 py-1.5 rounded-full shadow-lg shadow-emerald-500/10 hover:scale-105 transition-transform cursor-pointer">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-white/90">SDET</span>
            </div>

            {/* Outer Orbit Node 3: PLAYWRIGHT (Bottom Left) */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-20 flex items-center gap-2 bg-[#141418]/90 backdrop-blur-md border border-amber-500/30 px-3 py-1.5 rounded-full shadow-lg shadow-amber-500/10 hover:scale-105 transition-transform cursor-pointer">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-white/90">Playwright</span>
            </div>

            {/* Outer Orbit Node 4: DEVOPS (Bottom Right) */}
            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 flex items-center gap-2 bg-[#141418]/90 backdrop-blur-md border border-purple-500/30 px-3 py-1.5 rounded-full shadow-lg shadow-purple-500/10 hover:scale-105 transition-transform cursor-pointer">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center">
                <Terminal className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-white/90">DevOps</span>
            </div>

            {/* Outer Orbiting User Avatars */}
            <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-8 h-8 rounded-full border border-white/20 overflow-hidden shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Peer Avatar"
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-8 h-8 rounded-full border border-white/20 overflow-hidden shadow-md">
              <Image
                src="/instructor/rahul-kamat.png"
                alt="Peer Avatar"
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Typography & Styling */}
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Where Interest Becomes{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#EFFF4F] to-emerald-400">
                Community
              </span>
            </h1>
            <p className="text-base sm:text-lg text-white/60 font-sans max-w-xl mx-auto leading-relaxed">
              Join peer spaces built around your technical interest, not just the people you know.
            </p>
          </div>

          {/* Call-to-Action Pill Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            {/* Pill-shaped primary button */}
            <button
              onClick={scrollToFeed}
              className="px-8 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-all shadow-xl shadow-white/10 flex items-center gap-2 group active:scale-95"
            >
              <span>Explore Spaces</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Secondary subtle action */}
            <Link
              href="/dashboard"
              className="text-sm text-white/60 hover:text-white transition-colors py-2 px-4 rounded-full hover:bg-white/5 font-medium"
            >
              Already a member? <span className="underline underline-offset-4 text-white">Sign In</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* MAIN COMMUNITY FEED & SPACE NAVIGATOR (Prompt 2)         */}
      {/* ======================================================== */}
      <section ref={feedRef} className="py-8">
        <CommunityFeed />
      </section>
    </div>
  );
}
