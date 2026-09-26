import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subscription, userId, userEmail, userName } = body;

    if (!subscription || !subscription.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
      return NextResponse.json(
        { error: "Invalid push subscription object provided" },
        { status: 400 }
      );
    }

    // 1. Resolve User ID from request or Supabase session cookies
    let targetUserId = userId;
    let targetEmail = userEmail;
    let targetName = userName;

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
                  // Ignore in route handler
                }
              },
            },
          });
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user?.id) {
            targetUserId = user.id;
            targetEmail = user.email || targetEmail;
            targetName = user.user_metadata?.full_name || targetName;
          }
        }
      } catch (authErr) {
        console.warn("Could not read auth cookies in push subscribe:", authErr);
      }
    }

    if (!targetUserId) {
      return NextResponse.json(
        { error: "Unauthorized: User must be signed in to save push subscription" },
        { status: 401 }
      );
    }

    // 2. Ensure profile exists in public.profiles to satisfy Foreign Key constraint
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

    // 3. Save subscription endpoint and keys into public.user_activities via Prisma
    const existingSubscriptions = await prisma.user_activities.findMany({
      where: {
        user_id: targetUserId,
        action_type: "PUSH_SUBSCRIPTION",
      },
    });

    const matchingRecord = existingSubscriptions.find((record: any) => {
      const meta = record.metadata as any;
      return meta && meta.endpoint === subscription.endpoint;
    });

    const userAgent = request.headers.get("user-agent") || "unknown";

    let activityRecord;
    if (matchingRecord) {
      activityRecord = await prisma.user_activities.update({
        where: { id: matchingRecord.id },
        data: {
          metadata: {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.keys.p256dh,
              auth: subscription.keys.auth,
            },
            userAgent,
            updatedAt: new Date().toISOString(),
          },
        },
      });
    } else {
      activityRecord = await prisma.user_activities.create({
        data: {
          user_id: targetUserId,
          action_type: "PUSH_SUBSCRIPTION",
          metadata: {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.keys.p256dh,
              auth: subscription.keys.auth,
            },
            userAgent,
            subscribedAt: new Date().toISOString(),
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Push notification subscription saved successfully in user_activities",
      activityId: activityRecord.id,
    });
  } catch (error: any) {
    console.error("Error saving push subscription:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to save push subscription" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let userId = searchParams.get("userId");

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
              setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
                try {
                  cookiesToSet.forEach(({ name, value, options }) =>
                    cookieStore.set(name, value, options)
                  );
                } catch {
                  // Ignore
                }
              },
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
        console.warn("Auth check error in push subscribe GET:", authErr);
      }
    }

    if (!userId) {
      return NextResponse.json({ subscribed: false });
    }

    const subscriptions = await prisma.user_activities.findMany({
      where: {
        user_id: userId,
        action_type: "PUSH_SUBSCRIPTION",
      },
      select: {
        id: true,
        created_at: true,
      },
    });

    return NextResponse.json({
      subscribed: subscriptions.length > 0,
      count: subscriptions.length,
      subscriptions,
    });
  } catch (error: any) {
    console.error("Error checking push subscription status:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to check subscription status" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { endpoint, userId } = body;

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
                  // Ignore
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
        console.warn("Auth check error in push subscribe DELETE:", authErr);
      }
    }

    if (!targetUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find and delete matching subscription(s)
    const activities = await prisma.user_activities.findMany({
      where: {
        user_id: targetUserId,
        action_type: "PUSH_SUBSCRIPTION",
      },
    });

    const toDelete = endpoint
      ? activities.filter((act: any) => {
          const meta = act.metadata as any;
          return meta?.endpoint === endpoint;
        })
      : activities;

    for (const item of toDelete) {
      await prisma.user_activities.delete({
        where: { id: item.id },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Unsubscribed ${toDelete.length} push subscription(s)`,
    });
  } catch (error: any) {
    console.error("Error deleting push subscription:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to remove subscription" },
      { status: 500 }
    );
  }
}
