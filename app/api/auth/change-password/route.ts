import { NextResponse } from "next/server";
import { getCurrentUsernameFromCookie } from "@/lib/session";
import { verifyPassword, updatePassword } from "@/lib/users";

export async function PUT(req: Request) {
  const username = await getCurrentUsernameFromCookie();
  if (!username) return NextResponse.json({ error: "Kamu belum masuk" }, { status: 401 });

  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request tidak valid" }, { status: 400 });
  }

  const { currentPassword, newPassword } = body;
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Password lama dan password baru wajib diisi" }, { status: 400 });
  }
  if (newPassword.length < 6) {
    return NextResponse.json({ error: "Password baru minimal 6 karakter" }, { status: 400 });
  }

  let verified;
  try {
    verified = await verifyPassword(username, currentPassword);
  } catch {
    return NextResponse.json({ error: "Database belum terhubung" }, { status: 503 });
  }
  if (!verified) {
    return NextResponse.json({ error: "Password lama salah" }, { status: 401 });
  }

  const updated = await updatePassword(username, newPassword);
  if (!updated) return NextResponse.json({ error: "Gagal mengubah password" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
