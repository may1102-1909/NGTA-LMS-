// NGTA LMS Native Web Push Service Worker
self.addEventListener("install", (event) => {
  // Activate worker immediately
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Become active immediately for all open tabs
  event.waitUntil(self.clients.claim());
});

// Handle incoming push notifications
self.addEventListener("push", (event) => {
  let data = {
    title: "NextGen Academy (NGTA)",
    body: "You have a new learning update in your NGTA LMS account.",
    icon: "/logo.png",
    badge: "/logo.png",
    tag: "ngta-alert",
    url: "/notifications",
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      data = {
        ...data,
        ...payload,
      };
    } catch (e) {
      data.body = event.data.text() || data.body;
    }
  }

  const notificationOptions = {
    body: data.body,
    icon: data.icon || "/logo.png",
    badge: data.badge || "/logo.png",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/notifications",
      timestamp: Date.now(),
    },
    tag: data.tag || "ngta-alert",
    renotify: true,
    actions: data.actions || [
      {
        action: "open",
        title: "View Alert",
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, notificationOptions)
  );
});

// Handle clicking on a notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/notifications";

  event.waitUntil(
    self.clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // If an existing tab is open with the same origin, focus and navigate it
        for (const client of clientList) {
          if ("focus" in client) {
            if (client.url.includes(self.location.origin)) {
              client.focus();
              if ("navigate" in client && urlToOpen) {
                return client.navigate(urlToOpen);
              }
              return client;
            }
          }
        }
        // Otherwise, open a new window
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
  );
});
