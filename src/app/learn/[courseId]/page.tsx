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
  Loader2,
  ExternalLink,
} from "lucide-react";
import RankTag from "@/components/gamification/RankTag";
import { createBrowserClient } from "@supabase/ssr";

export default function LearnPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.courseId as string;

  const course = INITIAL_COURSES.find((c) => c.id === courseId) || INITIAL_COURSES[0];
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isVerifyingEnrollment, setIsVerifyingEnrollment] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Gated Course Access: Verify user is logged in and has an active payment for this course
  useEffect(() => {
    let isMounted = true;

    async function checkEnrollmentAccess() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
          if (isMounted) router.replace("/courses");
          return;
        }

        const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user?.id) {
          // User not logged in -> redirect to /courses
          if (isMounted) router.replace("/courses");
          return;
        }

        // Query database to check if user has purchased this course
        const res = await fetch(
          `/api/payments/verify?courseId=${course.id}&userId=${user.id}`
        );

        if (res.ok) {
          const data = await res.json();
          if (data.isEnrolled) {
            // Also fetch student points dynamically
            try {
              const profRes = await fetch(`/api/student-profile?userId=${user.id}`);
              if (profRes.ok) {
                const profData = await profRes.json();
                if (isMounted) {
                  setUserPoints(profData.profile?.xp_points ?? profData.xp_points ?? 0);
                }
              }
            } catch {}

            if (isMounted) {
              setIsEnrolled(true);
              setIsVerifyingEnrollment(false);
            }
            return;
          }
        }

        // User hasn't purchased the course -> redirect to /courses
        if (isMounted) {
          router.replace("/courses");
        }
      } catch (err) {
        console.error("Enrollment verification error:", err);
        if (isMounted) {
          router.replace("/courses");
        }
      }
    }

    checkEnrollmentAccess();
    return () => {
      isMounted = false;
    };
  }, [course.id, router]);

  const allLessons = course.modules.flatMap((m) =>
    m.chapters.flatMap((c) => c.lessons)
  );

  const [activeLessonId, setActiveLessonId] = useState<string>(allLessons[0]?.id || "les-1");
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [userPoints, setUserPoints] = useState<number>(0);
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

  if (isVerifyingEnrollment) {
    return (
      <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center font-mono text-xs text-white p-6">
        <div className="border border-[#1f2d4d] bg-[#14213D] p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-[#FCA311]/10 border border-[#FCA311]/30 flex items-center justify-center mx-auto text-[#FCA311]">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white uppercase font-sans">
              Verifying Enrollment Access
            </h2>
            <p className="text-xs text-[#E5E5E5]">
              Confirming course credentials for {course.title}...
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-[11px] text-[#8A96A8]">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FCA311]" />
            <span>Syncing database credentials...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isEnrolled) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans">
      {/* Top Player Bar */}
      <div className="border-b border-[#1f2d4d] bg-[#000000] px-4 py-3 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/courses"
            className="flex items-center gap-1 text-[#8A96A8] hover:text-[#FCA311] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>EXIT PLAYER</span>
          </Link>
          <span className="text-[#1f2d4d]">|</span>
          <span className="text-white font-bold uppercase truncate max-w-xs sm:max-w-md">
            {course.title}
          </span>
        </div>

        <div className="flex items-center gap-4 font-mono">
          {pointsToast && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 bg-[#FCA311]/10 border border-[#FCA311]/30 text-[#FCA311] text-[11px] animate-in fade-in slide-in-from-top-1">
              <span className="font-bold">●</span>
              <span>{pointsToast}</span>
            </div>
          )}

          <div className="hidden lg:flex items-center gap-2">
            <RankTag points={userPoints} size="sm" />
            <span className="text-[#1f2d4d]">|</span>
            <span className="text-[#FCA311] font-bold tabular-nums">{userPoints} PTS</span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[#8A96A8]">PROGRESS:</span>
            <span className="font-bold text-[#FCA311]">{progressPercentage}%</span>
            <div className="w-20 h-2 bg-[#1f2d4d] border border-[#1f2d4d] overflow-hidden">
              <div
                className="h-full bg-[#FCA311] transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {isEligibleForCertificate && (
            <Link
              href={`/verify?certId=NGTA-CERT-${course.id}-9941`}
              className="px-2.5 py-1 bg-[#FCA311] text-[#000000] font-bold hover:bg-[#FCA311]/90 transition-colors flex items-center gap-1 text-[11px] shadow-lemon-sm"
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
        <div className="lg:col-span-8 flex flex-col bg-[#000000] border-r border-[#1f2d4d]">
          <div className="relative aspect-video w-full bg-black flex items-center justify-center border-b border-[#1f2d4d]">
            {activeLesson.type === "video" ? (
              (() => {
                const url = activeLesson.videoUrl || "";
                const isDrive = url.includes("drive.google.com");
                const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");

                if (isDrive) {
                  const match =
                    url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                    url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
                  const previewUrl =
                    match && match[1]
                      ? `https://drive.google.com/file/d/${match[1]}/preview`
                      : url;

                  return (
                    <iframe
                      src={previewUrl}
                      className="w-full h-full border-0"
                      allow="autoplay; encrypted-media; fullscreen"
                      allowFullScreen
                      title={activeLesson.title}
                    />
                  );
                }

                if (isYouTube) {
                  const ytMatch = url.match(/(?:youtu\.be\/|watch\?v=)([a-zA-Z0-9_-]+)/);
                  const embedUrl =
                    ytMatch && ytMatch[1]
                      ? `https://www.youtube.com/embed/${ytMatch[1]}`
                      : url;

                  return (
                    <iframe
                      src={embedUrl}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={activeLesson.title}
                    />
                  );
                }

                return (
                  <video
                    ref={videoRef}
                    controls
                    src={url || "https://www.w3schools.com/html/mov_bbb.mp4"}
                    className="w-full h-full object-contain"
                    onTimeUpdate={(e) => setPlaybackTime(e.currentTarget.currentTime)}
                    onEnded={() => handleMarkCompleted(activeLesson.id)}
                  />
                );
              })()
            ) : (
              <div className="p-8 text-center space-y-4">
                <HelpCircle className="w-16 h-16 text-[#FCA311] mx-auto" />
                <h3 className="text-xl font-bold text-white uppercase font-mono">
                  ASSESSMENT & QUIZ STAGE
                </h3>
                <p className="text-[#E5E5E5] text-sm max-w-md mx-auto">
                  Evaluate your architecture knowledge to validate competency and unlock your accredited certificate.
                </p>
                <Link
                  href={`/learn/${course.id}/quiz`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#FCA311] text-[#000000] font-mono text-xs uppercase font-bold hover:bg-[#FCA311]/90 transition-colors shadow-lemon-sm"
                >
                  <span>START TIMED QUIZ</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Lesson Metadata */}
          <div className="p-6 bg-[#000000] flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f2d4d] pb-4">
              <div>
                <div className="font-mono text-xs text-[#8A96A8] uppercase">
                  LESSON {activeLesson.order} // {activeLesson.durationMinutes} MIN
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                  {activeLesson.title}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                {activeLesson.videoUrl && activeLesson.videoUrl.includes("drive.google.com") && (
                  <a
                    href={activeLesson.videoUrl.replace("/preview", "/view")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 font-mono text-xs text-[#E5E5E5] hover:text-[#FCA311] border border-[#1f2d4d] hover:border-[#FCA311]/40 transition-colors flex items-center gap-1.5"
                    title="Open full video in Google Drive"
                  >
                    <span>DRIVE SOURCE</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <button
                  onClick={() => handleMarkCompleted(activeLesson.id)}
                  className={`px-4 py-2 font-mono text-xs uppercase font-bold flex items-center gap-2 transition-colors border ${
                    completedLessonIds.includes(activeLesson.id)
                      ? "bg-[#FCA311]/10 border-[#FCA311]/30 text-[#FCA311]"
                      : "bg-[#14213D] border-[#1f2d4d] text-[#E5E5E5] hover:bg-[#1f2d4d]"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-[#FCA311]" />
                  <span>
                    {completedLessonIds.includes(activeLesson.id)
                      ? "COMPLETED"
                      : "MARK AS COMPLETED"}
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-3 font-sans text-sm text-[#E5E5E5]">
              <div className="font-mono text-xs uppercase font-bold text-[#8A96A8]">
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
        <div className="lg:col-span-4 bg-[#14213D] flex flex-col h-full border-[#1f2d4d]">
          <div className="p-4 border-b border-[#1f2d4d] font-mono text-xs font-bold text-[#8A96A8] uppercase tracking-wider flex justify-between items-center">
            <span>CURRICULUM SYLLABUS</span>
            <span className="text-[#FCA311]">{completedLessonIds.length} / {allLessons.length} DONE</span>
          </div>

          <div className="overflow-y-auto divide-y divide-[#1f2d4d] flex-1">
            {course.modules.map((mod, modIdx) => {
              const modLessons = mod.chapters.flatMap((c) => c.lessons);
              const modCompleted = modLessons.filter((l) =>
                completedLessonIds.includes(l.id)
              ).length;
              const isModAllDone = modCompleted === modLessons.length && modLessons.length > 0;

              return (
                <div key={mod.id} className="p-3">
                  <div className="flex items-center justify-between font-mono text-xs font-bold text-white mb-2">
                    <span className="text-[#8A96A8]">MODULE 0{modIdx + 1}</span>
                    <span className={isModAllDone ? "text-[#FCA311]" : "text-[#8A96A8]"}>
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
                              ? "bg-[#FCA311]/10 border-[#FCA311]/30 text-white font-bold"
                              : "border-transparent hover:bg-[#1f2d4d] text-[#8A96A8] hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {isDone ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#FCA311] shrink-0" />
                            ) : les.type === "quiz" ? (
                              <HelpCircle className="w-3.5 h-3.5 text-[#FCA311] shrink-0" />
                            ) : (
                              <Play className="w-3.5 h-3.5 text-[#8A96A8] shrink-0" />
                            )}
                            <span className="truncate">{les.title}</span>
                          </div>
                          <span className="text-[10px] text-[#8A96A8] shrink-0 ml-2">
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

          <div className="p-4 border-t border-[#1f2d4d] bg-[#000000] font-mono text-xs">
            <Link
              href={`/learn/${course.id}/quiz`}
              className="w-full py-2.5 bg-[#FCA311] text-[#000000] font-bold hover:bg-[#FCA311]/90 transition-colors flex items-center justify-center gap-2 shadow-lemon-sm"
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
