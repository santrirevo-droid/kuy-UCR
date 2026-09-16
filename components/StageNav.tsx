import Link from "next/link";
import { getStageIndex, stageNumber, type Stage } from "@/lib/stages";
import Icon from "@/components/Icon";

export default function StageNav({ prev, next }: { prev: Stage | null; next: Stage | null }) {
  return (
    <nav className="mt-16 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
      {prev ? (
        <Link
          href={`/tahap/${prev.slug}`}
          className="group flex flex-col gap-1 bg-surface px-5 py-4 transition hover:bg-surface-2"
        >
          <span className="inline-flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-eyebrow text-ink-subtle">
            <Icon name="arrow-left" className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
            Sebelumnya
          </span>
          <span className="font-display text-[0.95rem] font-semibold text-ink group-hover:text-brand">
            <span className="tnum mr-2 text-ink-subtle">{stageNumber(getStageIndex(prev.slug))}</span>
            {prev.title}
          </span>
        </Link>
      ) : (
        <div className="hidden bg-surface sm:block" />
      )}

      {next ? (
        <Link
          href={`/tahap/${next.slug}`}
          className="group flex flex-col items-end gap-1 bg-surface px-5 py-4 text-right transition hover:bg-surface-2"
        >
          <span className="inline-flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-eyebrow text-ink-subtle">
            Selanjutnya
            <Icon name="arrow-right" className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="font-display text-[0.95rem] font-semibold text-ink group-hover:text-brand">
            <span className="tnum mr-2 text-ink-subtle">{stageNumber(getStageIndex(next.slug))}</span>
            {next.title}
          </span>
        </Link>
      ) : (
        <Link href="/" className="group flex flex-col items-end gap-1 bg-surface px-5 py-4 text-right transition hover:bg-surface-2">
          <span className="inline-flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-eyebrow text-gold">
            <Icon name="check" className="h-3 w-3" />
            Tahap terakhir
          </span>
          <span className="font-display text-[0.95rem] font-semibold text-ink group-hover:text-brand">
            Kembali ke daftar tahapan
          </span>
        </Link>
      )}
    </nav>
  );
}
