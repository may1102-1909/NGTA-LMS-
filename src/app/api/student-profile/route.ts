import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getAuthUser(): Promise<{
  id?: string;
  email?: string;
  name?: string;
  role?: string;
}> {
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
              // Ignore in route handlers
            }
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.id) {
        const metadataRole =
          user.user_metadata?.role ||
          user.app_metadata?.role ||
          "STUDENT";

        return {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.user_metadata?.name,
          role: String(metadataRole).toUpperCase(),
        };
      }
    }
  } catch (err) {
    console.warn("Could not read auth session in student-profile route:", err);
  }
  return {};
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let userId = searchParams.get("userId");
    let userRole = searchParams.get("role") || "";

    const authUser = await getAuthUser();
    if (!userId && authUser.id) {
      userId = authUser.id;
    }
    if (!userRole && authUser.role) {
      userRole = authUser.role;
    }

    if (!userId) {
      // Fallback: check latest profile for testing
      const latestProfile = await prisma.profiles.findFirst({
        orderBy: { created_at: "desc" },
      });
      if (latestProfile) {
        userId = latestProfile.id;
      }
    }

    if (!userId) {
      return NextResponse.json({
        hasProfile: false,
        profile: null,
        role: "STUDENT",
      });
    }

    // Query authoritative role from profiles table
    const profileRecord = await prisma.profiles.findFirst({
      where: {
        OR: [{ user_id: userId }, { id: userId }],
      },
    });

    const finalRole = profileRecord?.role || (userRole ? userRole.toUpperCase() : "LEARNER");
    const isLearnerOrGuest = finalRole === "LEARNER" || finalRole === "GUEST";

    // Query student_profiles table
    const profile = await prisma.student_profiles.findUnique({
      where: { user_id: userId },
    });

    const safeProfile = profile
      ? {
          ...profile,
          full_name: profileRecord?.full_name || profile.username,
          email: profileRecord?.email || "",
          xp_points: profile.xp_points ?? 0,
          current_streak: profile.current_streak ?? 0,
        }
      : profileRecord
      ? {
          id: profileRecord.id,
          user_id: profileRecord.user_id,
          username: profileRecord.full_name?.replace(/\s+/g, "_") || profileRecord.email?.split("@")[0] || "Learner",
          avatar_url: profileRecord.avatar_url || "/avatars/avatar-1.png",
          full_name: profileRecord.full_name,
          email: profileRecord.email,
          xp_points: 0,
          current_streak: 0,
        }
      : null;

    return NextResponse.json({
      hasProfile: Boolean(safeProfile),
      profile: safeProfile,
      xp_points: safeProfile?.xp_points ?? 0,
      current_streak: safeProfile?.current_streak ?? 0,
      role: finalRole,
      isLearnerOrGuest,
    });
  } catch (error: any) {
    console.error("Error fetching student profile:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch student profile", hasProfile: false },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, avatar_url, userId } = body;

    const trimmedUsername = String(username || "").trim();

    if (!trimmedUsername || trimmedUsername.length < 2) {
      return NextResponse.json(
        { error: "Username must be at least 2 characters long." },
        { status: 400 }
      );
    }

    if (!avatar_url) {
      return NextResponse.json(
        { error: "Please select an avatar persona." },
        { status: 400 }
      );
    }

    let targetUserId = userId;
    let targetRole = "STUDENT";

    const authUser = await getAuthUser();
    if (authUser.id) {
      targetUserId = targetUserId || authUser.id;
      targetRole = authUser.role || "STUDENT";
    }

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
        { error: "Authentication required to lock in your student persona." },
        { status: 401 }
      );
    }

    // Role check: Only STUDENT role needs custom student onboarding persona
    if (targetRole === "INSTRUCTOR" || targetRole === "ADMIN") {
      return NextResponse.json(
        { error: `Onboarding skipped for ${targetRole} account.` },
        { status: 400 }
      );
    }

    // Check username uniqueness
    const existingWithUsername = await prisma.student_profiles.findFirst({
      where: {
        username: {
          equals: trimmedUsername,
          mode: "insensitive",
        },
        NOT: {
          user_id: targetUserId,
        },
      },
    });

    if (existingWithUsername) {
      return NextResponse.json(
        { error: `Username "${trimmedUsername}" is already taken by another student.` },
        { status: 409 }
      );
    }

    // Upsert student_profiles record
    const studentProfile = await prisma.student_profiles.upsert({
      where: { user_id: targetUserId },
      update: {
        username: trimmedUsername,
        avatar_url,
        updated_at: new Date(),
      },
      create: {
        user_id: targetUserId,
        username: trimmedUsername,
        avatar_url,
      },
    });

    // Also sync avatar and display name to profiles row
    try {
      await prisma.profiles.upsert({
        where: { id: targetUserId },
        update: {
          avatar_url,
          full_name: trimmedUsername,
        },
        create: {
          id: targetUserId,
          email: authUser.email || `${targetUserId}@ngta.in`,
          full_name: trimmedUsername,
          avatar_url,
        },
      });
    } catch (profileErr) {
      console.warn("Could not sync to profiles table:", profileErr);
    }

    // Log user activity
    try {
      await prisma.user_activities.create({
        data: {
          user_id: targetUserId,
          action_type: "STUDENT_ONBOARDED",
          metadata: {
            username: trimmedUsername,
            avatar_url,
            timestamp: new Date().toISOString(),
          },
        },
      });
    } catch (actErr) {
      console.warn("Notice logging student onboarding activity:", actErr);
    }

    return NextResponse.json({
      success: true,
      profile: studentProfile,
    });
  } catch (error: any) {
    console.error("Error saving student profile:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to save student persona" },
      { status: 500 }
    );
  }
}
