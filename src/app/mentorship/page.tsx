"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Trophy,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  Phone,
  Mail,
  CheckCircle2,
  Star,
  Users,
  Sparkles,
  X,
  Send,
  Video,
  ChevronRight,
  Shield,
  Compass,
} from "lucide-react";

export default function MentorshipPage() {
  // Interactive 1-on-1 Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState("JEE Preparation / SDET Accelerator");
  const [selectedSlot, setSelectedSlot] = useState("Mon, Oct 05 • 10:00 AM");
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const programs = [
    {
      id: "jee-prep",
      title: "JEE Preparation",
      subtitle: "SDET Career Accelerator",
      desc: "Advanced preparation programs with concept-focused learning and mentorship.",
      icon: GraduationCap,
      badge: "Flagship",
      stats: "1-on-1 Weekly Coaching",
    },
    {
      id: "neet-coach",
      title: "NEET Coaching",
      subtitle: "Automation Architecture & POM",
      desc: "Premium medical entrance guidance with personalized support systems.",
      icon: BookOpen,
      badge: "Comprehensive",
      stats: "Deep-Dive Code Reviews",
    },
    {
      id: "foundation",
      title: "Foundation Courses",
      subtitle: "Systems Design & Coding Gauntlet",
      desc: "Future-ready academic programs designed for school students and beginners.",
      icon: Trophy,
      badge: "Core Mastery",
      stats: "Live Technical Interviews",
    },
  ];

  const availableSlots = [
    "Mon, Oct 05 • 10:00 AM",
    "Mon, Oct 05 • 03:00 PM",
    "Tue, Oct 06 • 11:30 AM",
    "Wed, Oct 07 • 05:00 PM",
    "Thu, Oct 08 • 07:00 PM",
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConfirmed(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-[#0F172A] font-sans antialiased selection:bg-[#6366F1] selection:text-white pb-20">
      {/* ======================================================== */}
      {/* SUB-NAVBAR HEADER (MATCHING "ARCH" REFERENCE)           */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo */}
          <Link href="/mentorship" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tight text-[#4F46E5] uppercase group-hover:opacity-90 transition-opacity">
              ARCH
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 bg-[#EEF2FF] text-[#4F46E5] rounded-full hidden sm:inline">
              Mentorship
            </span>
          </Link>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-[#4F46E5] transition-colors">
              Home
            </Link>
            <Link href="/courses" className="hover:text-[#4F46E5] transition-colors">
              Courses
            </Link>
            <a href="#mentors" className="text-[#4F46E5] font-semibold">
              Mentors
            </a>
            <Link href="/leaderboard" className="hover:text-[#4F46E5] transition-colors">
              Results
            </Link>
            <a href="#contact" className="hover:text-[#4F46E5] transition-colors">
              Contact
            </a>
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setBookingConfirmed(false);
                setIsBookingOpen(true);
              }}
              className="px-6 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold rounded-full shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 transition-all hover:scale-[1.02] cursor-pointer"
            >
              Enroll Now
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24 pt-8 sm:pt-12">
        {/* ======================================================== */}
        {/* SECTION 1: HERO SECTION                                 */}
        {/* "Learn Smarter Grow Faster."                            */}
        {/* ======================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#EEF2FF] border border-[#E0E7FF] text-[#4F46E5] text-xs font-semibold rounded-full shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Future Focused Learning</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Learn <br />
              <span className="text-[#4F46E5]">Smarter</span> <br />
              Grow Faster.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              A modern coaching institute website with premium purple aesthetics, clean layouts, strong typography, smooth spacing, and a fresh student-focused experience.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                onClick={() => {
                  setBookingConfirmed(false);
                  setIsBookingOpen(true);
                }}
                className="px-7 py-3.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-sm rounded-full shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all hover:scale-[1.02] flex items-center gap-2"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                href="/courses"
                className="px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-full border border-slate-200 shadow-xs hover:border-slate-300 transition-all"
              >
                Explore Courses
              </Link>
            </div>
          </div>

          {/* Right Visual Image Column with Floating Stats Card */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-white">
              <Image
                src="/arch-hero-mentee.jpg"
                alt="Student studying with mentor"
                fill
                priority
                className="object-cover"
              />

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent pointer-events-none" />

              {/* Floating Overlaid Stats Card (Exactly like reference) */}
              <div className="absolute bottom-5 right-5 sm:bottom-6 sm:right-6 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-xl border border-slate-100 flex items-center divide-x divide-slate-100">
                <div className="pr-4 sm:pr-6 text-center">
                  <div className="text-xl sm:text-2xl font-black text-[#4F46E5]">10K+</div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
                    Students Trained
                  </div>
                </div>
                <div className="pl-4 sm:pl-6 text-center">
                  <div className="text-xl sm:text-2xl font-black text-slate-900">96%</div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
                    Success Rate
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 2: "Built For The Next Generation."             */}
        {/* ======================================================== */}
        <section id="mentors" className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center pt-4">
          {/* Left Collaboration Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-slate-100 bg-white">
              <Image
                src="/arch-collab-group.jpg"
                alt="Group of students collaborating"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#4F46E5]">
              Modern Education
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Built For The <br />
                Next Generation.
              </h2>
              {/* Sleek purple underline accent bar */}
              <div className="w-16 h-1 bg-[#4F46E5] rounded-full" />
            </div>

            <p className="text-base text-slate-600 leading-relaxed max-w-lg">
              Designed with smooth visual flow, modern spacing, minimal layouts, and premium educational branding that feels completely different from ordinary coaching websites.
            </p>

            {/* Dual Stats Row */}
            <div className="grid grid-cols-2 gap-6 pt-3">
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-slate-900">120+</div>
                <div className="text-sm text-slate-500 font-medium">Expert Mentors</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-slate-900">35+</div>
                <div className="text-sm text-slate-500 font-medium">Advanced Programs</div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 3: "Popular Programs." (3 CARDS GRID)           */}
        {/* ======================================================== */}
        <section className="space-y-10 pt-4">
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Popular Programs.
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Structured modern sections with balanced spacing, smooth visuals, and clean desktop-first layouts.
            </p>
          </div>

          {/* 3 Program Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {programs.map((program) => {
              const Icon = program.icon;
              return (
                <div
                  key={program.id}
                  onClick={() => {
                    setSelectedProgram(`${program.title} (${program.subtitle})`);
                    setBookingConfirmed(false);
                    setIsBookingOpen(true);
                  }}
                  className="bg-white rounded-3xl p-8 border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between space-y-6 group"
                >
                  <div className="space-y-5">
                    {/* Purple Square Icon Container (Exactly like reference) */}
                    <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 stroke-[2.2]" />
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-[#4F46E5] transition-colors">
                        {program.title}
                      </h3>
                      <div className="text-xs font-semibold text-[#4F46E5] uppercase tracking-wider">
                        {program.subtitle}
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed pt-1">
                        {program.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>{program.stats}</span>
                    <span className="text-[#4F46E5] group-hover:translate-x-1 transition-transform flex items-center gap-1 font-bold">
                      <span>Explore</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 4: "Education That Feels Inspiring."            */}
        {/* ======================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center pt-4">
          {/* Left Student Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-slate-100 bg-white">
              <Image
                src="/arch-focused-student.jpg"
                alt="Focused student with headphones"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#EEF2FF] border border-[#E0E7FF] text-[#4F46E5] text-xs font-semibold rounded-full shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Premium Learning Experience</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Education That <br />
              <span className="text-[#4F46E5]">Feels</span> Inspiring.
            </h2>

            <p className="text-base text-slate-600 leading-relaxed max-w-lg">
              Clean white and soft purple aesthetics combined with modern layouts, strong typography, and smooth premium website composition.
            </p>

            <div className="pt-2">
              <button
                onClick={() => {
                  setBookingConfirmed(false);
                  setIsBookingOpen(true);
                }}
                className="px-8 py-3.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-sm rounded-full shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all hover:scale-[1.02]"
              >
                Join ARCH
              </button>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 5: CAMPUS & CLASS TIMINGS CARDS                 */}
        {/* ======================================================== */}
        <section id="contact" className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-4">
          {/* Card 1: Visit Campus */}
          <div className="bg-white rounded-3xl p-7 sm:p-9 border border-slate-100 shadow-md space-y-5">
            <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5]">
              <MapPin className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900">Visit Campus</h3>
              <p className="text-xs text-slate-500">Innovation District Headquarters & Virtual Studio</p>
            </div>

            <div className="space-y-3 pt-2 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#4F46E5] shrink-0 mt-1" />
                <span>21 Future Avenue, Innovation District, NY 10001</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#4F46E5] shrink-0" />
                <span>+1 800 456 8280</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#4F46E5] shrink-0" />
                <span>hello@archacademy.com</span>
              </div>
            </div>
          </div>

          {/* Card 2: Class Timings */}
          <div className="bg-white rounded-3xl p-7 sm:p-9 border border-slate-100 shadow-md space-y-5">
            <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5]">
              <Calendar className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900">Class Timings</h3>
              <p className="text-xs text-slate-500">Live Mentorship Hours & Dedicated Review Blocks</p>
            </div>

            <div className="space-y-3.5 pt-2 text-sm text-slate-700 font-medium">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#4F46E5]" />
                  <span>Monday - Friday</span>
                </div>
                <span className="font-bold text-slate-900">6 AM - 8 PM</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#4F46E5]" />
                  <span>Saturday</span>
                </div>
                <span className="font-bold text-slate-900">9 AM - 5 PM</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#4F46E5]" />
                  <span>Sunday</span>
                </div>
                <span className="font-bold text-[#4F46E5]">Online Sessions Only</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ======================================================== */}
      {/* INTERACTIVE 1-ON-1 BOOKING MODAL (JOIN ARCH / ENROLL)    */}
      {/* ======================================================== */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 animate-fadeIn relative">
            <button
              onClick={() => setIsBookingOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingConfirmed ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Session Confirmed!</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Your 1-on-1 mentorship session for <strong className="text-slate-900">{selectedProgram}</strong> has been booked for <strong className="text-[#4F46E5]">{selectedSlot}</strong>.
                </p>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 font-mono">
                  Google Meet link & syllabus notes sent to {studentEmail || "your email"}.
                </div>
                <button
                  onClick={() => setIsBookingOpen(false)}
                  className="w-full py-3 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold rounded-full shadow-md transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[#4F46E5] uppercase tracking-wider">
                    ARCH Mentorship
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    Book 1-on-1 Mentorship
                  </h3>
                  <p className="text-xs text-slate-500">
                    Schedule direct private guidance with our senior faculty.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Tanmay Sharma"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4F46E5] text-sm text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="e.g. student@gmail.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4F46E5] text-sm text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Select Program Track
                    </label>
                    <select
                      value={selectedProgram}
                      onChange={(e) => setSelectedProgram(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4F46E5] text-sm text-slate-900 bg-white"
                    >
                      <option value="JEE Preparation / SDET Accelerator">JEE Preparation / SDET Accelerator</option>
                      <option value="NEET Coaching / Automation Architecture">NEET Coaching / Automation Architecture</option>
                      <option value="Foundation Courses / Systems Design">Foundation Courses / Systems Design</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Choose Available Time Slot
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-2 rounded-lg text-xs font-medium border text-left transition-all ${
                            selectedSlot === slot
                              ? "border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5] font-bold"
                              : "border-slate-200 hover:border-slate-300 text-slate-600"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold rounded-full shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Confirm Mentorship Booking</span>
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
