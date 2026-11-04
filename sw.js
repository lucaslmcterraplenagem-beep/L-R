const CACHE_NAME = 'lucas-rayssa-v2'; // Mudei a versão do cache
const assets = [
  '/',
  '/index.html',
  '/admin.html',
  '/style.css',
  '/app.js',
  '/admin.js',
  // '/icons/icon-192.png', // REMOVIDO: este arquivo não existe no seu repositório
  '/icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Adiciona cada arquivo individualmente, ignorando erros 404
      return Promise.all(
        assets.map(url => {
          return cache.add(url).catch(err => {
            console.warn('Falha ao cachear (ignorado):', url, err);
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
