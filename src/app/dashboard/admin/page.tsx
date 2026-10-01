"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  DollarSign,
  BookOpen,
  TrendingUp,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    ops: {
      totalUsers: number;
      totalEnrollments: number;
      totalPayments: number;
      totalRevenue: number;
      totalPosts: number;
      roleCounts: Record<string, number>;
      allProfiles: any[];
    };
    creator: {
      recentPayments: any[];
    };
  } | null>(null);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setData(json);
          }
        }
      } catch (err) {
        console.error("Failed to load admin dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, []);

  const ops = data?.ops;
  const recentPayments = data?.creator?.recentPayments || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-white font-sans">
      {/* Top Banner */}
      <div className="border-b border-[#3E3E43] pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="font-mono text-xs text-[#5A5F70] uppercase tracking-widest mb-1 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#F59E0B]/15 border border-[#F59E0B]/40 text-[#F59E0B] font-bold text-[10px] rounded">
              OPERATIONS HUB
            </span>
            <span>•</span>
            <span className="text-[#A0A5B5]">ADMINISTRATOR CONSOLE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span>Academy Administration & Business Metrics</span>
            <ShieldCheck className="w-6 h-6 text-[#F59E0B]" />
          </h1>
          <p className="text-xs sm:text-sm text-[#A0A5B5] mt-1">
            Real-time platform operations, financial settlements, student directory, and cohort metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/admin/approvals"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#EFFF4F] text-[#28282B] hover:bg-[#EFFF4F]/90 shadow-lemon-sm font-mono text-xs font-bold uppercase rounded-xl transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Course Approvals</span>
          </Link>
          <Link
            href="/dashboard/super-admin"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#333336] border border-[#3E3E43] hover:border-[#EFFF4F]/50 text-white font-mono text-xs font-bold uppercase rounded-xl transition-all shadow-sm"
          >
            <span>Super Admin Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#333336] border border-[#3E3E43] rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-[#5A5F70] text-xs font-mono">
            <span>TOTAL USERS</span>
            <Users className="w-4 h-4 text-[#EFFF4F]" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {loading ? "..." : (ops?.totalUsers ?? 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-[#A0A5B5]">Across all 7 platform roles</p>
        </div>

        <div className="bg-[#333336] border border-[#3E3E43] rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-[#5A5F70] text-xs font-mono">
            <span>ACTIVE ENROLLMENTS</span>
            <BookOpen className="w-4 h-4 text-[#06B6D4]" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {loading ? "..." : (ops?.totalEnrollments ?? 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-[#A0A5B5]">Enrolled students in courses</p>
        </div>

        <div className="bg-[#333336] border border-[#3E3E43] rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-[#5A5F70] text-xs font-mono">
            <span>GROSS REVENUE</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">
            {loading ? "..." : `₹${(ops?.totalRevenue ?? 0).toLocaleString()}`}
          </div>
          <p className="text-[11px] text-[#A0A5B5]">Verified Razorpay receipts</p>
        </div>

        <div className="bg-[#333336] border border-[#3E3E43] rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-[#5A5F70] text-xs font-mono">
            <span>COMMUNITY POSTS</span>
            <BarChart3 className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-3xl font-black text-[#F59E0B] font-mono">
            {loading ? "..." : (ops?.totalPosts ?? 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-[#A0A5B5]">Real peer technical discussions</p>
        </div>
      </div>

      {/* Role Distribution & Financial Settlements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Breakdown */}
        <div className="bg-[#333336] border border-[#3E3E43] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#3E3E43] pb-3">
            <h2 className="font-mono text-xs uppercase font-bold tracking-wider text-white">
              7-Role RBAC Distribution
            </h2>
            <span className="text-[11px] font-mono text-[#5A5F70]">Supabase PostgreSQL</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {ops?.roleCounts &&
              Object.entries(ops.roleCounts).map(([role, count]) => {
                const total = ops.totalUsers || 1;
                const pct = Math.round((count / total) * 100);

                return (
                  <div key={role} className="space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-white font-bold">{role}</span>
                      <span className="text-[#A0A5B5]">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#28282B] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#EFFF4F] to-[#06B6D4]"
                        style={{ width: `${Math.max(pct, count > 0 ? 5 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Financial Settlement Feed */}
        <div className="bg-[#333336] border border-[#3E3E43] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#3E3E43] pb-3">
            <h2 className="font-mono text-xs uppercase font-bold tracking-wider text-white">
              Recent Transactions ({recentPayments.length})
            </h2>
            <span className="text-[11px] font-mono text-emerald-400">Live Gateway</span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs font-mono text-[#5A5F70]">
              Querying transactions...
            </div>
          ) : recentPayments.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-[#5A5F70]">
              No transactions recorded in database yet.
            </div>
          ) : (
            <div className="overflow-x-auto max-h-72">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#3E3E43] text-[#5A5F70] text-[10px] uppercase">
                    <th className="pb-2">Txn ID</th>
                    <th className="pb-2">Student</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3E3E43]">
                  {recentPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-[#28282B] transition-colors">
                      <td className="py-2.5 text-[#EFFF4F] truncate max-w-[120px]">
                        {p.transaction_id}
                      </td>
                      <td className="py-2.5 text-white truncate max-w-[130px]">
                        {p.profiles?.full_name || p.profiles?.email || "Student"}
                      </td>
                      <td className="py-2.5 font-bold text-white">
                        ₹{Number(p.amount).toLocaleString()}
                      </td>
                      <td className="py-2.5 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                          {p.status}
                        </span>
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
