const CACHE_NAME = 'Turpialy-V4'; // Subimos a v3 para forzar la actualización
const assets = [
  './',
  './index.html',
  './global_tasks.json',
  './manifest.json',
  './logo.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Instalar y guardar en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Tasky: Cacheando archivos...');
      return cache.addAll(assets);
    })
  );
  self.skipWaiting();
});

// Limpiar cachés antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  return self.clients.claim();
});

// Responder sin internet
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Manejar el clic en la notificación
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Si la app ya está abierta, ponle el foco
      for (let client of windowClients) {
        if (client.url === '/' && 'focus' in client) return client.focus();
      }
      // Si no, ábrela
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});

// --- FUNCIÓN PARA REVISIÓN EN SEGUNDO PLANO ---
self.addEventListener('periodicsync', event => {
  if (event.tag === 'revisar-tareas') {
    // Nota: El Service Worker no puede leer el localStorage directamente,
    // pero al despertar, el index.html se cargará y ejecutará chequearTareas()
    console.log('Turpialy: Ejecutando revisión en segundo plano...');
  }
});
