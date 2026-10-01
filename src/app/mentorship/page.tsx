"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  Star,
  Users,
  MessageSquare,
  Award,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { INSTRUCTOR_PROFILE } from "@/lib/mockData";

export default function MentorshipPage() {
  const [selectedTopic, setSelectedTopic] = useState("Framework Architecture Review");
  const [selectedSlot, setSelectedSlot] = useState("Sat, Sep 26 • 11:00 AM IST");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const topics = [
    {
      id: "arch-review",
      title: "Framework Architecture Review",
      desc: "Deep-dive code review of your Selenium/Playwright framework, ThreadLocal patterns, and POM design.",
      duration: "45 mins",
    },
    {
      id: "mock-interview",
      title: "Mock SDET Technical Interview",
      desc: "Real-world SDET coding challenges, Java OOP questions, and behavioral interview simulation.",
      duration: "60 mins",
    },
    {
      id: "pipeline-debug",
      title: "CI/CD & Jenkins Pipeline Debugging",
      desc: "Fix flaky tests, Docker containerization, cross-browser grid execution, and report integration.",
      duration: "45 mins",
    },
    {
      id: "career-strategy",
      title: "QA to SDET Career Transition Strategy",
      desc: "Resume optimization, salary negotiation insights, and target company roadmap.",
      duration: "30 mins",
    },
  ];

  const availableSlots = [
    "Sat, Sep 26 • 11:00 AM IST",
    "Sat, Sep 26 • 04:00 PM IST",
    "Sun, Sep 27 • 10:00 AM IST",
    "Sun, Sep 27 • 06:00 PM IST",
    "Tue, Sep 29 • 07:30 PM IST",
  ];

  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConfirmed(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="border-b border-[#3E3E43] pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="font-mono text-xs text-[#5A5F70] uppercase tracking-widest mb-1 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 text-[#EFFF4F] font-bold text-[10px]">
              PRIVATE OFFICE HOURS
            </span>
            <span>•</span>
            <span className="text-[#A0A5B5]">1-ON-1 SDET ADVISING</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span>1-ON-1 MENTORSHIP & ARCHITECTURE CLINIC</span>
            <Calendar className="w-8 h-8 text-[#EFFF4F] shrink-0" />
          </h1>
          <p className="text-sm text-[#A0A5B5] mt-2 max-w-3xl">
            Book focused, private 1-on-1 sessions directly with lead automation architects to review your test code, prepare for high-tier SDET interviews, and unblock complex pipeline challenges.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <Link
            href="/courses"
            className="px-4 py-2 border border-[#3E3E43] bg-[#333336] text-[#A0A5B5] hover:text-[#EFFF4F] hover:border-[#EFFF4F]/40 font-bold uppercase transition-colors"
          >
            Course Catalog
          </Link>
        </div>
      </div>

      {/* Lead Mentor Feature Banner */}
      <div className="border border-[#3E3E43] bg-[#333336] p-6 sm:p-8 rounded-lg shadow-card flex flex-col md:flex-row items-center gap-6">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-lg overflow-hidden border-2 border-[#EFFF4F] shrink-0">
          <Image
            src={INSTRUCTOR_PROFILE.avatarUrl}
            alt={INSTRUCTOR_PROFILE.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-2 flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 font-mono text-xs">
            <span className="px-2.5 py-0.5 bg-[#EFFF4F] text-[#28282B] font-bold uppercase text-[10px]">
              LEAD MENTOR
            </span>
            <span className="text-emerald-400 font-bold">17+ YEARS QA & SDET ARCHITECT</span>
            <span className="text-[#A0A5B5]">• 10,000+ MENTORED</span>
          </div>
          <h2 className="text-2xl font-black text-white">{INSTRUCTOR_PROFILE.name}</h2>
          <p className="text-sm text-[#A0A5B5] leading-relaxed max-w-2xl font-sans">
            Founder and lead automation architect at NextGen Testing Academy. Expert in scalable Selenium 4 POM frameworks, ThreadLocal parallel runs, and CI/CD quality gates.
          </p>
        </div>

        <div className="shrink-0 flex flex-col items-center md:items-end gap-1 font-mono text-xs">
          <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>4.9 / 5.0 Rating</span>
          </div>
          <span className="text-[#A0A5B5] text-[11px]">1,840+ Verified Student Reviews</span>
        </div>
      </div>

      {/* Booking Layout: Topic Selection & Slots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Topics */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-mono text-xs text-[#5A5F70] uppercase tracking-widest">
            STEP 1: SELECT MENTORSHIP FOCUS
          </h3>

          <div className="space-y-3">
            {topics.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTopic(t.title)}
                className={`p-5 border cursor-pointer transition-all rounded-lg ${
                  selectedTopic === t.title
                    ? "border-[#EFFF4F] bg-[#242428] shadow-lemon-sm"
                    : "border-[#3E3E43] bg-[#28282B] hover:border-[#EFFF4F]/40"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white font-sans flex items-center gap-2">
                      <span>{t.title}</span>
                      {selectedTopic === t.title && (
                        <span className="text-[#EFFF4F]">✓</span>
                      )}
                    </h4>
                    <p className="text-xs text-[#A0A5B5] font-sans leading-relaxed">
                      {t.desc}
                    </p>
                  </div>
                  <span className="font-mono text-xs px-2 py-0.5 bg-[#333336] text-[#EFFF4F] border border-[#3E3E43] shrink-0 ml-2">
                    {t.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Time Slot & Booking Confirmation */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="font-mono text-xs text-[#5A5F70] uppercase tracking-widest">
            STEP 2: CHOOSE AVAILABLE TIME SLOT
          </h3>

          <div className="border border-[#3E3E43] bg-[#333336] p-6 space-y-5 rounded-lg shadow-card font-mono text-xs">
            {bookingConfirmed ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 space-y-3 text-center">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400" />
                <h4 className="text-base font-black text-white uppercase font-sans">
                  Session Booked Successfully!
                </h4>
                <div className="space-y-1 text-xs text-[#A0A5B5]">
                  <p><strong className="text-white">Topic:</strong> {selectedTopic}</p>
                  <p><strong className="text-white">Time:</strong> {selectedSlot}</p>
                  <p><strong className="text-white">Platform:</strong> Google Meet (Link sent via email)</p>
                </div>
                <button
                  onClick={() => setBookingConfirmed(false)}
                  className="mt-3 px-4 py-2 border border-emerald-500/40 text-emerald-300 font-bold uppercase hover:bg-emerald-500/20 transition-colors w-full"
                >
                  Book another session
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookSession} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-[#A0A5B5] uppercase block">
                    Available Office Hours (IST)
                  </label>
                  <div className="space-y-2">
                    {availableSlots.map((slot) => (
                      <label
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${
                          selectedSlot === slot
                            ? "border-[#EFFF4F] bg-[#242428] text-white"
                            : "border-[#3E3E43] bg-[#28282B] text-[#A0A5B5] hover:text-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="mentorship_slot"
                          checked={selectedSlot === slot}
                          onChange={() => setSelectedSlot(slot)}
                          className="accent-[#EFFF4F]"
                        />
                        <Clock className="w-3.5 h-3.5 text-[#5A5F70]" />
                        <span className="font-bold">{slot}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-[#28282B] border border-[#3E3E43] space-y-1">
                  <div className="text-[10px] text-[#5A5F70] uppercase">SELECTED SUMMARY</div>
                  <div className="text-white font-bold font-sans text-xs">{selectedTopic}</div>
                  <div className="text-[#EFFF4F] text-[11px]">{selectedSlot}</div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#EFFF4F] text-[#28282B] font-bold uppercase hover:bg-[#EFFF4F]/90 transition-colors flex items-center justify-center gap-2 shadow-lemon-sm"
                >
                  <Video className="w-4 h-4" />
                  <span>Confirm Mentorship Booking</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
