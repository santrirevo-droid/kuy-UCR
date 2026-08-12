import { NextResponse } from "next/server";
import { ADMIN_PASSWORD, PAT_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";
import { GITHUB_OWNER, GITHUB_REPO } from "@/lib/content";

export async function POST(req: Request) {
  let body: { password?: string; pat?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request tidak valid" }, { status: 400 });
  }

  const { password, pat } = body;

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Password admin salah" }, { status: 401 });
  }
  if (!pat || !pat.trim()) {
    return NextResponse.json({ error: "GitHub Personal Access Token wajib diisi" }, { status: 400 });
  }

  const check = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`, {
    headers: {
      Authorization: `Bearer ${pat.trim()}`,
      "User-Agent": "kuy-ucr-admin",
      Accept: "application/vnd.github+json",
    },
    cache: "no-store",
  });

  if (!check.ok) {
    return NextResponse.json(
      { error: "Token GitHub tidak valid atau tidak punya akses ke repo kuy-UCR" },
      { status: 401 }
    );
  }

  const data = await check.json();
  if (data.permissions && data.permissions.push === false) {
    return NextResponse.json(
      { error: "Token GitHub tidak punya izin tulis (write) ke repo ini" },
      { status: 403 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(PAT_COOKIE, pat.trim(), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return res;
}
