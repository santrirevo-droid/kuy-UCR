import { NextResponse } from "next/server";

// Kurs USD→IDR untuk kalkulator /dana-lpdp. Google tidak punya API kurs
// publik, jadi dipakai kuotasi pasar Yahoo Finance (USDIDR=X, hampir
// realtime — angkanya setara yang tampil di Google), dengan cadangan
// open.er-api.com (update harian). Respons di-cache 10 menit.

export const revalidate = 600;

type Kurs = { rate: number; source: string; updatedAt: string };

async function fromYahoo(): Promise<Kurs> {
  const res = await fetch("https://query1.finance.yahoo.com/v8/finance/chart/USDIDR=X?interval=1d&range=1d", {
    headers: { "User-Agent": "Mozilla/5.0" },
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`yahoo ${res.status}`);
  const meta = (await res.json())?.chart?.result?.[0]?.meta;
  const rate = Number(meta?.regularMarketPrice);
  if (!Number.isFinite(rate) || rate <= 0) throw new Error("yahoo: kurs tidak valid");
  return {
    rate,
    source: "Yahoo Finance",
    updatedAt: new Date(Number(meta.regularMarketTime) * 1000).toISOString(),
  };
}

async function fromErApi(): Promise<Kurs> {
  const res = await fetch("https://open.er-api.com/v6/latest/USD", { next: { revalidate } });
  if (!res.ok) throw new Error(`er-api ${res.status}`);
  const data = await res.json();
  const rate = Number(data?.rates?.IDR);
  if (!Number.isFinite(rate) || rate <= 0) throw new Error("er-api: kurs tidak valid");
  return { rate, source: "ExchangeRate-API", updatedAt: new Date(Number(data.time_last_update_unix) * 1000).toISOString() };
}

export async function GET() {
  for (const get of [fromYahoo, fromErApi]) {
    try {
      return NextResponse.json(await get());
    } catch {
      // coba sumber berikutnya
    }
  }
  return NextResponse.json({ error: "Kurs otomatis tidak tersedia" }, { status: 502 });
}
