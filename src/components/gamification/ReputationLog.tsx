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
      className={`border border-[#26213B] bg-[#120F1D] p-5 sm:p-6 shadow-card space-y-4 font-mono rounded-xl ${className}`}
    >
      {/* Top Header Label */}
      <div className="flex justify-between items-center border-b border-[#26213B] pb-2">
        <span className="text-[#64748B] uppercase text-xs font-bold tracking-wider">
          [GAMIFICATION REPUTATION]
        </span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-[11px] text-[#94A3B8] hover:text-[#A855F7] font-bold uppercase transition-colors"
          title="Toggle scrollable event ledger"
        >
          <History className="w-3 h-3 text-[#A855F7]" />
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
          <div className="text-3xl sm:text-4xl font-black text-[#C084FC] tabular-nums tracking-tight">
            {totalPoints.toLocaleString()} PTS
          </div>
          <RankTag points={totalPoints} size="md" />
        </div>

        <div className="text-[11px] text-[#64748B] tabular-nums">
          TOTAL LOGGED: <strong className="text-white">{events.length} EVENTS</strong>
        </div>
      </div>

      {/* Component 3: STREAK GRID */}
      {showStreakGrid && (
        <div className="pt-1 border-t border-[#26213B]">
          <StreakGrid currentStreakDays={currentStreakDays} streakActive={currentStreakDays > 0} />
        </div>
      )}

      {/* Component 1: REPUTATION LOG — Scrollable Event Ledger */}
      <div className="space-y-2 pt-2 border-t border-[#26213B]">
        <div className="flex justify-between items-center text-[10px] text-[#64748B] uppercase tracking-wider">
          <span>ACTIVITY HISTORY</span>
          <span>NEWEST AT TOP</span>
        </div>

        <div
          className={`overflow-y-auto space-y-1.5 pr-1 border border-[#26213B] bg-[#0E0C17] p-2.5 divide-y divide-[#26213B] transition-all rounded-lg ${
            isExpanded ? "max-h-64" : "max-h-36"
          }`}
        >
          {events.length === 0 ? (
            <div className="py-6 text-center text-[#64748B] text-xs">
              No activity history logged yet. Complete lessons or challenges to earn points!
            </div>
          ) : (
            events.map((entry) => (
            <div
              key={entry.id}
              className="pt-1.5 first:pt-0 flex items-baseline justify-between gap-2 text-[11px] leading-snug font-mono"
            >
              <div className="flex items-baseline gap-1.5 truncate">
                <span className="font-bold text-[#A855F7] tabular-nums shrink-0">
                  +{entry.points}
                </span>
                <span className="text-[#64748B] select-none">·</span>
                <span className="text-white font-semibold truncate">
                  {entry.description}
                </span>
                <span className="text-[#64748B] select-none">·</span>
                <span className="text-[#94A3B8] text-[10px] truncate">
                  {entry.context}
                </span>
              </div>
              <span className="text-[10px] text-[#64748B] tabular-nums shrink-0">
                {entry.timestamp}
              </span>
            </div>
          )))}
        </div>
      </div>
    </div>
  );
}
