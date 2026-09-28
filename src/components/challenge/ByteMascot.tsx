"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Flame,
  Sparkles,
  X,
  Play,
  CheckCircle2,
  Trophy,
  Shield,
  Clock,
  ArrowRight,
  MessageSquare,
  Volume2,
  VolumeX,
  Zap,
  ChevronUp,
  RotateCcw,
} from "lucide-react";

export interface ByteMascotProps {
  currentDay: number;
  completedCriteriaCount: number;
  totalCriteriaCount: number;
  terminalRunning: boolean;
  pipelineState: "idle" | "running" | "complete";
  onTriggerRunTests?: () => void;
  onOpenStreakModal?: () => void;
  soundEnabled?: boolean;
  externalOpenTrigger?: number;
  externalStreakTrigger?: number;
}

const BYTE_QUOTES = [
  "Hoot! 🦉 15 minutes of test automation a day keeps the production P0 outages away!",
  "Duolingo taught you 'Hola', but Byte teaches you 'Assert.assertTrue(isProductionReady)'! 🔥",
  "A test without assertions is just an expensive console.log! Don't let your assertions sleep! ⚡",
  "Did someone say Thread.sleep(5000)? Straight to SDET jail! Always use WebDriverWait! 🚨",
  "Parallel execution without ThreadLocal is like juggling running chain-saws. You're doing great! 🛠️",
  "Your test streak is hotter than my cybernetic circuits right now! Keep the flame burning! 🔥",
  "Have you hugged your CI/CD runner today? It loves green builds as much as I love data providers! 💚",
  "Psst! ExcelReader with Apache POI is pure industry gold. Add it to your resume today! 📄",
  "Don't make me come over there with a NoSuchElementException! Finish Day 12! 🦉",
  "Every green checkmark in this gauntlet brings you one step closer to Senior SDET! 🚀",
];

export default function ByteMascot({
  currentDay,
  completedCriteriaCount,
  totalCriteriaCount,
  terminalRunning,
  pipelineState,
  onTriggerRunTests,
  onOpenStreakModal,
  soundEnabled = true,
  externalOpenTrigger = 0,
  externalStreakTrigger = 0,
}: ByteMascotProps) {
  // Mascot Bubble State
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(
    "Hoot! 🦉 I'm Byte, your AI SDET Mentor! You're on a 7-day streak. Complete Day 12 to unlock the 1.25x XP multiplier!"
  );
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isPoking, setIsPoking] = useState(false);

  // Modals
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [streakFrozen, setStreakFrozen] = useState(false);

  // Confetti particles for victory modal
  const [confettiPieces, setConfettiPieces] = useState<
    Array<{ id: number; left: number; top: number; color: string; size: number; delay: number }>
  >([]);

  // Listen for external open triggers
  useEffect(() => {
    if (externalOpenTrigger > 0) {
      setBubbleOpen(true);
      playSound("pop");
    }
  }, [externalOpenTrigger]);

  useEffect(() => {
    if (externalStreakTrigger > 0) {
      setShowStreakModal(true);
      playSound("streak");
    }
  }, [externalStreakTrigger]);

  // Sound generator
  const playSound = (type: "pop" | "poke" | "streak" | "celebrate") => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === "pop") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === "poke") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(950, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === "streak") {
        [440, 554.37, 659.25].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = f;
          gain.gain.setValueAtTime(0.07, ctx.currentTime + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.25);
          osc.start(ctx.currentTime + i * 0.08);
          osc.stop(ctx.currentTime + i * 0.08 + 0.25);
        });
      } else if (type === "celebrate") {
        [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = f;
          gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.09 + 0.4);
          osc.start(ctx.currentTime + i * 0.09);
          osc.stop(ctx.currentTime + i * 0.09 + 0.4);
        });
      }
    } catch {
      // Audio autoplay may be disabled
    }
  };

  // Initial popup trigger after delay (Duolingo style)
  useEffect(() => {
    const timer = setTimeout(() => {
      setBubbleOpen(true);
      playSound("pop");
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // React to Acceptance Criteria Changes
  const prevCountRef = useRef(completedCriteriaCount);
  useEffect(() => {
    if (completedCriteriaCount > prevCountRef.current) {
      if (completedCriteriaCount === totalCriteriaCount) {
        setCurrentMessage(
          "🎉 ALL 4 CRITERIA CHECKED! You're ready to submit for automated CI review!"
        );
      } else {
        setCurrentMessage(
          `BOOM! 🎯 Acceptance criterion completed (${completedCriteriaCount}/${totalCriteriaCount})! Byte is nodding in approval.`
        );
      }
      setBubbleOpen(true);
      playSound("pop");
    }
    prevCountRef.current = completedCriteriaCount;
  }, [completedCriteriaCount, totalCriteriaCount]);

  // React to Terminal Test Suite Execution
  useEffect(() => {
    if (terminalRunning) {
      setCurrentMessage(
        "🚀 Spinning up Maven Surefire test workers! Watch those ThreadLocal sessions run in parallel!"
      );
      setBubbleOpen(true);
      playSound("pop");
    }
  }, [terminalRunning]);

  // React to Pipeline Complete (Victory Celebration)
  useEffect(() => {
    if (pipelineState === "complete") {
      setShowCelebrationModal(true);
      playSound("celebrate");

      // Generate confetti
      const pieces = Array.from({ length: 45 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: -10 - Math.random() * 20,
        color: ["#EFFF4F", "#10B981", "#3B82F6", "#F59E0B", "#EC4899"][i % 5],
        size: 6 + Math.random() * 8,
        delay: Math.random() * 2,
      }));
      setConfettiPieces(pieces);
    }
  }, [pipelineState]);

  // Poke Byte for funny tips / dialogue
  const handlePokeByte = () => {
    setIsPoking(true);
    playSound("poke");
    const nextIdx = (quoteIndex + 1) % BYTE_QUOTES.length;
    setQuoteIndex(nextIdx);
    setCurrentMessage(BYTE_QUOTES[nextIdx]);
    setBubbleOpen(true);
    setTimeout(() => setIsPoking(false), 400);
  };

  return (
    <>
      {/* ======================================================== */}
      {/* 1. FLOATING BYTE MASCOT & DUOLINGO-STYLE SPEECH BUBBLE   */}
      {/* ======================================================== */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none select-none">
        {/* Animated Speech Bubble */}
        {bubbleOpen && !minimized && (
          <div className="pointer-events-auto mb-3 max-w-sm sm:max-w-md w-full bg-[#1F1F23] border-2 border-[#EFFF4F]/80 rounded-2xl p-4 sm:p-5 shadow-[0_12px_36px_rgba(0,0,0,0.65)] relative animate-in fade-in slide-in-from-bottom-3 duration-200">
            {/* Triangular Speech Pointer Tail pointing down toward Byte */}
            <div className="absolute -bottom-3 right-8 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-[#EFFF4F]" />
            <div className="absolute -bottom-2.5 right-8 w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-t-[10px] border-t-[#1F1F23]" />

            {/* Bubble Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#3E3E43] mb-2.5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                </span>
                <span className="font-mono font-black text-xs text-[#EFFF4F] tracking-wider uppercase flex items-center gap-1.5">
                  BYTE • SDET COACH
                  <span className="text-[10px] bg-[#EFFF4F]/15 text-[#EFFF4F] px-1.5 py-0.2 rounded border border-[#EFFF4F]/30">
                    LIVE
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowStreakModal(true)}
                  className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 text-[10px] font-mono font-bold hover:bg-amber-500/25 transition-colors border border-amber-500/30 flex items-center gap-1"
                  title="View streak status"
                >
                  <Flame className="w-3 h-3 fill-current" />
                  <span>7d STREAK</span>
                </button>
                <button
                  onClick={() => setBubbleOpen(false)}
                  className="p-1 text-[#A0A5B5] hover:text-white transition-colors rounded hover:bg-[#28282B]"
                  title="Dismiss message"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Dialogue Body */}
            <p className="text-white text-xs sm:text-sm font-sans leading-relaxed tracking-normal">
              {currentMessage}
            </p>

            {/* Quick Action Pills inside bubble */}
            <div className="mt-3 pt-2.5 border-t border-[#2D2D33] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePokeByte}
                  className="px-2.5 py-1 bg-[#28282B] hover:bg-[#333336] text-[#EFFF4F] border border-[#3E3E43] hover:border-[#EFFF4F]/50 rounded-md text-[11px] font-mono font-semibold transition-all active:scale-95 flex items-center gap-1"
                >
                  <span>🦉 Poke Byte</span>
                </button>

                {onTriggerRunTests && (
                  <button
                    onClick={() => {
                      onTriggerRunTests();
                      playSound("poke");
                    }}
                    className="px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 rounded-md text-[11px] font-mono font-semibold transition-all active:scale-95 flex items-center gap-1"
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>Run Suite</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => setShowStreakModal(true)}
                className="text-[11px] font-mono font-bold text-amber-400 hover:text-amber-300 underline underline-offset-2 flex items-center gap-1"
              >
                <span>Streak Alert</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Mascot Avatar Trigger Button */}
        <div className="pointer-events-auto relative group">
          {/* Duolingo Floating Mascot Button */}
          <button
            onClick={() => {
              if (bubbleOpen) {
                handlePokeByte();
              } else {
                setBubbleOpen(true);
                playSound("pop");
              }
            }}
            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-3 border-[#EFFF4F] bg-[#18181B] shadow-[0_8px_25px_rgba(239,255,79,0.35)] transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden flex items-center justify-center ${
              isPoking ? "animate-wiggle" : "animate-bounce hover:animate-none"
            }`}
            style={{ animationDuration: "2.8s" }}
            title="Click Byte for QA tips, streak reminders, and coaching!"
          >
            <Image
              src="/mascot/byte-coach.jpg"
              alt="Byte the SDET Owl Mascot"
              fill
              className="object-cover"
              priority
            />

            {/* Subtle Neon Ring */}
            <div className="absolute inset-0 rounded-full border border-[#EFFF4F]/40 pointer-events-none" />
          </button>

          {/* Floating Duolingo-style Flame Badge */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowStreakModal(true);
              playSound("streak");
            }}
            className="absolute -top-1.5 -left-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-mono font-black text-[10px] px-1.5 py-0.5 rounded-full border border-orange-400/80 shadow-md flex items-center gap-0.5 cursor-pointer hover:scale-110 transition-transform"
            title="Streak status"
          >
            <Flame className="w-3 h-3 fill-current text-yellow-200" />
            <span>7</span>
          </div>

          {/* Unread / Speech Hint Pin */}
          {!bubbleOpen && (
            <div
              onClick={() => {
                setBubbleOpen(true);
                playSound("pop");
              }}
              className="absolute -bottom-1 -right-1 bg-[#EFFF4F] text-[#28282B] p-1.5 rounded-full shadow-lg border border-[#28282B] cursor-pointer animate-pulse"
              title="Byte has advice for you!"
            >
              <MessageSquare className="w-3 h-3 fill-current" />
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. DUOLINGO-STYLE "STREAK AT RISK" POPUP MODAL          */}
      {/* ======================================================== */}
      {showStreakModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#202023] border-2 border-amber-400/80 rounded-2xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(245,158,11,0.25)] text-center font-mono space-y-5">
            {/* Close Button */}
            <button
              onClick={() => setShowStreakModal(false)}
              className="absolute top-4 right-4 text-[#A0A5B5] hover:text-white p-1 rounded-md hover:bg-[#28282B] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Fiery Byte Mascot Image */}
            <div className="relative mx-auto w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
              <Image
                src="/mascot/byte-streak.jpg"
                alt="Byte Streak Protector"
                fill
                className="object-cover"
              />
            </div>

            {/* Title & Warning */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-black uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
                <Flame className="w-4 h-4 fill-current animate-pulse text-amber-400" />
                <span>STREAK PRESERVATION PROTOCOL</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                DON&apos;T BREAK YOUR 7-DAY STREAK!
              </h2>
              <p className="text-xs text-[#A0A5B5] font-sans max-w-sm mx-auto">
                Byte is monitoring your commit telemetry. Submit Day 12 before midnight to unlock an
                <strong> 8-Day Hot Streak</strong> and maintain your <strong>1.25x XP multiplier</strong>!
              </p>
            </div>

            {/* Duolingo Day-by-Day Streak Bar */}
            <div className="bg-[#18181B] border border-[#3E3E43] rounded-xl p-3 flex justify-between items-center text-xs">
              {[
                { day: "M", done: true },
                { day: "T", done: true },
                { day: "W", done: true },
                { day: "T", done: true },
                { day: "F", done: true },
                { day: "S", done: true },
                { day: "S", today: true },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] text-[#5A5F70] font-bold">{item.day}</span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
                      item.done
                        ? "bg-amber-500/20 border-amber-400 text-amber-400"
                        : item.today
                        ? "bg-[#EFFF4F] border-[#EFFF4F] text-[#28282B] animate-pulse shadow-lemon-sm"
                        : "bg-[#28282B] border-[#3E3E43] text-[#5A5F70]"
                    }`}
                  >
                    {item.done ? "🔥" : item.today ? "⚡" : "○"}
                  </div>
                </div>
              ))}
            </div>

            {/* Streak Freeze Toggle */}
            <div className="bg-[#28282B] border border-[#3E3E43] p-3 rounded-lg flex items-center justify-between text-left">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-cyan-500/10 border border-cyan-400/40 rounded text-cyan-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Emergency Streak Freeze</div>
                  <div className="text-[10px] text-[#A0A5B5] font-sans">
                    1 streak freeze available this sprint
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setStreakFrozen(!streakFrozen);
                  playSound("poke");
                }}
                className={`px-3 py-1.5 rounded text-xs font-bold font-mono transition-colors border ${
                  streakFrozen
                    ? "bg-cyan-500 text-[#28282B] border-cyan-400"
                    : "bg-[#1F1F23] text-cyan-400 border-cyan-400/40 hover:bg-cyan-500/10"
                }`}
              >
                {streakFrozen ? "EQUIPPED 🛡️" : "EQUIP"}
              </button>
            </div>

            {/* Duolingo 3D Button */}
            <button
              onClick={() => setShowStreakModal(false)}
              className="w-full py-3 bg-[#EFFF4F] hover:bg-[#EFFF4F]/90 text-[#28282B] font-black uppercase tracking-wider rounded-xl shadow-[0_5px_0_#9BA512] active:translate-y-1 active:shadow-[0_1px_0_#9BA512] transition-all text-sm flex items-center justify-center gap-2"
            >
              <span>LET&apos;S CRUSH DAY 12 NOW!</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. DUOLINGO-STYLE "CHALLENGE PASSED" CELEBRATION MODAL    */}
      {/* ======================================================== */}
      {showCelebrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 overflow-hidden">
          {/* Falling Confetti Sprites */}
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className="absolute animate-bounce pointer-events-none"
              style={{
                left: `${piece.left}%`,
                top: `${(piece.id * 7) % 90}%`,
                width: `${piece.size}px`,
                height: `${piece.size * 1.4}px`,
                backgroundColor: piece.color,
                borderRadius: "2px",
                transform: `rotate(${piece.id * 35}deg)`,
                opacity: 0.8,
              }}
            />
          ))}

          <div className="relative w-full max-w-lg bg-[#202023] border-2 border-emerald-400/80 rounded-2xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(16,185,129,0.3)] text-center font-mono space-y-5">
            {/* Close Button */}
            <button
              onClick={() => setShowCelebrationModal(false)}
              className="absolute top-4 right-4 text-[#A0A5B5] hover:text-white p-1 rounded-md hover:bg-[#28282B] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Celebration Mascot Image */}
            <div className="relative mx-auto w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.45)]">
              <Image
                src="/mascot/byte-celebrate.jpg"
                alt="Byte Celebrating Victory"
                fill
                className="object-cover"
              />
            </div>

            {/* Victory Header */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-black uppercase tracking-widest bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/30">
                <Trophy className="w-4 h-4 fill-current text-yellow-300" />
                <span>SDET ACCREDITATION GRANTED</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                DAY 12 CONQUERED!
              </h2>
              <p className="text-xs text-[#A0A5B5] font-sans max-w-md mx-auto">
                Byte inspected your PR submission. All automated TestNG assertions passed with 100%
                reliability!
              </p>
            </div>

            {/* Stats Badges Grid */}
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="bg-[#18181B] border border-emerald-500/40 p-3.5 rounded-xl space-y-1">
                <div className="text-[10px] text-[#5A5F70] uppercase tracking-wider font-bold">
                  REWARD EARNED
                </div>
                <div className="text-2xl font-black text-[#EFFF4F] flex items-center gap-1.5">
                  <Zap className="w-5 h-5 fill-current" />
                  <span>+35 XP</span>
                </div>
                <div className="text-[10px] text-emerald-400">1.25x Streak Multiplier Applied</div>
              </div>

              <div className="bg-[#18181B] border border-amber-500/40 p-3.5 rounded-xl space-y-1">
                <div className="text-[10px] text-[#5A5F70] uppercase tracking-wider font-bold">
                  STREAK EXTENDED
                </div>
                <div className="text-2xl font-black text-amber-400 flex items-center gap-1.5">
                  <Flame className="w-5 h-5 fill-current" />
                  <span>8 DAYS 🔥</span>
                </div>
                <div className="text-[10px] text-amber-300">New personal gauntlet record!</div>
              </div>
            </div>

            {/* Motivational Mascot Note */}
            <div className="p-3 bg-[#28282B] border border-[#3E3E43] rounded-lg text-left text-xs font-sans text-white flex items-center gap-3">
              <div className="text-2xl">🦉</div>
              <div>
                <strong>Byte says:</strong> &quot;That ThreadLocal DataProvider was pure poetry. You are on track for Day 15 POM Architect credentials!&quot;
              </div>
            </div>

            {/* Duolingo 3D Continue Button */}
            <button
              onClick={() => setShowCelebrationModal(false)}
              className="w-full py-3.5 bg-emerald-400 hover:bg-emerald-300 text-[#18181B] font-black uppercase tracking-wider rounded-xl shadow-[0_5px_0_#059669] active:translate-y-1 active:shadow-[0_1px_0_#059669] transition-all text-sm flex items-center justify-center gap-2"
            >
              <span>CONTINUE TO DAY 13 CHALLENGE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
