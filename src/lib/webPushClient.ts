export const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  "BNGrgQ1Mc3mKEoT1ImaeOMkJQXiR1cpLlGBOGK4mA0XkbF3RW-YXDN1TuJY05VKIfKQRf_60QwzUaGcJAagCrh4";

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
