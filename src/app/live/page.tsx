"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Radio,
  Calendar,
  Clock,
  Video,
  Users,
  CheckCircle2,
  Bell,
  ArrowRight,
  ExternalLink,
  Play,
  FileText,
  Sparkles,
  Loader2,
  ChevronLeft,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

interface LiveSession {
  id: string;
  title: string;
  description: string;
  courseId: string;
  instructorName: string;
  scheduledAt: string;
  streamUrl: string;
  recordingUrl?: string | null;
  status: "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELLED";
  registrationCount: number;
  attendedCount: number;
  isUserRegistered: boolean;
  userAttendance?: string | null;
}

export default function LearnerLiveTrainingPage() {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        let currentId: string | null = null;
        if (supabaseUrl && supabaseAnonKey) {
          const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user?.id) {
            currentId = user.id;
            setUserId(user.id);
          }
        }

        const url = currentId ? `/api/live?userId=${currentId}` : "/api/live";
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.sessions) {
            setSessions(data.sessions);
          }
        }
      } catch (err) {
        console.error("Failed to load live sessions:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleRegister = async (sessionId: string) => {
    setProcessingId(sessionId);
    setNotificationMsg(null);

    try {
      // BRD Section 46: Enrolled learners can click "Register for Live Class". Store registration in Supabase and queue a Web Push notification reminder.
      const res = await fetch("/api/live/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to register for live class");
      }

      setNotificationMsg(
        "Registration confirmed! Web Push notification reminder has been queued for this session."
      );

      // Update state locally
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                isUserRegistered: true,
                registrationCount: s.registrationCount + 1,
              }
            : s
        )
      );
    } catch (err: any) {
      alert(err.message || "Registration failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleJoinStream = async (session: LiveSession) => {
    try {
      // BRD Section 46: Learner joins session -> Record attendance status (ATTENDED) in Supabase.
      await fetch("/api/live/attend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id, userId }),
      });

      // Update local state
      setSessions((prev) =>
        prev.map((s) =>
          s.id === session.id
            ? {
                ...s,
                userAttendance: "ATTENDED",
                attendedCount: s.userAttendance === "ATTENDED" ? s.attendedCount : s.attendedCount + 1,
              }
            : s
        )
      );
    } catch (err) {
      console.warn("Could not record attendance:", err);
    }

    // Open stream URL in new tab
    window.open(session.streamUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-white font-sans">
      {/* Top Banner */}
      <div className="border-b border-[#3E3E43] pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="font-mono text-xs text-[#5A5F70] uppercase tracking-widest mb-1 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 text-[#EFFF4F] font-bold text-[10px] rounded">
              LIVE TRAINING COHORTS
            </span>
            <span>•</span>
            <span className="text-[#A0A5B5]">INTERACTIVE MASTERCLASSES</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span>Live SDET Classes & Recordings</span>
            <Radio className="w-6 h-6 text-[#EFFF4F] animate-pulse" />
          </h1>
          <p className="text-xs sm:text-sm text-[#A0A5B5] mt-1">
            Register for live architecture sessions, get push reminders, attend live workshops, and watch archived recordings.
          </p>
        </div>

        <Link
          href="/dashboard/learner"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#333336] border border-[#3E3E43] hover:border-[#EFFF4F]/50 text-white font-mono text-xs font-bold uppercase rounded-xl transition-all shadow-sm"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Student Dashboard</span>
        </Link>
      </div>

      {notificationMsg && (
        <div className="p-4 bg-[#EFFF4F]/10 border border-[#EFFF4F]/40 rounded-xl text-[#EFFF4F] font-mono text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Sessions Grid */}
      {loading ? (
        <div className="py-16 text-center font-mono text-xs text-[#5A5F70] flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#EFFF4F]" />
          <span>Querying scheduled live sessions...</span>
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-[#333336] border border-[#3E3E43] rounded-2xl p-12 text-center space-y-3 font-mono">
          <div className="w-12 h-12 rounded-full bg-[#28282B] border border-[#3E3E43] flex items-center justify-center mx-auto text-[#5A5F70]">
            <Radio className="w-6 h-6 text-[#EFFF4F]" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase">
            No live classes scheduled at this moment
          </h3>
          <p className="text-xs text-[#A0A5B5] max-w-sm mx-auto">
            Our SDET mentors schedule live cohorts every weekend. Instructors can publish new broadcasts from the Creator Studio.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sessions.map((sess) => {
            const scheduledDate = new Date(sess.scheduledAt).toLocaleString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            });

            const isProcessing = processingId === sess.id;
            const hasAttended = sess.userAttendance === "ATTENDED";
            const isCompleted = sess.status === "COMPLETED";

            return (
              <div
                key={sess.id}
                className="bg-[#333336] border border-[#3E3E43] rounded-2xl p-6 shadow-xl space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#3E3E43] pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2 font-mono text-[10px]">
                      <span
                        className={`px-2 py-0.5 rounded font-bold border ${
                          sess.status === "LIVE"
                            ? "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse"
                            : sess.status === "COMPLETED"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : "bg-[#EFFF4F]/15 text-[#EFFF4F] border-[#EFFF4F]/30"
                        }`}
                      >
                        {sess.status}
                      </span>
                      <span className="text-[#A0A5B5] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#EFFF4F]" />
                        <span>{scheduledDate}</span>
                      </span>
                      <span>•</span>
                      <span className="text-[#5A5F70]">
                        Mentor: {sess.instructorName}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
                      {sess.title}
                    </h2>
                    {sess.description && (
                      <p className="text-xs sm:text-sm text-[#A0A5B5] mt-1 font-sans">
                        {sess.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs shrink-0">
                    <div className="px-3 py-1.5 bg-[#28282B] border border-[#3E3E43] rounded-lg text-center">
                      <span className="text-[#5A5F70] text-[10px] block uppercase">Enrolled</span>
                      <strong className="text-white">{sess.registrationCount} Registered</strong>
                    </div>
                  </div>
                </div>

                {/* Status, Stream & Recording Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
                  <div className="flex items-center gap-3">
                    {sess.isUserRegistered ? (
                      <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold rounded-lg flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{hasAttended ? "Attended ✓" : "Registered ✓ (Reminder Queued)"}</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRegister(sess.id)}
                        disabled={isProcessing}
                        className="px-5 py-2.5 bg-[#EFFF4F] text-[#28282B] font-bold uppercase rounded-lg shadow-lemon-sm hover:bg-[#EFFF4F]/90 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Registering...</span>
                          </>
                        ) : (
                          <>
                            <Bell className="w-3.5 h-3.5" />
                            <span>Register for Live Class</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Join Stream Button */}
                    <button
                      onClick={() => handleJoinStream(sess)}
                      className="px-5 py-2.5 bg-[#28282B] border border-[#3E3E43] hover:border-[#EFFF4F]/50 text-white font-bold uppercase rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Radio className="w-3.5 h-3.5 text-[#EFFF4F]" />
                      <span>Join Live Stream</span>
                      <ExternalLink className="w-3 h-3 text-[#5A5F70]" />
                    </button>

                    {/* Post-Session Recording Resource Link */}
                    {sess.recordingUrl && (
                      <a
                        href={sess.recordingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 bg-[#EFFF4F] text-[#28282B] font-bold uppercase rounded-lg shadow-lemon-sm hover:bg-[#EFFF4F]/90 transition-all flex items-center gap-2"
                      >
                        <Play className="w-3.5 h-3.5 fill-[#28282B]" />
                        <span>Watch Recording</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Resource bar if recording exists */}
                {sess.recordingUrl && (
                  <div className="p-3 bg-[#28282B] border border-[#3E3E43] rounded-xl flex items-center justify-between text-xs font-mono text-[#A0A5B5]">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#06B6D4]" />
                      <span>Course Resource: Post-Session Recording & Architecture Breakdown</span>
                    </div>
                    <a
                      href={sess.recordingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#EFFF4F] hover:underline flex items-center gap-1"
                    >
                      <span>Direct Archive Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
