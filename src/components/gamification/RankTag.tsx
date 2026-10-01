"use client";

import React from "react";
import { getRankProgress, RankTier } from "@/lib/gamification";

interface RankTagProps {
  points: number;
  showProgress?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function RankTag({
  points,
  showProgress = false,
  size = "md",
  className = "",
}: RankTagProps) {
  const { currentTier, nextTier, pointsInTier, pointsNeeded, percentage } =
    getRankProgress(points);

  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0.5",
    md: "text-xs px-2 py-0.5",
    lg: "text-sm px-2.5 py-1",
  };

  return (
    <div className={`inline-flex flex-col gap-1.5 font-mono ${className}`}>
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 font-bold uppercase tracking-wider border border-[#8B5CF6]/40 bg-[#8B5CF6]/15 text-[#C084FC] select-none rounded shadow-[0_0_10px_rgba(139,92,246,0.25)] ${sizeClasses[size]}`}
          title={`${currentTier.name}: ${currentTier.description}`}
        >
          <span className="text-[#94A3B8] font-normal">RANK:</span>
          <span className="text-[#C084FC] font-black">{currentTier.code}</span>
        </span>

        {nextTier && !showProgress && (
          <span className="text-[10px] text-[#64748B] tabular-nums hidden sm:inline-block">
            [{percentage}% TO {nextTier.code}]
          </span>
        )}
      </div>

      {showProgress && nextTier && (
        <div className="space-y-1 w-full max-w-xs">
          <div className="flex justify-between items-center text-[10px] text-[#64748B] tabular-nums">
            <span>NEXT: {nextTier.code}</span>
            <span className="font-bold text-white">
              {points}/{nextTier.minPoints} PTS [{percentage}%]
            </span>
          </div>

          <div className="w-full h-1.5 bg-[#08070D] border border-[#26213B] flex overflow-hidden rounded-full">
            <div
              className="h-full bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#06B6D4] transition-all duration-300 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.5)]"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
