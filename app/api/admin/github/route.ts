import { NextResponse } from "next/server";
import { isAdminRequest, PAT_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";
import { GITHUB_OWNER, GITHUB_REPO } from "@/lib/content";

// Dipanggil khusus saat admin masuk ke "Kelola Konten" dan belum punya token
// GitHub tersambung di sesi ini.
export async function POST(req: Request) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { pat?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request tidak valid" }, { status: 400 });
  }

  const pat = body.pat?.trim();
  if (!pat) return NextResponse.json({ error: "GitHub Personal Access Token wajib diisi" }, { status: 400 });

  const check = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`, {
    headers: {
      Authorization: `Bearer ${pat}`,
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
    return NextResponse.json({ error: "Token GitHub tidak punya izin tulis (write) ke repo ini" }, { status: 403 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(PAT_COOKIE, pat, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return res;
}
