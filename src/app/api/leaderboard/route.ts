import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRankTier, LeaderboardEntry } from "@/lib/gamification";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const studentProfiles = await prisma.student_profiles.findMany({
      orderBy: [
        { xp_points: "desc" },
        { current_streak: "desc" },
        { created_at: "asc" },
      ],
      take: 50,
    });

    if (!studentProfiles || studentProfiles.length === 0) {
      return NextResponse.json({ success: true, entries: [] });
    }

    // Fetch enrollments for completed modules count
    const userIds = studentProfiles.map((s: any) => s.user_id);
    const enrollments = await prisma.enrollments.findMany({
      where: {
        user_id: { in: userIds },
        status: "ACTIVE",
      },
    });

    const enrollmentsMap = new Map<string, number>();
    enrollments.forEach((e: any) => {
      const current = enrollmentsMap.get(e.user_id) || 0;
      enrollmentsMap.set(e.user_id, current + e.completed_modules);
    });

    const entries: LeaderboardEntry[] = studentProfiles.map((sp: any, idx: number) => {
      const tier = getRankTier(sp.xp_points || 0);
      const completed = enrollmentsMap.get(sp.user_id) || 0;

      return {
        id: sp.id,
        rank: idx + 1,
        name: sp.username,
        handle: `@${sp.username.toLowerCase()}`,
        cohort: "SELENIUM (COHORT 26)",
        courseId: "course-1",
        points: sp.xp_points || 0,
        streakDays: sp.current_streak || 0,
        rankCode: tier.code,
        avatarUrl: sp.avatar_url || "/avatars/avatar-1.png",
        badgesCount: 0,
        completedModules: completed,
      };
    });

    return NextResponse.json({ success: true, entries });
  } catch (error: any) {
    console.error("Error fetching leaderboard from database:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch leaderboard", entries: [] },
      { status: 500 }
    );
  }
}
