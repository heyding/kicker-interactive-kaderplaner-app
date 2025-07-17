const CACHE_NAME = 'kicker-app-v1';
const urlsToCache = [
  '/',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/index.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch Strategy: Network First, then Cache
self.addEventListener('fetch', (event) => {
  // API-Calls: Network First mit Cache Fallback
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone response für Cache
          const responseClone = response.clone();
          
          // Nur erfolgreiche Responses cachen
          if (response.status === 200) {
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseClone);
              });
          }
          
          return response;
        })
        .catch(() => {
          // Fallback zu Cache bei Netzwerkfehler
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                console.log('Service Worker: Serving from cache (offline)', event.request.url);
                return cachedResponse;
              }
              
              // Offline-Fallback für API-Calls
              return new Response(
                JSON.stringify({ error: 'Offline - keine Daten verfügbar' }),
                {
                  status: 503,
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            });
        })
    );
  }
  // Statische Assets: Cache First
  else {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          // Return cached version or fetch from network
          return cachedResponse || fetch(event.request);
        })
    );
  }
});

// Background Sync für Offline-Aktionen (optional)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Hier könnten offline-Aktionen synchronisiert werden
      console.log('Background Sync triggered')
    );
  }
});

// Push Notifications (optional für Updates)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Neue Daten verfügbar',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('Kicker App', options)
  );
});
