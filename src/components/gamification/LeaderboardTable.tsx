"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { LeaderboardEntry } from "@/lib/gamification";
import { ArrowUpDown, Users, Award, Flame, CheckCircle2 } from "lucide-react";

interface LeaderboardTableProps {
  initialTab?: "WEEK" | "MONTH" | "ALL_TIME";
  className?: string;
}

export default function LeaderboardTable({
  initialTab = "ALL_TIME",
  className = "",
}: LeaderboardTableProps) {
  const [activeTab, setActiveTab] = useState<"WEEK" | "MONTH" | "ALL_TIME">(initialTab);
  const [cohortFilter, setCohortFilter] = useState<string>("ALL");
  const [sortField, setSortField] = useState<"rank" | "points" | "streakDays">("rank");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [dbEntries, setDbEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const res = await fetch("/api/leaderboard");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.entries)) {
            setDbEntries(data.entries);
          }
        }
      } catch (err) {
        console.warn("Failed to load leaderboard from database:", err);
      } finally {
        setLoading(false);
      }
    }
    loadLeaderboard();
  }, []);

  const rawEntries = dbEntries;

  const filteredAndSortedEntries = useMemo(() => {
    let list = [...rawEntries];

    if (cohortFilter !== "ALL") {
      list = list.filter((e) => e.cohort.toLowerCase().includes(cohortFilter.toLowerCase()));
    }

    list.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return list;
  }, [rawEntries, cohortFilter, sortField, sortDirection]);

  const handleSort = (field: "rank" | "points" | "streakDays") => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection(field === "rank" ? "asc" : "desc");
    }
  };

  return (
    <div
      className={`border border-[#3E3E43] bg-[#333336] p-5 sm:p-6 shadow-card space-y-4 font-mono ${className}`}
    >
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#3E3E43] pb-3">
        <div>
          <div className="text-[10px] text-[#5A5F70] uppercase tracking-widest">
            COHORT LEADERBOARD
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">
            ENGINEERING RANKINGS
          </h3>
        </div>

        {/* Cohort Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#5A5F70] uppercase">COHORT:</span>
          <select
            value={cohortFilter}
            onChange={(e) => setCohortFilter(e.target.value)}
            className="border border-[#3E3E43] bg-[#28282B] text-xs px-2.5 py-1 font-bold text-white focus:outline-none uppercase"
          >
            <option value="ALL">ALL COHORTS</option>
            <option value="Selenium">SELENIUM (COHORT 26)</option>
            <option value="Playwright">PLAYWRIGHT (COHORT 14)</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border border-[#3E3E43] bg-[#28282B] text-xs font-bold">
        <button
          onClick={() => setActiveTab("WEEK")}
          className={`flex-1 py-1.5 px-3 uppercase text-center transition-colors ${
            activeTab === "WEEK"
              ? "bg-[#EFFF4F] text-[#28282B]"
              : "text-[#A0A5B5] hover:bg-[#3E3E43]"
          }`}
        >
          THIS WEEK
        </button>
        <button
          onClick={() => setActiveTab("MONTH")}
          className={`flex-1 py-1.5 px-3 uppercase text-center border-l border-[#3E3E43] transition-colors ${
            activeTab === "MONTH"
              ? "bg-[#EFFF4F] text-[#28282B]"
              : "text-[#A0A5B5] hover:bg-[#3E3E43]"
          }`}
        >
          THIS MONTH
        </button>
        <button
          onClick={() => setActiveTab("ALL_TIME")}
          className={`flex-1 py-1.5 px-3 uppercase text-center border-l border-[#3E3E43] transition-colors ${
            activeTab === "ALL_TIME"
              ? "bg-[#EFFF4F] text-[#28282B]"
              : "text-[#A0A5B5] hover:bg-[#3E3E43]"
          }`}
        >
          ALL-TIME
        </button>
      </div>

      {/* Leaderboard Table with Avatars */}
      <div className="border border-[#3E3E43] overflow-x-auto bg-[#28282B]">
        <table className="w-full text-left text-xs border-collapse font-mono">
          <thead>
            <tr className="bg-[#28282B] text-[#A0A5B5] text-[11px] uppercase tracking-wider border-b border-[#3E3E43]">
              <th
                onClick={() => handleSort("rank")}
                className="py-2.5 px-3 cursor-pointer select-none hover:text-[#EFFF4F] transition-colors w-16"
              >
                <div className="flex items-center gap-1">
                  <span>RANK</span>
                  <ArrowUpDown className="w-3 h-3 text-[#5A5F70]" />
                </div>
              </th>
              <th className="py-2.5 px-3">LEARNER</th>
              <th className="py-2.5 px-3 hidden md:table-cell">COHORT</th>
              <th
                onClick={() => handleSort("points")}
                className="py-2.5 px-3 text-right cursor-pointer select-none hover:text-[#EFFF4F] transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>PTS</span>
                  <ArrowUpDown className="w-3 h-3 text-[#5A5F70]" />
                </div>
              </th>
              <th
                onClick={() => handleSort("streakDays")}
                className="py-2.5 px-3 text-right cursor-pointer select-none hover:text-[#EFFF4F] transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>STREAK</span>
                  <ArrowUpDown className="w-3 h-3 text-[#5A5F70]" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3E3E43]">
            {filteredAndSortedEntries.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[#5A5F70] text-xs font-mono">
                  {loading
                    ? "Loading engineering rankings..."
                    : "No students on the leaderboard yet. Start learning to claim rank #1!"}
                </td>
              </tr>
            ) : (
              filteredAndSortedEntries.map((entry) => {
                const isFirst = entry.rank === 1;
              const isSecond = entry.rank === 2;
              const isThird = entry.rank === 3;

              const rankDisplayClass = isFirst
                ? "text-[#EFFF4F] font-black"
                : isSecond
                ? "text-slate-300 font-bold"
                : isThird
                ? "text-amber-500 font-bold"
                : "text-[#A0A5B5]";

              const avatarBorderClass = isFirst
                ? "border-2 border-[#EFFF4F] shadow-[0_0_8px_rgba(239,255,79,0.3)]"
                : isSecond
                ? "border-2 border-slate-300/60"
                : isThird
                ? "border-2 border-amber-500/60"
                : "border border-[#3E3E43]";

              return (
                <tr
                  key={entry.id}
                  className={`hover:bg-[#333336] transition-colors ${
                    entry.isCurrentUser ? "bg-[#EFFF4F]/5 border-l-2 border-l-[#EFFF4F]" : ""
                  }`}
                >
                  {/* Rank */}
                  <td className="py-3 px-3">
                    <span className={`text-sm ${rankDisplayClass}`}>
                      #{String(entry.rank).padStart(2, "0")}
                    </span>
                  </td>

                  {/* Learner Info with Avatar */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`relative w-9 h-9 rounded-full overflow-hidden shrink-0 ${avatarBorderClass}`}
                      >
                        <Image
                          src={entry.avatarUrl || "/avatars-3d/learner-1.jpg"}
                          alt={entry.name}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-sans font-bold text-white text-xs flex items-center gap-2">
                          <span className="truncate">{entry.name}</span>
                          {entry.isCurrentUser && (
                            <span className="text-[9px] px-1.5 py-0.2 bg-[#EFFF4F] text-[#28282B] font-bold uppercase tracking-wider">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#A0A5B5] flex items-center gap-1.5">
                          <span>{entry.handle}</span>
                          <span>•</span>
                          <span className="text-[10px] text-[#5A5F70] font-bold uppercase">
                            {entry.rankCode}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Cohort */}
                  <td className="py-3 px-3 hidden md:table-cell text-[11px] text-[#A0A5B5]">
                    {entry.cohort}
                  </td>

                  {/* Points */}
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`font-mono font-bold ${
                        isFirst ? "text-[#EFFF4F]" : "text-white"
                      }`}
                    >
                      {entry.points.toLocaleString()} PTS
                    </span>
                  </td>

                  {/* Streak */}
                  <td className="py-3 px-3 text-right">
                    <span className="font-mono font-bold text-orange-400">
                      {entry.streakDays}d
                    </span>
                  </td>
                </tr>
              );
            }))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
