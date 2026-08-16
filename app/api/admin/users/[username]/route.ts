import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { deleteUser, normalizeUsername, updatePassword, generateTempPassword } from "@/lib/users";
import { getRedis } from "@/lib/kv";
import { stages } from "@/lib/stages";

// Reset password seorang user — dipakai admin kalau ada peserta lupa password-nya.
export async function PUT(req: Request, { params }: { params: { username: string } }) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const username = normalizeUsername(params.username);
  if (!username) return NextResponse.json({ error: "Username tidak valid" }, { status: 400 });

  const newPassword = generateTempPassword();
  try {
    const user = await updatePassword(username, newPassword);
    if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ ok: true, user, password: newPassword });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal reset password";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { username: string } }) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const username = normalizeUsername(params.username);
  if (!username) return NextResponse.json({ error: "Username tidak valid" }, { status: 400 });

  try {
    await deleteUser(username);
    // Bersihkan progres checklist yang tersimpan di bawah username ini juga,
    // biar tidak jadi data yatim kalau nanti username yang sama dipakai lagi.
    const redis = getRedis();
    await Promise.all(stages.map((s) => redis.del(`progress:${username}:${s.slug}`)));
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal menghapus user";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
