import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAdminRequest, PAT_COOKIE } from "@/lib/auth";
import { GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH } from "@/lib/content";
import { getStage } from "@/lib/stages";

function ghHeaders(pat: string) {
  return {
    Authorization: `Bearer ${pat}`,
    "User-Agent": "kuy-ucr-admin",
    Accept: "application/vnd.github+json",
  };
}

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const stage = getStage(params.slug);
  if (!stage) return NextResponse.json({ error: "Tahap tidak ditemukan" }, { status: 404 });

  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const pat = cookies().get(PAT_COOKIE)?.value;
  if (!pat) {
    return NextResponse.json({ error: "GitHub belum terhubung", code: "NEEDS_GITHUB_TOKEN" }, { status: 428 });
  }

  const path = `content/${params.slug}.md`;
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
    { headers: ghHeaders(pat), cache: "no-store" }
  );

  if (res.status === 404) {
    // Belum ada file untuk tahap ini — kembalikan konten kosong agar bisa dibuat baru saat disimpan
    return NextResponse.json({ content: "", sha: null });
  }
  if (!res.ok) {
    return NextResponse.json({ error: "Gagal mengambil konten dari GitHub" }, { status: res.status });
  }

  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return NextResponse.json({ content, sha: data.sha });
}

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  const stage = getStage(params.slug);
  if (!stage) return NextResponse.json({ error: "Tahap tidak ditemukan" }, { status: 404 });

  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const pat = cookies().get(PAT_COOKIE)?.value;
  if (!pat) {
    return NextResponse.json({ error: "GitHub belum terhubung", code: "NEEDS_GITHUB_TOKEN" }, { status: 428 });
  }

  let body: { content?: string; sha?: string | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request tidak valid" }, { status: 400 });
  }

  if (typeof body.content !== "string") {
    return NextResponse.json({ error: "Konten wajib diisi" }, { status: 400 });
  }

  const path = `content/${params.slug}.md`;
  const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`, {
    method: "PUT",
    headers: { ...ghHeaders(pat), "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `Update ${stage.title} via admin panel`,
      content: Buffer.from(body.content, "utf-8").toString("base64"),
      sha: body.sha || undefined,
      branch: GITHUB_BRANCH,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return NextResponse.json({ error: "Gagal menyimpan ke GitHub", detail }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json({ ok: true, sha: data.content?.sha ?? null });
}
