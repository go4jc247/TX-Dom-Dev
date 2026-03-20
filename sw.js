// ============================================================
// TX-Dom-Dev Service Worker
// Version: v13.0.1 — MyClaude / Claude Code build
// UPDATE CACHE_NAME every release to bust old caches
// ============================================================

const CACHE_NAME = 'tx-dom-v13.0.1';
const urlsToCache = ['./index.html', './sw.js'];

// Install — cache core files
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate — delete any old caches from previous versions
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch — network first, fall back to cache
// This ensures users always get the latest version when online
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(r => {
        const rc = r.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, rc));
        return r;
      })
      .catch(() => caches.match(e.request))
  );
});
