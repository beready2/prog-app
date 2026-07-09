const CACHE = 'mma-sport-v6';

// Cache the actual files used by the app
const ASSETS = [
  './',
  './index2.html',
  './index.html',
  './sport-pwa-manifest.json',
  './sport-pwa-sw.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled(ASSETS.map(a => cache.add(a)))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // Never cache external API calls (Firebase, etc.) - let them fail gracefully offline
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() =>
        caches.match(e.request).then(cached => {
          if (cached) return cached;
          // For navigation requests offline, serve the app shell
          if (e.request.mode === 'navigate') {
            return caches.match('./index2.html')
              .then(r => r || caches.match('./index.html'))
              .then(r => r || caches.match('./'));
          }
          return new Response('', { status: 503 });
        })
      )
  );
});
