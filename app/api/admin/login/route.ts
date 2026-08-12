import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { ADMIN_PASSWORD, ADMIN_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

export async function POST(req: Request) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request tidak valid" }, { status: 400 });
  }

  if (body.password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Password admin salah" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, randomBytes(16).toString("hex"), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return res;
}
