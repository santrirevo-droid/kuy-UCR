import Icon from "@/components/Icon";

// Halaman fallback yang ditampilkan service worker (public/sw.js) kalau user
// buka app dalam keadaan offline dan halaman yang dituju belum pernah
// ke-cache. Sengaja statis total — tidak boleh butuh data/network apa pun.
export const metadata = { title: "Sedang offline" };

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-canvas px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-lg border border-line bg-surface text-ink-subtle">
        <Icon name="wifi-off" className="h-6 w-6" />
      </span>
      <div>
        <p className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-ink-subtle">Tidak ada koneksi</p>
        <h1 className="mt-3 font-display text-display-sm font-semibold text-ink">Sedang offline</h1>
      </div>
      <p className="max-w-sm text-sm leading-relaxed text-ink-muted">
        Sepertinya koneksi internetmu terputus. Halaman ini butuh koneksi untuk memuat konten terbaru — coba lagi
        begitu kamu kembali online.
      </p>
    </div>
  );
}
