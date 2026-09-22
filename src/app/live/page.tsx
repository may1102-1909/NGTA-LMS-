"use client";

import React, { useState } from "react";
import { INITIAL_LIVE_SESSIONS } from "@/lib/mockData";
import { Video, Calendar, Clock, Users, ArrowUpRight, CheckCircle2, Radio } from "lucide-react";

export default function LiveTrainingPage() {
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);

  const handleRegister = (id: string) => {
    if (!registeredIds.includes(id)) {
      setRegisteredIds((prev) => [...prev, id]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="border-b border-[#3E3E43] pb-6">
        <div className="font-mono text-xs text-[#5A5F70] uppercase tracking-widest mb-1">
          LIVE WORKSHOPS & BOOTCAMPS
        </div>
        <h1 className="text-4xl font-black text-white uppercase tracking-tight">
          LIVE WORKSHOPS & ARCHITECTURE SESSIONS
        </h1>
        <p className="text-[#A0A5B5] text-sm max-w-2xl font-sans mt-2">
          Interactive real-time engineering labs with industry SDET leaders. Live debugging, architecture reviews, and automated post-session recording access.
        </p>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {INITIAL_LIVE_SESSIONS.map((session) => {
          const isRegistered = registeredIds.includes(session.id);

          return (
            <div
              key={session.id}
              className="border border-[#3E3E43] bg-[#333336] p-6 sm:p-8 flex flex-col justify-between shadow-card space-y-6"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#EFFF4F] border border-[#EFFF4F]/30 bg-[#EFFF4F]/10 px-2 py-0.5">
                    <Radio className="w-3 h-3 animate-pulse text-[#EFFF4F]" />
                    LIVE INTERACTIVE LAB
                  </span>
                  <span className="font-mono text-xs text-[#5A5F70]">
                    CAPACITY: {session.capacity} SEATS
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white tracking-tight leading-snug">
                  {session.title}
                </h3>

                <div className="space-y-2 border-y border-[#3E3E43] py-3 font-mono text-xs text-[#A0A5B5]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#5A5F70]" />
                    <span>DATE: {session.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#5A5F70]" />
                    <span>TIME: {session.startTime} - {session.endTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#5A5F70]" />
                    <span>INSTRUCTOR: {session.instructorName}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                {isRegistered ? (
                  <div className="p-3 bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 text-[#EFFF4F] font-mono text-xs font-bold text-center flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    REGISTERED • CALENDAR INVITE & ZOOM LINK SENT
                  </div>
                ) : (
                  <button
                    onClick={() => handleRegister(session.id)}
                    className="w-full py-3.5 bg-[#EFFF4F] text-[#28282B] font-mono text-xs uppercase font-bold hover:bg-[#EFFF4F]/90 transition-colors shadow-lemon-sm flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>REGISTER FOR LIVE WORKSHOP</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
