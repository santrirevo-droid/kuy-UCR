import { getRedis } from "@/lib/kv";
import bcrypt from "bcryptjs";

export type StoredUser = {
  username: string;
  name: string;
  passwordHash: string;
  createdAt: number;
  // true kalau password-nya di-set/reset oleh admin (bukan dipilih sendiri
  // oleh pesertanya) — dipakai buat maksa ganti password saat login berikutnya.
  mustChangePassword?: boolean;
};

export type PublicUser = {
  username: string;
  name: string;
  createdAt: number;
  mustChangePassword?: boolean;
};

const USERS_SET = "users:all";

function userKey(username: string) {
  return `user:${username}`;
}

function toPublicUser(u: StoredUser): PublicUser {
  return { username: u.username, name: u.name, createdAt: u.createdAt, mustChangePassword: u.mustChangePassword };
}

export function normalizeUsername(raw: string): string {
  return raw.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, "");
}

export async function findUser(username: string): Promise<StoredUser | null> {
  const u = normalizeUsername(username);
  if (!u) return null;
  const user = await getRedis().get<StoredUser>(userKey(u));
  return user ?? null;
}

export async function createUser(name: string, usernameRaw: string, password: string): Promise<PublicUser> {
  const username = normalizeUsername(usernameRaw);
  if (!username) throw new Error("Username tidak valid");
  const redis = getRedis();
  const existing = await redis.get(userKey(username));
  if (existing) throw new Error("Username sudah dipakai");

  const passwordHash = await bcrypt.hash(password, 10);
  // Password akun baru selalu di-set admin (bukan dipilih sendiri oleh
  // pesertanya) — wajib diganti begitu pertama kali login.
  const user: StoredUser = {
    username,
    name: name.trim() || username,
    passwordHash,
    createdAt: Date.now(),
    mustChangePassword: true,
  };
  await redis.set(userKey(username), user);
  await redis.sadd(USERS_SET, username);
  return toPublicUser(user);
}

export async function verifyPassword(username: string, password: string): Promise<PublicUser | null> {
  const user = await findUser(username);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return toPublicUser(user);
}

export async function updatePassword(
  usernameRaw: string,
  newPassword: string,
  mustChangePassword = false
): Promise<PublicUser | null> {
  const user = await findUser(usernameRaw);
  if (!user) return null;
  const passwordHash = await bcrypt.hash(newPassword, 10);
  const updated: StoredUser = { ...user, passwordHash, mustChangePassword };
  await getRedis().set(userKey(user.username), updated);
  return toPublicUser(updated);
}

export async function deleteUser(usernameRaw: string): Promise<void> {
  const username = normalizeUsername(usernameRaw);
  if (!username) return;
  const redis = getRedis();
  await redis.del(userKey(username));
  await redis.srem(USERS_SET, username);
}

export async function getAllUsers(): Promise<PublicUser[]> {
  const redis = getRedis();
  const usernames = (await redis.smembers(USERS_SET)) as string[] | null;
  if (!usernames || usernames.length === 0) return [];
  const users = await Promise.all(usernames.map((u) => redis.get<StoredUser>(userKey(u))));
  return users
    .filter((u): u is StoredUser => Boolean(u))
    .map(toPublicUser)
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Password sementara yang mudah dibacakan admin ke peserta, contoh: "sunrise-482".
export function generateTempPassword(): string {
  const words = ["sunrise", "citrus", "riverside", "sunset", "compass", "wander", "sequoia", "harbor", "meadow", "aurora"];
  const word = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(100 + Math.random() * 900);
  return `${word}-${num}`;
}
