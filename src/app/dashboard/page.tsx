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
} from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"LEARNER" | "INSTRUCTOR" | "ADMIN">("LEARNER");

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
          {/* Progress Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="border-2 border-zinc-900 bg-white p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-2">
              <span className="text-zinc-500 uppercase">[ENROLLED TRACKS]</span>
              <div className="text-3xl font-black text-zinc-950">02 ACTIVE</div>
              <div className="text-[11px] text-zinc-500">1 In-Progress • 1 Completed</div>
            </div>
            <div className="border-2 border-zinc-900 bg-white p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-2">
              <span className="text-zinc-500 uppercase">[GAMIFICATION REPUTATION]</span>
              <div className="text-3xl font-black text-blue-600">420 PTS</div>
              <div className="text-[11px] text-emerald-600 font-bold">● 7-Day Learning Streak Active</div>
            </div>
            <div className="border-2 border-zinc-900 bg-white p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-2">
              <span className="text-zinc-500 uppercase">[VERIFIABLE CREDENTIALS]</span>
              <div className="text-3xl font-black text-emerald-600">01 ISSUED</div>
              <Link href="/verify" className="text-[11px] text-blue-600 hover:underline block">
                View in Public Registry →
              </Link>
            </div>
          </div>

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
