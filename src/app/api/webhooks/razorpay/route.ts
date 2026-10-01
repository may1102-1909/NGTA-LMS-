import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

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
        console.error("[Razorpay Webhook] Invalid webhook signature detected!");
        return NextResponse.json(
          { error: "Invalid webhook signature" },
          { status: 400 }
        );
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    console.log(`[Razorpay Webhook] Processing event: ${event}`);

    // BRD Section 44 Acceptance: On successful payment (order.paid / payment.captured), insert into enrollments
    if (event === "order.paid" || event === "payment.captured") {
      const paymentEntity = payload.payload?.payment?.entity || {};
      const orderEntity = payload.payload?.order?.entity || {};

      const notes = {
        ...orderEntity.notes,
        ...paymentEntity.notes,
      };

      const courseId = notes.courseId || "course-1";
      const userId = notes.userId;
      const userEmail = notes.userEmail || paymentEntity.email || "";
      const userName = notes.userName || "Learner";
      const amount = paymentEntity.amount ? paymentEntity.amount / 100 : 1999;
      const transactionId =
        paymentEntity.id ||
        orderEntity.id ||
        `TXN-WH-${Date.now()}`;

      if (userId && userId !== "unauthenticated") {
        // 1. Ensure profile exists for foreign key constraint
        try {
          const profile = await prisma.profiles.findUnique({
            where: { id: userId },
          });

          if (!profile) {
            await prisma.profiles.create({
              data: {
                id: userId,
                email: userEmail || `${userId}@ngta.in`,
                full_name: userName,
              },
            });
          }
        } catch (profErr) {
          console.warn("[Razorpay Webhook] Profile ensure warning:", profErr);
        }

        // 2. Insert or update payments record
        try {
          await prisma.payments.upsert({
            where: { transaction_id: transactionId },
            update: { status: "SUCCESS" },
            create: {
              user_id: userId,
              course_id: courseId,
              amount: amount,
              currency: paymentEntity.currency || "INR",
              status: "SUCCESS",
              transaction_id: transactionId,
            },
          });
        } catch (payErr) {
          console.warn("[Razorpay Webhook] Payment upsert warning:", payErr);
        }

        // 3. Automatically insert or activate record in enrollments table
        const enrollment = await prisma.enrollments.upsert({
          where: {
            user_id_course_id: {
              user_id: userId,
              course_id: courseId,
            },
          },
          update: {
            status: "ACTIVE",
          },
          create: {
            user_id: userId,
            course_id: courseId,
            completed_modules: 0,
            total_modules: 10,
            status: "ACTIVE",
          },
        });

        // 4. Record user activity
        try {
          await prisma.user_activities.create({
            data: {
              user_id: userId,
              action_type: "PAYMENT_WEBHOOK_PROCESSED",
              metadata: {
                event,
                courseId,
                amount,
                transactionId,
                enrollmentId: enrollment.id,
              },
            },
          });
        } catch (actErr) {
          console.warn("[Razorpay Webhook] Activity log warning:", actErr);
        }

        console.log(
          `[Razorpay Webhook] Successfully enrolled user ${userId} in ${courseId}`
        );
      } else {
        console.warn(
          "[Razorpay Webhook] Received paid event without valid userId in notes"
        );
      }
    }

    return NextResponse.json({ status: "ok", received: true });
  } catch (error: any) {
    console.error("[Razorpay Webhook Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Webhook processing error" },
      { status: 500 }
    );
  }
}
