import Link from "next/link";
import { stages, accentStyles } from "@/lib/stages";
import ThemeToggle from "@/components/ThemeToggle";
import UserBadge from "@/components/UserBadge";

export default async function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-orange-50 dark:bg-slate-950">
      {/* Blob dekoratif — nuansa ceria */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-72 w-72 animate-blob rounded-full bg-orange-300/40 blur-3xl dark:bg-orange-700/20" />
        <div className="absolute -right-10 top-40 h-72 w-72 animate-blob rounded-full bg-pink-300/40 blur-3xl [animation-delay:3s] dark:bg-pink-700/20" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 animate-blob rounded-full bg-teal-300/40 blur-3xl [animation-delay:6s] dark:bg-teal-700/20" />
      </div>

      <main className="relative mx-auto max-w-3xl px-5 py-10 sm:py-16">
        <div className="flex items-center justify-end gap-2">
          <UserBadge />
          <ThemeToggle />
        </div>

        <p className="mt-6 text-sm font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
          ☀️ PKUMI–LPDP × UC Riverside
        </p>
        <h1 className="mt-3 font-heading text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
          Kuy, UCR! 🇺🇸📚
        </h1>
        <p className="mt-4 max-w-xl text-lg text-slate-600 dark:text-slate-300">
          Panduan operasional lengkap — dari persiapan keberangkatan sampai pulang lagi ke Indonesia.
          Short course di University of California, Riverside, <strong>28 September – 25 Desember 2026</strong>.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/tahap/${stages[0].slug}`}
            className="rounded-full bg-gradient-to-r from-orange-500 via-pink-500 to-violet-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition hover:scale-[1.03] hover:shadow-xl active:scale-[0.98]"
          >
            Mulai baca dari Tahap 1 →
          </Link>
        </div>

        <div className="mt-16">
          <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Alur perjalanan — {stages.length} tahap
          </h2>
          <ol className="relative mt-6 space-y-3 border-l-2 border-dashed border-orange-300 pl-8 dark:border-orange-800">
            {stages.map((s, i) => {
              const accent = accentStyles[s.accent];
              return (
                <li key={s.slug} className="relative">
                  <span
                    className={`absolute -left-[2.6rem] top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-base font-bold ring-4 ring-orange-50 dark:ring-slate-950 ${accent.badge}`}
                  >
                    {s.icon}
                  </span>
                  <Link
                    href={`/tahap/${s.slug}`}
                    className={`-ml-3 block rounded-2xl border-2 border-transparent bg-white/60 p-3.5 shadow-sm backdrop-blur transition hover:shadow-md dark:bg-slate-900/60 ${accent.hover}`}
                  >
                    <div className="flex items-center gap-2 font-heading font-bold text-slate-800 dark:text-slate-100">
                      {i + 1}. {s.title}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{s.subtitle}</div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>

        <footer className="mt-20 border-t border-orange-200/60 pt-6 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
          Catatan pribadi persiapan PKUMI-LPDP ke UC Riverside — bukan dokumen resmi LPDP/UCR/Kemenag. Selalu cek ulang
          info visa, tanggal, dan biaya ke sumber resmi.
        </footer>
      </main>
    </div>
  );
}
