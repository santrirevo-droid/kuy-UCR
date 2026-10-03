"use client";

import { useEffect, useRef, useState } from "react";
import type { House } from "@/lib/housing";
import Icon from "@/components/Icon";

// Peta gabungan semua housing + kampus UCR, ala Google My Maps: pin bernomor
// berwarna per rumah, popup berisi penghuni & tombol telepon, daftar rumah
// yang bisa diklik untuk terbang ke pinnya.
//
// Leaflet dimuat dari CDN (bukan dependency npm) supaya tidak perlu mengubah
// package-lock. Tile peta standar OpenStreetMap (tanpa API key); di tema gelap
// tile-nya diredupkan lewat filter CSS karena OSM tidak punya versi gelap.

const LEAFLET_VERSION = "1.9.4";
const LEAFLET_CSS = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`;
const LEAFLET_JS = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.js`;

const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

type Campus = { name: string; lat: number; lng: number };

/* eslint-disable @typescript-eslint/no-explicit-any */
let leafletPromise: Promise<any> | null = null;

function loadLeaflet(): Promise<any> {
  const w = window as any;
  if (w.L) return Promise.resolve(w.L);
  if (leafletPromise) return leafletPromise;

  leafletPromise = new Promise((resolve, reject) => {
    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = LEAFLET_CSS;
      document.head.appendChild(css);
    }
    const script = document.createElement("script");
    script.src = LEAFLET_JS;
    script.async = true;
    script.onload = () => resolve(w.L);
    script.onerror = () => {
      leafletPromise = null;
      reject(new Error("Gagal memuat Leaflet"));
    };
    document.body.appendChild(script);
  });
  return leafletPromise;
}

const ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

function telHref(phone: string): string {
  return `tel:+1${phone.replace(/\D/g, "")}`;
}

function pinHtml(color: string, label: string): string {
  return `<div class="hm-pin" style="--pin:${color}"><span>${esc(label)}</span></div>`;
}

const PHONE_SVG =
  '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4.5h3.2l1.6 4-2 1.3a10.5 10.5 0 0 0 6.4 6.4l1.3-2 4 1.6V19a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 3.5 6.1 1.5 1.5 0 0 1 5 4.5z"/></svg>';

function popupHtml(h: House, index: number, campus: Campus): string {
  const residents = h.residents
    .map(
      (r) => `<li>
        <span class="hm-name">${esc(r.name)}${r.nickname !== r.name ? ` <em>(${esc(r.nickname)})</em>` : ""}</span>
        ${r.phone ? `<a class="hm-tel" href="${telHref(r.phone)}" title="Telepon ${esc(r.phone)}" aria-label="Telepon ${esc(r.nickname)}">${PHONE_SVG}</a>` : ""}
      </li>`,
    )
    .join("");
  const maps = `https://www.google.com/maps/search/?api=1&query=${h.lat},${h.lng}`;
  const route = `https://www.google.com/maps/dir/?api=1&origin=${h.lat},${h.lng}&destination=${campus.lat},${campus.lng}`;
  return `<div class="hm-pop">
    <p class="hm-eyebrow" style="color:${h.color}">Rumah ${String(index + 1).padStart(2, "0")} · ${h.residents.length} orang</p>
    <p class="hm-title">${esc(h.name)}</p>
    <p class="hm-addr">${esc(h.street)}, ${esc(h.city)}</p>
    <ol class="hm-list">${residents}</ol>
    <div class="hm-actions">
      <a href="${maps}" target="_blank" rel="noreferrer">Google Maps</a>
      <a href="${route}" target="_blank" rel="noreferrer">Rute ke kampus</a>
    </div>
  </div>`;
}

export default function HousingMap({
  houses,
  campus,
  className = "h-[28rem]",
  showList = true,
}: {
  houses: House[];
  campus: Campus;
  className?: string;
  showList?: boolean;
}) {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadLeaflet()
      .then((L) => {
        if (cancelled || !el.current || mapRef.current) return;

        const map = L.map(el.current, { scrollWheelZoom: false, zoomControl: true });
        mapRef.current = map;

        L.tileLayer(TILE_URL, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(map);

        const bounds: [number, number][] = [];

        houses.forEach((h, i) => {
          const marker = L.marker([h.lat, h.lng], {
            icon: L.divIcon({
              className: "",
              html: pinHtml(h.color, String(i + 1)),
              iconSize: [34, 44],
              iconAnchor: [17, 42],
              popupAnchor: [0, -38],
            }),
            title: h.name,
            riseOnHover: true,
          })
            .addTo(map)
            .bindPopup(popupHtml(h, i, campus), { maxWidth: 300, minWidth: 240 })
            .bindTooltip(`${i + 1}. ${h.name}`, { direction: "top", offset: [0, -40] });
          marker.on("popupopen", () => setActive(h.id));
          marker.on("popupclose", () => setActive((cur) => (cur === h.id ? null : cur)));
          markersRef.current[h.id] = marker;
          bounds.push([h.lat, h.lng]);
        });

        L.marker([campus.lat, campus.lng], {
          icon: L.divIcon({
            className: "",
            html: `<div class="hm-campus">UCR</div>`,
            iconSize: [44, 26],
            iconAnchor: [22, 13],
            popupAnchor: [0, -12],
          }),
          title: campus.name,
          zIndexOffset: -100,
        })
          .addTo(map)
          .bindPopup(
            `<div class="hm-pop"><p class="hm-eyebrow">Kampus</p><p class="hm-title">University of California, Riverside</p><p class="hm-addr">${esc(campus.name)} · 900 University Ave, Riverside, CA 92521</p></div>`,
          );
        bounds.push([campus.lat, campus.lng]);

        map.fitBounds(bounds, { padding: [36, 36] });
        // Aktifkan scroll-zoom hanya setelah peta diklik, supaya halaman tetap bisa di-scroll.
        map.once("focus", () => map.scrollWheelZoom.enable());
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, [houses, campus]);

  function focusHouse(h: House) {
    const map = mapRef.current;
    const marker = markersRef.current[h.id];
    if (!map || !marker) return;
    map.flyTo([h.lat, h.lng], 16, { duration: 0.6 });
    map.once("moveend", () => marker.openPopup());
  }

  function showAll() {
    const map = mapRef.current;
    if (!map) return;
    map.closePopup();
    const pts = houses.map((h) => [h.lat, h.lng]).concat([[campus.lat, campus.lng]]);
    map.flyToBounds(pts, { padding: [36, 36], duration: 0.6 });
  }

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface">
      <style>{mapCss}</style>
      <div className="relative">
        <div ref={el} className={`z-0 w-full ${className}`} aria-label="Peta lokasi semua housing" />
        {status !== "ready" && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-2 text-sm text-ink-muted">
            {status === "loading" ? "Memuat peta…" : "Peta gagal dimuat — periksa koneksi internet lalu muat ulang."}
          </div>
        )}
      </div>

      {showList && (
        <div className="border-t border-line">
          <div className="flex items-center justify-between gap-3 px-4 pt-3">
            <span className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-ink-subtle">
              Klik untuk lihat di peta
            </span>
            <button onClick={showAll} className="text-xs font-semibold text-brand hover:underline">
              Tampilkan semua
            </button>
          </div>
          <ul className="grid gap-1 p-2 sm:grid-cols-2">
            {houses.map((h, i) => (
              <li key={h.id}>
                <button
                  onClick={() => focusHouse(h)}
                  className={`flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left transition hover:bg-surface-2 ${
                    active === h.id ? "bg-surface-2" : ""
                  }`}
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ background: h.color }}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">{h.name}</span>
                    <span className="block truncate text-xs text-ink-muted">
                      {h.street} · {h.residents.length} orang
                    </span>
                  </span>
                  <Icon name="map-pin" className="h-4 w-4 shrink-0 text-ink-subtle" />
                </button>
              </li>
            ))}
            <li className="flex items-center gap-3 px-2.5 py-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gold text-[0.55rem] font-bold text-white">
                UCR
              </span>
              <span className="text-xs text-ink-muted">Kampus UC Riverside (Bell Tower)</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

const mapCss = `
.hm-pin{width:34px;height:44px;position:relative;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))}
.hm-pin::before{content:"";position:absolute;left:3px;top:2px;width:28px;height:28px;background:var(--pin);border:2.5px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);transform-origin:center}
.hm-pin span{position:absolute;left:0;top:6px;width:34px;text-align:center;color:#fff;font:700 13px/20px Inter,system-ui,sans-serif}
.hm-campus{display:flex;align-items:center;justify-content:center;width:44px;height:26px;border-radius:6px;background:rgb(var(--c-gold));color:#fff;border:2px solid #fff;font:800 11px/1 Inter,system-ui,sans-serif;letter-spacing:.06em;box-shadow:0 2px 4px rgba(0,0,0,.3)}
.leaflet-container{font-family:Inter,system-ui,sans-serif;background:rgb(var(--c-surface-2))}
.dark .leaflet-tile-pane{filter:invert(1) hue-rotate(180deg) brightness(.95) contrast(.9) saturate(.6)}
.leaflet-popup-content{margin:14px 16px}
.hm-pop p{margin:0}
.hm-eyebrow{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#8a6d2b}
.hm-title{margin-top:2px!important;font-size:15px;font-weight:700;color:#111}
.hm-addr{margin-top:2px!important;font-size:12px;color:#555}
.hm-list{margin:10px 0 0;padding:0;list-style:none;border-top:1px solid #eee}
.hm-list li{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:5px 0;border-bottom:1px solid #eee;font-size:12.5px;color:#222}
.hm-list em{color:#888;font-style:normal}
.hm-tel{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;flex-shrink:0;border-radius:999px;background:#e4f1eb;color:#1e674a!important}
.hm-tel:hover{background:#1e674a;color:#fff!important}
.hm-actions{display:flex;gap:6px;margin-top:10px}
.hm-actions a{flex:1;text-align:center;padding:6px 8px;border-radius:6px;font-size:12px;font-weight:600;text-decoration:none;border:1px solid #d4d4d4;color:#1b3a5c!important}
.hm-actions a:first-child{background:#1b3a5c;border-color:#1b3a5c;color:#fff!important}
`;
