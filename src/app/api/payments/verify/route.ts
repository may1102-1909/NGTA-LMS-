import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    let userId = searchParams.get("userId");

    // If userId not provided, fallback to the latest profile in DB (e.g. current logged in user)
    if (!userId) {
      const latestProfile = await prisma.profiles.findFirst({
        orderBy: { created_at: "desc" },
      });
      if (latestProfile) {
        userId = latestProfile.id;
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

      return NextResponse.json({
        isEnrolled: !!payment,
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

    const enrolledCourseIds = Array.from(new Set(userPayments.map((p: { course_id: string }) => p.course_id)));

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
    const { courseId, amount, transactionId, userId, userEmail, userName } = body;

    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 });
    }

    // Resolve target userId
    let targetUserId = userId;
    if (!targetUserId) {
      const latestProfile = await prisma.profiles.findFirst({
        orderBy: { created_at: "desc" },
      });
      if (latestProfile) {
        targetUserId = latestProfile.id;
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

      if (authUser) {
        profile = await prisma.profiles.create({
          data: {
            id: targetUserId,
            email: authUser.email || userEmail || `${targetUserId}@ngta.in`,
            full_name: userName || authUser.email?.split("@")[0] || "Learner",
          },
        });
      }
    }

    const txnId =
      transactionId ||
      `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // 1. Create a row in the payments table using Prisma
    const payment = await prisma.payments.create({
      data: {
        user_id: targetUserId,
        course_id: courseId,
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
          courseId,
          amount: Number(amount) || 1999,
          paymentId: payment.id,
          transactionId: payment.transaction_id,
        },
      },
    });

    return NextResponse.json({
      success: true,
      payment,
    });
  } catch (error: any) {
    console.error("Payment verification endpoint error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error verifying payment" },
      { status: 500 }
    );
  }
}
