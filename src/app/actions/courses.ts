"use server";

import { prisma } from "@/lib/prisma";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createCourse as runCreateCourse, CourseCreatePayload } from "./courseActions";
type VideoSourceType = "MP4_UPLOAD" | "GOOGLE_DRIVE" | "YOUTUBE";

export async function createCourse(payload: CourseCreatePayload) {
  return runCreateCourse(payload);
}

/**
 * Server Action: createLesson
 * Persists only the public video URL string and lesson metadata in Supabase PostgreSQL via Prisma.
 * Bypasses Vercel serverless function body size limits by receiving strings only (no File/FormData).
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

    // Verify role
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

    // Validate videoUrl string
    if (!data.videoUrl || typeof data.videoUrl !== "string") {
      return { success: false, error: "Valid video URL string is required" };
    }

    // Determine VideoSourceType enum
    let safeVideoType: VideoSourceType = "MP4_UPLOAD";
    if (data.videoType === "GOOGLE_DRIVE" || data.videoUrl.includes("drive.google.com")) {
      safeVideoType = "GOOGLE_DRIVE";
    } else if (
      data.videoType === "YOUTUBE" ||
      data.videoUrl.includes("youtube.com") ||
      data.videoUrl.includes("youtu.be")
    ) {
      safeVideoType = "YOUTUBE";
    }

    // If moduleId is provided and matches a database course_modules record, persist directly
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
            video_url: data.videoUrl,
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

    // For draft lessons not yet associated with a committed database module ID,
    // return validated payload confirming persistence readiness
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
