import { NextResponse } from "next/server";
import { getCurrentUsernameFromCookie } from "@/lib/session";
import { getStage } from "@/lib/stages";
import {
  addPersonalItem,
  deletePersonalItem,
  getPersonalData,
  setPersonalNotes,
  togglePersonalItem,
} from "@/lib/personal";

async function requireAuth(slug: string) {
  const stage = getStage(slug);
  if (!stage) return { error: NextResponse.json({ error: "Tahap tidak ditemukan" }, { status: 404 }) };

  const username = await getCurrentUsernameFromCookie();
  if (!username) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

  return { username };
}

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const auth = await requireAuth(params.slug);
  if ("error" in auth) return auth.error;

  const data = await getPersonalData(auth.username, params.slug);
  return NextResponse.json(data);
}

// Tambah item checklist pribadi baru.
export async function POST(req: Request, { params }: { params: { slug: string } }) {
  const auth = await requireAuth(params.slug);
  if ("error" in auth) return auth.error;

  let body: { text?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request tidak valid" }, { status: 400 });
  }

  if (typeof body.text !== "string" || !body.text.trim()) {
    return NextResponse.json({ error: "Teks item tidak boleh kosong" }, { status: 400 });
  }

  try {
    const item = await addPersonalItem(auth.username, params.slug, body.text);
    return NextResponse.json({ item });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal menambah item";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// Centang / batal centang item checklist pribadi.
export async function PATCH(req: Request, { params }: { params: { slug: string } }) {
  const auth = await requireAuth(params.slug);
  if ("error" in auth) return auth.error;

  let body: { id?: string; done?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request tidak valid" }, { status: 400 });
  }

  if (typeof body.id !== "string" || !body.id || typeof body.done !== "boolean") {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }

  await togglePersonalItem(auth.username, params.slug, body.id, body.done);
  return NextResponse.json({ ok: true });
}

// Simpan catatan pribadi (freeform text).
export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  const auth = await requireAuth(params.slug);
  if ("error" in auth) return auth.error;

  let body: { notes?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request tidak valid" }, { status: 400 });
  }

  if (typeof body.notes !== "string") {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }

  await setPersonalNotes(auth.username, params.slug, body.notes);
  return NextResponse.json({ ok: true });
}

// Hapus item checklist pribadi.
export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
  const auth = await requireAuth(params.slug);
  if ("error" in auth) return auth.error;

  let body: { id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request tidak valid" }, { status: 400 });
  }

  if (typeof body.id !== "string" || !body.id) {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }

  await deletePersonalItem(auth.username, params.slug, body.id);
  return NextResponse.json({ ok: true });
}
