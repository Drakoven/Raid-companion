const CACHE_NAME = "raid-companion-cache-v2";

// Tous les assets mis en cache à l'installation (offline garanti dès le premier chargement)
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/manifest.json",

  // Assets visuels
  "/assets/background.png",
  "/assets/icon-192.png",
  "/assets/icon-512.png",

  // Core JS
  "/js/state.js",
  "/js/api.js",
  "/js/nav.js",
  "/js/search.js",

  // Features JS
  "/js/maps.js",
  "/js/quests.js",
  "/js/items.js",
  "/js/hideout.js",
  "/js/traders.js",
  "/js/ammo.js",
  "/js/favorites.js",
  "/js/storyline.js",
  "/js/home.js",
  "/js/bosses.js",
  "/js/achievements.js",

  // Markers
  "/js/markers/woods.js",
  "/js/markers/customs.js",
  "/js/markers/factory.js",
  "/js/markers/shoreline.js",
  "/js/markers/groundzero.js",
  "/js/markers/labs.js",
  "/js/markers/interchange.js",
  "/js/markers/reserve.js",
  "/js/markers/streets.js",
  "/js/markers/lighthouse.js"
];

/* =========================
   INSTALLATION
   Pré-cache tous les assets statiques
========================= */

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );

  // Force l'activation immédiate sans attendre la fermeture des onglets
  self.skipWaiting();
});

/* =========================
   ACTIVATION
   Supprime les anciens caches (versions précédentes du SW)
========================= */

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );

  // Prend le contrôle de tous les onglets ouverts immédiatement
  self.clients.claim();
});

/* =========================
   FETCH — Stratégies par type de ressource

   - API tarkov.dev  → Network-only (données live, gérées par localStorage + TTL côté app)
   - Tout le reste   → Stale-while-revalidate
     Réponse immédiate depuis le cache, mise à jour en arrière-plan
========================= */

self.addEventListener("fetch", event => {
  const { request } = event;
  const url = new URL(request.url);

  // On ignore les requêtes non-GET et les extensions navigateur
  if (request.method !== "GET") return;
  if (!url.protocol.startsWith("http")) return;

  // API Tarkov — réseau uniquement, pas de cache SW
  if (url.hostname === "api.tarkov.dev") {
    event.respondWith(fetch(request));
    return;
  }

  // Tout le reste — Stale-while-revalidate
  event.respondWith(staleWhileRevalidate(request));
});

/* =========================
   STRATÉGIE : Stale-while-revalidate
   Répond depuis le cache immédiatement,
   met à jour le cache en arrière-plan
========================= */

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  // Mise à jour en arrière-plan (sans bloquer la réponse)
  const networkFetch = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => null);

  // Si on a un cache : réponse immédiate, mise à jour en arrière-plan
  if (cached) return cached;

  // Pas de cache : on attend le réseau
  return networkFetch || new Response("Offline — resource unavailable.", {
    status: 503,
    headers: { "Content-Type": "text/plain" }
  });
}
