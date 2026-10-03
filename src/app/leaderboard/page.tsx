"use client";

import React, { useState, useEffect } from "react";
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
import { LeaderboardEntry } from "@/lib/gamification";
import { createBrowserClient } from "@supabase/ssr";

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<"ALL_TIME" | "MONTHLY" | "WEEKLY">("ALL_TIME");
  const [liveEntries, setLiveEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    username: string;
    avatar_url: string;
    xp_points: number;
    current_streak: number;
  }>({
    name: "Learner",
    username: "learner",
    avatar_url: "/avatars/avatar-1.png",
    xp_points: 0,
    current_streak: 0,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const [leadRes, authRes] = await Promise.all([
          fetch("/api/leaderboard").then((r) => (r.ok ? r.json() : null)),
          (async () => {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
            if (!supabaseUrl || !supabaseAnonKey) return null;
            const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
            const {
              data: { user },
            } = await supabase.auth.getUser();
            if (user?.id) {
              const pRes = await fetch(`/api/student-profile?userId=${user.id}`);
              if (pRes.ok) {
                const pData = await pRes.json();
                return {
                  name: user.user_metadata?.full_name || pData.profile?.username || user.email?.split("@")[0] || "Learner",
                  username: pData.profile?.username || user.email?.split("@")[0] || "learner",
                  avatar_url: pData.profile?.avatar_url || "/avatars/avatar-1.png",
                  xp_points: pData.profile?.xp_points ?? pData.xp_points ?? 0,
                  current_streak: pData.profile?.current_streak ?? pData.current_streak ?? 0,
                };
              }
            }
            return null;
          })(),
        ]);

        if (isMounted) {
          if (leadRes?.success && Array.isArray(leadRes.entries)) {
            setLiveEntries(leadRes.entries);
          }
          if (authRes) {
            setCurrentUser(authRes);
          }
        }
      } catch (err) {
        console.warn("Could not load leaderboard data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const timeframeKey: "WEEK" | "MONTH" | "ALL_TIME" =
    timeframe === "WEEKLY" ? "WEEK" : timeframe === "MONTHLY" ? "MONTH" : "ALL_TIME";

  const currentList = liveEntries;
  const rank1 = currentList[0] || null;
  const rank2 = currentList[1] || null;
  const rank3 = currentList[2] || null;

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
      {currentList.length === 0 ? (
        <div className="border border-[#3E3E43] bg-[#28282B] p-8 text-center text-[#A0A5B5] font-mono text-xs space-y-2 rounded-lg">
          <Trophy className="w-8 h-8 text-[#EFFF4F] mx-auto opacity-70" />
          <p className="text-white font-bold text-sm">No students on the podium yet</p>
          <p>Complete lessons, code challenges, or community posts to claim the #1 spot!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs items-end">
          {/* Rank 2 - Silver */}
          <div className="border border-[#3E3E43] bg-[#28282B] p-6 text-center space-y-3 relative order-2 md:order-1 rounded-lg">
            <div className="relative inline-block mx-auto">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-slate-300/60 shadow-[0_0_15px_rgba(203,213,225,0.25)] mx-auto bg-[#333336]">
                <Image
                  src={rank2?.avatarUrl || "/avatars/avatar-2.png"}
                  alt={rank2?.name || "Silver"}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-slate-800 border border-slate-300/60 text-slate-300 flex items-center justify-center shadow-md">
                <Medal className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                RANK #2 • SILVER
              </span>
              <h3 className="text-base font-bold text-white font-sans">{rank2 ? rank2.name : "Slot Open"}</h3>
              <p className="text-[11px] text-[#A0A5B5]">{rank2 ? rank2.handle : "—"}</p>
            </div>

            <div className="pt-2 border-t border-[#3E3E43] flex justify-around text-xs">
              <div>
                <span className="text-[#5A5F70] block text-[10px]">XP EARNED</span>
                <span className="font-black text-white">{rank2 ? rank2.points.toLocaleString() : 0} XP</span>
              </div>
              <div>
                <span className="text-[#5A5F70] block text-[10px]">STREAK</span>
                <span className="font-bold text-orange-400">{rank2 ? rank2.streakDays : 0} Days</span>
              </div>
            </div>
          </div>

          {/* Rank 1 - Champion (Gold) */}
          <div className="border-2 border-[#EFFF4F] bg-gradient-to-b from-[#333336] to-[#242428] p-6 text-center space-y-3 relative order-1 md:order-2 shadow-lemon-md rounded-lg scale-105">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#EFFF4F] text-[#28282B] font-bold text-[10px] uppercase shadow-sm">
              REIGNING CHAMPION
            </div>

            <div className="relative inline-block mx-auto mt-2">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#EFFF4F] shadow-lemon-md mx-auto bg-[#333336]">
                <Image
                  src={rank1?.avatarUrl || "/avatars/avatar-1.png"}
                  alt={rank1?.name || "Gold"}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#28282B] border border-[#EFFF4F] text-[#EFFF4F] flex items-center justify-center shadow-lemon-sm">
                <Crown className="w-4 h-4 fill-[#EFFF4F]/20" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-[#EFFF4F] font-bold uppercase tracking-wider block">
                RANK #1 • GOLD
              </span>
              <h3 className="text-lg font-black text-white font-sans">{rank1 ? rank1.name : "Slot Open"}</h3>
              <p className="text-[11px] text-[#EFFF4F]">{rank1 ? rank1.handle : "—"}</p>
            </div>

            <div className="pt-2 border-t border-[#3E3E43] flex justify-around text-xs">
              <div>
                <span className="text-[#5A5F70] block text-[10px]">XP EARNED</span>
                <span className="font-black text-[#EFFF4F]">{rank1 ? rank1.points.toLocaleString() : 0} XP</span>
              </div>
              <div>
                <span className="text-[#5A5F70] block text-[10px]">STREAK</span>
                <span className="font-bold text-orange-400">{rank1 ? rank1.streakDays : 0} Days</span>
              </div>
            </div>
          </div>

          {/* Rank 3 - Bronze */}
          <div className="border border-[#3E3E43] bg-[#28282B] p-6 text-center space-y-3 relative order-3 rounded-lg">
            <div className="relative inline-block mx-auto">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-amber-600/60 shadow-[0_0_15px_rgba(217,119,6,0.25)] mx-auto bg-[#333336]">
                <Image
                  src={rank3?.avatarUrl || "/avatars/avatar-3.png"}
                  alt={rank3?.name || "Bronze"}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-stone-900 border border-amber-600/60 text-amber-500 flex items-center justify-center shadow-md">
                <Medal className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider block">
                RANK #3 • BRONZE
              </span>
              <h3 className="text-base font-bold text-white font-sans">{rank3 ? rank3.name : "Slot Open"}</h3>
              <p className="text-[11px] text-[#A0A5B5]">{rank3 ? rank3.handle : "—"}</p>
            </div>

            <div className="pt-2 border-t border-[#3E3E43] flex justify-around text-xs">
              <div>
                <span className="text-[#5A5F70] block text-[10px]">XP EARNED</span>
                <span className="font-black text-white">{rank3 ? rank3.points.toLocaleString() : 0} XP</span>
              </div>
              <div>
                <span className="text-[#5A5F70] block text-[10px]">STREAK</span>
                <span className="font-bold text-orange-400">{rank3 ? rank3.streakDays : 0} Days</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Standing Bar with Live Persona */}
      <div className="border border-[#EFFF4F]/40 bg-[#333336] p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 font-mono text-xs rounded-lg shadow-lemon-sm">
        <div className="flex items-center gap-4">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#EFFF4F] shadow-sm shrink-0 bg-neutral-900">
            <Image
              src={currentUser.avatar_url}
              alt={currentUser.name}
              fill
              sizes="44px"
              className="object-cover"
            />
          </div>
          <div>
            <div className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <span>Your Standing: {currentUser.name}</span>
              <span className="text-[10px] text-[#EFFF4F] bg-[#28282B] px-1.5 py-0.5 border border-[#3E3E43]">
                {currentUser.xp_points > 0 ? "RANKED" : "UNRANKED"}
              </span>
            </div>
            <div className="text-[#A0A5B5] text-[11px]">
              Rank: {currentUser.xp_points >= 400 ? "SDET-II" : "SDET-I"} • {currentUser.xp_points} Rep Points • {currentUser.current_streak}-Day Active Streak
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
          <ReputationLog totalPoints={currentUser.xp_points} currentStreakDays={currentUser.current_streak} />
        </div>
      </div>
    </div>
  );
}
