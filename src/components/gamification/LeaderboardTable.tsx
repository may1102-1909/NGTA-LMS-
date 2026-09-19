"use client";

import React, { useState, useMemo } from "react";
import { LeaderboardEntry, INITIAL_LEADERBOARD } from "@/lib/gamification";
import { ArrowUpDown, ChevronDown, Trophy, Users } from "lucide-react";

interface LeaderboardTableProps {
  initialTab?: "WEEK" | "MONTH" | "ALL_TIME";
  className?: string;
}

export default function LeaderboardTable({
  initialTab = "WEEK",
  className = "",
}: LeaderboardTableProps) {
  const [activeTab, setActiveTab] = useState<"WEEK" | "MONTH" | "ALL_TIME">(initialTab);
  const [cohortFilter, setCohortFilter] = useState<string>("ALL");
  const [sortField, setSortField] = useState<"rank" | "points" | "streakDays">("points");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const rawEntries = INITIAL_LEADERBOARD[activeTab] || [];

  // Filter & Sort
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
      className={`border-2 border-zinc-900 bg-white p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4 font-mono ${className}`}
    >
      {/* Widget Header & Section Label */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b-2 border-zinc-900 pb-3">
        <div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest">
            [COHORT LEADERBOARD // BRD SECTION 38]
          </div>
          <h3 className="text-xl font-black text-zinc-950 uppercase tracking-tight">
            ENGINEERING RANKINGS
          </h3>
        </div>

        {/* Cohort / Course Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-500 uppercase">COHORT:</span>
          <select
            value={cohortFilter}
            onChange={(e) => setCohortFilter(e.target.value)}
            className="border border-zinc-900 bg-zinc-50 text-xs px-2.5 py-1 font-bold text-zinc-900 focus:outline-none uppercase"
          >
            <option value="ALL">ALL COHORTS</option>
            <option value="Selenium">SELENIUM (COHORT 26)</option>
            <option value="Playwright">PLAYWRIGHT (COHORT 14)</option>
          </select>
        </div>
      </div>

      {/* Swiss Tabs: This Week / This Month / All-Time */}
      <div className="flex border-2 border-zinc-900 bg-zinc-100 text-xs font-bold">
        <button
          onClick={() => setActiveTab("WEEK")}
          className={`flex-1 py-1.5 px-3 uppercase text-center transition-colors ${
            activeTab === "WEEK"
              ? "bg-zinc-950 text-white"
              : "text-zinc-700 hover:bg-zinc-200"
          }`}
        >
          THIS WEEK
        </button>
        <button
          onClick={() => setActiveTab("MONTH")}
          className={`flex-1 py-1.5 px-3 uppercase text-center border-l-2 border-zinc-900 transition-colors ${
            activeTab === "MONTH"
              ? "bg-zinc-950 text-white"
              : "text-zinc-700 hover:bg-zinc-200"
          }`}
        >
          THIS MONTH
        </button>
        <button
          onClick={() => setActiveTab("ALL_TIME")}
          className={`flex-1 py-1.5 px-3 uppercase text-center border-l-2 border-zinc-900 transition-colors ${
            activeTab === "ALL_TIME"
              ? "bg-zinc-950 text-white"
              : "text-zinc-700 hover:bg-zinc-200"
          }`}
        >
          ALL-TIME
        </button>
      </div>

      {/* Leaderboard Table Container */}
      <div className="border border-zinc-900 overflow-x-auto bg-white">
        <table className="w-full text-left text-xs border-collapse font-mono">
          <thead>
            <tr className="bg-zinc-950 text-white text-[11px] uppercase tracking-wider border-b border-zinc-900">
              <th
                onClick={() => handleSort("rank")}
                className="py-2.5 px-3 cursor-pointer select-none hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>RANK</span>
                  <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                </div>
              </th>
              <th className="py-2.5 px-3">LEARNER</th>
              <th
                onClick={() => handleSort("points")}
                className="py-2.5 px-3 text-right cursor-pointer select-none hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>PTS</span>
                  <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort("streakDays")}
                className="py-2.5 px-3 text-right cursor-pointer select-none hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>STREAK</span>
                  <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 text-zinc-900">
            {filteredAndSortedEntries.map((learner, idx) => {
              const displayRank = idx + 1;
              const isCurrentUser = learner.isCurrentUser;

              return (
                <tr
                  key={learner.id}
                  className={`transition-colors tabular-nums ${
                    isCurrentUser
                      ? "bg-blue-50/80 border-l-4 border-l-blue-600 font-bold"
                      : "hover:bg-zinc-50"
                  }`}
                >
                  {/* RANK column */}
                  <td className="py-2.5 px-3 text-zinc-950 font-bold">
                    <div className="flex items-center gap-1.5">
                      <span className="text-zinc-500">#</span>
                      <span>{String(displayRank).padStart(2, "0")}</span>
                      {displayRank === 1 && (
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full inline-block" />
                      )}
                    </div>
                  </td>

                  {/* LEARNER column */}
                  <td className="py-2.5 px-3">
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-zinc-950 font-bold">
                          {learner.name}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[9px] px-1 py-0.2 bg-zinc-950 text-white uppercase tracking-wider font-bold">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-normal">
                        <span>{learner.handle}</span>
                        <span>•</span>
                        <span className="text-zinc-700 font-semibold">{learner.rankCode}</span>
                      </div>
                    </div>
                  </td>

                  {/* PTS column */}
                  <td className="py-2.5 px-3 text-right font-black text-blue-600">
                    {learner.points.toLocaleString()}
                  </td>

                  {/* STREAK column */}
                  <td className="py-2.5 px-3 text-right text-emerald-600 font-bold">
                    <span className="inline-flex items-center gap-1">
                      <span>●</span>
                      <span>{learner.streakDays}d</span>
                    </span>
                  </td>
                </tr>
              );
            })}

            {filteredAndSortedEntries.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-zinc-500 font-mono text-xs">
                  NO TELEMETRY RECORDED FOR SELECTED FILTER
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Meta */}
      <div className="flex justify-between items-center text-[10px] text-zinc-500 uppercase pt-1">
        <span>REFRESH: REAL-TIME TELEMETRY</span>
        <span>BRD §38 LEADERBOARD PROTOCOL</span>
      </div>
    </div>
  );
}
