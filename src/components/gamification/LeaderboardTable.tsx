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

      {/* Leaderboard Table */}
      <div className="border border-[#3E3E43] overflow-x-auto bg-[#28282B]">
        <table className="w-full text-left text-xs border-collapse font-mono">
          <thead>
            <tr className="bg-[#28282B] text-[#A0A5B5] text-[11px] uppercase tracking-wider border-b border-[#3E3E43]">
              <th
                onClick={() => handleSort("rank")}
                className="py-2.5 px-3 cursor-pointer select-none hover:text-[#EFFF4F] transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>RANK</span>
                  <ArrowUpDown className="w-3 h-3 text-[#5A5F70]" />
                </div>
              </th>
              <th className="py-2.5 px-3">LEARNER</th>
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
          <tbody className="divide-y divide-[#3E3E43] text-white">
            {filteredAndSortedEntries.map((learner, idx) => {
              const displayRank = idx + 1;
              const isCurrentUser = learner.isCurrentUser;

              return (
                <tr
                  key={learner.id}
                  className={`transition-colors tabular-nums ${
                    isCurrentUser
                      ? "bg-[#EFFF4F]/5 border-l-2 border-l-[#EFFF4F] font-bold"
                      : "hover:bg-[#3E3E43]/50"
                  }`}
                >
                  <td className="py-2.5 px-3 text-white font-bold">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#5A5F70]">#</span>
                      <span>{String(displayRank).padStart(2, "0")}</span>
                      {displayRank === 1 && (
                        <span className="w-1.5 h-1.5 bg-[#EFFF4F] rounded-full inline-block" />
                      )}
                    </div>
                  </td>

                  <td className="py-2.5 px-3">
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white font-bold">
                          {learner.name}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[9px] px-1 py-0.2 bg-[#EFFF4F] text-[#28282B] uppercase tracking-wider font-bold">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-[#5A5F70] font-normal">
                        <span>{learner.handle}</span>
                        <span>•</span>
                        <span className="text-[#A0A5B5] font-semibold">{learner.rankCode}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-2.5 px-3 text-right font-black text-[#EFFF4F]">
                    {learner.points.toLocaleString()}
                  </td>

                  <td className="py-2.5 px-3 text-right text-[#EFFF4F] font-bold">
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
                <td colSpan={4} className="py-6 text-center text-[#5A5F70] font-mono text-xs">
                  NO STUDENTS FOUND FOR SELECTED FILTER
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Meta */}
      <div className="flex justify-between items-center text-[10px] text-[#5A5F70] uppercase pt-1">
        <span>LIVE UPDATES</span>
        <span>COHORT STANDINGS</span>
      </div>
    </div>
  );
}
