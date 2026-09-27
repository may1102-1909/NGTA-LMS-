"use server";

import { prisma } from "@/lib/prisma";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const SEED_PAWPAW_ID = "00000000-0000-4000-a000-000000000001";
const SEED_KANAAN_ID = "00000000-0000-4000-a000-000000000002";
const SEED_INSTRUCTOR_ID = "00000000-0000-4000-a000-000000000003";
const SEED_SARAH_ID = "00000000-0000-4000-a000-000000000004";
const SEED_DEVON_ID = "00000000-0000-4000-a000-000000000005";
const SEED_TANMAY_ID = "00000000-0000-4000-a000-000000000006";

const SEED_POST_1_ID = "11111111-1111-4111-a111-111111111111";
const SEED_POST_2_ID = "22222222-2222-4222-a222-222222222222";
const SEED_POST_3_ID = "33333333-3333-4333-a333-333333333333";

const SEED_AUTHORS: Record<
  string,
  {
    name: string;
    handle: string;
    avatar: string;
    role: "Member" | "Lead" | "Instructor";
    spaceName: string;
    spaceIcon: string;
    type?: "MOCKUPS" | "MEDIA";
  }
> = {
  [SEED_PAWPAW_ID]: {
    name: "Pawpaw",
    handle: "@/Pawpaw",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    role: "Member",
    spaceName: "Crack Designers",
    spaceIcon: "👥",
    type: "MOCKUPS",
  },
  [SEED_KANAAN_ID]: {
    name: "Kanaan",
    handle: "@/Kanaan_",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    role: "Member",
    spaceName: "GymMotivation",
    spaceIcon: "👥",
    type: "MEDIA",
  },
  [SEED_INSTRUCTOR_ID]: {
    name: "Rahul Kamat",
    handle: "@/RahulKamat",
    avatar: "/instructor/rahul-kamat.png",
    role: "Instructor",
    spaceName: "Selenium Java + AI Architect",
    spaceIcon: "⚡",
    type: "MEDIA",
  },
  [SEED_SARAH_ID]: {
    name: "Sarah Jenkins",
    handle: "@/SarahJ",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    role: "Member",
    spaceName: "Automation",
    spaceIcon: "⚡",
  },
  [SEED_DEVON_ID]: {
    name: "Devon Miles",
    handle: "@/DevonMiles",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    role: "Member",
    spaceName: "GymMotivation",
    spaceIcon: "👥",
  },
  [SEED_TANMAY_ID]: {
    name: "Tanmay Sharma",
    handle: "@/TanmaySharma",
    avatar: "/avatars/avatar-15.png",
    role: "Member",
    spaceName: "General",
    spaceIcon: "⚡",
  },
};

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

async function ensureInitialSeedPosts() {
  try {
    const count = await prisma.community_posts.count();
    if (count > 0) return;

    // Seed post 1: Pawpaw
    await prisma.community_posts.create({
      data: {
        id: SEED_POST_1_ID,
        user_id: SEED_PAWPAW_ID,
        content: "Clarity > Complexity",
        image_url: null,
        comments: {
          create: [
            {
              user_id: SEED_INSTRUCTOR_ID,
              content: "Simplicity is the ultimate sophistication. Clean token system here!",
            },
            {
              user_id: SEED_SARAH_ID,
              content: "Love the high contrast dark mode aesthetics.",
            },
          ],
        },
        likes: {
          create: [
            { user_id: SEED_PAWPAW_ID },
            { user_id: SEED_SARAH_ID },
          ],
        },
      },
    });

    // Seed post 2: Kanaan
    await prisma.community_posts.create({
      data: {
        id: SEED_POST_2_ID,
        user_id: SEED_KANAAN_ID,
        content: "Divine Timing...",
        image_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
        comments: {
          create: [
            {
              user_id: SEED_DEVON_ID,
              content: "Consistency beats intensity every single day. Keep crushing it!",
            },
          ],
        },
        likes: {
          create: [
            { user_id: SEED_KANAAN_ID },
            { user_id: SEED_DEVON_ID },
          ],
        },
      },
    });

    // Seed post 3: Rahul Kamat
    await prisma.community_posts.create({
      data: {
        id: SEED_POST_3_ID,
        user_id: SEED_INSTRUCTOR_ID,
        content: "Live Automation Workshop starts this weekend! Check the architecture diagram below.",
        image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
        comments: {
          create: [
            {
              user_id: SEED_TANMAY_ID,
              content: "Will the recording be available in the LMS portal after the live stream?",
            },
          ],
        },
        likes: {
          create: [
            { user_id: SEED_INSTRUCTOR_ID },
          ],
        },
      },
    });
  } catch (seedErr) {
    console.warn("Could not auto-seed community posts:", seedErr);
  }
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

    const baseLikes =
      postId === SEED_POST_1_ID ? 10 : postId === SEED_POST_2_ID ? 82 : postId === SEED_POST_3_ID ? 141 : 0;

    revalidatePath("/community/feed");
    return { success: true, isLiked, likesCount: baseLikes + likesCount, postId };
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

    const baseReposts =
      postId === SEED_POST_1_ID ? 2 : postId === SEED_POST_2_ID ? 6 : postId === SEED_POST_3_ID ? 19 : 0;

    revalidatePath("/community/feed");
    return { success: true, isReposted, repostsCount: baseReposts + repostsCount, postId };
  } catch (error: any) {
    console.error("Error in toggleRepost server action:", error);
    return { success: false, error: error?.message || "Failed to toggle repost" };
  }
}

export async function getCommunityFeed() {
  try {
    // Auto-seed initial community posts if database table is currently empty
    await ensureInitialSeedPosts();

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

    // Format DB posts
    const formattedDbPosts = dbPosts.map((post: any) => {
      const student = studentMap.get(post.user_id);
      const profile = profileMap.get(post.user_id);
      const seedAuthor = SEED_AUTHORS[post.user_id];

      const isInstructor =
        seedAuthor?.role === "Instructor" ||
        profile?.email?.toLowerCase().includes("rahul") ||
        profile?.full_name?.toLowerCase().includes("rahul") ||
        post.user_id === SEED_INSTRUCTOR_ID;

      let authorName = seedAuthor?.name || profile?.full_name || "Community Member";
      let authorHandle = seedAuthor?.handle || `@/${authorName.replace(/\s+/g, "").toLowerCase()}`;
      let authorAvatar = seedAuthor?.avatar || profile?.avatar_url || "/avatars/avatar-1.png";
      let role: "Member" | "Lead" | "Instructor" = seedAuthor?.role || "Member";
      let spaceName = seedAuthor?.spaceName || "Crack Designers";
      let spaceIcon = seedAuthor?.spaceIcon || "👥";

      if (isInstructor) {
        authorName = "Rahul Kamat";
        authorHandle = "@/RahulKamat";
        authorAvatar = "/instructor/rahul-kamat.png";
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

      const baseLikes =
        post.id === SEED_POST_1_ID ? 10 : post.id === SEED_POST_2_ID ? 82 : post.id === SEED_POST_3_ID ? 141 : 0;
      const baseReposts =
        post.id === SEED_POST_1_ID ? 2 : post.id === SEED_POST_2_ID ? 6 : post.id === SEED_POST_3_ID ? 19 : 0;

      const comments = post.comments.map((c: any) => {
        const cStudent = studentMap.get(c.user_id);
        const cProfile = profileMap.get(c.user_id);
        const cSeedAuthor = SEED_AUTHORS[c.user_id];
        const cIsInstructor =
          cSeedAuthor?.role === "Instructor" ||
          cProfile?.email?.toLowerCase().includes("rahul") ||
          cProfile?.full_name?.toLowerCase().includes("rahul") ||
          c.user_id === SEED_INSTRUCTOR_ID;

        let cAuthorName = cSeedAuthor?.name || cProfile?.full_name || "Learner";
        let cAuthorAvatar = cSeedAuthor?.avatar || cProfile?.avatar_url || "/avatars/avatar-1.png";
        let cRole = "STUDENT";

        if (cIsInstructor) {
          cAuthorName = "Rahul Kamat";
          cAuthorAvatar = "/instructor/rahul-kamat.png";
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
        type: (post.id === SEED_POST_1_ID ? "MOCKUPS" : post.image_url ? "MEDIA" : "MOCKUPS") as "MOCKUPS" | "MEDIA",
        mediaUrl: post.image_url || undefined,
        commentsCount: post._count.comments,
        likesCount: baseLikes + post._count.likes,
        repostsCount: baseReposts + post._count.reposts,
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
