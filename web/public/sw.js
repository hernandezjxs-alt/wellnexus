// Service worker de Wellnexus: red primero; si no hay conexión, usa lo guardado.
const CACHE = "wellnexus-v1";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.method !== "GET" || !r.url.startsWith(self.location.origin) || r.url.includes("supabase.co")) return;
  e.respondWith(
    fetch(r).then((res) => { const c = res.clone(); caches.open(CACHE).then((x) => x.put(r, c)); return res; }).catch(() => caches.match(r)),
  );
});
