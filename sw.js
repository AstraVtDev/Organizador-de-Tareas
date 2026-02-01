const CACHE_NAME = 'Tasky-v2';
const assets = [
  './',
  './index.html',
  './global_tasks.json',
  './manifest.json', // Añadido: Importante para que Android reconozca la PWA offline
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Instalar y guardar en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cacheando archivos principales...');
      return cache.addAll(assets);
    })
  );
  self.skipWaiting(); // Fuerza a la nueva versión a activarse de inmediato
});

// Limpiar cachés antiguas (Para que los cambios se vean rápido)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Responder sin internet
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// --- ESTO ES LO QUE NECESITA ANDROID ---
// Manejar el clic en la notificación
self.addEventListener('notificationclick', event => {
  event.notification.close(); // Cierra la notificación
  event.waitUntil(
    clients.openWindow('./index.html') // Abre Tasky al tocar el aviso
  );
});
