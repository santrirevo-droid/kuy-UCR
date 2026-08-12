import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { createUser, getAllUsers, generateTempPassword } from "@/lib/users";

export async function GET(req: Request) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const users = await getAllUsers();
    return NextResponse.json({ users });
  } catch {
    return NextResponse.json(
      { error: "Database belum terhubung. Sambungkan Vercel KV di Project Settings terlebih dahulu.", users: [] },
      { status: 200 }
    );
  }
}

export async function POST(req: Request) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { name?: string; username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request tidak valid" }, { status: 400 });
  }

  const { name, username } = body;
  if (!name?.trim() || !username?.trim()) {
    return NextResponse.json({ error: "Nama dan username wajib diisi" }, { status: 400 });
  }

  const password = body.password?.trim() || generateTempPassword();

  try {
    const user = await createUser(name, username, password);
    return NextResponse.json({ ok: true, user, password });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal membuat user";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
