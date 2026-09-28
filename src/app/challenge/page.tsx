"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Trophy,
  Flame,
  Calendar,
  CheckCircle2,
  Send,
  ExternalLink,
  Code,
  Sparkles,
  ArrowRight,
  Terminal,
  Play,
  Copy,
  Check,
  RotateCcw,
  Lock,
  Unlock,
  AlertCircle,
  Clock,
  Layers,
  Zap,
  ChevronRight,
  Users,
  Award,
  Volume2,
  VolumeX,
} from "lucide-react";
import { INITIAL_CHALLENGE_TASKS, ChallengeTask } from "@/lib/gamification";
import ByteMascot from "@/components/challenge/ByteMascot";

/* Subtle Web Audio Synthesizer for rich tactile feedback */
function playAudioBlip(type: "click" | "check" | "run" | "success", soundEnabled = true) {
  if (!soundEnabled || typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === "click") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(440, ctx.currentTime);
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
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === "run") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === "success") {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.07);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.3);
        o.start(ctx.currentTime + i * 0.07);
        o.stop(ctx.currentTime + i * 0.07 + 0.3);
      });
    }
  } catch (e) {
    // Ignore audio failures if browser blocks autoplay
  }
}

export default function ChallengePage() {
  const [tasks, setTasks] = useState<ChallengeTask[]>(INITIAL_CHALLENGE_TASKS);
  const [selectedDay, setSelectedDay] = useState<number>(12);
  const [activeCodeTab, setActiveCodeTab] = useState<"dataprovider" | "excel" | "pom" | "terminal">("terminal");
  const [copiedCode, setCopiedCode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Duolingo Mascot Triggers
  const [mascotOpenTrigger, setMascotOpenTrigger] = useState(0);
  const [mascotStreakTrigger, setMascotStreakTrigger] = useState(0);

  // Acceptance criteria checkboxes state
  const [checkedCriteria, setCheckedCriteria] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: false,
    3: false,
  });

  // Simulated Terminal State
  const [terminalRunning, setTerminalRunning] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "ngta-sdet-runner v2.4.0 (Java 21 • TestNG 7.10 • Selenium 4.25)",
    "Ready. Click 'Run Test Suite' to execute Day 12 DataProvider suite.",
  ]);

  // Submission Pipeline State
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [pipelineState, setPipelineState] = useState<"idle" | "running" | "complete">("idle");
  const [pipelineStep, setPipelineStep] = useState(0);

  // Daily Countdown Timer (counts down to midnight)
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

  // Filter Tasks by Phase
  const [activePhase, setActivePhase] = useState<"ALL" | "P1" | "P2" | "P3" | "P4">("ALL");

  const filteredTasks = useMemo(() => {
    if (activePhase === "P1") return tasks.filter((t) => t.dayNumber <= 7);
    if (activePhase === "P2") return tasks.filter((t) => t.dayNumber >= 8 && t.dayNumber <= 15);
    if (activePhase === "P3") return tasks.filter((t) => t.dayNumber >= 16 && t.dayNumber <= 22);
    if (activePhase === "P4") return tasks.filter((t) => t.dayNumber >= 23);
    return tasks;
  }, [tasks, activePhase]);

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
    { title: "Data-driven test iterates through 3 dynamic login permutations", points: 10 },
    { title: "TestNG XML suite executes tests with ThreadLocal<WebDriver> isolation", points: 10 },
  ];

  const criteriaCompletedCount = Object.values(checkedCriteria).filter(Boolean).length;

  // Run Simulated Terminal Test Suite
  const runTerminalTests = () => {
    if (terminalRunning) return;
    setTerminalRunning(true);
    playAudioBlip("run", soundEnabled);
    setTerminalLogs([
      "▶ Initializing Maven TestNG runner...",
      "$ mvn clean test -DsuiteXmlFile=testng-dataprovider.xml",
    ]);

    const steps = [
      "[INFO] Scanning for projects...",
      "[INFO] Building NGTA SDET Day 12 Automation Suite 1.0.0",
      "[INFO] --- maven-surefire-plugin:3.2.5:test ---",
      "[INFO] Running Suite: TestNG Excel DataProvider Permutations",
      "[INFO] [TestNG] Loading workbook 'testdata/sdet_credentials.xlsx'",
      "✔ [THREAD-1] Permutation #1: StandardUser (chrome) -> PASS [1,240ms]",
      "✔ [THREAD-2] Permutation #2: ProblemUser (chrome) -> PASS [1,410ms]",
      "✔ [THREAD-3] Permutation #3: LockedOutUser (chrome) -> PASS [980ms]",
      "[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0",
      "===========================================================",
      "🎉 ALL TESTS PASSED (100% Assertion Success Rate)",
      "ThreadLocal isolation validated: 0 race conditions detected.",
    ];

    steps.forEach((line, i) => {
      setTimeout(() => {
        setTerminalLogs((prev) => [...prev, line]);
        if (i === steps.length - 1) {
          setTerminalRunning(false);
          playAudioBlip("success", soundEnabled);
          // Mark criteria #3 & #4 as checked
          setCheckedCriteria((prev) => ({ ...prev, 2: true, 3: true }));
        }
      }, (i + 1) * 380);
    });
  };

  // Run CI/CD Submission Simulator
  const handleSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionUrl.trim()) return;

    setPipelineState("running");
    setPipelineStep(1);
    playAudioBlip("run", soundEnabled);

    setTimeout(() => setPipelineStep(2), 1100);
    setTimeout(() => setPipelineStep(3), 2200);
    setTimeout(() => setPipelineStep(4), 3300);
    setTimeout(() => {
      setPipelineState("complete");
      playAudioBlip("success", soundEnabled);
      // Mark current task as completed in state
      setTasks((prev) =>
        prev.map((t) =>
          t.dayNumber === selectedDay ? { ...t, isCompleted: true } : t
        )
      );
    }, 4400);
  };

  const copyCodeToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    playAudioBlip("click", soundEnabled);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const codeSnippets = {
    dataprovider: `@DataProvider(name = "excelLoginData", parallel = true)
public Object[][] getLoginData() {
    String filePath = "src/test/resources/testdata/login_cases.xlsx";
    ExcelReader reader = new ExcelReader(filePath);
    return reader.getSheetData("LoginSheet");
}

@Test(dataProvider = "excelLoginData", threadPoolSize = 3)
public void testDynamicAuthentication(String username, String password, String expectedRole) {
    LoginPage loginPage = new LoginPage(getDriver());
    loginPage.loginAs(username, password);
    Assert.assertEquals(loginPage.getCurrentRole(), expectedRole);
}`,
    excel: `public class ExcelReader {
    private Workbook workbook;

    public ExcelReader(String path) {
        try (InputStream is = new FileInputStream(path)) {
            this.workbook = WorkbookFactory.create(is);
        } catch (Exception e) {
            throw new RuntimeException("Failed to load Excel file: " + path, e);
        }
    }

    public Object[][] getSheetData(String sheetName) {
        Sheet sheet = workbook.getSheet(sheetName);
        int rows = sheet.getPhysicalNumberOfRows();
        int cols = sheet.getRow(0).getPhysicalNumberOfCells();
        Object[][] data = new Object[rows - 1][cols];

        for (int i = 1; i < rows; i++) {
            Row row = sheet.getRow(i);
            for (int j = 0; j < cols; j++) {
                data[i - 1][j] = row.getCell(j).toString();
            }
        }
        return data;
    }
}`,
    pom: `<!-- Apache POI for Excel Data-Driven Testing -->
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
    <version>5.2.5</version>
</dependency>

<!-- TestNG Automation Suite Runner -->
<dependency>
    <groupId>org.testng</groupId>
    <artifactId>testng</artifactId>
    <version>7.10.2</version>
    <scope>test</scope>
</dependency>`,
  };

  return (
    <div className="relative min-h-screen bg-[#28282B] text-white font-sans selection:bg-[#EFFF4F] selection:text-[#28282B] pb-20">
      {/* Background Ambient Cyber Glows */}
      <div className="absolute top-0 inset-x-0 h-96 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[radial-gradient(ellipse_at_top,rgba(239,255,79,0.12)_0%,rgba(245,158,11,0.06)_40%,transparent_70%)] blur-3xl" />
        <div className="absolute top-[-50px] right-[10%] w-[350px] h-[250px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_70%)] blur-2xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Top Attention-Seeker Announcement Bar */}
        <div className="rounded-lg border border-[#EFFF4F]/40 bg-gradient-to-r from-[#333336] via-[#2D2D30] to-[#242428] p-3.5 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-lemon-sm font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EFFF4F] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#EFFF4F]" />
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-white uppercase tracking-wider">
                SPRINT 12 IN PROGRESS:
              </span>
              <span className="text-[#EFFF4F] font-bold">
                1.25x XP STREAK MULTIPLIER ACTIVE
              </span>
              <span className="text-[#5A5F70] hidden sm:inline">•</span>
              <span className="text-[#A0A5B5] hidden sm:inline">
                🔥 42 SDET peers coding now
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Byte Mascot & Streak Triggers */}
            <button
              onClick={() => setMascotStreakTrigger((prev) => prev + 1)}
              className="flex items-center gap-1 text-amber-400 font-bold bg-[#202023] px-2.5 py-1 rounded border border-amber-400/40 hover:bg-amber-400/10 transition-colors"
              title="Click to check your streak status with Byte"
            >
              <Flame className="w-3.5 h-3.5 fill-current text-amber-400" />
              <span>7d STREAK</span>
            </button>

            <button
              onClick={() => setMascotOpenTrigger((prev) => prev + 1)}
              className="flex items-center gap-1.5 text-[#EFFF4F] font-bold bg-[#202023] px-2.5 py-1 rounded border border-[#EFFF4F]/40 hover:bg-[#EFFF4F]/10 transition-colors"
              title="Summon Byte the Mascot Coach"
            >
              <span>🦉 BYTE</span>
              <span className="hidden sm:inline text-[10px] text-[#A0A5B5]">COACH</span>
            </button>

            {/* Live Countdown */}
            <div className="flex items-center gap-1.5 text-white font-bold bg-[#202023] px-2.5 sm:px-3 py-1 rounded border border-[#3E3E43]">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-[#A0A5B5] hidden sm:inline">LEFT</span>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 border border-[#3E3E43] bg-[#28282B] text-[#A0A5B5] hover:text-[#EFFF4F] transition-colors rounded"
              title={soundEnabled ? "Mute interactive audio FX" : "Enable interactive audio FX"}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Header Hero Section */}
        <div className="border-b border-[#3E3E43] pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
          <div className="space-y-2">
            <div className="font-mono text-xs text-[#5A5F70] uppercase tracking-widest flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-amber-400/15 border border-amber-400/40 text-amber-400 font-bold text-[10px] flex items-center gap-1">
                <Flame className="w-3 h-3 fill-current" />
                HIGH INTENSITY SDET GAUNTLET
              </span>
              <span>•</span>
              <span className="text-white font-bold">DAY {selectedDay} OF 30</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <span>30-DAY AUTOMATION CHALLENGE</span>
              <Trophy className="w-9 h-9 text-[#EFFF4F] shrink-0 drop-shadow-[0_0_12px_rgba(239,255,79,0.5)]" />
            </h1>

            <p className="text-sm text-[#A0A5B5] max-w-3xl leading-relaxed">
              Engineered by NextGen Testing Academy. Master production-grade Java, Selenium 4, TestNG parallel suites, Docker Grid, and enterprise CI/CD pipelines through hands-on daily code deliveries.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
            <Link
              href="/leaderboard"
              className="px-4 py-2.5 border border-[#EFFF4F]/40 bg-[#333336] text-[#EFFF4F] font-bold uppercase hover:bg-[#EFFF4F] hover:text-[#28282B] transition-all flex items-center gap-2 shadow-lemon-sm"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Leaderboard Standings</span>
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          {/* Card 1: Day Progress */}
          <div className="border border-[#3E3E43] bg-[#333336] p-4.5 space-y-1.5 relative overflow-hidden group hover:border-amber-400/50 transition-colors">
            <div className="text-[10px] text-[#5A5F70] uppercase font-bold flex justify-between">
              <span>CURRENT STATUS</span>
              <span className="text-amber-400 font-mono">PHASE 2</span>
            </div>
            <div className="text-2xl font-black text-amber-400 tabular-nums">
              DAY {String(selectedDay).padStart(2, "0")} / 30
            </div>
            <div className="text-[11px] text-[#A0A5B5]">
              {30 - completedCount} Challenges Remaining
            </div>
            <div className="w-full bg-[#28282B] h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-amber-400 transition-all duration-500"
                style={{ width: `${(selectedDay / 30) * 100}%` }}
              />
            </div>
          </div>

          {/* Card 2: Sprint Completion */}
          <div className="border border-[#3E3E43] bg-[#333336] p-4.5 space-y-1.5 relative overflow-hidden group hover:border-[#EFFF4F]/50 transition-colors">
            <div className="text-[10px] text-[#5A5F70] uppercase font-bold flex justify-between">
              <span>GAUNTLET PROGRESS</span>
              <span className="text-[#EFFF4F] font-bold">{progressPercent}%</span>
            </div>
            <div className="text-2xl font-black text-[#EFFF4F] tabular-nums">
              {completedCount} / 30 DONE
            </div>
            <div className="text-[11px] text-[#A0A5B5]">
              Accreditation at Day 30 Capstone
            </div>
            <div className="w-full bg-[#28282B] h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-[#EFFF4F] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Card 3: Reputation Points */}
          <div className="border border-[#3E3E43] bg-[#333336] p-4.5 space-y-1.5 relative overflow-hidden group hover:border-emerald-400/50 transition-colors">
            <div className="text-[10px] text-[#5A5F70] uppercase font-bold flex justify-between">
              <span>TOTAL REPUTATION</span>
              <span className="text-emerald-400 font-bold">+35 PTS TODAY</span>
            </div>
            <div className="text-2xl font-black text-emerald-400 tabular-nums">
              +455 PTS
            </div>
            <div className="text-[11px] text-[#A0A5B5]">
              Rank: SDET-II • Top 5% Globally
            </div>
            <div className="w-full bg-[#28282B] h-1.5 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-emerald-400 w-3/4" />
            </div>
          </div>

          {/* Card 4: Active Streak with Pulsing Flame */}
          <div className="border border-orange-500/40 bg-gradient-to-br from-[#333336] to-[#25201A] p-4.5 space-y-1.5 relative overflow-hidden group">
            <div className="text-[10px] text-orange-400 uppercase font-bold flex justify-between">
              <span>ACTIVE STREAK</span>
              <span className="animate-pulse">🔥 ACTIVE</span>
            </div>
            <div className="text-2xl font-black text-orange-400 flex items-center gap-2">
              <Flame className="w-6 h-6 fill-orange-400 animate-bounce" />
              <span>7 DAYS</span>
            </div>
            <div className="text-[11px] text-[#A0A5B5]">
              1.25x Multiplier applied to daily XP
            </div>
            <div className="w-full bg-[#28282B] h-1.5 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 w-full" />
            </div>
          </div>
        </div>

        {/* INTERACTIVE 30-DAY MISSION MAP (Phase-Filtered Node Selector) */}
        <div className="border border-[#3E3E43] bg-[#333336] p-5 sm:p-6 shadow-card space-y-5 font-mono">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#3E3E43] pb-4">
            <div>
              <div className="text-[10px] text-[#5A5F70] uppercase tracking-widest">
                INTERACTIVE TIMELINE
              </div>
              <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#EFFF4F]" />
                <span>30-DAY SDET MISSION ROADMAP</span>
              </h2>
            </div>

            {/* Phase Selector Pills */}
            <div className="flex flex-wrap gap-1 text-[11px]">
              <button
                onClick={() => setActivePhase("ALL")}
                className={`px-3 py-1 uppercase font-bold transition-colors ${
                  activePhase === "ALL"
                    ? "bg-[#EFFF4F] text-[#28282B]"
                    : "bg-[#28282B] text-[#A0A5B5] hover:bg-[#3E3E43]"
                }`}
              >
                All 30 Days
              </button>
              <button
                onClick={() => setActivePhase("P1")}
                className={`px-3 py-1 uppercase font-bold transition-colors ${
                  activePhase === "P1"
                    ? "bg-[#EFFF4F] text-[#28282B]"
                    : "bg-[#28282B] text-[#A0A5B5] hover:bg-[#3E3E43]"
                }`}
              >
                Phase 1 (1-7)
              </button>
              <button
                onClick={() => setActivePhase("P2")}
                className={`px-3 py-1 uppercase font-bold transition-colors ${
                  activePhase === "P2"
                    ? "bg-[#EFFF4F] text-[#28282B]"
                    : "bg-[#28282B] text-[#A0A5B5] hover:bg-[#3E3E43]"
                }`}
              >
                Phase 2 (8-15)
              </button>
              <button
                onClick={() => setActivePhase("P3")}
                className={`px-3 py-1 uppercase font-bold transition-colors ${
                  activePhase === "P3"
                    ? "bg-[#EFFF4F] text-[#28282B]"
                    : "bg-[#28282B] text-[#A0A5B5] hover:bg-[#3E3E43]"
                }`}
              >
                Phase 3 (16-22)
              </button>
              <button
                onClick={() => setActivePhase("P4")}
                className={`px-3 py-1 uppercase font-bold transition-colors ${
                  activePhase === "P4"
                    ? "bg-[#EFFF4F] text-[#28282B]"
                    : "bg-[#28282B] text-[#A0A5B5] hover:bg-[#3E3E43]"
                }`}
              >
                Phase 4 (23-30)
              </button>
            </div>
          </div>

          {/* Clickable Mission Grid Nodes */}
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2.5 text-center text-xs">
            {filteredTasks.map((t) => {
              const isSelected = t.dayNumber === selectedDay;
              const isToday = t.dayNumber === 12;
              const isBoss = [7, 15, 22, 30].includes(t.dayNumber);

              let nodeClass = "border border-[#3E3E43] bg-[#28282B] text-[#A0A5B5] hover:border-white";
              if (t.isCompleted) {
                nodeClass = "border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20";
              }
              if (isToday) {
                nodeClass = "border-2 border-[#EFFF4F] bg-[#EFFF4F]/15 text-[#EFFF4F] shadow-lemon-sm font-bold scale-105 animate-pulse";
              }
              if (isSelected) {
                nodeClass = "border-2 border-[#EFFF4F] bg-[#EFFF4F] text-[#28282B] font-black scale-110 shadow-lemon-md z-10";
              }

              return (
                <button
                  key={t.dayNumber}
                  onClick={() => {
                    setSelectedDay(t.dayNumber);
                    playAudioBlip("click", soundEnabled);
                  }}
                  className={`p-2 rounded flex flex-col items-center justify-center gap-1 transition-all ${nodeClass}`}
                >
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-mono">D{t.dayNumber}</span>
                    {isBoss && <Trophy className="w-2.5 h-2.5 text-amber-400" />}
                  </div>
                  {t.isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : isToday ? (
                    <Zap className="w-3.5 h-3.5 text-[#EFFF4F] fill-current" />
                  ) : (
                    <span className="text-[9px] opacity-60">+{t.pointsReward}P</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Selected Day Info Preview Bar */}
          <div className="bg-[#202023] p-3 border border-[#3E3E43] rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-400/20 text-amber-300 font-bold text-[10px]">
                SELECTED: DAY {selectedDay}
              </span>
              <span className="text-white font-bold">{currentTask.title}</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[#A0A5B5]">
              <span>REWARD: +{currentTask.pointsReward} PTS</span>
              <span>•</span>
              <span className={currentTask.isCompleted ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                {currentTask.isCompleted ? "COMPLETED ✔" : "UNRESOLVED ⌛"}
              </span>
            </div>
          </div>
        </div>

        {/* TODAY'S ACTIVE CHALLENGE: Main Interactive Playground Card */}
        <div className="border-2 border-amber-400/60 bg-gradient-to-br from-[#29292D] via-[#242427] to-[#1C1C1F] p-6 sm:p-8 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-7 relative overflow-hidden">
          {/* Top Banner */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#3E3E43] pb-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-0.5 bg-amber-400 text-[#28282B] font-black uppercase text-[10px] rounded-sm flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-current" />
                  CURRENT ACTIVE MISSION: DAY {selectedDay}
                </span>
                <span className="text-[#A0A5B5] text-[11px]">
                  • Estimated Completion: 45 Minutes
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {currentTask.title}
              </h2>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs shrink-0">
              <span className="px-3.5 py-1.5 bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center gap-1.5 rounded">
                <Sparkles className="w-3.5 h-3.5" />
                <span>BOUNTY: +{currentTask.pointsReward} PTS & 1 STREAK</span>
              </span>
            </div>
          </div>

          {/* Interactive Two-Column Playground */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
            {/* Left Column: Objective, Criteria Checklist, & Solution Guide */}
            <div className="lg:col-span-6 space-y-6">
              {/* Mission Objective */}
              <div className="space-y-2">
                <h3 className="font-bold text-white uppercase font-mono text-xs tracking-wider flex items-center gap-2">
                  <Code className="w-3.5 h-3.5 text-[#EFFF4F]" />
                  <span>MISSION OBJECTIVE:</span>
                </h3>
                <p className="text-sm text-[#A0A5B5] leading-relaxed font-sans bg-[#202023] p-4 border border-[#3E3E43] rounded-lg">
                  Connect your Selenium test suite to an external Apache POI Excel workbook. Author a dynamic TestNG <code className="text-[#EFFF4F] font-mono bg-[#18181A] px-1.5 py-0.5 rounded border border-[#3E3E43]">@DataProvider</code> that iterates through rows, feeds test parameters into login verification tests, and logs execution with ThreadLocal isolation.
                </p>
              </div>

              {/* Interactive Acceptance Criteria Checklist */}
              <div className="space-y-3">
                <div className="flex justify-between items-center font-mono text-xs">
                  <h3 className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ACCEPTANCE CRITERIA:</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMascotOpenTrigger((prev) => prev + 1)}
                      className="text-[10px] text-[#A0A5B5] hover:text-[#EFFF4F] transition-colors flex items-center gap-1"
                      title="Byte's coaching notes"
                    >
                      <span>🦉 Byte is evaluating</span>
                    </button>
                    <span className="text-[11px] text-[#EFFF4F] font-bold">
                      {criteriaCompletedCount}/4 COMPLETED
                    </span>
                  </div>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  {criteriaList.map((item, idx) => {
                    const isDone = !!checkedCriteria[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleCriteria(idx)}
                        className={`p-3 rounded border transition-all cursor-pointer flex items-center justify-between gap-3 ${
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
            </div>

            {/* Right Column: Interactive Code & CLI Simulator */}
            <div className="lg:col-span-6 space-y-4">
              <div className="border border-[#3E3E43] bg-[#1E1E21] rounded-lg overflow-hidden shadow-inner font-mono text-xs">
                {/* Tabs & Controls */}
                <div className="flex flex-wrap items-center justify-between border-b border-[#3E3E43] bg-[#18181A] px-3 py-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveCodeTab("terminal")}
                      className={`px-3 py-1 rounded text-xs font-bold uppercase transition-colors flex items-center gap-1.5 ${
                        activeCodeTab === "terminal"
                          ? "bg-[#EFFF4F] text-[#28282B]"
                          : "text-[#A0A5B5] hover:text-white"
                      }`}
                    >
                      <Terminal className="w-3 h-3" />
                      <span>CLI Simulator</span>
                    </button>
                    <button
                      onClick={() => setActiveCodeTab("dataprovider")}
                      className={`px-3 py-1 rounded text-xs font-bold uppercase transition-colors ${
                        activeCodeTab === "dataprovider"
                          ? "bg-[#EFFF4F] text-[#28282B]"
                          : "text-[#A0A5B5] hover:text-white"
                      }`}
                    >
                      DataProvider.java
                    </button>
                    <button
                      onClick={() => setActiveCodeTab("excel")}
                      className={`px-3 py-1 rounded text-xs font-bold uppercase transition-colors ${
                        activeCodeTab === "excel"
                          ? "bg-[#EFFF4F] text-[#28282B]"
                          : "text-[#A0A5B5] hover:text-white"
                      }`}
                    >
                      ExcelReader.java
                    </button>
                    <button
                      onClick={() => setActiveCodeTab("pom")}
                      className={`px-3 py-1 rounded text-xs font-bold uppercase transition-colors ${
                        activeCodeTab === "pom"
                          ? "bg-[#EFFF4F] text-[#28282B]"
                          : "text-[#A0A5B5] hover:text-white"
                      }`}
                    >
                      pom.xml
                    </button>
                  </div>

                  {activeCodeTab !== "terminal" && (
                    <button
                      onClick={() => copyCodeToClipboard(codeSnippets[activeCodeTab])}
                      className="text-[10px] text-[#A0A5B5] hover:text-[#EFFF4F] flex items-center gap-1 transition-colors px-2 py-1 rounded border border-[#3E3E43]"
                    >
                      {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode ? "COPIED" : "COPY CODE"}</span>
                    </button>
                  )}
                </div>

                {/* Tab 1: Interactive Terminal CLI */}
                {activeCodeTab === "terminal" ? (
                  <div className="p-4 space-y-3 bg-[#151518]">
                    <div className="flex items-center justify-between pb-2 border-b border-[#28282B]">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                        <span className="text-[10px] text-[#5A5F70] ml-2">bash — ngta-test-suite</span>
                      </div>

                      <button
                        onClick={runTerminalTests}
                        disabled={terminalRunning}
                        className={`px-3 py-1 rounded text-[11px] font-bold uppercase transition-all flex items-center gap-1.5 ${
                          terminalRunning
                            ? "bg-amber-400 text-[#28282B] animate-pulse"
                            : "bg-emerald-500 hover:bg-emerald-400 text-[#28282B] shadow-sm"
                        }`}
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>{terminalRunning ? "Executing Suite..." : "Run Test Suite"}</span>
                      </button>
                    </div>

                    <div className="font-mono text-xs text-slate-300 space-y-1 h-60 overflow-y-auto pr-1">
                      {terminalLogs.map((log, idx) => (
                        <div
                          key={idx}
                          className={
                            log.includes("PASSED") || log.includes("✔")
                              ? "text-emerald-400 font-bold"
                              : log.startsWith("$")
                              ? "text-[#EFFF4F] font-bold"
                              : log.includes("Error")
                              ? "text-red-400"
                              : "text-[#A0A5B5]"
                          }
                        >
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Code Preview Tabs */
                  <div className="p-4 bg-[#141416] overflow-x-auto h-72">
                    <pre className="font-mono text-xs text-[#EFFF4F] leading-relaxed">
                      <code>{codeSnippets[activeCodeTab]}</code>
                    </pre>
                  </div>
                )}
              </div>

              {/* GitHub Submission Pipeline Form */}
              <div className="border border-[#3E3E43] bg-[#202023] p-5 rounded-lg space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white uppercase flex items-center gap-2">
                    <Send className="w-3.5 h-3.5 text-[#EFFF4F]" />
                    <span>DELIVER DAY {selectedDay} CODE FOR REVIEW</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">
                    +35 XP BOUNTY
                  </span>
                </div>

                <form onSubmit={handleSubmission} className="space-y-3">
                  <div>
                    <label className="text-[10px] text-[#A0A5B5] uppercase block mb-1">
                      GitHub PR or Repository Branch URL
                    </label>
                    <input
                      type="url"
                      value={submissionUrl}
                      onChange={(e) => setSubmissionUrl(e.target.value)}
                      placeholder="https://github.com/may1102-1909/sdet-automation/pull/12"
                      required
                      className="w-full px-3 py-2 border border-[#3E3E43] bg-[#28282B] text-white placeholder:text-[#5A5F70] focus:outline-none focus:border-[#EFFF4F] text-xs rounded"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={pipelineState === "running"}
                    className="w-full py-2.5 bg-[#EFFF4F] text-[#28282B] font-black uppercase hover:bg-[#EFFF4F]/90 transition-colors flex items-center justify-center gap-2 shadow-lemon-sm rounded"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {pipelineState === "running" ? "Running Automated CI Checks..." : "Submit For Automated CI Review (+35 XP)"}
                    </span>
                  </button>
                </form>

                {/* Animated Pipeline Simulation */}
                {pipelineState === "running" && (
                  <div className="p-3.5 bg-[#18181B] border border-amber-400/40 rounded space-y-2 mt-2 font-mono text-xs">
                    <div className="text-amber-400 font-bold flex items-center gap-2">
                      <span className="animate-spin">⚙</span>
                      <span>CI Pipeline In Progress: Validating Submission</span>
                    </div>
                    <div className="space-y-1 text-[11px] text-[#A0A5B5]">
                      <div className={pipelineStep >= 1 ? "text-emerald-400" : ""}>
                        {pipelineStep >= 1 ? "✔" : "○"} [1/4] Cloning PR branch & inspecting pom.xml...
                      </div>
                      <div className={pipelineStep >= 2 ? "text-emerald-400" : ""}>
                        {pipelineStep >= 2 ? "✔" : "○"} [2/4] Verifying Apache POI ExcelReader class...
                      </div>
                      <div className={pipelineStep >= 3 ? "text-emerald-400" : ""}>
                        {pipelineStep >= 3 ? "✔" : "○"} [3/4] Running 3 parallel DataProvider test iterations...
                      </div>
                      <div className={pipelineStep >= 4 ? "text-emerald-400" : ""}>
                        {pipelineStep >= 4 ? "✔" : "○"} [4/4] Validating ThreadLocal session isolation...
                      </div>
                    </div>
                  </div>
                )}

                {/* Submission Success Toast */}
                {pipelineState === "complete" && (
                  <div className="p-4 bg-emerald-500/15 border-2 border-emerald-500/50 rounded text-emerald-300 space-y-2 font-mono text-xs animate-fadeIn">
                    <div className="flex items-center gap-2 font-black text-sm text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>MISSION ACCREDITED & PASSED!</span>
                    </div>
                    <p className="text-[11px] text-[#A0A5B5] font-sans">
                      All 4 automated criteria validated. <strong>+35 XP awarded</strong> and your daily streak has extended to <strong>8 days</strong>!
                    </p>
                    <div className="pt-1 flex gap-3 text-[10px]">
                      <span className="text-[#EFFF4F] font-bold">XP MULTIPLIER: 1.25x</span>
                      <span>•</span>
                      <button
                        onClick={() => setPipelineState("idle")}
                        className="underline text-white font-bold"
                      >
                        Submit another commit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Community Gauntlet Peers & Verifiable Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 4 Milestone Badges */}
          <div className="lg:col-span-6 border border-[#3E3E43] bg-[#333336] p-5 sm:p-6 shadow-card space-y-4 font-mono text-xs">
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
              {/* Badge 1 */}
              <div className="p-3 border border-emerald-500/40 bg-emerald-500/10 rounded space-y-1 text-center">
                <div className="text-xl">🛡️</div>
                <div className="font-bold text-white text-xs">Day 07 Milestone</div>
                <div className="text-[10px] text-emerald-400 font-bold">SELENIUM INITIATE</div>
                <div className="text-[9px] text-emerald-300">✔ UNLOCKED</div>
              </div>

              {/* Badge 2 */}
              <div className="p-3 border border-amber-400/40 bg-amber-400/10 rounded space-y-1 text-center animate-pulse">
                <div className="text-xl">⚡</div>
                <div className="font-bold text-white text-xs">Day 15 Milestone</div>
                <div className="text-[10px] text-amber-400 font-bold">POM ARCHITECT</div>
                <div className="text-[9px] text-amber-300">3 DAYS REMAINING</div>
              </div>

              {/* Badge 3 */}
              <div className="p-3 border border-[#3E3E43] bg-[#28282B] rounded space-y-1 text-center opacity-70">
                <div className="text-xl">🐳</div>
                <div className="font-bold text-white text-xs">Day 22 Milestone</div>
                <div className="text-[10px] text-[#A0A5B5] font-bold">GRID & DOCKER</div>
                <div className="text-[9px] text-[#5A5F70]">LOCKED</div>
              </div>

              {/* Badge 4 */}
              <div className="p-3 border border-[#3E3E43] bg-[#28282B] rounded space-y-1 text-center opacity-70">
                <div className="text-xl">🏆</div>
                <div className="font-bold text-white text-xs">Day 30 Capstone</div>
                <div className="text-[10px] text-[#A0A5B5] font-bold">SDET LEAD ARCHITECT</div>
                <div className="text-[9px] text-[#5A5F70]">FINAL AUDIT</div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Community Sprint Feed */}
          <div className="lg:col-span-6 border border-[#3E3E43] bg-[#333336] p-5 sm:p-6 shadow-card space-y-4 font-mono text-xs">
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
              <span className="text-[10px] px-2 py-0.5 bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 text-[#EFFF4F] font-bold">
                LIVE
              </span>
            </div>

            <div className="divide-y divide-[#3E3E43] space-y-2 text-xs">
              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#EFFF4F]">
                    <Image src="/avatars-3d/podium-1st.jpg" alt="Vikram" fill className="object-cover" />
                  </div>
                  <div>
                    <span className="font-bold text-white">Vikram Verma</span>
                    <span className="text-[#A0A5B5] text-[10px] ml-1.5">passed Day 12 with POI Excel</span>
                  </div>
                </div>
                <span className="text-emerald-400 font-bold">+35 PTS</span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-7 h-7 rounded-full overflow-hidden border border-slate-400">
                    <Image src="/avatars-3d/learner-3.jpg" alt="Priya" fill className="object-cover" />
                  </div>
                  <div>
                    <span className="font-bold text-white">Priya Nair</span>
                    <span className="text-[#A0A5B5] text-[10px] ml-1.5">achieved 14-day streak bonus</span>
                  </div>
                </div>
                <span className="text-orange-400 font-bold">14d 🔥</span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-7 h-7 rounded-full overflow-hidden border border-amber-500">
                    <Image src="/avatars-3d/learner-4.jpg" alt="Rohit" fill className="object-cover" />
                  </div>
                  <div>
                    <span className="font-bold text-white">Rohit Iyer</span>
                    <span className="text-[#A0A5B5] text-[10px] ml-1.5">submitted ThreadLocal PR</span>
                  </div>
                </div>
                <span className="text-emerald-400 font-bold">+25 PTS</span>
              </div>
            </div>
          </div>
        </div>

        {/* DUOLINGO-STYLE BYTE MASCOT COACH & POPUPS */}
        <ByteMascot
          currentDay={selectedDay}
          completedCriteriaCount={criteriaCompletedCount}
          totalCriteriaCount={criteriaList.length}
          terminalRunning={terminalRunning}
          pipelineState={pipelineState}
          onTriggerRunTests={runTerminalTests}
          soundEnabled={soundEnabled}
          externalOpenTrigger={mascotOpenTrigger}
          externalStreakTrigger={mascotStreakTrigger}
        />
      </div>
    </div>
  );
}
