const CACHE_NAME = "Ruhama-v2"; // ስሪቱን ወደ v2 ቀይረነዋል
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json", // ማኒፌስቱ ካሽ መደረግ አለበት
  "/logo192.png", // ዋናው አይኮን ካሽ መደረግ አለበት
  "/favicon.ico",
  "/screenshot-mobile.png",
  "/screenshot-desktop.png",
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch Event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // ካሽ ውስጥ ካለ እሱን ስጠው፣ ካልሆነ ከኔትወርክ አምጣ
      return response || fetch(event.request);
    })
  );
});

// Activate Event (አሮጌ ካሽ እንዲጠፋ)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
