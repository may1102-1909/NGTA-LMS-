"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Flame,
  Calendar,
  CheckCircle2,
  GitPullRequest,
  Send,
  ExternalLink,
  Code,
  Sparkles,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import ChallengeStepLog from "@/components/gamification/ChallengeStepLog";
import StreakGrid from "@/components/gamification/StreakGrid";

export default function ChallengePage() {
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionUrl.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="border-b border-[#3E3E43] pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="font-mono text-xs text-[#5A5F70] uppercase tracking-widest mb-1 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-amber-400/15 border border-amber-400/30 text-amber-400 font-bold text-[10px]">
              DAILY SDET SPRINTS
            </span>
            <span>•</span>
            <span className="text-[#A0A5B5]">DAY 12 OF 30</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span>30-DAY SELENIUM AUTOMATION CHALLENGE</span>
            <Trophy className="w-8 h-8 text-amber-400 shrink-0" />
          </h1>
          <p className="text-sm text-[#A0A5B5] mt-2 max-w-3xl">
            A high-intensity, 30-day curriculum designed by Rahul Kamat to build production-grade automation skills through daily hands-on implementation challenges.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <Link
            href="/leaderboard"
            className="px-4 py-2 border border-[#3E3E43] bg-[#333336] text-[#A0A5B5] hover:text-[#EFFF4F] hover:border-[#EFFF4F]/40 font-bold uppercase transition-colors"
          >
            View Leaderboard
          </Link>
        </div>
      </div>

      {/* Challenge Metrics Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="border border-[#3E3E43] bg-[#333336] p-4 space-y-1">
          <div className="text-[10px] text-[#5A5F70] uppercase">CURRENT STATUS</div>
          <div className="text-xl font-black text-amber-400">DAY 12 / 30</div>
          <div className="text-[10px] text-[#A0A5B5]">18 DAYS REMAINING</div>
        </div>
        <div className="border border-[#3E3E43] bg-[#333336] p-4 space-y-1">
          <div className="text-[10px] text-[#5A5F70] uppercase">SPRINT COMPLETION</div>
          <div className="text-xl font-black text-[#EFFF4F]">40% DONE</div>
          <div className="text-[10px] text-[#A0A5B5]">12 OF 30 CHALLENGES</div>
        </div>
        <div className="border border-[#3E3E43] bg-[#333336] p-4 space-y-1">
          <div className="text-[10px] text-[#5A5F70] uppercase">REPUTATION POINTS</div>
          <div className="text-xl font-black text-emerald-400">+420 PTS</div>
          <div className="text-[10px] text-[#A0A5B5]">+35 PTS ON TODAY&apos;S TASK</div>
        </div>
        <div className="border border-[#3E3E43] bg-[#333336] p-4 space-y-1">
          <div className="text-[10px] text-[#5A5F70] uppercase">ACTIVE STREAK</div>
          <div className="text-xl font-black text-orange-400 flex items-center gap-1.5">
            <Flame className="w-5 h-5 fill-orange-400" />
            <span>7 DAYS</span>
          </div>
          <div className="text-[10px] text-[#A0A5B5]">MULTIPLIER: 1.25x XP</div>
        </div>
      </div>

      {/* Today's Active Challenge Card */}
      <div className="border border-amber-400/40 bg-gradient-to-br from-[#242428] via-[#28282B] to-[#1E1E21] p-6 sm:p-8 rounded-lg shadow-card space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#3E3E43] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2 py-0.5 bg-amber-400/20 text-amber-300 font-bold uppercase text-[10px]">
                TODAY&apos;S SPRINT: DAY 12
              </span>
              <span className="text-[#A0A5B5] text-[11px]">• Estimated time: 45 min</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Integrate TestNG DataProviders with Excel Test Data sheet
            </h2>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
              REWARD: +35 PTS & 1 STREAK
            </span>
          </div>
        </div>

        {/* Task Objective and Criteria */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
          <div className="lg:col-span-2 space-y-4 font-sans text-sm">
            <div className="space-y-2">
              <h3 className="font-bold text-white uppercase font-mono text-xs tracking-wider">
                CHALLENGE OBJECTIVE:
              </h3>
              <p className="text-[#A0A5B5] leading-relaxed">
                Connect your Selenium automation suite to an external Apache POI Excel workbook. Create a dynamic TestNG <code className="text-[#EFFF4F] bg-[#202023] px-1 py-0.5">@DataProvider</code> that iterates through rows, feeds test sets into your login and checkout test methods, and logs results with ThreadLocal isolation.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-white uppercase font-mono text-xs tracking-wider">
                ACCEPTANCE CRITERIA:
              </h3>
              <ul className="space-y-1.5 text-xs text-[#A0A5B5] font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Apache POI dependency configured in pom.xml</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>ExcelReader utility class handles .xlsx file reading safely</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Data-driven test runs at least 3 test permutations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>All test cases execute in parallel using TestNG XML suite runner</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Submission Form */}
          <div className="border border-[#3E3E43] bg-[#202023] p-5 space-y-4">
            <div className="font-mono text-xs font-bold text-white uppercase flex items-center gap-2">
              <Code className="w-4 h-4 text-[#EFFF4F]" />
              <span>SUBMIT DAILY WORK</span>
            </div>

            {submitted ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-2 font-mono text-xs">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submitted Successfully!</span>
                </div>
                <p className="text-[11px] text-[#A0A5B5] font-sans">
                  Your code has been queued for automated CI linting and peer review in the #code-review channel.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-[10px] text-emerald-300 underline font-bold mt-1"
                >
                  Submit update / new commit
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="text-[10px] text-[#A0A5B5] uppercase block mb-1">
                    GitHub PR or Repository Link
                  </label>
                  <input
                    type="url"
                    value={submissionUrl}
                    onChange={(e) => setSubmissionUrl(e.target.value)}
                    placeholder="https://github.com/username/sdet-day-12..."
                    required
                    className="w-full px-3 py-2 border border-[#3E3E43] bg-[#28282B] text-white placeholder:text-[#5A5F70] focus:outline-none focus:border-[#EFFF4F]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#EFFF4F] text-[#28282B] font-bold uppercase hover:bg-[#EFFF4F]/90 transition-colors flex items-center justify-center gap-2 shadow-lemon-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit For Review (+35 PTS)</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* 30-Day Step Log & Daily Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <ChallengeStepLog />
        </div>
        <div className="lg:col-span-5 space-y-6">
          <StreakGrid />
        </div>
      </div>
    </div>
  );
}
