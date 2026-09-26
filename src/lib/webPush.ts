import webpush from "web-push";

export const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  "BNGrgQ1Mc3mKEoT1ImaeOMkJQXiR1cpLlGBOGK4mA0XkbF3RW-YXDN1TuJY05VKIfKQRf_60QwzUaGcJAagCrh4";

export const VAPID_PRIVATE_KEY =
  process.env.VAPID_PRIVATE_KEY ||
  "YmfqDrHR9NDtTPOm867dz93zV917DdWuUWCzQ4FzeBI";

export const VAPID_SUBJECT =
  process.env.VAPID_SUBJECT || "mailto:admin@ngtalms.com";

// Configure web-push with VAPID details
if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  try {
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  } catch (err) {
    console.error("Failed to initialize webpush VAPID details:", err);
  }
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  tag?: string;
  actions?: Array<{ action: string; title: string }>;
}

export interface StoredSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

/**
 * Send a web push notification to a specific client subscription
 */
export async function sendWebPush(
  subscription: StoredSubscription,
  payload: PushNotificationPayload
) {
  try {
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    };

    const payloadString = JSON.stringify(payload);
    const result = await webpush.sendNotification(
      pushSubscription,
      payloadString,
      {
        TTL: 60 * 60 * 24, // 24 hours
      }
    );

    return { success: true, result };
  } catch (error: any) {
    console.error("Error sending web push notification:", error);
    // If subscription is 410 (Gone) or 404 (Not Found), it has expired
    const isExpired = error.statusCode === 410 || error.statusCode === 404;
    return { success: false, error: error.message, isExpired };
  }
}

/**
 * Utility function to convert a base64 string to a Uint8Array
 * Required for subscribing via window.Notification / PushManager
 */
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
