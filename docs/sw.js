const CACHE_NAME = 'roamless-notes-v1'
const BASE = '/roamless-notes/'
const APP_SHELL = [BASE, `${BASE}index.html`, `${BASE}manifest.webmanifest`]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached
      }

      return fetch(event.request)
        .then((response) => {
          const copy = response.clone()

          if (
            response.ok &&
            event.request.url.startsWith(self.location.origin)
          ) {
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, copy))
          }

          return response
        })
        .catch(() => caches.match(`${BASE}index.html`))
    }),
  )
})
