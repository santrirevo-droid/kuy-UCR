import { Redis } from "@upstash/redis";

let client: Redis | null = null;

// Vercel KV lama sudah deprecated — sekarang pakai integrasi Redis (Upstash)
// dari Vercel Marketplace. Env var yang di-inject bisa bernama KV_REST_API_*
// (kompatibilitas lama) atau UPSTASH_REDIS_REST_* (integrasi baru), jadi kita
// deteksi keduanya.
export function getRedis(): Redis {
  if (client) return client;

  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Database (Redis/KV) belum terhubung ke project ini. Sambungkan lewat Vercel Dashboard → Storage → Create Database, lalu redeploy."
    );
  }

  client = new Redis({ url, token });
  return client;
}
