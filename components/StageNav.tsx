import Link from "next/link";
import { accentStyles, type Stage } from "@/lib/stages";

export default function StageNav({ prev, next }: { prev: Stage | null; next: Stage | null }) {
  return (
    <div className="mt-14 flex flex-col gap-3 border-t border-orange-100 pt-8 dark:border-slate-800 sm:flex-row sm:justify-between">
      {prev ? (
        <Link
          href={`/tahap/${prev.slug}`}
          className={`flex-1 rounded-2xl border-2 border-transparent bg-white/70 p-4 shadow-sm backdrop-blur transition hover:shadow-md dark:bg-slate-900/70 ${accentStyles[prev.accent].hover}`}
        >
          <div className="text-xs font-semibold text-slate-400">← Sebelumnya</div>
          <div className="mt-1 font-heading font-bold text-slate-800 dark:text-slate-100">
            {prev.icon} {prev.title}
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link
          href={`/tahap/${next.slug}`}
          className={`flex-1 rounded-2xl border-2 border-transparent bg-white/70 p-4 text-right shadow-sm backdrop-blur transition hover:shadow-md dark:bg-slate-900/70 ${accentStyles[next.accent].hover}`}
        >
          <div className="text-xs font-semibold text-slate-400">Selanjutnya →</div>
          <div className="mt-1 font-heading font-bold text-slate-800 dark:text-slate-100">
            {next.icon} {next.title}
          </div>
        </Link>
      ) : (
        <Link
          href="/"
          className="flex-1 rounded-2xl border-2 border-dashed border-orange-300 bg-gradient-to-r from-orange-50 to-pink-50 p-4 text-right dark:border-orange-800 dark:from-orange-950/20 dark:to-pink-950/20"
        >
          <div className="text-xs font-semibold text-orange-600 dark:text-orange-400">🎉 Selesai</div>
          <div className="mt-1 font-heading font-bold text-slate-800 dark:text-slate-100">Kembali ke ringkasan</div>
        </Link>
      )}
    </div>
  );
}
