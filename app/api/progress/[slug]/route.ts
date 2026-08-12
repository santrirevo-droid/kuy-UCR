import { NextResponse } from "next/server";
import { getCurrentUsernameFromCookie } from "@/lib/session";
import { getStageProgress, setItemDone } from "@/lib/progress";
import { getStage } from "@/lib/stages";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const stage = getStage(params.slug);
  if (!stage) return NextResponse.json({ error: "Tahap tidak ditemukan" }, { status: 404 });

  const username = await getCurrentUsernameFromCookie();
  if (!username) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const done = await getStageProgress(username, params.slug);
  return NextResponse.json({ done });
}

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  const stage = getStage(params.slug);
  if (!stage) return NextResponse.json({ error: "Tahap tidak ditemukan" }, { status: 404 });

  const username = await getCurrentUsernameFromCookie();
  if (!username) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { index?: number; done?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request tidak valid" }, { status: 400 });
  }

  const { index, done } = body;
  if (typeof index !== "number" || !Number.isInteger(index) || index < 0 || index > 500 || typeof done !== "boolean") {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }

  await setItemDone(username, params.slug, index, done);
  return NextResponse.json({ ok: true });
}
