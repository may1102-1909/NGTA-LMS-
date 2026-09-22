"use client";

import React, { useState } from "react";
import { GamificationPoint, INITIAL_REPUTATION_LOG } from "@/lib/gamification";
import RankTag from "./RankTag";
import StreakGrid from "./StreakGrid";
import { ChevronDown, ChevronUp, History } from "lucide-react";

interface ReputationLogProps {
  totalPoints?: number;
  events?: GamificationPoint[];
  showStreakGrid?: boolean;
  className?: string;
}

export default function ReputationLog({
  totalPoints = 420,
  events = INITIAL_REPUTATION_LOG,
  showStreakGrid = true,
  className = "",
}: ReputationLogProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`border border-[#3E3E43] bg-[#333336] p-5 sm:p-6 shadow-card space-y-4 font-mono ${className}`}
    >
      {/* Top Header Label */}
      <div className="flex justify-between items-center border-b border-[#3E3E43] pb-2">
        <span className="text-[#5A5F70] uppercase text-xs font-bold tracking-wider">
          [GAMIFICATION REPUTATION]
        </span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-[11px] text-[#A0A5B5] hover:text-[#EFFF4F] font-bold uppercase transition-colors"
          title="Toggle scrollable event ledger"
        >
          <History className="w-3 h-3 text-[#EFFF4F]" />
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
          <div className="text-3xl sm:text-4xl font-black text-[#EFFF4F] tabular-nums tracking-tight">
            {totalPoints.toLocaleString()} PTS
          </div>
          <RankTag points={totalPoints} size="md" />
        </div>

        <div className="text-[11px] text-[#5A5F70] tabular-nums">
          TOTAL LOGGED: <strong className="text-white">{events.length} EVENTS</strong>
        </div>
      </div>

      {/* Component 3: STREAK GRID */}
      {showStreakGrid && (
        <div className="pt-1 border-t border-[#3E3E43]">
          <StreakGrid currentStreakDays={7} streakActive={true} />
        </div>
      )}

      {/* Component 1: REPUTATION LOG — Scrollable Event Ledger */}
      <div className="space-y-2 pt-2 border-t border-[#3E3E43]">
        <div className="flex justify-between items-center text-[10px] text-[#5A5F70] uppercase tracking-wider">
          <span>ACTIVITY HISTORY</span>
          <span>NEWEST AT TOP</span>
        </div>

        <div
          className={`overflow-y-auto space-y-1.5 pr-1 border border-[#3E3E43] bg-[#28282B] p-2.5 divide-y divide-[#3E3E43] transition-all ${
            isExpanded ? "max-h-64" : "max-h-36"
          }`}
        >
          {events.map((entry) => (
            <div
              key={entry.id}
              className="pt-1.5 first:pt-0 flex items-baseline justify-between gap-2 text-[11px] leading-snug font-mono"
            >
              <div className="flex items-baseline gap-1.5 truncate">
                <span className="font-bold text-[#EFFF4F] tabular-nums shrink-0">
                  +{entry.points}
                </span>
                <span className="text-[#5A5F70] select-none">·</span>
                <span className="text-white font-semibold truncate">
                  {entry.description}
                </span>
                <span className="text-[#5A5F70] select-none">·</span>
                <span className="text-[#5A5F70] text-[10px] truncate">
                  {entry.context}
                </span>
              </div>
              <span className="text-[10px] text-[#5A5F70] tabular-nums shrink-0">
                {entry.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
