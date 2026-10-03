"use server";

import { prisma } from "@/lib/prisma";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { processModulesStreamTree } from "@/lib/gdriveProcessor";

export type VideoSourceType = "MP4_UPLOAD" | "GOOGLE_DRIVE" | "YOUTUBE";

export interface LessonInput {
  id?: string;
  title: string;
  duration?: number;
  duration_minutes?: number;
  durationMinutes?: number;
  video_type?: VideoSourceType | string;
  videoType?: VideoSourceType | string;
  video_url?: string;
  videoUrl?: string;
  pdf_resource_url?: string | null;
  pdfResourceUrl?: string | null;
  content?: string;
  order?: number;
}

export interface ModuleInput {
  id?: string;
  title: string;
  order?: number;
  lessons: LessonInput[];
}

export interface CourseCreatePayload {
  title: string;
  subtitle?: string;
  description: string;
  instructorId?: string;
  category?: string;
  tags?: string[];
  thumbnailUrl?: string | null;
  bannerUrl?: string | null;
  courseObjectives?: string[];
  targetAudience?: string[];
  prerequisites?: string[];
  courseDuration?: number;
  difficultyLevel?: string;
  pricing?: number;
  discountPrice?: number | null;
  price?: number;
  modules: ModuleInput[];
  quizData?: any;
  certificateRule?: any;
  slug?: string;
}

/**
 * Server Action: createCourse
 * Persists course, modules, and lessons directly into Supabase PostgreSQL via Prisma.
 * Guarantees that uploaded Supabase Storage video URLs are saved cleanly into course_lessons.
 */
export async function createCourse(payload: CourseCreatePayload) {
  try {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return { success: false, error: "Supabase credentials missing" };
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized: User authentication required" };
    }

    const profile = await prisma.profiles.findFirst({
      where: {
        OR: [{ user_id: user.id }, { id: user.id }],
      },
    });

    const role = (profile?.role || user.user_metadata?.role || "").toUpperCase();
    if (!["SUPER_ADMIN", "ADMIN", "INSTRUCTOR"].includes(role)) {
      return {
        success: false,
        error: "Unauthorized: Course creation is strictly restricted to Instructors, Admins, and Super Admins.",
      };
    }

    let instructorId = payload.instructorId || profile?.id || user.id;
    let instructorName = profile?.full_name || user.user_metadata?.full_name || "Lead Instructor";

    // Sequential Google Drive link stream processing
    const sanitizedModules = await processModulesStreamTree((payload.modules || []) as any);

    const safeDifficulty = ["BEGINNER", "INTERMEDIATE", "ADVANCED"].includes(
      String(payload.difficultyLevel || "BEGINNER").toUpperCase()
    )
      ? String(payload.difficultyLevel || "BEGINNER").toUpperCase()
      : "BEGINNER";

    // Automatically calculate a unique URL slug (title-randomId)
    const baseSlug = (payload.slug || payload.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;

    // 1. Create in normalized courses table with relational course_modules and course_lessons
    // Persists video_url directly from uploaded Supabase Storage public URLs
    const newCourseNormalized = await prisma.courses.create({
      data: {
        title: payload.title,
        subtitle: payload.subtitle || null,
        description: payload.description,
        instructor_id: instructorId,
        category: payload.category || "Automation Testing",
        tags: Array.isArray(payload.tags) ? payload.tags : [],
        thumbnail_url: payload.thumbnailUrl || null,
        banner_url: payload.bannerUrl || null,
        course_objectives: Array.isArray(payload.courseObjectives) ? payload.courseObjectives : [],
        target_audience: Array.isArray(payload.targetAudience) ? payload.targetAudience : [],
        prerequisites: Array.isArray(payload.prerequisites) ? payload.prerequisites : [],
        course_duration: payload.courseDuration ? Number(payload.courseDuration) : null,
        difficulty_level: safeDifficulty,
        pricing: Number(payload.price || payload.pricing || 0),
        discount_price: payload.discountPrice ? Number(payload.discountPrice) : null,
        course_status: "PENDING_APPROVAL",
        modules: {
          create: sanitizedModules.map((module: any, mIdx: number) => ({
            title: module.title || `Module ${mIdx + 1}`,
            order_index: module.order || mIdx + 1,
            lessons: {
              create: (module.lessons || []).map((lesson: any) => {
                let videoType: VideoSourceType =
                  (lesson.video_type || lesson.videoType) as VideoSourceType;
                const videoUrl = (lesson.video_url || lesson.videoUrl || "").trim();

                if (!videoType) {
                  if (videoUrl.includes("drive.google.com")) {
                    videoType = "GOOGLE_DRIVE";
                  } else if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
                    videoType = "YOUTUBE";
                  } else {
                    videoType = "MP4_UPLOAD";
                  }
                }

                return {
                  title: lesson.title || "Lesson",
                  duration_minutes:
                    Number(lesson.duration || lesson.duration_minutes || lesson.durationMinutes) ||
                    0,
                  video_type: videoType,
                  video_url: videoUrl, // MUST be the uploaded Supabase URL string
                  pdf_resource_url: lesson.pdf_resource_url || lesson.pdfResourceUrl || null,
                };
              }),
            },
          })),
        },
      },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    // 2. Also save into published_courses for backward compatibility with storefront & admin approvals
    const newPublishedCourse = await prisma.published_courses.create({
      data: {
        id: newCourseNormalized.id,
        slug: uniqueSlug,
        title: payload.title,
        description: payload.description,
        price: Number(payload.discountPrice || payload.pricing || payload.price || 0),
        category: payload.category || "Automation Testing",
        level: safeDifficulty,
        instructor_id: instructorId,
        instructor_name: instructorName,
        status: "PENDING_APPROVAL",
        modules: sanitizedModules.map((m: any) => ({
          ...m,
          lessons: (m.lessons || []).map((l: any) => ({
            ...l,
            videoUrl: l.video_url || l.videoUrl || "",
            video_url: l.video_url || l.videoUrl || "",
            videoType: l.video_type || l.videoType || "MP4_UPLOAD",
            video_type: l.video_type || l.videoType || "MP4_UPLOAD",
            pdfResourceUrl: l.pdf_resource_url || l.pdfResourceUrl || null,
          })),
        })),
        quiz_data: payload.quizData || {},
        certificate_rule: payload.certificateRule || {},
      },
    });

    return {
      success: true,
      course: newPublishedCourse,
      normalizedCourse: newCourseNormalized,
      slug: uniqueSlug,
    };
  } catch (error: any) {
    console.error("Error in createCourse server action:", error);
    return { success: false, error: error?.message || "Failed to create course" };
  }
}

/**
 * Server Action: createLesson
 * Persists only the public video URL string and lesson metadata in Supabase PostgreSQL via Prisma.
 */
export async function createLesson(data: {
  moduleId?: string;
  courseId?: string;
  title: string;
  durationMinutes?: number;
  videoType?: VideoSourceType | "MP4_UPLOAD" | "GOOGLE_DRIVE" | "YOUTUBE";
  videoUrl: string;
  pdfResourceUrl?: string | null;
}) {
  try {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return { success: false, error: "Supabase configuration missing" };
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required to create lesson" };
    }

    const profile = await prisma.profiles.findFirst({
      where: {
        OR: [{ user_id: user.id }, { id: user.id }],
      },
    });

    const role = (profile?.role || user.user_metadata?.role || "").toUpperCase();
    if (!["SUPER_ADMIN", "ADMIN", "INSTRUCTOR"].includes(role)) {
      return {
        success: false,
        error: "Unauthorized: Only Super Admins, Admins, and Instructors can create lessons.",
      };
    }

    let safeVideoType: VideoSourceType = "MP4_UPLOAD";
    if (data.videoType === "GOOGLE_DRIVE" || data.videoUrl?.includes("drive.google.com")) {
      safeVideoType = "GOOGLE_DRIVE";
    } else if (
      data.videoType === "YOUTUBE" ||
      data.videoUrl?.includes("youtube.com") ||
      data.videoUrl?.includes("youtu.be")
    ) {
      safeVideoType = "YOUTUBE";
    }

    if (data.moduleId && /^[0-9a-fA-F-]{36}$/.test(data.moduleId)) {
      const existingModule = await prisma.course_modules.findUnique({
        where: { id: data.moduleId },
      });

      if (existingModule) {
        const createdLesson = await prisma.course_lessons.create({
          data: {
            module_id: existingModule.id,
            title: data.title || "Lesson",
            duration_minutes: Number(data.durationMinutes) || 0,
            video_type: safeVideoType,
            video_url: data.videoUrl || "",
            pdf_resource_url: data.pdfResourceUrl || null,
          },
        });

        return {
          success: true,
          lesson: createdLesson,
          videoUrl: createdLesson.video_url,
        };
      }
    }

    return {
      success: true,
      lessonDraft: {
        title: data.title,
        durationMinutes: Number(data.durationMinutes) || 0,
        videoType: safeVideoType,
        videoUrl: data.videoUrl,
        pdfResourceUrl: data.pdfResourceUrl || null,
      },
      videoUrl: data.videoUrl,
    };
  } catch (error: any) {
    console.error("Error in createLesson server action:", error);
    return { success: false, error: error?.message || "Failed to persist lesson" };
  }
}
