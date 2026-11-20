/* Offline cache for Hashem Chess Puzzle 1.7.1. A new version replaces the old cache. */
var CACHE = 'hcp-1.7.1', FILES = ["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png","engine/COPYING.txt","engine/engine.json","engine/stockfish-19-lite-single.js","engine/stockfish-19-lite-single.wasm"];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   // Lichess and WhatsApp go to the network as usual
  // the page itself: network first so updates arrive, cache when offline; everything else: cache first
  if (e.request.mode === 'navigate') { e.respondWith(fetch(e.request).then(function (r) { var cp = r.clone(); caches.open(CACHE).then(function (c) { c.put('./', cp); }); return r; }).catch(function () { return caches.match('./'); })); return; }
  e.respondWith(caches.match(e.request).then(function (hit) { return hit || fetch(e.request); }));
});
