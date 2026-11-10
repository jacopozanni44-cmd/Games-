const CACHE = "trivia-duel-2026-11-10g";
const ASSETS = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  const same = u.origin === location.origin;
  const statics = /^(fonts\.googleapis\.com|fonts\.gstatic\.com|www\.gstatic\.com)$/.test(u.hostname);
  if (!same && !statics) return;
  const keep = res => { if (res.ok || res.type === "opaque") { const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); } return res; };
  if (same) {
    e.respondWith(fetch(e.request, { cache: "no-cache" }).then(keep).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match("index.html"))));
  } else {
    e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request).then(keep)));
  }
});
