import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { INITIAL_COURSES } from "@/lib/mockData";

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
              setAll() {},
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
        enrollments: [],
        payment: null,
      });
    }

    // Resolve all user candidate IDs
    const profileRecord = await prisma.profiles.findFirst({
      where: {
        OR: [{ id: userId }, { user_id: userId }],
      },
    }).catch(() => null);

    const userCandidateIds = Array.from(
      new Set([userId, profileRecord?.id, profileRecord?.user_id].filter(Boolean) as string[])
    );

    if (courseId) {
      // Find candidate course IDs (UUID, slug, title)
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(courseId);
      const decodedCourseId = decodeURIComponent(courseId);
      const titleSearch = decodedCourseId.replace(/-/g, " ");

      const candidateCourseIds = new Set<string>([courseId, decodedCourseId]);

      const pub = await prisma.published_courses.findFirst({
        where: isUuid
          ? { OR: [{ id: courseId }, { slug: courseId }] }
          : {
              OR: [
                { id: courseId },
                { slug: courseId },
                { slug: { startsWith: courseId } },
                { title: { equals: courseId, mode: "insensitive" } },
                { title: { equals: decodedCourseId, mode: "insensitive" } },
                { title: { equals: titleSearch, mode: "insensitive" } },
                { title: { contains: titleSearch, mode: "insensitive" } },
              ],
            },
      }).catch(() => null);

      if (pub?.id) candidateCourseIds.add(pub.id);
      if (pub?.slug) candidateCourseIds.add(pub.slug);

      const norm = await prisma.courses.findFirst({
        where: isUuid
          ? { id: courseId }
          : {
              OR: [
                { id: courseId },
                { title: { equals: courseId, mode: "insensitive" } },
                { title: { equals: decodedCourseId, mode: "insensitive" } },
                { title: { equals: titleSearch, mode: "insensitive" } },
                { title: { contains: titleSearch, mode: "insensitive" } },
              ],
            },
      }).catch(() => null);

      if (norm?.id) candidateCourseIds.add(norm.id);

      const mock = INITIAL_COURSES.find(
        (c) =>
          c.id === courseId ||
          c.slug === courseId ||
          c.title?.toLowerCase() === courseId.toLowerCase() ||
          c.title?.toLowerCase().includes(titleSearch.toLowerCase())
      );
      if (mock?.id) candidateCourseIds.add(mock.id);
      if (mock?.slug) candidateCourseIds.add(mock.slug);

      const searchCourseIds = Array.from(candidateCourseIds);

      // Query Database for Enrollment
      let enrollment = await prisma.enrollments.findFirst({
        where: {
          user_id: { in: userCandidateIds },
          course_id: { in: searchCourseIds },
          status: "ACTIVE",
        },
      });

      let payment = null;
      if (!enrollment) {
        payment = await prisma.payments.findFirst({
          where: {
            user_id: { in: userCandidateIds },
            course_id: { in: searchCourseIds },
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
          user_id: { in: userCandidateIds },
          status: "ACTIVE",
        },
      }),
      prisma.payments.findMany({
        where: {
          user_id: { in: userCandidateIds },
          status: "SUCCESS",
        },
        select: {
          course_id: true,
        },
      }),
    ]);

    const rawEnrolledIds = Array.from(
      new Set([
        ...userEnrollments.map((e: any) => e.course_id),
        ...userPayments.map((p: any) => p.course_id),
      ])
    );

    const [allPublished, allCourses] = await Promise.all([
      prisma.published_courses.findMany({
        select: { id: true, slug: true, title: true },
      }).catch(() => []),
      prisma.courses.findMany({
        select: { id: true, title: true },
      }).catch(() => []),
    ]);

    const enrolledIdsSet = new Set<string>(rawEnrolledIds);

    for (const rawId of rawEnrolledIds) {
      for (const pub of allPublished) {
        if (
          pub.id === rawId ||
          pub.slug === rawId ||
          (pub.title && pub.title.toLowerCase() === rawId.toLowerCase())
        ) {
          if (pub.id) enrolledIdsSet.add(pub.id);
          if (pub.slug) enrolledIdsSet.add(pub.slug);
        }
      }
      for (const c of allCourses) {
        if (c.id === rawId || (c.title && c.title.toLowerCase() === rawId.toLowerCase())) {
          if (c.id) enrolledIdsSet.add(c.id);
          const matchedPub = allPublished.find(
            (p: any) => p.id === c.id || (p.title && p.title.toLowerCase() === c.title.toLowerCase())
          );
          if (matchedPub?.slug) enrolledIdsSet.add(matchedPub.slug);
        }
      }
      for (const ic of INITIAL_COURSES) {
        if (
          ic.id === rawId ||
          ic.slug === rawId ||
          (ic.title && ic.title.toLowerCase() === rawId.toLowerCase())
        ) {
          if (ic.id) enrolledIdsSet.add(ic.id);
          if (ic.slug) enrolledIdsSet.add(ic.slug);
        }
      }
    }

    const enrolledCourseIds = Array.from(enrolledIdsSet);

    const detailedEnrollments: any[] = [];
    userEnrollments.forEach((e: any) => {
      const completed = e.completed_modules ?? 0;
      const total = e.total_modules ?? 10;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
      detailedEnrollments.push({
        course_id: e.course_id,
        completed_modules: completed,
        total_modules: total,
        progress_percent: progress,
      });

      const matchedPub = allPublished.find((p: any) => p.id === e.course_id || p.slug === e.course_id);
      if (matchedPub?.slug && matchedPub.slug !== e.course_id) {
        detailedEnrollments.push({
          course_id: matchedPub.slug,
          completed_modules: completed,
          total_modules: total,
          progress_percent: progress,
        });
      }
      const matchedMock = INITIAL_COURSES.find((c: any) => c.id === e.course_id || c.slug === e.course_id);
      if (matchedMock?.slug && matchedMock.slug !== e.course_id) {
        detailedEnrollments.push({
          course_id: matchedMock.slug,
          completed_modules: completed,
          total_modules: total,
          progress_percent: progress,
        });
      }
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
