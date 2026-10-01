"use client";

import React, { useState } from "react";
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
  Calendar,
  User,
  Search,
  Lock,
  ScrollText,
  Flame,
  QrCode,
  Edit3,
} from "lucide-react";
import { INITIAL_CREDENTIALS } from "@/lib/gamification";
import CredentialCard from "@/components/gamification/CredentialCard";

/* Web Audio Synthesizer for 1600s Parchment Unfurl & Molten Wax Seal Stamp */
function playAntiqueSound(type: "stamp" | "unfurl" | "click") {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === "stamp") {
      // 1. Deep low-frequency molten wax press thud (130Hz -> 40Hz)
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
    } else if (type === "unfurl") {
      // Gentle wood roller and parchment paper slide oscillations
      [196, 261.63, 329.63, 392].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.connect(gain);
        gain.connect(ctx.destination);
        const startTime = ctx.currentTime + i * 0.08;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.04, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
        osc.start(startTime);
        osc.stop(startTime + 0.3);
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
    competencies: [
      "I. HTTP Specification & Status Code Verifications",
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

  // Animation & UI states
  const [isRolled, setIsRolled] = useState(false);
  const [sealClicked, setSealClicked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "CERTIFICATE" | "BADGE">("ALL");

  // Re-roll and unfurl the scroll
  const handleReRoll = () => {
    setIsRolled(true);
    playAntiqueSound("unfurl");
    setTimeout(() => {
      setIsRolled(false);
    }, 400);
  };

  // Seal Press Interaction
  const handleSealClick = () => {
    setSealClicked(true);
    playAntiqueSound("stamp");
    setTimeout(() => setSealClicked(false), 500);
  };

  // Copy Verification Link
  const handleCopyLink = () => {
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/verify?certId=${activeCourse.serialNumber}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    playAntiqueSound("click");
    setTimeout(() => setCopiedLink(false), 2200);
  };

  // Print Certificate (Uses custom print stylesheet)
  const handlePrint = () => {
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

          <p className="text-sm text-[#A0A5B5] max-w-3xl leading-relaxed">
            Styled in the grand tradition of 17th-century European Letters Patent. Unrolled parchment scroll with authentic wooden roller rods, royal crimson wax seal, and cryptographic SHA-256 validation.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs shrink-0">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:brightness-110 text-[#18181B] font-black uppercase rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.35)] flex items-center gap-1.5 transition-all hover:scale-105"
            title="Print or Save High-Resolution PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="px-3.5 py-2.5 border border-[#3E3E43] bg-[#2E2E32] hover:bg-[#38383D] text-[#A0A5B5] hover:text-[#EFFF4F] rounded-lg transition-colors flex items-center gap-1.5"
            title="Copy Public Verification Link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink ? "COPIED LINK!" : "SHARE LINK"}</span>
          </button>

          <Link
            href={`/verify?certId=${activeCourse.serialNumber}`}
            className="px-3.5 py-2.5 border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 rounded-lg transition-colors flex items-center gap-1.5 font-bold"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>VERIFY REGISTRY</span>
          </Link>
        </div>
      </div>

      {/* ======================================================== */}
      {/* INTERACTIVE CUSTOMIZER BAR: NAME & COURSE TRACK          */}
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
                <span className="px-3 py-1 bg-[#18181B] border border-[#3E3E43] text-[#EFFF4F] font-mono text-xs font-bold rounded">
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

          {/* Course Track Selector */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="text-xs text-[#A0A5B5] font-bold uppercase mr-1 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>SELECT GUILD SCROLL:</span>
            </span>

            {[
              { id: "gauntlet-30d", label: "30-Day SDET Gauntlet", icon: "🏆" },
              { id: "selenium-java-ai", label: "Selenium Java + AI", icon: "💻" },
              { id: "rest-assured-api", label: "RestAssured API", icon: "🚀" },
            ].map((track) => (
              <button
                key={track.id}
                onClick={() => {
                  setSelectedTrackId(track.id);
                  handleReRoll();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  selectedTrackId === track.id
                    ? "bg-gradient-to-r from-amber-400/25 to-yellow-400/20 text-amber-300 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                    : "bg-[#18181A] text-[#A0A5B5] border-[#3E3E43] hover:text-white hover:border-[#5A5F70]"
                }`}
              >
                <span>{track.icon}</span>
                <span>{track.label}</span>
              </button>
            ))}

            <button
              onClick={handleReRoll}
              className="p-1.5 border border-[#3E3E43] bg-[#2E2E32] text-[#A0A5B5] hover:text-white rounded-lg transition-colors ml-1"
              title="Re-roll and Unfurl Parchment"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1600s OLD LETTER ROLL CERTIFICATE CONTAINER             */}
      {/* ======================================================== */}
      <div className="relative w-full flex justify-center py-2 sm:py-6 overflow-hidden">
        {/* Subtle Candlelight Ambiance Spotlight in Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[750px] bg-amber-600/10 blur-[140px] rounded-full pointer-events-none animate-candlelight" />

        {/* Physical 1600s Parchment Letter Scroll Container */}
        <div
          id="parchment-scroll-container"
          className={`relative w-full max-w-[1080px] min-h-[720px] transition-all duration-700 select-none ${
            isRolled ? "scale-y-0 opacity-0" : "animate-scroll-unroll"
          }`}
          style={{ filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.85))" }}
        >
          {/* Authentic 1600s Unfurled Parchment Roll Background */}
          <img
            src="/parchment-scroll-1600s.jpg"
            alt="1600s Antique Parchment Letter Roll Certificate"
            className="absolute inset-0 w-full h-full object-fill pointer-events-none rounded-sm"
          />

          {/* Vintage Aged Parchment Tone Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#2A1808]/15 via-transparent to-[#2A1808]/25 pointer-events-none" />

          {/* ======================================================== */}
          {/* SCROLL INNER CONTENT (ROYAL CALLIGRAPHY & CHANCELLERY)    */}
          {/* ======================================================== */}
          <div className="relative z-10 px-8 sm:px-20 md:px-28 py-10 sm:py-16 flex flex-col justify-between min-h-[720px] text-[#241306]">
            {/* Top Proclamation Header */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-3 text-[#5A3816] text-xs font-serif tracking-[0.25em] uppercase font-bold">
                <span>✦</span>
                <span>CHANCELLERIA ACADEMIAE NEXTGENENSIS</span>
                <span>✦</span>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] tracking-[0.3em] font-serif text-[#6D451C] uppercase font-semibold">
                <span>ANNO DOMINI MMXXVI • REGAL REGISTER OF SDET CRAFTSMEN</span>
              </div>

              <h2
                className="text-2xl sm:text-4xl md:text-5xl font-black text-[#2B1405] tracking-tight uppercase mt-1 drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]"
                style={{ fontFamily: "'Cinzel', Georgia, serif" }}
              >
                Letters Patent of Mastery
              </h2>

              <p
                className="text-xs sm:text-sm text-[#4E2E10] italic max-w-xl mx-auto leading-relaxed pt-1"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                &ldquo;To All and Singular unto whom these Present Letters shall come, Greeting in the Craft of Software Architecture.&rdquo;
              </p>
            </div>

            {/* Recipient Proclamation & User Details */}
            <div className="text-center space-y-2.5 my-3 sm:my-4">
              <div
                className="text-[11px] sm:text-xs text-[#5C3717] tracking-[0.2em] uppercase font-bold"
                style={{ fontFamily: "'Cinzel', Georgia, serif" }}
              >
                BE IT KNOWN ACROSS THE REALM THAT
              </div>

              {/* Recipient Full Name */}
              <div className="relative inline-block my-1">
                <div
                  className="text-3xl sm:text-5xl md:text-6xl font-black text-[#1A0B02] tracking-tight py-1 px-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
                  style={{
                    fontFamily: "'Cinzel Decorative', 'Cinzel', Georgia, serif",
                    textShadow: "1px 1px 0px rgba(255,255,255,0.4)",
                  }}
                >
                  {recipientName}
                </div>

                {/* Hand-Drawn Double Quill Flourish Divider */}
                <div className="flex items-center justify-center gap-2 text-[#7B4F23] mt-1">
                  <span className="h-[1.5px] w-16 sm:w-28 bg-gradient-to-r from-transparent via-[#7B4F23] to-[#4A2E12]" />
                  <span className="text-xs">✦</span>
                  <span className="h-[1.5px] w-16 sm:w-28 bg-gradient-to-l from-transparent via-[#7B4F23] to-[#4A2E12]" />
                </div>
              </div>

              {/* Student Register & Cohort Metadata */}
              <div
                className="text-[10px] sm:text-[11px] text-[#5A3816] font-mono tracking-wider"
                style={{ textShadow: "0 1px 0 rgba(255,255,255,0.5)" }}
              >
                <span>CANDIDATE CODE: </span>
                <span className="font-bold text-[#2A1507]">{studentId}</span>
                <span> • COHORT OF SDET SCHOLARS</span>
              </div>

              {/* Formal Attestation Paragraph */}
              <p
                className="text-xs sm:text-sm md:text-base text-[#3A1E08] max-w-2xl mx-auto leading-relaxed pt-1"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {activeCourse.description}
              </p>
            </div>

            {/* Course Title & Distinction Banner */}
            <div className="text-center space-y-2 py-2">
              <div
                className="text-[10px] sm:text-xs text-[#754619] tracking-[0.25em] font-bold uppercase"
                style={{ fontFamily: "'Cinzel', Georgia, serif" }}
              >
                CONFERRED FOR EXTRAORDINARY MERIT IN
              </div>

              <div
                className="text-lg sm:text-2xl md:text-3xl font-black text-[#210D03] tracking-tight uppercase drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)]"
                style={{ fontFamily: "'Cinzel', Georgia, serif" }}
              >
                {activeCourse.courseTitle}
              </div>

              <div
                className="text-xs sm:text-sm text-[#5C3819] italic font-serif"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {activeCourse.latinTitle}
              </div>

              {/* Guild Competencies Grid (8 Core Arts) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 max-w-2xl mx-auto text-left text-[10px] sm:text-[11px] text-[#4A280D] font-mono pt-2 border-t border-[#8B5A2B]/30 pb-2">
                {activeCourse.competencies.map((comp, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 truncate">
                    <span className="text-[#8B5A2B] text-xs">⚜</span>
                    <span className="font-medium text-[#2E1606]">{comp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Row: Signatures, 1600s Wax Seal & Verification */}
            <div className="pt-4 border-t-2 border-[#6D421A]/40 flex flex-col sm:flex-row items-center justify-between gap-6 relative">
              {/* Left Signature: Rahul Kamat */}
              <div className="text-center sm:text-left space-y-1 min-w-[190px]">
                <div
                  className="text-3xl sm:text-4xl text-[#1E0D03] leading-none select-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]"
                  style={{ fontFamily: "'Alex Brush', cursive" }}
                >
                  Rahul Kamat
                </div>
                <div className="h-[1px] w-40 bg-[#5C3819]/60 mx-auto sm:mx-0" />
                <div
                  className="text-[10px] sm:text-[11px] font-bold text-[#3B1F08] tracking-wider uppercase font-serif"
                  style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                >
                  Rahul Kamat
                </div>
                <div className="text-[9px] text-[#5A3816] font-mono">
                  Founder & Grand Master SDET, NGTA
                </div>
              </div>

              {/* Centerpiece: Authentic 1600s Royal Crimson Wax Seal */}
              <div
                onClick={handleSealClick}
                className={`relative cursor-pointer transition-transform duration-200 select-none ${
                  sealClicked ? "scale-90" : "hover:scale-105"
                }`}
                title="Royal Crimson Wax Seal of the NextGen Testing Academy (Click to Stamp)"
              >
                <div className="relative w-24 sm:w-28 h-24 sm:h-28 flex items-center justify-center animate-wax-seal rounded-full">
                  <img
                    src="/antique-wax-seal.jpg"
                    alt="Royal Crimson Wax Seal 1600s"
                    className="w-full h-full object-contain rounded-full shadow-[0_12px_30px_rgba(0,0,0,0.85)]"
                  />
                </div>
              </div>

              {/* Right Signature: Academic Dean */}
              <div className="text-center sm:text-right space-y-1 min-w-[190px]">
                <div
                  className="text-3xl sm:text-4xl text-[#1E0D03] leading-none select-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]"
                  style={{ fontFamily: "'Alex Brush', cursive" }}
                >
                  Dr. Eric Vance
                </div>
                <div className="h-[1px] w-40 bg-[#5C3819]/60 mx-auto sm:ml-auto" />
                <div
                  className="text-[10px] sm:text-[11px] font-bold text-[#3B1F08] tracking-wider uppercase font-serif"
                  style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                >
                  Dr. Eric Vance
                </div>
                <div className="text-[9px] text-[#5A3816] font-mono">
                  Grand Chancellor & Chief Architect
                </div>
              </div>
            </div>

            {/* Footer Footnote: Serial, SHA-256 Hash & Date */}
            <div className="pt-3 border-t border-[#8B5A2B]/25 flex flex-col sm:flex-row items-center justify-between text-[9px] text-[#5A3816] font-mono gap-2 text-center sm:text-left">
              <div>
                <span>SEAL SERIAL: </span>
                <span className="font-bold text-[#2A1507]">{activeCourse.serialNumber}</span>
              </div>
              <div className="truncate max-w-xs sm:max-w-md">
                <span>DIGITAL CIPHER: </span>
                <span className="font-bold text-[#2A1507]">{activeCourse.sha256Hash.substring(0, 32)}...</span>
              </div>
              <div>
                <span>CONFERRED: </span>
                <span className="font-bold text-[#2A1507]">{activeCourse.conferredDate}</span>
              </div>
            </div>
          </div>
        </div>
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
            <span className="px-2.5 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-[10px] rounded">
              VERIFIED & IMMUTABLE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-[11px]">
            <div>
              <span className="text-[#5A5F70] block uppercase text-[10px]">Registry Identifier</span>
              <span className="text-white font-bold">{activeCourse.serialNumber}</span>
            </div>
            <div>
              <span className="text-[#5A5F70] block uppercase text-[10px]">Academic Evaluation Grade</span>
              <span className="text-[#EFFF4F] font-bold">{activeCourse.grade}</span>
            </div>
            <div>
              <span className="text-[#5A5F70] block uppercase text-[10px]">Conferred Date</span>
              <span className="text-white font-bold">{activeCourse.conferredDate}</span>
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
              className="px-4 py-2 bg-[#333336] text-white hover:text-[#EFFF4F] border border-[#3E3E43] rounded font-bold uppercase transition-colors flex items-center gap-1.5"
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
          </div>

          <a
            href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
              activeCourse.courseTitle
            )}&organizationName=NextGen+Testing+Academy&issueYear=2026&issueMonth=10&certUrl=${encodeURIComponent(
              typeof window !== "undefined"
                ? `${window.location.origin}/verify?certId=${activeCourse.serialNumber}`
                : ""
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 bg-[#0A66C2] hover:bg-[#004182] text-white font-bold uppercase rounded flex items-center justify-center gap-2 transition-colors shadow-sm text-center"
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
