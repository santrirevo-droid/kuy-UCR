import Link from "next/link";
import { stages, stageNumber } from "@/lib/stages";
import Icon from "@/components/Icon";
import ThemeToggle from "@/components/ThemeToggle";
import UserBadge from "@/components/UserBadge";

const facts = [
  { label: "Institusi", value: "UC Riverside" },
  { label: "Lokasi", value: "Riverside, California" },
  { label: "Periode", value: "28 Sep – 25 Des 2026" },
  { label: "Tahapan", value: `${stages.length} bagian` },
];

export default async function Home() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Bilah identitas — tipis, menempel di atas, garis rambut sebagai pemisah. */}
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-6 py-4">
          <span className="flex items-baseline gap-2.5">
            <span className="font-display text-lg font-semibold tracking-tight text-ink">Kuy, UCR!</span>
            <span className="hidden h-3.5 w-px bg-line-strong sm:block" />
            <span className="hidden text-[0.68rem] font-medium uppercase tracking-eyebrow text-ink-subtle sm:block">
              Panduan Program
            </span>
          </span>
          <div className="flex items-center gap-2">
            <UserBadge />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6">
        {/* Hero */}
        <section className="animate-rise border-b border-line py-14 sm:py-20">
          <p className="flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-eyebrow text-gold">
            <span className="h-px w-8 bg-gold/50" />
            PKUMI–LPDP × University of California, Riverside
          </p>
          <h1 className="mt-6 max-w-3xl font-display text-display-md font-semibold text-ink sm:text-display-lg">
            Panduan operasional short course di UC Riverside.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Satu dokumen kerja untuk seluruh rombongan — dari pengurusan visa dan hari keberangkatan, kehidupan
            sehari-hari di Riverside, sampai pelaporan akhir setibanya kembali di Indonesia.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href={`/tahap/${stages[0].slug}`}
              className="group inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-semibold text-brand-on shadow-subtle transition hover:bg-brand-hover"
            >
              Mulai dari Tahap 01
              <Icon name="arrow-right" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#tahapan"
              className="inline-flex items-center gap-2 rounded-md border border-line-strong px-5 py-3 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
            >
              Lihat seluruh tahapan
            </a>
          </div>

          {/* Strip fakta kunci — nuansa lembar data resmi. */}
          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="bg-surface px-4 py-3.5">
                <dt className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-ink-subtle">{f.label}</dt>
                <dd className="mt-1.5 text-sm font-semibold text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Indeks tahapan */}
        <section id="tahapan" className="scroll-mt-8 py-14 sm:py-16">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-display-sm font-semibold text-ink">Alur perjalanan</h2>
            <span className="tnum text-xs font-medium uppercase tracking-eyebrow text-ink-subtle">
              {stages.length} tahap
            </span>
          </div>

          <ol className="mt-8 border-t border-line">
            {stages.map((s, i) => (
              <li key={s.slug}>
                <Link
                  href={`/tahap/${s.slug}`}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-4 border-b border-line px-2 py-5 transition-colors hover:bg-surface sm:gap-x-6 sm:px-4"
                >
                  <span className="flex items-center gap-3 sm:gap-4">
                    <span className="tnum font-display text-base font-semibold text-ink-subtle transition-colors group-hover:text-gold">
                      {stageNumber(i)}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-md border border-line bg-surface text-ink-muted transition-colors group-hover:border-brand/40 group-hover:bg-brand-soft group-hover:text-brand">
                      <Icon name={s.icon} className="h-[1.15rem] w-[1.15rem]" />
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-display text-[1.05rem] font-semibold text-ink">{s.title}</span>
                    <span className="mt-0.5 block text-sm text-ink-muted">{s.subtitle}</span>
                  </span>
                  <Icon
                    name="arrow-right"
                    className="h-4 w-4 text-ink-subtle opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-brand group-hover:opacity-100"
                  />
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <p className="max-w-2xl text-xs leading-relaxed text-ink-subtle">
            Catatan persiapan internal rombongan PKUMI-LPDP ke UC Riverside. Bukan dokumen resmi
            LPDP/UCR/Kemenag — selalu verifikasi informasi visa, tanggal, dan biaya ke sumber resmi sebelum
            dijadikan pegangan.
          </p>
        </div>
      </footer>
    </div>
  );
}
