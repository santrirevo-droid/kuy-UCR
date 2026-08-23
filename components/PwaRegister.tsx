"use client";

import { useEffect } from "react";

// Daftarin service worker cuma di production build — di `next dev` service
// worker gampang bentrok sama HMR (aset ke-cache stale, terasa kayak
// perubahan gak muncul), jadi sengaja dilewatin.
export default function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Gagal daftar SW bukan fatal — web tetap jalan normal, cuma tanpa
      // fallback offline & mungkin prompt install-nya gak muncul.
    });
  }, []);

  return null;
}
