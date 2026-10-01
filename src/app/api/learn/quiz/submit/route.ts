import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getAuthUser(): Promise<{ id: string; email: string; name: string } | null> {
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

    if (!user?.id) return null;

    return {
      id: user.id,
      email: user.email || "",
      name:
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "Learner",
    };
  } catch (err) {
    console.warn("Auth session check error in quiz submit:", err);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      courseId = "course-1",
      courseTitle = "Selenium Java + AI: Complete Automation Testing Course",
      score = 100,
      passingThreshold = 70,
    } = body;

    let user = await getAuthUser();
    let userId = body.userId || user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User authentication required to submit quiz evaluation" },
        { status: 401 }
      );
    }

    // Get user profile details for certificate recipient name
    const profile = await prisma.profiles.findUnique({
      where: { id: userId },
      include: { users: true },
    });

    const studentProfile = await prisma.student_profiles.findUnique({
      where: { user_id: userId },
    });

    const recipientName =
      profile?.full_name ||
      studentProfile?.username ||
      user?.name ||
      "Accredited SDET Learner";

    const isPassed = Number(score) >= Number(passingThreshold);

    if (!isPassed) {
      return NextResponse.json({
        passed: false,
        score,
        passingThreshold,
        message: `Evaluation score (${score}%) does not meet passing benchmark (${passingThreshold}%).`,
      });
    }

    // 1. Mark enrollment as COMPLETED in Supabase
    try {
      const enrollment = await prisma.enrollments.findUnique({
        where: {
          user_id_course_id: {
            user_id: userId,
            course_id: courseId,
          },
        },
      });

      const totalMod = enrollment?.total_modules || 10;

      await prisma.enrollments.upsert({
        where: {
          user_id_course_id: {
            user_id: userId,
            course_id: courseId,
          },
        },
        update: {
          status: "COMPLETED",
          completed_modules: totalMod,
        },
        create: {
          user_id: userId,
          course_id: courseId,
          completed_modules: totalMod,
          total_modules: totalMod,
          status: "COMPLETED",
        },
      });
    } catch (enrErr) {
      console.warn("Enrollment completion update warning:", enrErr);
    }

    // 2. Automatically generate uniquely verifiable certificate record
    // Format: NGTA-CERT-[courseId]-[timestamp]-[random]
    const cleanCourseTag = courseId.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const certCode = `NGTA-CERT-${cleanCourseTag}-${Date.now().toString(36).toUpperCase()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    // Check if certificate already issued for this user and course
    let certificate = await prisma.certificates.findFirst({
      where: {
        user_id: userId,
        course_id: courseId,
      },
    });

    const gradeLabel =
      score >= 90
        ? `PASS WITH DISTINCTION (${score}%)`
        : `PASS (${score}%)`;

    if (!certificate) {
      certificate = await prisma.certificates.create({
        data: {
          certificate_id: certCode,
          user_id: userId,
          course_id: courseId,
          recipient_name: recipientName,
          course_title: courseTitle,
          grade: gradeLabel,
          score: Math.round(Number(score)),
          issued_at: new Date(),
          verification_url: `/verify?certId=${certCode}`,
        },
      });
    } else {
      // Update score / grade if improved
      certificate = await prisma.certificates.update({
        where: { id: certificate.id },
        data: {
          grade: gradeLabel,
          score: Math.max(certificate.score, Math.round(Number(score))),
        },
      });
    }

    // 3. Award completion XP bonus & log user activity
    try {
      if (studentProfile) {
        await prisma.student_profiles.update({
          where: { user_id: userId },
          data: {
            xp_points: { increment: 100 },
          },
        });
      }

      await prisma.user_activities.create({
        data: {
          user_id: userId,
          action_type: "CERTIFICATE_EARNED",
          metadata: {
            certificateId: certificate.certificate_id,
            courseId,
            score,
            grade: gradeLabel,
          },
        },
      });
    } catch (actErr) {
      console.warn("Activity/XP log warning:", actErr);
    }

    return NextResponse.json({
      success: true,
      passed: true,
      score,
      grade: gradeLabel,
      certificateId: certificate.certificate_id,
      certificateUrl: `/certificates/${certificate.certificate_id}`,
      verificationUrl: `/verify?certId=${certificate.certificate_id}`,
      certificate,
    });
  } catch (error: any) {
    console.error("Error submitting quiz evaluation:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process quiz submission" },
      { status: 500 }
    );
  }
}
