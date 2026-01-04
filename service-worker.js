const CACHE_NAME = 'automata-studio-v1';
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
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
