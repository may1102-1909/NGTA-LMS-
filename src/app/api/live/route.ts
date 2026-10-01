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
    console.warn("Auth check error in live API:", err);
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const instructorId = searchParams.get("instructorId");
    const userId = searchParams.get("userId");

    const whereClause: any = {};
    if (status) {
      whereClause.status = status;
    }
    if (instructorId) {
      whereClause.instructor_id = instructorId;
    }

    const sessions = await prisma.live_classes.findMany({
      where: whereClause,
      orderBy: { scheduled_at: "asc" },
      include: {
        instructor: {
          select: {
            full_name: true,
            email: true,
            avatar_url: true,
          },
        },
        registrations: {
          select: {
            id: true,
            user_id: true,
            attendance_status: true,
          },
        },
      },
    });

    const formattedSessions = sessions.map((s: any) => {
      const isUserRegistered = userId
        ? s.registrations.some((r: any) => r.user_id === userId)
        : false;

      const userAttendance = userId
        ? s.registrations.find((r: any) => r.user_id === userId)?.attendance_status || null
        : null;

      return {
        id: s.id,
        title: s.title,
        description: s.description,
        courseId: s.course_id,
        instructorId: s.instructor_id,
        instructorName: s.instructor?.full_name || "Lead Instructor",
        instructorEmail: s.instructor?.email,
        scheduledAt: s.scheduled_at,
        streamUrl: s.stream_url,
        recordingUrl: s.recording_url,
        status: s.status,
        registrationCount: s.registrations.length,
        attendedCount: s.registrations.filter((r: any) => r.attendance_status === "ATTENDED").length,
        isUserRegistered,
        userAttendance,
        createdAt: s.created_at,
      };
    });

    return NextResponse.json({
      success: true,
      sessions: formattedSessions,
      count: formattedSessions.length,
    });
  } catch (error: any) {
    console.error("Error fetching live sessions:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch live sessions" },
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
      description,
      scheduledAt,
      streamUrl,
      courseId = "course-1",
    } = body;

    let instructorId = body.instructorId || user?.id;

    if (!instructorId) {
      const fallbackInstructor = await prisma.profiles.findFirst({
        where: { role: { in: ["INSTRUCTOR", "ADMIN", "SUPER_ADMIN"] } },
      });
      if (fallbackInstructor) {
        instructorId = fallbackInstructor.id;
      }
    }

    if (!title || !scheduledAt || !streamUrl) {
      return NextResponse.json(
        { error: "Title, scheduledAt, and streamUrl are required" },
        { status: 400 }
      );
    }

    // Ensure instructor profile exists
    if (instructorId) {
      try {
        const prof = await prisma.profiles.findUnique({
          where: { id: instructorId },
        });
        if (!prof) {
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
        console.warn("Instructor ensure warning in live API:", profErr);
      }
    } else {
      return NextResponse.json(
        { error: "Instructor authorization required to schedule live classes" },
        { status: 401 }
      );
    }

    // BRD Section 46: Instructor sets title, date/time, and stream URL in /dashboard/instructor/live
    const newSession = await prisma.live_classes.create({
      data: {
        title,
        description: description || "",
        course_id: courseId,
        instructor_id: instructorId,
        scheduled_at: new Date(scheduledAt),
        stream_url: streamUrl,
        status: "SCHEDULED",
      },
    });

    try {
      await prisma.user_activities.create({
        data: {
          user_id: instructorId,
          action_type: "LIVE_SESSION_SCHEDULED",
          metadata: {
            sessionId: newSession.id,
            title: newSession.title,
            scheduledAt: newSession.scheduled_at,
          },
        },
      });
    } catch {}

    return NextResponse.json({
      success: true,
      message: "Live class scheduled successfully.",
      session: newSession,
    });
  } catch (error: any) {
    console.error("Error creating live session:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to schedule live class" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, recordingUrl, status } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      );
    }

    const updateData: any = {
      updated_at: new Date(),
    };

    if (recordingUrl !== undefined) {
      updateData.recording_url = recordingUrl;
      // Post-session, instructor uploads/attaches recording URL -> mark COMPLETED
      if (!status) {
        updateData.status = "COMPLETED";
      }
    }

    if (status) {
      updateData.status = status;
    }

    const updated = await prisma.live_classes.update({
      where: { id: sessionId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Live session updated successfully.",
      session: updated,
    });
  } catch (error: any) {
    console.error("Error updating live session:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update live class" },
      { status: 500 }
    );
  }
}
