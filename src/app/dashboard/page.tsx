"use client";

import React, { useState } from "react";
import Link from "next/link";
import { INITIAL_COURSES, INITIAL_LIVE_SESSIONS } from "@/lib/mockData";
import {
  BookOpen,
  Award,
  Users,
  BarChart3,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Clock,
  PlayCircle,
  PlusCircle,
  FileCheck,
  AlertCircle,
  Settings,
  ChevronDown,
  ChevronUp,
  User,
} from "lucide-react";
import ReputationLog from "@/components/gamification/ReputationLog";
import RankTag from "@/components/gamification/RankTag";
import StreakGrid from "@/components/gamification/StreakGrid";
import CredentialCard from "@/components/gamification/CredentialCard";
import LeaderboardTable from "@/components/gamification/LeaderboardTable";
import ChallengeStepLog from "@/components/gamification/ChallengeStepLog";
import { INITIAL_CREDENTIALS, CredentialItem } from "@/lib/gamification";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"LEARNER" | "INSTRUCTOR" | "ADMIN">("LEARNER");
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [credentialsFilter, setCredentialsFilter] = useState<"ALL" | "CERTIFICATE" | "BADGE">("ALL");

  const filteredCredentials = INITIAL_CREDENTIALS.filter((c) => {
    if (credentialsFilter === "ALL") return true;
    return c.type === credentialsFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner & Role View Switcher */}
      <div className="border-b-2 border-zinc-900 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-1">
            [WORKSPACE TELEMETRY // BRD SECTION 3 & 27]
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 uppercase tracking-tight">
            MANAGEMENT CONSOLE
          </h1>
        </div>

        {/* Console View Switcher (Swiss Tabs) */}
        <div className="flex border-2 border-zinc-900 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-mono text-xs font-bold">
          <button
            onClick={() => setActiveTab("LEARNER")}
            className={`px-4 py-2 uppercase transition-colors ${
              activeTab === "LEARNER"
                ? "bg-zinc-950 text-white"
                : "text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            LEARNER PORTAL
          </button>
          <button
            onClick={() => setActiveTab("INSTRUCTOR")}
            className={`px-4 py-2 uppercase border-l-2 border-zinc-900 transition-colors ${
              activeTab === "INSTRUCTOR"
                ? "bg-zinc-950 text-white"
                : "text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            INSTRUCTOR STUDIO
          </button>
          <button
            onClick={() => setActiveTab("ADMIN")}
            className={`px-4 py-2 uppercase border-l-2 border-zinc-900 transition-colors ${
              activeTab === "ADMIN"
                ? "bg-zinc-950 text-white"
                : "text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            ADMIN / RBAC
          </button>
        </div>
      </div>

      {/* VIEW 1: LEARNER PORTAL */}
      {activeTab === "LEARNER" && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* Progress Cards Grid with Gamification Layer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            {/* Card 1: ENROLLED TRACKS */}
            <div className="border-2 border-zinc-900 bg-white p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-zinc-500 uppercase">
                  <span>[ENROLLED TRACKS]</span>
                  <span className="text-[10px]">BRD §3</span>
                </div>
                <div className="text-3xl font-black text-zinc-950 tabular-nums">02 ACTIVE</div>
                <div className="text-[11px] text-zinc-500">1 In-Progress • 1 Completed</div>
              </div>

              {/* Learner Profile Drawer Toggle */}
              <div className="pt-4 border-t border-zinc-200">
                <button
                  onClick={() => setShowProfileDrawer(!showProfileDrawer)}
                  className="w-full py-2 bg-zinc-100 hover:bg-zinc-200 border border-zinc-900 text-zinc-900 font-bold uppercase text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-zinc-700" />
                  <span>{showProfileDrawer ? "HIDE PROFILE TELEMETRY" : "VIEW PROFILE TELEMETRY"}</span>
                </button>
              </div>
            </div>

            {/* Card 2: GAMIFICATION REPUTATION (Components 1, 2, 3) */}
            <div className="border-2 border-zinc-900 bg-white p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-3">
              <div className="flex justify-between items-center text-zinc-500 uppercase">
                <span className="font-bold">[GAMIFICATION REPUTATION]</span>
                <span className="text-[10px] text-zinc-400">BRD §38</span>
              </div>

              <div className="flex flex-wrap items-baseline gap-2.5">
                <div className="text-3xl font-black text-blue-600 tabular-nums">420 PTS</div>
                {/* Component 2: RANK TAG */}
                <RankTag points={420} size="sm" />
              </div>

              {/* Component 3: STREAK GRID */}
              <StreakGrid currentStreakDays={7} compact={true} />

              {/* Scrollable Event Ledger Trigger */}
              <div className="pt-2 border-t border-zinc-200">
                <ReputationLog totalPoints={420} showStreakGrid={false} />
              </div>
            </div>

            {/* Card 3: VERIFIABLE CREDENTIALS (Component 4) */}
            <div className="border-2 border-zinc-900 bg-white p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-zinc-500 uppercase">
                  <span>[VERIFIABLE CREDENTIALS]</span>
                  <span className="text-[10px]">ISO 9001</span>
                </div>

                <div>
                  <div className="text-3xl font-black text-emerald-600 tabular-nums">01 ISSUED</div>
                  <div className="text-[11px] text-zinc-600 font-medium">
                    + 03 Verified Skill Badges
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] text-zinc-600">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 border border-zinc-900 bg-emerald-500 inline-block" />
                    <span>Solid Border: 1 Accredited Certificate</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 border border-dashed border-zinc-900 bg-zinc-200 inline-block" />
                    <span>Dashed Border: 3 Skill Badges</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-200 space-y-2">
                <button
                  onClick={() => setShowCredentialsModal(true)}
                  className="w-full py-2 bg-zinc-950 text-white hover:bg-blue-600 transition-colors uppercase font-bold text-[11px] flex items-center justify-center gap-1 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>INSPECT ALL CREDENTIALS ({INITIAL_CREDENTIALS.length})</span>
                </button>
                <Link
                  href="/verify"
                  className="text-[11px] text-blue-600 hover:underline block text-center"
                >
                  Verify in Public Registry →
                </Link>
              </div>
            </div>
          </div>

          {/* Expandable Learner Profile Telemetry Container (BRD §38 / Profile Spec-Sheet) */}
          {showProfileDrawer && (
            <div className="border-2 border-zinc-900 bg-zinc-50 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-6 animate-in fade-in duration-200 font-mono text-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b-2 border-zinc-900 pb-3">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest">
                    [LEARNER TELEMETRY // PROFILE // BRD §38]
                  </div>
                  <h3 className="text-xl font-black text-zinc-950 uppercase tracking-tight">
                    ENGINEER PROFILE & AUDIT DOSSIER
                  </h3>
                </div>
                <button
                  onClick={() => setShowProfileDrawer(false)}
                  className="text-xs text-zinc-500 hover:text-zinc-900 underline uppercase"
                >
                  COLLAPSE DOSSIER [x]
                </button>
              </div>

              {/* Profile Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="border border-zinc-300 bg-white p-3 space-y-1">
                  <div className="text-[10px] text-zinc-500 uppercase">CANDIDATE</div>
                  <div className="font-bold text-zinc-950 text-sm">Tanmay Sharma</div>
                  <div className="text-zinc-500 text-[10px]">@tanmay.sdet</div>
                </div>
                <div className="border border-zinc-300 bg-white p-3 space-y-1">
                  <div className="text-[10px] text-zinc-500 uppercase">SYSTEM ROLE</div>
                  <div className="font-bold text-amber-600 text-sm">LEARNER (PRO)</div>
                  <div className="text-zinc-500 text-[10px]">RBAC: LEAST-PRIVILEGE</div>
                </div>
                <div className="border border-zinc-300 bg-white p-3 space-y-1">
                  <div className="text-[10px] text-zinc-500 uppercase">SDET RANK</div>
                  <div className="font-bold text-blue-600 text-sm">RANK: SDET-II</div>
                  <div className="text-zinc-500 text-[10px]">420 / 750 PTS TO LEAD</div>
                </div>
                <div className="border border-zinc-300 bg-white p-3 space-y-1">
                  <div className="text-[10px] text-zinc-500 uppercase">LEARNING CADENCE</div>
                  <div className="font-bold text-emerald-600 text-sm">7-DAY STREAK</div>
                  <div className="text-zinc-500 text-[10px]">LONGEST: 14 DAYS</div>
                </div>
              </div>

              {/* Component 4: CREDENTIAL CARDS COLLECTION (Solid for certs, dashed for badges) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
                  <span className="font-bold text-zinc-950 uppercase">
                    ISSUED CREDENTIALS & SKILL BADGES ({INITIAL_CREDENTIALS.length})
                  </span>
                  <div className="flex gap-2 text-[10px]">
                    <span className="text-emerald-700 font-bold">1 SOLID (CERTIFICATE)</span>
                    <span>•</span>
                    <span className="text-zinc-600 font-bold">3 DASHED (BADGES)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {INITIAL_CREDENTIALS.map((cred) => (
                    <CredentialCard key={cred.id} credential={cred} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active Courses In Progress */}
          <div className="border-2 border-zinc-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-200 pb-4">
              <h3 className="text-xl font-black uppercase text-zinc-950">MY ACTIVE COURSES</h3>
              <Link href="/courses" className="font-mono text-xs text-blue-600 hover:underline font-bold">
                BROWSE MORE TRACKS
              </Link>
            </div>

            <div className="space-y-4">
              {INITIAL_COURSES.map((course, idx) => {
                const progress = idx === 0 ? 75 : 10;
                return (
                  <div
                    key={course.id}
                    className="border-2 border-zinc-900 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-50"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="font-mono text-[10px] text-zinc-500 uppercase">
                        {course.category} • {course.difficultyLevel}
                      </div>
                      <h4 className="text-lg font-bold text-zinc-950">{course.title}</h4>
                      <div className="font-mono text-xs text-zinc-600">
                        Instructor: {course.instructorName}
                      </div>
                    </div>

                    <div className="w-full md:w-64 space-y-2">
                      <div className="flex justify-between font-mono text-xs">
                        <span className="text-zinc-500">PROGRESS:</span>
                        <span className="font-bold text-zinc-950">{progress}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-zinc-200 border border-zinc-900 overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="pt-2 flex justify-end">
                        <Link
                          href={`/learn/${course.id}`}
                          className="px-4 py-2 bg-zinc-950 text-white font-mono text-xs uppercase font-bold hover:bg-blue-600 transition-colors flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>CONTINUE LEARNING</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gamification Dashboard Row: Component 5 (LEADERBOARD) & Component 6 (CHALLENGE STEP-LOG) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Component 5: LEADERBOARD TABLE WIDGET (7 Columns on large) */}
            <div className="lg:col-span-7">
              <LeaderboardTable />
            </div>

            {/* Component 6: CHALLENGE STEP-LOG (5 Columns on large) */}
            <div className="lg:col-span-5">
              <ChallengeStepLog />
            </div>
          </div>

          {/* Credential Cards Modal / Modal Overlay */}
          {showCredentialsModal && (
            <div className="fixed inset-0 z-50 bg-zinc-950/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-4xl bg-white border-2 border-zinc-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in duration-150 font-mono">
                <div className="flex justify-between items-start border-b-2 border-zinc-900 pb-4">
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest">
                      [CREDENTIAL & BADGE REGISTRY // BRD §12 & §38]
                    </div>
                    <h3 className="text-2xl font-black text-zinc-950 uppercase">
                      VERIFIABLE CREDENTIALS & SKILL BADGES
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowCredentialsModal(false)}
                    className="px-2.5 py-1 border border-zinc-900 bg-zinc-100 hover:bg-zinc-200 text-xs font-bold uppercase"
                  >
                    CLOSE [ESC]
                  </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center justify-between gap-4 border-b border-zinc-200 pb-3">
                  <div className="flex border border-zinc-900 text-xs font-bold">
                    <button
                      onClick={() => setCredentialsFilter("ALL")}
                      className={`px-3 py-1 uppercase ${
                        credentialsFilter === "ALL"
                          ? "bg-zinc-950 text-white"
                          : "text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      ALL ({INITIAL_CREDENTIALS.length})
                    </button>
                    <button
                      onClick={() => setCredentialsFilter("CERTIFICATE")}
                      className={`px-3 py-1 uppercase border-l border-zinc-900 ${
                        credentialsFilter === "CERTIFICATE"
                          ? "bg-zinc-950 text-white"
                          : "text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      SOLID: CERTIFICATES (1)
                    </button>
                    <button
                      onClick={() => setCredentialsFilter("BADGE")}
                      className={`px-3 py-1 uppercase border-l border-zinc-900 ${
                        credentialsFilter === "BADGE"
                          ? "bg-zinc-950 text-white"
                          : "text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      DASHED: SKILL BADGES (3)
                    </button>
                  </div>

                  <div className="text-[11px] text-zinc-500 hidden sm:block">
                    DASHED = BADGE · SOLID = VERIFIED CERTIFICATE
                  </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCredentials.map((cred) => (
                    <CredentialCard key={cred.id} credential={cred} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: INSTRUCTOR STUDIO (BRD Section 3.3) */}
      {activeTab === "INSTRUCTOR" && (
        <div className="space-y-8 animate-in fade-in duration-150">
          <div className="border-2 border-zinc-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-200 pb-4">
              <div>
                <h3 className="text-xl font-black uppercase text-zinc-950">CURRICULUM AUTHORING STUDIO</h3>
                <p className="text-xs text-zinc-600 font-mono">Create modules, chapters, video assets, quizzes and review learner submissions.</p>
              </div>
              <button className="px-4 py-2 bg-zinc-950 text-white font-mono text-xs uppercase font-bold hover:bg-blue-600 transition-colors flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                <span>CREATE NEW COURSE</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              <div className="border border-zinc-300 p-4 space-y-3 bg-zinc-50">
                <div className="font-bold text-zinc-900 uppercase">[COURSE AUDIT] Selenium Automation</div>
                <div className="space-y-1 text-zinc-600">
                  <div>Status: <span className="font-bold text-emerald-600">PUBLISHED</span></div>
                  <div>Active Learners: <strong>1,820</strong></div>
                  <div>Average Quiz Passing Rate: <strong>88.4%</strong></div>
                  <div>Pending Assignment Submissions: <strong>3 submissions</strong></div>
                </div>
                <button className="px-3 py-1.5 bg-zinc-900 text-white hover:bg-zinc-800 text-[11px]">
                  REVIEW SUBMISSIONS
                </button>
              </div>

              <div className="border border-zinc-300 p-4 space-y-3 bg-zinc-50">
                <div className="font-bold text-zinc-900 uppercase">[COURSE AUDIT] Playwright & TypeScript</div>
                <div className="space-y-1 text-zinc-600">
                  <div>Status: <span className="font-bold text-emerald-600">PUBLISHED</span></div>
                  <div>Active Learners: <strong>940</strong></div>
                  <div>Average Quiz Passing Rate: <strong>92.1%</strong></div>
                  <div>Pending Assignment Submissions: <strong>0 submissions</strong></div>
                </div>
                <button className="px-3 py-1.5 bg-zinc-900 text-white hover:bg-zinc-800 text-[11px]">
                  MANAGE MODULES
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: ADMIN & ANALYTICS CONSOLE (BRD Section 27 & 31) */}
      {activeTab === "ADMIN" && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* Executive Analytics Metrics (BRD Section 27) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
            <div className="border-2 border-zinc-900 bg-white p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-zinc-500 uppercase">[GROSS REVENUE]</div>
              <div className="text-2xl sm:text-3xl font-black text-zinc-950 mt-1">₹14,20,500</div>
              <div className="text-[10px] text-emerald-600 mt-1">+18.4% vs last month</div>
            </div>
            <div className="border-2 border-zinc-900 bg-white p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-zinc-500 uppercase">[TOTAL ENROLLMENTS]</div>
              <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">2,760</div>
              <div className="text-[10px] text-zinc-500 mt-1">All tracks combined</div>
            </div>
            <div className="border-2 border-zinc-900 bg-white p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-zinc-500 uppercase">[AVG COMPLETION]</div>
              <div className="text-2xl sm:text-3xl font-black text-zinc-950 mt-1">68.2%</div>
              <div className="text-[10px] text-zinc-500 mt-1">Industry avg: 22%</div>
            </div>
            <div className="border-2 border-zinc-900 bg-white p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-zinc-500 uppercase">[REFUND RATIO]</div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">0.4%</div>
              <div className="text-[10px] text-zinc-500 mt-1">Razorpay Indian Rails</div>
            </div>
          </div>

          {/* Audit Log Feed (BRD Section 31) */}
          <div className="border-2 border-zinc-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
              <h4 className="font-mono text-sm font-bold uppercase text-zinc-950">
                AUDIT TRAIL LOGS (BRD SECTION 31)
              </h4>
              <span className="font-mono text-xs text-zinc-500">LEAST-PRIVILEGE ACTIVE</span>
            </div>

            <div className="divide-y divide-zinc-200 font-mono text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <div>
                  <span className="text-blue-600 font-bold">[PAYMENT_SUCCESS]</span> Order #NGTA-ORD-8819 received via UPI.
                </div>
                <span className="text-zinc-400 text-[11px]">3 mins ago</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <div>
                  <span className="text-emerald-600 font-bold">[CERTIFICATE_ISSUED]</span> Cert ID NGTA-CERT-course-1-2026-8910 verified.
                </div>
                <span className="text-zinc-400 text-[11px]">18 mins ago</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <div>
                  <span className="text-zinc-900 font-bold">[COURSE_PUBLISHED]</span> Playwright & TypeScript curriculum approved by Super Admin.
                </div>
                <span className="text-zinc-400 text-[11px]">1 hour ago</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
