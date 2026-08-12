import { getRedis } from "@/lib/kv";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import type { PublicUser } from "@/lib/users";
import { findUser } from "@/lib/users";

export const SESSION_COOKIE = "kuyucr_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 hari

function sessionKey(id: string) {
  return `session:${id}`;
}

export async function createUserSession(username: string): Promise<string> {
  const id = randomBytes(24).toString("hex");
  await getRedis().set(sessionKey(id), username, { ex: SESSION_TTL_SECONDS });
  return id;
}

export async function destroySession(id: string): Promise<void> {
  await getRedis().del(sessionKey(id));
}

// Dipanggil dari Server Component (mis. halaman) — baca cookie & KV langsung,
// tanpa round-trip HTTP.
export async function getCurrentUser(): Promise<PublicUser | null> {
  const sessionId = cookies().get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;
  try {
    const username = await getRedis().get<string>(sessionKey(sessionId));
    if (!username) return null;
    const user = await findUser(username);
    if (!user) return null;
    return { username: user.username, name: user.name, createdAt: user.createdAt };
  } catch {
    // KV belum terhubung (mis. dev lokal tanpa env var) — anggap tidak login
    return null;
  }
}

// Dipanggil dari Route Handler (Request) — sama, tapi eksplisit untuk konteks API.
export async function getCurrentUsernameFromCookie(): Promise<string | null> {
  const sessionId = cookies().get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;
  try {
    return await getRedis().get<string>(sessionKey(sessionId));
  } catch {
    return null;
  }
}
