"use client";

import React, { useState, useMemo } from "react";
import { DayStreak } from "@/lib/gamification";

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
  currentStreakDays = 0,
  longestStreakDays,
  streakActive,
  sevenDayStreaks,
  thirtyDayStreaks,
  compact = false,
  className = "",
}: StreakGridProps) {
  const [viewMode, setViewMode] = useState<"7D" | "30D">("7D");

  const isActuallyActive = streakActive !== undefined ? streakActive : currentStreakDays > 0;
  const bestStreak = longestStreakDays !== undefined ? longestStreakDays : currentStreakDays;

  const dynamic7DayStreaks: DayStreak[] = useMemo(() => {
    if (sevenDayStreaks) return sevenDayStreaks;
    const days = ["M", "T", "W", "T", "F", "S", "S"];
    return days.map((dayLabel, idx) => {
      const active = currentStreakDays > 0 && idx >= Math.max(0, 7 - currentStreakDays);
      const isToday = idx === 6;
      return {
        date: `Day ${idx + 1}`,
        dayLabel,
        active,
        isToday,
        pointsEarned: active ? 50 : 0,
      };
    });
  }, [sevenDayStreaks, currentStreakDays]);

  const displayData = dynamic7DayStreaks;

  return (
    <div className={`font-mono text-xs space-y-2.5 ${className}`}>
      {/* Header telemetry & status indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block w-2 h-2 ${
              isActuallyActive
                ? "bg-[#FCA311] shadow-[0_0_6px_rgba(252,163,17,0.8)]"
                : "bg-[#8A96A8]"
            }`}
          />
          <span className="font-bold text-white uppercase tracking-tight">
            {currentStreakDays}-DAY LEARNING STREAK {isActuallyActive ? "ACTIVE" : "INACTIVE"}
          </span>
        </div>

        {!compact && (
          <div className="flex items-center gap-1 text-[10px] text-[#8A96A8]">
            <button
              onClick={() => setViewMode("7D")}
              className={`px-1.5 py-0.5 border ${
                viewMode === "7D"
                  ? "border-[#FCA311] bg-[#FCA311] text-[#000000] font-bold"
                  : "border-[#1f2d4d] bg-[#000000] text-[#E5E5E5] hover:bg-[#1f2d4d]"
              }`}
            >
              7D
            </button>
            <button
              onClick={() => setViewMode("30D")}
              className={`px-1.5 py-0.5 border ${
                viewMode === "30D"
                  ? "border-[#FCA311] bg-[#FCA311] text-[#000000] font-bold"
                  : "border-[#1f2d4d] bg-[#000000] text-[#E5E5E5] hover:bg-[#1f2d4d]"
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
          className={`grid gap-1.5 p-2 bg-[#000000] border border-[#1f2d4d] ${
            viewMode === "7D"
              ? "grid-cols-7"
              : "grid-cols-10 sm:grid-cols-15"
          }`}
        >
          {displayData.map((day, idx) => {
            let blockStyle = "bg-[#1f2d4d] border border-[#1f2d4d]";

            if (day.active) {
              if (day.isToday && streakActive) {
                blockStyle =
                  "bg-[#FCA311] border border-[#FCA311] shadow-[0_0_8px_rgba(252,163,17,0.7)]";
              } else {
                blockStyle = "bg-[#FCA311]/60 border border-[#FCA311]/40";
              }
            } else if (day.isToday) {
              blockStyle = "bg-[#8A96A8] border border-[#8A96A8]";
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
                  <span className="text-[9px] text-[#8A96A8] font-mono mt-1 select-none">
                    {day.dayLabel}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend / Metrics */}
        <div className="flex justify-between items-center text-[10px] text-[#8A96A8] tabular-nums">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#1f2d4d] border border-[#1f2d4d] inline-block" />
            <span>IDLE</span>
            <span className="w-2 h-2 bg-[#FCA311]/60 inline-block ml-1" />
            <span>ACTIVE</span>
            <span className="w-2 h-2 bg-[#FCA311] shadow-[0_0_4px_rgba(252,163,17,0.8)] inline-block ml-1" />
            <span>TODAY</span>
          </div>
          <div>
            BEST: <strong className="text-white">{bestStreak} DAYS</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
