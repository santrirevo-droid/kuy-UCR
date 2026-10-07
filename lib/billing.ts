import { getRedis } from "@/lib/kv";
import { houses } from "@/lib/housing";

// Tagihan bulanan rombongan: pulsa/paket nomor HP AS ($20/bulan per nomor) dan
// WiFi rumah ($50/bulan per rumah). Daftar penagihan diturunkan dari
// lib/housing.ts — pemegang nomor = penghuni yang punya `phone`.
// Status lunas disimpan di Redis; hanya admin yang boleh mengubahnya.

export const PHONE_FEE = 20;
export const WIFI_FEE = 50;

export const BILLING_MONTHS = [
  { key: "2026-10", label: "Oktober", short: "Okt" },
  { key: "2026-11", label: "November", short: "Nov" },
  { key: "2026-12", label: "Desember", short: "Des" },
] as const;

export type BillingMonth = (typeof BILLING_MONTHS)[number]["key"];

export type BillItem = {
  id: string;
  kind: "phone" | "wifi";
  title: string;
  subtitle: string;
  phone?: string;
  amount: number;
  houseId: string;
  houseColor: string;
};

/** WiFi ditagihkan untuk rumah-rumah ini saja. */
const WIFI_HOUSES = ["mission-inn", "olivewood", "canyon-crest"];

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const phoneBills: BillItem[] = houses.flatMap((h) =>
  h.residents
    .filter((r) => r.phone)
    .map((r) => ({
      id: `hp-${slug(r.name)}`,
      kind: "phone" as const,
      title: r.name,
      subtitle: h.name,
      phone: r.phone,
      amount: PHONE_FEE,
      houseId: h.id,
      houseColor: h.color,
    })),
);

export const wifiBills: BillItem[] = houses
  .filter((h) => WIFI_HOUSES.includes(h.id))
  .map((h) => ({
    id: `wifi-${h.id}`,
    kind: "wifi" as const,
    title: `WiFi ${h.name}`,
    subtitle: `${h.residents.length} penghuni · ±$${(WIFI_FEE / h.residents.length).toFixed(2).replace(/\.00$/, "")}/orang`,
    amount: WIFI_FEE,
    houseId: h.id,
    houseColor: h.color,
  }));

export const allBills = [...phoneBills, ...wifiBills];

export function isValidBill(id: string): boolean {
  return allBills.some((b) => b.id === id);
}

export function isValidMonth(m: string): m is BillingMonth {
  return BILLING_MONTHS.some((x) => x.key === m);
}

// — Penyimpanan —
// Satu hash Redis; field "<billId>|<bulan>" → tanggal ISO saat ditandai lunas.
const KEY = "billing:payments";

export type PaymentMap = Record<string, string>;

export const paymentField = (billId: string, month: string) => `${billId}|${month}`;

export async function getPayments(): Promise<PaymentMap> {
  const data = await getRedis().hgetall<Record<string, string>>(KEY);
  return data ?? {};
}

export async function setPayment(billId: string, month: BillingMonth, paid: boolean): Promise<string | null> {
  const redis = getRedis();
  const field = paymentField(billId, month);
  if (paid) {
    const at = new Date().toISOString();
    await redis.hset(KEY, { [field]: at });
    return at;
  }
  await redis.hdel(KEY, field);
  return null;
}
