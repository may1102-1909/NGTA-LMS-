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
    console.warn("Could not read auth cookies in comments route:", err);
  }
  return {};
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    const comments = await prisma.comments.findMany({
      where: postId ? { post_id: postId } : {},
      include: {
        profiles: {
          select: {
            id: true,
            full_name: true,
            email: true,
            avatar_url: true,
          },
        },
      },
      orderBy: {
        created_at: "asc",
      },
    });

    const userIds = Array.from(
      new Set(comments.map((c: any) => c.user_id).filter(Boolean))
    );
    const studentProfiles = await prisma.student_profiles.findMany({
      where: { user_id: { in: userIds as string[] } },
    });
    const studentMap = new Map<string, any>(studentProfiles.map((s: any) => [s.user_id, s]));

    return NextResponse.json({
      success: true,
      comments: comments.map((c: any) => {
        const student: any = studentMap.get(c.user_id);
        const isInstructor =
          c.profiles?.email?.toLowerCase().includes("rahul") ||
          c.profiles?.full_name?.toLowerCase().includes("rahul");

        let authorName = c.profiles?.full_name || c.profiles?.email?.split("@")[0] || "Learner";
        let authorAvatar = c.profiles?.avatar_url || null;
        let role = "STUDENT";

        if (isInstructor) {
          authorName = "Rahul Kamat";
          authorAvatar = "/instructor/rahul-kamat.png";
          role = "INSTRUCTOR";
        } else if (student) {
          authorName = `@${student.username}`;
          authorAvatar = student.avatar_url;
          role = "STUDENT";
        }

        return {
          id: c.id,
          postId: c.post_id,
          content: c.content,
          createdAt: c.created_at,
          author: {
            id: c.profiles?.id,
            name: authorName,
            avatar: authorAvatar,
            role,
          },
        };
      }),
    });
  } catch (error: any) {
    console.error("Error fetching comments from database:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch comments", comments: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { postId, content, userId, userEmail, userName } = body;

    if (!postId || !content || !content.trim()) {
      return NextResponse.json(
        { error: "postId and non-empty content are required" },
        { status: 400 }
      );
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
        { error: "User authentication required to post a comment" },
        { status: 401 }
      );
    }

    // Ensure profile row exists to satisfy foreign key constraint: comments.user_id -> profiles.id
    let profile = await prisma.profiles.findUnique({
      where: { id: targetUserId },
    });

    if (!profile) {
      try {
        profile = await prisma.profiles.create({
          data: {
            id: targetUserId,
            email: targetEmail || `${targetUserId}@ngta.in`,
            full_name: targetName || "Learner",
          },
        });
      } catch (profileErr) {
        console.warn("Could not create profile row in comments POST:", profileErr);
      }
    }

    // 1. Insert into public.comments table via Prisma
    const commentRecord = await prisma.comments.create({
      data: {
        user_id: targetUserId,
        post_id: postId,
        content: content.trim(),
      },
      include: {
        profiles: {
          select: {
            id: true,
            full_name: true,
            email: true,
            avatar_url: true,
          },
        },
      },
    });

    // 2. Also log comment activity into public.user_activities table
    try {
      await prisma.user_activities.create({
        data: {
          user_id: targetUserId,
          action_type: "POST_COMMENTED",
          metadata: {
            postId,
            commentId: commentRecord.id,
            preview: content.trim().slice(0, 100),
            timestamp: new Date().toISOString(),
          },
        },
      });
    } catch (actErr) {
      console.warn("User activity logging notice in comment:", actErr);
    }

    // Resolve student persona or instructor profile for returned comment author
    const studentProfile = await prisma.student_profiles.findUnique({
      where: { user_id: targetUserId },
    });

    const isInstructor =
      profile?.email?.toLowerCase().includes("rahul") ||
      profile?.full_name?.toLowerCase().includes("rahul");

    let authorName = profile?.full_name || profile?.email?.split("@")[0] || "Learner";
    let authorAvatar = profile?.avatar_url || null;
    let authorRole = "STUDENT";

    if (isInstructor) {
      authorName = "Rahul Kamat";
      authorAvatar = "/instructor/rahul-kamat.png";
      authorRole = "INSTRUCTOR";
    } else if (studentProfile) {
      authorName = `@${studentProfile.username}`;
      authorAvatar = studentProfile.avatar_url;
      authorRole = "STUDENT";
    }

    return NextResponse.json({
      success: true,
      comment: {
        id: commentRecord.id,
        postId: commentRecord.post_id,
        content: commentRecord.content,
        createdAt: commentRecord.created_at,
        author: {
          id: commentRecord.profiles?.id,
          name: authorName,
          avatar: authorAvatar,
          role: authorRole,
        },
      },
    });
  } catch (error: any) {
    console.error("Error creating comment in comments table:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to post comment" },
      { status: 500 }
    );
  }
}
