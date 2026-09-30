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
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseAnonKey) {
          const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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
          });
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user?.id) {
            userId = user.id;
          }
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
      // Query Database for Enrollment: Check actual entries in the enrollments table (and fallback payments)
      let enrollment = await prisma.enrollments.findUnique({
        where: {
          user_id_course_id: {
            user_id: userId,
            course_id: courseId,
          },
        },
      });

      let payment = null;
      if (!enrollment) {
        payment = await prisma.payments.findFirst({
          where: {
            user_id: userId,
            course_id: courseId,
            status: "SUCCESS",
          },
          orderBy: { created_at: "desc" },
        });

        if (payment) {
          enrollment = await prisma.enrollments.upsert({
            where: {
              user_id_course_id: {
                user_id: userId,
                course_id: courseId,
              },
            },
            update: { status: "ACTIVE" },
            create: {
              user_id: userId,
              course_id: courseId,
              completed_modules: 0,
              total_modules: 10,
              status: "ACTIVE",
            },
          });
        }
      }

      const isEnrolled = !!enrollment;
      const progressPercent =
        enrollment && enrollment.total_modules > 0
          ? Math.round((enrollment.completed_modules / enrollment.total_modules) * 100)
          : 0;

      return NextResponse.json({
        isEnrolled,
        enrollment: enrollment
          ? {
              ...enrollment,
              progress_percent: progressPercent,
            }
          : null,
        payment,
      });
    }

    // Return all enrolled course IDs and enrollment records for this user
    const [userEnrollments, userPayments] = await Promise.all([
      prisma.enrollments.findMany({
        where: {
          user_id: userId,
          status: "ACTIVE",
        },
      }),
      prisma.payments.findMany({
        where: {
          user_id: userId,
          status: "SUCCESS",
        },
        select: {
          course_id: true,
        },
      }),
    ]);

    // Ensure any paid course is in enrollments
    const enrolledIdsSet = new Set<string>([
      ...userEnrollments.map((e: any) => e.course_id),
      ...userPayments.map((p: any) => p.course_id),
    ]);

    const enrolledCourseIds = Array.from(enrolledIdsSet);

    const detailedEnrollments = enrolledCourseIds.map((cid) => {
      const match = userEnrollments.find((e: any) => e.course_id === cid);
      const completed = match?.completed_modules ?? 0;
      const total = match?.total_modules ?? 10;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
      return {
        course_id: cid,
        completed_modules: completed,
        total_modules: total,
        progress_percent: progress,
      };
    });

    return NextResponse.json({
      isEnrolled: enrolledCourseIds.length > 0,
      enrolledCourseIds,
      enrollments: detailedEnrollments,
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
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      userId,
      userEmail,
      userName,
    } = body;

    // Optional cryptographic verification for Razorpay payments
    if (
      razorpay_payment_id &&
      razorpay_order_id &&
      razorpay_signature &&
      process.env.RAZORPAY_KEY_SECRET
    ) {
      try {
        const crypto = await import("crypto");
        const expectedSignature = crypto
          .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
          .update(`${razorpay_order_id}|${razorpay_payment_id}`)
          .digest("hex");

        if (expectedSignature !== razorpay_signature) {
          console.error("[Razorpay Security] Signature mismatch detected!");
          return NextResponse.json(
            { error: "Payment verification failed: Invalid transaction signature." },
            { status: 400 }
          );
        }
      } catch (cryptoErr) {
        console.warn("Could not verify Razorpay signature crypto:", cryptoErr);
      }
    }

    let targetUserId = userId;
    if (!targetUserId) {
      try {
        const cookieStore = await cookies();
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseAnonKey) {
          const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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
          });
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user?.id) {
            targetUserId = user.id;
          }
        }
      } catch (authErr) {
        console.warn("Could not read auth cookies in payments/verify POST:", authErr);
      }
    }

    if (!targetUserId) {
      return NextResponse.json(
        { error: "Valid user_id is required to complete payment. Please sign in." },
        { status: 401 }
      );
    }

    // Ensure profile row exists to satisfy foreign key constraint: payments.user_id -> profiles.id
    try {
      const existingProfile = await prisma.profiles.findUnique({
        where: { id: targetUserId },
      });

      if (!existingProfile) {
        await prisma.profiles.create({
          data: {
            id: targetUserId,
            email: userEmail || `${targetUserId}@ngta.in`,
            full_name: userName || "Learner",
          },
        });
      }
    } catch (profileErr) {
      console.warn("Profile check/create warning:", profileErr);
    }

    const txnId =
      razorpay_payment_id ||
      transactionId ||
      `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // 1. Insert a row into public.payments with user_id, course_id, amount, and status: 'SUCCESS'
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

    // 2. Also record entry in public.enrollments table
    try {
      await prisma.enrollments.upsert({
        where: {
          user_id_course_id: {
            user_id: targetUserId,
            course_id: courseId || "course-1",
          },
        },
        update: { status: "ACTIVE" },
        create: {
          user_id: targetUserId,
          course_id: courseId || "course-1",
          completed_modules: 0,
          total_modules: 10,
          status: "ACTIVE",
        },
      });
    } catch (enrollErr) {
      console.warn("Enrollment upsert non-critical warning:", enrollErr);
    }

    // 2. Also add a record to user_activities with action_type: 'PAYMENT_SUCCESSFUL'
    try {
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
    } catch (actErr) {
      console.warn("Activity logging non-critical error:", actErr);
    }

    // Refetch or revalidate path so UI switches to 'Enrolled' instantly
    try {
      revalidatePath("/lms");
      revalidatePath("/courses");
      if (courseId) {
        revalidatePath(`/courses/${courseId}`);
      }
    } catch (revErr) {
      console.warn("Revalidation warning:", revErr);
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
