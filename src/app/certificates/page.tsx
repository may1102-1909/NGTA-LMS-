"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Award,
  ShieldCheck,
  Download,
  Share2,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Printer,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  User,
  ScrollText,
  Flame,
  Edit3,
  Lock,
  Unlock,
} from "lucide-react";
import { INITIAL_CREDENTIALS } from "@/lib/gamification";
import CredentialCard from "@/components/gamification/CredentialCard";

/* Web Audio Synthesizer for 1600s Parchment Unfurl & Molten Wax Seal Stamp */
function playAntiqueSound(type: "stamp" | "unfurl" | "click" | "unlock" | "ribbon") {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === "ribbon") {
      // Snapping velvet thread + metallic resonance
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(580, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.16, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } else if (type === "stamp") {
      // 1. Deep low-frequency molten wax press thud (140Hz -> 42Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(42, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);

      // 2. High harmonic chime of royal gold embossing (880Hz -> 1760Hz)
      const chime = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chime.type = "triangle";
      chime.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chime.frequency.setValueAtTime(880, ctx.currentTime + 0.04);
      chime.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.12);
      chimeGain.gain.setValueAtTime(0.08, ctx.currentTime + 0.04);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      chime.start(ctx.currentTime + 0.04);
      chime.stop(ctx.currentTime + 0.45);
    } else if (type === "unlock") {
      // Triumphant chord when breaking seal and unfurling
      [349.23, 440, 523.25, 698.46].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.07);
        gain.gain.setValueAtTime(0.09, ctx.currentTime + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.5);
        osc.start(ctx.currentTime + i * 0.07);
        osc.stop(ctx.currentTime + i * 0.07 + 0.5);
      });
    } else if (type === "unfurl") {
      // Wood roller and parchment paper slide oscillations
      [196, 261.63, 329.63, 392, 523.25].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.connect(gain);
        gain.connect(ctx.destination);
        const startTime = ctx.currentTime + i * 0.08;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.05, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } else if (type === "click") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    }
  } catch {
    // Autoplay fallback
  }
}

/* 3D Turned Wooden Roller Bar for Unrolling Animation */
function WoodenRollerBar({
  position,
  isMovingVertical,
}: {
  position: "top" | "bottom";
  isMovingVertical?: boolean;
}) {
  const isTop = position === "top";
  return (
    <div
      className={`absolute left-0 right-0 h-6 sm:h-9 md:h-11 z-30 pointer-events-none ${
        isMovingVertical
          ? "animate-roller-vertical"
          : isTop
          ? "top-0 shadow-[0_12px_24px_rgba(0,0,0,0.85)]"
          : "bottom-0 shadow-[0_-12px_24px_rgba(0,0,0,0.85)]"
      }`}
    >
      {/* 3D Cylindrical Wooden Dowel */}
      <div
        className={`w-full h-full relative ${
          isTop
            ? "bg-gradient-to-b from-[#251207] via-[#5A3116] via-[#7D4620] via-[#48240F] to-[#1A0B04] border-b border-[#B45309]/60 shadow-[0_12px_24px_rgba(0,0,0,0.85)]"
            : "bg-gradient-to-t from-[#251207] via-[#5A3116] via-[#7D4620] via-[#48240F] to-[#1A0B04] border-t border-[#B45309]/60 shadow-[0_-12px_24px_rgba(0,0,0,0.85)]"
        }`}
      >
        {/* Longitudinal Lacquer Sheen Strip */}
        <div
          className={`absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FDE68A]/40 to-transparent pointer-events-none ${
            isTop ? "top-[25%]" : "bottom-[25%]"
          }`}
        />

        {/* Left Turned Wooden Knob / Brass Finial */}
        <div className="absolute left-[-12px] sm:left-[-20px] top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-full bg-gradient-to-br from-[#7D4620] via-[#48240F] to-[#1A0B04] border-2 border-amber-500/80 shadow-[0_4px_16px_rgba(0,0,0,0.9)] flex items-center justify-center">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-800 shadow-inner border border-amber-300/50" />
        </div>

        {/* Right Turned Wooden Knob / Brass Finial */}
        <div className="absolute right-[-12px] sm:right-[-20px] top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-full bg-gradient-to-bl from-[#7D4620] via-[#48240F] to-[#1A0B04] border-2 border-amber-500/80 shadow-[0_4px_16px_rgba(0,0,0,0.9)] flex items-center justify-center">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-bl from-amber-300 via-amber-500 to-amber-800 shadow-inner border border-amber-300/50" />
        </div>
      </div>
    </div>
  );
}

interface CourseCertificateConfig {
  id: string;
  courseTitle: string;
  latinTitle: string;
  subHeader: string;
  description: string;
  serialNumber: string;
  sha256Hash: string;
  conferredDate: string;
  grade: string;
  competencies: string[];
  defaultCompleted: boolean;
  progressPercent: number;
  progressLabel: string;
  courseLink: string;
}

const CERTIFICATE_TRACKS: Record<string, CourseCertificateConfig> = {
  "gauntlet-30d": {
    id: "gauntlet-30d",
    courseTitle: "30-DAY SDET AUTOMATION GAUNTLET & PRODUCTION ARCHITECTURE",
    latinTitle: "Magnum Opus in Architectura Automationis & Probationis Systematis",
    subHeader: "CAPSTONE TEST ARCHITECT ACCREDITATION",
    description:
      "Having endured with steadfast craftsmanship and unwavering discipline the complete thirty-day gauntlet of hands-on software engineering trials, passing every inspection and proving mastery in enterprise Page Object Model design, ThreadLocal driver concurrency, distributed Docker Grid clusters, and CI/CD quality gates.",
    serialNumber: "NGTA-SCROLL-2026-GAUNTLET-030",
    sha256Hash: "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    conferredDate: "October 01, 2026",
    grade: "SUMMA CUM LAUDE (SCORE: 100% • 30/30 DAYS ACCREDITED)",
    defaultCompleted: false, // Incomplete by default (Day 12 active)
    progressPercent: 37,
    progressLabel: "11 / 30 Days (37% Completed)",
    courseLink: "/challenge",
    competencies: [
      "I. Java Architecture & OOP Framework Design",
      "II. Selenium 4 WebDriver Engine & Synchronizers",
      "III. TestNG & ThreadLocal Driver Isolation",
      "IV. Page Object Model & Resilient Dynamic Locators",
      "V. Distributed Docker Grid & Parallel Clustered Runs",
      "VI. CI/CD Matrix Execution via GitHub Actions",
      "VII. ExtentReports Diagnostics & Failure Telemetry",
      "VIII. Production Regression & Smoke Gate Pipeline",
    ],
  },
  "selenium-java-ai": {
    id: "selenium-java-ai",
    courseTitle: "SELENIUM JAVA + AI: COMPLETE AUTOMATION TESTING MASTERCLASS",
    latinTitle: "Magisterium in Probationibus Selenium, Lingua Java & Ingenio Artificiali",
    subHeader: "CORE ENTERPRISE SDET CERTIFICATION",
    description:
      "Having completed the foundational and advanced syllabus in automated browser interactions, test harness design, complex dynamic XPath hierarchies, Apache POI data providers, and next-generation AI-assisted self-healing locator strategies.",
    serialNumber: "NGTA-SCROLL-2026-SELENIUM-8910",
    sha256Hash: "e4d909c290d0fb1ca068ffaddf22cbd0add8291077284addd200126d90698124",
    conferredDate: "March 17, 2026",
    grade: "FIRST CLASS DISTINCTION (SCORE: 100%)",
    defaultCompleted: true, // Completed course
    progressPercent: 100,
    progressLabel: "100% Completed (All 14 Modules Cleared)",
    courseLink: "/courses/selenium-java-ai",
    competencies: [
      "I. Core Java OOP, Streams & Collections Engine",
      "II. Selenium 4 Locators & Multi-Window Contexts",
      "III. Dynamic XPath Axes & Shadow DOM Navigation",
      "IV. TestNG Test Suites & Parallel Workers",
      "V. Apache POI Excel Data-Driven Feeds",
      "VI. AI-Assisted Self-Healing Element Locators",
      "VII. Maven Build Lifecycle & Surefire Reports",
      "VIII. Jenkins Continuous Testing Orchestration",
    ],
  },
  "rest-assured-api": {
    id: "rest-assured-api",
    courseTitle: "REST-ASSURED API & PERFORMANCE TEST ENGINEERING TRACK",
    latinTitle: "Peritia in Automata Verificatione Applicationum Interfacierum",
    subHeader: "BACKEND SERVICES QUALITY SPECIALIST",
    description:
      "Having demonstrated sovereign proficiency in architecting automated backend microservice validation harnesses, parsing complex JSON/XML schemas, managing OAuth2 authentication handshakes, and conducting high-concurrency performance SLA benchmarking.",
    serialNumber: "NGTA-SCROLL-2026-API-4420",
    sha256Hash: "c18f03b41aa892ef0612bb14781290bb0a77284addd200126d90699940129bc3",
    conferredDate: "January 24, 2026",
    grade: "HIGH HONORS (SCORE: 98%)",
    defaultCompleted: false, // Incomplete by default
    progressPercent: 65,
    progressLabel: "8 / 12 Modules (65% Completed)",
    courseLink: "/courses/api-automation",
    competencies: [
      "I. HTTP Protocol Specification & Status Verifications",
      "II. RestAssured Fluent Given/When/Then DSL",
      "III. Jackson POJO Serialization & Deserialization",
      "IV. JSON Schema Validation & Contract Integrity",
      "V. OAuth 2.0 & JWT Security Token Handshakes",
      "VI. WireMock Service Virtualization & Stubs",
      "VII. Concurrency Testing & JMeter Load Benchmarks",
      "VIII. Newman & Postman CLI Automated Regression",
    ],
  },
};

export default function CertificatesPage() {
  // Recipient User Details
  const [recipientName, setRecipientName] = useState("Tanmay Sharma");
  const [studentId] = useState("#NGTA-SDET-8910");
  const [isEditingName, setIsEditingName] = useState(false);

  // Selected Course Track
  const [selectedTrackId, setSelectedTrackId] = useState<string>("gauntlet-30d");
  const activeCourse = CERTIFICATE_TRACKS[selectedTrackId] || CERTIFICATE_TRACKS["gauntlet-30d"];

  // Course Completion Access Control State
  // Requirement: User can ONLY access the certificate once the respective course is completed.
  const [courseCompletionMap, setCourseCompletionMap] = useState<Record<string, boolean>>({
    "gauntlet-30d": false, // Incomplete by default (11/30 days completed in challenge)
    "selenium-java-ai": true, // Completed course
    "rest-assured-api": false, // Incomplete
  });

  const isCourseCompleted = !!courseCompletionMap[selectedTrackId];

  // Roll Opening Cinematic Animation Phase:
  // "idle" | "sealed" | "snapping" | "unfurling" | "revealing" | "complete"
  const [unrollPhase, setUnrollPhase] = useState<
    "idle" | "sealed" | "snapping" | "unfurling" | "revealing" | "complete"
  >("complete");

  const [sealClicked, setSealClicked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "CERTIFICATE" | "BADGE">("ALL");

  // Trigger Full 1600s Roll Opening Cinematic Sequence
  const triggerRollOpening = () => {
    // Stage 1: Sealed cylindrical roll resting in spotlight
    setUnrollPhase("sealed");

    // Stage 2: Velvet ribbon snaps and golden wax seal breaks with fanfare
    const t1 = setTimeout(() => {
      setUnrollPhase("snapping");
      playAntiqueSound("ribbon");
      playAntiqueSound("unlock");
    }, 450);

    // Stage 3: Wooden rollers separate and parchment unrolls vertically
    const t2 = setTimeout(() => {
      setUnrollPhase("unfurling");
      playAntiqueSound("unfurl");
    }, 950);

    // Stage 4: Parchment reaches full height, calligraphy ink emerges & wax seal stamps down
    const t3 = setTimeout(() => {
      setUnrollPhase("revealing");
      playAntiqueSound("stamp");
    }, 2350);

    // Stage 5: Settle into complete, interactive state
    const t4 = setTimeout(() => {
      setUnrollPhase("complete");
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  };

  // Toggle completion simulation
  const handleToggleCourseCompletion = () => {
    const newState = !isCourseCompleted;
    setCourseCompletionMap((prev) => ({
      ...prev,
      [selectedTrackId]: newState,
    }));
    if (newState) {
      triggerRollOpening();
    } else {
      setUnrollPhase("idle");
      playAntiqueSound("click");
    }
  };

  // Track Selector
  const handleSelectTrack = (trackId: string) => {
    setSelectedTrackId(trackId);
    const willBeCompleted = !!courseCompletionMap[trackId];
    if (willBeCompleted) {
      triggerRollOpening();
    } else {
      setUnrollPhase("idle");
      playAntiqueSound("click");
    }
  };

  // Replay Roll Opening Animation
  const handleReplayRollOpening = () => {
    if (!isCourseCompleted) return;
    triggerRollOpening();
  };

  // Seal Press Interaction
  const handleSealClick = () => {
    setSealClicked(true);
    playAntiqueSound("stamp");
    setTimeout(() => setSealClicked(false), 500);
  };

  // Copy Verification Link
  const handleCopyLink = () => {
    if (!isCourseCompleted) return;
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/verify?certId=${activeCourse.serialNumber}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    playAntiqueSound("click");
    setTimeout(() => setCopiedLink(false), 2200);
  };

  // Print Certificate (Uses custom print stylesheet)
  const handlePrint = () => {
    if (!isCourseCompleted) return;
    playAntiqueSound("click");
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const filteredCredentials = INITIAL_CREDENTIALS.filter((cred) => {
    if (filter === "ALL") return true;
    return cred.type === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10 font-sans selection:bg-[#EFFF4F] selection:text-[#28282B]">
      {/* ======================================================== */}
      {/* TOP HEADER & CONTROL BAR                                */}
      {/* ======================================================== */}
      <div className="border-b border-[#3E3E43] pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-5 no-print">
        <div className="space-y-1.5">
          <div className="font-mono text-xs text-[#5A5F70] uppercase tracking-widest flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-amber-400/15 border border-amber-400/30 text-amber-300 font-bold text-[10px] flex items-center gap-1">
              <ScrollText className="w-3 h-3 text-amber-400" />
              ROYAL CHANCELLERY ACCREDITATION REGISTRY
            </span>
            <span>•</span>
            <span className="text-[#A0A5B5]">EST. ANNO DOMINI 2024</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span>OFFICIAL 1600s CERTIFICATE OF MASTERY</span>
            <Award className="w-8 h-8 text-amber-400 shrink-0" />
          </h1>


        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs shrink-0">
          {isCourseCompleted && (
            <button
              onClick={handleReplayRollOpening}
              className="px-3.5 py-2.5 border border-amber-500/40 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-bold uppercase rounded-lg transition-all flex items-center gap-1.5 hover:scale-105 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.25)]"
              title="Watch the 1600s scroll roll opening sequence again"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>REPLAY ROLL OPENING</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            disabled={!isCourseCompleted}
            className={`px-4 py-2.5 font-black uppercase rounded-lg transition-all flex items-center gap-1.5 ${
              isCourseCompleted
                ? "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:brightness-110 text-[#18181B] shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:scale-105 cursor-pointer"
                : "bg-[#2A2A2E] text-[#6B7280] border border-[#3E3E43] cursor-not-allowed opacity-60"
            }`}
            title={isCourseCompleted ? "Print or Save High-Resolution PDF" : "Complete course to unlock certificate"}
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>

          <button
            onClick={handleCopyLink}
            disabled={!isCourseCompleted}
            className={`px-3.5 py-2.5 border rounded-lg transition-colors flex items-center gap-1.5 ${
              isCourseCompleted
                ? "border-[#3E3E43] bg-[#2E2E32] hover:bg-[#38383D] text-[#A0A5B5] hover:text-[#EFFF4F] cursor-pointer"
                : "border-[#3E3E43] bg-[#242427] text-[#5A5F70] cursor-not-allowed opacity-60"
            }`}
            title={isCourseCompleted ? "Copy Public Verification Link" : "Complete course to unlock link"}
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink ? "COPIED LINK!" : "SHARE LINK"}</span>
          </button>

          <Link
            href={`/verify?certId=${activeCourse.serialNumber}`}
            className="px-3.5 py-2.5 border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 rounded-lg transition-colors flex items-center gap-1.5 font-bold"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>PUBLIC REGISTRY</span>
          </Link>
        </div>
      </div>

      {/* ======================================================== */}
      {/* INTERACTIVE CUSTOMIZER BAR: TRACKS, NAME & COMPLETION    */}
      {/* ======================================================== */}
      <div className="bg-[#242428] border border-amber-400/30 rounded-xl p-4 sm:p-5 shadow-card space-y-4 no-print">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          {/* Recipient Name Customizer */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
            <span className="text-xs font-mono font-bold text-amber-300 uppercase flex items-center gap-1.5 shrink-0">
              <User className="w-3.5 h-3.5" />
              <span>RECIPIENT NAME:</span>
            </span>

            {isEditingName ? (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Enter full recipient name..."
                  className="px-3 py-1.5 bg-[#18181A] border-2 border-amber-400 text-white font-mono text-xs rounded focus:outline-none w-full sm:w-64"
                  autoFocus
                />
                <button
                  onClick={() => setIsEditingName(false)}
                  className="px-3 py-1.5 bg-amber-400 text-[#18181B] font-mono text-xs font-bold rounded uppercase hover:bg-amber-300"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#18181A] border border-[#3E3E43] text-[#EFFF4F] font-mono text-xs font-bold rounded">
                  {recipientName}
                </span>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-1.5 text-[#A0A5B5] hover:text-white border border-[#3E3E43] bg-[#2E2E32] rounded hover:border-amber-400 transition-colors"
                  title="Edit Recipient Name on Certificate"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                {/* Quick Presets */}
                <div className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] text-[#5A5F70]">
                  <span>Presets:</span>
                  <button
                    onClick={() => setRecipientName("Tanmay Sharma")}
                    className="hover:text-amber-300 underline"
                  >
                    Tanmay
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => setRecipientName("Rahul Kamat")}
                    className="hover:text-amber-300 underline"
                  >
                    Rahul
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => setRecipientName("Sameer Patil")}
                    className="hover:text-amber-300 underline"
                  >
                    Sameer
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Course Track Selector & Access Status */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="text-xs text-[#A0A5B5] font-bold uppercase mr-1 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>COURSE SCROLL:</span>
            </span>

            {[
              { id: "gauntlet-30d", label: "30-Day SDET Gauntlet", icon: "🏆" },
              { id: "selenium-java-ai", label: "Selenium Java + AI", icon: "💻" },
              { id: "rest-assured-api", label: "RestAssured API", icon: "🚀" },
            ].map((track) => {
              const isDone = !!courseCompletionMap[track.id];
              return (
                <button
                  key={track.id}
                  onClick={() => handleSelectTrack(track.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                    selectedTrackId === track.id
                      ? "bg-gradient-to-r from-amber-400/25 to-yellow-400/20 text-amber-300 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                      : "bg-[#18181A] text-[#A0A5B5] border-[#3E3E43] hover:text-white hover:border-[#5A5F70]"
                  }`}
                >
                  <span>{track.icon}</span>
                  <span>{track.label}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                      isDone
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-red-500/15 text-red-300 border border-red-500/30"
                    }`}
                  >
                    {isDone ? "UNLOCKED" : "LOCKED"}
                  </span>
                </button>
              );
            })}

            {/* Test Simulation Toggle Button for Reviewers */}
            <button
              onClick={handleToggleCourseCompletion}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ml-1 ${
                isCourseCompleted
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/30"
                  : "bg-amber-400/20 text-amber-300 border-amber-400/50 hover:bg-amber-400/30"
              }`}
              title="Toggle course completion status to test locked vs unlocked state"
            >
              {isCourseCompleted ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Unlocked (Click to Lock)</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Locked (Click to Unlock)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Status / Herald Banner when Unlocking or Completed */}
      {isCourseCompleted && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-2.5 bg-[#1C1610] border border-amber-500/40 rounded-xl font-mono text-xs no-print">
          <div className="flex items-center gap-2 text-amber-300">
            {unrollPhase === "sealed" || unrollPhase === "snapping" ? (
              <>
                <Sparkles className="w-4 h-4 text-yellow-400 animate-spin" />
                <span className="font-bold uppercase tracking-wider text-yellow-300">
                  COURSE COMPLETED! SNAPPING VELVET RIBBON & BREAKING WAX SEAL...
                </span>
              </>
            ) : unrollPhase === "unfurling" ? (
              <>
                <ScrollText className="w-4 h-4 text-amber-400 animate-bounce" />
                <span className="font-bold uppercase tracking-wider text-amber-300">
                  UNFURLING 1600s CERTIFICATE ROLL VERTICALLY DOWNWARDS...
                </span>
              </>
            ) : unrollPhase === "revealing" ? (
              <>
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="font-bold uppercase tracking-wider text-emerald-300">
                  INSCRIBING ROYAL CALLIGRAPHY & CONFERRING ACCREDITATION...
                </span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-bold uppercase tracking-wider text-emerald-300">
                  OFFICIAL 1600s LETTERS PATENT • UNROLLED VERTICALLY & ACCREDITED
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReplayRollOpening}
              className="px-3 py-1 bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/50 text-amber-300 font-bold uppercase rounded-lg transition-all flex items-center gap-1.5 hover:scale-105 cursor-pointer text-[11px]"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Replay Roll Opening</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CERTIFICATE DISPLAY: LOCKED STATE VS UNLOCKED SCROLL      */}
      {/* ======================================================== */}
      <div className="relative w-full flex justify-center py-2 sm:py-6 overflow-hidden">
        {/* Subtle Candlelight Ambiance Spotlight in Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[750px] bg-amber-600/10 blur-[140px] rounded-full pointer-events-none animate-candlelight" />

        {!isCourseCompleted ? (
          /* ======================================================== */
          /* LOCKED / NON-ACCESSIBLE STATE (SEALED ROLLED SCROLL)     */
          /* ======================================================== */
          <div className="relative w-full max-w-[1080px] aspect-[16/9] rounded-2xl overflow-hidden border-2 border-amber-900/60 shadow-[0_25px_50px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center p-6 sm:p-12 text-center select-none">
            {/* Background: Authentic tightly rolled scroll tied with crimson velvet ribbon */}
            <img
              src="/parchment-scroll-sealed.jpg"
              alt="Sealed Antique Scroll Tied with Velvet Ribbon"
              className="absolute inset-0 w-full h-full object-cover filter contrast-105 brightness-95"
            />

            {/* Dark Vignette Overlay for Crisp Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0704]/90 via-[#0A0704]/60 to-[#0A0704]/80 pointer-events-none" />

            {/* Locked Plaque Container */}
            <div className="relative z-10 max-w-xl mx-auto space-y-4 bg-[#140F0A]/92 backdrop-blur-md p-6 sm:p-8 rounded-xl border border-amber-600/40 shadow-[0_0_50px_rgba(0,0,0,0.9)]">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-950/80 border border-amber-600/60 rounded-full text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>SCROLL SEALED & NON-ACCESSIBLE</span>
              </div>

              <h2
                className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight"
                style={{ fontFamily: "'Cinzel', Georgia, serif" }}
              >
                Certificate Locked
              </h2>

              <p className="text-xs sm:text-sm text-[#D1C7BD] leading-relaxed font-sans">
                This royal letter scroll remains tied and wax-sealed under the authority of NextGen Testing Academy. You can only access and unfurl this certificate once the respective course is certified 100% completed.
              </p>

              {/* Course Progress Breakdown */}
              <div className="p-4 bg-[#1F1710] border border-amber-900/60 rounded-lg space-y-3 text-left font-mono text-xs">
                <div className="flex justify-between items-center text-amber-300 font-bold">
                  <span className="truncate max-w-[280px]">{activeCourse.courseTitle}</span>
                  <span className="text-[#EFFF4F]">{activeCourse.progressLabel}</span>
                </div>

                <div className="w-full bg-[#0D0906] h-2 rounded-full overflow-hidden border border-amber-900/50">
                  <div
                    className="bg-gradient-to-r from-amber-600 to-yellow-400 h-full rounded-full transition-all"
                    style={{ width: `${activeCourse.progressPercent}%` }}
                  />
                </div>

                <div className="space-y-1 text-[11px] text-[#A09385]">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <span>✔</span>
                    <span>Week 1: Core Automation & Driver Harness (Accredited)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <span>✔</span>
                    <span>Week 2: TestNG Framework Architecture (Accredited)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <span>⌛</span>
                    <span>Week 3: Docker Grid & Clustered Runs (In Progress)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#6B5E52]">
                    <span>🔒</span>
                    <span>Week 4: CI/CD Pipeline & Final Capstone (Locked)</span>
                  </div>
                </div>
              </div>

              {/* CTA Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href={activeCourse.courseLink}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-110 text-[#18181B] font-black uppercase text-xs rounded-lg flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all hover:scale-105"
                >
                  {activeCourse.id === "gauntlet-30d" ? (
                    <Flame className="w-4 h-4 fill-current text-[#18181B]" />
                  ) : (
                    <BookOpen className="w-4 h-4" />
                  )}
                  <span>
                    {activeCourse.id === "gauntlet-30d"
                      ? "Resume 30-Day Gauntlet (Day 12 Active)"
                      : "Go to Course & Complete Modules"}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={handleToggleCourseCompletion}
                  className="w-full sm:w-auto px-4 py-3 bg-[#2A1F16] hover:bg-[#382B1F] text-amber-300 border border-amber-600/50 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 hover:scale-105"
                  title="Simulate course completion to test unlocking the certificate scroll"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>⚡ Simulate Completion & Unlock</span>
                </button>
              </div>
            </div>
          </div>
        ) : unrollPhase === "sealed" || unrollPhase === "snapping" ? (
          /* ======================================================== */
          /* VERTICAL ROLL OPENING: STAGE 1 & 2 - SEALED CYLINDER     */
          /* ======================================================== */
          <div
            id="parchment-scroll-container"
            className="relative w-full max-w-[1080px] aspect-[16/9] select-none overflow-hidden rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] bg-[#120B06] flex flex-col items-center justify-start pt-6 sm:pt-10 border-2 border-amber-950/80"
          >
            {/* Ambient Warm Candlelight Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0704]/90 via-[#0A0704]/50 to-[#0A0704]/80 pointer-events-none" />

            {/* Top Anchor Wooden Dowel */}
            <div className="absolute top-0 left-0 right-0 h-6 sm:h-9 md:h-11 z-20 pointer-events-none">
              <div className="w-full h-full relative bg-gradient-to-b from-[#251207] via-[#5A3116] via-[#7D4620] via-[#48240F] to-[#1A0B04] border-b border-[#B45309]/60 shadow-[0_12px_24px_rgba(0,0,0,0.85)]">
                <div className="absolute left-[-12px] sm:left-[-20px] top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-full bg-gradient-to-br from-[#7D4620] via-[#48240F] to-[#1A0B04] border-2 border-amber-500/80 shadow-[0_4px_16px_rgba(0,0,0,0.9)] flex items-center justify-center">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-800 shadow-inner border border-amber-300/50" />
                </div>
                <div className="absolute right-[-12px] sm:right-[-20px] top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-full bg-gradient-to-bl from-[#7D4620] via-[#48240F] to-[#1A0B04] border-2 border-amber-500/80 shadow-[0_4px_16px_rgba(0,0,0,0.9)] flex items-center justify-center">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-bl from-amber-300 via-amber-500 to-amber-800 shadow-inner border border-amber-300/50" />
                </div>
              </div>
            </div>

            {/* Rolled Scroll Cylinder Positioned at Top Ready to Unroll Down */}
            <div className="relative w-[86%] sm:w-[82%] h-24 sm:h-32 md:h-36 shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex items-center justify-center mt-2 sm:mt-4 z-20">
              {/* Wooden Turned Finials on Ends */}
              <div className="absolute left-[-14px] sm:left-[-22px] top-1/2 -translate-y-1/2 w-9 h-9 sm:w-13 sm:h-13 md:w-15 md:h-15 rounded-full bg-gradient-to-br from-[#8C532B] via-[#512D15] to-[#1C0E06] border-2 border-amber-500/80 shadow-[0_8px_20px_rgba(0,0,0,0.9)] flex items-center justify-center z-30">
                <div className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-amber-300 to-amber-700 shadow-inner border border-amber-200/40" />
              </div>
              <div className="absolute right-[-14px] sm:right-[-22px] top-1/2 -translate-y-1/2 w-9 h-9 sm:w-13 sm:h-13 md:w-15 md:h-15 rounded-full bg-gradient-to-bl from-[#8C532B] via-[#512D15] to-[#1C0E06] border-2 border-amber-500/80 shadow-[0_8px_20px_rgba(0,0,0,0.9)] flex items-center justify-center z-30">
                <div className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-gradient-to-bl from-amber-300 to-amber-700 shadow-inner border border-amber-200/40" />
              </div>

              {/* Parchment Rolled Cylinder Body */}
              <div className="w-full h-full rounded-md bg-gradient-to-b from-[#2E180B] via-[#8C6239] via-[#D4B58A] via-[#8C6239] to-[#241207] border-y-2 border-[#4A2911] relative overflow-hidden shadow-inner flex items-center justify-center">
                {/* Cylindrical Sheen */}
                <div className="absolute top-[28%] left-0 right-0 h-[6px] bg-gradient-to-r from-transparent via-[#FFF8E7]/35 to-transparent pointer-events-none" />
                <div className="absolute bottom-[18%] left-0 right-0 h-[10px] bg-gradient-to-b from-transparent to-[#1F1106]/70 pointer-events-none" />

                {/* Vertical Velvet Ribbon Bands */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
                  {/* Top Half of Ribbon */}
                  <div
                    className={`w-10 sm:w-14 h-1/2 bg-gradient-to-r from-[#6B1414] via-[#991B1B] to-[#450A0A] border-x-2 border-amber-400 shadow-lg ${
                      unrollPhase === "snapping" ? "animate-ribbon-up" : ""
                    }`}
                  />
                  {/* Bottom Half of Ribbon */}
                  <div
                    className={`w-10 sm:w-14 h-1/2 bg-gradient-to-r from-[#6B1414] via-[#991B1B] to-[#450A0A] border-x-2 border-amber-400 shadow-lg ${
                      unrollPhase === "snapping" ? "animate-ribbon-down" : ""
                    }`}
                  />
                </div>

                {/* Center Royal Wax Seal */}
                <div
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 z-30 ${
                    unrollPhase === "snapping" ? "animate-seal-break" : "animate-wax-seal"
                  }`}
                >
                  <img
                    src="/antique-wax-seal.jpg"
                    alt="Royal Crimson Wax Seal"
                    className="w-full h-full object-contain rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.95)]"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* UNLOCKED 1600s OLD LETTER ROLL CERTIFICATE (VERTICAL UNROLL) */
          /* Text is strictly bounded within flat parchment page area */
          /* ZERO OVERLAY ON ROLLERS, BORDERS OR OUTSIDE CANVAS       */
          /* ======================================================== */
          <div
            id="parchment-scroll-container"
            className="relative w-full max-w-[1080px] aspect-[16/9] select-none overflow-hidden rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] bg-[#120B06]"
          >
            {/* Authentic 1600s Unfurled Parchment Roll Background */}
            <div
              className={`absolute inset-0 w-full h-full ${
                unrollPhase === "unfurling" ? "animate-parchment-vertical" : ""
              }`}
            >
              <img
                src="/parchment-scroll-1600s.jpg"
                alt="1600s Antique Parchment Letter Roll Certificate"
                className="w-full h-full object-fill pointer-events-none"
              />

              {/* Vintage Aged Parchment Tone Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#2A1808]/15 via-transparent to-[#2A1808]/20 pointer-events-none" />
            </div>

            {/* Active Rolling Wooden Roller Bars (Visible during unfurling phase) */}
            {unrollPhase === "unfurling" && (
              <>
                {/* Top stationary anchor roller */}
                <WoodenRollerBar position="top" />

                {/* Bottom roller dowel rolling VERTICALLY downwards */}
                <WoodenRollerBar position="bottom" isMovingVertical={true} />

                {/* Golden Celestial Shimmer Light Sweeping Vertically */}
                <div className="absolute inset-x-0 h-28 bg-gradient-to-b from-transparent via-amber-400/40 via-yellow-200/60 to-transparent blur-md pointer-events-none z-20 animate-light-sweep-vertical" />
              </>
            )}

            {/* ======================================================== */}
            {/* FLAT PARCHMENT PAGE AREA                                 */}
            {/* STRICTLY CENTERED IN THE MIDDLE OF THE PARCHMENT CANVAS */}
            {/* BOUNDED WITHIN THE CLEAN WRITING AREA (NO BORDER OVERLAY)*/}
            {/* ======================================================== */}
            <div
              className={`absolute left-[25%] right-[25%] top-[27%] bottom-[29%] flex flex-col justify-between items-center text-center text-[#241306] overflow-hidden px-2 sm:px-4 py-1 transition-opacity duration-300 ${
                unrollPhase === "unfurling"
                  ? "opacity-0"
                  : unrollPhase === "revealing"
                  ? "animate-calligraphy-ink"
                  : "opacity-100"
              }`}
            >
              {/* 1. Top Proclamation Header */}
              <div className="w-full space-y-0.5">
                <div className="flex items-center justify-center gap-2 text-[#6B3D14] text-[8px] sm:text-[9px] md:text-[10px] font-serif tracking-[0.22em] uppercase font-bold">
                  <span>✦</span>
                  <span>CHANCELLERIA ACADEMIAE NEXTGENENSIS</span>
                  <span>✦</span>
                </div>

                <h2
                  className="text-sm sm:text-lg md:text-xl lg:text-2xl font-black text-[#2B1405] tracking-tight uppercase drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)] leading-tight"
                  style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                >
                  Letters Patent of Mastery
                </h2>
              </div>

              {/* 2. Recipient Proclamation & User Details */}
              <div className="w-full space-y-0.5 sm:space-y-1 my-auto">
                <div
                  className="text-[7px] sm:text-[8px] md:text-[9px] text-[#7A4B1D] tracking-[0.2em] uppercase font-bold"
                  style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                >
                  BE IT KNOWN ACROSS THE REALM THAT
                </div>

                {/* Recipient Full Name (Strictly fitted within flat page) */}
                <div className="relative inline-block max-w-full">
                  <div
                    className="text-base sm:text-xl md:text-2xl lg:text-3xl font-black text-[#1A0B02] tracking-tight px-2 truncate leading-tight"
                    style={{
                      fontFamily: "'Cinzel Decorative', 'Cinzel', Georgia, serif",
                      textShadow: "1px 1px 0px rgba(255,255,255,0.5)",
                    }}
                  >
                    {recipientName}
                  </div>

                  {/* Hand-Drawn Double Quill Flourish Divider */}
                  <div className="flex items-center justify-center gap-1.5 text-[#8B5A2B]">
                    <span className="h-[1.5px] w-10 sm:w-16 bg-gradient-to-r from-transparent via-[#8B5A2B] to-[#4A2E12]" />
                    <span className="text-[8px] sm:text-[9px]">⚜</span>
                    <span className="h-[1.5px] w-10 sm:w-16 bg-gradient-to-l from-transparent via-[#8B5A2B] to-[#4A2E12]" />
                  </div>
                </div>

                {/* Candidate Code & Cohort */}
                <div className="text-[7px] sm:text-[8px] md:text-[9px] text-[#5A3816] font-mono tracking-wider">
                  <span>CANDIDATE: </span>
                  <span className="font-bold text-[#2A1507]">{studentId}</span>
                  <span> • COHORT OF SDET SCHOLARS</span>
                </div>
              </div>

              {/* 3. Course Title & Distinction Banner */}
              <div className="w-full space-y-0.5">
                <div
                  className="text-[6px] sm:text-[7px] md:text-[8px] text-[#754619] tracking-[0.2em] font-bold uppercase"
                  style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                >
                  CONFERRED FOR SUPREME PROFICIENCY IN
                </div>

                <div
                  className="text-xs sm:text-sm md:text-base font-black text-[#210D03] tracking-tight uppercase drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)] leading-tight px-1 line-clamp-1 max-w-lg mx-auto"
                  style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                >
                  {activeCourse.courseTitle}
                </div>

                <div
                  className="text-[7px] sm:text-[8px] md:text-[9px] text-[#5C3819] italic font-serif line-clamp-1"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {activeCourse.latinTitle}
                </div>
              </div>

              {/* 4. Bottom Signatures, Wax Seal & Verification */}
              <div className="w-full pt-1 border-t border-[#8B5A2B]/30 flex items-center justify-between gap-2 relative">
                {/* Left Signature: Rahul Kamat */}
                <div className="text-center sm:text-left space-y-0.5 w-[30%]">
                  <div
                    className="text-sm sm:text-lg md:text-xl text-[#1E0D03] leading-none select-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)] truncate"
                    style={{ fontFamily: "'Alex Brush', cursive" }}
                  >
                    Rahul Kamat
                  </div>
                  <div className="h-[1px] w-16 sm:w-24 bg-[#5C3819]/60 mx-auto sm:mx-0" />
                  <div
                    className="text-[6px] sm:text-[7px] md:text-[8px] font-bold text-[#3B1F08] tracking-wider uppercase font-serif truncate"
                    style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                  >
                    Rahul Kamat
                  </div>
                  <div className="text-[5px] sm:text-[6px] md:text-[7px] text-[#5A3816] font-mono truncate">
                    Founder & Grand Master, NGTA
                  </div>
                </div>

                {/* Centerpiece: Authentic 1600s Royal Crimson Wax Seal */}
                <div
                  onClick={handleSealClick}
                  className={`relative cursor-pointer transition-transform duration-200 select-none shrink-0 ${
                    sealClicked ? "scale-90" : "hover:scale-105"
                  } ${unrollPhase === "revealing" ? "animate-stamp" : ""}`}
                  title="Royal Crimson Wax Seal (Click to Stamp)"
                >
                  <div className="w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 flex items-center justify-center animate-wax-seal rounded-full">
                    <img
                      src="/antique-wax-seal.jpg"
                      alt="Royal Crimson Wax Seal 1600s"
                      className="w-full h-full object-contain rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.85)]"
                    />
                  </div>
                </div>

                {/* Right Signature: Academic Dean */}
                <div className="text-center sm:text-right space-y-0.5 w-[30%]">
                  <div
                    className="text-sm sm:text-lg md:text-xl text-[#1E0D03] leading-none select-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)] truncate"
                    style={{ fontFamily: "'Alex Brush', cursive" }}
                  >
                    Dr. Eric Vance
                  </div>
                  <div className="h-[1px] w-16 sm:w-24 bg-[#5C3819]/60 mx-auto sm:ml-auto" />
                  <div
                    className="text-[6px] sm:text-[7px] md:text-[8px] font-bold text-[#3B1F08] tracking-wider uppercase font-serif truncate"
                    style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                  >
                    Dr. Eric Vance
                  </div>
                  <div className="text-[5px] sm:text-[6px] md:text-[7px] text-[#5A3816] font-mono truncate">
                    Grand Chancellor & Architect
                  </div>
                </div>
              </div>

              {/* 5. Footer Footnote: Serial & Date */}
              <div className="w-full pt-0.5 border-t border-[#8B5A2B]/20 flex items-center justify-between text-[6px] sm:text-[7px] md:text-[8px] text-[#5A3816] font-mono">
                <span className="truncate">№ {activeCourse.serialNumber}</span>
                <span>CONFERRED: {activeCourse.conferredDate}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* TECHNICAL VERIFICATION & CREDENTIAL DETAILS DRAWER      */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 no-print">
        {/* Left Column: Cryptographic Authenticity Telemetry */}
        <div className="lg:col-span-7 bg-[#242428] border border-[#3E3E43] rounded-xl p-6 shadow-card space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#3E3E43] pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white uppercase text-sm">
                CRYPTOGRAPHIC SCROLL AUTHENTICATION
              </h3>
            </div>
            <span
              className={`px-2.5 py-0.5 border font-bold text-[10px] rounded ${
                isCourseCompleted
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                  : "bg-amber-500/15 border-amber-500/30 text-amber-300"
              }`}
            >
              {isCourseCompleted ? "VERIFIED & ACCREDITED" : "AWAITING COURSE COMPLETION"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-[11px]">
            <div>
              <span className="text-[#5A5F70] block uppercase text-[10px]">Registry Identifier</span>
              <span className="text-white font-bold">{activeCourse.serialNumber}</span>
            </div>
            <div>
              <span className="text-[#5A5F70] block uppercase text-[10px]">Academic Evaluation Grade</span>
              <span className="text-[#EFFF4F] font-bold">
                {isCourseCompleted ? activeCourse.grade : "IN PROGRESS"}
              </span>
            </div>
            <div>
              <span className="text-[#5A5F70] block uppercase text-[10px]">Conferred Date</span>
              <span className="text-white font-bold">
                {isCourseCompleted ? activeCourse.conferredDate : "PENDING SYLLABUS CLEARANCE"}
              </span>
            </div>
            <div>
              <span className="text-[#5A5F70] block uppercase text-[10px]">Issuing Guild Authority</span>
              <span className="text-amber-300 font-bold">NextGen Testing Academy (NGTA)</span>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-[#5A5F70] block uppercase text-[10px] mb-1">
              Full SHA-256 Cryptographic Hash
            </span>
            <div className="p-2.5 bg-[#18181A] border border-[#3E3E43] rounded text-[10px] text-[#A0A5B5] break-all select-all font-mono">
              {activeCourse.sha256Hash}
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href={`/verify?certId=${activeCourse.serialNumber}`}
              className="px-4 py-2 bg-[#EFFF4F] text-[#28282B] font-bold uppercase rounded hover:bg-[#EFFF4F]/90 transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Query Public Ledger Verification</span>
            </Link>

            <button
              onClick={handlePrint}
              disabled={!isCourseCompleted}
              className={`px-4 py-2 border rounded font-bold uppercase transition-colors flex items-center gap-1.5 ${
                isCourseCompleted
                  ? "bg-[#333336] text-white hover:text-[#EFFF4F] border-[#3E3E43] cursor-pointer"
                  : "bg-[#242427] text-[#5A5F70] border-[#3E3E43] cursor-not-allowed opacity-60"
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export High-Resolution PDF</span>
            </button>
          </div>
        </div>

        {/* Right Column: LinkedIn Accreditation & Sharing */}
        <div className="lg:col-span-5 bg-[#242428] border border-[#3E3E43] rounded-xl p-6 shadow-card space-y-4 font-mono text-xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm uppercase">
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>SHARE TO PROFESSIONAL PROFILE</span>
            </div>
            <p className="text-[11px] text-[#A0A5B5] font-sans leading-relaxed">
              Add this official 1600s credential to your LinkedIn profile. Employers and hiring leaders can verify your SDET competencies with one click.
            </p>
          </div>

          <div className="p-3 bg-[#18181A] border border-[#3E3E43] rounded-lg space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-[#5A5F70]">Certification Name:</span>
              <span className="text-white font-bold truncate max-w-[200px]">{activeCourse.courseTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5A5F70]">Issuing Organization:</span>
              <span className="text-white font-bold">NextGen Testing Academy</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5A5F70]">Credential ID:</span>
              <span className="text-amber-300 font-bold">{activeCourse.serialNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5A5F70]">Status:</span>
              <span className={isCourseCompleted ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                {isCourseCompleted ? "✔ UNLOCKED & CONFERRED" : "🔒 SEALED UNTIL COURSE COMPLETION"}
              </span>
            </div>
          </div>

          <a
            href={
              isCourseCompleted
                ? `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
                    activeCourse.courseTitle
                  )}&organizationName=NextGen+Testing+Academy&issueYear=2026&issueMonth=10&certUrl=${encodeURIComponent(
                    typeof window !== "undefined"
                      ? `${window.location.origin}/verify?certId=${activeCourse.serialNumber}`
                      : ""
                  )}`
                : undefined
            }
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!isCourseCompleted) {
                e.preventDefault();
                alert("Please complete the course to unlock your shareable LinkedIn credential!");
              }
            }}
            className={`w-full py-2.5 font-bold uppercase rounded flex items-center justify-center gap-2 transition-colors shadow-sm text-center ${
              isCourseCompleted
                ? "bg-[#0A66C2] hover:bg-[#004182] text-white cursor-pointer"
                : "bg-[#242427] text-[#5A5F70] cursor-not-allowed opacity-60"
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Add Credential to LinkedIn</span>
          </a>
        </div>
      </div>

      {/* ======================================================== */}
      {/* OTHER VERIFIED CREDENTIALS & SKILL BADGES                */}
      {/* ======================================================== */}
      <div className="space-y-5 no-print pt-6 border-t border-[#3E3E43]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="font-mono text-[10px] text-[#5A5F70] uppercase tracking-widest">
              FULL PORTFOLIO
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">
              ALL EARNED CREDENTIALS & SKILL BADGES
            </h3>
          </div>

          <div className="flex border border-[#3E3E43] bg-[#333336] font-mono text-xs font-bold rounded overflow-hidden">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1.5 uppercase transition-colors ${
                filter === "ALL" ? "bg-[#EFFF4F] text-[#28282B]" : "text-[#A0A5B5] hover:bg-[#3E3E43]"
              }`}
            >
              ALL ({INITIAL_CREDENTIALS.length})
            </button>
            <button
              onClick={() => setFilter("CERTIFICATE")}
              className={`px-3 py-1.5 uppercase border-l border-[#3E3E43] transition-colors ${
                filter === "CERTIFICATE" ? "bg-[#EFFF4F] text-[#28282B]" : "text-[#A0A5B5] hover:bg-[#3E3E43]"
              }`}
            >
              CERTIFICATES
            </button>
            <button
              onClick={() => setFilter("BADGE")}
              className={`px-3 py-1.5 uppercase border-l border-[#3E3E43] transition-colors ${
                filter === "BADGE" ? "bg-[#EFFF4F] text-[#28282B]" : "text-[#A0A5B5] hover:bg-[#3E3E43]"
              }`}
            >
              BADGES
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredCredentials.map((cred) => (
            <div key={cred.id} className="space-y-2">
              <CredentialCard credential={cred} />
              <div className="flex items-center justify-between text-xs font-mono pt-1">
                <Link
                  href={`/verify?certId=${cred.verificationId || "NGTA-CERT-2026-8910"}`}
                  className="text-[#EFFF4F] hover:underline flex items-center gap-1 font-bold text-[11px]"
                >
                  <span>Verify</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <button
                  onClick={handlePrint}
                  className="text-[#A0A5B5] hover:text-white flex items-center gap-1 text-[11px]"
                >
                  <Download className="w-3 h-3" />
                  <span>PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
