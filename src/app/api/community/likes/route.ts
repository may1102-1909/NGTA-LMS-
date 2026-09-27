import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getAuthUserId(): Promise<{ id?: string; email?: string; name?: string }> {
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
        return {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.user_metadata?.name,
        };
      }
    }
  } catch (err) {
    console.warn("Could not read auth cookies in likes route:", err);
  }
  return {};
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let userId: string | null | undefined = searchParams.get("userId");

    if (!userId) {
      const authUser = await getAuthUserId();
      userId = authUser.id;
    }

    if (!userId) {
      const latestProfile = await prisma.profiles.findFirst({
        orderBy: { created_at: "desc" },
      });
      if (latestProfile) {
        userId = latestProfile.id;
      }
    }

    if (!userId) {
      return NextResponse.json({ likedPostIds: [] });
    }

    // Query user_activities for current user's past POST_LIKED events
    const likeActivities = await prisma.user_activities.findMany({
      where: {
        user_id: userId,
        action_type: "POST_LIKED",
      },
      select: {
        id: true,
        metadata: true,
        created_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const likedPostIds = Array.from(
      new Set(
        likeActivities
          .map((item: any) => (item.metadata as any)?.postId)
          .filter(Boolean)
      )
    );

    return NextResponse.json({
      success: true,
      likedPostIds,
    });
  } catch (error: any) {
    console.error("Error fetching community post likes from user_activities:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch post likes", likedPostIds: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { postId, userId, userEmail, userName, isLiked = true } = body;

    if (!postId) {
      return NextResponse.json({ error: "postId is required" }, { status: 400 });
    }

    let targetUserId = userId;
    let targetEmail = userEmail;
    let targetName = userName;

    if (!targetUserId) {
      const authUser = await getAuthUserId();
      if (authUser.id) {
        targetUserId = authUser.id;
        targetEmail = targetEmail || authUser.email;
        targetName = targetName || authUser.name;
      }
    }

    if (!targetUserId) {
      const latestProfile = await prisma.profiles.findFirst({
        orderBy: { created_at: "desc" },
      });
      if (latestProfile) {
        targetUserId = latestProfile.id;
        targetEmail = targetEmail || latestProfile.email;
        targetName = targetName || latestProfile.full_name;
      }
    }

    if (!targetUserId) {
      return NextResponse.json(
        { error: "User authentication required to persist like status" },
        { status: 401 }
      );
    }

    // Ensure profile row exists to satisfy foreign key constraint: user_activities.user_id -> profiles.id
    try {
      const existingProfile = await prisma.profiles.findUnique({
        where: { id: targetUserId },
      });

      if (!existingProfile) {
        await prisma.profiles.create({
          data: {
            id: targetUserId,
            email: targetEmail || `${targetUserId}@ngta.in`,
            full_name: targetName || "Learner",
          },
        });
      }
    } catch (profileErr) {
      console.warn("Profile check/create warning:", profileErr);
    }

    if (isLiked) {
      // Check if already liked to prevent duplicates in user_activities
      const existing = await prisma.user_activities.findMany({
        where: {
          user_id: targetUserId,
          action_type: "POST_LIKED",
        },
      });

      const alreadyLiked = existing.some(
        (act: any) => (act.metadata as any)?.postId === postId
      );

      if (!alreadyLiked) {
        // Create a record in user_activities with action_type: 'POST_LIKED' and metadata: { postId }
        await prisma.user_activities.create({
          data: {
            user_id: targetUserId,
            action_type: "POST_LIKED",
            metadata: {
              postId,
              timestamp: new Date().toISOString(),
            },
          },
        });
      }
    } else {
      // If user unlikes, remove previous POST_LIKED activities for this post
      const existingActivities = await prisma.user_activities.findMany({
        where: {
          user_id: targetUserId,
          action_type: "POST_LIKED",
        },
      });

      const idsToDelete = existingActivities
        .filter((act: any) => (act.metadata as any)?.postId === postId)
        .map((act: any) => act.id);

      if (idsToDelete.length > 0) {
        await prisma.user_activities.deleteMany({
          where: {
            id: { in: idsToDelete },
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      postId,
      isLiked,
    });
  } catch (error: any) {
    console.error("Error updating POST_LIKED in user_activities:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to persist like action" },
      { status: 500 }
    );
  }
}
