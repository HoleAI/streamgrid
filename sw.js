const CACHE_NAME = 'stream-grid-v1';
const ASSETS = [
  './',
  './index.html',
  './player.html',
  './tutorial.html',
  './index.css',
  './manifest.json',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
