import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function getAuthUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) return null;

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

    return user?.id || null;
  } catch (err) {
    console.warn("Auth session check error in progress API:", err);
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    let userId = searchParams.get("userId");

    if (!userId) {
      userId = await getAuthUserId();
    }

    if (!userId || !courseId) {
      return NextResponse.json(
        { error: "userId and courseId are required" },
        { status: 400 }
      );
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(courseId);
    const pub = await prisma.published_courses.findFirst({
      where: isUuid
        ? { OR: [{ id: courseId }, { slug: courseId }] }
        : { OR: [{ id: courseId }, { slug: courseId }, { title: { equals: courseId, mode: "insensitive" } }] },
    }).catch(() => null);

    const candidateCourseIds = [courseId];
    if (pub?.id) candidateCourseIds.push(pub.id);
    if (pub?.slug) candidateCourseIds.push(pub.slug);

    const progressRecords = await prisma.course_progress.findMany({
      where: {
        user_id: userId,
        course_id: { in: Array.from(new Set(candidateCourseIds)) },
        completed: true,
      },
      select: {
        lesson_id: true,
      },
    });

    const completedLessonIds = progressRecords.map((r: { lesson_id: string }) => r.lesson_id);

    return NextResponse.json({
      success: true,
      courseId,
      completedLessonIds,
      completedCount: completedLessonIds.length,
    });
  } catch (error: any) {
    console.error("Error retrieving course progress:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to retrieve progress" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { courseId, lessonId, completed = true, totalLessons = 10 } = body;
    let userId = body.userId;

    if (!userId) {
      userId = await getAuthUserId();
    }

    if (!userId || !courseId || !lessonId) {
      return NextResponse.json(
        { error: "Missing required fields: userId, courseId, lessonId" },
        { status: 400 }
      );
    }

    // Ensure profile exists
    try {
      const prof = await prisma.profiles.findUnique({ where: { id: userId } });
      if (!prof) {
        await prisma.profiles.create({
          data: {
            id: userId,
            email: `${userId}@ngta.in`,
            full_name: "Learner",
          },
        });
      }
    } catch {}

    // Check if lesson was already completed before this action
    const existing = await prisma.course_progress.findUnique({
      where: {
        user_id_course_id_lesson_id: {
          user_id: userId,
          course_id: courseId,
          lesson_id: lessonId,
        },
      },
    });

    const isNewlyCompleted = !existing || !existing.completed;

    // 1. Upsert course_progress record in Supabase
    await prisma.course_progress.upsert({
      where: {
        user_id_course_id_lesson_id: {
          user_id: userId,
          course_id: courseId,
          lesson_id: lessonId,
        },
      },
      update: {
        completed: Boolean(completed),
      },
      create: {
        user_id: userId,
        course_id: courseId,
        lesson_id: lessonId,
        completed: Boolean(completed),
      },
    });

    // 2. Fetch all completed lessons for this course
    const allCompleted = await prisma.course_progress.findMany({
      where: {
        user_id: userId,
        course_id: courseId,
        completed: true,
      },
      select: { lesson_id: true },
    });

    const completedLessonIds = allCompleted.map((r: { lesson_id: string }) => r.lesson_id);
    const completedCount = completedLessonIds.length;

    // 3. Update enrollments table completed_modules
    try {
      await prisma.enrollments.upsert({
        where: {
          user_id_course_id: {
            user_id: userId,
            course_id: courseId,
          },
        },
        update: {
          completed_modules: completedCount,
          total_modules: Math.max(totalLessons, completedCount),
        },
        create: {
          user_id: userId,
          course_id: courseId,
          completed_modules: completedCount,
          total_modules: Math.max(totalLessons, completedCount),
          status: "ACTIVE",
        },
      });
    } catch (enrErr) {
      console.warn("Enrollment progress update warning:", enrErr);
    }

    // 4. Award XP points for new lesson completion
    let updatedXp = 0;
    if (isNewlyCompleted && completed) {
      try {
        const student = await prisma.student_profiles.findUnique({
          where: { user_id: userId },
        });

        if (student) {
          const updated = await prisma.student_profiles.update({
            where: { user_id: userId },
            data: {
              xp_points: { increment: 10 },
            },
          });
          updatedXp = updated.xp_points;
        }

        await prisma.user_activities.create({
          data: {
            user_id: userId,
            action_type: "LESSON_COMPLETED",
            metadata: { courseId, lessonId, pointsAwarded: 10 },
          },
        });
      } catch (xpErr) {
        console.warn("XP award error:", xpErr);
      }
    }

    const progressPercent =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    return NextResponse.json({
      success: true,
      completedLessonIds,
      completedCount,
      progressPercent,
      xpPoints: updatedXp,
    });
  } catch (error: any) {
    console.error("Error saving course progress:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update progress" },
      { status: 500 }
    );
  }
}
