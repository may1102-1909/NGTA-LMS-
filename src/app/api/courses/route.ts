import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function getAuthUser() {
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

    return user;
  } catch (err) {
    console.warn("Auth check error in courses API:", err);
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const instructorId = searchParams.get("instructorId");

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
    const user = await getAuthUser();
    const body = await request.json();

    const {
      title,
      slug,
      description,
      price = 1999,
      category = "Automation Testing",
      level = "Intermediate",
      modules = [],
      quizData = {},
      certificateRule = {},
    } = body;

    let instructorId = body.instructorId || user?.id;

    if (!instructorId) {
      // Fallback: lookup an existing INSTRUCTOR or ADMIN profile if available
      const existingInstructor = await prisma.profiles.findFirst({
        where: { role: { in: ["INSTRUCTOR", "ADMIN", "SUPER_ADMIN"] } },
      });
      if (existingInstructor) {
        instructorId = existingInstructor.id;
      }
    }

    if (!title || !description) {
      return NextResponse.json(
        { error: "Course title and description are required" },
        { status: 400 }
      );
    }

    // Ensure instructor profile exists
    let instructorName = "Lead Instructor";
    if (instructorId) {
      try {
        const prof = await prisma.profiles.findUnique({
          where: { id: instructorId },
        });
        if (prof?.full_name) {
          instructorName = prof.full_name;
        } else if (!prof) {
          await prisma.profiles.create({
            data: {
              id: instructorId,
              email: user?.email || `${instructorId}@ngta.in`,
              full_name: user?.user_metadata?.full_name || "Instructor",
              role: "INSTRUCTOR",
            },
          });
        }
      } catch (profErr) {
        console.warn("Instructor ensure warning:", profErr);
      }
    } else {
      return NextResponse.json(
        { error: "Valid instructor profile is required to publish courses" },
        { status: 401 }
      );
    }

    // Generate unique slug if not provided or collision
    const baseSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;

    // BRD Section 45: Submit Course for Approval -> Status PENDING_APPROVAL. Course does NOT show in storefront yet.
    const newCourse = await prisma.published_courses.create({
      data: {
        slug: uniqueSlug,
        title,
        description,
        price: Number(price),
        category,
        level,
        instructor_id: instructorId,
        instructor_name: instructorName,
        status: "PENDING_APPROVAL",
        modules: modules,
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
            courseId: newCourse.id,
            title: newCourse.title,
            slug: newCourse.slug,
          },
        },
      });
    } catch {}

    return NextResponse.json({
      success: true,
      message: "Course successfully submitted for administrator approval.",
      course: newCourse,
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
