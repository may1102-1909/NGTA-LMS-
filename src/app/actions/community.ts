"use server";

import { prisma } from "@/lib/prisma";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";



export async function getCurrentUser() {
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
              // Ignore in server actions
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
          role: String(user.user_metadata?.role || user.app_metadata?.role || "STUDENT").toUpperCase(),
          name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Learner",
        };
      }
    }
  } catch (err) {
    console.warn("Could not read auth cookies in community actions:", err);
  }

  // Fallback to latest database profile for dev/testing
  try {
    const latestProfile = await prisma.profiles.findFirst({
      orderBy: { created_at: "desc" },
    });
    if (latestProfile) {
      return {
        id: latestProfile.id,
        email: latestProfile.email,
        role: "STUDENT",
        name: latestProfile.full_name || "Learner",
      };
    }
  } catch (dbErr) {
    console.warn("Profile fallback error in community actions:", dbErr);
  }

  return null;
}

export async function createPost(content: string, imageUrl?: string) {
  try {
    const cleanContent = content?.trim();
    if (!cleanContent) {
      return { success: false, error: "Post content cannot be empty." };
    }

    const user = await getCurrentUser();
    if (!user?.id) {
      return { success: false, error: "You must be signed in to create a post." };
    }

    // Ensure profile exists for foreign key references
    try {
      const existingProfile = await prisma.profiles.findUnique({
        where: { id: user.id },
      });
      if (!existingProfile) {
        await prisma.profiles.create({
          data: {
            id: user.id,
            email: user.email || `${user.id}@ngta.in`,
            full_name: user.name || "Learner",
          },
        });
      }
    } catch {}

    const post = await prisma.community_posts.create({
      data: {
        user_id: user.id,
        content: cleanContent,
        image_url: imageUrl || null,
      },
    });

    // Automatically add author's own initial like
    try {
      await prisma.community_likes.create({
        data: {
          post_id: post.id,
          user_id: user.id,
        },
      });
    } catch {}

    // Log user activity in Supabase
    try {
      await prisma.user_activities.create({
        data: {
          user_id: user.id,
          action_type: "POST_CREATED",
          metadata: {
            postId: post.id,
            preview: cleanContent.slice(0, 100),
            timestamp: new Date().toISOString(),
          },
        },
      });
    } catch {}

    revalidatePath("/community/feed");
    revalidatePath("/community");

    return { success: true, post };
  } catch (error: any) {
    console.error("Error in createPost server action:", error);
    return { success: false, error: error?.message || "Failed to create post" };
  }
}

export async function toggleLike(postId: string) {
  try {
    if (!postId) return { success: false, error: "Post ID is required" };

    const user = await getCurrentUser();
    if (!user?.id) {
      return { success: false, error: "Sign in to like posts" };
    }

    // Check if like exists
    const existing = await prisma.community_likes.findUnique({
      where: {
        post_id_user_id: {
          post_id: postId,
          user_id: user.id,
        },
      },
    });

    let isLiked = false;
    if (existing) {
      await prisma.community_likes.delete({
        where: { id: existing.id },
      });
      isLiked = false;

      // Clean up from user_activities
      try {
        const activities = await prisma.user_activities.findMany({
          where: { user_id: user.id, action_type: "POST_LIKED" },
        });
        const match = activities.find(
          (a: any) => (a.metadata as any)?.postId === postId
        );
        if (match) {
          await prisma.user_activities.delete({ where: { id: match.id } });
        }
      } catch {}
    } else {
      await prisma.community_likes.create({
        data: {
          post_id: postId,
          user_id: user.id,
        },
      });
      isLiked = true;

      // Log in user_activities
      try {
        await prisma.user_activities.create({
          data: {
            user_id: user.id,
            action_type: "POST_LIKED",
            metadata: {
              postId,
              timestamp: new Date().toISOString(),
            },
          },
        });
      } catch {}
    }

    const likesCount = await prisma.community_likes.count({
      where: { post_id: postId },
    });

    revalidatePath("/community/feed");
    return { success: true, isLiked, likesCount, postId };
  } catch (error: any) {
    console.error("Error in toggleLike server action:", error);
    return { success: false, error: error?.message || "Failed to update like" };
  }
}

export async function addComment(postId: string, content: string) {
  try {
    const cleanContent = content?.trim();
    if (!postId || !cleanContent) {
      return { success: false, error: "Post ID and comment content are required" };
    }

    const user = await getCurrentUser();
    if (!user?.id) {
      return { success: false, error: "Sign in to leave a comment" };
    }

    const comment = await prisma.community_comments.create({
      data: {
        post_id: postId,
        user_id: user.id,
        content: cleanContent,
      },
    });

    // Also persist in legacy comments table for backward compatibility
    try {
      await prisma.comments.create({
        data: {
          post_id: postId,
          user_id: user.id,
          content: cleanContent,
        },
      });
    } catch {}

    // Log comment in user_activities
    try {
      await prisma.user_activities.create({
        data: {
          user_id: user.id,
          action_type: "POST_COMMENTED",
          metadata: {
            postId,
            commentId: comment.id,
            preview: cleanContent.slice(0, 100),
            timestamp: new Date().toISOString(),
          },
        },
      });
    } catch {}

    // Retrieve author persona or instructor info
    const studentProfile = await prisma.student_profiles.findUnique({
      where: { user_id: user.id },
    });

    const isInstructor =
      user.role === "INSTRUCTOR" ||
      user.email?.toLowerCase().includes("rahul") ||
      user.name?.toLowerCase().includes("rahul");

    const authorName = isInstructor
      ? "Rahul Kamat"
      : studentProfile?.username
      ? `@${studentProfile.username}`
      : user.name || "Learner";

    const authorAvatar = isInstructor
      ? "/instructor/rahul-kamat.png"
      : studentProfile?.avatar_url || "/avatars/avatar-1.png";

    revalidatePath("/community/feed");

    return {
      success: true,
      comment: {
        id: comment.id,
        postId: comment.post_id,
        content: comment.content,
        createdAt: comment.created_at.toISOString(),
        author: {
          id: user.id,
          name: authorName,
          avatar: authorAvatar,
          role: isInstructor ? "INSTRUCTOR" : "STUDENT",
        },
      },
    };
  } catch (error: any) {
    console.error("Error in addComment server action:", error);
    return { success: false, error: error?.message || "Failed to add comment" };
  }
}

export async function toggleRepost(postId: string) {
  try {
    if (!postId) return { success: false, error: "Post ID is required" };

    const user = await getCurrentUser();
    if (!user?.id) {
      return { success: false, error: "Sign in to repost" };
    }

    const existing = await prisma.community_reposts.findUnique({
      where: {
        post_id_user_id: {
          post_id: postId,
          user_id: user.id,
        },
      },
    });

    let isReposted = false;
    if (existing) {
      await prisma.community_reposts.delete({
        where: { id: existing.id },
      });
      isReposted = false;
    } else {
      await prisma.community_reposts.create({
        data: {
          post_id: postId,
          user_id: user.id,
        },
      });
      isReposted = true;

      // Log activity
      try {
        await prisma.user_activities.create({
          data: {
            user_id: user.id,
            action_type: "POST_REPOSTED",
            metadata: {
              postId,
              timestamp: new Date().toISOString(),
            },
          },
        });
      } catch {}
    }

    const repostsCount = await prisma.community_reposts.count({
      where: { post_id: postId },
    });

    revalidatePath("/community/feed");
    return { success: true, isReposted, repostsCount, postId };
  } catch (error: any) {
    console.error("Error in toggleRepost server action:", error);
    return { success: false, error: error?.message || "Failed to toggle repost" };
  }
}

export async function getCommunityFeed() {
  try {
    const user = await getCurrentUser();
    const currentUserId = user?.id;

    // Fetch all database posts with relations and counts
    const dbPosts = await prisma.community_posts.findMany({
      include: {
        _count: {
          select: {
            likes: true,
            comments: true,
            reposts: true,
          },
        },
        likes: true,
        reposts: true,
        comments: {
          orderBy: { created_at: "asc" },
        },
      },
      orderBy: { created_at: "desc" },
    });

    // Gather all user IDs to batch query profiles and student_profiles
    const allUserIds = new Set<string>();
    dbPosts.forEach((p: any) => {
      allUserIds.add(p.user_id);
      p.comments.forEach((c: any) => allUserIds.add(c.user_id));
    });

    const userIdsArray = Array.from(allUserIds);

    const [profilesList, studentProfilesList] = await Promise.all([
      prisma.profiles.findMany({
        where: { id: { in: userIdsArray } },
      }),
      prisma.student_profiles.findMany({
        where: { user_id: { in: userIdsArray } },
      }),
    ]);

    const profileMap = new Map<string, any>(profilesList.map((p: any) => [p.id, p]));
    const studentMap = new Map<string, any>(studentProfilesList.map((s: any) => [s.user_id, s]));

    // Format DB posts purely from real database entities
    const formattedDbPosts = dbPosts.map((post: any) => {
      const student = studentMap.get(post.user_id);
      const profile = profileMap.get(post.user_id);

      const isInstructor =
        profile?.role === "INSTRUCTOR" ||
        profile?.email?.toLowerCase().includes("rahul") ||
        profile?.full_name?.toLowerCase().includes("rahul");

      let authorName = profile?.full_name || (student?.username ? `@${student.username}` : "Member");
      let authorHandle = student?.username
        ? `@/${student.username.toLowerCase()}`
        : `@/${authorName.replace(/\s+/g, "").toLowerCase()}`;
      let authorAvatar = student?.avatar_url || profile?.avatar_url || "/avatars/avatar-1.png";
      let role: "Member" | "Lead" | "Instructor" = isInstructor ? "Instructor" : "Member";
      let spaceName = isInstructor ? "Selenium Java + AI Architect" : "General Community";
      let spaceIcon = isInstructor ? "⚡" : "👥";

      if (isInstructor) {
        authorName = profile?.full_name || "Rahul Kamat";
        authorHandle = "@/RahulKamat";
        authorAvatar = profile?.avatar_url || "/instructor/rahul-kamat.png";
        role = "Instructor";
        spaceName = "Selenium Java + AI Architect";
        spaceIcon = "⚡";
      } else if (student) {
        authorName = `@${student.username}`;
        authorHandle = `@/${student.username.toLowerCase()}`;
        authorAvatar = student.avatar_url;
        role = "Member";
      }

      const isLiked = currentUserId
        ? post.likes.some((l: any) => l.user_id === currentUserId)
        : false;

      const isReposted = currentUserId
        ? post.reposts.some((r: any) => r.user_id === currentUserId)
        : false;

      const timeAgo = formatTimeAgo(post.created_at);

      const comments = post.comments.map((c: any) => {
        const cStudent = studentMap.get(c.user_id);
        const cProfile = profileMap.get(c.user_id);
        const cIsInstructor =
          cProfile?.role === "INSTRUCTOR" ||
          cProfile?.email?.toLowerCase().includes("rahul") ||
          cProfile?.full_name?.toLowerCase().includes("rahul");

        let cAuthorName = cProfile?.full_name || (cStudent?.username ? `@${cStudent.username}` : "Learner");
        let cAuthorAvatar = cStudent?.avatar_url || cProfile?.avatar_url || "/avatars/avatar-1.png";
        let cRole = cIsInstructor ? "INSTRUCTOR" : "STUDENT";

        if (cIsInstructor) {
          cAuthorName = cProfile?.full_name || "Rahul Kamat";
          cAuthorAvatar = cProfile?.avatar_url || "/instructor/rahul-kamat.png";
          cRole = "INSTRUCTOR";
        } else if (cStudent) {
          cAuthorName = `@${cStudent.username}`;
          cAuthorAvatar = cStudent.avatar_url;
          cRole = "STUDENT";
        }

        return {
          id: c.id,
          postId: c.post_id,
          content: c.content,
          createdAt: c.created_at.toISOString(),
          author: {
            id: c.user_id,
            name: cAuthorName,
            avatar: cAuthorAvatar,
            role: cRole,
          },
        };
      });

      return {
        id: post.id,
        authorName,
        authorHandle,
        authorAvatar,
        spaceName,
        spaceIcon,
        role,
        timeAgo,
        content: post.content,
        type: (post.image_url ? "MEDIA" : "MOCKUPS") as "MOCKUPS" | "MEDIA",
        mediaUrl: post.image_url || undefined,
        commentsCount: post._count.comments,
        likesCount: post._count.likes,
        repostsCount: post._count.reposts,
        isLiked,
        isReposted,
        comments,
      };
    });

    return {
      success: true,
      posts: formattedDbPosts,
      currentUser: user,
    };
  } catch (error: any) {
    console.error("Error in getCommunityFeed server action:", error);
    return { success: false, posts: [], error: error?.message || "Failed to fetch feed" };
  }
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}
