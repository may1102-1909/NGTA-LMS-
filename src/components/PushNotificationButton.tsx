"use client";

import React, { useState, useEffect } from "react";
import { Bell, BellOff, BellRing, Check, Loader2, Send } from "lucide-react";
import { urlBase64ToUint8Array, VAPID_PUBLIC_KEY } from "@/lib/webPushClient";
import { supabase } from "@/lib/supabaseClient";

interface PushNotificationButtonProps {
  className?: string;
  showTestButton?: boolean;
}

export default function PushNotificationButton({
  className = "",
  showTestButton = true,
}: PushNotificationButtonProps) {
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [permission, setPermission] = useState<NotificationPermission | "unknown">("unknown");
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [testing, setTesting] = useState<boolean>(false);

  useEffect(() => {
    async function checkSubscription() {
      try {
        if (
          typeof window === "undefined" ||
          !("serviceWorker" in navigator) ||
          !("PushManager" in window) ||
          !("Notification" in window)
        ) {
          setIsSupported(false);
          setLoading(false);
          return;
        }

        setIsSupported(true);
        setPermission(Notification.permission);

        // Register Service Worker
        const registration = await navigator.serviceWorker.register("/sw.js");
        await navigator.serviceWorker.ready;

        const subscription = await registration.pushManager.getSubscription();
        if (subscription && Notification.permission === "granted") {
          setIsSubscribed(true);
        } else {
          setIsSubscribed(false);
        }
      } catch (err) {
        console.error("Error inspecting push notification status:", err);
      } finally {
        setLoading(false);
      }
    }

    checkSubscription();
  }, []);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      setStatusMessage(null);

      if (!isSupported) {
        setStatusMessage("Web Push is not supported in this browser.");
        return;
      }

      // 1. Request Browser Permission
      const requestedPermission = await Notification.requestPermission();
      setPermission(requestedPermission);

      if (requestedPermission !== "granted") {
        setStatusMessage("Notification permission was denied in your browser.");
        return;
      }

      // 2. Wait for Service Worker registration
      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      // 3. Subscribe with PushManager
      const convertedVapidKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey as unknown as BufferSource,
      });

      const subJson = subscription.toJSON();
      if (!subJson.endpoint || !subJson.keys?.p256dh || !subJson.keys?.auth) {
        throw new Error("Unable to retrieve complete push subscription keys.");
      }

      // 4. Retrieve logged-in user details if available
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // 5. Save subscription endpoint and keys into Supabase via Prisma API route
      const res = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: {
            endpoint: subJson.endpoint,
            keys: {
              p256dh: subJson.keys.p256dh,
              auth: subJson.keys.auth,
            },
          },
          userId: user?.id,
          userEmail: user?.email,
          userName: user?.user_metadata?.full_name || user?.user_metadata?.name,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to persist push subscription.");
      }

      setIsSubscribed(true);
      setStatusMessage("Push alerts enabled successfully!");
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err: any) {
      console.error("Subscription process error:", err);
      setStatusMessage(err.message || "Failed to enable notifications.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      setLoading(true);
      setStatusMessage(null);

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        const endpoint = subscription.endpoint;
        await subscription.unsubscribe();

        // Remove from database via Prisma API
        const {
          data: { user },
        } = await supabase.auth.getUser();

        await fetch("/api/notifications/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            endpoint,
            userId: user?.id,
          }),
        });
      }

      setIsSubscribed(false);
      setStatusMessage("Push notifications disabled.");
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error("Error unsubscribing:", err);
      setStatusMessage("Failed to unsubscribe.");
    } finally {
      setLoading(false);
    }
  };

  const handleTestAlert = async () => {
    try {
      setTesting(true);
      setStatusMessage(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const res = await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          title: "NGTA LMS Alert ⚡",
          body: "Push notification system is working! You will receive live updates here.",
          url: "/notifications",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage("Test push alert sent to your device!");
      } else {
        setStatusMessage(data.message || "Could not trigger test alert.");
      }
      setTimeout(() => setStatusMessage(null), 6000);
    } catch (err: any) {
      console.error("Error testing push alert:", err);
      setStatusMessage("Error sending test push.");
    } finally {
      setTesting(false);
    }
  };

  if (!isSupported) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 border border-[#3E3E43] bg-[#28282B] text-[#5A5F70] font-mono text-xs ${className}`}>
        <BellOff className="w-3.5 h-3.5 text-zinc-500" />
        <span>Push Notifications Unsupported</span>
      </div>
    );
  }

  if (permission === "denied") {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 border border-red-500/30 bg-red-950/20 text-red-400 font-mono text-xs ${className}`}>
        <BellOff className="w-3.5 h-3.5" />
        <span>Push Blocked (Enable in Browser Settings)</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-wrap items-center gap-2.5 font-mono text-xs ${className}`}>
      {isSubscribed ? (
        <div className="flex items-center gap-2">
          <button
            onClick={handleUnsubscribe}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 border border-emerald-500/40 bg-emerald-950/20 text-emerald-400 hover:border-red-500/40 hover:text-red-400 hover:bg-red-950/20 transition-all font-bold group"
            title="Click to disable push notifications"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <BellRing className="w-3.5 h-3.5 group-hover:hidden text-emerald-400" />
                <BellOff className="w-3.5 h-3.5 hidden group-hover:inline text-red-400" />
              </>
            )}
            <span className="group-hover:hidden">Push Active</span>
            <span className="hidden group-hover:inline">Unsubscribe</span>
          </button>

          {showTestButton && (
            <button
              onClick={handleTestAlert}
              disabled={testing}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#3E3E43] bg-[#333336] text-[#EFFF4F] hover:bg-[#3E3E43] hover:border-[#EFFF4F]/50 transition-colors font-bold uppercase shadow-lemon-sm"
              title="Send a sample test notification now"
            >
              {testing ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Send className="w-3 h-3" />
              )}
              <span>Send Test Alert</span>
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 border border-[#EFFF4F] bg-[#EFFF4F] text-[#28282B] hover:bg-[#EFFF4F]/90 transition-all font-bold uppercase shadow-lemon-sm hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#28282B]" />
          ) : (
            <Bell className="w-3.5 h-3.5 text-[#28282B]" />
          )}
          <span>Enable Web Push Alerts</span>
        </button>
      )}

      {statusMessage && (
        <span className="text-[11px] text-[#A0A5B5] animate-in fade-in flex items-center gap-1">
          {statusMessage.includes("success") || statusMessage.includes("sent") ? (
            <Check className="w-3 h-3 text-emerald-400" />
          ) : null}
          {statusMessage}
        </span>
      )}
    </div>
  );
}
