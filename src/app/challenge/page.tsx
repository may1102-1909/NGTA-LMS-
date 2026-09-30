"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  Flame,
  Calendar as CalendarIcon,
  CheckCircle2,
  Send,
  ExternalLink,
  Code,
  Sparkles,
  ArrowRight,
  Terminal,
  Copy,
  Check,
  RotateCcw,
  Zap,
  Volume2,
  VolumeX,
  Clock,
  Shield,
  Award,
  Users,
  Gift,
} from "lucide-react";
import { INITIAL_CHALLENGE_TASKS, ChallengeTask } from "@/lib/gamification";
import ChallengeCalendar from "@/components/gamification/ChallengeCalendar";
import { createBrowserClient } from "@supabase/ssr";

/* Subtle Web Audio synthesizer for tactile feedback */
function playAudioBlip(type: "click" | "check" | "success" | "celebrate", soundEnabled = true) {
  if (!soundEnabled || typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === "click") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(480, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === "check") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08); // A5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === "celebrate") {
      // Duolingo-style major fanfare chord arpeggio
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.4);
        osc.start(ctx.currentTime + i * 0.07);
        osc.stop(ctx.currentTime + i * 0.07 + 0.4);
      });
    }
  } catch {
    // Autoplay fallback
  }
}

export default function ChallengePage() {
  // Tasks list (Days 1 to 30) - Safe default zero completed
  const [tasks, setTasks] = useState<ChallengeTask[]>(() => {
    return INITIAL_CHALLENGE_TASKS.map((t) => ({
      ...t,
      isCompleted: false,
    }));
  });

  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [animatingDay, setAnimatingDay] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showDay30Victory, setShowDay30Victory] = useState(false);

  // Dynamic user stats initialized to 0 for new signups
  const [streakCount, setStreakCount] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);

  // Fetch real user gamification stats from Supabase
  useEffect(() => {
    let isMounted = true;
    async function loadUserGamification() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseAnonKey) return;

        const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user?.id) {
          const res = await fetch(`/api/student-profile?userId=${user.id}`);
          if (res.ok) {
            const data = await res.json();
            if (isMounted) {
              const streak = data.profile?.current_streak ?? data.current_streak ?? 0;
              const xp = data.profile?.xp_points ?? data.xp_points ?? 0;
              setStreakCount(streak);
              setTotalPoints(xp);

              // Dynamically mark tasks completed based on live streak
              if (streak > 0) {
                setTasks((prev) =>
                  prev.map((t) => ({
                    ...t,
                    isCompleted: t.dayNumber <= streak,
                  }))
                );
                setSelectedDay(Math.min(30, streak + 1));
              }
            }
          }
        }
      } catch (err) {
        console.warn("Could not load gamification in challenge page:", err);
      }
    }
    loadUserGamification();
    return () => {
      isMounted = false;
    };
  }, []);

  // Submission State
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [justCelebrated, setJustCelebrated] = useState(false);

  // Acceptance criteria checkboxes for selected day (default: empty for real action tracking)
  const [checkedCriteria, setCheckedCriteria] = useState<Record<number, boolean>>({});

  // Daily countdown timer (to midnight)
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 34, seconds: 12 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentTask = tasks.find((t) => t.dayNumber === selectedDay) || tasks[11];
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  // Criteria toggle
  const toggleCriteria = (index: number) => {
    playAudioBlip("check", soundEnabled);
    setCheckedCriteria((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const criteriaList = [
    { title: "Apache POI dependency configured in pom.xml", points: 5 },
    { title: "ExcelReader utility class handles .xlsx row parsing safely", points: 10 },
    { title: "Data-driven test iterates through dynamic login permutations", points: 10 },
    { title: "TestNG XML suite executes tests with ThreadLocal<WebDriver> isolation", points: 10 },
  ];
  const criteriaCompletedCount = Object.values(checkedCriteria).filter(Boolean).length;

  // Complete a Day and trigger calendar date animation
  const handleCompleteDay = (dayNumber: number) => {
    const task = tasks.find((t) => t.dayNumber === dayNumber);
    if (!task) return;

    const reward = task.pointsReward || 35;

    // Trigger animation state on the respective calendar cell
    setAnimatingDay(dayNumber);
    playAudioBlip("celebrate", soundEnabled);

    // Update tasks state
    setTasks((prev) =>
      prev.map((t) =>
        t.dayNumber === dayNumber
          ? { ...t, isCompleted: true, completedAt: new Date().toISOString() }
          : t
      )
    );

    // Update all criteria to true for aesthetic completion
    setCheckedCriteria({ 0: true, 1: true, 2: true, 3: true });

    // Update streak and points if completing active day
    if (dayNumber === 12 && streakCount === 7) {
      setStreakCount(8);
      setTotalPoints((prev) => prev + reward);
    }

    // Trigger Giant Warrior Trophy Mural for Day 30 Capstone
    if (dayNumber === 30) {
      setShowDay30Victory(true);
    }

    setSubmitted(true);
    setJustCelebrated(true);

    // Remove animation class after animation completes (1.6s)
    setTimeout(() => {
      setAnimatingDay(null);
    }, 1800);
  };

  // Reset Day State (allows user to re-test the animation)
  const handleResetDay = (dayNumber: number) => {
    playAudioBlip("click", soundEnabled);
    setTasks((prev) =>
      prev.map((t) => (t.dayNumber === dayNumber ? { ...t, isCompleted: false } : t))
    );
    if (dayNumber === 12) {
      setStreakCount(7);
      setTotalPoints(420);
    }
    if (dayNumber === 30) {
      setShowDay30Victory(false);
    }
    setCheckedCriteria({ 0: true, 1: true, 2: false, 3: false });
    setSubmitted(false);
    setJustCelebrated(false);
    setAnimatingDay(null);
  };

  // Submit Form Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionUrl.trim()) return;
    handleCompleteDay(selectedDay);
  };

  const copyCode = (snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedCode(true);
    playAudioBlip("click", soundEnabled);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 font-sans selection:bg-[#EFFF4F] selection:text-[#28282B]">
      {/* Top Header */}
      <div className="border-b border-[#3E3E43] pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
        <div className="space-y-2">
          <div className="font-mono text-xs text-[#5A5F70] uppercase tracking-widest flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-amber-400/15 border border-amber-400/30 text-amber-400 font-bold text-[10px] flex items-center gap-1">
              <Flame className="w-3 h-3 fill-current" />
              HIGH INTENSITY SDET GAUNTLET
            </span>
            <span>•</span>
            <span className="text-[#A0A5B5]">DAY 12 ACTIVE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span>30-DAY SELENIUM AUTOMATION SPRINT</span>
            <Trophy className="w-8 h-8 text-amber-400 shrink-0" />
          </h1>

          <p className="text-sm text-[#A0A5B5] max-w-3xl leading-relaxed">
            Curated by Rahul Kamat to build production-grade SDET competencies through daily hands-on implementation challenges, TestNG architecture, and CI/CD pipelines.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs shrink-0">
          {/* Sound FX Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 border border-[#3E3E43] bg-[#2E2E32] text-[#A0A5B5] hover:text-[#EFFF4F] transition-colors rounded-lg flex items-center gap-1.5"
            title={soundEnabled ? "Mute sound FX" : "Enable sound FX"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#EFFF4F]" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-[10px] hidden sm:inline">{soundEnabled ? "AUDIO ON" : "MUTED"}</span>
          </button>

          {/* Quick Trigger for Day 30 Giant Trophy Animation */}
          <button
            onClick={() => {
              setSelectedDay(30);
              handleCompleteDay(30);
              setShowDay30Victory(true);
            }}
            className="px-3 py-2 border-2 border-amber-400 bg-gradient-to-r from-amber-400/20 via-yellow-400/15 to-amber-500/20 text-amber-300 hover:text-white hover:bg-amber-400/30 font-bold uppercase transition-all rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.35)] flex items-center gap-1.5"
            title="Demonstrate the giant warrior cartoon trophy animation covering the whole calendar"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span className="hidden sm:inline">Test Day 30 Cartoon Trophy</span>
            <span className="sm:hidden">Day 30 Trophy</span>
          </button>

          <Link
            href="/leaderboard"
            className="px-4 py-2 border border-[#3E3E43] bg-[#333336] text-[#A0A5B5] hover:text-[#EFFF4F] hover:border-[#EFFF4F]/40 font-bold uppercase transition-colors rounded-lg shadow-sm"
          >
            View Leaderboard
          </Link>
        </div>
      </div>

      {/* Challenge Metrics Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        {/* Status */}
        <div className="border border-[#3E3E43] bg-[#2E2E32] p-4 rounded-xl space-y-1 shadow-card">
          <div className="text-[10px] text-[#5A5F70] uppercase tracking-wider font-bold">
            SPRINT TRACKER
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-400 flex items-center gap-1.5">
            <span>DAY {selectedDay} / 30</span>
          </div>
          <div className="text-[10px] text-[#A0A5B5] flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>
              {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")} left today
            </span>
          </div>
        </div>

        {/* Completion Progress */}
        <div className="border border-[#3E3E43] bg-[#2E2E32] p-4 rounded-xl space-y-1 shadow-card">
          <div className="text-[10px] text-[#5A5F70] uppercase tracking-wider font-bold">
            GAUNTLET PROGRESS
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#EFFF4F] flex items-center justify-between">
            <span>{progressPercent}%</span>
            <span className="text-xs font-normal text-[#A0A5B5]">
              {completedCount}/{tasks.length} Days
            </span>
          </div>
          <div className="w-full bg-[#18181A] h-1.5 rounded-full overflow-hidden border border-[#3E3E43]">
            <div
              className="bg-[#EFFF4F] h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Reputation Points */}
        <div className="border border-[#3E3E43] bg-[#2E2E32] p-4 rounded-xl space-y-1 shadow-card">
          <div className="text-[10px] text-[#5A5F70] uppercase tracking-wider font-bold">
            REPUTATION POINTS
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 flex items-center gap-1">
            <Zap className="w-5 h-5 fill-current" />
            <span>+{totalPoints} PTS</span>
          </div>
          <div className="text-[10px] text-[#A0A5B5]">
            +{currentTask.pointsReward} PTS on Day {selectedDay}
          </div>
        </div>

        {/* Active Streak */}
        <div className="border border-[#3E3E43] bg-[#2E2E32] p-4 rounded-xl space-y-1 shadow-card">
          <div className="text-[10px] text-[#5A5F70] uppercase tracking-wider font-bold">
            ACTIVE STREAK
          </div>
          <div className="text-xl sm:text-2xl font-black text-orange-400 flex items-center gap-1.5">
            <Flame className="w-5 h-5 fill-orange-400 animate-pulse" />
            <span>{streakCount} DAYS</span>
          </div>
          <div className="text-[10px] text-[#A0A5B5]">MULTIPLIER: 1.25x XP</div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 30-DAY SPRINT CALENDAR WITH INTERACTIVE DATE ANIMATION   */}
      {/* ======================================================== */}
      <ChallengeCalendar
        tasks={tasks}
        selectedDay={selectedDay}
        onSelectDay={(day) => setSelectedDay(day)}
        animatingDay={animatingDay}
        todayDayNumber={12}
        soundEnabled={soundEnabled}
        showDay30Victory={showDay30Victory}
        onToggleDay30Victory={setShowDay30Victory}
      />

      {/* Completion Toast Banner if just completed */}
      {justCelebrated && (
        <div className="p-4 bg-emerald-500/15 border-2 border-emerald-400 rounded-xl text-emerald-300 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[0_0_25px_rgba(16,185,129,0.3)] animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400" />
            </span>
            <div>
              <span className="font-bold text-white uppercase">
                DAY {selectedDay} ACCREDITED & COMPLETED!
              </span>
              <span className="text-[#A0A5B5] ml-2 font-sans text-[11px]">
                Checkmark animation stamped on the calendar. +{currentTask.pointsReward} PTS earned!
              </span>
            </div>
          </div>

          <button
            onClick={() => handleResetDay(selectedDay)}
            className="px-3 py-1 bg-[#202023] hover:bg-[#28282B] text-[#A0A5B5] hover:text-white border border-[#3E3E43] rounded text-[11px] font-bold transition-colors flex items-center gap-1 shrink-0"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Replay Date Animation</span>
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* SELECTED DAY ACTIVE CHALLENGE WORKBENCH                  */}
      {/* ======================================================== */}
      <div className="border border-amber-400/50 bg-gradient-to-br from-[#2D2D31] via-[#262629] to-[#1E1E22] p-6 sm:p-8 rounded-xl shadow-card space-y-6">
        {/* Active Task Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#3E3E43] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2.5 py-0.5 bg-amber-400 text-[#28282B] font-black uppercase text-[10px] rounded flex items-center gap-1">
                <Flame className="w-3 h-3 fill-current" />
                DAY {selectedDay} SPRINT
              </span>
              <span className="text-[#A0A5B5] text-[11px]">• Estimated time: 45 min</span>
              <span className="text-[#5A5F70]">•</span>
              <span className={currentTask.isCompleted ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                {currentTask.isCompleted ? "✔ COMPLETED ON CALENDAR" : "⌛ UNRESOLVED"}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">{currentTask.title}</h2>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs shrink-0">
            {selectedDay === 30 ? (
              <button
                onClick={() => {
                  handleCompleteDay(30);
                  setShowDay30Victory(true);
                }}
                className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-[#18181B] font-black text-xs flex items-center gap-2 rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:scale-105 transition-all"
              >
                <Trophy className="w-4 h-4 fill-current shrink-0 text-[#18181B]" />
                <span>DAY 30 CAPSTONE: LAUNCH GIANT TROPHY CEREMONY 🏆</span>
              </button>
            ) : selectedDay === 15 ? (
              <span className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400/25 via-yellow-400/20 to-amber-500/25 border-2 border-amber-400 text-amber-300 font-bold text-xs flex items-center gap-2 rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.35)]">
                <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                <Gift className="w-4 h-4 text-yellow-300 animate-bounce shrink-0" />
                <span>HALFWAY MILESTONE: +{currentTask.pointsReward} PTS & POM ARCHITECT GIFT 🎁</span>
              </span>
            ) : (
              <span className="px-3.5 py-1.5 bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center gap-1.5 rounded-lg">
                <Sparkles className="w-3.5 h-3.5" />
                <span>BOUNTY: +{currentTask.pointsReward} PTS & 1 STREAK</span>
              </span>
            )}
          </div>
        </div>

        {/* Task Objective, Criteria & Interactive Submission */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 font-mono text-xs">
          {/* Left Column: Objective & Criteria */}
          <div className="lg:col-span-7 space-y-5 font-sans text-sm">
            {/* Objective */}
            <div className="space-y-2">
              <h3 className="font-bold text-white uppercase font-mono text-xs tracking-wider flex items-center gap-2">
                <Code className="w-3.5 h-3.5 text-[#EFFF4F]" />
                <span>CHALLENGE OBJECTIVE:</span>
              </h3>
              <p className="text-[#A0A5B5] leading-relaxed bg-[#202023] p-4 border border-[#3E3E43] rounded-lg">
                Connect your Selenium automation suite to an external Apache POI Excel workbook. Create a dynamic TestNG{" "}
                <code className="text-[#EFFF4F] bg-[#18181B] px-1.5 py-0.5 rounded border border-[#3E3E43] font-mono">
                  @DataProvider
                </code>{" "}
                that iterates through rows, feeds test sets into your login and checkout test methods, and logs results with ThreadLocal isolation.
              </p>
            </div>

            {/* Interactive Acceptance Criteria */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center font-mono text-xs">
                <h3 className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ACCEPTANCE CRITERIA:</span>
                </h3>
                <span className="text-[11px] text-[#EFFF4F] font-bold">
                  {criteriaCompletedCount}/4 COMPLETED
                </span>
              </div>

              <div className="space-y-2 font-mono text-xs">
                {criteriaList.map((item, idx) => {
                  const isDone = !!checkedCriteria[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleCriteria(idx)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isDone
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                          : "border-[#3E3E43] bg-[#202023] text-[#A0A5B5] hover:border-[#5A5F70]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                            isDone
                              ? "bg-emerald-500 border-emerald-500 text-[#28282B]"
                              : "border-[#5A5F70] bg-[#28282B]"
                          }`}
                        >
                          {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={isDone ? "line-through opacity-85" : "text-white"}>
                          {item.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold shrink-0 opacity-80">
                        +{item.points} PTS
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Command Snippet with Copy */}
            {currentTask.commandSnippet && (
              <div className="p-3 bg-[#18181A] border border-[#3E3E43] rounded-lg font-mono text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 overflow-x-auto text-[#EFFF4F]">
                  <Terminal className="w-3.5 h-3.5 shrink-0 text-[#A0A5B5]" />
                  <code>{currentTask.commandSnippet}</code>
                </div>
                <button
                  onClick={() => copyCode(currentTask.commandSnippet || "")}
                  className="px-2 py-1 bg-[#28282B] hover:bg-[#333336] text-[#A0A5B5] hover:text-white border border-[#3E3E43] rounded text-[10px] shrink-0 flex items-center gap-1"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? "COPIED" : "COPY"}</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Submission Form & Interactive Triggers */}
          <div className="lg:col-span-5 border border-[#3E3E43] bg-[#202023] p-5 sm:p-6 rounded-xl space-y-5">
            <div className="font-mono text-xs font-bold text-white uppercase flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[#EFFF4F]" />
                <span>SUBMIT DAILY WORK</span>
              </span>
              <span className="text-[10px] text-amber-400 font-bold">DAY {selectedDay}</span>
            </div>

            {currentTask.isCompleted ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-3 font-mono text-xs rounded-lg">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Day {selectedDay} Marked as Completed!</span>
                </div>
                <p className="text-[11px] text-[#A0A5B5] font-sans">
                  The respective date on the calendar has been verified and stamped. +{currentTask.pointsReward} PTS accredited.
                </p>

                <div className="pt-2 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCompleteDay(selectedDay)}
                      className="w-full py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold rounded flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Re-trigger Date Animation</span>
                    </button>
                    <button
                      onClick={() => handleResetDay(selectedDay)}
                      className="p-2 border border-[#3E3E43] bg-[#28282B] text-[#A0A5B5] hover:text-white rounded"
                      title="Reset to incomplete"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {selectedDay === 30 && (
                    <button
                      onClick={() => setShowDay30Victory(true)}
                      className="w-full py-2.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-[#18181B] font-black rounded flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:brightness-110 transition-all text-xs uppercase"
                    >
                      <Trophy className="w-4 h-4 fill-current text-[#18181B]" />
                      <span>View Giant Warrior Trophy Stage (Whole Calendar)</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="text-[10px] text-[#A0A5B5] uppercase block mb-1">
                    GitHub PR or Repository Link
                  </label>
                  <input
                    type="url"
                    value={submissionUrl}
                    onChange={(e) => setSubmissionUrl(e.target.value)}
                    placeholder="https://github.com/username/sdet-day-12..."
                    className="w-full px-3 py-2 border border-[#3E3E43] bg-[#28282B] text-white placeholder:text-[#5A5F70] focus:outline-none focus:border-[#EFFF4F] rounded text-xs"
                  />
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#EFFF4F] text-[#28282B] font-black uppercase hover:bg-[#EFFF4F]/90 transition-colors flex items-center justify-center gap-2 shadow-lemon-sm rounded"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit & Complete Day {selectedDay} (+{currentTask.pointsReward} PTS)</span>
                </button>

                {/* Quick Simulation Button to trigger the calendar date animation directly */}
                <div className="pt-2 border-t border-[#3E3E43]/60">
                  <button
                    type="button"
                    onClick={() => handleCompleteDay(selectedDay)}
                    className="w-full py-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-bold uppercase rounded flex items-center justify-center gap-1.5 transition-colors text-[11px]"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>⚡ Quick Test: Animate Date Completed</span>
                  </button>
                  <p className="text-[10px] text-[#5A5F70] mt-1 text-center font-sans">
                    Click to test the date stamp, green glow, and points burst animation
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Telemetry & Milestone Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 4 Milestone Badges */}
        <div className="lg:col-span-6 border border-[#3E3E43] bg-[#2E2E32] p-5 sm:p-6 rounded-xl shadow-card space-y-4 font-mono text-xs">
          <div className="border-b border-[#3E3E43] pb-3 flex justify-between items-center">
            <div>
              <div className="text-[10px] text-[#5A5F70] uppercase tracking-widest">
                CREDENTIALS & MILESTONES
              </div>
              <h3 className="text-base font-black text-white uppercase tracking-tight">
                VERIFIABLE GAUNTLET BADGES
              </h3>
            </div>
            <Award className="w-5 h-5 text-amber-400" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 border border-emerald-500/40 bg-emerald-500/10 rounded-lg space-y-1 text-center">
              <div className="text-xl">🛡️</div>
              <div className="font-bold text-white text-xs">Day 07 Milestone</div>
              <div className="text-[10px] text-emerald-400 font-bold">SELENIUM INITIATE</div>
              <div className="text-[9px] text-emerald-300">✔ UNLOCKED</div>
            </div>

            <div className="p-3 border-2 border-amber-400/60 bg-gradient-to-b from-amber-400/15 via-amber-400/5 to-transparent rounded-lg space-y-1 text-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <div className="text-xl flex items-center justify-center gap-1">
                <span>🏆</span>
                <span>🎁</span>
              </div>
              <div className="font-bold text-white text-xs">Day 15 Halfway Gift</div>
              <div className="text-[10px] text-amber-400 font-black">+50 PTS & POM ARCHITECT</div>
              <div className="text-[9px] text-amber-300 font-mono">3 DAYS REMAINING</div>
            </div>

            <div className="p-3 border border-[#3E3E43] bg-[#242427] rounded-lg space-y-1 text-center opacity-70">
              <div className="text-xl">🐳</div>
              <div className="font-bold text-white text-xs">Day 22 Milestone</div>
              <div className="text-[10px] text-[#A0A5B5] font-bold">GRID & DOCKER</div>
              <div className="text-[9px] text-[#5A5F70]">LOCKED</div>
            </div>

            <div className="p-3 border border-[#3E3E43] bg-[#242427] rounded-lg space-y-1 text-center opacity-70">
              <div className="text-xl">🏆</div>
              <div className="font-bold text-white text-xs">Day 30 Capstone</div>
              <div className="text-[10px] text-[#A0A5B5] font-bold">SDET LEAD ARCHITECT</div>
              <div className="text-[9px] text-[#5A5F70]">FINAL AUDIT</div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Community Telemetry Feed */}
        <div className="lg:col-span-6 border border-[#3E3E43] bg-[#2E2E32] p-5 sm:p-6 rounded-xl shadow-card space-y-4 font-mono text-xs">
          <div className="border-b border-[#3E3E43] pb-3 flex justify-between items-center">
            <div>
              <div className="text-[10px] text-[#5A5F70] uppercase tracking-widest">
                COMMUNITY TELEMETRY
              </div>
              <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                <Users className="w-4 h-4 text-[#EFFF4F]" />
                <span>RECENT SPRINT SUBMISSIONS</span>
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 text-[#EFFF4F] font-bold rounded">
              LIVE
            </span>
          </div>

          <div className="divide-y divide-[#3E3E43] space-y-2 text-xs">
            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="font-bold text-white">Vikram Verma</span>
                <span className="text-[#A0A5B5] text-[10px] ml-1.5">passed Day 12 with POI Excel</span>
              </div>
              <span className="text-emerald-400 font-bold">+35 PTS</span>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="font-bold text-white">Priya Nair</span>
                <span className="text-[#A0A5B5] text-[10px] ml-1.5">achieved 14-day streak bonus</span>
              </div>
              <span className="text-orange-400 font-bold">14d 🔥</span>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="font-bold text-white">Rohit Iyer</span>
                <span className="text-[#A0A5B5] text-[10px] ml-1.5">submitted ThreadLocal PR</span>
              </div>
              <span className="text-emerald-400 font-bold">+25 PTS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
