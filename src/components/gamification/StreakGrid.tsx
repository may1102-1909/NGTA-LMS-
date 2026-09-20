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
                ? "bg-[#EFFF4F] shadow-[0_0_6px_rgba(239,255,79,0.8)]"
                : "bg-[#5A5F70]"
            }`}
          />
          <span className="font-bold text-white uppercase tracking-tight">
            {currentStreakDays}-DAY LEARNING STREAK {streakActive ? "ACTIVE" : "INACTIVE"}
          </span>
        </div>

        {!compact && (
          <div className="flex items-center gap-1 text-[10px] text-[#5A5F70]">
            <button
              onClick={() => setViewMode("7D")}
              className={`px-1.5 py-0.5 border ${
                viewMode === "7D"
                  ? "border-[#EFFF4F] bg-[#EFFF4F] text-[#10131A] font-bold"
                  : "border-[#252A36] bg-[#10131A] text-[#A0A5B5] hover:bg-[#252A36]"
              }`}
            >
              7D
            </button>
            <button
              onClick={() => setViewMode("30D")}
              className={`px-1.5 py-0.5 border ${
                viewMode === "30D"
                  ? "border-[#EFFF4F] bg-[#EFFF4F] text-[#10131A] font-bold"
                  : "border-[#252A36] bg-[#10131A] text-[#A0A5B5] hover:bg-[#252A36]"
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
          className={`grid gap-1.5 p-2 bg-[#10131A] border border-[#252A36] ${
            viewMode === "7D"
              ? "grid-cols-7"
              : "grid-cols-10 sm:grid-cols-15"
          }`}
        >
          {displayData.map((day, idx) => {
            let blockStyle = "bg-[#252A36] border border-[#252A36]";

            if (day.active) {
              if (day.isToday && streakActive) {
                blockStyle =
                  "bg-[#EFFF4F] border border-[#EFFF4F] shadow-[0_0_8px_rgba(239,255,79,0.7)]";
              } else {
                blockStyle = "bg-[#EFFF4F]/60 border border-[#EFFF4F]/40";
              }
            } else if (day.isToday) {
              blockStyle = "bg-[#5A5F70] border border-[#5A5F70]";
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
                  <span className="text-[9px] text-[#5A5F70] font-mono mt-1 select-none">
                    {day.dayLabel}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend / Metrics */}
        <div className="flex justify-between items-center text-[10px] text-[#5A5F70] tabular-nums">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#252A36] border border-[#252A36] inline-block" />
            <span>IDLE</span>
            <span className="w-2 h-2 bg-[#EFFF4F]/60 inline-block ml-1" />
            <span>ACTIVE</span>
            <span className="w-2 h-2 bg-[#EFFF4F] shadow-[0_0_4px_rgba(239,255,79,0.8)] inline-block ml-1" />
            <span>TODAY</span>
          </div>
          <div>
            BEST: <strong className="text-white">{longestStreakDays} DAYS</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
