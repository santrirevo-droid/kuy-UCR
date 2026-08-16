import { getRedis } from "@/lib/kv";
import bcrypt from "bcryptjs";

export type StoredUser = {
  username: string;
  name: string;
  passwordHash: string;
  createdAt: number;
};

export type PublicUser = {
  username: string;
  name: string;
  createdAt: number;
};

const USERS_SET = "users:all";

function userKey(username: string) {
  return `user:${username}`;
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
  const user: StoredUser = { username, name: name.trim() || username, passwordHash, createdAt: Date.now() };
  await redis.set(userKey(username), user);
  await redis.sadd(USERS_SET, username);
  return { username: user.username, name: user.name, createdAt: user.createdAt };
}

export async function verifyPassword(username: string, password: string): Promise<PublicUser | null> {
  const user = await findUser(username);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return { username: user.username, name: user.name, createdAt: user.createdAt };
}

export async function updatePassword(usernameRaw: string, newPassword: string): Promise<PublicUser | null> {
  const user = await findUser(usernameRaw);
  if (!user) return null;
  const passwordHash = await bcrypt.hash(newPassword, 10);
  const updated: StoredUser = { ...user, passwordHash };
  await getRedis().set(userKey(user.username), updated);
  return { username: updated.username, name: updated.name, createdAt: updated.createdAt };
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
    .map((u) => ({ username: u.username, name: u.name, createdAt: u.createdAt }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Password sementara yang mudah dibacakan admin ke peserta, contoh: "sunrise-482".
export function generateTempPassword(): string {
  const words = ["sunrise", "citrus", "riverside", "sunset", "compass", "wander", "sequoia", "harbor", "meadow", "aurora"];
  const word = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(100 + Math.random() * 900);
  return `${word}-${num}`;
}
