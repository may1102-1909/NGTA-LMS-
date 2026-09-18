"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Scene } from "@/components/CrtScene";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#000000] text-white overflow-x-hidden selection:bg-emerald-500 selection:text-black font-sans flex flex-col justify-between">
      {/* ── AMBIENT COSMIC BACKGROUND & NEBULA PARTICLES ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Subtle deep nebula radial glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1100px] h-[650px] bg-gradient-to-b from-emerald-500/15 via-emerald-950/5 to-transparent blur-[120px] -z-10" />
        <div className="absolute top-[40%] left-[15%] w-[450px] h-[450px] bg-blue-500/5 blur-[140px] -z-10" />
        <div className="absolute top-[50%] right-[15%] w-[500px] h-[500px] bg-emerald-600/5 blur-[150px] -z-10" />

        {/* Ambient background micro-grid dots */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* ── MAIN FULL-FOCUS CRT TERMINAL STAGE ── */}
      <main className="relative z-20 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-12 text-center flex flex-col items-center justify-center flex-1">
        {/* Centerpiece High-Resolution ThreeUI Zion Mainframe CRT Terminal */}
        <div className="w-full max-w-5xl relative">

          {/* High-Resolution Monitor Chassis */}
          <div className="relative rounded-2xl border-4 border-zinc-800/90 bg-[#060f08] p-2 sm:p-3 shadow-[0_30px_120px_rgba(0,0,0,1),0_0_90px_rgba(34,197,94,0.14)]">
            {/* Monitor Bezel Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/80 bg-zinc-950/90 rounded-t-lg font-mono text-xs text-zinc-400 mb-2">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shadow-[0_0_8px_rgba(239,68,68,0.7)]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shadow-[0_0_8px_rgba(245,158,11,0.7)]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-[0_0_8px_rgba(16,185,129,0.7)]"></span>
                <span className="text-zinc-200 font-bold ml-2 uppercase text-[11px] tracking-wider">
                  ZION MAINFRAME // THREEUI CRT PHOSPHOR TERMINAL
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>RAW_WEBGL // 60 FPS</span>
              </div>
            </div>

            {/* CRT Screen Display Area */}
            <div className="w-full h-[540px] sm:h-[620px] lg:h-[660px] rounded overflow-hidden">
              <Scene />
            </div>

            {/* Monitor Chassis Footer */}
            <div className="mt-2 px-3 py-1.5 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <div className="flex items-center gap-3">
                <span>SYSTEM: 2199 NEBUCHADNEZZAR</span>
                <span>•</span>
                <span>CRT PHOSPHOR: GREEN</span>
              </div>
              <div className="text-emerald-400 font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>SYSTEM READY. ACCESS GRANTED.</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── ACTION BUTTON TO ENTER UNTOUCHED LMS PLATFORM ── */}
        <div className="mt-10 flex flex-wrap justify-center items-center gap-4 font-mono">
          <Link
            href="/lms"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-white text-zinc-950 font-bold text-sm uppercase tracking-wider rounded-full hover:bg-zinc-200 transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.35)] group"
          >
            <span>Enter LMS Platform</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 px-6 py-3.5 border border-zinc-700/80 text-zinc-300 hover:text-white hover:border-emerald-500/60 font-mono text-xs uppercase tracking-wider rounded-full transition-all bg-zinc-900/70 backdrop-blur"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verify Certificate</span>
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3.5 border border-zinc-800 text-zinc-400 hover:text-white font-mono text-xs uppercase tracking-wider rounded-full transition-colors bg-zinc-950/80 backdrop-blur"
          >
            <span>Dashboard</span>
          </Link>
        </div>
      </main>

      {/* ── MINIMAL DARK FOOTER ── */}
      <footer className="relative z-20 border-t border-zinc-900 bg-black/90 py-6 text-center text-xs font-mono text-zinc-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            &copy; {new Date().getFullYear()} NextGen Testing Academy. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-zinc-500">
            <Link href="/lms" className="hover:text-emerald-400 transition-colors">
              Platform
            </Link>
            <Link href="/courses" className="hover:text-emerald-400 transition-colors">
              Curriculum
            </Link>
            <Link href="/verify" className="hover:text-emerald-400 transition-colors">
              Verification
            </Link>
            <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
