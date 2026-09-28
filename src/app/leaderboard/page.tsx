"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trophy,
  Zap,
  Flame,
  Award,
  Crown,
  Medal,
  Users,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import LeaderboardTable from "@/components/gamification/LeaderboardTable";
import ReputationLog from "@/components/gamification/ReputationLog";
import RankTag from "@/components/gamification/RankTag";
import { INITIAL_LEADERBOARD } from "@/lib/gamification";

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<"ALL_TIME" | "MONTHLY" | "WEEKLY">("ALL_TIME");

  // Map timeframe state to key in gamification dataset
  const timeframeKey: "WEEK" | "MONTH" | "ALL_TIME" =
    timeframe === "WEEKLY" ? "WEEK" : timeframe === "MONTHLY" ? "MONTH" : "ALL_TIME";

  const currentList = INITIAL_LEADERBOARD[timeframeKey] || INITIAL_LEADERBOARD.ALL_TIME;
  const rank1 = currentList.find((e) => e.rank === 1) || currentList[0];
  const rank2 = currentList.find((e) => e.rank === 2) || currentList[1];
  const rank3 = currentList.find((e) => e.rank === 3) || currentList[2];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="border-b border-[#3E3E43] pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="font-mono text-xs text-[#5A5F70] uppercase tracking-widest mb-1 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 text-[#EFFF4F] font-bold text-[10px]">
              SDET RANKINGS
            </span>
            <span>•</span>
            <span className="text-[#A0A5B5]">LIVE ACADEMY LEADERBOARD</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span>GLOBAL SDET LEADERBOARD</span>
            <Zap className="w-8 h-8 text-[#EFFF4F] shrink-0" />
          </h1>
          <p className="text-sm text-[#A0A5B5] mt-2 max-w-3xl">
            Rankings are updated dynamically based on completed course modules, peer code reviews, challenge sprint submissions, and quiz passing scores.
          </p>
        </div>

        {/* Timeframe Filter matching screenshot */}
        <div className="flex border border-[#3E3E43] bg-[#333336] font-mono text-xs font-bold shrink-0">
          <button
            onClick={() => setTimeframe("ALL_TIME")}
            className={`px-4 py-2 uppercase transition-colors ${
              timeframe === "ALL_TIME"
                ? "bg-[#EFFF4F] text-[#28282B]"
                : "text-[#A0A5B5] hover:bg-[#3E3E43]"
            }`}
          >
            ALL-TIME
          </button>
          <button
            onClick={() => setTimeframe("MONTHLY")}
            className={`px-4 py-2 uppercase border-l border-[#3E3E43] transition-colors ${
              timeframe === "MONTHLY"
                ? "bg-[#EFFF4F] text-[#28282B]"
                : "text-[#A0A5B5] hover:bg-[#3E3E43]"
            }`}
          >
            MONTHLY SPRINT
          </button>
          <button
            onClick={() => setTimeframe("WEEKLY")}
            className={`px-4 py-2 uppercase border-l border-[#3E3E43] transition-colors ${
              timeframe === "WEEKLY"
                ? "bg-[#EFFF4F] text-[#28282B]"
                : "text-[#A0A5B5] hover:bg-[#3E3E43]"
            }`}
          >
            THIS WEEK
          </button>
        </div>
      </div>

      {/* Top 3 Podium Highlights with Personas & Avatars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs items-end">
        {/* Rank 2 - Silver */}
        <div className="border border-[#3E3E43] bg-[#28282B] p-6 text-center space-y-3 relative order-2 md:order-1 rounded-lg">
          {/* Persona Avatar with Silver Ring and Medal */}
          <div className="relative inline-block mx-auto">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-slate-300/60 shadow-[0_0_15px_rgba(203,213,225,0.25)] mx-auto bg-[#333336]">
              <Image
                src={rank2.avatarUrl || "/avatars-3d/learner-3.jpg"}
                alt={rank2.name}
                fill
                sizes="80px"
                className="object-cover"
                priority
              />
            </div>
            {/* Overlay Silver Medal Icon */}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-slate-800 border border-slate-300/60 text-slate-300 flex items-center justify-center shadow-md">
              <Medal className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              RANK #2 • SILVER
            </span>
            <h3 className="text-base font-bold text-white font-sans">{rank2.name}</h3>
            <p className="text-[11px] text-[#A0A5B5]">{rank2.handle}</p>
          </div>

          <div className="pt-2 border-t border-[#3E3E43] flex justify-around text-xs">
            <div>
              <span className="text-[#5A5F70] block text-[10px]">XP EARNED</span>
              <span className="font-black text-white">{rank2.points.toLocaleString()} XP</span>
            </div>
            <div>
              <span className="text-[#5A5F70] block text-[10px]">STREAK</span>
              <span className="font-bold text-orange-400">{rank2.streakDays} Days</span>
            </div>
          </div>
        </div>

        {/* Rank 1 - Champion (Gold) */}
        <div className="border-2 border-[#EFFF4F] bg-gradient-to-b from-[#333336] to-[#242428] p-6 text-center space-y-3 relative order-1 md:order-2 shadow-lemon-md rounded-lg scale-105">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#EFFF4F] text-[#28282B] font-bold text-[10px] uppercase shadow-sm">
            REIGNING CHAMPION
          </div>

          {/* Persona Avatar with Golden Neon Yellow Ring & Crown */}
          <div className="relative inline-block mx-auto mt-2">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#EFFF4F] shadow-lemon-md mx-auto bg-[#333336]">
              <Image
                src={rank1.avatarUrl || "/avatars-3d/podium-1st.jpg"}
                alt={rank1.name}
                fill
                sizes="96px"
                className="object-cover"
                priority
              />
            </div>
            {/* Overlay Crown Icon */}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#28282B] border border-[#EFFF4F] text-[#EFFF4F] flex items-center justify-center shadow-lemon-sm">
              <Crown className="w-4 h-4 fill-[#EFFF4F]/20" />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-[#EFFF4F] font-bold uppercase tracking-wider block">
              RANK #1 • GOLD
            </span>
            <h3 className="text-lg font-black text-white font-sans">{rank1.name}</h3>
            <p className="text-[11px] text-[#EFFF4F]">{rank1.handle}</p>
          </div>

          <div className="pt-2 border-t border-[#3E3E43] flex justify-around text-xs">
            <div>
              <span className="text-[#5A5F70] block text-[10px]">XP EARNED</span>
              <span className="font-black text-[#EFFF4F]">{rank1.points.toLocaleString()} XP</span>
            </div>
            <div>
              <span className="text-[#5A5F70] block text-[10px]">STREAK</span>
              <span className="font-bold text-orange-400">{rank1.streakDays} Days</span>
            </div>
          </div>
        </div>

        {/* Rank 3 - Bronze */}
        <div className="border border-[#3E3E43] bg-[#28282B] p-6 text-center space-y-3 relative order-3 rounded-lg">
          {/* Persona Avatar with Bronze Ring and Medal */}
          <div className="relative inline-block mx-auto">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-amber-600/60 shadow-[0_0_15px_rgba(217,119,6,0.25)] mx-auto bg-[#333336]">
              <Image
                src={rank3.avatarUrl || "/avatars-3d/learner-4.jpg"}
                alt={rank3.name}
                fill
                sizes="80px"
                className="object-cover"
                priority
              />
            </div>
            {/* Overlay Bronze Medal Icon */}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-stone-900 border border-amber-600/60 text-amber-500 flex items-center justify-center shadow-md">
              <Medal className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider block">
              RANK #3 • BRONZE
            </span>
            <h3 className="text-base font-bold text-white font-sans">{rank3.name}</h3>
            <p className="text-[11px] text-[#A0A5B5]">{rank3.handle}</p>
          </div>

          <div className="pt-2 border-t border-[#3E3E43] flex justify-around text-xs">
            <div>
              <span className="text-[#5A5F70] block text-[10px]">XP EARNED</span>
              <span className="font-black text-white">{rank3.points.toLocaleString()} XP</span>
            </div>
            <div>
              <span className="text-[#5A5F70] block text-[10px]">STREAK</span>
              <span className="font-bold text-orange-400">{rank3.streakDays} Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Standing Bar with Avatar */}
      <div className="border border-[#EFFF4F]/40 bg-[#333336] p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 font-mono text-xs rounded-lg shadow-lemon-sm">
        <div className="flex items-center gap-4">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#EFFF4F] shadow-sm shrink-0">
            <Image
              src="/avatars-3d/ryan-user.jpg"
              alt="Tanmay Sharma"
              fill
              sizes="44px"
              className="object-cover"
            />
          </div>
          <div>
            <div className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <span>Your Standing: Tanmay Sharma</span>
              <span className="text-[10px] text-[#EFFF4F] bg-[#28282B] px-1.5 py-0.5 border border-[#3E3E43]">
                TOP 5%
              </span>
            </div>
            <div className="text-[#A0A5B5] text-[11px]">
              Rank: SDET-II • 420 Rep Points • 7-Day Active Streak
            </div>
          </div>
        </div>

        <Link
          href="/challenge"
          className="px-4 py-2 bg-[#EFFF4F] text-[#28282B] font-bold uppercase hover:bg-[#EFFF4F]/90 transition-colors flex items-center gap-1.5 shadow-lemon-sm"
        >
          <span>Complete Daily Sprint (+35 XP)</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Leaderboard Table and Reputation History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          <LeaderboardTable initialTab={timeframeKey} />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <ReputationLog />
        </div>
      </div>
    </div>
  );
}
