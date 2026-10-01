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
    console.warn("Auth check in live register:", err);
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
        { error: "sessionId and user authentication required" },
        { status: 400 }
      );
    }

    // Verify session exists
    const liveSession = await prisma.live_classes.findUnique({
      where: { id: sessionId },
    });

    if (!liveSession) {
      return NextResponse.json(
        { error: "Live session not found" },
        { status: 404 }
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

    // BRD Section 46: Enrolled learners can click "Register for Live Class". Store registration in Supabase and queue a Web Push notification reminder.
    const registration = await prisma.live_class_registrations.upsert({
      where: {
        session_id_user_id: {
          session_id: sessionId,
          user_id: userId,
        },
      },
      update: {
        attendance_status: "REGISTERED",
      },
      create: {
        session_id: sessionId,
        user_id: userId,
        attendance_status: "REGISTERED",
        reminder_sent: false,
      },
    });

    // Queue / Send Web Push Notification Reminder
    try {
      const scheduledFormatted = new Date(liveSession.scheduled_at).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });

      // Internal call to notification send API if subscriptions exist
      const origin = new URL(request.url).origin;
      await fetch(`${origin}/api/notifications/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Registered: ${liveSession.title}`,
          body: `Reminder queued for ${scheduledFormatted}. Get your automation setup ready!`,
          url: `/live?sessionId=${sessionId}`,
          tag: `live-reminder-${sessionId}`,
        }),
      }).catch((notifErr) => {
        console.warn("Non-critical Web Push reminder dispatch warning:", notifErr);
      });

      await prisma.user_activities.create({
        data: {
          user_id: userId,
          action_type: "LIVE_CLASS_REGISTERED",
          metadata: {
            sessionId,
            title: liveSession.title,
            scheduledAt: liveSession.scheduled_at,
          },
        },
      });
    } catch (actErr) {
      console.warn("Activity/Push logging warning:", actErr);
    }

    return NextResponse.json({
      success: true,
      message: "Successfully registered for live class. Reminder notification queued.",
      registration,
    });
  } catch (error: any) {
    console.error("Live class registration error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to register for live class" },
      { status: 500 }
    );
  }
}
