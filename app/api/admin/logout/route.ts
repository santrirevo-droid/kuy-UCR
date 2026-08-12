import { NextResponse } from "next/server";
import { PAT_COOKIE } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(PAT_COOKIE, "", { httpOnly: true, secure: true, sameSite: "strict", maxAge: 0, path: "/" });
  return res;
}
