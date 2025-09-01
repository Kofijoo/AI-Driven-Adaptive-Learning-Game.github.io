const CACHE_NAME = 'virtual-reality-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/index.js',
  '/src/services/AIService.js',
  '/src/characters/CharacterManager.js',
  '/src/utils/ErrorHandler.js',
  '/src/utils/Config.js',
  'https://cdn.babylonjs.com/babylon.js'
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
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});