import Link from "next/link";
import { stages, accentStyles } from "@/lib/stages";
import LogoutButton from "@/components/LogoutButton";
import ThemeToggle from "@/components/ThemeToggle";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-orange-50/40 dark:bg-slate-950">
      <div className="mx-auto max-w-2xl px-5 py-12">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-heading text-2xl font-extrabold text-slate-900 dark:text-white">📋 Kelola Konten</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Pilih tahap yang ingin diedit. Perubahan langsung tersimpan ke GitHub &amp; tampil di halaman publik dalam
          hitungan detik — tanpa perlu redeploy.
        </p>

        <ul className="mt-6 space-y-2">
          {stages.map((s) => {
            const accent = accentStyles[s.accent];
            return (
              <li key={s.slug}>
                <Link
                  href={`/admin/edit/${s.slug}`}
                  className={`flex items-center justify-between rounded-2xl border-2 border-transparent bg-white/70 px-4 py-3 shadow-sm backdrop-blur transition hover:shadow-md dark:bg-slate-900/70 ${accent.hover}`}
                >
                  <span className="flex items-center gap-3 font-semibold text-slate-800 dark:text-slate-100">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-full text-base ${accent.badge}`}>
                      {s.icon}
                    </span>
                    {s.title}
                  </span>
                  <span className="text-sm text-slate-400">Edit →</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-8">
          <Link
            href="/"
            className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            ← Lihat situs publik
          </Link>
        </div>
      </div>
    </div>
  );
}
