// Halaman fallback yang ditampilkan service worker (public/sw.js) kalau user
// buka app dalam keadaan offline dan halaman yang dituju belum pernah
// ke-cache. Sengaja statis total — tidak boleh butuh data/network apa pun.
export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-orange-50 px-6 text-center dark:bg-slate-950">
      <span className="text-5xl">📡</span>
      <h1 className="font-heading text-2xl font-extrabold text-slate-900 dark:text-white">
        Lagi offline
      </h1>
      <p className="max-w-sm text-slate-500 dark:text-slate-400">
        Sepertinya koneksi internetmu putus. Halaman ini butuh koneksi untuk memuat konten terbaru —
        coba lagi begitu kamu online.
      </p>
    </div>
  );
}
