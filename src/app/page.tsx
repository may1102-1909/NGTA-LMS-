"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Scene } from "@/components/CrtScene";
import LoginButton from "@/components/LoginButton";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#070709] text-white overflow-x-hidden selection:bg-lime-400 selection:text-black font-sans flex flex-col justify-between">
      {/* ── AMBIENT COSMIC BACKGROUND, SVG NOISE & NEBULA PARTICLES ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Subtle noise texture */}
        <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />

        {/* Subtle deep nebula radial glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1100px] h-[650px] bg-gradient-to-b from-lime-500/10 via-emerald-950/5 to-transparent blur-[120px] -z-10" />
        <div className="absolute top-[40%] left-[15%] w-[450px] h-[450px] bg-lime-500/5 blur-[140px] -z-10" />
        <div className="absolute top-[50%] right-[15%] w-[500px] h-[500px] bg-emerald-600/5 blur-[150px] -z-10" />

        {/* Ambient background micro-grid dots */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* ── MAIN FULL-FOCUS CRT TERMINAL STAGE ── */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-28 sm:pb-36 text-center flex flex-col items-center justify-center flex-1">

        {/* Centerpiece High-Resolution ThreeUI Zion Mainframe CRT Terminal */}
        <div className="w-full max-w-5xl relative">
          {/* Radial spotlight glow border instead of flat border */}
          <div className="relative bg-gradient-to-b from-zinc-800/60 via-zinc-800/20 to-transparent rounded-3xl p-[1px] shadow-[0_30px_120px_rgba(0,0,0,0.95),0_0_80px_rgba(163,230,53,0.06)]">
            <div className="rounded-3xl bg-[#0a0c10]/95 p-2 sm:p-3">
              {/* CRT Screen Display Area */}
              <div className="w-full h-[540px] sm:h-[620px] lg:h-[660px] rounded-2xl overflow-hidden">
                <Scene />
              </div>
            </div>
          </div>
        </div>

        {/* ── ACTION BUTTON TO ENTER UNTOUCHED LMS PLATFORM ── */}
        <div className="mt-14 sm:mt-20 mb-12 sm:mb-20 flex flex-col items-center justify-center gap-4 font-mono">
          <LoginButton />
        </div>
      </main>

      {/* ── FOOTER ── */}
      <div className="relative z-10 w-full mt-auto">
        <Footer />
      </div>
    </div>
  );
}
