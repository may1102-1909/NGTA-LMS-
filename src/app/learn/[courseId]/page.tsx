"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { INITIAL_COURSES } from "@/lib/mockData";
import {
  Play,
  CheckCircle2,
  Lock,
  Award,
  HelpCircle,
  Clock,
  ArrowRight,
  ChevronLeft,
  Video,
  FileCode,
  Sparkles,
} from "lucide-react";
import RankTag from "@/components/gamification/RankTag";

export default function LearnPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.courseId as string;

  const course = INITIAL_COURSES.find((c) => c.id === courseId) || INITIAL_COURSES[0];
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Flattened lessons list
  const allLessons = course.modules.flatMap((m) =>
    m.chapters.flatMap((c) => c.lessons)
  );

  const [activeLessonId, setActiveLessonId] = useState<string>(allLessons[0]?.id || "les-1");
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [userPoints, setUserPoints] = useState<number>(420);
  const [pointsToast, setPointsToast] = useState<string | null>(null);

  const activeLesson = allLessons.find((l) => l.id === activeLessonId) || allLessons[0];

  // Calculate Overall Progress (BRD Section 8)
  const totalLessonsCount = allLessons.length;
  const progressPercentage =
    totalLessonsCount > 0
      ? Math.round((completedLessonIds.length / totalLessonsCount) * 100)
      : 0;

  // Mark current lesson completed & record gamification points
  const handleMarkCompleted = (lessonId: string) => {
    if (!completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds((prev) => [...prev, lessonId]);
      setUserPoints((prev) => prev + 10);
      setPointsToast(`+10 PTS · Lesson completed · ${activeLesson.title}`);
      setTimeout(() => setPointsToast(null), 4000);
    }
  };

  // Check if course is fully ready for certificate
  const isEligibleForCertificate = progressPercentage >= 75;

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans">
      {/* Top Swiss Player Bar */}
      <div className="border-b border-zinc-800 bg-zinc-900 px-4 py-3 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/courses"
            className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>EXIT PLAYER</span>
          </Link>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-300 font-bold uppercase truncate max-w-xs sm:max-w-md">
            {course.title}
          </span>
        </div>

        {/* Course Progress Indicator (BRD Section 8) & Gamification Telemetry */}
        <div className="flex items-center gap-4 font-mono">
          {/* Points Award Toast */}
          {pointsToast && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-950 border border-emerald-500 text-emerald-300 text-[11px] animate-in fade-in slide-in-from-top-1">
              <span className="font-bold">●</span>
              <span>{pointsToast}</span>
            </div>
          )}

          {/* User Rank & Points */}
          <div className="hidden lg:flex items-center gap-2">
            <RankTag points={userPoints} size="sm" />
            <span className="text-zinc-400">|</span>
            <span className="text-blue-400 font-bold tabular-nums">{userPoints} PTS</span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-zinc-400">PROGRESS:</span>
            <span className="font-bold text-emerald-400">{progressPercentage}%</span>
            <div className="w-20 h-2 bg-zinc-800 border border-zinc-700 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {isEligibleForCertificate && (
            <Link
              href={`/verify?certId=NGTA-CERT-${course.id}-9941`}
              className="px-2.5 py-1 bg-amber-500 text-zinc-950 font-bold hover:bg-amber-400 transition-colors flex items-center gap-1 text-[11px]"
            >
              <Award className="w-3.5 h-3.5" />
              <span>CLAIM CERTIFICATE</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Player Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Column: Video & Lesson Content Stage */}
        <div className="lg:col-span-8 flex flex-col bg-black border-r border-zinc-800">
          {/* Video Player Box */}
          <div className="relative aspect-video w-full bg-zinc-950 flex items-center justify-center border-b border-zinc-800">
            {activeLesson.type === "video" ? (
              <video
                ref={videoRef}
                controls
                src={activeLesson.videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4"}
                className="w-full h-full object-contain"
                onTimeUpdate={(e) => setPlaybackTime(e.currentTarget.currentTime)}
                onEnded={() => handleMarkCompleted(activeLesson.id)}
              />
            ) : (
              <div className="p-8 text-center space-y-4">
                <HelpCircle className="w-16 h-16 text-amber-500 mx-auto" />
                <h3 className="text-xl font-bold text-white uppercase font-mono">
                  ASSESSMENT & QUIZ STAGE
                </h3>
                <p className="text-zinc-400 text-sm max-w-md mx-auto">
                  Evaluate your architecture knowledge to validate competency and unlock your accredited certificate.
                </p>
                <Link
                  href={`/learn/${course.id}/quiz`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-mono text-xs uppercase font-bold hover:bg-blue-500 transition-colors shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
                >
                  <span>START TIMED QUIZ</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Lesson Metadata & Control Bar */}
          <div className="p-6 bg-zinc-900 flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <div className="font-mono text-xs text-zinc-500 uppercase">
                  LESSON {activeLesson.order} // {activeLesson.durationMinutes} MIN
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                  {activeLesson.title}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleMarkCompleted(activeLesson.id)}
                  className={`px-4 py-2 font-mono text-xs uppercase font-bold flex items-center gap-2 transition-colors border ${
                    completedLessonIds.includes(activeLesson.id)
                      ? "bg-emerald-950/60 border-emerald-500 text-emerald-300"
                      : "bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>
                    {completedLessonIds.includes(activeLesson.id)
                      ? "COMPLETED"
                      : "MARK AS COMPLETED"}
                  </span>
                </button>
              </div>
            </div>

            {/* Lesson Notes / Technical Snippets */}
            <div className="space-y-3 font-sans text-sm text-zinc-300">
              <div className="font-mono text-xs uppercase font-bold text-zinc-400">
                ARCHITECTURE NOTES:
              </div>
              <p className="leading-relaxed">
                {activeLesson.content ||
                  "Review the architectural pattern demonstrated in this module. Ensure proper thread isolation and thread-safe driver teardown in all afterMethod fixtures."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Syllabus & Progress Sidebar (BRD Section 8) */}
        <div className="lg:col-span-4 bg-zinc-900 flex flex-col h-full border-zinc-800">
          <div className="p-4 border-b border-zinc-800 font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider flex justify-between items-center">
            <span>CURRICULUM SYLLABUS</span>
            <span className="text-emerald-400">{completedLessonIds.length} / {allLessons.length} DONE</span>
          </div>

          <div className="overflow-y-auto divide-y divide-zinc-800 flex-1">
            {course.modules.map((mod, modIdx) => {
              const modLessons = mod.chapters.flatMap((c) => c.lessons);
              const modCompleted = modLessons.filter((l) =>
                completedLessonIds.includes(l.id)
              ).length;
              const isModAllDone = modCompleted === modLessons.length && modLessons.length > 0;

              return (
                <div key={mod.id} className="p-3">
                  <div className="flex items-center justify-between font-mono text-xs font-bold text-zinc-300 mb-2">
                    <span className="text-zinc-400">MODULE 0{modIdx + 1}</span>
                    <span className={isModAllDone ? "text-emerald-400" : "text-zinc-500"}>
                      {isModAllDone ? "✓ 100%" : `${Math.round((modCompleted / modLessons.length) * 100 || 0)}%`}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-white mb-2">{mod.title}</div>

                  <div className="space-y-1 pl-2 font-mono text-xs">
                    {modLessons.map((les) => {
                      const isCurrent = les.id === activeLessonId;
                      const isDone = completedLessonIds.includes(les.id);

                      return (
                        <button
                          key={les.id}
                          onClick={() => setActiveLessonId(les.id)}
                          className={`w-full text-left p-2 transition-colors flex items-center justify-between border ${
                            isCurrent
                              ? "bg-blue-600/20 border-blue-500 text-white font-bold"
                              : "border-transparent hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {isDone ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : les.type === "quiz" ? (
                              <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            ) : (
                              <Play className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                            )}
                            <span className="truncate">{les.title}</span>
                          </div>
                          <span className="text-[10px] text-zinc-500 shrink-0 ml-2">
                            {les.durationMinutes}m
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Direct Quiz Trigger in Sidebar */}
          <div className="p-4 border-t border-zinc-800 bg-zinc-950 font-mono text-xs">
            <Link
              href={`/learn/${course.id}/quiz`}
              className="w-full py-2.5 bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span>GO TO ASSESSMENT QUIZ</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
