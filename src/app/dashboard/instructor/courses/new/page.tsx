"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Plus,
  Trash2,
  Layers,
  BookOpen,
  FileText,
  HelpCircle,
  Award,
  Send,
  Loader2,
  CheckCircle2,
  Sparkles,
  Video,
  Upload,
  Image as ImageIcon,
  X,
  ExternalLink,
  HardDrive,
  Youtube,
  FileUp,
  Sliders,
  DollarSign,
  Clock,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { supabase } from "@/lib/supabaseClient";
import { createLesson } from "@/app/actions/courses";

type VideoSourceOption = "MP4_UPLOAD" | "GOOGLE_DRIVE" | "YOUTUBE";

interface LessonDraft {
  id: string;
  title: string;
  durationMinutes: number;
  videoType: VideoSourceOption;
  video_type?: VideoSourceOption;
  videoUrl: string;
  video_url?: string;
  pdfResourceUrl: string;
  pdf_resource_url?: string;
  content: string;
  // Upload states
  isUploadingVideo?: boolean;
  videoUploadProgress?: number;
  isUploadingPdf?: boolean;
  pdfUploadProgress?: number;
}

interface ModuleDraft {
  id: string;
  title: string;
  lessons: LessonDraft[];
}

interface QuizQuestionDraft {
  id: string;
  questionText: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

// Direct Browser-to-Supabase Storage Video Uploader (Bypasses Next.js & Vercel 4.5MB Limits)
async function uploadVideoDirectToSupabase({
  file,
  onProgress,
}: {
  file: File;
  onProgress: (percent: number) => void;
}): Promise<string> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `lessons/${Date.now()}-${sanitizedFileName}`;

  // Direct client browser upload to Supabase Storage endpoint with real-time XHR progress tracking
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const endpoint = `${supabaseUrl}/storage/v1/object/course-videos/${filePath}`;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const { data: publicUrlData } = supabase.storage
          .from("course-videos")
          .getPublicUrl(filePath);

        resolve(publicUrlData.publicUrl);
      } else {
        // Fallback to standard @supabase/supabase-js client method
        try {
          const { data, error } = await supabase.storage
            .from("course-videos")
            .upload(filePath, file, { cacheControl: "3600", upsert: false });

          if (error) {
            reject(new Error(error.message));
          } else if (data) {
            const { data: publicUrlData } = supabase.storage
              .from("course-videos")
              .getPublicUrl(data.path);
            resolve(publicUrlData.publicUrl);
          } else {
            reject(new Error("Supabase direct video upload failed"));
          }
        } catch (clientErr: any) {
          reject(new Error(clientErr.message || "Failed direct video upload to Supabase"));
        }
      }
    };

    xhr.onerror = async () => {
      // Fallback to @supabase/supabase-js client method
      try {
        const { data, error } = await supabase.storage
          .from("course-videos")
          .upload(filePath, file, { cacheControl: "3600", upsert: false });

        if (error) {
          reject(new Error(error.message));
        } else if (data) {
          const { data: publicUrlData } = supabase.storage
            .from("course-videos")
            .getPublicUrl(data.path);
          resolve(publicUrlData.publicUrl);
        } else {
          reject(new Error("Supabase direct video upload connection error"));
        }
      } catch (clientErr: any) {
        reject(new Error(clientErr.message || "Connection error during direct video upload"));
      }
    };

    xhr.open("POST", endpoint);
    xhr.setRequestHeader("Authorization", `Bearer ${supabaseAnonKey}`);
    xhr.setRequestHeader("apikey", supabaseAnonKey);
    xhr.setRequestHeader("Content-Type", file.type || "video/mp4");
    xhr.setRequestHeader("x-upsert", "false");
    xhr.setRequestHeader("cache-control", "max-age=3600");
    xhr.send(file);
  });
}

// XHR upload helper for granular progress tracking
function uploadAssetWithProgress({
  file,
  bucket,
  folder,
  onProgress,
}: {
  file: File;
  bucket: "course-media" | "course-videos";
  folder: string;
  onProgress: (percent: number) => void;
}): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", bucket);
    formData.append("folder", folder);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.success && res.publicUrl) {
            resolve(res.publicUrl);
          } else {
            reject(new Error(res.error || "Upload failed"));
          }
        } catch (e) {
          reject(new Error("Invalid response from upload server"));
        }
      } else {
        try {
          const res = JSON.parse(xhr.responseText);
          reject(new Error(res.error || `Upload failed with HTTP ${xhr.status}`));
        } catch {
          reject(new Error(`Upload failed with HTTP ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network connection error during asset upload"));
    };

    xhr.open("POST", "/api/courses/upload");
    xhr.send(formData);
  });
}

export default function NewCourseBuilderPage() {
  const router = useRouter();

  // Role verification state
  const [isVerifyingRole, setIsVerifyingRole] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string>("");

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Step 1: Basic Metadata (BRD Section 5)
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Automation Testing");
  const [tags, setTags] = useState<string[]>([
    "Playwright",
    "TypeScript",
    "CI/CD",
    "SDET",
  ]);
  const [tagInput, setTagInput] = useState("");

  // Visuals (BRD Section 5)
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const [thumbProgress, setThumbProgress] = useState(0);

  const [bannerUrl, setBannerUrl] = useState("");
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [bannerProgress, setBannerProgress] = useState(0);

  // Step 2: Course Specs (BRD Section 5)
  const [courseObjectives, setCourseObjectives] = useState<string[]>([
    "Architect enterprise-grade test automation frameworks from scratch",
    "Master parallel test orchestration with Docker and GitHub Actions",
  ]);
  const [objectiveInput, setObjectiveInput] = useState("");

  const [targetAudience, setTargetAudience] = useState<string[]>([
    "Manual QA Testers transitioning to SDET roles",
    "Frontend & Backend Engineers needing automated test coverage",
  ]);
  const [audienceInput, setAudienceInput] = useState("");

  const [prerequisites, setPrerequisites] = useState<string[]>([
    "Basic knowledge of JavaScript, TypeScript or Python",
    "Command line familiarity & Node.js installed",
  ]);
  const [prereqInput, setPrereqInput] = useState("");

  const [courseDuration, setCourseDuration] = useState<number>(1200); // in minutes
  const [difficultyLevel, setDifficultyLevel] = useState<string>("BEGINNER");
  const [pricing, setPricing] = useState<string>("2999");
  const [discountPrice, setDiscountPrice] = useState<string>("1999");

  // Step 3: Content Tree (Modules & Lessons)
  const [modules, setModules] = useState<ModuleDraft[]>([
    {
      id: "mod-1",
      title: "Module 1: Test Automation Fundamentals & Core Architecture",
      lessons: [
        {
          id: "les-1",
          title: "Introduction to Test Frameworks & W3C Standards",
          durationMinutes: 25,
          videoType: "MP4_UPLOAD",
          video_type: "MP4_UPLOAD",
          videoUrl: "",
          video_url: "",
          pdfResourceUrl: "",
          content: "Overview of enterprise testing architecture and parallel execution runners.",
        },
      ],
    },
  ]);

  // Step 4: Quiz Builder
  const [quizTitle, setQuizTitle] = useState("Comprehensive SDET Evaluation Exam");
  const [passingThreshold, setPassingThreshold] = useState(70);
  const [questions, setQuestions] = useState<QuizQuestionDraft[]>([
    {
      id: "q-1",
      questionText: "Which architecture pattern guarantees thread-isolated WebDriver instances during parallel test runs?",
      options: [
        { id: "opt-1", text: "Singleton pattern with static global driver" },
        { id: "opt-2", text: "ThreadLocal<WebDriver> wrapper pattern" },
        { id: "opt-3", text: "Direct instantiation inside test methods" },
        { id: "opt-4", text: "Synchronized block on every web element locator" },
      ],
      correctAnswer: "opt-2",
      explanation: "ThreadLocal ensures each worker thread maintains an isolated driver context.",
    },
  ]);

  // Step 5: Certificate Rule
  const [certificateTitle, setCertificateTitle] = useState("Certified SDET Professional");
  const [signatoryName, setSignatoryName] = useState("Rahul Kamat (Founder & Lead SDET)");

  // State & Loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Hidden file input refs
  const thumbInputRef = useRef<HTMLInputElement | null>(null);
  const bannerInputRef = useRef<HTMLInputElement | null>(null);

  // Check user authorization on mount
  useEffect(() => {
    async function checkRoleAccess() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseAnonKey) {
          setIsAuthorized(false);
          setIsVerifyingRole(false);
          return;
        }

        const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsAuthorized(false);
          setIsVerifyingRole(false);
          return;
        }

        const res = await fetch(`/api/student-profile?userId=${user.id}`);
        if (res.ok) {
          const profile = await res.json();
          const role = String(profile.role || "LEARNER").toUpperCase();
          setCurrentUserRole(role);

          const allowed = ["SUPER_ADMIN", "ADMIN", "INSTRUCTOR"].includes(role);
          setIsAuthorized(allowed);
        } else {
          setIsAuthorized(false);
        }
      } catch (err) {
        console.error("Authorization check failed:", err);
        setIsAuthorized(false);
      } finally {
        setIsVerifyingRole(false);
      }
    }

    checkRoleAccess();
  }, []);

  // Tag helper
  const addTag = () => {
    const val = tagInput.trim();
    if (val && !tags.includes(val)) {
      setTags([...tags, val]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Objectives helper
  const addObjective = () => {
    const val = objectiveInput.trim();
    if (val && !courseObjectives.includes(val)) {
      setCourseObjectives([...courseObjectives, val]);
      setObjectiveInput("");
    }
  };

  const removeObjective = (idx: number) => {
    setCourseObjectives(courseObjectives.filter((_, i) => i !== idx));
  };

  // Target audience helper
  const addAudience = () => {
    const val = audienceInput.trim();
    if (val && !targetAudience.includes(val)) {
      setTargetAudience([...targetAudience, val]);
      setAudienceInput("");
    }
  };

  const removeAudience = (idx: number) => {
    setTargetAudience(targetAudience.filter((_, i) => i !== idx));
  };

  // Prerequisites helper
  const addPrereq = () => {
    const val = prereqInput.trim();
    if (val && !prerequisites.includes(val)) {
      setPrerequisites([...prerequisites, val]);
      setPrereqInput("");
    }
  };

  const removePrereq = (idx: number) => {
    setPrerequisites(prerequisites.filter((_, i) => i !== idx));
  };

  // Visual upload handler: Thumbnail
  const handleThumbnailUpload = async (file: File) => {
    if (!file) return;
    setIsUploadingThumb(true);
    setThumbProgress(0);
    setErrorMessage(null);

    try {
      const url = await uploadAssetWithProgress({
        file,
        bucket: "course-media",
        folder: "thumbnails",
        onProgress: (p) => setThumbProgress(p),
      });
      setThumbnailUrl(url);
    } catch (err: any) {
      setErrorMessage(`Thumbnail upload failed: ${err.message}`);
    } finally {
      setIsUploadingThumb(false);
    }
  };

  // Visual upload handler: Banner
  const handleBannerUpload = async (file: File) => {
    if (!file) return;
    setIsUploadingBanner(true);
    setBannerProgress(0);
    setErrorMessage(null);

    try {
      const url = await uploadAssetWithProgress({
        file,
        bucket: "course-media",
        folder: "banners",
        onProgress: (p) => setBannerProgress(p),
      });
      setBannerUrl(url);
    } catch (err: any) {
      setErrorMessage(`Banner upload failed: ${err.message}`);
    } finally {
      setIsUploadingBanner(false);
    }
  };

  // Module helpers
  const addModule = () => {
    const newModId = `mod-${Date.now()}`;
    setModules((prev) => [
      ...prev,
      {
        id: newModId,
        title: `Module ${prev.length + 1}: Architecture Expansion`,
        lessons: [
          {
            id: `les-${Date.now()}`,
            title: "Lesson 1: Deep Dive Implementation",
            durationMinutes: 20,
            videoType: "GOOGLE_DRIVE",
            videoUrl: "",
            pdfResourceUrl: "",
            content: "Review curriculum syllabus guidelines and execute lab exercises.",
          },
        ],
      },
    ]);
  };

  const removeModule = (modId: string) => {
    if (modules.length <= 1) return;
    setModules((prev) => prev.filter((m) => m.id !== modId));
  };

  const addLesson = (modId: string) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== modId) return m;
        return {
          ...m,
          lessons: [
            ...m.lessons,
            {
              id: `les-${Date.now()}`,
              title: `Lesson ${m.lessons.length + 1}: Implementation`,
              durationMinutes: 15,
              videoType: "GOOGLE_DRIVE",
              videoUrl: "",
              pdfResourceUrl: "",
              content: "Lesson content details and technical concepts.",
            },
          ],
        };
      })
    );
  };

  const removeLesson = (modId: string, lesId: string) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== modId) return m;
        if (m.lessons.length <= 1) return m;
        return {
          ...m,
          lessons: m.lessons.filter((l) => l.id !== lesId),
        };
      })
    );
  };

  const updateLesson = (modId: string, lesId: string, updates: Partial<LessonDraft>) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === modId
          ? {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === lesId
                  ? {
                      ...l,
                      ...updates,
                      ...(updates.video_url || updates.videoUrl
                        ? {
                            videoUrl: updates.video_url || updates.videoUrl || "",
                            video_url: updates.video_url || updates.videoUrl || "",
                          }
                        : {}),
                      ...(updates.video_type || updates.videoType
                        ? {
                            videoType: (updates.video_type || updates.videoType || "MP4_UPLOAD") as VideoSourceOption,
                            video_type: (updates.video_type || updates.videoType || "MP4_UPLOAD") as VideoSourceOption,
                          }
                        : {}),
                    }
                  : l
              ),
            }
          : m
      )
    );
  };

  // Lesson MP4 video upload handler (Direct Browser-to-Supabase Storage)
  const handleLessonVideoUpload = async (modId: string, lesId: string, file: File) => {
    if (!file) return;

    // Client-side file size check: if file.size > 50 * 1024 * 1024 (50MB)
    const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50MB Supabase Free Tier limit
    if (file.size > MAX_VIDEO_BYTES) {
      setToastMessage(
        "File exceeds Supabase Free Tier limit (50MB). Please compress the video or use a Google Drive stream link."
      );
      return;
    }

    // Update lesson upload state
    setModules((prev) =>
      prev.map((m) =>
        m.id === modId
          ? {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === lesId
                  ? { ...l, isUploadingVideo: true, videoUploadProgress: 0 }
                  : l
              ),
            }
          : m
      )
    );

    try {
      // 1. Direct browser-to-Supabase upload (bypassing Next.js API & Vercel 4.5MB limit)
      const publicVideoUrl = await uploadVideoDirectToSupabase({
        file,
        onProgress: (percent) => {
          setModules((prev) =>
            prev.map((m) =>
              m.id === modId
                ? {
                    ...m,
                    lessons: m.lessons.map((l) =>
                      l.id === lesId ? { ...l, videoUploadProgress: percent } : l
                    ),
                  }
                : m
            )
          );
        },
      });

      // 2. Update state immediately upon 100% upload completion
      updateLesson(modId, lesId, {
        video_url: publicVideoUrl,
        videoUrl: publicVideoUrl,
        video_type: "MP4_UPLOAD",
        videoType: "MP4_UPLOAD",
        isUploadingVideo: false,
        videoUploadProgress: 100,
      });

      // 3. Save URL Only in Prisma via Server Action createLesson
      // Pass ONLY the string publicVideoUrl back to the Server Action (no File / FormData)
      const targetLesson = modules
        .find((m) => m.id === modId)
        ?.lessons.find((l) => l.id === lesId);

      await createLesson({
        moduleId: modId,
        title: targetLesson?.title || file.name,
        durationMinutes: targetLesson?.durationMinutes || 0,
        videoType: "MP4_UPLOAD",
        videoUrl: publicVideoUrl,
        pdfResourceUrl: targetLesson?.pdfResourceUrl || null,
      }).catch((e) => console.warn("Draft createLesson note:", e));

    } catch (err: any) {
      setErrorMessage(`Lesson MP4 upload error: ${err.message}`);
      setModules((prev) =>
        prev.map((m) =>
          m.id === modId
            ? {
                ...m,
                lessons: m.lessons.map((l) =>
                  l.id === lesId ? { ...l, isUploadingVideo: false } : l
                ),
              }
            : m
        )
      );
    }
  };

  // Lesson PDF resource upload handler
  const handleLessonPdfUpload = async (modId: string, lesId: string, file: File) => {
    if (!file) return;

    setModules((prev) =>
      prev.map((m) =>
        m.id === modId
          ? {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === lesId
                  ? { ...l, isUploadingPdf: true, pdfUploadProgress: 0 }
                  : l
              ),
            }
          : m
      )
    );

    try {
      const publicUrl = await uploadAssetWithProgress({
        file,
        bucket: "course-media",
        folder: "resources",
        onProgress: (percent) => {
          setModules((prev) =>
            prev.map((m) =>
              m.id === modId
                ? {
                    ...m,
                    lessons: m.lessons.map((l) =>
                      l.id === lesId ? { ...l, pdfUploadProgress: percent } : l
                    ),
                  }
                : m
            )
          );
        },
      });

      setModules((prev) =>
        prev.map((m) =>
          m.id === modId
            ? {
                ...m,
                lessons: m.lessons.map((l) =>
                  l.id === lesId
                    ? {
                        ...l,
                        pdfResourceUrl: publicUrl,
                        isUploadingPdf: false,
                        pdfUploadProgress: 100,
                      }
                    : l
                ),
              }
            : m
        )
      );
    } catch (err: any) {
      setErrorMessage(`Lesson PDF upload error: ${err.message}`);
      setModules((prev) =>
        prev.map((m) =>
          m.id === modId
            ? {
                ...m,
                lessons: m.lessons.map((l) =>
                  l.id === lesId ? { ...l, isUploadingPdf: false } : l
                ),
              }
            : m
        )
      );
    }
  };

  // Question helpers
  const addQuestion = () => {
    const qId = `q-${Date.now()}`;
    setQuestions((prev) => [
      ...prev,
      {
        id: qId,
        questionText: "What is the primary role of Page Object Model (POM)?",
        options: [
          { id: "opt-1", text: "Separates UI elements and actions from test assertions" },
          { id: "opt-2", text: "Speeds up network latency" },
          { id: "opt-3", text: "Generates HTML test execution reports" },
          { id: "opt-4", text: "Manages database transactions" },
        ],
        correctAnswer: "opt-1",
        explanation: "POM establishes clean separation of UI locators from test logic.",
      },
    ]);
  };

  const removeQuestion = (qId: string) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((q) => q.id !== qId));
  };

  // Submit Course to API
  const handleSubmitCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim() || !description.trim()) {
      setErrorMessage("Please complete course title and curriculum description.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        description: description.trim(),
        category,
        tags,
        thumbnailUrl: thumbnailUrl || null,
        bannerUrl: bannerUrl || null,
        courseObjectives,
        targetAudience,
        prerequisites,
        courseDuration: Number(courseDuration) || 0,
        difficultyLevel,
        pricing: Number(pricing) || 0,
        discountPrice: discountPrice ? Number(discountPrice) : null,
        price: Number(discountPrice || pricing || 1999),
        modules: modules.map((m, mIdx) => ({
          id: m.id,
          title: m.title,
          order: mIdx + 1,
          lessons: m.lessons.map((l, lIdx) => ({
            id: l.id,
            title: l.title,
            duration: Number(l.durationMinutes || (l as any).duration) || 15,
            durationMinutes: Number(l.durationMinutes || (l as any).duration) || 15,
            video_type: l.video_type || l.videoType || "MP4_UPLOAD",
            videoType: l.video_type || l.videoType || "MP4_UPLOAD",
            video_url: l.video_url || l.videoUrl || "",
            videoUrl: l.video_url || l.videoUrl || "",
            pdf_resource_url: l.pdf_resource_url || l.pdfResourceUrl || null,
            pdfResourceUrl: l.pdf_resource_url || l.pdfResourceUrl || null,
            content: l.content,
            order: lIdx + 1,
          })),
        })),
        quizData: {
          title: quizTitle,
          passingPercentage: Number(passingThreshold),
          questions,
        },
        certificateRule: {
          certificateTitle,
          passingThreshold: Number(passingThreshold),
          signatoryName,
        },
      };

      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit course for approval.");
      }

      setSuccessResult(data.course);

      // Automatically redirect straight to the new course page (/courses/${course.slug})
      const targetSlug = data.course?.slug || data.normalizedCourse?.slug || data.slug || data.course?.id;
      if (targetSlug) {
        router.push(`/courses/${targetSlug}`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit course. Please verify inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state during role verification
  if (isVerifyingRole) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#EFFF4F]" />
        <span className="font-mono text-xs text-[#A0A5B5] uppercase tracking-wider">
          Verifying Instructor & Admin Clearance...
        </span>
      </div>
    );
  }

  // Access Denied state (Super Admin, Admin & Instructor Only)
  if (!isAuthorized) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400 shadow-xl">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
          Access Restricted: Instructor Clearance Required
        </h1>
        <p className="text-sm text-[#A0A5B5] max-w-md mx-auto">
          The Course Builder suite is strictly restricted to certified{" "}
          <strong className="text-white">Instructors</strong>,{" "}
          <strong className="text-white">Admins</strong>, and{" "}
          <strong className="text-white">Super Admins</strong>. Your current role is{" "}
          <span className="font-mono text-xs px-2 py-0.5 bg-[#333336] rounded text-[#EFFF4F] font-bold">
            {currentUserRole || "LEARNER"}
          </span>
          .
        </p>
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#EFFF4F] text-[#28282B] font-bold uppercase rounded-xl hover:bg-[#EFFF4F]/90 transition-all font-mono text-xs"
          >
            <span>Return to Workspace</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-white font-sans relative">
      {/* Toast Notification for Validation Warnings */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 max-w-md p-4 bg-[#1E1E22] border border-amber-500/50 rounded-2xl shadow-2xl flex items-start gap-3 text-amber-300 font-mono text-xs animate-in fade-in slide-in-from-top-4 duration-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold uppercase tracking-wider block text-amber-400 mb-0.5">
              Upload Notice
            </span>
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-amber-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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
            <span className="text-[#EFFF4F]">BRD SECTION 5 COURSE BUILDER</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <span>Enhanced Course Management</span>
            <Sparkles className="w-6 h-6 text-[#EFFF4F]" />
          </h1>
          <p className="text-xs sm:text-sm text-[#A0A5B5] mt-1">
            Author curriculum trees, upload local MP4 videos & PDF resources, connect Google Drive streams, and configure BRD Section 5 course specifications.
          </p>
        </div>
      </div>

      {/* Success Banner */}
      {successResult && (
        <div className="p-6 bg-[#EFFF4F]/10 border border-[#EFFF4F]/40 rounded-2xl shadow-lemon-sm space-y-4 font-mono text-xs">
          <div className="flex items-center gap-3 text-[#EFFF4F]">
            <CheckCircle2 className="w-6 h-6" />
            <h3 className="text-base font-bold uppercase">
              Course Submitted for Admin Approval!
            </h3>
          </div>
          <p className="text-[#A0A5B5]">
            Course <strong className="text-white">"{successResult.title}"</strong> has been saved with status{" "}
            <span className="px-2 py-0.5 bg-[#EFFF4F]/20 text-[#EFFF4F] font-bold border border-[#EFFF4F]/30 rounded">
              {successResult.status}
            </span>
            . In accordance with BRD Section 5 & 45, all Google Drive links have been processed into stream previews and stored in the database.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/dashboard/instructor"
              className="px-4 py-2 bg-[#EFFF4F] text-[#28282B] font-bold uppercase rounded-lg shadow-lemon-sm hover:bg-[#EFFF4F]/90 transition-colors"
            >
              Back to Creator Dashboard
            </Link>
            <Link
              href="/dashboard/admin/approvals"
              className="px-4 py-2 bg-[#28282B] border border-[#3E3E43] text-white hover:border-[#EFFF4F]/40 font-bold uppercase rounded-lg transition-colors"
            >
              View in Admin Approval Queue
            </Link>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-mono text-xs flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {!successResult && (
        <form onSubmit={handleSubmitCourse} className="space-y-8">
          {/* SECTION 1: Basic Metadata & Visuals (BRD Section 5) */}
          <div className="bg-[#1E1E22] border border-[#3E3E43] rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center gap-2 border-b border-[#3E3E43] pb-3">
              <BookOpen className="w-4 h-4 text-[#EFFF4F]" />
              <h2 className="font-mono text-xs uppercase font-bold tracking-wider text-white">
                1. Basic Course Metadata & Visual Assets
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#A0A5B5] mb-1">
                  Course Title <span className="text-[#EFFF4F]">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Playwright + TypeScript: Full-Stack Test Engineering"
                  className="w-full px-4 py-2.5 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] focus:outline-none rounded-xl text-sm font-sans text-white placeholder-[#5A5F70]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#A0A5B5] mb-1">
                  Subtitle / High-Impact Tagline
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Zero to Production-Ready CI/CD Automation Architect in 60 Days"
                  className="w-full px-4 py-2.5 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] focus:outline-none rounded-xl text-sm font-sans text-white placeholder-[#5A5F70]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#A0A5B5] mb-1">
                  Curriculum Description <span className="text-[#EFFF4F]">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Comprehensive syllabus overview, learning objectives, and hands-on lab projects..."
                  className="w-full px-4 py-2.5 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] focus:outline-none rounded-xl text-sm font-sans text-white placeholder-[#5A5F70]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#A0A5B5] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] focus:outline-none rounded-xl text-xs font-mono text-white"
                  >
                    <option value="Automation Testing">Automation Testing</option>
                    <option value="Modern Web Testing">Modern Web Testing</option>
                    <option value="API & Microservices Testing">API & Microservices Testing</option>
                    <option value="Performance & Load Testing">Performance & Load Testing</option>
                    <option value="Security & Pentesting">Security & Pentesting</option>
                    <option value="DevOps & CI/CD Pipelines">DevOps & CI/CD Pipelines</option>
                  </select>
                </div>

                {/* Tags input with pills */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#A0A5B5] mb-1">
                    Tags (Press Enter to Add)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      placeholder="e.g. Cypress, Docker"
                      className="flex-1 px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] focus:outline-none rounded-xl text-xs font-mono text-white placeholder-[#5A5F70]"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-3 py-2 bg-[#333336] hover:bg-[#3E3E43] border border-[#3E3E43] text-xs font-mono font-bold rounded-xl transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 text-[#EFFF4F] rounded-full text-[11px] font-mono"
                      >
                        <span>#{t}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(t)}
                          className="hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Visual Assets Upload Section */}
              <div className="pt-2 border-t border-[#3E3E43] space-y-4">
                <span className="block text-xs font-mono font-bold uppercase text-[#A0A5B5]">
                  Visual Assets (File Explorer Drag & Drop → Supabase Storage: course-media)
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Thumbnail Upload */}
                  <div className="p-4 bg-[#28282B] border border-[#3E3E43] rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-[#EFFF4F]" />
                        Course Thumbnail (.jpg, .png, .webp)
                      </span>
                      {thumbnailUrl && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                          Uploaded
                        </span>
                      )}
                    </div>

                    <input
                      type="file"
                      ref={thumbInputRef}
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleThumbnailUpload(file);
                      }}
                    />

                    {thumbnailUrl ? (
                      <div className="relative group rounded-lg overflow-hidden border border-[#3E3E43] h-32 bg-black flex items-center justify-center">
                        <img
                          src={thumbnailUrl}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setThumbnailUrl("")}
                          className="absolute top-2 right-2 p-1.5 bg-black/80 text-red-400 hover:text-white rounded-lg border border-white/20 transition-all opacity-0 group-hover:opacity-100"
                          title="Remove thumbnail"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => thumbInputRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const file = e.dataTransfer.files?.[0];
                          if (file) handleThumbnailUpload(file);
                        }}
                        className="border-2 border-dashed border-[#3E3E43] hover:border-[#EFFF4F]/50 rounded-xl p-5 text-center cursor-pointer transition-colors bg-[#1E1E22]/50 hover:bg-[#1E1E22]"
                      >
                        <Upload className="w-6 h-6 text-[#A0A5B5] mx-auto mb-1" />
                        <span className="text-xs font-mono text-white block font-bold">
                          Click to select or drag & drop Thumbnail
                        </span>
                        <span className="text-[10px] font-mono text-[#5A5F70]">
                          16:9 ratio recommended (Max 50MB)
                        </span>
                      </div>
                    )}

                    {isUploadingThumb && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono text-[#A0A5B5]">
                          <span>Uploading to course-media...</span>
                          <span className="text-[#EFFF4F] font-bold">{thumbProgress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#333336] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#EFFF4F] transition-all duration-200"
                            style={{ width: `${thumbProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Banner Upload */}
                  <div className="p-4 bg-[#28282B] border border-[#3E3E43] rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-[#06B6D4]" />
                        Course Banner Header (.jpg, .png, .webp)
                      </span>
                      {bannerUrl && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                          Uploaded
                        </span>
                      )}
                    </div>

                    <input
                      type="file"
                      ref={bannerInputRef}
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleBannerUpload(file);
                      }}
                    />

                    {bannerUrl ? (
                      <div className="relative group rounded-lg overflow-hidden border border-[#3E3E43] h-32 bg-black flex items-center justify-center">
                        <img
                          src={bannerUrl}
                          alt="Banner preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setBannerUrl("")}
                          className="absolute top-2 right-2 p-1.5 bg-black/80 text-red-400 hover:text-white rounded-lg border border-white/20 transition-all opacity-0 group-hover:opacity-100"
                          title="Remove banner"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => bannerInputRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const file = e.dataTransfer.files?.[0];
                          if (file) handleBannerUpload(file);
                        }}
                        className="border-2 border-dashed border-[#3E3E43] hover:border-[#06B6D4]/50 rounded-xl p-5 text-center cursor-pointer transition-colors bg-[#1E1E22]/50 hover:bg-[#1E1E22]"
                      >
                        <Upload className="w-6 h-6 text-[#A0A5B5] mx-auto mb-1" />
                        <span className="text-xs font-mono text-white block font-bold">
                          Click to select or drag & drop Banner
                        </span>
                        <span className="text-[10px] font-mono text-[#5A5F70]">
                          Wide 21:9 or 16:9 banner (Max 50MB)
                        </span>
                      </div>
                    )}

                    {isUploadingBanner && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono text-[#A0A5B5]">
                          <span>Uploading to course-media...</span>
                          <span className="text-[#06B6D4] font-bold">{bannerProgress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#333336] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#06B6D4] transition-all duration-200"
                            style={{ width: `${bannerProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Course Specs (BRD Section 5) */}
          <div className="bg-[#1E1E22] border border-[#3E3E43] rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center gap-2 border-b border-[#3E3E43] pb-3">
              <Sliders className="w-4 h-4 text-[#EFFF4F]" />
              <h2 className="font-mono text-xs uppercase font-bold tracking-wider text-white">
                2. Course Specifications & Target Demographics (BRD Section 5)
              </h2>
            </div>

            <div className="space-y-4 font-mono text-xs">
              {/* Objectives */}
              <div>
                <label className="block font-bold uppercase text-[#A0A5B5] mb-1">
                  Course Objectives (What students will build & master)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={objectiveInput}
                    onChange={(e) => setObjectiveInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addObjective();
                      }
                    }}
                    placeholder="e.g. Master Page Object Model & Page Component Patterns"
                    className="flex-1 px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] rounded-xl text-white placeholder-[#5A5F70]"
                  />
                  <button
                    type="button"
                    onClick={addObjective}
                    className="px-3 py-2 bg-[#333336] hover:bg-[#3E3E43] border border-[#3E3E43] font-bold rounded-xl text-white"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1.5 mt-2">
                  {courseObjectives.map((obj, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-[#28282B] border border-[#3E3E43] rounded-lg text-white font-sans text-xs"
                    >
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#EFFF4F] shrink-0" />
                        <span>{obj}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => removeObjective(idx)}
                        className="text-[#5A5F70] hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Audience & Prerequisites */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-bold uppercase text-[#A0A5B5] mb-1">
                    Target Audience
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={audienceInput}
                      onChange={(e) => setAudienceInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addAudience();
                        }
                      }}
                      placeholder="e.g. QA Engineers, Devs"
                      className="flex-1 px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] rounded-xl text-white placeholder-[#5A5F70]"
                    />
                    <button
                      type="button"
                      onClick={addAudience}
                      className="px-3 py-2 bg-[#333336] hover:bg-[#3E3E43] border border-[#3E3E43] font-bold rounded-xl text-white"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-1 mt-2">
                    {targetAudience.map((aud, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-1.5 bg-[#28282B] border border-[#3E3E43] rounded-lg text-white font-sans text-[11px]"
                      >
                        <span>• {aud}</span>
                        <button
                          type="button"
                          onClick={() => removeAudience(idx)}
                          className="text-[#5A5F70] hover:text-red-400 p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase text-[#A0A5B5] mb-1">
                    Prerequisites
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={prereqInput}
                      onChange={(e) => setPrereqInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addPrereq();
                        }
                      }}
                      placeholder="e.g. Basic JS / Git"
                      className="flex-1 px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] rounded-xl text-white placeholder-[#5A5F70]"
                    />
                    <button
                      type="button"
                      onClick={addPrereq}
                      className="px-3 py-2 bg-[#333336] hover:bg-[#3E3E43] border border-[#3E3E43] font-bold rounded-xl text-white"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-1 mt-2">
                    {prerequisites.map((pre, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-1.5 bg-[#28282B] border border-[#3E3E43] rounded-lg text-white font-sans text-[11px]"
                      >
                        <span>• {pre}</span>
                        <button
                          type="button"
                          onClick={() => removePrereq(idx)}
                          className="text-[#5A5F70] hover:text-red-400 p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Course Duration, Difficulty, Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 border-t border-[#3E3E43]">
                <div>
                  <label className="block font-bold uppercase text-[#A0A5B5] mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#EFFF4F]" />
                    Total Duration (Min)
                  </label>
                  <input
                    type="number"
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(Number(e.target.value))}
                    min={1}
                    className="w-full px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] rounded-xl text-white text-xs font-mono"
                  />
                  <span className="text-[10px] text-[#5A5F70] mt-0.5 block">
                    ≈ {(courseDuration / 60).toFixed(1)} Hours
                  </span>
                </div>

                <div>
                  <label className="block font-bold uppercase text-[#A0A5B5] mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={difficultyLevel}
                    onChange={(e) => setDifficultyLevel(e.target.value)}
                    className="w-full px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] rounded-xl text-white text-xs font-mono"
                  >
                    <option value="BEGINNER">BEGINNER</option>
                    <option value="INTERMEDIATE">INTERMEDIATE</option>
                    <option value="ADVANCED">ADVANCED</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-[#A0A5B5] mb-1 flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-emerald-400" />
                    Standard Price (₹)
                  </label>
                  <input
                    type="number"
                    value={pricing}
                    onChange={(e) => setPricing(e.target.value)}
                    className="w-full px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] rounded-xl text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-[#A0A5B5] mb-1 flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-[#EFFF4F]" />
                    Discount Price (₹)
                  </label>
                  <input
                    type="number"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] rounded-xl text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Curriculum Content Tree (Image 1 Refactor) */}
          <div className="bg-[#1E1E22] border border-[#3E3E43] rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#3E3E43] pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#EFFF4F]" />
                <h2 className="font-mono text-xs uppercase font-bold tracking-wider text-white">
                  3. Curriculum Content Tree ({modules.length} Modules)
                </h2>
              </div>
              <button
                type="button"
                onClick={addModule}
                className="px-3 py-1.5 bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 text-[#EFFF4F] hover:bg-[#EFFF4F]/20 font-mono text-xs font-bold uppercase rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Module</span>
              </button>
            </div>

            <div className="space-y-6">
              {modules.map((mod, modIdx) => (
                <div
                  key={mod.id}
                  className="p-5 bg-[#28282B] border border-[#3E3E43] rounded-xl space-y-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="text"
                      value={mod.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setModules((prev) =>
                          prev.map((m) => (m.id === mod.id ? { ...m, title: val } : m))
                        );
                      }}
                      className="flex-1 px-3 py-1.5 bg-[#1E1E22] border border-[#3E3E43] focus:border-[#EFFF4F] rounded-lg text-sm font-bold text-white font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => removeModule(mod.id)}
                      disabled={modules.length <= 1}
                      className="p-2 text-[#5A5F70] hover:text-red-400 disabled:opacity-30 transition-colors"
                      title="Remove Module"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Lessons list */}
                  <div className="space-y-4 pl-3 border-l-2 border-[#3E3E43]">
                    <div className="text-[11px] font-mono text-[#5A5F70] uppercase font-bold flex items-center justify-between">
                      <span>Lessons & Media Streams ({mod.lessons.length})</span>
                    </div>

                    {mod.lessons.map((les, lesIdx) => (
                      <div
                        key={les.id}
                        className="p-4 bg-[#1E1E22] border border-[#3E3E43] rounded-xl space-y-3 text-xs font-mono"
                      >
                        {/* Title and Duration */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-[#EFFF4F] font-bold text-[11px]">
                              #{lesIdx + 1}
                            </span>
                            <input
                              type="text"
                              value={les.title}
                              onChange={(e) => {
                                const val = e.target.value;
                                setModules((prev) =>
                                  prev.map((m) =>
                                    m.id === mod.id
                                      ? {
                                          ...m,
                                          lessons: m.lessons.map((l) =>
                                            l.id === les.id ? { ...l, title: val } : l
                                          ),
                                        }
                                      : m
                                  )
                                );
                              }}
                              placeholder="Lesson Title (e.g. Automated CI/CD Setup with Playwright)"
                              className="flex-1 px-3 py-1.5 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] rounded-lg text-white font-sans text-xs"
                            />
                          </div>
                          <div className="flex items-center gap-1.5 self-end sm:self-auto">
                            <input
                              type="number"
                              value={les.durationMinutes}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setModules((prev) =>
                                  prev.map((m) =>
                                    m.id === mod.id
                                      ? {
                                          ...m,
                                          lessons: m.lessons.map((l) =>
                                            l.id === les.id
                                              ? { ...l, durationMinutes: val }
                                              : l
                                          ),
                                        }
                                      : m
                                  )
                                );
                              }}
                              className="w-16 px-2 py-1 bg-[#28282B] border border-[#3E3E43] text-center text-white rounded"
                              title="Minutes"
                            />
                            <span className="text-[#5A5F70]">min</span>
                            <button
                              type="button"
                              onClick={() => removeLesson(mod.id, les.id)}
                              disabled={mod.lessons.length <= 1}
                              className="p-1 text-[#5A5F70] hover:text-red-400 disabled:opacity-30 ml-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* VIDEO RESOURCE SELECTOR (Tabs / Toggle) */}
                        <div className="p-3 bg-[#28282B] border border-[#3E3E43] rounded-lg space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#3E3E43] pb-2">
                            <span className="text-[11px] font-mono font-bold uppercase text-[#A0A5B5] flex items-center gap-1.5">
                              <Video className="w-3.5 h-3.5 text-[#EFFF4F]" />
                              Video Stream Source
                            </span>

                            {/* Selector Toggles: Option A, Option B, Option C */}
                            <div className="flex rounded-lg bg-[#1E1E22] p-0.5 border border-[#3E3E43] text-[11px] font-mono">
                              <button
                                type="button"
                                onClick={() => {
                                  setModules((prev) =>
                                    prev.map((m) =>
                                      m.id === mod.id
                                        ? {
                                            ...m,
                                            lessons: m.lessons.map((l) =>
                                              l.id === les.id
                                                ? { ...l, videoType: "GOOGLE_DRIVE" }
                                                : l
                                            ),
                                          }
                                        : m
                                    )
                                  );
                                }}
                                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                                  les.videoType === "GOOGLE_DRIVE"
                                    ? "bg-[#EFFF4F] text-[#28282B] font-bold"
                                    : "text-[#A0A5B5] hover:text-white"
                                }`}
                              >
                                <HardDrive className="w-3 h-3" />
                                <span>Google Drive</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setModules((prev) =>
                                    prev.map((m) =>
                                      m.id === mod.id
                                        ? {
                                            ...m,
                                            lessons: m.lessons.map((l) =>
                                              l.id === les.id
                                                ? { ...l, videoType: "MP4_UPLOAD" }
                                                : l
                                            ),
                                          }
                                        : m
                                    )
                                  );
                                }}
                                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                                  les.videoType === "MP4_UPLOAD"
                                    ? "bg-[#EFFF4F] text-[#28282B] font-bold"
                                    : "text-[#A0A5B5] hover:text-white"
                                }`}
                              >
                                <Upload className="w-3 h-3" />
                                <span>Local MP4</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setModules((prev) =>
                                    prev.map((m) =>
                                      m.id === mod.id
                                        ? {
                                            ...m,
                                            lessons: m.lessons.map((l) =>
                                              l.id === les.id
                                                ? { ...l, videoType: "YOUTUBE" }
                                                : l
                                            ),
                                          }
                                        : m
                                    )
                                  );
                                }}
                                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                                  les.videoType === "YOUTUBE"
                                    ? "bg-[#EFFF4F] text-[#28282B] font-bold"
                                    : "text-[#A0A5B5] hover:text-white"
                                }`}
                              >
                                <Youtube className="w-3 h-3" />
                                <span>YouTube</span>
                              </button>
                            </div>
                          </div>

                          {/* OPTION A: File Explorer Upload (.mp4) */}
                          {les.videoType === "MP4_UPLOAD" && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <label className="px-3 py-1.5 bg-[#333336] hover:bg-[#3E3E43] border border-[#3E3E43] text-[#EFFF4F] font-bold rounded-lg cursor-pointer flex items-center gap-1.5 transition-colors">
                                  <FileUp className="w-3.5 h-3.5" />
                                  <span>[ Choose MP4 Video ]</span>
                                  <input
                                    type="file"
                                    accept="video/mp4"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleLessonVideoUpload(mod.id, les.id, file);
                                    }}
                                  />
                                </label>
                                <span className="text-[11px] text-[#5A5F70]">
                                  Uploads directly to Supabase storage bucket: `course-videos`
                                </span>
                              </div>

                              {les.isUploadingVideo && (
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[11px] text-[#A0A5B5]">
                                    <span className="flex items-center gap-1">
                                      <Loader2 className="w-3 h-3 animate-spin text-[#EFFF4F]" />
                                      Streaming MP4 to course-videos bucket...
                                    </span>
                                    <span className="text-[#EFFF4F] font-bold">
                                      {les.videoUploadProgress}%
                                    </span>
                                  </div>
                                  <div className="w-full h-1.5 bg-[#1E1E22] rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-[#EFFF4F] transition-all duration-150"
                                      style={{ width: `${les.videoUploadProgress}%` }}
                                    />
                                  </div>
                                </div>
                              )}

                              {les.videoUrl && !les.isUploadingVideo && (
                                <div className="flex items-center justify-between p-2 bg-[#1E1E22] border border-emerald-500/30 rounded-lg text-emerald-400 text-[11px]">
                                  <span className="truncate max-w-[400px]">
                                    {les.videoUrl}
                                  </span>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <a
                                      href={les.videoUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-[#EFFF4F] hover:underline flex items-center gap-1"
                                    >
                                      <span>Preview</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setModules((prev) =>
                                          prev.map((m) =>
                                            m.id === mod.id
                                              ? {
                                                  ...m,
                                                  lessons: m.lessons.map((l) =>
                                                    l.id === les.id ? { ...l, videoUrl: "" } : l
                                                  ),
                                                }
                                              : m
                                          )
                                        );
                                      }}
                                      className="text-red-400 hover:text-white p-0.5"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* OPTION B: Google Drive Link Input */}
                          {les.videoType === "GOOGLE_DRIVE" && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E1E22] border border-[#3E3E43] focus-within:border-[#EFFF4F] rounded-lg">
                                <HardDrive className="w-3.5 h-3.5 text-[#EFFF4F] shrink-0" />
                                <input
                                  type="text"
                                  value={les.videoUrl}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setModules((prev) =>
                                      prev.map((m) =>
                                        m.id === mod.id
                                          ? {
                                              ...m,
                                              lessons: m.lessons.map((l) =>
                                                l.id === les.id ? { ...l, videoUrl: val } : l
                                              ),
                                            }
                                          : m
                                      )
                                    );
                                  }}
                                  placeholder="Paste Google Drive share URL (e.g. https://drive.google.com/file/d/FILE_ID/view)"
                                  className="w-full bg-transparent focus:outline-none text-white text-xs placeholder-[#5A5F70]"
                                />
                              </div>
                              <p className="text-[10px] text-[#A0A5B5] flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-[#EFFF4F] shrink-0" />
                                <span>
                                  Background queue sequentially sanitizes Drive links into embeddable stream preview links (
                                  <code className="text-[#EFFF4F]">/preview</code>) to bypass CSP restrictions.
                                </span>
                              </p>
                            </div>
                          )}

                          {/* OPTION C: YouTube Link Input */}
                          {les.videoType === "YOUTUBE" && (
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E1E22] border border-[#3E3E43] focus-within:border-red-400 rounded-lg">
                                <Youtube className="w-3.5 h-3.5 text-red-400 shrink-0" />
                                <input
                                  type="text"
                                  value={les.videoUrl}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setModules((prev) =>
                                      prev.map((m) =>
                                        m.id === mod.id
                                          ? {
                                              ...m,
                                              lessons: m.lessons.map((l) =>
                                                l.id === les.id ? { ...l, videoUrl: val } : l
                                              ),
                                            }
                                          : m
                                      )
                                    );
                                  }}
                                  placeholder="Paste YouTube Video URL (e.g. https://www.youtube.com/watch?v=...)"
                                  className="w-full bg-transparent focus:outline-none text-white text-xs placeholder-[#5A5F70]"
                                />
                              </div>
                            </div>
                          )}

                          {/* PDF & LEARNING RESOURCE UPLOAD (FILE EXPLORER) */}
                          <div className="pt-2 border-t border-[#3E3E43]/60 space-y-2">
                            <span className="text-[11px] font-mono font-bold uppercase text-[#A0A5B5] flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-[#06B6D4]" />
                              PDF & Learning Resource (File Explorer → course-media)
                            </span>

                            <div className="flex flex-wrap items-center gap-2">
                              <label className="px-3 py-1.5 bg-[#333336] hover:bg-[#3E3E43] border border-[#3E3E43] text-[#06B6D4] font-bold rounded-lg cursor-pointer flex items-center gap-1.5 transition-colors">
                                <FileUp className="w-3.5 h-3.5" />
                                <span>[ Choose PDF File ]</span>
                                <input
                                  type="file"
                                  accept="application/pdf"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleLessonPdfUpload(mod.id, les.id, file);
                                  }}
                                />
                              </label>

                              {les.pdfResourceUrl && (
                                <div className="flex items-center gap-2 px-2.5 py-1 bg-[#1E1E22] border border-[#06B6D4]/40 rounded-lg text-[#06B6D4]">
                                  <span className="truncate max-w-[280px]">
                                    {les.pdfResourceUrl.split("/").pop()}
                                  </span>
                                  <a
                                    href={les.pdfResourceUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:underline flex items-center"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setModules((prev) =>
                                        prev.map((m) =>
                                          m.id === mod.id
                                            ? {
                                                ...m,
                                                lessons: m.lessons.map((l) =>
                                                  l.id === les.id ? { ...l, pdfResourceUrl: "" } : l
                                                ),
                                              }
                                            : m
                                        )
                                      );
                                    }}
                                    className="text-red-400 hover:text-white"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>

                            {les.isUploadingPdf && (
                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] text-[#A0A5B5]">
                                  <span className="flex items-center gap-1">
                                    <Loader2 className="w-3 h-3 animate-spin text-[#06B6D4]" />
                                    Uploading PDF to course-media...
                                  </span>
                                  <span className="text-[#06B6D4] font-bold">
                                    {les.pdfUploadProgress}%
                                  </span>
                                </div>
                                <div className="w-full h-1.5 bg-[#1E1E22] rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#06B6D4] transition-all duration-150"
                                    style={{ width: `${les.pdfUploadProgress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addLesson(mod.id)}
                      className="text-xs font-mono text-[#EFFF4F] hover:underline flex items-center gap-1 pt-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Lesson to {mod.title.split(":")[0]}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: Assessment Quiz Builder */}
          <div className="bg-[#1E1E22] border border-[#3E3E43] rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#3E3E43] pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#EFFF4F]" />
                <h2 className="font-mono text-xs uppercase font-bold tracking-wider text-white">
                  4. Assessment Quiz Engine ({questions.length} Questions)
                </h2>
              </div>
              <button
                type="button"
                onClick={addQuestion}
                className="px-3 py-1.5 bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 text-[#EFFF4F] hover:bg-[#EFFF4F]/20 font-mono text-xs font-bold uppercase rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Question</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#A0A5B5] mb-1">
                  Quiz Title
                </label>
                <input
                  type="text"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] rounded-xl text-xs font-mono text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#A0A5B5] mb-1">
                  Passing Threshold Percentage (%)
                </label>
                <input
                  type="number"
                  value={passingThreshold}
                  onChange={(e) => setPassingThreshold(Number(e.target.value))}
                  min={50}
                  max={100}
                  className="w-full px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] rounded-xl text-xs font-mono text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              {questions.map((q, qIdx) => (
                <div
                  key={q.id}
                  className="p-4 bg-[#28282B] border border-[#3E3E43] rounded-xl space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-[#EFFF4F] font-bold">
                      Q0{qIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={q.questionText}
                      onChange={(e) => {
                        const val = e.target.value;
                        setQuestions((prev) =>
                          prev.map((item) => (item.id === q.id ? { ...item, questionText: val } : item))
                        );
                      }}
                      className="flex-1 px-3 py-1 bg-[#1E1E22] border border-[#3E3E43] focus:border-[#EFFF4F] rounded text-xs font-sans text-white"
                      placeholder="Question prompt..."
                    />
                    <button
                      type="button"
                      onClick={() => removeQuestion(q.id)}
                      disabled={questions.length <= 1}
                      className="p-1 text-[#5A5F70] hover:text-red-400 disabled:opacity-30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Options */}
                  <div className="space-y-1.5 pl-6 font-mono text-xs">
                    {q.options.map((opt) => (
                      <div key={opt.id} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${q.id}`}
                          checked={q.correctAnswer === opt.id}
                          onChange={() => {
                            setQuestions((prev) =>
                              prev.map((item) =>
                                item.id === q.id ? { ...item, correctAnswer: opt.id } : item
                              )
                            );
                          }}
                          className="accent-[#EFFF4F]"
                          title="Select as correct option"
                        />
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => {
                            const val = e.target.value;
                            setQuestions((prev) =>
                              prev.map((item) =>
                                item.id === q.id
                                  ? {
                                      ...item,
                                      options: item.options.map((o) =>
                                        o.id === opt.id ? { ...o, text: val } : o
                                      ),
                                    }
                                  : item
                              )
                            );
                          }}
                          className="flex-1 px-2.5 py-1 bg-[#1E1E22] border border-[#3E3E43] focus:border-[#EFFF4F] rounded text-white text-[11px]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: Certificate Rule & Issuance */}
          <div className="bg-[#1E1E22] border border-[#3E3E43] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-[#3E3E43] pb-3">
              <Award className="w-4 h-4 text-[#EFFF4F]" />
              <h2 className="font-mono text-xs uppercase font-bold tracking-wider text-white">
                5. Certificate Rule & Issuance Policy
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <label className="block font-bold uppercase text-[#A0A5B5] mb-1">
                  Accredited Credential Title
                </label>
                <input
                  type="text"
                  value={certificateTitle}
                  onChange={(e) => setCertificateTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[#A0A5B5] mb-1">
                  Signatory Authority
                </label>
                <input
                  type="text"
                  value={signatoryName}
                  onChange={(e) => setSignatoryName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] rounded-xl text-white"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#3E3E43] pt-6 font-mono text-xs gap-4">
            <div className="text-[#A0A5B5]">
              Course will be submitted with status:{" "}
              <strong className="text-[#EFFF4F]">PENDING_APPROVAL</strong>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isUploadingThumb || isUploadingBanner}
              className="px-8 py-3.5 bg-[#EFFF4F] text-[#28282B] font-bold uppercase rounded-xl shadow-lemon-sm hover:bg-[#EFFF4F]/90 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Streams & Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Course for Approval</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
