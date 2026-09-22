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
          className={`inline-flex items-center gap-1 font-bold uppercase tracking-wider border border-[#EFFF4F]/30 bg-[#EFFF4F]/10 text-[#EFFF4F] select-none ${sizeClasses[size]}`}
          title={`${currentTier.name}: ${currentTier.description}`}
        >
          <span className="text-[#A0A5B5] font-normal">RANK:</span>
          <span className="text-[#EFFF4F] font-black">{currentTier.code}</span>
        </span>

        {nextTier && !showProgress && (
          <span className="text-[10px] text-[#5A5F70] tabular-nums hidden sm:inline-block">
            [{percentage}% TO {nextTier.code}]
          </span>
        )}
      </div>

      {showProgress && nextTier && (
        <div className="space-y-1 w-full max-w-xs">
          <div className="flex justify-between items-center text-[10px] text-[#5A5F70] tabular-nums">
            <span>NEXT: {nextTier.code}</span>
            <span className="font-bold text-white">
              {points}/{nextTier.minPoints} PTS [{percentage}%]
            </span>
          </div>

          <div className="w-full h-1.5 bg-[#3E3E43] border border-[#3E3E43] flex overflow-hidden">
            <div
              className="h-full bg-[#EFFF4F] transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
