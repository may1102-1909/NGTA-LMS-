"use client";

import React, { useState } from "react";
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

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<"ALL_TIME" | "MONTHLY" | "WEEKLY">("ALL_TIME");

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

        {/* Timeframe Filter */}
        <div className="flex border border-[#3E3E43] bg-[#333336] font-mono text-xs font-bold">
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

      {/* Top 3 Podium Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
        {/* Rank 2 */}
        <div className="border border-[#3E3E43] bg-[#28282B] p-6 text-center space-y-3 relative order-2 md:order-1 rounded-lg">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-300/15 border border-slate-300/40 text-slate-300 font-bold mx-auto">
            <Medal className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              RANK #2 • SILVER
            </span>
            <h3 className="text-base font-bold text-white font-sans">Priya Nair</h3>
            <p className="text-[11px] text-[#A0A5B5]">@priya.qa</p>
          </div>
          <div className="pt-2 border-t border-[#3E3E43] flex justify-around text-xs">
            <div>
              <span className="text-[#5A5F70] block text-[10px]">XP EARNED</span>
              <span className="font-black text-white">3,890 XP</span>
            </div>
            <div>
              <span className="text-[#5A5F70] block text-[10px]">STREAK</span>
              <span className="font-bold text-orange-400">14 Days</span>
            </div>
          </div>
        </div>

        {/* Rank 1 - Champion */}
        <div className="border-2 border-[#EFFF4F] bg-gradient-to-b from-[#333336] to-[#242428] p-6 text-center space-y-3 relative order-1 md:order-2 shadow-lemon-md rounded-lg scale-105">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#EFFF4F] text-[#28282B] font-bold text-[10px] uppercase">
            REIGNING CHAMPION
          </div>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#EFFF4F]/20 border border-[#EFFF4F]/50 text-[#EFFF4F] font-bold mx-auto mt-2">
            <Crown className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-[#EFFF4F] font-bold uppercase tracking-wider">
              RANK #1 • GOLD
            </span>
            <h3 className="text-lg font-black text-white font-sans">Vikram Verma</h3>
            <p className="text-[11px] text-[#EFFF4F]">@vikram.lead</p>
          </div>
          <div className="pt-2 border-t border-[#3E3E43] flex justify-around text-xs">
            <div>
              <span className="text-[#5A5F70] block text-[10px]">XP EARNED</span>
              <span className="font-black text-[#EFFF4F]">4,220 XP</span>
            </div>
            <div>
              <span className="text-[#5A5F70] block text-[10px]">STREAK</span>
              <span className="font-bold text-orange-400">28 Days</span>
            </div>
          </div>
        </div>

        {/* Rank 3 */}
        <div className="border border-[#3E3E43] bg-[#28282B] p-6 text-center space-y-3 relative order-3 rounded-lg">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-600/15 border border-amber-600/40 text-amber-500 font-bold mx-auto">
            <Medal className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">
              RANK #3 • BRONZE
            </span>
            <h3 className="text-base font-bold text-white font-sans">Rohit Iyer</h3>
            <p className="text-[11px] text-[#A0A5B5]">@rohit.auto</p>
          </div>
          <div className="pt-2 border-t border-[#3E3E43] flex justify-around text-xs">
            <div>
              <span className="text-[#5A5F70] block text-[10px]">XP EARNED</span>
              <span className="font-black text-white">3,450 XP</span>
            </div>
            <div>
              <span className="text-[#5A5F70] block text-[10px]">STREAK</span>
              <span className="font-bold text-orange-400">9 Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Standing Bar */}
      <div className="border border-[#EFFF4F]/40 bg-[#333336] p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 font-mono text-xs rounded-lg shadow-lemon-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border border-[#EFFF4F] bg-[#28282B] text-[#EFFF4F] font-bold flex items-center justify-center text-sm">
            #14
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
          <LeaderboardTable />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <ReputationLog />
        </div>
      </div>
    </div>
  );
}
