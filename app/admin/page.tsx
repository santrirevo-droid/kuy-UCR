import Link from "next/link";
import { stages } from "@/lib/stages";
import LogoutButton from "@/components/LogoutButton";

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">📋 Kelola Konten</h1>
        <LogoutButton />
      </div>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Pilih tahap yang ingin diedit. Perubahan langsung tersimpan ke GitHub &amp; tampil di halaman publik dalam
        hitungan detik — tanpa perlu redeploy.
      </p>

      <ul className="mt-6 space-y-2">
        {stages.map((s) => (
          <li key={s.slug}>
            <Link
              href={`/admin/edit/${s.slug}`}
              className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 transition hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-slate-800 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/20"
            >
              <span className="font-medium text-slate-800 dark:text-slate-100">
                <span className="mr-2">{s.icon}</span>
                {s.title}
              </span>
              <span className="text-sm text-slate-400">Edit →</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">
          ← Lihat situs publik
        </Link>
      </div>
    </div>
  );
}
