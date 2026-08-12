import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { destroySession, SESSION_COOKIE } from "@/lib/session";

export async function POST() {
  const sessionId = cookies().get(SESSION_COOKIE)?.value;
  if (sessionId) {
    try {
      await destroySession(sessionId);
    } catch {
      // KV tidak terhubung — tetap lanjut hapus cookie di browser
    }
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, secure: true, sameSite: "lax", maxAge: 0, path: "/" });
  return res;
}
