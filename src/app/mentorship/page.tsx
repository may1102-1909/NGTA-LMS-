"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Check,
  Calendar,
  Clock,
  Video,
  MessageSquare,
  Star,
  Award,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  X,
  Send,
  CheckCircle2,
  Users,
  Compass,
  Zap,
} from "lucide-react";

interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  field: string;
  experience: string;
  rating: number;
  reviewsCount: number;
  hourlyRate: number;
  skills: string[];
  formats: string[];
  bio: string;
}

export default function MentorshipPage() {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState("all");
  const [selectedGoal, setSelectedGoal] = useState("Launch a startup / Lead SDET");
  const [workFormat, setWorkFormat] = useState("Videocalls");
  const [budgetMax, setBudgetMax] = useState(120);
  const [selectedDays, setSelectedDays] = useState<string[]>(["Mon", "Wed", "Fri"]);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);

  // Field carousel index
  const [fieldCarouselIndex, setFieldCarouselIndex] = useState(0);

  // Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingType, setBookingType] = useState<"free" | "paid">("free");
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedDate, setSelectedDate] = useState("Mon, Oct 05 • 05:30 PM IST");
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [sessionNotes, setSessionNotes] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Mentor fields for carousel (adapted to QA/SDET & Engineering)
  const fields = [
    {
      id: "architecture",
      title: "Architecture",
      category: "Test Architecture",
      mentorsAvailable: 54,
      image: "/mentorship/mentor-latina-lead.jpg",
      description: "POM, Concurrency & Framework Systems",
    },
    {
      id: "automation",
      title: "Automation",
      category: "Full-Stack SDET",
      mentorsAvailable: 73,
      image: "/mentorship/mentor-male-lead.jpg",
      description: "Selenium, Playwright & Web/API",
    },
    {
      id: "ai-qa",
      title: "AI & LLMs",
      category: "AI in QA",
      mentorsAvailable: 48,
      image: "/mentorship/mentor-asian-lead.jpg",
      description: "Prompt Engineering & Self-Healing",
    },
    {
      id: "cicd",
      title: "Cloud & CI/CD",
      category: "DevOps & Cloud",
      mentorsAvailable: 39,
      image: "/mentorship/mentor-male-lead.jpg",
      description: "Docker, K8s, Selenium Grid & GitHub",
    },
  ];

  // Mentors Data
  const mentors: Mentor[] = [
    {
      id: "m1",
      name: "Elena Rostova",
      role: "Staff SDET & Quality Architect",
      company: "Ex-Thoughtworks • FinTech",
      image: "/mentorship/mentor-asian-lead.jpg",
      field: "ai-qa",
      experience: "11+ yrs",
      rating: 4.98,
      reviewsCount: 142,
      hourlyRate: 85,
      skills: ["AI-Assisted Testing", "Framework Design", "Playwright", "TestNG"],
      formats: ["Videocalls", "Email or chat"],
      bio: "Mentored 350+ engineers to transition into Principal SDET and Staff Test Architect roles with structured mock evaluations.",
    },
    {
      id: "m2",
      name: "David Vance",
      role: "Lead Automation Architect",
      company: "Enterprise Cloud Systems",
      image: "/mentorship/mentor-male-lead.jpg",
      field: "automation",
      experience: "9+ yrs",
      rating: 4.95,
      reviewsCount: 118,
      hourlyRate: 75,
      skills: ["Selenium Java", "Distributed Grids", "ThreadLocal", "REST-Assured"],
      formats: ["Videocalls", "Offline meetings"],
      bio: "Specializes in enterprise test concurrency, debugging flaky CI/CD execution, and high-stakes coding rounds.",
    },
    {
      id: "m3",
      name: "Sofia Rodriguez",
      role: "Head of Quality Engineering",
      company: "Unicorn Scale-up • Silicon Valley",
      image: "/mentorship/mentor-latina-lead.jpg",
      field: "architecture",
      experience: "13+ yrs",
      rating: 5.0,
      reviewsCount: 184,
      hourlyRate: 110,
      skills: ["Systems Design", "Leadership", "Cypress / Playwright", "Docker"],
      formats: ["Videocalls", "Email or chat"],
      bio: "Former Director of Engineering. Hands-on coaching on QA leadership, salary negotiations, and building test orgs from scratch.",
    },
    {
      id: "m4",
      name: "Marcus Sterling",
      role: "Senior Performance & CI/CD Lead",
      company: "High-Frequency Trading Labs",
      image: "/mentorship/mentor-male-lead.jpg",
      field: "cicd",
      experience: "8+ yrs",
      rating: 4.92,
      reviewsCount: 89,
      hourlyRate: 70,
      skills: ["JMeter", "Gatling", "GitHub Actions", "Kubernetes"],
      formats: ["Videocalls", "Email or chat"],
      bio: "Helps engineers master load testing, bottlenecks analysis, and continuous delivery gates with zero flakiness.",
    },
  ];

  // Accordion Items (Adapted to SDET/QA & Tech Career)
  const accordionItems = [
    {
      title: "Career Growth & Interview Gauntlet",
      summary: "Advance your professional journey with senior architect guidance.",
      details:
        "1-on-1 resume tear-downs, FAANG-level Java & DSA coding mocks, system design for SDETs, and step-by-step compensation negotiation roadmaps.",
    },
    {
      title: "Architecture & Framework Engineering",
      summary: "Master enterprise-grade test automation patterns.",
      details:
        "Hands-on architectural code review of your Selenium/Playwright frameworks, ThreadLocal concurrency models, custom retry listeners, and reporting telemetry.",
    },
    {
      title: "Cloud Test Grids & CI/CD Pipelines",
      summary: "Scale tests seamlessly across distributed environments.",
      details:
        "Containerize test suites with Docker and Kubernetes, optimize GitHub Actions workflows, integrate parallel runners, and configure Slack/Teams alerting.",
    },
    {
      title: "AI & Intelligent Automation Systems",
      summary: "Supercharge your productivity with modern AI QA tools.",
      details:
        "Learn prompt engineering for automated test generation, visual regression diffing with AI, and building self-healing selector engines.",
    },
  ];

  // Day toggle handler
  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // Filtered mentors based on user controls
  const filteredMentors = useMemo(() => {
    return mentors.filter((m) => {
      // Query filter
      if (
        searchQuery &&
        !m.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !m.role.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !m.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      ) {
        return false;
      }
      // Field filter
      if (selectedField !== "all" && m.field !== selectedField) {
        return false;
      }
      // Budget filter
      if (m.hourlyRate > budgetMax) {
        return false;
      }
      // Format filter
      if (workFormat && !m.formats.includes(workFormat)) {
        return false;
      }
      return true;
    });
  }, [mentors, searchQuery, selectedField, budgetMax, workFormat]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConfirmed(true);
  };

  const openMentorBooking = (mentor: Mentor, type: "free" | "paid" = "paid") => {
    setSelectedMentor(mentor);
    setBookingType(type);
    setBookingConfirmed(false);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F8] text-[#0F172A] font-sans antialiased selection:bg-[#059669] selection:text-white pb-24">
      {/* ======================================================== */}
      {/* 1. TOP HEADER / BRAND NAVIGATION (MATCHING REFERENCE)   */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo with Modern Dot/Grid Icon */}
          <Link href="/mentorship" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-[#059669] text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              {/* Geometric 4-cluster dots */}
              <div className="grid grid-cols-2 gap-1">
                <div className="w-2 h-2 rounded-full bg-white" />
                <div className="w-2 h-2 rounded-full bg-white/80" />
                <div className="w-2 h-2 rounded-full bg-white/80" />
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-[#0F172A] leading-tight">
                MentorSphere
              </span>
              <span className="text-[10px] font-bold text-[#059669] tracking-wider uppercase">
                NGTA Expert Advising
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#about" className="hover:text-[#059669] transition-colors">
              About Us
            </a>
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-[#059669] transition-colors cursor-pointer">
                <span>Features</span>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-[#059669] transition-colors" />
              </button>
            </div>
            <a href="#partnership" className="hover:text-[#059669] transition-colors">
              Partnership
            </a>
            <Link href="/courses" className="hover:text-[#059669] transition-colors">
              Courses
            </Link>
          </nav>

          {/* Right Action: Sign Up / Book Session Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedMentor(mentors[0]);
                setBookingType("free");
                setBookingConfirmed(false);
                setIsBookingOpen(true);
              }}
              className="px-6 py-2.5 bg-white hover:bg-slate-50 text-[#0F172A] text-sm font-bold rounded-full border border-slate-300 shadow-xs hover:border-slate-400 transition-all cursor-pointer"
            >
              Sign Up
            </button>
            <button
              onClick={() => {
                setSelectedMentor(mentors[0]);
                setBookingType("paid");
                setBookingConfirmed(false);
                setIsBookingOpen(true);
              }}
              className="px-6 py-2.5 bg-[#059669] hover:bg-[#047857] text-white text-sm font-bold rounded-full shadow-md shadow-emerald-600/25 hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer hidden sm:inline-flex items-center gap-1.5"
            >
              <span>Book Session</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. MAIN COMPOSITION: HERO & RIGHT MATCHING ENGINE       */}
      {/* ======================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ==================================================== */}
          {/* LEFT 7-8 COLS: HERO BANNER & BOTTOM 2 CARDS         */}
          {/* ==================================================== */}
          <div className="lg:col-span-8 space-y-8">
            {/* Atmospheric Hero Card with Background Photo & Text */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-900 min-h-[460px] sm:min-h-[500px] flex flex-col justify-between p-7 sm:p-10 lg:p-12">
              {/* Background Office Image with Sunlit Lounge */}
              <Image
                src="/mentorship/hero-lounge.jpg"
                alt="Modern studio office with mentors discussing"
                fill
                priority
                className="object-cover object-center brightness-[0.72] contrast-[1.05]"
              />

              {/* Gradient Vignette for perfect text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-900/30 pointer-events-none" />

              {/* Hero Top Content */}
              <div className="relative z-10 space-y-4 max-w-2xl">
                {/* Headline with Embedded Circular Avatars (Exactly like Reference) */}
                <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-white tracking-tight leading-[1.12]">
                  <span>Build </span>
                  <span className="inline-flex items-center align-middle mx-1 -space-x-2.5">
                    <span className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-white shadow-md inline-block">
                      <Image
                        src="/mentorship/mentor-latina-lead.jpg"
                        alt="Mentor 1"
                        fill
                        className="object-cover"
                      />
                    </span>
                    <span className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-white shadow-md inline-block">
                      <Image
                        src="/mentorship/mentor-male-lead.jpg"
                        alt="Mentor 2"
                        fill
                        className="object-cover"
                      />
                    </span>
                    <span className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-white shadow-md inline-block">
                      <Image
                        src="/mentorship/mentor-asian-lead.jpg"
                        alt="Mentor 3"
                        fill
                        className="object-cover"
                      />
                    </span>
                  </span>
                  <span> Skills</span>
                  <br />
                  <span>with Experts</span>
                </h1>

                <p className="text-sm sm:text-base text-slate-200/90 max-w-xl font-normal leading-relaxed">
                  Find the right mentor to accelerate your personal or professional growth. Discover
                  the guidance you need to thrive in your engineering career and beyond.
                </p>
              </div>

              {/* Floating Rounded Search Bar Over Hero */}
              <div className="relative z-10 pt-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                  className="bg-white rounded-full p-2 pl-6 sm:pl-7 shadow-2xl flex items-center justify-between gap-3 max-w-xl border border-slate-100"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Search className="w-5 h-5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by framework, skill, or role..."
                      className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 sm:px-8 py-3 bg-[#059669] hover:bg-[#047857] text-white text-sm font-bold rounded-full transition-all shadow-md shrink-0 cursor-pointer active:scale-95"
                  >
                    Search
                  </button>
                </form>
              </div>
            </div>

            {/* ==================================================== */}
            {/* BOTTOM 2 CARDS (Directly under Hero, matching ref)  */}
            {/* ==================================================== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* Card 1: Explore Mentorship Opportunities (Accordion) */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md space-y-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-4">
                    Explore Mentorship Opportunities
                  </h3>

                  {/* Accordion List */}
                  <div className="divide-y divide-slate-100">
                    {accordionItems.map((item, index) => {
                      const isOpen = activeAccordion === index;
                      return (
                        <div key={item.title} className="py-3.5 first:pt-0 last:pb-0">
                          <button
                            type="button"
                            onClick={() => setActiveAccordion(isOpen ? null : index)}
                            className="w-full flex items-center justify-between text-left group cursor-pointer"
                          >
                            <span
                              className={`text-sm font-bold transition-colors ${
                                isOpen
                                  ? "text-[#059669]"
                                  : "text-slate-800 group-hover:text-slate-900"
                              }`}
                            >
                              {item.title}
                            </span>
                            {isOpen ? (
                              <ChevronUp className="w-4 h-4 text-[#059669] shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
                            )}
                          </button>

                          {isOpen ? (
                            <div className="mt-2 text-xs text-slate-600 leading-relaxed space-y-1 animate-fadeIn">
                              <p className="font-semibold text-slate-800">{item.summary}</p>
                              <p className="text-slate-500">{item.details}</p>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-500 truncate mt-0.5">{item.summary}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>4 Specialized Tracks Available</span>
                  <button
                    onClick={() => {
                      setSelectedField("all");
                    }}
                    className="text-[#059669] font-bold hover:underline"
                  >
                    View All Mentors →
                  </button>
                </div>
              </div>

              {/* Card 2: Book Your First Free Meeting (With Mentor Photo) */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md flex flex-col justify-between overflow-hidden relative group">
                <div className="space-y-3 z-10 max-w-[62%] sm:max-w-[65%]">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                    Book your first free meeting
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    You will learn how the process will go, review your framework architecture, and
                    outline your 90-day mastery roadmap.
                  </p>

                  <div className="pt-2">
                    <span className="inline-block px-3 py-1 bg-emerald-50 text-[#059669] text-[11px] font-bold rounded-full uppercase tracking-wider border border-emerald-200">
                      QUICK TIP
                    </span>
                  </div>
                </div>

                {/* Cropped Mentor Image on Right Side */}
                <div className="absolute right-0 bottom-0 top-6 w-[38%] sm:w-[35%] overflow-hidden pointer-events-none">
                  <div className="relative w-full h-full">
                    <Image
                      src="/mentorship/mentor-asian-lead.jpg"
                      alt="Mentor preview"
                      fill
                      className="object-cover object-top rounded-tl-3xl filter saturate-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent" />
                  </div>
                </div>

                <div className="pt-6 z-10">
                  <button
                    onClick={() => {
                      setSelectedMentor(mentors[0]);
                      setBookingType("free");
                      setBookingConfirmed(false);
                      setIsBookingOpen(true);
                    }}
                    className="px-5 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold rounded-full transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>Claim Free 15-Min Slot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================== */}
          {/* RIGHT 4-5 COLS: MENTOR MATCHING & FILTER CONSOLE     */}
          {/* ==================================================== */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xl space-y-6 text-[#0F172A] sticky top-24">
              {/* Carousel Header: "Choose a professional field" */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    Choose a professional field
                  </h2>

                  {/* Navigation Arrows */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setFieldCarouselIndex((prev) => (prev > 0 ? prev - 1 : fields.length - 1))
                      }
                      className="w-7 h-7 rounded-full border border-slate-200 hover:border-slate-300 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFieldCarouselIndex((prev) => (prev < fields.length - 1 ? prev + 1 : 0))
                      }
                      className="w-7 h-7 rounded-full border border-slate-200 hover:border-slate-300 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Carousel Card Thumbnails */}
                <div className="grid grid-cols-3 gap-2.5">
                  {fields.slice(0, 3).map((f) => {
                    const isSelected = selectedField === f.id;
                    return (
                      <div
                        key={f.id}
                        onClick={() => setSelectedField(isSelected ? "all" : f.id)}
                        className={`relative rounded-2xl overflow-hidden aspect-[4/5] cursor-pointer group transition-all duration-200 border-2 ${
                          isSelected
                            ? "border-[#059669] ring-2 ring-emerald-500/20 shadow-md scale-[1.02]"
                            : "border-transparent hover:border-slate-300"
                        }`}
                      >
                        <Image
                          src={f.image}
                          alt={f.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                        <div className="absolute bottom-2 left-2 right-2 text-white">
                          <div className="text-[11px] font-bold leading-tight">{f.title}</div>
                          <div className="text-[9px] text-slate-300 leading-tight">
                            {f.mentorsAvailable} Mentors
                          </div>
                        </div>

                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#059669] text-white flex items-center justify-center shadow-xs">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Goal Dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Your final goal</label>
                <div className="relative">
                  <select
                    value={selectedGoal}
                    onChange={(e) => setSelectedGoal(e.target.value)}
                    className="w-full appearance-none bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#059669] cursor-pointer pr-10"
                  >
                    <option value="Launch a startup / Lead SDET">
                      Crack FAANG / Tier-1 SDET Interview
                    </option>
                    <option value="Architect Enterprise Framework">
                      Architect Enterprise Automation Framework
                    </option>
                    <option value="Switch from Manual to Automation">
                      Switch from Manual QA to Automation Lead
                    </option>
                    <option value="Master CI/CD & Cloud Grid">
                      Master Cloud Grids & CI/CD Pipelines
                    </option>
                    <option value="AI in Testing & QA Automation">
                      Deploy AI-Driven QA & Autonomous Testing
                    </option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Work Format Segmented Toggle */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Work format</label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                  {["Videocalls", "Offline meetings", "Email or chat"].map((fmt) => {
                    const active = workFormat === fmt;
                    return (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setWorkFormat(fmt)}
                        className={`py-2 px-1 text-[11px] font-bold rounded-lg transition-all text-center truncate ${
                          active
                            ? "bg-[#059669] text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {fmt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Budget Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-700">Budget</label>
                  <span className="font-bold text-[#059669]">Up to ${budgetMax}/hr</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-md">
                    $50
                  </span>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    step="5"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(Number(e.target.value))}
                    className="w-full accent-[#059669] cursor-pointer"
                  />
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-md">
                    $150
                  </span>
                </div>
              </div>

              {/* Convenient Time Day Picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Convenient time</label>
                <div className="grid grid-cols-7 gap-1.5">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => {
                    const isChecked = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className="flex flex-col items-center gap-1 group cursor-pointer"
                      >
                        <span className="text-[10px] font-semibold text-slate-500">{day}</span>
                        <div
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                            isChecked
                              ? "bg-[#059669] border-[#059669] text-white shadow-xs"
                              : "border-slate-300 bg-white hover:border-slate-400 text-transparent"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    // Scroll to filtered mentors directory
                    const el = document.getElementById("mentors-directory");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full py-3.5 bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm rounded-full shadow-lg shadow-emerald-600/25 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                >
                  <Search className="w-4 h-4" />
                  <span>Find your mentor ({filteredMentors.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedMentor(filteredMentors[0] || mentors[0]);
                    setBookingType("paid");
                    setBookingConfirmed(false);
                    setIsBookingOpen(true);
                  }}
                  className="w-full py-3.5 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-sm rounded-full transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book a call</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. MATCHED MENTORS DIRECTORY SECTION                    */}
        {/* ======================================================== */}
        <section id="mentors-directory" className="pt-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="text-xs font-bold text-[#059669] uppercase tracking-wider">
                Vetted Senior Faculty
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Recommended Expert Mentors
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Showing {filteredMentors.length} mentor{filteredMentors.length === 1 ? "" : "s"}{" "}
                matching your filters.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-slate-500">Filter Field:</span>
              <button
                onClick={() => setSelectedField("all")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                  selectedField === "all"
                    ? "bg-[#059669] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Fields
              </button>
              {fields.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedField(f.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors hidden sm:inline-block ${
                    selectedField === f.id
                      ? "bg-[#059669] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f.title}
                </button>
              ))}
            </div>
          </div>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMentors.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-4">
                  {/* Photo & Badge */}
                  <div className="relative aspect-[4/4.5] rounded-2xl overflow-hidden bg-slate-100">
                    <Image
                      src={m.image}
                      alt={m.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-full text-[11px] font-bold text-slate-800 shadow-xs flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{m.rating}</span>
                      <span className="text-slate-400">({m.reviewsCount})</span>
                    </div>

                    <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-[#0F172A]/90 backdrop-blur-md text-white text-[11px] font-bold rounded-full shadow-xs">
                      ${m.hourlyRate}/hr
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-[#059669] transition-colors">
                      {m.name}
                    </h3>
                    <div className="text-xs font-bold text-[#059669]">{m.role}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{m.company}</div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{m.bio}</p>

                  {/* Skills Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {m.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <button
                    onClick={() => openMentorBooking(m, "paid")}
                    className="w-full py-2.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-full transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Book 1-on-1 Session</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => openMentorBooking(m, "free")}
                    className="w-full py-1.5 text-slate-600 hover:text-slate-900 text-[11px] font-semibold transition-colors"
                  >
                    Free 15-Min Intro Call →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ======================================================== */}
      {/* 4. INTERACTIVE 1-ON-1 BOOKING MODAL                      */}
      {/* ======================================================== */}
      {isBookingOpen && selectedMentor && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 animate-fadeIn relative">
            <button
              onClick={() => setIsBookingOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingConfirmed ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Session Confirmed!</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Your{" "}
                  <strong className="text-slate-900">
                    {bookingType === "free" ? "Free Discovery Call" : "1-on-1 Deep-Dive Session"}
                  </strong>{" "}
                  with <strong className="text-[#059669]">{selectedMentor.name}</strong> is
                  scheduled for <strong className="text-slate-900">{selectedDate}</strong>.
                </p>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 font-mono space-y-1 text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mentor:</span>
                    <span className="font-bold text-slate-800">{selectedMentor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rate:</span>
                    <span className="font-bold text-emerald-600">
                      {bookingType === "free" ? "Free ($0.00)" : `$${selectedMentor.hourlyRate}/hr`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-bold text-slate-800">
                      {studentEmail || "learner@example.com"}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    Google Meet calendar invitation & prep notes sent to your inbox.
                  </div>
                </div>

                <button
                  onClick={() => setIsBookingOpen(false)}
                  className="w-full py-3 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-full shadow-md transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-200 shrink-0">
                    <Image
                      src={selectedMentor.image}
                      alt={selectedMentor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#059669] uppercase tracking-wider">
                      {bookingType === "free" ? "Free 15-Min Intro" : "1-on-1 Mentorship Booking"}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 leading-snug">
                      {selectedMentor.name}
                    </h3>
                    <p className="text-xs text-slate-500">{selectedMentor.role}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Alex Chen"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#059669] text-sm text-slate-900 bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="e.g. alex@company.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#059669] text-sm text-slate-900 bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Choose Time Slot
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {[
                        "Mon, Oct 05 • 05:30 PM IST",
                        "Mon, Oct 05 • 08:00 PM IST",
                        "Wed, Oct 07 • 06:00 PM IST",
                        "Fri, Oct 09 • 07:30 PM IST",
                      ].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedDate(slot)}
                          className={`p-2 rounded-xl text-left font-medium border transition-all ${
                            selectedDate === slot
                              ? "border-[#059669] bg-emerald-50 text-[#059669] font-bold"
                              : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Session Topic or Goal (Optional)
                    </label>
                    <input
                      type="text"
                      value={sessionNotes}
                      onChange={(e) => setSessionNotes(e.target.value)}
                      placeholder="e.g. Review TestNG framework architecture & Playwright migration"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#059669] text-sm text-slate-900 bg-slate-50"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-full shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {bookingType === "free"
                        ? "Confirm Free Discovery Call"
                        : `Confirm Booking ($${selectedMentor.hourlyRate})`}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
