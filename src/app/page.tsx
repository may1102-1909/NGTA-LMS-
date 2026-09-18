"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Award,
  Terminal,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Scene } from "@/components/CrtScene";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#000000] text-white overflow-x-hidden selection:bg-emerald-500 selection:text-black font-sans">
      {/* ── AMBIENT COSMIC BACKGROUND & NEBULA PARTICLES (ECOLIFE-TENSOR STYLE) ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Subtle deep nebula radial glows */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1100px] h-[650px] bg-gradient-to-b from-emerald-500/15 via-emerald-950/5 to-transparent blur-[120px] -z-10" />
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

      {/* ── TOP NAV BAR (MATCHING .Tensor LOGO IN ECOLIFE-TENSOR) ── */}
      <nav className="relative z-30 max-w-7xl mx-auto px-6 sm:px-8 pt-6 sm:pt-8 flex items-center justify-between">
        {/* Left: .Tensor-style Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399] animate-pulse"></span>
          <span className="font-mono text-lg tracking-wider font-extrabold text-white">
            .NGTA
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono tracking-widest text-zinc-500 uppercase px-2 py-0.5 border border-zinc-800 rounded bg-zinc-950/80">
            MAINFRAME
          </span>
        </Link>

        {/* Right: Sleek Minimal Navigation Links */}
        <div className="flex items-center gap-4 sm:gap-6 text-xs font-mono">
          <Link
            href="/courses"
            className="hidden md:inline-block text-zinc-400 hover:text-white transition-colors"
          >
            COURSES
          </Link>
          <Link
            href="/verify"
            className="hidden md:inline-block text-zinc-400 hover:text-white transition-colors"
          >
            VERIFY CERT
          </Link>
          <Link
            href="/dashboard"
            className="hidden sm:inline-block text-zinc-400 hover:text-white transition-colors"
          >
            DASHBOARD
          </Link>
          <Link
            href="/lms"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/40 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all hover:scale-105 shadow-[0_0_20px_rgba(52,211,153,0.2)] font-bold tracking-wider"
          >
            <span>ENTER LMS</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* ── HERO SECTION (ECOLIFE-TENSOR 3D HEADER & PILL ACTION) ── */}
      <main className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-20 text-center flex flex-col items-center">
        {/* Top Badge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.15] text-zinc-300 font-mono text-xs backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.5)] mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] animate-ping"></span>
          <span className="font-semibold tracking-widest uppercase text-[11px]">
            SYS_RELEASE: v1.0.0 // AUTONOMOUS SDET MATRIX
          </span>
        </div>

        {/* 3D Volumetric Extruded Title (Matching ECO LIFE in ecolife-tensor) */}
        <div className="relative py-2 select-none">
          <h1
            className="text-6xl sm:text-8xl md:text-9xl font-black uppercase tracking-tight text-white leading-none"
            style={{
              letterSpacing: "0.04em",
              textShadow: `
                0 1px 0 #86efac,
                0 2px 0 #4ade80,
                0 3px 0 #22c55e,
                0 4px 0 #16a34a,
                0 5px 0 #15803d,
                0 6px 0 #166534,
                0 7px 0 #14532d,
                0 8px 1px rgba(0,0,0,0.6),
                0 15px 35px rgba(34,197,94,0.35),
                0 30px 60px rgba(0,0,0,0.95)
              `,
            }}
          >
            NGTA LMS
          </h1>
        </div>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto mt-6 text-base sm:text-xl text-zinc-400 font-normal leading-relaxed">
          Architect mission-critical automation frameworks, eliminate flaky tests in real-time, and earn cryptographically verifiable SDET credentials.
        </p>

        {/* Central Pill Buttons (Matching Get Started in ecolife-tensor) */}
        <div className="pt-8 flex flex-wrap justify-center items-center gap-4">
          <Link
            href="/lms"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-white text-zinc-950 font-bold text-sm sm:text-base rounded-full hover:bg-zinc-100 transition-all hover:scale-105 shadow-[0_0_35px_rgba(255,255,255,0.35)] tracking-wide group"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 px-6 py-3.5 border border-zinc-700/80 text-zinc-300 hover:text-white hover:border-emerald-500/60 font-mono text-xs uppercase tracking-wider rounded-full transition-all bg-zinc-900/70 backdrop-blur hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verify Credential</span>
          </Link>
        </div>

        {/* ── CENTERPIECE: ULTRA-CRISP THREEUI ZION MAINFRAME CRT TERMINAL (IMAGE 2) ── */}
        <div className="w-full max-w-5xl mt-14 sm:mt-18 relative">
          {/* Subtle Floating Telemetry Pill Left (Inspired by floating-card in ecolife-tensor) */}
          <div className="hidden lg:flex absolute -left-12 top-24 z-30 flex-col items-start p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/90 backdrop-blur-md shadow-2xl space-y-1 text-left animate-[bounce_6s_infinite]">
            <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 font-bold">
              <Activity className="w-3 h-3" />
              <span>TEST VELOCITY</span>
            </div>
            <div className="text-xl font-mono font-black text-white">99.98%</div>
            <div className="text-[10px] text-zinc-500 font-mono">Parallel Pass Target</div>
          </div>

          {/* Subtle Floating Telemetry Pill Right (Inspired by floating-card in ecolife-tensor) */}
          <div className="hidden lg:flex absolute -right-12 top-40 z-30 flex-col items-start p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/90 backdrop-blur-md shadow-2xl space-y-1 text-left animate-[bounce_7s_infinite]">
            <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 font-bold">
              <Zap className="w-3 h-3" />
              <span>GRID LATENCY</span>
            </div>
            <div className="text-xl font-mono font-black text-white">&lt; 200ms</div>
            <div className="text-[10px] text-zinc-500 font-mono">W3C WebDriver Nodes</div>
          </div>

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
            <div className="w-full h-[520px] sm:h-[600px] lg:h-[640px] rounded overflow-hidden">
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

        {/* ── FAST LINK TO LMS PLATFORM ── */}
        <div className="mt-16 text-center">
          <Link
            href="/lms"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all font-mono text-xs uppercase tracking-wider"
          >
            <span>Browse Full SDET Learning Management System</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </Link>
        </div>
      </main>

      {/* ── MINIMAL DARK FOOTER ── */}
      <footer className="relative z-20 border-t border-zinc-900 bg-black/90 py-8 text-center text-xs font-mono text-zinc-600">
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
