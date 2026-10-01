"use client";

import React, { useState } from "react";
import { GamificationPoint, INITIAL_REPUTATION_LOG } from "@/lib/gamification";
import RankTag from "./RankTag";
import StreakGrid from "./StreakGrid";
import { ChevronDown, ChevronUp, History } from "lucide-react";

interface ReputationLogProps {
  totalPoints?: number;
  currentStreakDays?: number;
  events?: GamificationPoint[];
  showStreakGrid?: boolean;
  className?: string;
}

export default function ReputationLog({
  totalPoints = 0,
  currentStreakDays = 0,
  events = [],
  showStreakGrid = true,
  className = "",
}: ReputationLogProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`border border-[#1f2d4d] bg-[#14213D] p-5 sm:p-6 shadow-card space-y-4 font-mono ${className}`}
    >
      {/* Top Header Label */}
      <div className="flex justify-between items-center border-b border-[#1f2d4d] pb-2">
        <span className="text-[#8A96A8] uppercase text-xs font-bold tracking-wider">
          [GAMIFICATION REPUTATION]
        </span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-[11px] text-[#E5E5E5] hover:text-[#FCA311] font-bold uppercase transition-colors"
          title="Toggle scrollable event ledger"
        >
          <History className="w-3 h-3 text-[#FCA311]" />
          <span>{isExpanded ? "COLLAPSE LEDGER" : "VIEW LEDGER"}</span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Points & Rank Tag Row */}
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <div className="text-3xl sm:text-4xl font-black text-[#FCA311] tabular-nums tracking-tight">
            {totalPoints.toLocaleString()} PTS
          </div>
          <RankTag points={totalPoints} size="md" />
        </div>

        <div className="text-[11px] text-[#8A96A8] tabular-nums">
          TOTAL LOGGED: <strong className="text-white">{events.length} EVENTS</strong>
        </div>
      </div>

      {/* Component 3: STREAK GRID */}
      {showStreakGrid && (
        <div className="pt-1 border-t border-[#1f2d4d]">
          <StreakGrid currentStreakDays={currentStreakDays} streakActive={currentStreakDays > 0} />
        </div>
      )}

      {/* Component 1: REPUTATION LOG — Scrollable Event Ledger */}
      <div className="space-y-2 pt-2 border-t border-[#1f2d4d]">
        <div className="flex justify-between items-center text-[10px] text-[#8A96A8] uppercase tracking-wider">
          <span>ACTIVITY HISTORY</span>
          <span>NEWEST AT TOP</span>
        </div>

        <div
          className={`overflow-y-auto space-y-1.5 pr-1 border border-[#1f2d4d] bg-[#000000] p-2.5 divide-y divide-[#1f2d4d] transition-all ${
            isExpanded ? "max-h-64" : "max-h-36"
          }`}
        >
          {events.length === 0 ? (
            <div className="py-6 text-center text-[#8A96A8] text-xs">
              No activity history logged yet. Complete lessons or challenges to earn points!
            </div>
          ) : (
            events.map((entry) => (
            <div
              key={entry.id}
              className="pt-1.5 first:pt-0 flex items-baseline justify-between gap-2 text-[11px] leading-snug font-mono"
            >
              <div className="flex items-baseline gap-1.5 truncate">
                <span className="font-bold text-[#FCA311] tabular-nums shrink-0">
                  +{entry.points}
                </span>
                <span className="text-[#8A96A8] select-none">·</span>
                <span className="text-white font-semibold truncate">
                  {entry.description}
                </span>
                <span className="text-[#8A96A8] select-none">·</span>
                <span className="text-[#8A96A8] text-[10px] truncate">
                  {entry.context}
                </span>
              </div>
              <span className="text-[10px] text-[#8A96A8] tabular-nums shrink-0">
                {entry.timestamp}
              </span>
            </div>
          )))}
        </div>
      </div>
    </div>
  );
}
