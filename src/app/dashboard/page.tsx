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
      <div className="border-b border-[#252A36] pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="font-mono text-xs text-[#5A5F70] uppercase tracking-widest mb-1">
            [WORKSPACE TELEMETRY // BRD SECTION 3 & 27]
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            MANAGEMENT CONSOLE
          </h1>
        </div>

        {/* Console View Switcher */}
        <div className="flex border border-[#252A36] bg-[#181C26] shadow-card font-mono text-xs font-bold">
          <button
            onClick={() => setActiveTab("LEARNER")}
            className={`px-4 py-2 uppercase transition-colors ${
              activeTab === "LEARNER"
                ? "bg-[#EFFF4F] text-[#10131A]"
                : "text-[#A0A5B5] hover:bg-[#252A36]"
            }`}
          >
            LEARNER PORTAL
          </button>
          <button
            onClick={() => setActiveTab("INSTRUCTOR")}
            className={`px-4 py-2 uppercase border-l border-[#252A36] transition-colors ${
              activeTab === "INSTRUCTOR"
                ? "bg-[#EFFF4F] text-[#10131A]"
                : "text-[#A0A5B5] hover:bg-[#252A36]"
            }`}
          >
            INSTRUCTOR STUDIO
          </button>
          <button
            onClick={() => setActiveTab("ADMIN")}
            className={`px-4 py-2 uppercase border-l border-[#252A36] transition-colors ${
              activeTab === "ADMIN"
                ? "bg-[#EFFF4F] text-[#10131A]"
                : "text-[#A0A5B5] hover:bg-[#252A36]"
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
            <div className="border border-[#252A36] bg-[#181C26] p-6 shadow-card space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[#5A5F70] uppercase">
                  <span>[ENROLLED TRACKS]</span>
                  <span className="text-[10px]">BRD §3</span>
                </div>
                <div className="text-3xl font-black text-white tabular-nums">02 ACTIVE</div>
                <div className="text-[11px] text-[#5A5F70]">1 In-Progress • 1 Completed</div>
              </div>

              {/* Learner Profile Drawer Toggle */}
              <div className="pt-4 border-t border-[#252A36]">
                <button
                  onClick={() => setShowProfileDrawer(!showProfileDrawer)}
                  className="w-full py-2 bg-[#10131A] hover:bg-[#252A36] border border-[#252A36] text-[#A0A5B5] font-bold uppercase text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{showProfileDrawer ? "HIDE PROFILE TELEMETRY" : "VIEW PROFILE TELEMETRY"}</span>
                </button>
              </div>
            </div>

            {/* Card 2: GAMIFICATION REPUTATION */}
            <div className="border border-[#252A36] bg-[#181C26] p-6 shadow-card space-y-3">
              <div className="flex justify-between items-center text-[#5A5F70] uppercase">
                <span className="font-bold">[GAMIFICATION REPUTATION]</span>
                <span className="text-[10px]">BRD §38</span>
              </div>

              <div className="flex flex-wrap items-baseline gap-2.5">
                <div className="text-3xl font-black text-[#EFFF4F] tabular-nums">420 PTS</div>
                <RankTag points={420} size="sm" />
              </div>

              <StreakGrid currentStreakDays={7} compact={true} />

              <div className="pt-2 border-t border-[#252A36]">
                <ReputationLog totalPoints={420} showStreakGrid={false} />
              </div>
            </div>

            {/* Card 3: VERIFIABLE CREDENTIALS */}
            <div className="border border-[#252A36] bg-[#181C26] p-6 shadow-card space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[#5A5F70] uppercase">
                  <span>[VERIFIABLE CREDENTIALS]</span>
                  <span className="text-[10px]">ISO 9001</span>
                </div>

                <div>
                  <div className="text-3xl font-black text-[#EFFF4F] tabular-nums">01 ISSUED</div>
                  <div className="text-[11px] text-[#A0A5B5] font-medium">
                    + 03 Verified Skill Badges
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] text-[#A0A5B5]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 border border-[#EFFF4F] bg-[#EFFF4F] inline-block" />
                    <span>Solid Border: 1 Accredited Certificate</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 border border-dashed border-[#5A5F70] bg-[#252A36] inline-block" />
                    <span>Dashed Border: 3 Skill Badges</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#252A36] space-y-2">
                <button
                  onClick={() => setShowCredentialsModal(true)}
                  className="w-full py-2 bg-[#EFFF4F] text-[#10131A] hover:bg-[#EFFF4F]/90 transition-colors uppercase font-bold text-[11px] flex items-center justify-center gap-1 shadow-lemon-sm"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>INSPECT ALL CREDENTIALS ({INITIAL_CREDENTIALS.length})</span>
                </button>
                <Link
                  href="/verify"
                  className="text-[11px] text-[#EFFF4F] hover:underline block text-center"
                >
                  Verify in Public Registry →
                </Link>
              </div>
            </div>
          </div>

          {/* Expandable Learner Profile Telemetry Container */}
          {showProfileDrawer && (
            <div className="border border-[#252A36] bg-[#181C26] p-6 shadow-card space-y-6 animate-in fade-in duration-200 font-mono text-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#252A36] pb-3">
                <div>
                  <div className="text-[10px] text-[#5A5F70] uppercase tracking-widest">
                    [LEARNER TELEMETRY // PROFILE // BRD §38]
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">
                    ENGINEER PROFILE & AUDIT DOSSIER
                  </h3>
                </div>
                <button
                  onClick={() => setShowProfileDrawer(false)}
                  className="text-xs text-[#5A5F70] hover:text-[#EFFF4F] underline uppercase transition-colors"
                >
                  COLLAPSE DOSSIER [x]
                </button>
              </div>

              {/* Profile Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="border border-[#252A36] bg-[#10131A] p-3 space-y-1">
                  <div className="text-[10px] text-[#5A5F70] uppercase">CANDIDATE</div>
                  <div className="font-bold text-white text-sm">Tanmay Sharma</div>
                  <div className="text-[#5A5F70] text-[10px]">@tanmay.sdet</div>
                </div>
                <div className="border border-[#252A36] bg-[#10131A] p-3 space-y-1">
                  <div className="text-[10px] text-[#5A5F70] uppercase">SYSTEM ROLE</div>
                  <div className="font-bold text-[#EFFF4F] text-sm">LEARNER (PRO)</div>
                  <div className="text-[#5A5F70] text-[10px]">RBAC: LEAST-PRIVILEGE</div>
                </div>
                <div className="border border-[#252A36] bg-[#10131A] p-3 space-y-1">
                  <div className="text-[10px] text-[#5A5F70] uppercase">SDET RANK</div>
                  <div className="font-bold text-[#EFFF4F] text-sm">RANK: SDET-II</div>
                  <div className="text-[#5A5F70] text-[10px]">420 / 750 PTS TO LEAD</div>
                </div>
                <div className="border border-[#252A36] bg-[#10131A] p-3 space-y-1">
                  <div className="text-[10px] text-[#5A5F70] uppercase">LEARNING CADENCE</div>
                  <div className="font-bold text-[#EFFF4F] text-sm">7-DAY STREAK</div>
                  <div className="text-[#5A5F70] text-[10px]">LONGEST: 14 DAYS</div>
                </div>
              </div>

              {/* Credential Cards Collection */}
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-[#252A36] pb-2">
                  <span className="font-bold text-white uppercase">
                    ISSUED CREDENTIALS & SKILL BADGES ({INITIAL_CREDENTIALS.length})
                  </span>
                  <div className="flex gap-2 text-[10px]">
                    <span className="text-[#EFFF4F] font-bold">1 SOLID (CERTIFICATE)</span>
                    <span className="text-[#5A5F70]">•</span>
                    <span className="text-[#A0A5B5] font-bold">3 DASHED (BADGES)</span>
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
          <div className="border border-[#252A36] bg-[#181C26] p-6 shadow-card space-y-6">
            <div className="flex justify-between items-center border-b border-[#252A36] pb-4">
              <h3 className="text-xl font-black uppercase text-white">MY ACTIVE COURSES</h3>
              <Link href="/courses" className="font-mono text-xs text-[#EFFF4F] hover:underline font-bold">
                BROWSE MORE TRACKS
              </Link>
            </div>

            <div className="space-y-4">
              {INITIAL_COURSES.map((course, idx) => {
                const progress = idx === 0 ? 75 : 10;
                return (
                  <div
                    key={course.id}
                    className="border border-[#252A36] p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#10131A]"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="font-mono text-[10px] text-[#5A5F70] uppercase">
                        {course.category} • {course.difficultyLevel}
                      </div>
                      <h4 className="text-lg font-bold text-white">{course.title}</h4>
                      <div className="font-mono text-xs text-[#5A5F70]">
                        Instructor: {course.instructorName}
                      </div>
                    </div>

                    <div className="w-full md:w-64 space-y-2">
                      <div className="flex justify-between font-mono text-xs">
                        <span className="text-[#5A5F70]">PROGRESS:</span>
                        <span className="font-bold text-white">{progress}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-[#252A36] border border-[#252A36] overflow-hidden">
                        <div
                          className="h-full bg-[#EFFF4F]"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="pt-2 flex justify-end">
                        <Link
                          href={`/learn/${course.id}`}
                          className="px-4 py-2 bg-[#EFFF4F] text-[#10131A] font-mono text-xs uppercase font-bold hover:bg-[#EFFF4F]/90 transition-colors flex items-center gap-1.5 shadow-lemon-sm"
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

          {/* Gamification Dashboard Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <LeaderboardTable />
            </div>
            <div className="lg:col-span-5">
              <ChallengeStepLog />
            </div>
          </div>

          {/* Credential Cards Modal */}
          {showCredentialsModal && (
            <div className="fixed inset-0 z-50 bg-[#10131A]/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-4xl bg-[#181C26] border border-[#252A36] shadow-lemon-md p-6 space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in duration-150 font-mono">
                <div className="flex justify-between items-start border-b border-[#252A36] pb-4">
                  <div>
                    <div className="text-[10px] text-[#5A5F70] uppercase tracking-widest">
                      [CREDENTIAL & BADGE REGISTRY // BRD §12 & §38]
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase">
                      VERIFIABLE CREDENTIALS & SKILL BADGES
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowCredentialsModal(false)}
                    className="px-2.5 py-1 border border-[#252A36] bg-[#10131A] hover:bg-[#252A36] text-[#A0A5B5] text-xs font-bold uppercase transition-colors"
                  >
                    CLOSE [ESC]
                  </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center justify-between gap-4 border-b border-[#252A36] pb-3">
                  <div className="flex border border-[#252A36] text-xs font-bold">
                    <button
                      onClick={() => setCredentialsFilter("ALL")}
                      className={`px-3 py-1 uppercase ${
                        credentialsFilter === "ALL"
                          ? "bg-[#EFFF4F] text-[#10131A]"
                          : "text-[#A0A5B5] hover:bg-[#252A36]"
                      }`}
                    >
                      ALL ({INITIAL_CREDENTIALS.length})
                    </button>
                    <button
                      onClick={() => setCredentialsFilter("CERTIFICATE")}
                      className={`px-3 py-1 uppercase border-l border-[#252A36] ${
                        credentialsFilter === "CERTIFICATE"
                          ? "bg-[#EFFF4F] text-[#10131A]"
                          : "text-[#A0A5B5] hover:bg-[#252A36]"
                      }`}
                    >
                      SOLID: CERTIFICATES (1)
                    </button>
                    <button
                      onClick={() => setCredentialsFilter("BADGE")}
                      className={`px-3 py-1 uppercase border-l border-[#252A36] ${
                        credentialsFilter === "BADGE"
                          ? "bg-[#EFFF4F] text-[#10131A]"
                          : "text-[#A0A5B5] hover:bg-[#252A36]"
                      }`}
                    >
                      DASHED: SKILL BADGES (3)
                    </button>
                  </div>

                  <div className="text-[11px] text-[#5A5F70] hidden sm:block">
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

      {/* VIEW 2: INSTRUCTOR STUDIO */}
      {activeTab === "INSTRUCTOR" && (
        <div className="space-y-8 animate-in fade-in duration-150">
          <div className="border border-[#252A36] bg-[#181C26] p-6 shadow-card space-y-6">
            <div className="flex justify-between items-center border-b border-[#252A36] pb-4">
              <div>
                <h3 className="text-xl font-black uppercase text-white">CURRICULUM AUTHORING STUDIO</h3>
                <p className="text-xs text-[#A0A5B5] font-mono">Create modules, chapters, video assets, quizzes and review learner submissions.</p>
              </div>
              <button className="px-4 py-2 bg-[#EFFF4F] text-[#10131A] font-mono text-xs uppercase font-bold hover:bg-[#EFFF4F]/90 transition-colors flex items-center gap-2 shadow-lemon-sm">
                <PlusCircle className="w-4 h-4" />
                <span>CREATE NEW COURSE</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              <div className="border border-[#252A36] p-4 space-y-3 bg-[#10131A]">
                <div className="font-bold text-white uppercase">[COURSE AUDIT] Selenium Automation</div>
                <div className="space-y-1 text-[#A0A5B5]">
                  <div>Status: <span className="font-bold text-[#EFFF4F]">PUBLISHED</span></div>
                  <div>Active Learners: <strong className="text-white">1,820</strong></div>
                  <div>Average Quiz Passing Rate: <strong className="text-white">88.4%</strong></div>
                  <div>Pending Assignment Submissions: <strong className="text-white">3 submissions</strong></div>
                </div>
                <button className="px-3 py-1.5 bg-[#252A36] text-[#A0A5B5] hover:bg-[#EFFF4F] hover:text-[#10131A] text-[11px] transition-colors">
                  REVIEW SUBMISSIONS
                </button>
              </div>

              <div className="border border-[#252A36] p-4 space-y-3 bg-[#10131A]">
                <div className="font-bold text-white uppercase">[COURSE AUDIT] Playwright & TypeScript</div>
                <div className="space-y-1 text-[#A0A5B5]">
                  <div>Status: <span className="font-bold text-[#EFFF4F]">PUBLISHED</span></div>
                  <div>Active Learners: <strong className="text-white">940</strong></div>
                  <div>Average Quiz Passing Rate: <strong className="text-white">92.1%</strong></div>
                  <div>Pending Assignment Submissions: <strong className="text-white">0 submissions</strong></div>
                </div>
                <button className="px-3 py-1.5 bg-[#252A36] text-[#A0A5B5] hover:bg-[#EFFF4F] hover:text-[#10131A] text-[11px] transition-colors">
                  MANAGE MODULES
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: ADMIN & ANALYTICS CONSOLE */}
      {activeTab === "ADMIN" && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* Executive Analytics Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
            <div className="border border-[#252A36] bg-[#181C26] p-5 shadow-card">
              <div className="text-[#5A5F70] uppercase">[GROSS REVENUE]</div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">₹14,20,500</div>
              <div className="text-[10px] text-[#EFFF4F] mt-1">+18.4% vs last month</div>
            </div>
            <div className="border border-[#252A36] bg-[#181C26] p-5 shadow-card">
              <div className="text-[#5A5F70] uppercase">[TOTAL ENROLLMENTS]</div>
              <div className="text-2xl sm:text-3xl font-black text-[#EFFF4F] mt-1">2,760</div>
              <div className="text-[10px] text-[#5A5F70] mt-1">All tracks combined</div>
            </div>
            <div className="border border-[#252A36] bg-[#181C26] p-5 shadow-card">
              <div className="text-[#5A5F70] uppercase">[AVG COMPLETION]</div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">68.2%</div>
              <div className="text-[10px] text-[#5A5F70] mt-1">Industry avg: 22%</div>
            </div>
            <div className="border border-[#252A36] bg-[#181C26] p-5 shadow-card">
              <div className="text-[#5A5F70] uppercase">[REFUND RATIO]</div>
              <div className="text-2xl sm:text-3xl font-black text-[#EFFF4F] mt-1">0.4%</div>
              <div className="text-[10px] text-[#5A5F70] mt-1">Razorpay Indian Rails</div>
            </div>
          </div>

          {/* Audit Log Feed */}
          <div className="border border-[#252A36] bg-[#181C26] p-6 shadow-card space-y-4">
            <div className="flex justify-between items-center border-b border-[#252A36] pb-3">
              <h4 className="font-mono text-sm font-bold uppercase text-white">
                AUDIT TRAIL LOGS (BRD SECTION 31)
              </h4>
              <span className="font-mono text-xs text-[#5A5F70]">LEAST-PRIVILEGE ACTIVE</span>
            </div>

            <div className="divide-y divide-[#252A36] font-mono text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <div className="text-[#A0A5B5]">
                  <span className="text-[#EFFF4F] font-bold">[PAYMENT_SUCCESS]</span> Order #NGTA-ORD-8819 received via UPI.
                </div>
                <span className="text-[#5A5F70] text-[11px]">3 mins ago</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <div className="text-[#A0A5B5]">
                  <span className="text-[#EFFF4F] font-bold">[CERTIFICATE_ISSUED]</span> Cert ID NGTA-CERT-course-1-2026-8910 verified.
                </div>
                <span className="text-[#5A5F70] text-[11px]">18 mins ago</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <div className="text-[#A0A5B5]">
                  <span className="text-white font-bold">[COURSE_PUBLISHED]</span> Playwright & TypeScript curriculum approved by Super Admin.
                </div>
                <span className="text-[#5A5F70] text-[11px]">1 hour ago</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
