import { NextResponse } from "next/server";
import { ADMIN_COOKIE, PAT_COOKIE } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  const expire = { httpOnly: true, secure: true, sameSite: "strict" as const, maxAge: 0, path: "/" };
  res.cookies.set(ADMIN_COOKIE, "", expire);
  res.cookies.set(PAT_COOKIE, "", expire);
  return res;
}
