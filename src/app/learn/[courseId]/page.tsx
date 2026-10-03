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
import { supabase } from "@/lib/supabaseClient";

export default function LearnPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.courseId as string;

  const [course, setCourse] = useState<any>(null);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isVerifyingEnrollment, setIsVerifyingEnrollment] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Dynamic Course & Gated Enrollment Access: Fetch course from DB and verify enrollment
  useEffect(() => {
    let isMounted = true;

    async function loadCourseAndCheckAccess() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        let activeUserId = user?.id;
        if (!activeUserId) {
          try {
            const profRes = await fetch("/api/student-profile");
            if (profRes.ok) {
              const profData = await profRes.json();
              if (profData.profile?.user_id || profData.profile?.id) {
                activeUserId = profData.profile.user_id || profData.profile.id;
              }
            }
          } catch {}
        }

        if (!activeUserId) {
          if (isMounted) router.replace("/courses");
          return;
        }

        if (isMounted) setCurrentUserId(activeUserId);

        // 1. Fetch dynamic course record from database
        let loadedCourse: any = null;
        try {
          const cRes = await fetch(`/api/courses?id=${courseId}&source=normalized`);
          if (cRes.ok) {
            const cData = await cRes.json();
            const raw = cData.course || cData.normalizedCourse || cData.publishedCourse;
            if (raw) {
              const normModules = (raw.modules || []).map((m: any, mIdx: number) => {
                if (Array.isArray(m.chapters) && m.chapters.length > 0) {
                  return {
                    id: m.id || `mod-${mIdx + 1}`,
                    title: m.title || `Module ${mIdx + 1}`,
                    chapters: m.chapters.map((chap: any, cIdx: number) => ({
                      id: chap.id || `chap-${mIdx + 1}-${cIdx + 1}`,
                      title: chap.title || `Chapter ${cIdx + 1}`,
                      lessons: (chap.lessons || []).map((l: any, lIdx: number) => ({
                        id: l.id || `les-${mIdx + 1}-${lIdx + 1}`,
                        title: l.title || `Lesson ${lIdx + 1}`,
                        type: l.video_type || l.videoType ? "video" : (l.type || "video"),
                        videoType: l.video_type || l.videoType || "MP4_UPLOAD",
                        videoUrl: (l.video_url || l.videoUrl || "").trim(),
                        durationMinutes: Number(l.duration_minutes || l.durationMinutes || l.duration) || 15,
                        pdfResourceUrl: l.pdf_resource_url || l.pdfResourceUrl || null,
                        content: l.content || "",
                        order: lIdx + 1,
                      })),
                    })),
                  };
                }
                return {
                  id: m.id || `mod-${mIdx + 1}`,
                  title: m.title || `Module ${mIdx + 1}`,
                  chapters: [
                    {
                      id: `${m.id || mIdx}-ch1`,
                      title: "Lessons",
                      lessons: (m.lessons || []).map((l: any, lIdx: number) => ({
                        id: l.id || `les-${mIdx + 1}-${lIdx + 1}`,
                        title: l.title || `Lesson ${lIdx + 1}`,
                        type: l.video_type || l.videoType ? "video" : (l.type || "video"),
                        videoType: l.video_type || l.videoType || "MP4_UPLOAD",
                        videoUrl: (l.video_url || l.videoUrl || "").trim(),
                        durationMinutes: Number(l.duration_minutes || l.durationMinutes || l.duration) || 15,
                        pdfResourceUrl: l.pdf_resource_url || l.pdfResourceUrl || null,
                        content: l.content || "",
                        order: lIdx + 1,
                      })),
                    },
                  ],
                };
              });

              loadedCourse = {
                id: raw.id,
                title: raw.title,
                slug: raw.slug || raw.id,
                modules: normModules,
              };
            }
          }
        } catch (fetchErr) {
          console.warn("Could not load dynamic course from DB:", fetchErr);
        }

        // Fallback to static catalog if DB record not found
        if (!loadedCourse) {
          const fallback = INITIAL_COURSES.find((c) => c.id === courseId || c.slug === courseId) || INITIAL_COURSES[0];
          loadedCourse = fallback;
        }

        if (isMounted) {
          setCourse(loadedCourse);
          setIsLoadingCourse(false);
        }

        // 2. Query database to check if user has active enrollment for this course (check UUID, slug, courseId)
        const checkIds = Array.from(new Set([loadedCourse.id, loadedCourse.slug, courseId].filter(Boolean)));
        let verifiedEnrolled = false;

        for (const cid of checkIds) {
          try {
            const res = await fetch(
              `/api/payments/verify?courseId=${cid}&userId=${activeUserId}`
            );
            if (res.ok) {
              const data = await res.json();
              if (data.isEnrolled) {
                verifiedEnrolled = true;
                break;
              }
            }
          } catch (e) {
            console.warn(`Could not verify enrollment for ${cid}:`, e);
          }
        }

        if (verifiedEnrolled) {
          try {
            const profRes = await fetch(`/api/student-profile?userId=${activeUserId}`);
            if (profRes.ok) {
              const profData = await profRes.json();
              if (isMounted) {
                setUserPoints(profData.profile?.xp_points ?? profData.xp_points ?? 0);
              }
            }
          } catch {}

          try {
            const progRes = await fetch(
              `/api/learn/progress?courseId=${loadedCourse.id}&userId=${activeUserId}`
            );
            if (progRes.ok) {
              const progData = await progRes.json();
              if (isMounted && Array.isArray(progData.completedLessonIds)) {
                setCompletedLessonIds(progData.completedLessonIds);
              }
            }
          } catch (progErr) {
            console.warn("Could not fetch course progress:", progErr);
          }

          if (isMounted) {
            setIsEnrolled(true);
            setIsVerifyingEnrollment(false);
          }
          return;
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

    loadCourseAndCheckAccess();
    return () => {
      isMounted = false;
    };
  }, [courseId, router]);

  const allLessons = course?.modules
    ? course.modules.flatMap((m: any) =>
        (m.chapters || []).flatMap((c: any) => c.lessons || [])
      )
    : [];

  const [activeLessonId, setActiveLessonId] = useState<string>("");
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [pointsToast, setPointsToast] = useState<string | null>(null);

  useEffect(() => {
    if (allLessons.length > 0 && (!activeLessonId || !allLessons.some((l: any) => l.id === activeLessonId))) {
      setActiveLessonId(allLessons[0].id);
    }
  }, [allLessons, activeLessonId]);

  const activeLesson = allLessons.find((l: any) => l.id === activeLessonId) || allLessons[0] || {
    id: "empty",
    title: "Lesson",
    type: "video",
    videoUrl: "",
    durationMinutes: 15,
  };

  const totalLessonsCount = allLessons.length;
  const progressPercentage =
    totalLessonsCount > 0
      ? Math.round((completedLessonIds.length / totalLessonsCount) * 100)
      : 0;

  const handleMarkCompleted = async (lessonId: string) => {
    if (!completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds((prev) => [...prev, lessonId]);
      setUserPoints((prev) => prev + 10);
      setPointsToast(`+10 PTS · Lesson completed · ${activeLesson.title}`);
      setTimeout(() => setPointsToast(null), 4000);

      // Persist to Supabase course_progress table & enrollments
      try {
        await fetch("/api/learn/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId: course?.id || courseId,
            lessonId,
            completed: true,
            totalLessons: totalLessonsCount,
            userId: currentUserId,
          }),
        });
      } catch (err) {
        console.error("Failed to save lesson progress to Supabase:", err);
      }
    }
  };

  const isEligibleForCertificate = progressPercentage >= 75;

  if (isVerifyingEnrollment) {
    return (
      <div className="min-h-screen bg-[#28282B] flex flex-col items-center justify-center font-mono text-xs text-white p-6">
        <div className="border border-[#3E3E43] bg-[#202023] p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 flex items-center justify-center mx-auto text-[#EFFF4F]">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white uppercase font-sans">
              Verifying Enrollment Access
            </h2>
            <p className="text-xs text-[#A0A5B5]">
              Confirming course credentials for {course?.title || "course"}...
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-[11px] text-[#5A5F70]">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#EFFF4F]" />
            <span>Syncing database credentials...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isEnrolled) {
    return null;
  }

  // Safe Guard Clause: Render clean Course Not Found UI if course object is missing or null
  if (!course && !isLoadingCourse) {
    return (
      <div className="min-h-screen bg-[#070709] text-white flex flex-col items-center justify-center p-6 font-sans">
        <h1 className="text-2xl font-bold mb-2">Course Not Found</h1>
        <p className="text-zinc-400 text-sm mb-6">The requested course does not exist or is still pending publication.</p>
        <Link href="/courses" className="px-5 py-2.5 bg-lime-400 text-black font-bold rounded-xl hover:bg-lime-300 transition-colors">Back to Courses</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#28282B] text-white flex flex-col font-sans">
      {/* Top Player Bar */}
      <div className="border-b border-[#3E3E43] bg-[#0C0E14] px-4 py-3 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/courses"
            className="flex items-center gap-1 text-[#5A5F70] hover:text-[#EFFF4F] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>EXIT PLAYER</span>
          </Link>
          <span className="text-[#3E3E43]">|</span>
          <span className="text-white font-bold uppercase truncate max-w-xs sm:max-w-md">
            {course?.title || "Course Player"}
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
            <span className="text-[#3E3E43]">|</span>
            <span className="text-[#EFFF4F] font-bold tabular-nums">{userPoints} PTS</span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[#5A5F70]">PROGRESS:</span>
            <span className="font-bold text-[#EFFF4F]">{progressPercentage}%</span>
            <div className="w-20 h-2 bg-[#3E3E43] border border-[#3E3E43] overflow-hidden">
              <div
                className="h-full bg-[#EFFF4F] transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {isEligibleForCertificate && (
            <Link
              href={`/learn/${course?.id || courseId}/quiz`}
              className="px-2.5 py-1 bg-[#EFFF4F] text-[#28282B] font-bold hover:bg-[#EFFF4F]/90 transition-colors flex items-center gap-1 text-[11px] shadow-lemon-sm"
            >
              <Award className="w-3.5 h-3.5" />
              <span>TAKE FINAL EXAM & GET CERTIFICATE</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Player Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Column: Video & Lesson Content */}
        <div className="lg:col-span-8 flex flex-col bg-[#0C0E14] border-r border-[#3E3E43]">
          <div className="relative aspect-video w-full bg-black flex items-center justify-center border-b border-[#3E3E43]">
            {activeLesson.type === "video" ? (
              (() => {
                const url = (activeLesson.videoUrl || (activeLesson as any).video_url || "").trim();

                if (!url) {
                  return (
                    <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                      <Video className="w-12 h-12 text-[#5A5F70]" />
                      <p className="text-sm font-mono text-[#A0A5B5]">
                        No video resource provided for this lesson yet.
                      </p>
                    </div>
                  );
                }

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
                    className="w-full rounded-2xl aspect-video bg-black"
                    onTimeUpdate={(e) => setPlaybackTime(e.currentTarget.currentTime)}
                    onEnded={() => handleMarkCompleted(activeLesson.id)}
                  >
                    <source src={url} type="video/mp4" />
                    Your browser does not support HTML5 video streaming.
                  </video>
                );
              })()
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
                  href={`/learn/${course?.id || courseId}/quiz`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#EFFF4F] text-[#28282B] font-mono text-xs uppercase font-bold hover:bg-[#EFFF4F]/90 transition-colors shadow-lemon-sm"
                >
                  <span>START TIMED QUIZ</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Lesson Metadata */}
          <div className="p-6 bg-[#28282B] flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3E3E43] pb-4">
              <div>
                <div className="font-mono text-xs text-[#5A5F70] uppercase">
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
                    className="px-3 py-2 font-mono text-xs text-[#A0A5B5] hover:text-[#EFFF4F] border border-[#3E3E43] hover:border-[#EFFF4F]/40 transition-colors flex items-center gap-1.5"
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
                      ? "bg-[#EFFF4F]/10 border-[#EFFF4F]/30 text-[#EFFF4F]"
                      : "bg-[#333336] border-[#3E3E43] text-[#A0A5B5] hover:bg-[#3E3E43]"
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
        <div className="lg:col-span-4 bg-[#28282B] flex flex-col h-full border-[#3E3E43]">
          <div className="p-4 border-b border-[#3E3E43] font-mono text-xs font-bold text-[#5A5F70] uppercase tracking-wider flex justify-between items-center">
            <span>CURRICULUM SYLLABUS</span>
            <span className="text-[#EFFF4F]">{completedLessonIds.length} / {allLessons.length} DONE</span>
          </div>

          <div className="overflow-y-auto divide-y divide-[#3E3E43] flex-1">
            {(course?.modules || []).map((mod: any, modIdx: number) => {
              const modLessons = (mod.chapters || []).flatMap((c: any) => c.lessons || []);
              const modCompleted = modLessons.filter((l: any) =>
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
                    {modLessons.map((les: any) => {
                      const isCurrent = les.id === activeLessonId;
                      const isDone = completedLessonIds.includes(les.id);

                      return (
                        <button
                          key={les.id}
                          onClick={() => setActiveLessonId(les.id)}
                          className={`w-full text-left p-2 transition-colors flex items-center justify-between border ${
                            isCurrent
                              ? "bg-[#EFFF4F]/10 border-[#EFFF4F]/30 text-white font-bold"
                              : "border-transparent hover:bg-[#333336] text-[#5A5F70] hover:text-white"
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

          <div className="p-4 border-t border-[#3E3E43] bg-[#0C0E14] font-mono text-xs">
            <Link
              href={`/learn/${course?.id || courseId}/quiz`}
              className="w-full py-2.5 bg-[#EFFF4F] text-[#28282B] font-bold hover:bg-[#EFFF4F]/90 transition-colors flex items-center justify-center gap-2 shadow-lemon-sm"
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
