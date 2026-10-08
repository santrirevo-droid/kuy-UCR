import Link from "next/link";
import { stages, stageNumber } from "@/lib/stages";
import Icon from "@/components/Icon";
import Logo from "@/components/Logo";
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
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 sm:px-6 py-4">
          <span className="flex items-center gap-2.5">
            <Logo size={34} />
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

      <main className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Hero */}
        <section className="animate-rise border-b border-line py-9 sm:py-20">
          <p className="flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-eyebrow text-gold">
            <span className="h-px w-8 bg-gold/50" />
            PKUMI–LPDP × University of California, Riverside
          </p>
          <h1 className="mt-4 max-w-3xl sm:mt-6 font-display text-display-sm font-semibold text-ink sm:text-display-lg">
            Panduan operasional short course di UC Riverside.
          </h1>
          <p className="mt-4 max-w-2xl sm:mt-6 text-[0.95rem] leading-relaxed text-ink-muted sm:text-lg">
            Satu dokumen kerja untuk seluruh rombongan — dari pengurusan visa dan hari keberangkatan, kehidupan
            sehari-hari di Riverside, sampai pelaporan akhir setibanya kembali di Indonesia.
          </p>

          <div className="mt-6 flex flex-wrap sm:mt-9 items-center gap-3">
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
          <dl className="mt-8 grid grid-cols-2 sm:mt-12 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="bg-surface px-4 py-3.5">
                <dt className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-ink-subtle">{f.label}</dt>
                <dd className="mt-1.5 text-sm font-semibold text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>

          <Link
            href="/housing"
            className="group mt-4 flex items-center justify-between gap-4 rounded-lg border border-line bg-surface px-4 py-3.5 transition hover:border-brand/40 hover:bg-brand-soft"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-brand">
                <Icon name="home" className="h-[1.05rem] w-[1.05rem]" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">Laporan Housing</span>
                <span className="block text-xs text-ink-muted">Alamat, titik peta, dan penghuni tiap rumah di Riverside</span>
              </span>
            </span>
            <Icon name="arrow-right" className="h-4 w-4 text-ink-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
          </Link>

          <Link
            href="/tagihan"
            className="group mt-2 flex items-center justify-between gap-4 rounded-lg border border-line bg-surface px-4 py-3.5 transition hover:border-brand/40 hover:bg-brand-soft"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-brand">
                <Icon name="wallet" className="h-[1.05rem] w-[1.05rem]" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">Tagihan Nomor HP &amp; WiFi</span>
                <span className="block text-xs text-ink-muted">Status pembayaran bulanan Oktober – Desember 2026</span>
              </span>
            </span>
            <Icon name="arrow-right" className="h-4 w-4 text-ink-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
          </Link>
        </section>

        {/* Indeks tahapan */}
        <section id="tahapan" className="scroll-mt-8 py-10 sm:py-16">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-xl font-semibold text-ink sm:text-display-sm">Alur perjalanan</h2>
            <span className="tnum text-xs font-medium uppercase tracking-eyebrow text-ink-subtle">
              {stages.length} tahap
            </span>
          </div>

          <ol className="mt-5 border-t border-line sm:mt-8">
            {stages.map((s, i) => (
              <li key={s.slug}>
                <Link
                  href={`/tahap/${s.slug}`}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-4 border-b border-line px-2 py-4 sm:py-5 transition-colors hover:bg-surface sm:gap-x-6 sm:px-4"
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
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
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
