import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let userId = searchParams.get("userId");

    // Fallback to latest active profile if userId not explicitly provided
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
          .map((item: { id: string; metadata: any; created_at: Date }) => (item.metadata as any)?.postId)
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
    const { postId, userId, isLiked = true } = body;

    if (!postId) {
      return NextResponse.json({ error: "postId is required" }, { status: 400 });
    }

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
        { error: "User authentication required to persist like status" },
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
            email: authUser.email || `${targetUserId}@ngta.in`,
            full_name: authUser.email?.split("@")[0] || "Learner",
          },
        });
      }
    }

    if (isLiked) {
      // Create a record in user_activities with action_type: 'POST_LIKED' and metadata: { postId }
      await prisma.user_activities.create({
        data: {
          user_id: targetUserId,
          action_type: "POST_LIKED",
          metadata: { postId },
        },
      });
    } else {
      // If user unlikes, remove previous POST_LIKED activities for this post
      const existingActivities = await prisma.user_activities.findMany({
        where: {
          user_id: targetUserId,
          action_type: "POST_LIKED",
        },
      });

      const idsToDelete = existingActivities
        .filter((act: { metadata: any }) => (act.metadata as any)?.postId === postId)
        .map((act: { id: string }) => act.id);

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
    console.error("Error creating POST_LIKED record in user_activities:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to persist like action" },
      { status: 500 }
    );
  }
}
