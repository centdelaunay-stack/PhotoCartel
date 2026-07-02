const CACHE_NAME = "photocartel-v17-4";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // PWA minimale : on laisse le réseau répondre.
  return;
});