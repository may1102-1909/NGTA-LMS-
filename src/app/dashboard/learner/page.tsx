"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Award,
  Flame,
  Zap,
  ArrowRight,
  Receipt,
  Sparkles,
  CheckCircle2,
  Clock,
  Compass,
  Radio,
} from "lucide-react";
import RankTag from "@/components/gamification/RankTag";
import StreakGrid from "@/components/gamification/StreakGrid";

interface EnrollmentItem {
  id: string;
  course_id: string;
  completed_modules: number;
  total_modules: number;
  status: string;
  created_at: string;
}

interface PaymentItem {
  id: string;
  course_id: string;
  amount: number;
  currency: string;
  status: string;
  transaction_id: string;
  created_at: string;
}

export default function LearnerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    currentUser: {
      id: string;
      email: string;
      full_name: string;
      username: string;
      avatar_url: string;
      xp_points: number;
      current_streak: number;
      role: string;
    };
    learner: {
      enrollments: EnrollmentItem[];
      payments: PaymentItem[];
      completedModules: number;
      totalModules: number;
    };
  } | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setStats(data);
          }
        }
      } catch (err) {
        console.error("Failed to load learner dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const user = stats?.currentUser;
  const enrollments = stats?.learner?.enrollments || [];
  const payments = stats?.learner?.payments || [];
  const currentStreak = user?.current_streak ?? 0;
  const xpPoints = user?.xp_points ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-white font-sans">
      {/* Header telemetry & student welcome */}
      <div className="border-b border-[#3E3E43] pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="font-mono text-xs text-[#5A5F70] uppercase tracking-widest mb-1 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 text-[#EFFF4F] font-bold text-[10px] rounded">
              STUDENT WORKSPACE
            </span>
            <span>•</span>
            <span className="text-[#A0A5B5]">LEARNER PORTAL</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span>Welcome back, {user?.username || "Learner"}</span>
            <Sparkles className="w-6 h-6 text-[#EFFF4F]" />
          </h1>
          <p className="text-xs sm:text-sm text-[#A0A5B5] mt-1">
            Track your course progress, daily SDET challenges, and verifiable credentials.
          </p>
        </div>

        {/* Profile Stats Pills */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#333336] border border-[#3E3E43]">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-mono text-xs font-bold text-white">
              {currentStreak} Day{currentStreak === 1 ? "" : "s"} Streak
            </span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 text-[#EFFF4F]">
            <Zap className="w-4 h-4 fill-[#EFFF4F] text-[#EFFF4F]" />
            <span className="font-mono text-xs font-bold">{xpPoints} XP</span>
          </div>
          <RankTag points={xpPoints} size="md" />
        </div>
      </div>

      {/* Main Grid: Learning Progress & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Enrolled Courses & Learning Hub */}
        <div className="lg:col-span-2 space-y-6">
          {/* Enrolled Courses Card */}
          <div className="bg-[#333336] border border-[#3E3E43] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#3E3E43] pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#EFFF4F]" />
                <h2 className="font-mono text-xs uppercase font-bold tracking-wider text-white">
                  My Enrolled Courses ({enrollments.length})
                </h2>
              </div>
              <Link
                href="/courses"
                className="text-xs font-mono text-[#EFFF4F] hover:underline flex items-center gap-1"
              >
                <span>Browse All</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs font-mono text-[#5A5F70]">
                Querying database enrollments...
              </div>
            ) : enrollments.length === 0 ? (
              <div className="py-12 text-center space-y-3 font-mono">
                <div className="w-12 h-12 rounded-full bg-[#28282B] border border-[#3E3E43] flex items-center justify-center mx-auto text-[#5A5F70]">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase">
                  No courses enrolled yet
                </h3>
                <p className="text-xs text-[#A0A5B5] max-w-sm mx-auto">
                  Enroll in our flagship Selenium Java + AI course or workshops to start learning and unlocking credentials.
                </p>
                <div className="pt-2">
                  <Link
                    href="/courses"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#EFFF4F] text-[#28282B] hover:bg-[#EFFF4F]/90 shadow-lemon-sm text-xs font-bold uppercase rounded-lg shadow-[0_0_15px_rgba(139,92,246,0.4)] hover:brightness-110 transition-all"
                  >
                    <span>Explore Course Catalog</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-[#3E3E43]">
                {enrollments.map((enr) => {
                  const progressPct =
                    enr.total_modules > 0
                      ? Math.round((enr.completed_modules / enr.total_modules) * 100)
                      : 0;

                  return (
                    <div
                      key={enr.id}
                      className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 first:pt-0"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EFFF4F]/15 text-[#EFFF4F] border border-[#EFFF4F]/30">
                            {enr.status}
                          </span>
                          <span className="text-[11px] font-mono text-[#5A5F70]">
                            Enrolled: {new Date(enr.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white uppercase">
                          {enr.course_id === "course-1"
                            ? "Selenium Java + AI: Complete Automation Testing Course"
                            : enr.course_id}
                        </h4>
                        <div className="flex items-center gap-2 text-xs font-mono text-[#A0A5B5] mt-1">
                          <span>
                            {enr.completed_modules} / {enr.total_modules} Modules Completed
                          </span>
                          <span>•</span>
                          <span className="text-[#EFFF4F] font-bold">{progressPct}%</span>
                        </div>
                      </div>

                      <Link
                        href={`/learn/${enr.course_id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#EFFF4F] text-[#28282B] hover:bg-[#EFFF4F]/90 shadow-lemon-sm text-xs font-mono font-bold uppercase rounded-lg hover:brightness-110 transition-all shadow-[0_0_10px_rgba(139,92,246,0.3)] shrink-0"
                      >
                        <span>Continue Lesson</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Payment Receipts & Order History */}
          <div className="bg-[#333336] border border-[#3E3E43] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#3E3E43] pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#06B6D4]" />
                <h2 className="font-mono text-xs uppercase font-bold tracking-wider text-white">
                  Payment Receipts & Invoices ({payments.length})
                </h2>
              </div>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs font-mono text-[#5A5F70]">
                Loading receipts...
              </div>
            ) : payments.length === 0 ? (
              <div className="py-8 text-center font-mono text-xs text-[#5A5F70]">
                No payment receipts on file yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-[#3E3E43] text-[#5A5F70] text-[10px] uppercase">
                      <th className="pb-2">Transaction ID</th>
                      <th className="pb-2">Course</th>
                      <th className="pb-2">Amount</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3E3E43]">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-[#28282B] transition-colors">
                        <td className="py-2.5 text-[#EFFF4F] truncate max-w-[140px]">
                          {p.transaction_id}
                        </td>
                        <td className="py-2.5 text-white">{p.course_id}</td>
                        <td className="py-2.5 font-bold text-white">
                          ₹{Number(p.amount).toLocaleString()}
                        </td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                            {p.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-right text-[#5A5F70]">
                          {new Date(p.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Streak Telemetry, 30-Day Challenge & Quick Links */}
        <div className="space-y-6">
          {/* Active Learning Streak Card */}
          <div className="bg-[#333336] border border-[#3E3E43] rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-mono text-xs uppercase font-bold tracking-wider text-[#5A5F70] flex items-center justify-between">
              <span>Learning Telemetry</span>
              <span className="text-[#F59E0B]">STREAK LOG</span>
            </h3>
            <StreakGrid currentStreakDays={currentStreak} streakActive={currentStreak > 0} />
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-[#333336] border border-[#3E3E43] rounded-2xl p-6 shadow-xl space-y-3 font-mono text-xs">
            <h3 className="text-xs uppercase font-bold tracking-wider text-[#5A5F70] mb-2">
              Action Hub
            </h3>

            <Link
              href="/live"
              className="flex items-center justify-between p-3 rounded-xl bg-[#28282B] border border-[#3E3E43] hover:border-[#EFFF4F]/50 transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <Radio className="w-4 h-4 text-[#EFFF4F] animate-pulse" />
                <span className="font-bold text-white">Live Classes & Recordings</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#5A5F70] group-hover:text-white group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/challenge"
              className="flex items-center justify-between p-3 rounded-xl bg-[#28282B] border border-[#3E3E43] hover:border-[#EFFF4F]/50 transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <Flame className="w-4 h-4 text-[#F59E0B]" />
                <span className="font-bold text-white">30-Day SDET Challenge</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#5A5F70] group-hover:text-white group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/community/feed"
              className="flex items-center justify-between p-3 rounded-xl bg-[#28282B] border border-[#3E3E43] hover:border-[#EFFF4F]/50 transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-[#06B6D4]" />
                <span className="font-bold text-white">Community Tribe Feed</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#5A5F70] group-hover:text-white group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/leaderboard"
              className="flex items-center justify-between p-3 rounded-xl bg-[#28282B] border border-[#3E3E43] hover:border-[#EFFF4F]/50 transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-[#EFFF4F]" />
                <span className="font-bold text-white">Engineering Leaderboard</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#5A5F70] group-hover:text-white group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
