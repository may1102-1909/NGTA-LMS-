"use client";

import React, { useState } from "react";
import { DayStreak, INITIAL_STREAK_DAYS, INITIAL_30_DAY_STREAK } from "@/lib/gamification";

interface StreakGridProps {
  currentStreakDays?: number;
  longestStreakDays?: number;
  streakActive?: boolean;
  sevenDayStreaks?: DayStreak[];
  thirtyDayStreaks?: DayStreak[];
  compact?: boolean;
  className?: string;
}

export default function StreakGrid({
  currentStreakDays = 7,
  longestStreakDays = 14,
  streakActive = true,
  sevenDayStreaks = INITIAL_STREAK_DAYS,
  thirtyDayStreaks = INITIAL_30_DAY_STREAK,
  compact = false,
  className = "",
}: StreakGridProps) {
  const [viewMode, setViewMode] = useState<"7D" | "30D">("7D");

  const displayData = viewMode === "7D" ? sevenDayStreaks : thirtyDayStreaks;

  return (
    <div className={`font-mono text-xs space-y-2.5 ${className}`}>
      {/* Header telemetry & status indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block w-2 h-2 ${
              streakActive
                ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]"
                : "bg-zinc-400"
            }`}
          />
          <span className="font-bold text-zinc-950 uppercase tracking-tight">
            {currentStreakDays}-DAY LEARNING STREAK {streakActive ? "ACTIVE" : "INACTIVE"}
          </span>
        </div>

        {!compact && (
          <div className="flex items-center gap-1 text-[10px] text-zinc-500">
            <button
              onClick={() => setViewMode("7D")}
              className={`px-1.5 py-0.5 border ${
                viewMode === "7D"
                  ? "border-zinc-900 bg-zinc-900 text-white font-bold"
                  : "border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              7D
            </button>
            <button
              onClick={() => setViewMode("30D")}
              className={`px-1.5 py-0.5 border ${
                viewMode === "30D"
                  ? "border-zinc-900 bg-zinc-900 text-white font-bold"
                  : "border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              30D
            </button>
          </div>
        )}
      </div>

      {/* GitHub-contribution-graph style grid */}
      <div className="space-y-1.5">
        <div
          className={`grid gap-1.5 p-2 bg-zinc-50 border border-zinc-300 ${
            viewMode === "7D"
              ? "grid-cols-7"
              : "grid-cols-10 sm:grid-cols-15"
          }`}
        >
          {displayData.map((day, idx) => {
            let blockStyle = "bg-zinc-200 border border-zinc-300";

            if (day.active) {
              if (day.isToday && streakActive) {
                // Accent color glow on the current day if streak is active
                blockStyle =
                  "bg-blue-600 border border-blue-700 shadow-[0_0_8px_rgba(0,56,255,0.7)]";
              } else {
                // Filled block = day active
                blockStyle = "bg-zinc-900 border border-zinc-950";
              }
            } else if (day.isToday) {
              // Current day broken / inactive = muted/gray
              blockStyle = "bg-zinc-300 border border-zinc-400";
            }

            return (
              <div
                key={idx}
                className="group relative flex flex-col items-center justify-center"
              >
                <div
                  className={`w-full aspect-square min-w-[14px] min-h-[14px] max-w-[28px] max-h-[28px] transition-all cursor-pointer ${blockStyle}`}
                  title={`${day.date}: ${day.active ? `${day.pointsEarned} PTS EARNED` : "NO ACTIVITY"}${
                    day.isToday ? " (TODAY)" : ""
                  }`}
                />
                {viewMode === "7D" && (
                  <span className="text-[9px] text-zinc-500 font-mono mt-1 select-none">
                    {day.dayLabel}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend / Metrics */}
        <div className="flex justify-between items-center text-[10px] text-zinc-500 tabular-nums">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-zinc-200 border border-zinc-300 inline-block" />
            <span>IDLE</span>
            <span className="w-2 h-2 bg-zinc-900 inline-block ml-1" />
            <span>ACTIVE</span>
            <span className="w-2 h-2 bg-blue-600 shadow-[0_0_4px_rgba(0,56,255,0.8)] inline-block ml-1" />
            <span>TODAY</span>
          </div>
          <div>
            BEST: <strong className="text-zinc-800">{longestStreakDays} DAYS</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
