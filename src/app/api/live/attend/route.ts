import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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
    console.warn("Auth check in live attend:", err);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId } = body;
    let userId = body.userId;

    if (!userId) {
      userId = await getAuthUserId();
    }

    if (!sessionId || !userId) {
      return NextResponse.json(
        { error: "sessionId and userId are required" },
        { status: 400 }
      );
    }

    // BRD Section 46: Learner joins session -> Record attendance status (ATTENDED) in Supabase.
    const registration = await prisma.live_class_registrations.upsert({
      where: {
        session_id_user_id: {
          session_id: sessionId,
          user_id: userId,
        },
      },
      update: {
        attendance_status: "ATTENDED",
        updated_at: new Date(),
      },
      create: {
        session_id: sessionId,
        user_id: userId,
        attendance_status: "ATTENDED",
      },
    });

    // Log attendance in user_activities
    try {
      await prisma.user_activities.create({
        data: {
          user_id: userId,
          action_type: "LIVE_CLASS_ATTENDED",
          metadata: {
            sessionId,
            attendanceStatus: "ATTENDED",
          },
        },
      });
    } catch {}

    return NextResponse.json({
      success: true,
      message: "Attendance recorded successfully as ATTENDED.",
      attendanceStatus: "ATTENDED",
      registration,
    });
  } catch (error: any) {
    console.error("Live attendance recording error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to record live class attendance" },
      { status: 500 }
    );
  }
}
