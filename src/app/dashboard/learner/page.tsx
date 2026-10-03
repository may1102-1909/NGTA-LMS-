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
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10 text-white font-sans">
      {/* Subtle noise texture */}
      <div className="fixed inset-0 bg-noise opacity-20 pointer-events-none z-0" />

      {/* Header telemetry & student welcome */}
      <div className="relative z-10 border-b border-white/[0.08] pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
        <div>
          <div className="font-mono text-xs text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="px-3 py-1 bg-lime-400/10 border border-lime-400/30 text-lime-400 font-bold text-[10px] rounded-full uppercase tracking-widest shadow-sm">
              STUDENT WORKSPACE
            </span>
            <span>•</span>
            <span className="text-zinc-400">LEARNER PORTAL</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight flex items-center gap-3 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            <span>Welcome back, {user?.username || "Learner"}</span>
            <Sparkles className="w-6 h-6 text-[#EFFF4F] shrink-0" />
          </h1>

        </div>

        {/* Profile Stats Pills */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0e0f14]/90 border border-white/10 backdrop-blur-md shadow-sm">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-mono text-xs font-bold text-white">
              {currentStreak} Day{currentStreak === 1 ? "" : "s"} Streak
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-lime-400/10 border border-lime-400/30 text-lime-400 shadow-sm">
            <Zap className="w-4 h-4 fill-lime-400 text-lime-400" />
            <span className="font-mono text-xs font-bold">{xpPoints} XP</span>
          </div>
          <RankTag points={xpPoints} size="md" />
        </div>
      </div>

      {/* Main Content: Enrolled Courses & Receipts */}
      <div className="relative z-10 space-y-8">
        {/* Enrolled Courses Card */}
        <div className="cyber-card rounded-3xl p-7 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-lime-400/10 border border-lime-400/20 flex items-center justify-center text-lime-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <h2 className="font-mono text-xs uppercase font-bold tracking-wider text-white">
                My Enrolled Courses ({enrollments.length})
              </h2>
            </div>
            <Link
              href="/courses"
              className="text-xs font-mono text-[#EFFF4F] hover:underline flex items-center gap-1 group"
            >
              <span>Browse All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs font-mono text-zinc-500">
              Synchronizing course progress...
            </div>
          ) : enrollments.length === 0 ? (
            <div className="py-12 text-center space-y-3 font-mono">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto text-zinc-500 shadow-inner">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                No courses enrolled yet
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto font-sans">
                Enroll in our flagship Selenium Java + AI course or workshops to start learning and unlocking verifiable credentials.
              </p>
              <div className="pt-2">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#EFFF4F] text-[#070709] hover:bg-[#EFFF4F]/90 text-xs font-mono font-bold uppercase rounded-2xl shadow-[0_0_20px_rgba(239,255,79,0.35)] active:scale-95 transition-all"
                >
                  <span>Explore Course Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {enrollments.map((enr) => {
                const progressPct =
                  enr.total_modules > 0
                    ? Math.round((enr.completed_modules / enr.total_modules) * 100)
                    : 0;

                return (
                  <div
                    key={enr.id}
                    className="p-5 rounded-2xl bg-[#070709]/70 border border-white/[0.06] hover:border-lime-400/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-lime-400/15 text-lime-400 border border-lime-400/30">
                          {enr.status}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-500">
                          Enrolled: {new Date(enr.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-tight">
                        {enr.course_id === "course-1"
                          ? "Selenium Java + AI: Complete Automation Testing Course"
                          : enr.course_id}
                      </h4>
                      <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mt-1.5">
                        <span>
                          {enr.completed_modules} / {enr.total_modules} Modules Completed
                        </span>
                        <span>•</span>
                        <span className="text-lime-400 font-bold">{progressPct}%</span>
                      </div>
                    </div>

                    <Link
                      href={`/learn/${enr.course_id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#EFFF4F] text-[#070709] hover:bg-[#EFFF4F]/90 text-xs font-mono font-bold uppercase rounded-xl active:scale-95 transition-all shadow-[0_0_15px_rgba(239,255,79,0.3)] shrink-0"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Payment Receipts & Order History */}
        <div className="cyber-card rounded-3xl p-7 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
                <Receipt className="w-4 h-4" />
              </div>
              <h2 className="font-mono text-xs uppercase font-bold tracking-wider text-white">
                Payment Receipts & Invoices ({payments.length})
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs font-mono text-zinc-500">
              Loading receipts...
            </div>
          ) : payments.length === 0 ? (
            <div className="py-8 text-center font-mono text-xs text-zinc-500">
              No payment receipts on file yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08] text-zinc-500 text-[10px] uppercase">
                    <th className="pb-3">Transaction ID</th>
                    <th className="pb-3">Course</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 text-lime-400 truncate max-w-[140px]">
                        {p.transaction_id}
                      </td>
                      <td className="py-3 text-white">{p.course_id}</td>
                      <td className="py-3 font-bold text-white">
                        ₹{Number(p.amount).toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 text-right text-zinc-500">
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
    </div>
  );
}
