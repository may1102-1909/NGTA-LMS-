import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { UserRole } from "@/types/roles";
import { INITIAL_COURSES } from "@/lib/mockData";

export const dynamic = "force-dynamic";

async function getAuthUser() {
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
            } catch {}
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      return user;
    }
  } catch (err) {
    console.warn("Could not retrieve auth session in dashboard stats:", err);
  }
  return null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get("userId");

    const authUser = await getAuthUser();
    const targetUserId = requestedUserId || authUser?.id;

    // Fetch user profile and role from Supabase PostgreSQL
    let currentUserProfile = null;
    if (targetUserId) {
      currentUserProfile = await prisma.profiles.findFirst({
        where: {
          OR: [{ user_id: targetUserId }, { id: targetUserId }],
        },
      });
    }

    // If no profile, fallback to latest profile for initial preview
    if (!currentUserProfile) {
      currentUserProfile = await prisma.profiles.findFirst({
        orderBy: { created_at: "desc" },
      });
    }

    const currentRole = (currentUserProfile?.role as UserRole) || "LEARNER";

    const effectiveUserId = targetUserId || currentUserProfile?.user_id || currentUserProfile?.id;
    const userIds = [effectiveUserId, targetUserId, currentUserProfile?.user_id, currentUserProfile?.id, authUser?.id].filter(Boolean) as string[];
    const uniqueUserIds = Array.from(new Set(userIds));

    // 1. Fetch real student gamification profile for target user
    const studentProfile = uniqueUserIds.length > 0
      ? await prisma.student_profiles.findFirst({
          where: { user_id: { in: uniqueUserIds } },
        })
      : null;

    // 2. Fetch real enrollments for target user
    const userEnrollments = uniqueUserIds.length > 0
      ? await prisma.enrollments.findMany({
          where: { user_id: { in: uniqueUserIds }, status: "ACTIVE" },
          orderBy: { created_at: "desc" },
        })
      : [];

    // 3. Fetch real payments for target user
    const userPayments = uniqueUserIds.length > 0
      ? await prisma.payments.findMany({
          where: { user_id: { in: uniqueUserIds } },
          orderBy: { created_at: "desc" },
        })
      : [];

    // 4. Platform-wide real metrics for Creator / Staff / Admin dashboards
    const [
      totalUsers,
      totalEnrollments,
      totalPayments,
      allProfiles,
      allEnrollments,
      allPayments,
      recentActivities,
      totalPosts,
    ] = await Promise.all([
      prisma.profiles.count(),
      prisma.enrollments.count(),
      prisma.payments.count(),
      prisma.profiles.findMany({
        orderBy: { created_at: "desc" },
        take: 50,
      }),
      prisma.enrollments.findMany({
        include: {
          profile: true,
        },
        orderBy: { created_at: "desc" },
        take: 30,
      }),
      prisma.payments.findMany({
        include: {
          profiles: true,
        },
        orderBy: { created_at: "desc" },
        take: 30,
      }),
      prisma.user_activities.findMany({
        orderBy: { created_at: "desc" },
        take: 20,
      }),
      prisma.community_posts.count(),
    ]);

    // Calculate real revenue sum from payments
    const totalRevenue = allPayments.reduce(
      (sum: number, p: any) => sum + Number(p.amount || 0),
      0
    );

    // Group users by role
    const roleCounts: Record<string, number> = {
      SUPER_ADMIN: 0,
      ADMIN: 0,
      INSTRUCTOR: 0,
      LEARNER: 0,
      GUEST: 0,
    };

    allProfiles.forEach((p: any) => {
      const r = p.role || "LEARNER";
      roleCounts[r] = (roleCounts[r] || 0) + 1;
    });

    const [allPublishedCourses, allBaseCourses] = await Promise.all([
      prisma.published_courses.findMany({
        select: { id: true, slug: true, title: true },
      }).catch(() => []),
      prisma.courses.findMany({
        select: { id: true, title: true },
      }).catch(() => []),
    ]);

    const enrichedEnrollments = userEnrollments.map((enr: any) => {
      let title = enr.course_id;
      let slug = enr.course_id;

      const pub = allPublishedCourses.find(
        (p: any) => p.id === enr.course_id || p.slug === enr.course_id
      );
      if (pub) {
        title = pub.title;
        slug = pub.slug || pub.id;
      } else {
        const norm = allBaseCourses.find((c: any) => c.id === enr.course_id);
        if (norm) {
          title = norm.title;
        } else {
          const mock = INITIAL_COURSES.find(
            (c: any) => c.id === enr.course_id || c.slug === enr.course_id
          );
          if (mock) {
            title = mock.title;
            slug = mock.slug;
          }
        }
      }

      return {
        ...enr,
        course_title: title,
        course_slug: slug,
      };
    });

    return NextResponse.json({
      success: true,
      currentUser: {
        id: effectiveUserId,
        email: currentUserProfile?.email || authUser?.email,
        full_name: currentUserProfile?.full_name || studentProfile?.username || "Learner",
        avatar_url: studentProfile?.avatar_url || currentUserProfile?.avatar_url || "/avatars/avatar-15.png",
        role: currentRole,
        xp_points: studentProfile?.xp_points ?? 0,
        current_streak: studentProfile?.current_streak ?? 0,
        username: studentProfile?.username || currentUserProfile?.full_name || "Learner",
      },
      learner: {
        enrollments: enrichedEnrollments,
        payments: userPayments,
        completedModules: userEnrollments.reduce((sum: number, e: any) => sum + e.completed_modules, 0),
        totalModules: userEnrollments.reduce((sum: number, e: any) => sum + e.total_modules, 0),
      },
      creator: {
        totalStudents: totalEnrollments,
        totalRevenue,
        activeBatches: totalEnrollments > 0 ? 1 : 0,
        recentEnrollments: allEnrollments,
        recentPayments: allPayments,
      },
      ops: {
        totalUsers,
        totalEnrollments,
        totalPayments,
        totalRevenue,
        totalPosts,
        roleCounts,
        recentActivities,
        allProfiles,
      },
    });
  } catch (error: any) {
    console.error("Error retrieving dashboard statistics:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to load dashboard metrics" },
      { status: 500 }
    );
  }
}

// Super Admin / Admin role management endpoint
export async function PATCH(request: Request) {
  try {
    const authUser = await getAuthUser();
    if (!authUser?.id) {
      return NextResponse.json(
        { error: "Authentication required to update roles." },
        { status: 401 }
      );
    }

    // Verify requester has permission
    const requester = await prisma.profiles.findFirst({
      where: {
        OR: [{ user_id: authUser.id }, { id: authUser.id }],
      },
    });

    if (requester?.role !== "SUPER_ADMIN" && requester?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized: Only Super Admins and Admins can assign user roles." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { targetProfileId, newRole } = body;

    const validRoles: UserRole[] = [
      "SUPER_ADMIN",
      "ADMIN",
      "INSTRUCTOR",
      "LEARNER",
      "GUEST",
    ];

    if (!targetProfileId || !validRoles.includes(newRole)) {
      return NextResponse.json(
        { error: "Invalid targetProfileId or role specification." },
        { status: 400 }
      );
    }

    const updatedProfile = await prisma.profiles.update({
      where: { id: targetProfileId },
      data: { role: newRole as UserRole },
    });

    // Log user activity
    try {
      await prisma.user_activities.create({
        data: {
          user_id: authUser.id,
          action_type: "ROLE_CHANGED",
          metadata: {
            targetProfileId,
            newRole,
            performedBy: authUser.email,
            timestamp: new Date().toISOString(),
          },
        },
      });
    } catch {}

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    });
  } catch (error: any) {
    console.error("Error assigning user role:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update user role." },
      { status: 500 }
    );
  }
}
