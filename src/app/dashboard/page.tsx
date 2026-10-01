"use client";

import React, { useState, useEffect } from "react";
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
  Settings,
  ChevronDown,
  ChevronUp,
  User,
  ArrowRight,
  Calendar,
  Trophy,
  Video,
} from "lucide-react";
import ReputationLog from "@/components/gamification/ReputationLog";
import RankTag from "@/components/gamification/RankTag";
import StreakGrid from "@/components/gamification/StreakGrid";
import CredentialCard from "@/components/gamification/CredentialCard";
import LeaderboardTable from "@/components/gamification/LeaderboardTable";
import ChallengeStepLog from "@/components/gamification/ChallengeStepLog";
import { INITIAL_CREDENTIALS, CredentialItem } from "@/lib/gamification";
import { createBrowserClient } from "@supabase/ssr";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"LEARNER" | "INSTRUCTOR" | "ADMIN">("LEARNER");
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [credentialsFilter, setCredentialsFilter] = useState<"ALL" | "CERTIFICATE" | "BADGE">("ALL");
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [enrollmentDetails, setEnrollmentDetails] = useState<
    { course_id: string; completed_modules: number; total_modules: number; progress_percent: number }[]
  >([]);
  const [userStats, setUserStats] = useState<{
    name: string;
    username: string;
    xp_points: number;
    current_streak: number;
    role: string;
  }>({
    name: "Learner",
    username: "learner",
    xp_points: 0,
    current_streak: 0,
    role: "STUDENT",
  });

  // Fetch logged-in user's active enrollments and gamification stats from Supabase
  useEffect(() => {
    async function checkUserEnrollments() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseAnonKey) return;

        const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user?.id) {
          const profilePromise = fetch(`/api/student-profile?userId=${user.id}`).then((r) =>
            r.ok ? r.json() : null
          );
          const paymentPromise = fetch(`/api/payments/verify?userId=${user.id}`).then((r) =>
            r.ok ? r.json() : null
          );

          const [profileData, paymentData] = await Promise.all([profilePromise, paymentPromise]);

          if (paymentData?.enrolledCourseIds && Array.isArray(paymentData.enrolledCourseIds)) {
            setEnrolledCourseIds(paymentData.enrolledCourseIds);
          }
          if (paymentData?.enrollments && Array.isArray(paymentData.enrollments)) {
            setEnrollmentDetails(paymentData.enrollments);
          }

          const rawFullName =
            user.user_metadata?.full_name ||
            profileData?.profile?.username ||
            user.email?.split("@")[0] ||
            "Learner";
          const rawUsername =
            profileData?.profile?.username || user.email?.split("@")[0] || "learner";

          setUserStats({
            name: rawFullName,
            username: rawUsername,
            xp_points: profileData?.profile?.xp_points ?? profileData?.xp_points ?? 0,
            current_streak: profileData?.profile?.current_streak ?? profileData?.current_streak ?? 0,
            role: profileData?.role || "STUDENT",
          });
        }
      } catch (err) {
        console.warn("Could not check enrollments in dashboard:", err);
      }
    }

    checkUserEnrollments();
  }, []);

  const isHeroCourseEnrolled = enrolledCourseIds.includes("course-1");
  const heroEnrollment = enrollmentDetails.find((e) => e.course_id === "course-1");
  const heroCompleted = heroEnrollment?.completed_modules ?? 0;
  const heroTotal = heroEnrollment?.total_modules ?? 10;
  const heroProgress =
    isHeroCourseEnrolled && heroTotal > 0
      ? Math.round((heroCompleted / heroTotal) * 100)
      : 0;

  const enrolledCourses = INITIAL_COURSES.filter((c) =>
    enrolledCourseIds.includes(c.id)
  );

  const filteredCredentials = INITIAL_CREDENTIALS.filter((c) => {
    if (credentialsFilter === "ALL") return true;
    return c.type === credentialsFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner & Role View Switcher */}
      <div className="border-b border-[#1f2d4d] pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="font-mono text-xs text-[#8A96A8] uppercase tracking-widest mb-1">
            DASHBOARD OVERVIEW
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            MANAGEMENT CONSOLE
          </h1>
        </div>

        {/* Console View Switcher */}
        <div className="flex border border-[#1f2d4d] bg-[#14213D] shadow-card font-mono text-xs font-bold">
          <button
            onClick={() => setActiveTab("LEARNER")}
            className={`px-4 py-2 uppercase transition-colors ${
              activeTab === "LEARNER"
                ? "bg-[#FCA311] text-[#000000]"
                : "text-[#E5E5E5] hover:bg-[#1f2d4d]"
            }`}
          >
            LEARNER PORTAL
          </button>
          <button
            onClick={() => setActiveTab("INSTRUCTOR")}
            className={`px-4 py-2 uppercase border-l border-[#1f2d4d] transition-colors ${
              activeTab === "INSTRUCTOR"
                ? "bg-[#FCA311] text-[#000000]"
                : "text-[#E5E5E5] hover:bg-[#1f2d4d]"
            }`}
          >
            INSTRUCTOR STUDIO
          </button>
          <button
            onClick={() => setActiveTab("ADMIN")}
            className={`px-4 py-2 uppercase border-l border-[#1f2d4d] transition-colors ${
              activeTab === "ADMIN"
                ? "bg-[#FCA311] text-[#000000]"
                : "text-[#E5E5E5] hover:bg-[#1f2d4d]"
            }`}
          >
            ADMIN / RBAC
          </button>
        </div>
      </div>

      {/* VIEW 1: LEARNER PORTAL */}
      {activeTab === "LEARNER" && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* Header from Reference Image 1 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f2d4d] pb-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 font-mono text-[11px] text-[#E5E5E5] uppercase">
                <span className="px-2 py-0.5 bg-[#FCA311]/10 border border-[#FCA311]/30 text-[#FCA311] font-bold">
                  COMMAND CENTER
                </span>
                <span>•</span>
                <span>Daily Goal: Complete 1 Lesson</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                <span>Welcome back, {userStats.name}</span>
                <span className="text-xl sm:text-2xl">👋</span>
              </h2>
              <p className="text-sm text-[#E5E5E5] max-w-2xl font-sans">
                Track your course progression, daily streak habits, live workshops, and verifiable credentials.
              </p>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <Link
                href="/courses"
                className="px-4 py-2 bg-[#FCA311] text-[#000000] font-bold uppercase hover:bg-[#FCA311]/90 transition-colors flex items-center gap-1.5 shadow-lemon-sm"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/settings"
                className="px-4 py-2 border border-[#1f2d4d] bg-[#14213D] text-[#E5E5E5] hover:text-white uppercase font-bold transition-colors"
              >
                Account Settings
              </Link>
            </div>
          </div>

          {/* In-Progress Course Hero Card (Reference Image 1) */}
          <div className="border border-[#1f2d4d] bg-gradient-to-br from-[#0d1527] via-[#14213D] to-[#000000] p-6 sm:p-8 rounded-lg shadow-card relative overflow-hidden space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <span className="px-2.5 py-0.5 bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold uppercase text-[10px]">
                    IN PROGRESS
                  </span>
                  <span className="text-[#E5E5E5] text-[11px]">Last accessed today</span>
                </div>

                <div className="font-mono text-[10px] text-[#E5E5E5] uppercase tracking-wider">
                  TEST AUTOMATION & SDET
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Selenium with Java – AI Integrated Masterclass
                </h3>

                {/* Progress Bar calculated dynamically */}
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-[#E5E5E5]">Course Progress</span>
                    <span className="font-bold text-[#FCA311]">{heroProgress}% Completed</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#000000] rounded-full overflow-hidden border border-[#1f2d4d]">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-[#FCA311] rounded-full transition-all duration-500"
                      style={{ width: `${heroProgress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs text-[#E5E5E5] pt-1">
                  <PlayCircle className="w-4 h-4 text-[#FCA311] shrink-0" />
                  <span className="truncate">
                    Next Lesson: Lesson 1.2: WebDriver Architecture & Browser Initialization
                  </span>
                </div>
              </div>

              <div className="shrink-0 flex items-center">
                <Link
                  href={isHeroCourseEnrolled ? "/learn/course-1" : "/courses"}
                  className={`px-6 py-3.5 font-mono text-xs uppercase font-bold transition-all flex items-center gap-2 shadow-lg ${
                    isHeroCourseEnrolled
                      ? "bg-[#FCA311] text-[#000000] hover:bg-[#e0910f] shadow-lemon-sm"
                      : "bg-[#FCA311] text-[#000000] hover:bg-[#FCA311]/90 shadow-lemon-sm"
                  }`}
                >
                  <span>{isHeroCourseEnrolled ? "Resume Learning" : "Enroll in Course"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* 3 Metric / Status Cards (Reference Image 1) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            {/* Card 1: LIVE WORKSHOP */}
            <div className="border border-[#1f2d4d] bg-[#14213D] p-6 shadow-card space-y-4 flex flex-col justify-between rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[#E5E5E5]">
                  <span className="font-bold text-[11px] text-[#FCA311] tracking-wider">LIVE WORKSHOP</span>
                  <Video className="w-4 h-4 text-[#FCA311]" />
                </div>
                <h4 className="text-base font-bold text-white font-sans">
                  Live SDET Enterprise Automation Bootcamp
                </h4>
                <div className="space-y-1 text-[#E5E5E5] text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#8A96A8]" />
                    <span>Sept 12, 2026 • 10:00 AM IST</span>
                  </div>
                  <div>Instructor: Rahul Kamat</div>
                </div>
              </div>
              <Link
                href="/courses"
                className="pt-2 text-[11px] text-[#FCA311] hover:underline flex items-center gap-1 font-bold"
              >
                <span>View Session Details</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Card 2: 30-DAY CHALLENGE */}
            <div className="border border-[#1f2d4d] bg-[#14213D] p-6 shadow-card space-y-4 flex flex-col justify-between rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[#E5E5E5]">
                  <span className="font-bold text-[11px] text-amber-400 tracking-wider">DAY 12 OF 30</span>
                  <Trophy className="w-4 h-4 text-amber-400" />
                </div>
                <h4 className="text-base font-bold text-white font-sans">
                  30-Day Selenium Automation Challenge
                </h4>
                <div className="space-y-1 text-[#E5E5E5] text-[11px]">
                  <div className="text-white font-medium">Today&apos;s Milestone:</div>
                  <div className="text-[11px] text-[#E5E5E5] line-clamp-2">
                    Integrate TestNG DataProviders with Excel Test Data sheet
                  </div>
                </div>
              </div>
              <Link
                href="/challenge"
                className="pt-2 text-[11px] text-amber-400 hover:underline flex items-center justify-between font-bold"
              >
                <span>18 Days Remaining</span>
                <span className="flex items-center gap-1">
                  <span>Open Challenge</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>

            {/* Card 3: ACCREDITATION */}
            <div className="border border-[#1f2d4d] bg-[#14213D] p-6 shadow-card space-y-4 flex flex-col justify-between rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[#E5E5E5]">
                  <span className="font-bold text-[11px] text-emerald-400 tracking-wider">ACCREDITATION</span>
                  <Award className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="text-base font-bold text-white font-sans">
                  Verified Certificate Status
                </h4>
                <p className="text-[11px] text-[#E5E5E5] leading-relaxed font-sans">
                  Pass your final course quiz with &gt;= 70% to unlock your verifiable Certificate of SDET Mastery.
                </p>
              </div>
              <Link
                href="/certificates"
                className="pt-2 text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-bold"
              >
                <span>View My Certificates</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Progress Cards Grid with Gamification Layer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            {/* Card 1: ENROLLED TRACKS */}
            <div className="border border-[#1f2d4d] bg-[#14213D] p-6 shadow-card space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[#8A96A8] uppercase">
                  <span>ENROLLED COURSES</span>
                </div>
                <div className="text-3xl font-black text-white tabular-nums">
                  {String(enrolledCourses.length).padStart(2, "0")} ACTIVE
                </div>
                <div className="text-[11px] text-[#8A96A8]">
                  {enrolledCourses.length > 0
                    ? `${enrolledCourses.length} In-Progress`
                    : "0 Enrolled Courses"}
                </div>
              </div>

              {/* Learner Profile Drawer Toggle */}
              <div className="pt-4 border-t border-[#1f2d4d]">
                <button
                  onClick={() => setShowProfileDrawer(!showProfileDrawer)}
                  className="w-full py-2 bg-[#000000] hover:bg-[#1f2d4d] border border-[#1f2d4d] text-[#E5E5E5] font-bold uppercase text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{showProfileDrawer ? "HIDE PROFILE" : "VIEW PROFILE"}</span>
                </button>
              </div>
            </div>

            {/* Card 2: GAMIFICATION REPUTATION */}
            <div className="border border-[#1f2d4d] bg-[#14213D] p-6 shadow-card space-y-3">
              <div className="flex justify-between items-center text-[#8A96A8] uppercase">
                <span className="font-bold">POINTS & REPUTATION</span>
              </div>

              <div className="flex flex-wrap items-baseline gap-2.5">
                <div className="text-3xl font-black text-[#FCA311] tabular-nums">
                  {userStats.xp_points} PTS
                </div>
                <RankTag points={userStats.xp_points} size="sm" />
              </div>

              <StreakGrid currentStreakDays={userStats.current_streak} compact={true} />

              <div className="pt-2 border-t border-[#1f2d4d]">
                <ReputationLog totalPoints={userStats.xp_points} showStreakGrid={false} />
              </div>
            </div>

            {/* Card 3: VERIFIABLE CREDENTIALS */}
            <div className="border border-[#1f2d4d] bg-[#14213D] p-6 shadow-card space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[#8A96A8] uppercase">
                  <span>EARNED CREDENTIALS</span>
                </div>

                <div>
                  <div className="text-3xl font-black text-[#FCA311] tabular-nums">01 ISSUED</div>
                  <div className="text-[11px] text-[#E5E5E5] font-medium">
                    + 03 Verified Skill Badges
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] text-[#E5E5E5]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 border border-[#FCA311] bg-[#FCA311] inline-block" />
                    <span>Solid Border: 1 Accredited Certificate</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 border border-dashed border-[#8A96A8] bg-[#1f2d4d] inline-block" />
                    <span>Dashed Border: 3 Skill Badges</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1f2d4d] space-y-2">
                <button
                  onClick={() => setShowCredentialsModal(true)}
                  className="w-full py-2 bg-[#FCA311] text-[#000000] hover:bg-[#FCA311]/90 transition-colors uppercase font-bold text-[11px] flex items-center justify-center gap-1 shadow-lemon-sm"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>INSPECT ALL CREDENTIALS ({INITIAL_CREDENTIALS.length})</span>
                </button>
                <Link
                  href="/verify"
                  className="text-[11px] text-[#FCA311] hover:underline block text-center"
                >
                  Verify in Public Registry →
                </Link>
              </div>
            </div>
          </div>

          {/* Expandable Learner Profile Telemetry Container */}
          {showProfileDrawer && (
            <div className="border border-[#1f2d4d] bg-[#14213D] p-6 shadow-card space-y-6 animate-in fade-in duration-200 font-mono text-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#1f2d4d] pb-3">
                <div>
                  <div className="text-[10px] text-[#8A96A8] uppercase tracking-widest">
                    STUDENT PROFILE
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">
                    ENGINEER PROFILE
                  </h3>
                </div>
                <button
                  onClick={() => setShowProfileDrawer(false)}
                  className="text-xs text-[#8A96A8] hover:text-[#FCA311] underline uppercase transition-colors"
                >
                  CLOSE PROFILE [x]
                </button>
              </div>

              {/* Profile Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="border border-[#1f2d4d] bg-[#000000] p-3 space-y-1">
                  <div className="text-[10px] text-[#8A96A8] uppercase">CANDIDATE</div>
                  <div className="font-bold text-white text-sm truncate">{userStats.name}</div>
                  <div className="text-[#8A96A8] text-[10px] truncate">@{userStats.username}</div>
                </div>
                <div className="border border-[#1f2d4d] bg-[#000000] p-3 space-y-1">
                  <div className="text-[10px] text-[#8A96A8] uppercase">SYSTEM ROLE</div>
                  <div className="font-bold text-[#FCA311] text-sm">{userStats.role}</div>
                  <div className="text-[#8A96A8] text-[10px]">VERIFIED STUDENT</div>
                </div>
                <div className="border border-[#1f2d4d] bg-[#000000] p-3 space-y-1">
                  <div className="text-[10px] text-[#8A96A8] uppercase">SDET RANK</div>
                  <div className="font-bold text-[#FCA311] text-sm">
                    {userStats.xp_points >= 1000
                      ? "RANK: LEAD"
                      : userStats.xp_points >= 400
                      ? "RANK: SDET-II"
                      : "RANK: SDET-I"}
                  </div>
                  <div className="text-[#8A96A8] text-[10px]">{userStats.xp_points} XP EARNED</div>
                </div>
                <div className="border border-[#1f2d4d] bg-[#000000] p-3 space-y-1">
                  <div className="text-[10px] text-[#8A96A8] uppercase">LEARNING CADENCE</div>
                  <div className="font-bold text-[#FCA311] text-sm">{userStats.current_streak}-DAY STREAK</div>
                  <div className="text-[#8A96A8] text-[10px]">
                    {userStats.current_streak > 0 ? "STREAK ACTIVE" : "0 DAYS ACTIVE"}
                  </div>
                </div>
              </div>

              {/* Credential Cards Collection */}
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-[#1f2d4d] pb-2">
                  <span className="font-bold text-white uppercase">
                    ISSUED CREDENTIALS & SKILL BADGES ({INITIAL_CREDENTIALS.length})
                  </span>
                  <div className="flex gap-2 text-[10px]">
                    <span className="text-[#FCA311] font-bold">1 SOLID (CERTIFICATE)</span>
                    <span className="text-[#8A96A8]">•</span>
                    <span className="text-[#E5E5E5] font-bold">3 DASHED (BADGES)</span>
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
          <div className="border border-[#1f2d4d] bg-[#14213D] p-6 shadow-card space-y-6">
            <div className="flex justify-between items-center border-b border-[#1f2d4d] pb-4">
              <h3 className="text-xl font-black uppercase text-white">MY ACTIVE COURSES</h3>
              <Link href="/courses" className="font-mono text-xs text-[#FCA311] hover:underline font-bold">
                BROWSE MORE TRACKS
              </Link>
            </div>

            <div className="space-y-4">
              {enrolledCourses.length === 0 ? (
                <div className="border border-[#1f2d4d] bg-[#000000] p-8 text-center space-y-3 font-mono text-xs">
                  <p className="text-white font-bold text-sm">No active enrolled tracks yet.</p>
                  <p className="text-[#E5E5E5] max-w-md mx-auto">
                    Enroll in Selenium Java, Playwright, or our SDET masterclasses to unlock high-definition lessons and live coding sessions.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/courses"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FCA311] text-[#000000] font-bold uppercase hover:bg-[#FCA311]/90 transition-colors shadow-lemon-sm"
                    >
                      <span>Explore Course Catalog</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                enrolledCourses.map((course) => {
                  const enrollment = enrollmentDetails.find((e) => e.course_id === course.id);
                  const completed = enrollment?.completed_modules ?? 0;
                  const total = enrollment?.total_modules ?? (course.modules?.length || 10);
                  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
                  return (
                    <div
                      key={course.id}
                      className="border border-[#1f2d4d] p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#000000]"
                    >
                      <div className="space-y-1 max-w-xl">
                        <div className="font-mono text-[10px] text-[#8A96A8] uppercase">
                          {course.category} • {course.difficultyLevel}
                        </div>
                        <h4 className="text-lg font-bold text-white">{course.title}</h4>
                        <div className="font-mono text-xs text-[#8A96A8]">
                          Instructor: {course.instructorName}
                        </div>
                      </div>

                      <div className="w-full md:w-64 space-y-2">
                        <div className="flex justify-between font-mono text-xs">
                          <span className="text-[#8A96A8]">PROGRESS:</span>
                          <span className="font-bold text-white">{progress}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-[#1f2d4d] border border-[#1f2d4d] overflow-hidden">
                          <div
                            className="h-full bg-[#FCA311]"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="pt-2 flex justify-end">
                          <Link
                            href={`/learn/${course.id}`}
                            className="px-4 py-2 bg-[#FCA311] text-[#000000] font-mono text-xs uppercase font-bold hover:bg-[#FCA311]/90 transition-colors flex items-center gap-1.5 shadow-lemon-sm"
                          >
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span>CONTINUE LEARNING</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Gamification Dashboard Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <LeaderboardTable />
            </div>
            <div className="lg:col-span-5">
              <ChallengeStepLog streakDays={userStats.current_streak} />
            </div>
          </div>

          {/* Credential Cards Modal */}
          {showCredentialsModal && (
            <div className="fixed inset-0 z-50 bg-[#000000]/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-4xl bg-[#14213D] border border-[#1f2d4d] shadow-lemon-md p-6 space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in duration-150 font-mono">
                <div className="flex justify-between items-start border-b border-[#1f2d4d] pb-4">
                  <div>
                    <div className="text-[10px] text-[#8A96A8] uppercase tracking-widest">
                      CREDENTIAL REGISTRY
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase">
                      VERIFIABLE CREDENTIALS & SKILL BADGES
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowCredentialsModal(false)}
                    className="px-2.5 py-1 border border-[#1f2d4d] bg-[#000000] hover:bg-[#1f2d4d] text-[#E5E5E5] text-xs font-bold uppercase transition-colors"
                  >
                    CLOSE [ESC]
                  </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center justify-between gap-4 border-b border-[#1f2d4d] pb-3">
                  <div className="flex border border-[#1f2d4d] text-xs font-bold">
                    <button
                      onClick={() => setCredentialsFilter("ALL")}
                      className={`px-3 py-1 uppercase ${
                        credentialsFilter === "ALL"
                          ? "bg-[#FCA311] text-[#000000]"
                          : "text-[#E5E5E5] hover:bg-[#1f2d4d]"
                      }`}
                    >
                      ALL ({INITIAL_CREDENTIALS.length})
                    </button>
                    <button
                      onClick={() => setCredentialsFilter("CERTIFICATE")}
                      className={`px-3 py-1 uppercase border-l border-[#1f2d4d] ${
                        credentialsFilter === "CERTIFICATE"
                          ? "bg-[#FCA311] text-[#000000]"
                          : "text-[#E5E5E5] hover:bg-[#1f2d4d]"
                      }`}
                    >
                      SOLID: CERTIFICATES (1)
                    </button>
                    <button
                      onClick={() => setCredentialsFilter("BADGE")}
                      className={`px-3 py-1 uppercase border-l border-[#1f2d4d] ${
                        credentialsFilter === "BADGE"
                          ? "bg-[#FCA311] text-[#000000]"
                          : "text-[#E5E5E5] hover:bg-[#1f2d4d]"
                      }`}
                    >
                      DASHED: SKILL BADGES (3)
                    </button>
                  </div>

                  <div className="text-[11px] text-[#8A96A8] hidden sm:block">
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
          <div className="border border-[#1f2d4d] bg-[#14213D] p-6 shadow-card space-y-6">
            <div className="flex justify-between items-center border-b border-[#1f2d4d] pb-4">
              <div>
                <h3 className="text-xl font-black uppercase text-white">CURRICULUM AUTHORING STUDIO</h3>
                <p className="text-xs text-[#E5E5E5] font-mono">Create modules, chapters, video assets, quizzes and review learner submissions.</p>
              </div>
              <button className="px-4 py-2 bg-[#FCA311] text-[#000000] font-mono text-xs uppercase font-bold hover:bg-[#FCA311]/90 transition-colors flex items-center gap-2 shadow-lemon-sm">
                <PlusCircle className="w-4 h-4" />
                <span>CREATE NEW COURSE</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              <div className="border border-[#1f2d4d] p-4 space-y-3 bg-[#000000]">
                <div className="font-bold text-white uppercase">[COURSE AUDIT] Selenium Automation</div>
                <div className="space-y-1 text-[#E5E5E5]">
                  <div>Status: <span className="font-bold text-[#FCA311]">PUBLISHED</span></div>
                  <div>Active Learners: <strong className="text-white">1,820</strong></div>
                  <div>Average Quiz Passing Rate: <strong className="text-white">88.4%</strong></div>
                  <div>Pending Assignment Submissions: <strong className="text-white">3 submissions</strong></div>
                </div>
                <button className="px-3 py-1.5 bg-[#1f2d4d] text-[#E5E5E5] hover:bg-[#FCA311] hover:text-[#000000] text-[11px] transition-colors">
                  REVIEW SUBMISSIONS
                </button>
              </div>

              <div className="border border-[#1f2d4d] p-4 space-y-3 bg-[#000000]">
                <div className="font-bold text-white uppercase">[COURSE AUDIT] Playwright & TypeScript</div>
                <div className="space-y-1 text-[#E5E5E5]">
                  <div>Status: <span className="font-bold text-[#FCA311]">PUBLISHED</span></div>
                  <div>Active Learners: <strong className="text-white">940</strong></div>
                  <div>Average Quiz Passing Rate: <strong className="text-white">92.1%</strong></div>
                  <div>Pending Assignment Submissions: <strong className="text-white">0 submissions</strong></div>
                </div>
                <button className="px-3 py-1.5 bg-[#1f2d4d] text-[#E5E5E5] hover:bg-[#FCA311] hover:text-[#000000] text-[11px] transition-colors">
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
            <div className="border border-[#1f2d4d] bg-[#14213D] p-5 shadow-card">
              <div className="text-[#8A96A8] uppercase">[GROSS REVENUE]</div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">₹14,20,500</div>
              <div className="text-[10px] text-[#FCA311] mt-1">+18.4% vs last month</div>
            </div>
            <div className="border border-[#1f2d4d] bg-[#14213D] p-5 shadow-card">
              <div className="text-[#8A96A8] uppercase">[TOTAL ENROLLMENTS]</div>
              <div className="text-2xl sm:text-3xl font-black text-[#FCA311] mt-1">2,760</div>
              <div className="text-[10px] text-[#8A96A8] mt-1">All tracks combined</div>
            </div>
            <div className="border border-[#1f2d4d] bg-[#14213D] p-5 shadow-card">
              <div className="text-[#8A96A8] uppercase">[AVG COMPLETION]</div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">68.2%</div>
              <div className="text-[10px] text-[#8A96A8] mt-1">Industry avg: 22%</div>
            </div>
            <div className="border border-[#1f2d4d] bg-[#14213D] p-5 shadow-card">
              <div className="text-[#8A96A8] uppercase">[REFUND RATIO]</div>
              <div className="text-2xl sm:text-3xl font-black text-[#FCA311] mt-1">0.4%</div>
              <div className="text-[10px] text-[#8A96A8] mt-1">Payment Gateway</div>
            </div>
          </div>

          {/* Audit Log Feed */}
          <div className="border border-[#1f2d4d] bg-[#14213D] p-6 shadow-card space-y-4">
            <div className="flex justify-between items-center border-b border-[#1f2d4d] pb-3">
              <h4 className="font-mono text-sm font-bold uppercase text-white">
                RECENT SYSTEM ACTIVITY
              </h4>
              <span className="font-mono text-xs text-[#8A96A8]">LIVE LOG</span>
            </div>

            <div className="divide-y divide-[#1f2d4d] font-mono text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <div className="text-[#E5E5E5]">
                  <span className="text-[#FCA311] font-bold">[PAYMENT_SUCCESS]</span> Order #NGTA-ORD-8819 received via UPI.
                </div>
                <span className="text-[#8A96A8] text-[11px]">3 mins ago</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <div className="text-[#E5E5E5]">
                  <span className="text-[#FCA311] font-bold">[CERTIFICATE_ISSUED]</span> Cert ID NGTA-CERT-course-1-2026-8910 verified.
                </div>
                <span className="text-[#8A96A8] text-[11px]">18 mins ago</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <div className="text-[#E5E5E5]">
                  <span className="text-white font-bold">[COURSE_PUBLISHED]</span> Playwright & TypeScript curriculum approved by Super Admin.
                </div>
                <span className="text-[#8A96A8] text-[11px]">1 hour ago</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
