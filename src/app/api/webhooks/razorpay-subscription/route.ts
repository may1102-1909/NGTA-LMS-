import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify webhook signature if secret is provided in environment
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      if (expectedSignature !== signature) {
        console.error("[Razorpay Subscription Webhook] Invalid signature detected!");
        return NextResponse.json(
          { error: "Invalid webhook signature" },
          { status: 400 }
        );
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const subscriptionEntity = payload.payload?.subscription?.entity || {};
    const subscriptionId = subscriptionEntity.id;

    console.log(
      `[Razorpay Subscription Webhook] Event: ${event} for Subscription ID: ${subscriptionId}`
    );

    if (!subscriptionId) {
      return NextResponse.json({ status: "ignored", reason: "no_subscription_id" });
    }

    // Find matching user_memberships record
    const existing = await prisma.user_memberships.findFirst({
      where: { razorpay_subscription_id: subscriptionId },
    });

    if (!existing) {
      console.warn(
        `[Razorpay Subscription Webhook] No local record found for subscription: ${subscriptionId}`
      );
      return NextResponse.json({ status: "ok", matched: false });
    }

    const now = new Date();

    switch (event) {
      // 1. subscription.authenticated -> Set state to TRIAL or ACTIVE
      case "subscription.authenticated": {
        const hasTrial = subscriptionEntity.has_scheduled_changes || existing.state === "TRIAL";
        const newState = hasTrial ? "TRIAL" : "ACTIVE";

        await prisma.user_memberships.update({
          where: { id: existing.id },
          data: {
            state: newState,
            updated_at: now,
          },
        });
        break;
      }

      // 2. subscription.charged -> Extend current_period_end and set state to ACTIVE
      case "subscription.charged": {
        let newEnd = new Date(existing.current_period_end);
        if (subscriptionEntity.current_end) {
          newEnd = new Date(subscriptionEntity.current_end * 1000);
        } else {
          // Extend by 30 days
          newEnd.setDate(newEnd.getDate() + 30);
        }

        await prisma.user_memberships.update({
          where: { id: existing.id },
          data: {
            state: "ACTIVE",
            current_period_end: newEnd,
            updated_at: now,
          },
        });
        break;
      }

      // 3. subscription.halted / subscription.pending -> Set state to PAST_DUE
      case "subscription.halted":
      case "subscription.pending": {
        await prisma.user_memberships.update({
          where: { id: existing.id },
          data: {
            state: "PAST_DUE",
            updated_at: now,
          },
        });
        break;
      }

      // 4. subscription.cancelled -> Set state to CANCELLED
      case "subscription.cancelled": {
        await prisma.user_memberships.update({
          where: { id: existing.id },
          data: {
            state: "CANCELLED",
            cancelled_at: now,
            updated_at: now,
          },
        });
        break;
      }

      // 5. subscription.completed / expired period -> Set state to EXPIRED
      case "subscription.completed": {
        await prisma.user_memberships.update({
          where: { id: existing.id },
          data: {
            state: "EXPIRED",
            updated_at: now,
          },
        });
        break;
      }

      default:
        console.log(`[Razorpay Subscription Webhook] Unhandled event: ${event}`);
    }

    return NextResponse.json({ status: "ok", eventHandled: event });
  } catch (error: any) {
    console.error("[Razorpay Subscription Webhook Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Webhook processing error" },
      { status: 500 }
    );
  }
}
