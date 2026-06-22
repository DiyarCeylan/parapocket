const CACHE = 'parapocket-v1';
const BASE = self.location.pathname.slice(0, self.location.pathname.lastIndexOf('/'));
const ASSETS = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/style.css',
  BASE + '/app.js',
  BASE + '/db.js',
  BASE + '/views/dashboard.js',
  BASE + '/views/transactions.js',
  BASE + '/views/add.js',
  BASE + '/views/budgets.js',
  BASE + '/views/settings.js',
  BASE + '/utils/sanitize.js',
  BASE + '/utils/format.js',
  BASE + '/utils/export.js',
  BASE + '/manifest.json',
  BASE + '/icons/icon-192.svg',
  BASE + '/icons/icon-512.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('gc.zgo.at')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
