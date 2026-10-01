"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  DollarSign,
  Video,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  Calendar,
  MessageSquare,
  PlusCircle,
  Clock,
  TrendingUp,
  FileCheck,
} from "lucide-react";

interface EnrollmentItem {
  id: string;
  course_id: string;
  completed_modules: number;
  total_modules: number;
  status: string;
  created_at: string;
  profile?: {
    email: string;
    full_name?: string;
  };
}

interface PaymentItem {
  id: string;
  course_id: string;
  amount: number;
  currency: string;
  status: string;
  transaction_id: string;
  created_at: string;
  profiles?: {
    email: string;
    full_name?: string;
  };
}

export default function InstructorDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [creatorData, setCreatorData] = useState<{
    currentUser: {
      full_name: string;
      email: string;
      role: string;
    };
    creator: {
      totalStudents: number;
      totalRevenue: number;
      activeBatches: number;
      recentEnrollments: EnrollmentItem[];
      recentPayments: PaymentItem[];
    };
  } | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setCreatorData(data);
          }
        }
      } catch (err) {
        console.error("Failed to load creator dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const totalStudents = creatorData?.creator?.totalStudents ?? 0;
  const totalRevenue = creatorData?.creator?.totalRevenue ?? 0;
  const recentEnrollments = creatorData?.creator?.recentEnrollments || [];
  const recentPayments = creatorData?.creator?.recentPayments || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-white font-sans">
      {/* Top Banner (TagMango Creator Studio Style) */}
      <div className="border-b border-[#26213B] pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="font-mono text-xs text-[#64748B] uppercase tracking-widest mb-1 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#A855F7]/15 border border-[#A855F7]/40 text-[#C084FC] font-bold text-[10px] rounded">
              CREATOR STUDIO
            </span>
            <span>•</span>
            <span className="text-[#94A3B8]">INSTRUCTOR CONSOLE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span>Instructor Studio • TagMango Suite</span>
            <Sparkles className="w-6 h-6 text-[#A855F7]" />
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Manage your courses, broadcast live masterclasses, inspect enrolled cohorts, and review student progress.
          </p>
        </div>

        {/* Creator Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/mentorship"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#120F1D] border border-[#26213B] hover:border-[#8B5CF6]/50 text-white font-mono text-xs font-bold uppercase rounded-xl transition-all shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span>1-on-1 Slots</span>
          </Link>
          <Link
            href="/community/feed"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white font-mono text-xs font-bold uppercase rounded-xl hover:brightness-110 transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Broadcast Update</span>
          </Link>
        </div>
      </div>

      {/* Creator KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#120F1D] border border-[#26213B] rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-mono">
            <span>ACTIVE STUDENTS</span>
            <Users className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {loading ? "..." : totalStudents.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#94A3B8]">Across all active course cohorts</p>
        </div>

        <div className="bg-[#120F1D] border border-[#26213B] rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-mono">
            <span>COURSE REVENUE</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">
            {loading ? "..." : `₹${totalRevenue.toLocaleString()}`}
          </div>
          <p className="text-[11px] text-[#94A3B8]">Verified gross Razorpay receipts</p>
        </div>

        <div className="bg-[#120F1D] border border-[#26213B] rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-mono">
            <span>FLAGSHIP CURRICULUM</span>
            <BookOpen className="w-4 h-4 text-[#06B6D4]" />
          </div>
          <div className="text-lg font-black text-white font-mono truncate">
            Selenium Java + AI
          </div>
          <p className="text-[11px] text-[#94A3B8]">10 Core Modules • 25.5 Hours</p>
        </div>

        <div className="bg-[#120F1D] border border-[#26213B] rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-mono">
            <span>LIVE TRAINING</span>
            <Video className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-lg font-black text-[#F59E0B] font-mono">
            Weekend Masterclasses
          </div>
          <p className="text-[11px] text-[#94A3B8]">Interactive live Zoom/Labs</p>
        </div>
      </div>

      {/* Main Tables: Recent Student Enrollments & Financial Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Enrollment Roster */}
        <div className="bg-[#120F1D] border border-[#26213B] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#26213B] pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#8B5CF6]" />
              <h2 className="font-mono text-xs uppercase font-bold tracking-wider text-white">
                Live Student Enrollment Roster ({recentEnrollments.length})
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs font-mono text-[#64748B]">
              Querying live student roster...
            </div>
          ) : recentEnrollments.length === 0 ? (
            <div className="py-12 text-center font-mono space-y-2 text-[#64748B]">
              <Users className="w-8 h-8 mx-auto text-[#26213B]" />
              <p className="text-xs">No students enrolled yet.</p>
              <p className="text-[11px] text-[#94A3B8]">
                Student enrollments will appear here automatically upon course registration.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#26213B] text-[#64748B] text-[10px] uppercase">
                    <th className="pb-2">Learner</th>
                    <th className="pb-2">Course</th>
                    <th className="pb-2">Progress</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#26213B]">
                  {recentEnrollments.map((enr) => (
                    <tr key={enr.id} className="hover:bg-[#161326] transition-colors">
                      <td className="py-3 text-white truncate max-w-[140px]">
                        {enr.profile?.full_name || enr.profile?.email || "Student"}
                      </td>
                      <td className="py-3 text-[#C084FC]">
                        {enr.course_id === "course-1" ? "Selenium + AI" : enr.course_id}
                      </td>
                      <td className="py-3 text-[#94A3B8]">
                        {enr.completed_modules}/{enr.total_modules} Mod
                      </td>
                      <td className="py-3 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#C084FC] font-bold">
                          {enr.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Real Payments / Revenue Ledger */}
        <div className="bg-[#120F1D] border border-[#26213B] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#26213B] pb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <h2 className="font-mono text-xs uppercase font-bold tracking-wider text-white">
                Recent Course Earnings ({recentPayments.length})
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs font-mono text-[#64748B]">
              Querying payment transactions...
            </div>
          ) : recentPayments.length === 0 ? (
            <div className="py-12 text-center font-mono space-y-2 text-[#64748B]">
              <DollarSign className="w-8 h-8 mx-auto text-[#26213B]" />
              <p className="text-xs">No transactions recorded yet.</p>
              <p className="text-[11px] text-[#94A3B8]">
                Razorpay earnings will populate automatically upon checkout.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#26213B] text-[#64748B] text-[10px] uppercase">
                    <th className="pb-2">Student</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Txn ID</th>
                    <th className="pb-2 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#26213B]">
                  {recentPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-[#161326] transition-colors">
                      <td className="py-3 text-white truncate max-w-[140px]">
                        {p.profiles?.full_name || p.profiles?.email || "Student"}
                      </td>
                      <td className="py-3 font-bold text-emerald-400">
                        ₹{Number(p.amount).toLocaleString()}
                      </td>
                      <td className="py-3 text-[#64748B] truncate max-w-[120px]">
                        {p.transaction_id}
                      </td>
                      <td className="py-3 text-right text-[#94A3B8]">
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
