const CACHE_NAME = "sd-v2";
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/about.html",
  "/services.html",
  "/pricing.html",
  "/faq.html",
  "/contact.html",
  "/assets/style.css",
  "/assets/site.js",
  "/assets/nav.js",
  "/assets/faq-tabs.js",
  "/assets/contact-form.v1.js",
  "/assets/images/simon-600.webp",
  "/assets/images/simon-600.jpg",
  "/assets/images/simon.webp",
  "/assets/images/simon.jpg",
  "/assets/images/janine.webp",
  "/assets/images/janine.png",
  "/assets/images/Consultation-96.webp",
  "/assets/images/Consultation-192.webp",
  "/assets/images/Consultation-96.png",
  "/assets/images/Consultation-192.png",
  "/assets/images/Fitting-96.webp",
  "/assets/images/Fitting-192.webp",
  "/assets/images/Fitting-96.png",
  "/assets/images/Fitting-192.png",
  "/assets/images/Adjustments-96.webp",
  "/assets/images/Adjustments-192.webp",
  "/assets/images/Adjustments-96.png",
  "/assets/images/Adjustments-192.png",
  "/assets/images/logo-circle-56.webp",
  "/assets/images/logo-circle-112.webp",
  "/assets/images/logo-circle-56.png",
  "/assets/images/logo-circle-112.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch(() => Promise.resolve())
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("/index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }

          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match("/index.html"));
    })
  );
});
