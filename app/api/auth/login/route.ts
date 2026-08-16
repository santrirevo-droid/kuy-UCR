import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { verifyPassword } from "@/lib/users";
import { createUserSession, SESSION_COOKIE, SESSION_TTL_SECONDS } from "@/lib/session";
import { ADMIN_PASSWORD, ADMIN_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

export async function POST(req: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request tidak valid" }, { status: 400 });
  }

  const { username, password } = body;
  if (!username || !password) {
    return NextResponse.json({ error: "Username dan password wajib diisi" }, { status: 400 });
  }

  // Login admin lewat form masuk yang sama — username "admin" + password admin
  // (lihat lib/auth.ts, bisa dioverride via env var ADMIN_PASSWORD). Tidak ada
  // tombol/halaman admin terpisah lagi.
  if (username.trim().toLowerCase() === "admin") {
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Username atau password salah" }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true, admin: true });
    res.cookies.set(ADMIN_COOKIE, randomBytes(16).toString("hex"), {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });
    return res;
  }

  let user;
  try {
    user = await verifyPassword(username, password);
  } catch {
    return NextResponse.json(
      { error: "Database belum terhubung. Admin perlu menyambungkan Vercel KV terlebih dahulu." },
      { status: 503 }
    );
  }

  if (!user) {
    return NextResponse.json({ error: "Username atau password salah" }, { status: 401 });
  }

  const sessionId = await createUserSession(user.username);
  const res = NextResponse.json({ ok: true, user });
  res.cookies.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
  });
  return res;
}
