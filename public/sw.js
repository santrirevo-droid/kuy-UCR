// Service worker minimal untuk PWA "Kuy, UCR!".
//
// Tujuan utama: memenuhi syarat installability (Chrome/Android perlu SW
// terdaftar dengan fetch handler) + fallback offline sederhana. Sengaja
// TIDAK cache halaman atau /api/* yang datanya dinamis (progress, checklist
// pribadi, konten dari GitHub) — supaya user selalu lihat data terbaru
// selama masih online. Cache cuma dipakai sebagai fallback kalau jaringan
// benar-benar mati.

const CACHE_VERSION = "kuyucr-v1";
const OFFLINE_URL = "/offline";
const PRECACHE_URLS = [OFFLINE_URL, "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Jangan sentuh API sama sekali — selalu lewat network, data harus selalu fresh.
  if (url.pathname.startsWith("/api/")) return;

  // Navigasi halaman: coba network dulu, fallback ke halaman offline kalau
  // benar-benar tidak ada koneksi.
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
    return;
  }

  // Aset statis Next.js (hashed, aman di-cache lama) & ikon: cache-first,
  // lalu update cache di background.
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
            return res;
          })
      )
    );
  }
});
