const CACHE_NAME = 'lucas-rayssa-v5';
const assets = [
  './',
  './index.html',
  './admin.html',
  './style.css',
  './app.js',
  './admin.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        assets.map(url => {
          return cache.add(url).catch(err => {
            console.warn('Falha ao cachear (ignorado):', url);
          });
        })
      );
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
