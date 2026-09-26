import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWebPush } from "@/lib/webPush";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      title = "NextGen Academy (NGTA) Alert",
      body: message = "You have a new update in your learning portal.",
      url = "/notifications",
      icon = "/logo.png",
      tag = "ngta-alert",
      broadcast = false,
    } = body;

    let targetUserId = userId;

    // If no userId and not broadcast, check session cookie
    if (!targetUserId && !broadcast) {
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
        console.warn("Auth check error in send push:", authErr);
      }
    }

    // Query active subscriptions from user_activities
    const whereClause: any = {
      action_type: "PUSH_SUBSCRIPTION",
    };
    if (!broadcast && targetUserId) {
      whereClause.user_id = targetUserId;
    }

    const subscriptionRecords = await prisma.user_activities.findMany({
      where: whereClause,
      orderBy: { created_at: "desc" },
    });

    if (subscriptionRecords.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No push subscriptions found for this query.",
        sentCount: 0,
      });
    }

    const payload = {
      title,
      body: message,
      url,
      icon,
      badge: icon,
      tag,
      actions: [{ action: "open", title: "View Alert" }],
    };

    let sentCount = 0;
    const errors: any[] = [];
    const expiredIds: string[] = [];

    for (const record of subscriptionRecords) {
      const meta = record.metadata as any;
      if (!meta?.endpoint || !meta?.keys?.p256dh || !meta?.keys?.auth) {
        continue;
      }

      const result = await sendWebPush(
        {
          endpoint: meta.endpoint,
          keys: {
            p256dh: meta.keys.p256dh,
            auth: meta.keys.auth,
          },
        },
        payload
      );

      if (result.success) {
        sentCount++;
      } else {
        errors.push({ id: record.id, error: result.error });
        if (result.isExpired) {
          expiredIds.push(record.id);
        }
      }
    }

    // Clean up expired subscriptions automatically
    if (expiredIds.length > 0) {
      try {
        await prisma.user_activities.deleteMany({
          where: { id: { in: expiredIds } },
        });
      } catch (cleanupErr) {
        console.warn("Could not delete expired push subscriptions:", cleanupErr);
      }
    }

    return NextResponse.json({
      success: sentCount > 0,
      sentCount,
      totalTargets: subscriptionRecords.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("Error in send notification route:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to send notifications" },
      { status: 500 }
    );
  }
}
