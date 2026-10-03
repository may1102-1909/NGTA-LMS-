import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { processModulesStreamTree } from "@/lib/gdriveProcessor";

export const dynamic = "force-dynamic";

const AUTHORIZED_ROLES = ["SUPER_ADMIN", "ADMIN", "INSTRUCTOR"];

async function getAuthUserAndRole() {
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

    if (!user) return null;

    const profile = await prisma.profiles.findFirst({
      where: {
        OR: [{ user_id: user.id }, { id: user.id }],
      },
    });

    const role = (profile?.role || user.user_metadata?.role || "").toUpperCase();

    return { user, role, profile };
  } catch (err) {
    console.warn("Auth check error in courses API:", err);
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");
    const status = searchParams.get("status");
    const instructorId = searchParams.get("instructorId");
    const source = searchParams.get("source"); // "normalized" | "all" | default

    // Single course lookup by ID or Slug
    if (id || slug) {
      const identifier = id || slug || "";
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);

      let pc: any = null;
      let nc: any = null;

      if (isUuid) {
        pc = await prisma.published_courses.findFirst({
          where: { OR: [{ id: identifier }, { slug: identifier }] },
          include: { instructor: true },
        });
        nc = await prisma.courses.findFirst({
          where: { id: identifier },
          include: {
            modules: { orderBy: { order_index: "asc" }, include: { lessons: true } },
            instructor: true,
          },
        });
      } else {
        pc = await prisma.published_courses.findFirst({
          where: { slug: identifier },
          include: { instructor: true },
        });
        if (pc?.id) {
          nc = await prisma.courses.findFirst({
            where: { id: pc.id },
            include: {
              modules: { orderBy: { order_index: "asc" }, include: { lessons: true } },
              instructor: true,
            },
          });
        }
      }

      if (!pc && !nc) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        course: nc || pc,
        publishedCourse: pc,
        normalizedCourse: nc,
      });
    }

    if (source === "normalized") {
      const whereClause: any = {};
      if (status) whereClause.course_status = status;
      if (instructorId) whereClause.instructor_id = instructorId;

      const normalizedCourses = await prisma.courses.findMany({
        where: whereClause,
        orderBy: { created_at: "desc" },
        include: {
          instructor: {
            select: {
              full_name: true,
              email: true,
              avatar_url: true,
            },
          },
          modules: {
            orderBy: { order_index: "asc" },
            include: {
              lessons: true,
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        courses: normalizedCourses,
        count: normalizedCourses.length,
      });
    }

    const whereClause: any = {};
    if (status) {
      whereClause.status = status;
    }
    if (instructorId) {
      whereClause.instructor_id = instructorId;
    }

    const courses = await prisma.published_courses.findMany({
      where: whereClause,
      orderBy: { created_at: "desc" },
      include: {
        instructor: {
          select: {
            full_name: true,
            email: true,
            avatar_url: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      courses,
      count: courses.length,
    });
  } catch (error: any) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthUserAndRole();

    // Access control: strictly restricted to SUPER_ADMIN, ADMIN, and INSTRUCTOR
    if (!auth || !auth.user || !AUTHORIZED_ROLES.includes(auth.role)) {
      return NextResponse.json(
        {
          error:
            "Unauthorized: Course creation is strictly restricted to Instructors, Admins, and Super Admins.",
        },
        { status: 403 }
      );
    }

    const user = auth.user;
    const body = await request.json();

    const {
      title,
      subtitle,
      slug,
      description,
      price = 1999,
      discountPrice,
      category = "Automation Testing",
      level = "Intermediate",
      tags = [],
      thumbnailUrl,
      bannerUrl,
      courseObjectives = [],
      targetAudience = [],
      prerequisites = [],
      courseDuration,
      difficultyLevel = "BEGINNER",
      modules = [],
      quizData = {},
      certificateRule = {},
    } = body;

    let instructorId = body.instructorId || user.id;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Course title and description are required" },
        { status: 400 }
      );
    }

    // Ensure instructor profile exists
    let instructorName = auth.profile?.full_name || "Lead Instructor";
    if (instructorId) {
      try {
        const prof = await prisma.profiles.findFirst({
          where: {
            OR: [{ id: instructorId }, { user_id: instructorId }],
          },
        });
        if (prof?.full_name) {
          instructorName = prof.full_name;
          instructorId = prof.id; // use primary key uuid
        } else if (!prof) {
          const created = await prisma.profiles.create({
            data: {
              id: instructorId,
              email: user.email || `${instructorId}@ngta.in`,
              full_name: user.user_metadata?.full_name || "Instructor",
              role: "INSTRUCTOR",
            },
          });
          instructorId = created.id;
        }
      } catch (profErr) {
        console.warn("Instructor ensure warning:", profErr);
      }
    }

    // Step 4.2: Sequential Google Drive Link Stream Processing (Backend Queue)
    // Converts drive links into embeddable /preview links sequentially
    const sanitizedModules = await processModulesStreamTree(modules);

    // Map difficulty level to enum-safe format
    const safeDifficulty = ["BEGINNER", "INTERMEDIATE", "ADVANCED"].includes(
      String(difficultyLevel || level).toUpperCase()
    )
      ? String(difficultyLevel || level).toUpperCase()
      : "BEGINNER";

    // Generate unique slug
    const baseSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;

    // 1. Create in normalized `courses` table (with modules and lessons)
    const newCourseNormalized = await prisma.courses.create({
      data: {
        title,
        subtitle: subtitle || null,
        description,
        instructor_id: instructorId,
        category,
        tags: Array.isArray(tags) ? tags : [],
        thumbnail_url: thumbnailUrl || null,
        banner_url: bannerUrl || null,
        course_objectives: Array.isArray(courseObjectives) ? courseObjectives : [],
        target_audience: Array.isArray(targetAudience) ? targetAudience : [],
        prerequisites: Array.isArray(prerequisites) ? prerequisites : [],
        course_duration: courseDuration ? Number(courseDuration) : null,
        difficulty_level: safeDifficulty,
        pricing: Number(price || 0),
        discount_price: discountPrice ? Number(discountPrice) : null,
        course_status: "PENDING_APPROVAL",
        modules: {
          create: sanitizedModules.map((m: any, mIdx: number) => ({
            title: m.title || `Module ${mIdx + 1}`,
            order_index: mIdx + 1,
            lessons: {
              create: (m.lessons || []).map((l: any) => {
                let videoType = l.video_type || l.videoType;
                const videoUrl = (l.video_url || l.videoUrl || "").trim();

                if (!videoType) {
                  if (videoUrl.includes("drive.google.com")) {
                    videoType = "GOOGLE_DRIVE";
                  } else if (
                    videoUrl.includes("youtube.com") ||
                    videoUrl.includes("youtu.be")
                  ) {
                    videoType = "YOUTUBE";
                  } else {
                    videoType = "MP4_UPLOAD";
                  }
                }

                return {
                  title: l.title || "Lesson",
                  duration_minutes: Number(l.duration || l.duration_minutes || l.durationMinutes) || 0,
                  video_type: videoType,
                  video_url: videoUrl,
                  pdf_resource_url: l.pdf_resource_url || l.pdfResourceUrl || l.resourcePdfUrl || null,
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

    // 2. Also save into `published_courses` for backward compatibility with storefront & admin approvals
    const newPublishedCourse = await prisma.published_courses.create({
      data: {
        id: newCourseNormalized.id,
        slug: uniqueSlug,
        title,
        description,
        price: Number(price),
        category,
        level: safeDifficulty,
        instructor_id: instructorId,
        instructor_name: instructorName,
        status: "PENDING_APPROVAL",
        modules: sanitizedModules.map((m: any) => ({
          ...m,
          lessons: (m.lessons || []).map((l: any) => ({
            ...l,
            videoUrl: (l.video_url || l.videoUrl || "").trim(),
            video_url: (l.video_url || l.videoUrl || "").trim(),
            videoType: l.video_type || l.videoType || "MP4_UPLOAD",
            video_type: l.video_type || l.videoType || "MP4_UPLOAD",
            pdfResourceUrl: l.pdf_resource_url || l.pdfResourceUrl || null,
          })),
        })),
        quiz_data: quizData,
        certificate_rule: certificateRule,
      },
    });

    // Record activity
    try {
      await prisma.user_activities.create({
        data: {
          user_id: instructorId,
          action_type: "COURSE_SUBMITTED_FOR_APPROVAL",
          metadata: {
            courseId: newCourseNormalized.id,
            title: newCourseNormalized.title,
            slug: uniqueSlug,
            modulesCount: sanitizedModules.length,
          },
        },
      });
    } catch {}

    return NextResponse.json({
      success: true,
      message: "Course successfully submitted for administrator approval.",
      course: newPublishedCourse,
      normalizedCourse: newCourseNormalized,
      status: "PENDING_APPROVAL",
    });
  } catch (error: any) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create course" },
      { status: 500 }
    );
  }
}
