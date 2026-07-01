// Service worker — Test ITOP PWA
// Cachea los recursos de la app para que funcione sin conexión.
const CACHE = "itop-test-v1";
const RECURSOS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icono-192.png",
  "./icono-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(RECURSOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Estrategia: cache primero, red como respaldo. La app es autocontenida.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request).catch(() => caches.match("./index.html")))
  );
});
