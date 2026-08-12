import Link from "next/link";
import type { Stage } from "@/lib/stages";

export default function StageNav({ prev, next }: { prev: Stage | null; next: Stage | null }) {
  return (
    <div className="mt-14 flex flex-col gap-3 border-t border-slate-200 pt-8 dark:border-slate-800 sm:flex-row sm:justify-between">
      {prev ? (
        <Link
          href={`/tahap/${prev.slug}`}
          className="flex-1 rounded-xl border border-slate-200 p-4 transition hover:border-emerald-300 hover:bg-emerald-50/60 dark:border-slate-800 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/20"
        >
          <div className="text-xs font-medium text-slate-400">← Sebelumnya</div>
          <div className="mt-1 font-semibold text-slate-800 dark:text-slate-100">
            {prev.icon} {prev.title}
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link
          href={`/tahap/${next.slug}`}
          className="flex-1 rounded-xl border border-slate-200 p-4 text-right transition hover:border-emerald-300 hover:bg-emerald-50/60 dark:border-slate-800 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/20"
        >
          <div className="text-xs font-medium text-slate-400">Selanjutnya →</div>
          <div className="mt-1 font-semibold text-slate-800 dark:text-slate-100">
            {next.icon} {next.title}
          </div>
        </Link>
      ) : (
        <Link
          href="/"
          className="flex-1 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/60 p-4 text-right dark:border-emerald-800 dark:bg-emerald-950/20"
        >
          <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">🎉 Selesai</div>
          <div className="mt-1 font-semibold text-slate-800 dark:text-slate-100">Kembali ke ringkasan</div>
        </Link>
      )}
    </div>
  );
}
