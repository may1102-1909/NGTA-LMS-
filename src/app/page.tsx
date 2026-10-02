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
    <div className="relative min-h-screen w-full bg-[#28282B] text-white overflow-x-hidden selection:bg-emerald-500 selection:text-[#28282B] font-sans flex flex-col justify-between">
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
      <main className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-28 sm:pb-40 text-center flex flex-col items-center justify-center flex-1">
        {/* Centerpiece High-Resolution ThreeUI Zion Mainframe CRT Terminal */}
        <div className="w-full max-w-5xl relative">

          {/* High-Resolution Monitor Chassis */}
          <div className="relative rounded-2xl border-4 border-zinc-800/90 bg-[#060f08] p-2 sm:p-3 shadow-[0_30px_120px_rgba(0,0,0,1),0_0_90px_rgba(34,197,94,0.14)]">

            {/* CRT Screen Display Area */}
            <div className="w-full h-[540px] sm:h-[620px] lg:h-[660px] rounded overflow-hidden">
              <Scene />
            </div>

          </div>
        </div>

        {/* ── ACTION BUTTON TO ENTER UNTOUCHED LMS PLATFORM ── */}
        <div className="mt-16 sm:mt-24 mb-16 sm:mb-28 flex flex-col items-center justify-center gap-4 font-mono">
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
