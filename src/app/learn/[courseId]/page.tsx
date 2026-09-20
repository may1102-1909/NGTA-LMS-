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

  const allLessons = course.modules.flatMap((m) =>
    m.chapters.flatMap((c) => c.lessons)
  );

  const [activeLessonId, setActiveLessonId] = useState<string>(allLessons[0]?.id || "les-1");
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [userPoints, setUserPoints] = useState<number>(420);
  const [pointsToast, setPointsToast] = useState<string | null>(null);

  const activeLesson = allLessons.find((l) => l.id === activeLessonId) || allLessons[0];

  const totalLessonsCount = allLessons.length;
  const progressPercentage =
    totalLessonsCount > 0
      ? Math.round((completedLessonIds.length / totalLessonsCount) * 100)
      : 0;

  const handleMarkCompleted = (lessonId: string) => {
    if (!completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds((prev) => [...prev, lessonId]);
      setUserPoints((prev) => prev + 10);
      setPointsToast(`+10 PTS · Lesson completed · ${activeLesson.title}`);
      setTimeout(() => setPointsToast(null), 4000);
    }
  };

  const isEligibleForCertificate = progressPercentage >= 75;

  return (
    <div className="min-h-screen bg-[#10131A] text-white flex flex-col font-sans">
      {/* Top Player Bar */}
      <div className="border-b border-[#252A36] bg-[#0C0E14] px-4 py-3 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/courses"
            className="flex items-center gap-1 text-[#5A5F70] hover:text-[#EFFF4F] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>EXIT PLAYER</span>
          </Link>
          <span className="text-[#252A36]">|</span>
          <span className="text-white font-bold uppercase truncate max-w-xs sm:max-w-md">
            {course.title}
          </span>
        </div>

        <div className="flex items-center gap-4 font-mono">
          {pointsToast && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 text-[#EFFF4F] text-[11px] animate-in fade-in slide-in-from-top-1">
              <span className="font-bold">●</span>
              <span>{pointsToast}</span>
            </div>
          )}

          <div className="hidden lg:flex items-center gap-2">
            <RankTag points={userPoints} size="sm" />
            <span className="text-[#252A36]">|</span>
            <span className="text-[#EFFF4F] font-bold tabular-nums">{userPoints} PTS</span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[#5A5F70]">PROGRESS:</span>
            <span className="font-bold text-[#EFFF4F]">{progressPercentage}%</span>
            <div className="w-20 h-2 bg-[#252A36] border border-[#252A36] overflow-hidden">
              <div
                className="h-full bg-[#EFFF4F] transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {isEligibleForCertificate && (
            <Link
              href={`/verify?certId=NGTA-CERT-${course.id}-9941`}
              className="px-2.5 py-1 bg-[#EFFF4F] text-[#10131A] font-bold hover:bg-[#EFFF4F]/90 transition-colors flex items-center gap-1 text-[11px] shadow-lemon-sm"
            >
              <Award className="w-3.5 h-3.5" />
              <span>CLAIM CERTIFICATE</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Player Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Column: Video & Lesson Content */}
        <div className="lg:col-span-8 flex flex-col bg-[#0C0E14] border-r border-[#252A36]">
          <div className="relative aspect-video w-full bg-black flex items-center justify-center border-b border-[#252A36]">
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
                <HelpCircle className="w-16 h-16 text-[#EFFF4F] mx-auto" />
                <h3 className="text-xl font-bold text-white uppercase font-mono">
                  ASSESSMENT & QUIZ STAGE
                </h3>
                <p className="text-[#A0A5B5] text-sm max-w-md mx-auto">
                  Evaluate your architecture knowledge to validate competency and unlock your accredited certificate.
                </p>
                <Link
                  href={`/learn/${course.id}/quiz`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#EFFF4F] text-[#10131A] font-mono text-xs uppercase font-bold hover:bg-[#EFFF4F]/90 transition-colors shadow-lemon-sm"
                >
                  <span>START TIMED QUIZ</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Lesson Metadata */}
          <div className="p-6 bg-[#10131A] flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252A36] pb-4">
              <div>
                <div className="font-mono text-xs text-[#5A5F70] uppercase">
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
                      ? "bg-[#EFFF4F]/10 border-[#EFFF4F]/30 text-[#EFFF4F]"
                      : "bg-[#181C26] border-[#252A36] text-[#A0A5B5] hover:bg-[#252A36]"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-[#EFFF4F]" />
                  <span>
                    {completedLessonIds.includes(activeLesson.id)
                      ? "COMPLETED"
                      : "MARK AS COMPLETED"}
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-3 font-sans text-sm text-[#A0A5B5]">
              <div className="font-mono text-xs uppercase font-bold text-[#5A5F70]">
                ARCHITECTURE NOTES:
              </div>
              <p className="leading-relaxed">
                {activeLesson.content ||
                  "Review the architectural pattern demonstrated in this module. Ensure proper thread isolation and thread-safe driver teardown in all afterMethod fixtures."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Syllabus Sidebar */}
        <div className="lg:col-span-4 bg-[#10131A] flex flex-col h-full border-[#252A36]">
          <div className="p-4 border-b border-[#252A36] font-mono text-xs font-bold text-[#5A5F70] uppercase tracking-wider flex justify-between items-center">
            <span>CURRICULUM SYLLABUS</span>
            <span className="text-[#EFFF4F]">{completedLessonIds.length} / {allLessons.length} DONE</span>
          </div>

          <div className="overflow-y-auto divide-y divide-[#252A36] flex-1">
            {course.modules.map((mod, modIdx) => {
              const modLessons = mod.chapters.flatMap((c) => c.lessons);
              const modCompleted = modLessons.filter((l) =>
                completedLessonIds.includes(l.id)
              ).length;
              const isModAllDone = modCompleted === modLessons.length && modLessons.length > 0;

              return (
                <div key={mod.id} className="p-3">
                  <div className="flex items-center justify-between font-mono text-xs font-bold text-white mb-2">
                    <span className="text-[#5A5F70]">MODULE 0{modIdx + 1}</span>
                    <span className={isModAllDone ? "text-[#EFFF4F]" : "text-[#5A5F70]"}>
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
                              ? "bg-[#EFFF4F]/10 border-[#EFFF4F]/30 text-white font-bold"
                              : "border-transparent hover:bg-[#181C26] text-[#5A5F70] hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {isDone ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#EFFF4F] shrink-0" />
                            ) : les.type === "quiz" ? (
                              <HelpCircle className="w-3.5 h-3.5 text-[#EFFF4F] shrink-0" />
                            ) : (
                              <Play className="w-3.5 h-3.5 text-[#5A5F70] shrink-0" />
                            )}
                            <span className="truncate">{les.title}</span>
                          </div>
                          <span className="text-[10px] text-[#5A5F70] shrink-0 ml-2">
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

          <div className="p-4 border-t border-[#252A36] bg-[#0C0E14] font-mono text-xs">
            <Link
              href={`/learn/${course.id}/quiz`}
              className="w-full py-2.5 bg-[#EFFF4F] text-[#10131A] font-bold hover:bg-[#EFFF4F]/90 transition-colors flex items-center justify-center gap-2 shadow-lemon-sm"
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
