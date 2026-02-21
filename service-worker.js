const CACHE_NAME = 'automata-studio-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
  // Add other CSS or JS files here if you want them to work offline
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  // Keep HTML fresh to avoid stale splash logic after deployments.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
