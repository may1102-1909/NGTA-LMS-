import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    let userId = searchParams.get("userId");

    // Fetch Live User Session: Get logged-in user's id from Supabase Auth using @supabase/ssr if not passed
    if (!userId) {
      try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            cookies: {
              getAll() {
                return cookieStore.getAll();
              },
              setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
                try {
                  cookiesToSet.forEach(({ name, value, options }) =>
                    cookieStore.set(name, value, options)
                  );
                } catch {
                  // Route handler
                }
              },
            },
          }
        );
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user?.id) {
          userId = user.id;
        }
      } catch (authErr) {
        console.warn("Could not read auth cookies in payments/verify GET:", authErr);
      }
    }

    if (!userId) {
      return NextResponse.json({
        isEnrolled: false,
        enrolledCourseIds: [],
        payment: null,
      });
    }

    if (courseId) {
      // Query Database for Enrollment: Check if a record exists in the payments table using Prisma
      const payment = await prisma.payments.findFirst({
        where: {
          user_id: userId,
          course_id: courseId,
          status: "SUCCESS",
        },
        orderBy: {
          created_at: "desc",
        },
      });

      const isEnrolled = !!payment;

      return NextResponse.json({
        isEnrolled,
        payment,
      });
    }

    // Return all enrolled course IDs for this user
    const userPayments = await prisma.payments.findMany({
      where: {
        user_id: userId,
        status: "SUCCESS",
      },
      select: {
        course_id: true,
      },
    });

    const enrolledCourseIds = Array.from(
      new Set(userPayments.map((p: { course_id: string }) => p.course_id))
    );

    return NextResponse.json({
      isEnrolled: enrolledCourseIds.length > 0,
      enrolledCourseIds,
    });
  } catch (error: any) {
    console.error("Error checking payment status:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to check payment status", isEnrolled: false },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      courseId = "course-1",
      amount = 1999,
      transactionId,
      userId,
      userEmail,
      userName,
    } = body;

    let targetUserId = userId;
    if (!targetUserId) {
      try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            cookies: {
              getAll() {
                return cookieStore.getAll();
              },
              setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
                try {
                  cookiesToSet.forEach(({ name, value, options }) =>
                    cookieStore.set(name, value, options)
                  );
                } catch {
                  // Route handler
                }
              },
            },
          }
        );
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user?.id) {
          targetUserId = user.id;
        }
      } catch (authErr) {
        console.warn("Could not read auth cookies in payments/verify POST:", authErr);
      }
    }

    if (!targetUserId) {
      return NextResponse.json(
        { error: "Valid user_id is required to verify payment" },
        { status: 401 }
      );
    }

    // Ensure profile row exists to satisfy foreign key constraint
    let profile = await prisma.profiles.findUnique({
      where: { id: targetUserId },
    });

    if (!profile) {
      const authUser = await prisma.users.findUnique({
        where: { id: targetUserId },
      });

      profile = await prisma.profiles.create({
        data: {
          id: targetUserId,
          email: authUser?.email || userEmail || `${targetUserId}@ngta.in`,
          full_name: userName || authUser?.email?.split("@")[0] || "Learner",
        },
      });
    }

    const txnId =
      transactionId ||
      `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // 1. Insert a row into public.payments with user_id, course_id: 'course-1', amount: 1999, and status: 'SUCCESS'
    const payment = await prisma.payments.create({
      data: {
        user_id: targetUserId,
        course_id: courseId || "course-1",
        amount: Number(amount) || 1999,
        currency: "INR",
        status: "SUCCESS",
        transaction_id: txnId,
      },
    });

    // 2. Also add a record to user_activities with action_type: 'PAYMENT_SUCCESSFUL'
    await prisma.user_activities.create({
      data: {
        user_id: targetUserId,
        action_type: "PAYMENT_SUCCESSFUL",
        metadata: {
          courseId: courseId || "course-1",
          amount: Number(amount) || 1999,
          paymentId: payment.id,
          transactionId: payment.transaction_id,
        },
      },
    });

    // Refetch or revalidate path so UI switches to 'Enrolled' instantly
    revalidatePath("/lms");
    revalidatePath("/courses");
    if (courseId) {
      revalidatePath(`/courses/${courseId}`);
    }

    return NextResponse.json({
      success: true,
      payment,
      isEnrolled: true,
    });
  } catch (error: any) {
    console.error("Payment verification endpoint error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error verifying payment" },
      { status: 500 }
    );
  }
}
