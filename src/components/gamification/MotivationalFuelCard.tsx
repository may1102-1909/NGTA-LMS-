"use client";

import React, { useState } from "react";
import {
  Quote,
  Flame,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  Bell,
  ArrowRight,
  ShieldCheck,
  RotateCw,
  Trophy,
} from "lucide-react";

export interface MotivationalQuote {
  id: string;
  quote: string;
  author: string;
  role: string;
  tag: string;
  nextDayTakeaway: string;
}

export const MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  {
    id: "quote-1",
    quote:
      "Discipline is choosing what you want most over what you want right now. Today you wrote the code; tomorrow at dawn, we test the limits. Protect your streak — champions never break the chain.",
    author: "Rahul Kamat",
    role: "Lead SDET Architect & Founder, NGTA",
    tag: "STREAK DEFENSE",
    nextDayTakeaway: "Day 13: JavaScript Executor unlocks tomorrow. Rest up, then conquer.",
  },
  {
    id: "quote-2",
    quote:
      "The top 1% of automation engineers aren't smarter than everyone else; they are relentlessly consistent. 30 days of daily execution transforms your career faster than 2 years of passive reading. Show up tomorrow.",
    author: "The Automation Protocol",
    role: "Engineering Leadership Codex",
    tag: "COMPOUND MASTERY",
    nextDayTakeaway: "Every challenge you finish puts you ahead of 90% of testers who quit on Day 3.",
  },
  {
    id: "quote-3",
    quote:
      "One skipped day is an accident; two skipped days is the start of a bad habit. You crushed today's mission — don't let today's victory make you complacent tomorrow. Set your alarm now.",
    author: "Atomic Habits of SDETs",
    role: "High-Output Engineering Principles",
    tag: "RELENTLESS MOMENTUM",
    nextDayTakeaway: "Your 8-day streak multiplier is active. Show up tomorrow to keep the flame burning.",
  },
  {
    id: "quote-4",
    quote:
      "Writing test frameworks is not about avoiding failures; it's about building systems resilient enough to handle them. Bring that same resilience to your daily schedule tomorrow morning.",
    author: "Continuous Testing Manifesto",
    role: "Enterprise Architecture Guide",
    tag: "RESILIENCE MINDSET",
    nextDayTakeaway: "Tomorrow's DOM manipulation and forced clicks challenge will test your real-world grit.",
  },
  {
    id: "quote-5",
    quote:
      "Small daily disciplines repeated with obsession produce catastrophic success. You conquered today. Sleep with a clear conscience, and return tomorrow ready to dominate.",
    author: "SDET Sprint Doctrine",
    role: "Core Curriculum Mindset",
    tag: "OBSESSIVE CONSISTENCY",
    nextDayTakeaway: "Day 13 is your next proving ground. Lock your commitment and let nobody outwork you.",
  },
];

interface MotivationalFuelCardProps {
  nextDayNumber?: number;
  nextTaskTitle?: string;
  nextPointsReward?: number;
  streakDays?: number;
  timeLeft?: { hours: number; minutes: number; seconds: number };
  soundEnabled?: boolean;
  onPlaySound?: (type: "click" | "check" | "celebrate") => void;
  compact?: boolean;
}

export default function MotivationalFuelCard({
  nextDayNumber = 13,
  nextTaskTitle = "JavaScript Executor: DOM manipulation & forced clicks",
  nextPointsReward = 20,
  streakDays = 8,
  timeLeft = { hours: 7, minutes: 34, seconds: 12 },
  soundEnabled = true,
  onPlaySound,
  compact = false,
}: MotivationalFuelCardProps) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isCommitted, setIsCommitted] = useState(false);
  const [reminderSet, setReminderSet] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex];

  const handleNextQuote = () => {
    if (onPlaySound) onPlaySound("click");
    setIsFading(true);
    setTimeout(() => {
      setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
      setIsFading(false);
    }, 150);
  };

  const handleCommit = () => {
    if (!isCommitted) {
      if (onPlaySound) onPlaySound("celebrate");
      setIsCommitted(true);
    }
  };

  const handleSetReminder = () => {
    if (onPlaySound) onPlaySound("check");
    setReminderSet(true);
  };

  if (compact) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-amber-400/40 bg-gradient-to-br from-[#2D2D31] via-[#242428] to-[#1C1C1F] p-4 sm:p-5 shadow-card space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-amber-400 font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 fill-current animate-pulse text-orange-400" />
            <span>TOMORROW'S FUEL</span>
            <span>•</span>
            <span className="text-[#EFFF4F]">{currentQuote.tag}</span>
          </div>

          <button
            onClick={handleNextQuote}
            className="p-1 hover:bg-[#3E3E43] text-[#A0A5B5] hover:text-white rounded transition-colors text-[10px] flex items-center gap-1 font-mono"
            title="Next inspiring quote"
          >
            <RotateCw className="w-3 h-3" />
            <span>Next Spark</span>
          </button>
        </div>

        {/* Compact Quote Content */}
        <div className={`transition-opacity duration-150 space-y-2 ${isFading ? "opacity-30" : "opacity-100"}`}>
          <div className="relative pl-3 border-l-2 border-amber-400/80">
            <p className="text-white text-xs sm:text-[13px] italic leading-relaxed font-sans font-medium">
              "{currentQuote.quote}"
            </p>
          </div>
          <div className="text-[10px] text-[#A0A5B5] font-mono flex items-center justify-between">
            <span className="text-amber-300 font-bold">— {currentQuote.author}</span>
            <span className="text-[#6B7280]">{currentQuote.role}</span>
          </div>
        </div>

        {/* Commitment Action */}
        <div className="pt-2 border-t border-[#3E3E43]/60">
          {isCommitted ? (
            <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/40 rounded-lg text-emerald-300 font-mono text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tomorrow Locked! See you at 09:00 AM</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded font-bold">
                {streakDays}d 🔥 SAFE
              </span>
            </div>
          ) : (
            <button
              onClick={handleCommit}
              className="w-full py-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-[#18181B] font-black uppercase text-xs rounded flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:scale-[1.01]"
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>I'LL BE HERE TOMORROW — LOCK COMMITMENT</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-amber-400/40 bg-gradient-to-br from-[#2C2920] via-[#242327] to-[#1A1A1D] p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)] space-y-6">
      {/* Background Decorative Quote Mark */}
      <div className="absolute right-4 top-2 select-none pointer-events-none opacity-5 text-amber-300 text-9xl font-serif">
        “
      </div>

      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#3E3E43]/70 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-[#18181B] shadow-md">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="font-mono text-[10px] text-amber-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <span>DAILY SDET MINDSET & FUEL</span>
              <span>•</span>
              <span className="px-2 py-0.2 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded">
                {currentQuote.tag}
              </span>
            </div>
            <h3 className="text-white font-black text-lg sm:text-xl uppercase tracking-tight">
              Tomorrow's Proving Ground Awaits
            </h3>
          </div>
        </div>

        {/* Quote Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleNextQuote}
            className="px-3 py-1.5 border border-[#3E3E43] bg-[#222225] hover:bg-[#2C2C30] hover:border-amber-400/50 text-[#A0A5B5] hover:text-[#EFFF4F] font-mono text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Next Spark ({quoteIndex + 1}/{MOTIVATIONAL_QUOTES.length})</span>
          </button>
        </div>
      </div>

      {/* Hero Quote Display */}
      <div className={`transition-opacity duration-200 space-y-4 ${isFading ? "opacity-25" : "opacity-100"}`}>
        <div className="relative pl-5 sm:pl-6 border-l-4 border-gradient-to-b border-amber-400">
          <Quote className="w-5 h-5 text-amber-400 mb-2 opacity-80" />
          <blockquote className="text-white text-base sm:text-lg lg:text-xl font-medium italic leading-relaxed font-sans">
            "{currentQuote.quote}"
          </blockquote>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-300 text-sm">{currentQuote.author}</span>
            <span className="text-[#5A5F70]">•</span>
            <span className="text-[#A0A5B5] text-[11px]">{currentQuote.role}</span>
          </div>

          <div className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded font-sans flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentQuote.nextDayTakeaway}</span>
          </div>
        </div>
      </div>

      {/* Tomorrow's Sprint Briefing + Commitment Interaction */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2 border-t border-[#3E3E43]/70">
        {/* Next Day Challenge Preview */}
        <div className="lg:col-span-7 bg-[#1E1E22] border border-[#3E3E43] p-4 rounded-xl space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              <span>DAY {nextDayNumber} MISSION LOCKED UNTIL MIDNIGHT</span>
            </span>
            <span className="text-xs font-bold text-[#EFFF4F] bg-[#18181A] px-2 py-0.5 rounded border border-[#3E3E43]">
              +{nextPointsReward} PTS
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-sm sm:text-base font-black text-white font-sans flex items-center gap-2">
              <span>Day {nextDayNumber}: {nextTaskTitle}</span>
            </div>
            <p className="text-[#A0A5B5] font-sans text-xs leading-relaxed">
              Don't lose your momentum. Master JavaScript execution in Selenium to bypass complex overlays and trigger non-standard events.
            </p>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-[#3E3E43]/50 text-[11px]">
            <span className="text-[#A0A5B5] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Unlocks in {String(timeLeft.hours).padStart(2, "0")}h : {String(timeLeft.minutes).padStart(2, "0")}m : {String(timeLeft.seconds).padStart(2, "0")}s</span>
            </span>
            <span className="text-orange-400 font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Streak Multiplier: 1.25x Active</span>
            </span>
          </div>
        </div>

        {/* Commitment Action Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3 bg-[#1E1E22] border border-[#3E3E43] p-4 rounded-xl font-mono text-xs">
          <div>
            <div className="text-[10px] text-[#A0A5B5] uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>DAILY STREAK PLEDGE</span>
            </div>
            <div className="text-xs text-white font-sans">
              Top SDETs commit ahead of time. Lock your showing for tomorrow to secure your streak and reputation score.
            </div>
          </div>

          {isCommitted ? (
            <div className="space-y-2">
              <div className="p-3 bg-emerald-500/15 border-2 border-emerald-400 rounded-lg text-emerald-300 font-mono text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-white uppercase text-[11px]">
                    DAY {nextDayNumber} COMMITMENT LOCKED!
                  </div>
                  <div className="text-[10px] text-emerald-300 font-sans">
                    See you tomorrow morning on the grid. {streakDays}-day streak protected! 🔥
                  </div>
                </div>
              </div>

              {!reminderSet ? (
                <button
                  onClick={handleSetReminder}
                  className="w-full py-1.5 bg-[#28282B] hover:bg-[#333336] text-[#A0A5B5] hover:text-[#EFFF4F] border border-[#3E3E43] rounded text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Bell className="w-3 h-3" />
                  <span>Notify Me 15m Before Test</span>
                </button>
              ) : (
                <div className="text-center text-[10px] text-emerald-400 font-mono flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Notification alert primed for 09:00 AM</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={handleCommit}
                className="w-full py-3 bg-gradient-to-r from-[#EFFF4F] via-amber-400 to-[#EFFF4F] hover:brightness-110 text-[#18181B] font-black uppercase text-xs rounded-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(239,255,79,0.35)] transition-all hover:scale-[1.01]"
              >
                <Flame className="w-4 h-4 fill-current" />
                <span>I'LL BE HERE TOMORROW — LOCK COMMITMENT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[10px] text-[#5A5F70] font-sans">
                Takes 1 second • Over 94% of learners who lock in finish the sprint
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
