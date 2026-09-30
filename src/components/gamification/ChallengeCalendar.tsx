"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Lock,
  Flame,
  Zap,
  Sparkles,
  Trophy,
  ChevronRight,
  Filter,
  Check,
} from "lucide-react";
import { ChallengeTask } from "@/lib/gamification";

/* Subtle Web Audio synthesizer for calendar click & completion chime */
function playCalendarSound(type: "click" | "complete", soundEnabled = true) {
  if (!soundEnabled || typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === "click") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === "complete") {
      // Celebratory bell triad arpeggio (C5 -> E5 -> G5 -> C6)
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.09, ctx.currentTime + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.4);
        osc.start(ctx.currentTime + i * 0.07);
        osc.stop(ctx.currentTime + i * 0.07 + 0.4);
      });
    }
  } catch {
    // Ignore audio failures if autoplay is blocked
  }
}

interface ChallengeCalendarProps {
  tasks: ChallengeTask[];
  selectedDay: number;
  onSelectDay: (day: number) => void;
  animatingDay: number | null;
  todayDayNumber?: number;
  soundEnabled?: boolean;
}

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

// Get calendar day date string (e.g. October 1 to October 30)
function getDayDateLabel(dayNumber: number): string {
  const day = String(dayNumber).padStart(2, "0");
  return `OCT ${day}`;
}

export default function ChallengeCalendar({
  tasks,
  selectedDay,
  onSelectDay,
  animatingDay,
  todayDayNumber = 12,
  soundEnabled = true,
}: ChallengeCalendarProps) {
  const [phaseFilter, setPhaseFilter] = useState<"ALL" | "P1" | "P2" | "P3" | "P4">("ALL");

  // Play audio on animation trigger
  useEffect(() => {
    if (animatingDay !== null) {
      playCalendarSound("complete", soundEnabled);
    }
  }, [animatingDay, soundEnabled]);

  // Filter tasks based on phase
  const filteredTasks = tasks.filter((t) => {
    if (phaseFilter === "P1") return t.dayNumber <= 7;
    if (phaseFilter === "P2") return t.dayNumber >= 8 && t.dayNumber <= 15;
    if (phaseFilter === "P3") return t.dayNumber >= 16 && t.dayNumber <= 22;
    if (phaseFilter === "P4") return t.dayNumber >= 23;
    return true;
  });

  const completedCount = tasks.filter((t) => t.isCompleted).length;

  return (
    <div className="border border-[#3E3E43] bg-[#2E2E32] rounded-xl p-5 sm:p-6 shadow-card space-y-5 font-mono text-xs">
      {/* Calendar Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#3E3E43] pb-4">
        <div>
          <div className="text-[10px] text-[#5A5F70] uppercase tracking-widest flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EFFF4F] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EFFF4F]" />
            </span>
            <span>30-DAY SDET SPRINT BATCH</span>
            <span>•</span>
            <span className="text-[#EFFF4F] font-bold">OCTOBER 2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5 mt-0.5">
            <CalendarIcon className="w-5 h-5 text-amber-400 shrink-0" />
            <span>CHALLENGE CALENDAR & TIMELINE</span>
          </h2>
        </div>

        {/* Phase Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#202023] p-1 rounded-lg border border-[#3E3E43]">
          {(
            [
              { key: "ALL", label: "All 30d" },
              { key: "P1", label: "W1: Core" },
              { key: "P2", label: "W2: TestNG" },
              { key: "P3", label: "W3: Grid" },
              { key: "P4", label: "W4-5: CI/CD" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setPhaseFilter(tab.key);
                playCalendarSound("click", soundEnabled);
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                phaseFilter === tab.key
                  ? "bg-[#EFFF4F] text-[#28282B] shadow-lemon-sm"
                  : "text-[#A0A5B5] hover:text-white hover:bg-[#28282B]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend & Stats Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#202023] px-3.5 py-2.5 rounded-lg border border-[#3E3E43] text-[11px]">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            <span className="text-white font-bold">{completedCount} Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EFFF4F] inline-block animate-pulse" />
            <span className="text-[#EFFF4F] font-bold">Day {todayDayNumber} Active (Today)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5A5F70] inline-block" />
            <span className="text-[#A0A5B5]">{tasks.length - completedCount} Remaining</span>
          </div>
        </div>

        <div className="text-[#A0A5B5] text-[10px]">
          Click any date to inspect objectives or verify completion
        </div>
      </div>

      {/* Weekday Column Headers (Mon - Sun) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center text-[10px] text-[#A0A5B5] font-bold tracking-widest pb-1 border-b border-[#3E3E43]/60 hidden md:grid">
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="py-1 uppercase">
            {wd}
          </div>
        ))}
      </div>

      {/* 30-Day Calendar Grid (Clean Date Cells without Task Titles) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2.5 sm:gap-3">
        {filteredTasks.map((task) => {
          const isSelected = selectedDay === task.dayNumber;
          const isToday = task.dayNumber === todayDayNumber;
          const isAnimating = animatingDay === task.dayNumber;
          const isBossDay = task.dayNumber % 7 === 0 || task.dayNumber === 30;

          return (
            <div
              key={task.dayNumber}
              onClick={() => {
                onSelectDay(task.dayNumber);
                playCalendarSound("click", soundEnabled);
              }}
              className={`relative rounded-xl p-3 cursor-pointer transition-all duration-200 select-none overflow-hidden flex flex-col justify-between items-center text-center min-h-[92px] sm:min-h-[105px] border ${
                isAnimating
                  ? "animate-date-complete z-20 border-emerald-400 bg-emerald-950/70"
                  : isSelected
                  ? "border-[#EFFF4F] bg-[#38383D] ring-2 ring-[#EFFF4F]/50 shadow-lemon-sm scale-[1.04] z-10"
                  : task.isCompleted
                  ? "border-emerald-500/40 bg-[#202722] hover:border-emerald-400 hover:bg-[#253028]"
                  : isToday
                  ? "border-amber-400/80 bg-gradient-to-b from-[#333338] via-[#2A2A2E] to-[#202024] ring-1 ring-amber-400/50 shadow-md hover:border-amber-300"
                  : "border-[#3E3E43] bg-[#222225] hover:border-[#5A5F70] hover:bg-[#28282B] opacity-75 hover:opacity-100"
              }`}
            >
              {/* Subtle Ambient Ripple on Animation */}
              {isAnimating && (
                <div className="absolute inset-0 bg-emerald-400/30 rounded-xl animate-ripple pointer-events-none" />
              )}

              {/* Floating Points Burst on Completion */}
              {isAnimating && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 animate-float-points whitespace-nowrap">
                  <span className="px-2.5 py-1 bg-emerald-400 text-[#18181B] font-black text-xs rounded-full shadow-lg border border-white flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    +{task.pointsReward} PTS! ✔
                  </span>
                </div>
              )}

              {/* Top Row: Date Label (e.g. OCT 12) & Day Number badge */}
              <div className="w-full flex items-center justify-between text-[10px]">
                <span className="text-[#A0A5B5] font-mono">
                  {getDayDateLabel(task.dayNumber)}
                </span>
                <span
                  className={`font-mono text-[9px] px-1 py-0.2 rounded font-bold ${
                    task.isCompleted
                      ? "text-emerald-400 bg-emerald-500/10"
                      : isToday
                      ? "text-amber-400 bg-amber-500/15"
                      : "text-[#5A5F70] bg-[#18181A]"
                  }`}
                >
                  D{String(task.dayNumber).padStart(2, "0")}
                </span>
              </div>

              {/* Center: Big Prominent Calendar Date & Status Icon */}
              <div className="my-auto py-1 flex flex-col items-center justify-center gap-1">
                <span
                  className={`font-black text-xl sm:text-2xl tracking-tight leading-none ${
                    task.isCompleted
                      ? "text-emerald-300"
                      : isToday
                      ? "text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                      : isSelected
                      ? "text-[#EFFF4F]"
                      : "text-white"
                  }`}
                >
                  {String(task.dayNumber).padStart(2, "0")}
                </span>

                {/* Status Indicator Icon */}
                <div className="flex items-center justify-center mt-0.5">
                  {task.isCompleted ? (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  ) : isToday ? (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse">
                      <Flame className="w-3 h-3 fill-current" />
                    </span>
                  ) : isBossDay ? (
                    <Trophy className="w-3.5 h-3.5 text-amber-400/70" />
                  ) : (
                    <span className="text-[#5A5F70]">
                      <Lock className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Row: Points Reward & Completed Stamp */}
              <div className="w-full pt-1.5 border-t border-[#3E3E43]/50 flex items-center justify-between text-[10px]">
                <span
                  className={`font-mono text-[9px] ${
                    task.isCompleted
                      ? "text-emerald-400 font-bold"
                      : isToday
                      ? "text-amber-400 font-bold"
                      : "text-[#A0A5B5]"
                  }`}
                >
                  +{task.pointsReward}P
                </span>

                {task.isCompleted ? (
                  <span
                    className={`font-black text-[9px] px-1.5 py-0.2 rounded border uppercase tracking-wider ${
                      isAnimating
                        ? "animate-stamp bg-emerald-400 text-[#18181B] border-emerald-400"
                        : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                    }`}
                  >
                    ✔
                  </span>
                ) : isToday ? (
                  <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold text-[8px] px-1 py-0.2 rounded uppercase">
                    TODAY
                  </span>
                ) : (
                  <span className="text-[9px] text-[#5A5F70]">DAY {task.dayNumber}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
