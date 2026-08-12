// Password admin. Bisa dioverride via env var ADMIN_PASSWORD di Vercel
// Project Settings → Environment Variables tanpa perlu ubah kode.
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "jalan2-citrus-ucrland-1555";

// Nama cookie yang menyimpan GitHub Personal Access Token milik admin.
// Token TIDAK pernah disimpan di server/DB — hanya hidup di cookie httpOnly
// sesi browser admin, dan cuma dipakai untuk memanggil GitHub Contents API
// saat membaca/menyimpan konten dari panel admin.
export const PAT_COOKIE = "kuyucr_pat";
export const SESSION_MAX_AGE = 60 * 60 * 6; // 6 jam

// Helper untuk Route Handler admin (kelola user, lihat progres) yang tidak
// perlu memanggil GitHub API — cukup pastikan admin sudah login (cookie ada).
export function isAdminRequest(req: Request): boolean {
  const cookieHeader = req.headers.get("cookie") || "";
  return cookieHeader.split(";").some((c) => c.trim().startsWith(`${PAT_COOKIE}=`));
}
