"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Radio,
  Calendar,
  Clock,
  Video,
  Users,
  Plus,
  Link as LinkIcon,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  ExternalLink,
  Sparkles,
  Save,
  Check,
} from "lucide-react";

interface LiveSessionData {
  id: string;
  title: string;
  description: string;
  courseId: string;
  scheduledAt: string;
  streamUrl: string;
  recordingUrl?: string | null;
  status: "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELLED";
  registrationCount: number;
  attendedCount: number;
}

export default function InstructorLiveManagementPage() {
  const [sessions, setSessions] = useState<LiveSessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("course-1");

  // Recording URL attachment states
  const [recordingInputs, setRecordingInputs] = useState<Record<string, string>>({});
  const [savingRecId, setSavingRecId] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/live");
      if (res.ok) {
        const data = await res.json();
        if (data.sessions) {
          setSessions(data.sessions);
          const initialRecs: Record<string, string> = {};
          data.sessions.forEach((s: LiveSessionData) => {
            initialRecs[s.id] = s.recordingUrl || "";
          });
          setRecordingInputs(initialRecs);
        }
      }
    } catch (err) {
      console.error("Failed to load live sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !scheduledAt || !streamUrl.trim()) {
      alert("Please fill in title, date & time, and stream URL.");
      return;
    }

    setIsSubmitting(true);
    setSuccessMsg(null);

    try {
      // BRD Section 46: Instructor sets title, date/time, and stream URL in /dashboard/instructor/live
      const res = await fetch("/api/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          scheduledAt,
          streamUrl: streamUrl.trim(),
          description: description.trim(),
          courseId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to schedule live class");
      }

      setSuccessMsg(`Live session "${title}" successfully scheduled!`);
      setTitle("");
      setScheduledAt("");
      setStreamUrl("");
      setDescription("");

      await fetchSessions();
    } catch (err: any) {
      alert(err.message || "Failed to schedule session");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveRecording = async (sessionId: string) => {
    const url = recordingInputs[sessionId];
    if (!url || !url.trim()) {
      alert("Please enter a valid recording URL.");
      return;
    }

    setSavingRecId(sessionId);

    try {
      // BRD Section 46: Post-session, instructor uploads/attaches recording URL -> Available under course resources for registered learners.
      const res = await fetch("/api/live", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          recordingUrl: url.trim(),
          status: "COMPLETED",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save recording URL");
      }

      setSuccessMsg("Recording URL attached successfully! Available to registered learners.");
      await fetchSessions();
    } catch (err: any) {
      alert(err.message || "Failed to save recording");
    } finally {
      setSavingRecId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-white font-sans">
      {/* Top Header */}
      <div className="border-b border-[#3E3E43] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="font-mono text-xs text-[#5A5F70] uppercase tracking-widest mb-1 flex items-center gap-2">
            <Link
              href="/dashboard/instructor"
              className="text-[#A0A5B5] hover:text-[#EFFF4F] flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>INSTRUCTOR STUDIO</span>
            </Link>
            <span>•</span>
            <span className="text-[#EFFF4F]">LIVE BROADCAST SUITE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <span>Schedule Live Classes & Recordings</span>
            <Radio className="w-7 h-7 text-[#EFFF4F] animate-pulse" />
          </h1>
          <p className="text-xs sm:text-sm text-[#A0A5B5] mt-1">
            Host live cohorts, track student attendance, and distribute post-session recordings directly to course resources.
          </p>
        </div>

        <Link
          href="/live"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#28282B] border border-[#3E3E43] hover:border-[#EFFF4F]/40 text-[#EFFF4F] font-mono text-xs font-bold uppercase rounded-xl transition-all"
        >
          <span>View Learner Live Hub</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {successMsg && (
        <div className="p-4 bg-[#EFFF4F]/10 border border-[#EFFF4F]/40 rounded-xl text-[#EFFF4F] font-mono text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Grid: Create Session on Left, Manage Sessions on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Schedule New Session Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#333336] border border-[#3E3E43] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-[#3E3E43] pb-3">
              <Plus className="w-4 h-4 text-[#EFFF4F]" />
              <h2 className="font-mono text-xs uppercase font-bold tracking-wider text-white">
                Schedule New Live Masterclass
              </h2>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[#A0A5B5] font-bold uppercase mb-1">
                  Session Title <span className="text-[#EFFF4F]">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Masterclass: AI Self-Healing Locators with Selenium 4"
                  className="w-full px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] focus:outline-none rounded-xl text-white font-sans text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[#A0A5B5] font-bold uppercase mb-1">
                  Scheduled Date & Time <span className="text-[#EFFF4F]">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] focus:outline-none rounded-xl text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[#A0A5B5] font-bold uppercase mb-1">
                  Live Stream / Meeting URL <span className="text-[#EFFF4F]">*</span>
                </label>
                <input
                  type="url"
                  value={streamUrl}
                  onChange={(e) => setStreamUrl(e.target.value)}
                  placeholder="https://youtube.com/live/... or https://meet.google.com/..."
                  className="w-full px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] focus:outline-none rounded-xl text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[#A0A5B5] font-bold uppercase mb-1">
                  Target Course Cohort
                </label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] focus:outline-none rounded-xl text-white"
                >
                  <option value="course-1">Selenium Java + AI Masterclass</option>
                  <option value="course-2">Modern Web Testing & Cypress</option>
                  <option value="course-3">Advanced Performance Benchmarking</option>
                </select>
              </div>

              <div>
                <label className="block text-[#A0A5B5] font-bold uppercase mb-1">
                  Session Outline / Notes
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Topics covered, setup instructions, prerequisites..."
                  className="w-full px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] focus:outline-none rounded-xl text-white font-sans text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#EFFF4F] text-[#28282B] font-bold uppercase rounded-xl shadow-lemon-sm hover:bg-[#EFFF4F]/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Scheduling Session...</span>
                  </>
                ) : (
                  <>
                    <Radio className="w-4 h-4" />
                    <span>Publish Live Schedule</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Sessions List with Attendance & Recording Attachment */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#333336] border border-[#3E3E43] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#3E3E43] pb-3">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-[#EFFF4F]" />
                <h2 className="font-mono text-xs uppercase font-bold tracking-wider text-white">
                  Active & Scheduled Sessions ({sessions.length})
                </h2>
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center font-mono text-xs text-[#5A5F70] flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#EFFF4F]" />
                <span>Loading live sessions...</span>
              </div>
            ) : sessions.length === 0 ? (
              <div className="py-12 text-center font-mono text-xs text-[#5A5F70] space-y-2">
                <p>No live classes scheduled yet.</p>
                <p className="text-[11px] text-[#A0A5B5]">
                  Use the scheduling form on the left to broadcast your first session.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((sess) => {
                  const scheduledDate = new Date(sess.scheduledAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  });

                  const isSavingRec = savingRecId === sess.id;

                  return (
                    <div
                      key={sess.id}
                      className="p-5 bg-[#28282B] border border-[#3E3E43] rounded-xl space-y-4 font-mono text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#3E3E43] pb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                sess.status === "LIVE"
                                  ? "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse"
                                  : sess.status === "COMPLETED"
                                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                  : "bg-[#EFFF4F]/15 text-[#EFFF4F] border-[#EFFF4F]/30"
                              }`}
                            >
                              {sess.status}
                            </span>
                            <span className="text-[#5A5F70] text-[11px]">
                              {scheduledDate}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-white font-sans">
                            {sess.title}
                          </h3>
                        </div>

                        {/* Telemetry pill */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="px-2.5 py-1 bg-[#333336] border border-[#3E3E43] rounded text-[11px] text-white">
                            <span className="text-[#A0A5B5]">Registrations: </span>
                            <strong className="text-[#EFFF4F]">{sess.registrationCount}</strong>
                          </div>
                          <div className="px-2.5 py-1 bg-[#333336] border border-[#3E3E43] rounded text-[11px] text-white">
                            <span className="text-[#A0A5B5]">Attended: </span>
                            <strong className="text-emerald-400">{sess.attendedCount}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Stream Link preview */}
                      <div className="flex items-center justify-between gap-3 text-[11px] bg-[#333336] px-3 py-2 rounded">
                        <div className="flex items-center gap-2 truncate text-[#A0A5B5]">
                          <LinkIcon className="w-3.5 h-3.5 text-[#EFFF4F] shrink-0" />
                          <span className="truncate">{sess.streamUrl}</span>
                        </div>
                        <a
                          href={sess.streamUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#EFFF4F] hover:underline flex items-center gap-1 shrink-0"
                        >
                          <span>Open Stream</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      {/* Post-Session Recording Attachment Box */}
                      <div className="pt-2 border-t border-[#3E3E43] space-y-2">
                        <label className="block text-[11px] font-bold uppercase text-[#A0A5B5] flex items-center justify-between">
                          <span>Post-Session Recording URL</span>
                          {sess.recordingUrl && (
                            <span className="text-emerald-400 font-normal">
                              ✓ Attached to Course Resources
                            </span>
                          )}
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="url"
                            value={recordingInputs[sess.id] || ""}
                            onChange={(e) =>
                              setRecordingInputs((prev) => ({
                                ...prev,
                                [sess.id]: e.target.value,
                              }))
                            }
                            placeholder="https://youtube.com/watch?v=... or https://drive.google.com/..."
                            className="flex-1 px-3 py-1.5 bg-[#333336] border border-[#3E3E43] focus:border-[#EFFF4F] rounded-lg text-white text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveRecording(sess.id)}
                            disabled={isSavingRec}
                            className="px-4 py-1.5 bg-[#EFFF4F] text-[#28282B] font-bold uppercase rounded-lg shadow-lemon-sm hover:bg-[#EFFF4F]/90 transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                          >
                            {isSavingRec ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Save className="w-3.5 h-3.5" />
                            )}
                            <span>Save URL</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
