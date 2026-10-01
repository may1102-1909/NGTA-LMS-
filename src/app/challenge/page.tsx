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

    // Update streak and points if completing a day that was not yet completed
    if (!task.isCompleted) {
      setStreakCount((prev) => prev + 1);
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
    const task = tasks.find((t) => t.dayNumber === dayNumber);
    playAudioBlip("click", soundEnabled);
    setTasks((prev) =>
      prev.map((t) => (t.dayNumber === dayNumber ? { ...t, isCompleted: false } : t))
    );
    if (task && task.isCompleted) {
      const reward = task.pointsReward || 35;
      setTotalPoints((prev) => Math.max(0, prev - reward));
      setStreakCount((prev) => Math.max(1, prev - 1));
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 font-sans selection:bg-[#8B5CF6]/30 selection:text-[#F8FAFC]">
      {/* Top Header */}
      <div className="border-b border-[#26213B] pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
        <div className="space-y-2">
          <div className="font-mono text-xs text-[#64748B] uppercase tracking-widest flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#F59E0B]/15 border border-[#F59E0B]/30 text-[#F59E0B] font-bold text-[10px] flex items-center gap-1 rounded">
              <Flame className="w-3 h-3 fill-current" />
              HIGH INTENSITY SDET GAUNTLET
            </span>
            <span>•</span>
            <span className="text-[#94A3B8]">DAY 12 ACTIVE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span>30-DAY SELENIUM AUTOMATION SPRINT</span>
            <Trophy className="w-8 h-8 text-[#F59E0B] shrink-0" />
          </h1>

          <p className="text-sm text-[#94A3B8] max-w-3xl leading-relaxed">
            Curated by Rahul Kamat to build production-grade SDET competencies through daily hands-on implementation challenges, TestNG architecture, and CI/CD pipelines.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs shrink-0">
          {/* Sound FX Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 border border-[#26213B] bg-[#120F1D] text-[#94A3B8] hover:text-[#C084FC] hover:border-[#8B5CF6]/50 transition-colors rounded-lg flex items-center gap-1.5"
            title={soundEnabled ? "Mute sound FX" : "Enable sound FX"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#C084FC]" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-[10px] hidden sm:inline">{soundEnabled ? "AUDIO ON" : "MUTED"}</span>
          </button>

          {/* Quick Trigger for Day 30 Giant Trophy Animation */}
          <button
            onClick={() => {
              setSelectedDay(30);
              handleCompleteDay(30);
              setShowDay30Victory(true);
            }}
            className="px-3 py-2 border-2 border-[#F59E0B] bg-gradient-to-r from-[#F59E0B]/20 via-[#FBBF24]/15 to-[#D97706]/20 text-amber-300 hover:text-white hover:bg-[#F59E0B]/30 font-bold uppercase transition-all rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.35)] flex items-center gap-1.5"
            title="Demonstrate the giant warrior cartoon trophy animation covering the whole calendar"
          >
            <Trophy className="w-3.5 h-3.5 text-[#F59E0B] fill-current" />
            <span className="hidden sm:inline">Test Day 30 Cartoon Trophy</span>
            <span className="sm:hidden">Day 30 Trophy</span>
          </button>

          <Link
            href="/leaderboard"
            className="px-4 py-2 border border-[#26213B] bg-[#120F1D] text-[#94A3B8] hover:text-white hover:border-[#8B5CF6]/50 font-bold uppercase transition-colors rounded-lg shadow-sm"
          >
            View Leaderboard
          </Link>
        </div>
      </div>

      {/* Challenge Metrics Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        {/* Status */}
        <div className="border border-[#26213B] bg-[#120F1D] p-4 rounded-xl space-y-1 shadow-card hover:border-[#8B5CF6]/40 transition-colors">
          <div className="text-[10px] text-[#64748B] uppercase tracking-wider font-bold">
            SPRINT TRACKER
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#F59E0B] flex items-center gap-1.5">
            <span>DAY {selectedDay} / 30</span>
          </div>
          <div className="text-[10px] text-[#94A3B8] flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#F59E0B]" />
            <span>
              {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")} left today
            </span>
          </div>
        </div>

        {/* Completion Progress */}
        <div className="border border-[#26213B] bg-[#120F1D] p-4 rounded-xl space-y-1 shadow-card hover:border-[#8B5CF6]/40 transition-colors">
          <div className="text-[10px] text-[#64748B] uppercase tracking-wider font-bold">
            GAUNTLET PROGRESS
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#C084FC] flex items-center justify-between">
            <span>{progressPercent}%</span>
            <span className="text-xs font-normal text-[#94A3B8]">
              {completedCount}/{tasks.length} Days
            </span>
          </div>
          <div className="w-full bg-[#08070D] h-1.5 rounded-full overflow-hidden border border-[#26213B]">
            <div
              className="bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#00F2FE] h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Reputation Points */}
        <div className="border border-[#26213B] bg-[#120F1D] p-4 rounded-xl space-y-1 shadow-card hover:border-[#8B5CF6]/40 transition-colors">
          <div className="text-[10px] text-[#64748B] uppercase tracking-wider font-bold">
            REPUTATION POINTS
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#00F2FE] flex items-center gap-1">
            <Zap className="w-5 h-5 fill-current" />
            <span>+{totalPoints} PTS</span>
          </div>
          <div className="text-[10px] text-[#94A3B8]">
            +{currentTask.pointsReward} PTS on Day {selectedDay}
          </div>
        </div>

        {/* Active Streak */}
        <div className="border border-[#26213B] bg-[#120F1D] p-4 rounded-xl space-y-1 shadow-card hover:border-[#8B5CF6]/40 transition-colors">
          <div className="text-[10px] text-[#64748B] uppercase tracking-wider font-bold">
            ACTIVE STREAK
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#F59E0B] flex items-center gap-1.5">
            <Flame className="w-5 h-5 fill-[#F59E0B] animate-pulse" />
            <span>{streakCount} DAYS</span>
          </div>
          <div className="text-[10px] text-[#94A3B8]">MULTIPLIER: 1.25x XP</div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 30-DAY SPRINT CALENDAR WITH INTERACTIVE DATE ANIMATION   */}
      {/* ======================================================== */}
      <ChallengeCalendar
        tasks={tasks}
        selectedDay={selectedDay}
        onSelectDay={(day) => setSelectedDay(day)}
        onCompleteDay={handleCompleteDay}
        onResetDay={handleResetDay}
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
              <span className="text-[#94A3B8] ml-2 font-sans text-[11px]">
                Checkmark animation stamped on the calendar. +{currentTask.pointsReward} PTS earned!
              </span>
            </div>
          </div>

          <button
            onClick={() => handleResetDay(selectedDay)}
            className="px-3 py-1 bg-[#0E0C17] hover:bg-[#1A162B] text-[#94A3B8] hover:text-white border border-[#26213B] rounded text-[11px] font-bold transition-colors flex items-center gap-1 shrink-0"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Replay Date Animation</span>
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* SELECTED DAY ACTIVE CHALLENGE WORKBENCH                  */}
      {/* ======================================================== */}
      <div className="border border-[#8B5CF6]/40 bg-gradient-to-br from-[#161326] via-[#120F1D] to-[#0E0C17] p-6 sm:p-8 rounded-xl shadow-card space-y-6">
        {/* Active Task Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#26213B] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2.5 py-0.5 bg-[#F59E0B] text-[#08070D] font-black uppercase text-[10px] rounded flex items-center gap-1">
                <Flame className="w-3 h-3 fill-current" />
                DAY {selectedDay} SPRINT
              </span>
              <span className="text-[#94A3B8] text-[11px]">• Estimated time: 45 min</span>
              <span className="text-[#64748B]">•</span>
              <span className={currentTask.isCompleted ? "text-emerald-400 font-bold" : "text-[#F59E0B] font-bold"}>
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
                className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-[#08070D] font-black text-xs flex items-center gap-2 rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:scale-105 transition-all"
              >
                <Trophy className="w-4 h-4 fill-current shrink-0 text-[#08070D]" />
                <span>DAY 30 CAPSTONE: LAUNCH GIANT TROPHY CEREMONY 🏆</span>
              </button>
            ) : selectedDay === 15 ? (
              <span className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400/25 via-yellow-400/20 to-amber-500/25 border-2 border-amber-400 text-amber-300 font-bold text-xs flex items-center gap-2 rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.35)]">
                <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                <Gift className="w-4 h-4 text-yellow-300 animate-bounce shrink-0" />
                <span>HALFWAY MILESTONE: +{currentTask.pointsReward} PTS & POM ARCHITECT GIFT 🎁</span>
              </span>
            ) : (
              <span className="px-3.5 py-1.5 bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 text-[#C084FC] font-bold text-xs flex items-center gap-1.5 rounded-lg">
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
                <Code className="w-3.5 h-3.5 text-[#C084FC]" />
                <span>CHALLENGE OBJECTIVE:</span>
              </h3>
              <p className="text-[#94A3B8] leading-relaxed bg-[#0E0C17] p-4 border border-[#26213B] rounded-lg">
                Connect your Selenium automation suite to an external Apache POI Excel workbook. Create a dynamic TestNG{" "}
                <code className="text-[#C084FC] bg-[#08070D] px-1.5 py-0.5 rounded border border-[#26213B] font-mono">
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
                <span className="text-[11px] text-[#C084FC] font-bold">
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
                          : "border-[#26213B] bg-[#0E0C17] text-[#94A3B8] hover:border-[#8B5CF6]/50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                            isDone
                              ? "bg-emerald-500 border-emerald-500 text-[#08070D]"
                              : "border-[#64748B] bg-[#08070D]"
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
              <div className="p-3 bg-[#08070D] border border-[#26213B] rounded-lg font-mono text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 overflow-x-auto text-[#00F2FE]">
                  <Terminal className="w-3.5 h-3.5 shrink-0 text-[#94A3B8]" />
                  <code>{currentTask.commandSnippet}</code>
                </div>
                <button
                  onClick={() => copyCode(currentTask.commandSnippet || "")}
                  className="px-2 py-1 bg-[#120F1D] hover:bg-[#1C172E] text-[#94A3B8] hover:text-white border border-[#26213B] rounded text-[10px] shrink-0 flex items-center gap-1 transition-colors"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? "COPIED" : "COPY"}</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Submission Form & Interactive Triggers */}
          <div className="lg:col-span-5 border border-[#26213B] bg-[#0E0C17] p-5 sm:p-6 rounded-xl space-y-5">
            <div className="font-mono text-xs font-bold text-white uppercase flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[#C084FC]" />
                <span>SUBMIT DAILY WORK</span>
              </span>
              <span className="text-[10px] text-[#F59E0B] font-bold">DAY {selectedDay}</span>
            </div>

            {currentTask.isCompleted ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-3 font-mono text-xs rounded-lg">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Day {selectedDay} Marked as Completed!</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] font-sans">
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
                      className="p-2 border border-[#26213B] bg-[#08070D] hover:bg-[#120F1D] text-[#94A3B8] hover:text-white rounded transition-colors"
                      title="Reset to incomplete"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {selectedDay === 30 && (
                    <button
                      onClick={() => setShowDay30Victory(true)}
                      className="w-full py-2.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-[#08070D] font-black rounded flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:brightness-110 transition-all text-xs uppercase"
                    >
                      <Trophy className="w-4 h-4 fill-current text-[#08070D]" />
                      <span>View Giant Warrior Trophy Stage (Whole Calendar)</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="text-[10px] text-[#94A3B8] uppercase block mb-1">
                    GitHub PR or Repository Link
                  </label>
                  <input
                    type="url"
                    value={submissionUrl}
                    onChange={(e) => setSubmissionUrl(e.target.value)}
                    placeholder="https://github.com/username/sdet-day-12..."
                    className="w-full px-3 py-2 border border-[#26213B] bg-[#08070D] text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#8B5CF6] rounded text-xs"
                  />
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#06B6D4] text-white font-black uppercase hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-rune-purple rounded"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit & Complete Day {selectedDay} (+{currentTask.pointsReward} PTS)</span>
                </button>

                {/* Direct 1-Click Mark Done Button */}
                <div className="pt-2 border-t border-[#26213B] space-y-1.5">
                  <button
                    type="button"
                    onClick={() => handleCompleteDay(selectedDay)}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-500/25 via-emerald-400/20 to-emerald-500/25 hover:bg-emerald-500/35 text-emerald-300 border-2 border-emerald-400/60 font-black uppercase rounded flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>✔ Mark Day {selectedDay} as Completed (+{currentTask.pointsReward} PTS)</span>
                  </button>
                  <p className="text-[10px] text-[#94A3B8] text-center font-sans">
                    💡 Or simply click on Day {selectedDay}&apos;s date on the calendar above to mark it done!
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
        <div className="lg:col-span-6 border border-[#26213B] bg-[#120F1D] p-5 sm:p-6 rounded-xl shadow-card space-y-4 font-mono text-xs">
          <div className="border-b border-[#26213B] pb-3 flex justify-between items-center">
            <div>
              <div className="text-[10px] text-[#64748B] uppercase tracking-widest">
                CREDENTIALS & MILESTONES
              </div>
              <h3 className="text-base font-black text-white uppercase tracking-tight">
                VERIFIABLE GAUNTLET BADGES
              </h3>
            </div>
            <Award className="w-5 h-5 text-[#F59E0B]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 border border-emerald-500/40 bg-emerald-500/10 rounded-lg space-y-1 text-center">
              <div className="text-xl">🛡️</div>
              <div className="font-bold text-white text-xs">Day 07 Milestone</div>
              <div className="text-[10px] text-emerald-400 font-bold">SELENIUM INITIATE</div>
              <div className="text-[9px] text-emerald-300">✔ UNLOCKED</div>
            </div>

            <div className="p-3 border-2 border-[#F59E0B]/60 bg-gradient-to-b from-[#F59E0B]/15 via-[#F59E0B]/5 to-transparent rounded-lg space-y-1 text-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <div className="text-xl flex items-center justify-center gap-1">
                <span>🏆</span>
                <span>🎁</span>
              </div>
              <div className="font-bold text-white text-xs">Day 15 Halfway Gift</div>
              <div className="text-[10px] text-[#F59E0B] font-black">+50 PTS & POM ARCHITECT</div>
              <div className="text-[9px] text-amber-300 font-mono">3 DAYS REMAINING</div>
            </div>

            <div className="p-3 border border-[#26213B] bg-[#0E0C17] rounded-lg space-y-1 text-center opacity-70">
              <div className="text-xl">🐳</div>
              <div className="font-bold text-white text-xs">Day 22 Milestone</div>
              <div className="text-[10px] text-[#94A3B8] font-bold">GRID & DOCKER</div>
              <div className="text-[9px] text-[#64748B]">LOCKED</div>
            </div>

            <div className="p-3 border border-[#26213B] bg-[#0E0C17] rounded-lg space-y-1 text-center opacity-70">
              <div className="text-xl">🏆</div>
              <div className="font-bold text-white text-xs">Day 30 Capstone</div>
              <div className="text-[10px] text-[#94A3B8] font-bold">SDET LEAD ARCHITECT</div>
              <div className="text-[9px] text-[#64748B]">FINAL AUDIT</div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Community Telemetry Feed */}
        <div className="lg:col-span-6 border border-[#26213B] bg-[#120F1D] p-5 sm:p-6 rounded-xl shadow-card space-y-4 font-mono text-xs">
          <div className="border-b border-[#26213B] pb-3 flex justify-between items-center">
            <div>
              <div className="text-[10px] text-[#64748B] uppercase tracking-widest">
                COMMUNITY TELEMETRY
              </div>
              <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                <Users className="w-4 h-4 text-[#C084FC]" />
                <span>RECENT SPRINT SUBMISSIONS</span>
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#C084FC] font-bold rounded">
              LIVE
            </span>
          </div>

          <div className="divide-y divide-[#26213B] space-y-2 text-xs">
            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="font-bold text-white">Vikram Verma</span>
                <span className="text-[#94A3B8] text-[10px] ml-1.5">passed Day 12 with POI Excel</span>
              </div>
              <span className="text-emerald-400 font-bold">+35 PTS</span>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="font-bold text-white">Priya Nair</span>
                <span className="text-[#94A3B8] text-[10px] ml-1.5">achieved 14-day streak bonus</span>
              </div>
              <span className="text-[#F59E0B] font-bold">14d 🔥</span>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="font-bold text-white">Rohit Iyer</span>
                <span className="text-[#94A3B8] text-[10px] ml-1.5">submitted ThreadLocal PR</span>
              </div>
              <span className="text-emerald-400 font-bold">+25 PTS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
