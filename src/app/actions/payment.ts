"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export interface CreateOrderResult {
  success: boolean;
  order?: {
    id: string;
    amount: number;
    currency: string;
    receipt?: string;
    status?: string;
  };
  keyId?: string;
  user?: {
    id?: string;
    email?: string;
    name?: string;
  };
  error?: string;
}

/**
 * Server Action: Create an official Razorpay Order
 */
export async function createRazorpayOrder(
  courseId: string,
  amountINR: number
): Promise<CreateOrderResult> {
  try {
    const keyId =
      process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error(
        "[createRazorpayOrder] Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in environment"
      );
      throw new Error(
        "Razorpay credentials are not configured on the server. Please check environment variables."
      );
    }

    // Retrieve active logged-in user from Supabase session
    let userId: string | undefined;
    let userEmail: string | undefined;
    let userName: string | undefined;

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
            setAll() {},
          },
        });
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user?.id) {
          userId = user.id;
          userEmail = user.email;
          userName =
            user.user_metadata?.full_name || user.email?.split("@")[0] || "Learner";
        }
      }
    } catch (authErr) {
      console.warn("Could not read auth cookies in createRazorpayOrder:", authErr);
    }

    // Razorpay requires amount in the smallest currency unit (paise for INR)
    const amountInPaise = Math.round(Number(amountINR) * 100);
    const receipt = `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authHeader}`,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt,
        notes: {
          courseId: courseId || "course-1",
          userId: userId || "unauthenticated",
          userEmail: userEmail || "",
        },
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("[Razorpay API Error]:", response.status, responseData);
      throw new Error(
        responseData?.error?.description ||
          `Razorpay order API failed with HTTP ${response.status}`
      );
    }

    return {
      success: true,
      order: {
        id: responseData.id,
        amount: responseData.amount,
        currency: responseData.currency,
        receipt: responseData.receipt,
        status: responseData.status,
      },
      keyId,
      user: {
        id: userId,
        email: userEmail,
        name: userName,
      },
    };
  } catch (error: any) {
    console.error("[createRazorpayOrder server action error]:", error);
    return {
      success: false,
      error: error?.message || "Failed to create Razorpay order",
    };
  }
}
