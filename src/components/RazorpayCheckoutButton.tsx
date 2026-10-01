"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { createRazorpayOrder } from "@/app/actions/payment";
import { Loader2, Lock, ArrowRight } from "lucide-react";

interface RazorpayCheckoutButtonProps {
  courseId: string;
  courseTitle: string;
  amountINR: number;
  className?: string;
  buttonText?: string;
  onSuccess?: (payment: any) => void;
  children?: React.ReactNode;
}

/**
 * Dynamically load Razorpay checkout script if not already available in the browser window
 */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    // Check if the script tag is already in the document
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      if ((window as any).Razorpay) {
        resolve(true);
      } else {
        existingScript.addEventListener("load", () => resolve(true));
        existingScript.addEventListener("error", () => resolve(false));
      }
      return;
    }

    // Create and inject the checkout.js script tag
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay checkout.js script from CDN");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export default function RazorpayCheckoutButton({
  courseId,
  courseTitle,
  amountINR,
  className,
  buttonText,
  onSuccess,
  children,
}: RazorpayCheckoutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      // 1. Ensure user is logged in via Supabase Auth
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      let currentUser: any = null;

      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user?.id) {
          // Redirect to login if user is not signed in
          await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: `${window.location.origin}/auth/callback?next=/courses`,
            },
          });
          setIsLoading(false);
          return;
        }

        currentUser = user;
      }

      // 2. Wrap order creation in a try-catch block and console.log server action errors
      let orderResult: any = null;
      try {
        orderResult = await createRazorpayOrder(courseId, amountINR);

        if (!orderResult.success || !orderResult.order) {
          // Log server action error to console for direct browser inspection
          console.log("[Server Action Error in createRazorpayOrder]:", orderResult.error);
          throw new Error(
            orderResult.error || "Order creation failed on payment server action"
          );
        }
      } catch (serverActionErr: any) {
        // Explicitly console.log server action errors for browser console inspection
        console.log("Server action order creation error:", serverActionErr);
        throw serverActionErr;
      }

      const { order, keyId, user: orderUser } = orderResult;

      // 3. Dynamically load https://checkout.razorpay.com/v1/checkout.js if window.Razorpay is undefined
      if (!(window as any).Razorpay) {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded || !(window as any).Razorpay) {
          throw new Error(
            "Razorpay SDK could not be loaded. Please disable ad-blockers and try again."
          );
        }
      }

      // 4. Configure Razorpay checkout options
      const options = {
        key:
          keyId ||
          process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
          "rzp_live_TiIebP1ZAanglw",
        amount: order.amount,
        currency: order.currency || "INR",
        name: "NextGen Testing Academy",
        description: courseTitle || "Course Enrollment",
        image: "/logo.png",
        order_id: order.id,
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          try {
            // Verify payment and update database enrollment
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                courseId,
                amount: amountINR,
                userId: currentUser?.id || orderUser?.id,
                userEmail: currentUser?.email || orderUser?.email,
                userName:
                  currentUser?.user_metadata?.full_name ||
                  orderUser?.name ||
                  "Learner",
                transactionId: response.razorpay_payment_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                status: "SUCCESS",
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
              throw new Error(
                verifyData.error || "Payment verification failed on server"
              );
            }

            if (onSuccess) {
              onSuccess(verifyData.payment);
            }

            router.refresh();
            router.push(`/learn/${courseId}`);
          } catch (verifyErr: any) {
            console.error("Error verifying payment signature:", verifyErr);
            alert(
              `Payment received (${response.razorpay_payment_id}), but enrollment confirmation failed: ${verifyErr.message}`
            );
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name:
            currentUser?.user_metadata?.full_name ||
            orderUser?.name ||
            "",
          email: currentUser?.email || orderUser?.email || "",
          contact: currentUser?.phone || "",
        },
        notes: {
          courseId,
          userId: currentUser?.id || orderUser?.id || "",
        },
        theme: {
          color: "#8B5CF6", // Rune Realms electric purple
        },
        modal: {
          ondismiss: function () {
            console.log("Razorpay checkout modal dismissed by user");
            setIsLoading(false);
          },
        },
      };

      // 5. Trigger new (window as any).Razorpay(options).open()
      const rzpInstance = new (window as any).Razorpay(options);

      rzpInstance.on("payment.failed", function (failResponse: any) {
        console.error("Razorpay Payment Failed:", failResponse.error);
        alert(
          failResponse.error?.description ||
            "Payment failed. Please try a different card or UPI ID."
        );
        setIsLoading(false);
      });

      rzpInstance.open();
    } catch (err: any) {
      console.log("Checkout flow encountered an error:", err);
      alert(err?.message || "Failed to launch Razorpay checkout.");
      setIsLoading(false);
    }
  };

  if (children) {
    return (
      <div onClick={handleCheckout} className="inline-block cursor-pointer">
        {children}
      </div>
    );
  }

  const defaultClasses =
    "px-4 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white font-mono text-xs uppercase font-bold hover:brightness-110 transition-all rounded-lg flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.4)] disabled:opacity-50 cursor-pointer";

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={isLoading}
      className={className || defaultClasses}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>INITIALIZING GATEWAY...</span>
        </>
      ) : (
        <>
          <Lock className="w-3.5 h-3.5" />
          <span>
            {buttonText || `ENROLL NOW - ₹${amountINR.toLocaleString()}`}
          </span>
          <ArrowRight className="w-3.5 h-3.5" />
        </>
      )}
    </button>
  );
}
