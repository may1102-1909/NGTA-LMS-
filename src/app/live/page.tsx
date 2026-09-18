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
      <div className="border-b-2 border-zinc-900 pb-6">
        <div className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-1">
          [LIVE BOOTCAMPS // BRD SECTION 24]
        </div>
        <h1 className="text-4xl font-black text-zinc-950 uppercase tracking-tight">
          LIVE WORKSHOPS & ARCHITECTURE SESSIONS
        </h1>
        <p className="text-zinc-600 text-sm max-w-2xl font-sans mt-2">
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
              className="border-2 border-zinc-900 bg-white p-6 sm:p-8 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-6"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 font-mono text-xs font-bold text-red-600 border border-red-200 bg-red-50 px-2 py-0.5">
                    <Radio className="w-3 h-3 animate-pulse text-red-600" />
                    LIVE INTERACTIVE LAB
                  </span>
                  <span className="font-mono text-xs text-zinc-500">
                    CAPACITY: {session.capacity} SEATS
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-zinc-950 tracking-tight leading-snug">
                  {session.title}
                </h3>

                <div className="space-y-2 border-y border-zinc-200 py-3 font-mono text-xs text-zinc-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    <span>DATE: {session.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    <span>TIME: {session.startTime} - {session.endTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-zinc-500" />
                    <span>INSTRUCTOR: {session.instructorName}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                {isRegistered ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-500 text-emerald-900 font-mono text-xs font-bold text-center flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    REGISTERED • CALENDAR INVITE & ZOOM LINK SENT
                  </div>
                ) : (
                  <button
                    onClick={() => handleRegister(session.id)}
                    className="w-full py-3.5 bg-zinc-950 text-white font-mono text-xs uppercase font-bold hover:bg-blue-600 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2"
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
