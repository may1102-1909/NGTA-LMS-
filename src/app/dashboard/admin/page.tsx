"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  DollarSign,
  BookOpen,
  BarChart3,
  Layers,
  ArrowRight,
  Headphones,
  Video,
  FileCode,
  CheckCircle2,
  Database,
  UploadCloud,
  FileText,
  Search,
  Receipt,
  LifeBuoy,
  Sparkles,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

type AdminTab = "users-courses" | "content-syllabus" | "support-tickets";

interface ProfileItem {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
  created_at: string;
}

interface PaymentItem {
  id: string;
  transaction_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  profiles?: {
    email: string;
    full_name?: string;
  };
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>("users-courses");
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketActionMsg, setTicketActionMsg] = useState<string | null>(null);

  const [data, setData] = useState<{
    ops: {
      totalUsers: number;
      totalEnrollments: number;
      totalPayments: number;
      totalRevenue: number;
      totalPosts: number;
      roleCounts: Record<string, number>;
      allProfiles: ProfileItem[];
    };
    creator: {
      recentPayments: PaymentItem[];
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
  const allProfiles = ops?.allProfiles || [];

  const filteredProfiles = allProfiles.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.email.toLowerCase().includes(q) ||
      (p.full_name && p.full_name.toLowerCase().includes(q)) ||
      p.id.toLowerCase().includes(q)
    );
  });

  const handleResolveTicket = (ticketId: string) => {
    setTicketActionMsg(`Support ticket ${ticketId} resolved successfully.`);
    setTimeout(() => setTicketActionMsg(null), 4000);
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-8 text-white font-sans">
      {/* Subtle noise texture */}
      <div className="fixed inset-0 bg-noise opacity-20 pointer-events-none z-0" />

      {/* Top Banner */}
      <div className="relative z-10 border-b border-white/[0.08] pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
        <div>
          <div className="font-mono text-xs text-zinc-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-400/10 border border-amber-400/30 text-amber-400 font-bold text-[10px] rounded-full uppercase tracking-widest shadow-sm">
              OPERATIONS & GOVERNANCE HUB
            </span>
            <span>•</span>
            <span className="text-zinc-400">ADMINISTRATOR CONSOLE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight flex items-center gap-3 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            <span>Academy Administration</span>
            <ShieldCheck className="w-7 h-7 text-[#EFFF4F] shrink-0" />
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 font-sans max-w-2xl">
            Unified administrator command center. Oversee business metrics, content publishing queues, student helpdesk tickets, and user permissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/admin/approvals"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#EFFF4F] text-[#070709] hover:bg-[#EFFF4F]/90 font-mono text-xs font-bold uppercase rounded-2xl shadow-[0_0_20px_rgba(239,255,79,0.35)] active:scale-95 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Course Approvals</span>
          </Link>
          <Link
            href="/dashboard/super-admin"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0e0f14]/80 border border-white/10 hover:border-lime-400/50 text-white font-mono text-xs font-bold uppercase rounded-2xl active:scale-95 transition-all shadow-sm"
          >
            <span>Super Admin Hub</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="relative z-10 flex flex-wrap gap-2 border-b border-white/[0.08] pb-4 font-mono text-xs font-bold uppercase tracking-wider">
        <button
          type="button"
          onClick={() => setActiveTab("users-courses")}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl transition-all active:scale-95 ${
            activeTab === "users-courses"
              ? "bg-[#EFFF4F] text-[#070709] shadow-[0_0_25px_rgba(239,255,79,0.35)]"
              : "bg-[#0e0f14]/80 text-zinc-400 hover:text-white border border-white/[0.08] hover:border-white/20"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User & Course Management</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("content-syllabus")}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl transition-all active:scale-95 ${
            activeTab === "content-syllabus"
              ? "bg-[#EFFF4F] text-[#070709] shadow-[0_0_25px_rgba(239,255,79,0.35)]"
              : "bg-[#0e0f14]/80 text-zinc-400 hover:text-white border border-white/[0.08] hover:border-white/20"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Content & Syllabus Management</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("support-tickets")}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl transition-all active:scale-95 ${
            activeTab === "support-tickets"
              ? "bg-[#EFFF4F] text-[#070709] shadow-[0_0_25px_rgba(239,255,79,0.35)]"
              : "bg-[#0e0f14]/80 text-zinc-400 hover:text-white border border-white/[0.08] hover:border-white/20"
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>Support & Student Tickets</span>
        </button>
      </div>

      {/* Action Notification Toast */}
      {ticketActionMsg && (
        <div className="relative z-10 p-4 bg-emerald-500/15 border border-emerald-500/40 rounded-2xl flex items-center gap-2.5 text-emerald-400 font-mono text-xs shadow-md">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{ticketActionMsg}</span>
        </div>
      )}

      {/* TAB 1: USER & COURSE MANAGEMENT */}
      {activeTab === "users-courses" && (
        <div className="space-y-8 animate-gentle-in">
          {/* Top KPI Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="cyber-card rounded-3xl p-6 space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                <span>TOTAL USERS</span>
                <Users className="w-4 h-4 text-[#EFFF4F]" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                {loading ? "..." : (ops?.totalUsers ?? 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-zinc-400 font-sans">Active platform users</p>
            </div>

            <div className="cyber-card rounded-3xl p-6 space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                <span>ENROLLMENTS</span>
                <BookOpen className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                {loading ? "..." : (ops?.totalEnrollments ?? 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-zinc-400 font-sans">Active curriculum enrollments</p>
            </div>

            <div className="cyber-card rounded-3xl p-6 space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                <span>GROSS REVENUE</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">
                {loading ? "..." : `₹${(ops?.totalRevenue ?? 0).toLocaleString()}`}
              </div>
              <p className="text-[11px] text-zinc-400 font-sans">Verified Razorpay receipts</p>
            </div>

            <div className="cyber-card rounded-3xl p-6 space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                <span>COMMUNITY POSTS</span>
                <BarChart3 className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">
                {loading ? "..." : (ops?.totalPosts ?? 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-zinc-400 font-sans">Technical peer discussions</p>
            </div>
          </div>

          {/* Role Distribution & Financial Settlements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Role Breakdown */}
            <div className="cyber-card rounded-3xl p-7 space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <h2 className="font-mono text-xs uppercase font-bold tracking-wider text-white">
                  5-Role RBAC Distribution
                </h2>
                <span className="text-[11px] font-mono text-zinc-400">PostgreSQL Authoritative</span>
              </div>

              <div className="space-y-3.5 font-mono text-xs">
                {ops?.roleCounts &&
                  Object.entries(ops.roleCounts)
                    .filter(([role]) => ["SUPER_ADMIN", "ADMIN", "INSTRUCTOR", "LEARNER", "GUEST"].includes(role))
                    .map(([role, count]) => {
                      const total = ops.totalUsers || 1;
                      const pct = Math.round((count / total) * 100);

                      return (
                        <div key={role} className="space-y-1.5">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-white font-bold">{role}</span>
                            <span className="text-zinc-400">
                              {count} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-[#070709] border border-white/[0.06] overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-lime-400 to-cyan-400 rounded-full"
                              style={{ width: `${Math.max(pct, count > 0 ? 5 : 0)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
              </div>
            </div>

            {/* Financial Settlement Feed */}
            <div className="cyber-card rounded-3xl p-7 space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <h2 className="font-mono text-xs uppercase font-bold tracking-wider text-white">
                  Recent Transactions ({recentPayments.length})
                </h2>
                <span className="text-[11px] font-mono text-emerald-400">Live Gateway Feed</span>
              </div>

              {loading ? (
                <div className="py-12 text-center text-xs font-mono text-zinc-500">
                  Querying transactions...
                </div>
              ) : recentPayments.length === 0 ? (
                <div className="py-12 text-center text-xs font-mono text-zinc-500">
                  No transactions recorded in database yet.
                </div>
              ) : (
                <div className="overflow-x-auto max-h-72">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-white/[0.08] text-zinc-500 text-[10px] uppercase">
                        <th className="pb-2">Txn ID</th>
                        <th className="pb-2">Student</th>
                        <th className="pb-2">Amount</th>
                        <th className="pb-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                      {recentPayments.map((p) => (
                        <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-2.5 text-lime-400 truncate max-w-[120px]">
                            {p.transaction_id}
                          </td>
                          <td className="py-2.5 text-white truncate max-w-[130px]">
                            {p.profiles?.full_name || p.profiles?.email || "Student"}
                          </td>
                          <td className="py-2.5 font-bold text-white">
                            ₹{Number(p.amount).toLocaleString()}
                          </td>
                          <td className="py-2.5 text-right">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
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
      )}

      {/* TAB 2: CONTENT & SYLLABUS MANAGEMENT */}
      {activeTab === "content-syllabus" && (
        <div className="space-y-8 animate-gentle-in">
          {/* Content Ops KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="cyber-card rounded-3xl p-6 space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                <span>FLAGSHIP COURSE</span>
                <FileCode className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-xl font-bold text-white font-mono truncate">
                Selenium Java + AI
              </div>
              <p className="text-[11px] text-zinc-400 font-sans">10 Modules • 44 Sections Published</p>
            </div>

            <div className="cyber-card rounded-3xl p-6 space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                <span>ACTIVE READERS</span>
                <Database className="w-4 h-4 text-lime-400" />
              </div>
              <div className="text-3xl font-black text-white font-mono">
                {loading ? "..." : (ops?.totalEnrollments ?? 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-zinc-400 font-sans">Consuming published syllabus</p>
            </div>

            <div className="cyber-card rounded-3xl p-6 space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                <span>DISCUSSIONS</span>
                <FileText className="w-4 h-4 text-lime-400" />
              </div>
              <div className="text-3xl font-black text-lime-400 font-mono">
                {loading ? "..." : (ops?.totalPosts ?? 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-zinc-400 font-sans">Course module questions</p>
            </div>

            <div className="cyber-card rounded-3xl p-6 space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                <span>STREAM HEALTH</span>
                <Video className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-lg font-bold text-emerald-400 font-mono flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>OPERATIONAL</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans">Adaptive HLS video CDN</p>
            </div>
          </div>

          {/* Curriculum Module Sequencing Hub */}
          <div className="cyber-card rounded-3xl p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.08] pb-4 gap-3">
              <div>
                <h2 className="text-lg font-black uppercase text-white font-mono flex items-center gap-2">
                  <span>Curriculum Module Sequencing & Media Queue</span>
                  <Sparkles className="w-4 h-4 text-[#EFFF4F]" />
                </h2>
                <p className="text-xs text-zinc-400 mt-1 font-sans">
                  Manage module prerequisites, video lesson publication queues, and downloadable source code repositories.
                </p>
              </div>

              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold uppercase rounded-xl transition-all self-start sm:self-auto"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Storefront</span>
              </Link>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {[
                {
                  mod: "Module 01",
                  title: "Core Java & Automation Fundamentals",
                  lessons: "12 Lessons • 3.5 Hrs",
                  resources: "3 GitHub Repositories",
                  status: "PUBLISHED",
                },
                {
                  mod: "Module 02",
                  title: "Selenium 4 WebDriver Architecture & Locators",
                  lessons: "15 Lessons • 4.2 Hrs",
                  resources: "Grid Docker Compose Configs",
                  status: "PUBLISHED",
                },
                {
                  mod: "Module 03",
                  title: "Page Object Model (POM) & ThreadLocal Concurrency",
                  lessons: "18 Lessons • 5.0 Hrs",
                  resources: "Enterprise TestNG Skeleton",
                  status: "PUBLISHED",
                },
                {
                  mod: "Module 04",
                  title: "AI Test Automation & Self-Healing Locators",
                  lessons: "10 Lessons • 3.8 Hrs",
                  resources: "LLM Agent Prompt Suites",
                  status: "PUBLISHED",
                },
                {
                  mod: "Module 05",
                  title: "Jenkins CI/CD Pipeline Automation & Cloud Execution",
                  lessons: "14 Lessons • 4.5 Hrs",
                  resources: "Jenkinsfile Declarative Pipeline",
                  status: "PUBLISHED",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#070709]/70 border border-white/[0.06] hover:border-lime-400/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-bold">{item.mod}</span>
                      <span className="text-zinc-500">•</span>
                      <span className="text-white font-bold">{item.title}</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 flex items-center gap-3">
                      <span>{item.lessons}</span>
                      <span>•</span>
                      <span className="text-lime-400">{item.resources}</span>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SUPPORT & STUDENT TICKETS */}
      {activeTab === "support-tickets" && (
        <div className="space-y-8 animate-gentle-in">
          {/* Helpdesk Search Bar */}
          <div className="cyber-card rounded-3xl p-5 flex items-center gap-3">
            <Search className="w-5 h-5 text-zinc-500 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student by name, email, or profile ID to troubleshoot access..."
              className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none font-mono"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs font-mono text-zinc-400 hover:text-white px-2"
              >
                Clear
              </button>
            )}
          </div>

          {/* Active Support Tickets Queue */}
          <div className="cyber-card rounded-3xl p-7 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <h2 className="text-lg font-black uppercase text-white font-mono flex items-center gap-2">
                  <span>Active Learner Support Queue</span>
                  <LifeBuoy className="w-4 h-4 text-emerald-400" />
                </h2>
                <p className="text-xs text-zinc-400 mt-1 font-sans">
                  Helpdesk tickets regarding classroom unlock, Razorpay transaction verification, and certification disputes.
                </p>
              </div>
              <span className="px-3 py-1 bg-lime-400/10 border border-lime-400/30 text-lime-400 font-mono text-xs font-bold rounded-full">
                All Systems Normal
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {[
                {
                  id: "TCK-8821",
                  student: "alex.qa@example.com",
                  issue: "Course enrollment unlocked — verified payment receipt",
                  status: "RESOLVED",
                  priority: "NORMAL",
                },
                {
                  id: "TCK-8824",
                  student: "priya.dev@example.com",
                  issue: "30-Day SDET Challenge Day 14 submission verified",
                  status: "RESOLVED",
                  priority: "LOW",
                },
                {
                  id: "TCK-8830",
                  student: "vikram.sdet@example.com",
                  issue: "Digital Certificate QR code validation checked",
                  status: "OPEN",
                  priority: "HIGH",
                },
              ].map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-2xl bg-[#070709]/70 border border-white/[0.06] hover:border-lime-400/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lime-400 font-bold">{t.id}</span>
                      <span className="text-zinc-500">•</span>
                      <span className="text-white font-bold">{t.student}</span>
                    </div>
                    <div className="text-[11px] text-zinc-400">{t.issue}</div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === "RESOLVED"
                          ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                          : "bg-amber-500/15 border border-amber-500/30 text-amber-400"
                      }`}
                    >
                      {t.status}
                    </span>
                    {t.status === "OPEN" && (
                      <button
                        type="button"
                        onClick={() => handleResolveTicket(t.id)}
                        className="px-3 py-1 bg-lime-400 text-[#070709] font-bold rounded-lg text-[10px] uppercase active:scale-95 transition-all"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Profile Directory & Troubleshooting */}
          <div className="cyber-card rounded-3xl p-7 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <h2 className="font-mono text-xs uppercase font-bold tracking-wider text-white">
                  Student Directory & Troubleshooting Access ({filteredProfiles.length})
                </h2>
                <p className="text-xs text-zinc-400 font-sans mt-0.5">
                  Verify learner roles, account status, and registration timestamps.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs font-mono text-zinc-500">
                Loading user directory...
              </div>
            ) : filteredProfiles.length === 0 ? (
              <div className="py-12 text-center text-xs font-mono text-zinc-500">
                No students match your query.
              </div>
            ) : (
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-zinc-500 text-[10px] uppercase">
                      <th className="pb-3">User</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3 text-right">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {filteredProfiles.slice(0, 30).map((p) => (
                      <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 text-white font-bold">
                          {p.full_name || "Academy Member"}
                        </td>
                        <td className="py-3 text-zinc-400">{p.email}</td>
                        <td className="py-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-lime-400/10 border border-lime-400/30 text-lime-400 font-bold">
                            {p.role || "LEARNER"}
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
      )}
    </div>
  );
}
