import Link from "next/link";
import { stages } from "@/lib/stages";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
      <main className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          PKUMI–LPDP × UC Riverside
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Kuy, UCR! 🇺🇸📚
        </h1>
        <p className="mt-4 max-w-xl text-lg text-slate-600 dark:text-slate-300">
          Panduan operasional lengkap — dari persiapan keberangkatan sampai pulang lagi ke Indonesia.
          Short course di University of California, Riverside, <strong>28 September – 25 Desember 2026</strong>.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/tahap/${stages[0].slug}`}
            className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
          >
            Mulai baca dari Tahap 1 →
          </Link>
          <Link
            href="/admin"
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500"
          >
            🔐 Admin
          </Link>
        </div>

        <div className="mt-16">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
            Alur perjalanan — {stages.length} tahap
          </h2>
          <ol className="relative mt-6 space-y-2 border-l-2 border-dashed border-emerald-200 pl-8 dark:border-emerald-900">
            {stages.map((s, i) => (
              <li key={s.slug} className="relative">
                <span className="absolute -left-[2.6rem] flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 ring-4 ring-white dark:bg-emerald-900 dark:text-emerald-300 dark:ring-slate-950">
                  {i + 1}
                </span>
                <Link
                  href={`/tahap/${s.slug}`}
                  className="-ml-3 block rounded-xl border border-transparent p-3 transition hover:border-slate-200 hover:bg-white hover:shadow-sm dark:hover:border-slate-800 dark:hover:bg-slate-900"
                >
                  <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                    <span>{s.icon}</span>
                    {s.title}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{s.subtitle}</div>
                </Link>
              </li>
            ))}
          </ol>
        </div>

        <footer className="mt-20 border-t border-slate-100 pt-6 text-xs text-slate-400 dark:border-slate-900">
          Catatan pribadi persiapan PKUMI-LPDP ke UC Riverside — bukan dokumen resmi LPDP/UCR/Kemenag. Selalu cek ulang
          info visa, tanggal, dan biaya ke sumber resmi.
        </footer>
      </main>
    </div>
  );
}
