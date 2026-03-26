const CACHE_NAME = "app-v2";

const urlsToCache = [
  "index.html",
  "style.css",
  "app.js",
  "manifest.json"
];

self.addEventListener("install", event => {
  self.skipWaiting(); // force update
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// Listen for push messages
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { 
    title: "New Activation Request", 
    body: "You have a new request!" 
  };

  const options = {
    body: data.body,
    icon: "./icon.png",   // optional
    badge: "./icon.png",  // optional
    vibrate: [200, 100, 200],
    tag: "activation-notify"
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Handle notification click
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then(windowClients => {
      for (let client of windowClients) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});