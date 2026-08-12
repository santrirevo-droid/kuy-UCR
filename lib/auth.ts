// Password admin. Bisa dioverride via env var ADMIN_PASSWORD di Vercel
// Project Settings → Environment Variables tanpa perlu ubah kode.
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "jalan2-citrus-ucrland-1555";

// Cookie umum "saya admin" — dibuat begitu password admin benar. Dipakai untuk
// menjaga semua halaman/route di bawah /admin (dashboard progres, kelola
// user, daftar konten) yang TIDAK butuh GitHub sama sekali.
export const ADMIN_COOKIE = "kuyucr_admin";

// Cookie terpisah yang menyimpan GitHub Personal Access Token milik admin.
// Hanya diminta saat admin benar-benar masuk ke fitur "Kelola Konten" (yang
// perlu commit ke GitHub). Token TIDAK pernah disimpan di server/DB — hanya
// hidup di cookie httpOnly sesi browser admin.
export const PAT_COOKIE = "kuyucr_pat";

export const SESSION_MAX_AGE = 60 * 60 * 6; // 6 jam

export function isAdminRequest(req: Request): boolean {
  const cookieHeader = req.headers.get("cookie") || "";
  return cookieHeader.split(";").some((c) => c.trim().startsWith(`${ADMIN_COOKIE}=`));
}
