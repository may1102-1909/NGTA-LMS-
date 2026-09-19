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
      className={`border-2 border-zinc-900 bg-white p-5 sm:p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-4 font-mono ${className}`}
    >
      {/* Top Header Label */}
      <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
        <span className="text-zinc-500 uppercase text-xs font-bold tracking-wider">
          [GAMIFICATION REPUTATION]
        </span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-[11px] text-zinc-600 hover:text-zinc-950 font-bold uppercase transition-colors"
          title="Toggle scrollable event ledger"
        >
          <History className="w-3 h-3 text-blue-600" />
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
          <div className="text-3xl sm:text-4xl font-black text-blue-600 tabular-nums tracking-tight">
            {totalPoints.toLocaleString()} PTS
          </div>
          {/* Component 2: RANK TAG rendered next to points */}
          <RankTag points={totalPoints} size="md" />
        </div>

        <div className="text-[11px] text-zinc-500 tabular-nums">
          TOTAL LOGGED: <strong>{events.length} EVENTS</strong>
        </div>
      </div>

      {/* Component 3: STREAK GRID */}
      {showStreakGrid && (
        <div className="pt-1 border-t border-zinc-200">
          <StreakGrid currentStreakDays={7} streakActive={true} />
        </div>
      )}

      {/* Component 1: REPUTATION LOG — Scrollable Event Ledger */}
      {/* Always visible preview or full ledger when expanded */}
      <div className="space-y-2 pt-2 border-t border-zinc-200">
        <div className="flex justify-between items-center text-[10px] text-zinc-500 uppercase tracking-wider">
          <span>[EVENT LEDGER // BRD §38]</span>
          <span>NEWEST AT TOP</span>
        </div>

        <div
          className={`overflow-y-auto space-y-1.5 pr-1 border border-zinc-300 bg-zinc-50 p-2.5 divide-y divide-zinc-200 transition-all ${
            isExpanded ? "max-h-64" : "max-h-36"
          }`}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#71717a #f4f4f5",
          }}
        >
          {events.map((entry) => (
            <div
              key={entry.id}
              className="pt-1.5 first:pt-0 flex items-baseline justify-between gap-2 text-[11px] leading-snug font-mono"
            >
              <div className="flex items-baseline gap-1.5 truncate">
                <span className="font-bold text-emerald-600 tabular-nums shrink-0">
                  +{entry.points}
                </span>
                <span className="text-zinc-400 select-none">·</span>
                <span className="text-zinc-900 font-semibold truncate">
                  {entry.description}
                </span>
                <span className="text-zinc-400 select-none">·</span>
                <span className="text-zinc-500 text-[10px] truncate">
                  {entry.context}
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 tabular-nums shrink-0">
                {entry.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
