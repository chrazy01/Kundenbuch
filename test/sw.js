// Offline-Speicher für die App-Dateien. Daten selbst speichert Firebase separat auf dem Gerät.
// Bei jeder neuen Version die Nummer erhöhen, damit Geräte die neuen Dateien laden.
const CACHE = "kundenbuch-test-1794229689";
const FILES = ["./", "./index.html", "./fb.js", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png", "./apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Eigene Dateien: zuerst aus dem Netz (damit Updates ankommen), ohne Netz aus dem Speicher
  if (url.origin === self.location.origin) {
    e.respondWith(
      fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })
        .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match("./index.html")))
    );
    return;
  }
  // Schriften von Google: einmal laden, dann aus dem Speicher
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })));
  }
  // Alles andere (Firebase-Login, Datenbank) läuft direkt, ohne Zwischenspeicher
});
