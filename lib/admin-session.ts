import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, ADMIN_PASSWORD, SESSION_MAX_AGE } from "@/lib/auth";

// Nilai cookie admin = "<kedaluwarsa>.<hmac>", ditandatangani dengan
// ADMIN_SESSION_SECRET (fallback: password admin). Jadi cookie tidak bisa
// dipalsukan cukup dengan membuat cookie bernama sama — server memverifikasi
// tanda tangannya. Ganti password/secret = semua sesi admin lama gugur.
//
// File terpisah dari lib/auth.ts karena memakai node:crypto, sedangkan
// lib/auth.ts juga diimpor middleware (Edge runtime).

const SECRET = process.env.ADMIN_SESSION_SECRET || `kuyucr-admin:${ADMIN_PASSWORD}`;

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function createAdminToken(): string {
  const exp = String(Date.now() + SESSION_MAX_AGE * 1000);
  return `${exp}.${sign(exp)}`;
}

export function verifyAdminToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [exp, mac] = token.split(".");
  if (!exp || !mac || !/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  const expected = Buffer.from(sign(exp), "hex");
  const given = Buffer.from(mac, "hex");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** Untuk Route Handler yang menerima Request mentah. */
export function isAdminRequest(req: Request): boolean {
  const cookieHeader = req.headers.get("cookie") || "";
  const raw = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${ADMIN_COOKIE}=`));
  return verifyAdminToken(raw ? decodeURIComponent(raw.slice(ADMIN_COOKIE.length + 1)) : null);
}

/** Untuk Server Component / Route Handler via next/headers. */
export function isAdmin(): boolean {
  return verifyAdminToken(cookies().get(ADMIN_COOKIE)?.value);
}
