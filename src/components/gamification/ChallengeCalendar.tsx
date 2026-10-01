"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  Gift,
  RotateCcw,
  X,
  ExternalLink,
  Award,
  ShieldCheck,
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
      // 1. Rapid 3D coin spin oscillations as the coin flips in the air
      [0.05, 0.18, 0.32, 0.48, 0.65, 0.82].forEach((offset, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.connect(gain);
        gain.connect(ctx.destination);
        const f = 920 + idx * 220;
        osc.frequency.setValueAtTime(f, ctx.currentTime + offset);
        osc.frequency.exponentialRampToValueAtTime(f + 320, ctx.currentTime + offset + 0.05);
        gain.gain.setValueAtTime(0.06, ctx.currentTime + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.05);
        osc.start(ctx.currentTime + offset);
        osc.stop(ctx.currentTime + offset + 0.05);
      });

      // 2. Bright, heavy gold coin landing chime (at ~1.0s)
      const landTime = ctx.currentTime + 0.95;
      [1046.5, 1318.51, 1567.98, 2093].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(freq, landTime + i * 0.035);
        gain.gain.setValueAtTime(0.1, landTime + i * 0.035);
        gain.gain.exponentialRampToValueAtTime(0.001, landTime + i * 0.035 + 0.45);
        osc.start(landTime + i * 0.035);
        osc.stop(landTime + i * 0.035 + 0.45);
      });
    }
  } catch {
    // Ignore audio failures if autoplay is blocked
  }
}

/* Grand Orchestral Fanfare for Day 30 Capstone Warrior Victory */
function playGrandVictoryFanfare(soundEnabled = true) {
  if (!soundEnabled || typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // 1. Triumphant trumpet fanfare arpeggio
    const notes = [233.08, 349.23, 466.16, 587.33, 698.46, 932.33];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i > 3 ? "triangle" : "sawtooth";
      osc.connect(gain);
      gain.connect(ctx.destination);
      const time = ctx.currentTime + i * 0.11;
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.1, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.55);
      osc.start(time);
      osc.stop(time + 0.55);
    });

    // 2. Powerful sustained victory chord at 0.65s
    const grandChord = [466.16, 587.33, 698.46, 932.33, 1174.66];
    grandChord.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.connect(gain);
      gain.connect(ctx.destination);
      const time = ctx.currentTime + 0.65;
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.12, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 1.8);
      osc.start(time);
      osc.stop(time + 1.8);
    });
  } catch {
    // Ignore audio errors
  }
}

interface ChallengeCalendarProps {
  tasks: ChallengeTask[];
  selectedDay: number;
  onSelectDay: (day: number) => void;
  onCompleteDay?: (day: number) => void;
  onResetDay?: (day: number) => void;
  animatingDay: number | null;
  todayDayNumber?: number;
  soundEnabled?: boolean;
  showDay30Victory?: boolean;
  onToggleDay30Victory?: (show: boolean) => void;
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
  onCompleteDay,
  onResetDay,
  animatingDay,
  todayDayNumber = 1,
  soundEnabled = true,
  showDay30Victory = false,
  onToggleDay30Victory,
}: ChallengeCalendarProps) {
  const [phaseFilter, setPhaseFilter] = useState<"ALL" | "P1" | "P2" | "P3" | "P4">("ALL");
  const [showWarriorMural, setShowWarriorMural] = useState(false);

  const isDay30Completed = tasks.find((t) => t.dayNumber === 30)?.isCompleted;

  // Play audio on animation trigger
  useEffect(() => {
    if (animatingDay !== null) {
      if (animatingDay === 30) {
        setShowWarriorMural(true);
        playGrandVictoryFanfare(soundEnabled);
      } else {
        playCalendarSound("complete", soundEnabled);
      }
    }
  }, [animatingDay, soundEnabled]);

  // Sync external showDay30Victory prop
  useEffect(() => {
    if (showDay30Victory) {
      setShowWarriorMural(true);
      playGrandVictoryFanfare(soundEnabled);
    }
  }, [showDay30Victory, soundEnabled]);

  const handleToggleMural = (show: boolean) => {
    setShowWarriorMural(show);
    if (onToggleDay30Victory) onToggleDay30Victory(show);
    if (show) playGrandVictoryFanfare(soundEnabled);
    else playCalendarSound("click", soundEnabled);
  };

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
    <div className="relative border border-[#1f2d4d] bg-[#14213D] rounded-xl p-5 sm:p-6 shadow-card space-y-5 font-mono text-xs overflow-hidden min-h-[520px]">
      {/* Calendar Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#1f2d4d] pb-4">
        <div>
          <div className="text-[10px] text-[#8A96A8] uppercase tracking-widest flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FCA311] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FCA311]" />
            </span>
            <span>30-DAY SDET SPRINT BATCH</span>
            <span>•</span>
            <span className="text-[#FCA311] font-bold">OCTOBER 2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5 mt-0.5">
            <CalendarIcon className="w-5 h-5 text-amber-400 shrink-0" />
            <span>CHALLENGE CALENDAR & TIMELINE</span>
          </h2>
        </div>

        {/* Phase Filter Tabs & Warrior Stage Button */}
        <div className="flex flex-wrap items-center gap-2">
          {isDay30Completed && !showWarriorMural && (
            <button
              onClick={() => handleToggleMural(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-300 text-[#18181B] font-black rounded-lg text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.5)] hover:scale-105 transition-all"
            >
              <Trophy className="w-3.5 h-3.5 fill-current" />
              <span>View Grand Trophy Ceremony</span>
            </button>
          )}

          <div className="flex flex-wrap items-center gap-1.5 bg-[#000000] p-1 rounded-lg border border-[#1f2d4d]">
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
                  ? "bg-[#FCA311] text-[#000000] shadow-lemon-sm"
                  : "text-[#E5E5E5] hover:text-white hover:bg-[#0d1527]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>

      {/* Legend & Stats Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#000000] px-3.5 py-2.5 rounded-lg border border-[#1f2d4d] text-[11px]">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            <span className="text-white font-bold">{completedCount} Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FCA311] inline-block animate-pulse" />
            <span className="text-[#FCA311] font-bold">Day {todayDayNumber} Active (Today)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8A96A8] inline-block" />
            <span className="text-[#E5E5E5]">{tasks.length - completedCount} Remaining</span>
          </div>
        </div>

        <div className="text-amber-300 font-bold text-[11px] flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Click any date or &quot;Mark Done&quot; button to complete that day&apos;s sprint</span>
        </div>
      </div>

      {/* Weekday Column Headers (Mon - Sun) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center text-[10px] text-[#E5E5E5] font-bold tracking-widest pb-1 border-b border-[#1f2d4d]/60 hidden md:grid">
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
          const isDay15 = task.dayNumber === 15;
          const isBossDay = task.dayNumber === 7 || task.dayNumber === 21 || task.dayNumber === 30;

          return (
            <div
              key={task.dayNumber}
              onClick={() => {
                if (isSelected && !task.isCompleted && onCompleteDay) {
                  onCompleteDay(task.dayNumber);
                } else {
                  onSelectDay(task.dayNumber);
                  playCalendarSound("click", soundEnabled);
                }
              }}
              onDoubleClick={() => {
                if (!task.isCompleted && onCompleteDay) {
                  onCompleteDay(task.dayNumber);
                }
              }}
              title={
                !task.isCompleted
                  ? isSelected
                    ? `Day ${task.dayNumber} selected — Click date to mark completed!`
                    : `Click to select Day ${task.dayNumber} (or click Mark Done)`
                  : `Day ${task.dayNumber} completed`
              }
              className={`relative rounded-xl p-3 cursor-pointer transition-all duration-300 select-none overflow-hidden flex flex-col justify-between items-center text-center min-h-[96px] sm:min-h-[110px] border ${
                isAnimating
                  ? "animate-coin-flip z-30 border-amber-400 bg-gradient-to-br from-[#332A15] via-[#1E2E22] to-[#14261B] ring-4 ring-amber-400/80 shadow-[0_0_45px_rgba(245,158,11,0.7)]"
                  : isSelected
                  ? "border-[#FCA311] bg-[#14213D] ring-2 ring-[#FCA311]/50 shadow-lemon-sm scale-[1.04] z-10"
                  : task.isCompleted
                  ? "border-emerald-500/40 bg-[#101b2b] hover:border-emerald-400 hover:bg-[#152338]"
                  : isToday
                  ? "border-amber-400/80 bg-gradient-to-b from-[#1c2c4d] via-[#14213D] to-[#0a1120] ring-1 ring-amber-400/50 shadow-md hover:border-amber-300"
                  : isDay15
                  ? "border-amber-400/60 bg-gradient-to-b from-[#2E281C] via-[#1c2333] to-[#0d1527] ring-1 ring-amber-400/40 shadow-sm hover:border-amber-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                  : "border-[#1f2d4d] bg-[#0d1527] hover:border-[#8A96A8] hover:bg-[#14213D] opacity-75 hover:opacity-100"
              }`}
            >
              {/* Golden Sheen Sweep across the coin surface */}
              {isAnimating && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none animate-coin-shine z-20" />
              )}

              {/* Floating Coin Token & Points Burst */}
              {isAnimating && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 animate-coin-burst whitespace-nowrap">
                  <span className="px-3 py-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-[#18181B] font-black text-xs rounded-full shadow-[0_4px_18px_rgba(245,158,11,0.8)] border-2 border-white flex items-center gap-1.5">
                    <span className="text-sm">{isDay15 ? "🎁" : "🪙"}</span>
                    <span>+{task.pointsReward} PTS!</span>
                    {isDay15 ? (
                      <Trophy className="w-3.5 h-3.5 fill-current text-[#18181B]" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 fill-current text-white" />
                    )}
                  </span>
                </div>
              )}

              {/* Top Row: Date Label (e.g. OCT 15) & Day Number badge */}
              <div className="w-full flex items-center justify-between text-[10px]">
                <span className="text-[#E5E5E5] font-mono">
                  {getDayDateLabel(task.dayNumber)}
                </span>
                {isDay15 && !task.isCompleted ? (
                  <span className="font-mono text-[8px] px-1.5 py-0.2 rounded font-black bg-gradient-to-r from-amber-400 to-yellow-300 text-[#18181B] shadow-sm flex items-center gap-0.5">
                    <Gift className="w-2.5 h-2.5" />
                    <span>GIFT</span>
                  </span>
                ) : (
                  <span
                    className={`font-mono text-[9px] px-1 py-0.2 rounded font-bold ${
                      isAnimating
                        ? "text-amber-300 bg-amber-400/20 font-black"
                        : task.isCompleted
                        ? "text-emerald-400 bg-emerald-500/10"
                        : isToday
                        ? "text-amber-400 bg-amber-500/15"
                        : "text-[#8A96A8] bg-[#000000]"
                    }`}
                  >
                    D{String(task.dayNumber).padStart(2, "0")}
                  </span>
                )}
              </div>

              {/* Center: Big Prominent Calendar Date & Status / Completion Button */}
              <div className="my-auto py-1 flex flex-col items-center justify-center gap-1 w-full">
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDay(task.dayNumber);
                    if (!task.isCompleted && onCompleteDay) {
                      onCompleteDay(task.dayNumber);
                    } else {
                      playCalendarSound("click", soundEnabled);
                    }
                  }}
                  className={`font-black text-xl sm:text-2xl tracking-tight leading-none cursor-pointer transition-transform hover:scale-110 ${
                    isAnimating
                      ? "text-yellow-300 drop-shadow-[0_0_12px_rgba(250,204,21,0.85)]"
                      : task.isCompleted
                      ? "text-emerald-300"
                      : isToday
                      ? "text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                      : isSelected
                      ? "text-[#FCA311]"
                      : "text-white hover:text-[#FCA311]"
                  }`}
                  title={
                    !task.isCompleted
                      ? `Click date number to mark Day ${task.dayNumber} completed`
                      : `Day ${task.dayNumber} completed`
                  }
                >
                  {String(task.dayNumber).padStart(2, "0")}
                </span>

                {/* Status Indicator or Interactive Completion Button */}
                <div className="flex items-center justify-center mt-0.5">
                  {isAnimating ? (
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 text-[#18181B] font-black shadow-md border-2 border-white text-xs">
                      {isDay15 ? "🎁" : "🪙"}
                    </span>
                  ) : task.isCompleted ? (
                    <div className="flex items-center gap-1">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                      {onResetDay && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onResetDay(task.dayNumber);
                          }}
                          className="opacity-60 hover:opacity-100 p-0.5 text-[#5A5F70] hover:text-amber-400 transition-opacity"
                          title={`Reset Day ${task.dayNumber} to uncompleted`}
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDay(task.dayNumber);
                        if (onCompleteDay) onCompleteDay(task.dayNumber);
                      }}
                      className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono transition-all flex items-center gap-1 border shadow-sm ${
                        isSelected
                          ? "bg-[#FCA311] text-[#000000] border-[#FCA311] shadow-lemon-sm hover:scale-105"
                          : isToday
                          ? "bg-amber-400/25 text-amber-300 border-amber-400/60 hover:bg-amber-400 hover:text-[#000000] hover:scale-105"
                          : "bg-[#000000] text-[#E5E5E5] border-[#1f2d4d] hover:border-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 hover:scale-105"
                      }`}
                      title={`Click to mark Day ${task.dayNumber} as completed`}
                    >
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                      <span>{isSelected ? "Mark Done ✔" : "Mark Done"}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom Row: Points Reward & Completed Stamp */}
              <div className="w-full pt-1.5 border-t border-[#1f2d4d]/50 flex items-center justify-between text-[10px]">
                <span
                  className={`font-mono text-[9px] ${
                    isAnimating
                      ? "text-amber-300 font-bold"
                      : isDay15
                      ? "text-amber-300 font-black flex items-center gap-0.5"
                      : task.isCompleted
                      ? "text-emerald-400 font-bold"
                      : isToday
                      ? "text-amber-400 font-bold"
                      : "text-[#E5E5E5]"
                  }`}
                >
                  +{task.pointsReward}P{isDay15 && " 🎁"}
                </span>

                {isAnimating ? (
                  <span className="animate-stamp bg-gradient-to-r from-amber-400 to-yellow-300 text-[#18181B] font-black text-[9px] px-1.5 py-0.2 rounded border border-white uppercase tracking-wider">
                    {isDay15 ? "UNLOCKED!" : "FLIPPED!"}
                  </span>
                ) : task.isCompleted ? (
                  <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-black text-[9px] px-1.5 py-0.2 rounded border uppercase tracking-wider">
                    ✔
                  </span>
                ) : isToday ? (
                  <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold text-[8px] px-1 py-0.2 rounded uppercase">
                    TODAY
                  </span>
                ) : isDay15 ? (
                  <span className="text-[8px] font-black text-amber-300 bg-amber-400/15 px-1 py-0.2 rounded border border-amber-400/30 uppercase">
                    HALFWAY
                  </span>
                ) : (
                  <span className="text-[9px] text-[#8A96A8]">DAY {task.dayNumber}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* GIANT WARRIOR TROPHY CARTOON ANIMATION STAGE (COVERS WHOLE CALENDAR) */}
      {/* ======================================================== */}
      {showWarriorMural && (
        <div className="absolute inset-0 z-40 bg-[#000000] flex flex-col justify-between p-4 sm:p-7 animate-warrior-pop border-4 border-amber-400/90 ring-8 ring-amber-400/30 rounded-xl overflow-hidden shadow-[0_0_90px_rgba(245,158,11,0.7)] select-none">
          {/* Background Vibrant Cartoon Animation Artwork */}
          <img
            src="/cartoon-warrior-trophy.jpg"
            alt="Warrior Accepting the Big Trophy Cartoon Animation"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-75 filter contrast-110 saturate-125 hover:scale-105 transition-transform duration-1000"
          />

          {/* Gradient Vignette Overlays for high contrast typography */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/45 to-[#000000]/75 pointer-events-none" />

          {/* Golden Rotating Sunburst God-Rays */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1050px] h-[1050px] opacity-25 pointer-events-none bg-[conic-gradient(from_0deg,transparent_0deg_15deg,rgba(245,158,11,0.9)_15deg_30deg,transparent_30deg_45deg,rgba(252,163,17,0.9)_45deg_60deg,transparent_60deg_75deg,rgba(245,158,11,0.9)_75deg_90deg,transparent_90deg_105deg,rgba(252,163,17,0.9)_105deg_120deg,transparent_120deg_135deg,rgba(245,158,11,0.9)_135deg_150deg,transparent_150deg_165deg,rgba(252,163,17,0.9)_165deg_180deg,transparent_180deg_195deg,rgba(245,158,11,0.9)_195deg_210deg,transparent_210deg_225deg,rgba(252,163,17,0.9)_225deg_240deg,transparent_240deg_255deg,rgba(245,158,11,0.9)_255deg_270deg,transparent_270deg_285deg,rgba(252,163,17,0.9)_285deg_300deg,transparent_300deg_315deg,rgba(245,158,11,0.9)_315deg_330deg,transparent_330deg_345deg,rgba(252,163,17,0.9)_345deg_360deg)] animate-sunburst-rotate" />

          {/* Central Radial Golden Spotlight */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-400/30 blur-[130px] rounded-full pointer-events-none animate-trophy-pulse" />

          {/* Floating Colorful Cartoon Confetti Flakes */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <span className="absolute top-4 left-1/4 text-2xl animate-bounce">🎉</span>
            <span className="absolute top-12 right-1/4 text-xl animate-pulse">⭐</span>
            <span className="absolute top-1/3 left-10 text-3xl animate-bounce">✨</span>
            <span className="absolute top-1/2 right-12 text-2xl animate-spin">🌟</span>
            <span className="absolute bottom-24 left-1/3 text-2xl animate-pulse">🎊</span>
            <span className="absolute bottom-20 right-1/3 text-3xl animate-bounce">🏆</span>
          </div>

          {/* Top Bar Controls */}
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-[#18181B] font-black text-xs uppercase tracking-wider rounded-lg shadow-md flex items-center gap-1.5 border border-white/50">
                <Trophy className="w-4 h-4 fill-current text-[#18181B]" />
                <span>30-DAY SDET GAUNTLET CONQUERED!</span>
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-mono text-xs font-bold rounded-lg flex items-center gap-1 backdrop-blur-sm">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>ALL 30 SPRINTS ACCREDITED</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => playGrandVictoryFanfare(soundEnabled)}
                className="px-3 py-1.5 bg-[#000000]/90 hover:bg-[#14213D] text-amber-300 border border-amber-400/50 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-sm hover:scale-105"
                title="Replay cartoon victory fanfare"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay Fanfare</span>
              </button>
              <button
                onClick={() => handleToggleMural(false)}
                className="px-3 py-1.5 bg-[#000000]/90 hover:bg-[#14213D] text-[#E5E5E5] hover:text-white border border-[#1f2d4d] rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-sm"
                title="Inspect 30-Day Grid"
              >
                <X className="w-3.5 h-3.5" />
                <span>View Calendar Grid</span>
              </button>
            </div>
          </div>

          {/* Hero Centerpiece: Giant Cartoon Warrior Lifting Big Trophy */}
          <div className="relative z-10 text-center my-auto py-3 space-y-3 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1 bg-gradient-to-r from-amber-400/30 via-yellow-400/20 to-amber-500/30 border border-amber-400/70 rounded-full text-amber-300 font-mono text-xs font-bold shadow-[0_0_25px_rgba(245,158,11,0.5)] animate-pulse backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>CARTOON GRAND CEREMONY: WARRIOR LIFTS THE GIANT TROPHY!</span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight drop-shadow-[0_4px_30px_rgba(0,0,0,1)] flex items-center justify-center gap-3">
              <span>WARRIOR ACCEPTS THE GRAND TROPHY</span>
              <Trophy className="w-9 h-9 sm:w-14 sm:h-14 text-amber-400 drop-shadow-[0_0_25px_rgba(245,158,11,1)] shrink-0 animate-bounce" />
            </h2>

            <p className="text-sm sm:text-base text-[#F3F4F6] max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,1)] font-sans font-medium">
              From Day 1 Java setup to Day 30 distributed Docker Grid clusters and CI/CD matrix pipelines. You conquered the entire 30-Day SDET gauntlet and earned the ultimate champion accreditation!
            </p>
          </div>

          {/* Bottom Achievement Telemetry & Certificate CTA */}
          <div className="relative z-10 pt-3 border-t border-[#1f2d4d]/80 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#000000]/85 backdrop-blur-md p-4 rounded-xl border border-amber-400/50">
            {/* 3 Milestone Badges */}
            <div className="grid grid-cols-3 gap-3 w-full md:w-auto text-center font-mono">
              <div className="p-2 bg-[#0d1527] border border-amber-400/40 rounded-lg">
                <div className="text-[10px] text-[#E5E5E5] uppercase font-bold">SUPREME RANK</div>
                <div className="text-xs sm:text-sm font-black text-amber-300">SDET LEAD</div>
              </div>
              <div className="p-2 bg-[#0d1527] border border-emerald-500/40 rounded-lg">
                <div className="text-[10px] text-[#E5E5E5] uppercase font-bold">FINAL BOUNTY</div>
                <div className="text-xs sm:text-sm font-black text-emerald-400">+100 PTS 🏆</div>
              </div>
              <div className="p-2 bg-[#0d1527] border border-orange-400/40 rounded-lg">
                <div className="text-[10px] text-[#E5E5E5] uppercase font-bold">PERFECT STREAK</div>
                <div className="text-xs sm:text-sm font-black text-orange-400">30 DAYS 🔥</div>
              </div>
            </div>

            {/* Certificate Link CTA */}
            <Link
              href="/certificates"
              className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-[#FCA311] via-amber-400 to-[#FCA311] hover:brightness-110 text-[#000000] font-black uppercase text-xs rounded-lg flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(252,163,17,0.5)] transition-all shrink-0 hover:scale-105"
            >
              <Award className="w-4 h-4" />
              <span>CLAIM VERIFIABLE CAPSTONE CERTIFICATE</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
