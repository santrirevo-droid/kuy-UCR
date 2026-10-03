import Link from "next/link";
import {
  houses,
  fullAddress,
  mapsUrl,
  mapsEmbedUrl,
  directionsToCampusUrl,
  distanceToCampusKm,
  telUrl,
  UCR_CAMPUS,
} from "@/lib/housing";
import HousingMap from "@/components/HousingMap";
import Icon from "@/components/Icon";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import UserBadge from "@/components/UserBadge";

export const metadata = {
  title: "Laporan Housing",
  description: "Penempatan housing rombongan PKUMI–LPDP di Riverside — alamat, titik peta, dan daftar penghuni tiap rumah.",
};

const REPORT_DATE = "2 Oktober 2026";

export default function HousingPage() {
  const totalResidents = houses.reduce((n, h) => n + h.residents.length, 0);
  const facts = [
    { label: "Jumlah rumah", value: `${houses.length} rumah` },
    { label: "Jumlah penghuni", value: `${totalResidents} orang` },
    { label: "Kota", value: "Riverside, CA" },
    { label: "Data per", value: REPORT_DATE },
  ];

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-30 border-b border-line bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-6 py-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-ink-muted transition hover:text-ink"
          >
            <Icon name="arrow-left" className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <Logo size={28} />
            <span className="font-display tracking-tight">Kuy, UCR!</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <UserBadge />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
        {/* Kepala laporan */}
        <header className="animate-rise border-b border-line pb-10">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md border border-line bg-surface text-brand">
              <Icon name="home" className="h-5 w-5" />
            </span>
            <span className="flex flex-col">
              <span className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-ink-subtle">
                Laporan Bidang Operasional
              </span>
              <span className="mt-0.5 text-sm font-medium text-gold">Akomodasi &amp; Konsumsi</span>
            </span>
          </div>

          <h1 className="mt-6 font-display text-display-sm font-semibold text-ink sm:text-display-md">
            Laporan Housing Rombongan
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Penempatan tempat tinggal peserta Short Course PKUMI–LPDP selama program di Riverside — alamat lengkap,
            titik Google Maps, dan daftar penghuni tiap rumah.
          </p>

          <dl className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="bg-surface px-4 py-3.5">
                <dt className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-ink-subtle">{f.label}</dt>
                <dd className="tnum mt-1.5 text-sm font-semibold text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
        </header>

        {/* Peta gabungan */}
        <section className="pt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
            <h2 className="font-display text-display-sm font-semibold text-ink">Peta semua housing</h2>
            <div className="flex items-center gap-4 text-sm font-semibold">
              <Link href="/housing/peta" className="inline-flex items-center gap-1 text-brand hover:underline">
                Layar penuh
                <Icon name="arrow-up-right" className="h-3.5 w-3.5" />
              </Link>
              <a href="/housing/kml" className="text-ink-muted hover:text-brand">
                Unduh KML
              </a>
            </div>
          </div>
          <div className="mt-6">
            <HousingMap houses={houses} campus={UCR_CAMPUS} />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink-subtle">
            Ingin versi Google Maps? Unduh KML di atas, lalu buka{" "}
            <a href="https://www.google.com/maps/d/" target="_blank" rel="noreferrer" className="underline hover:text-brand">
              Google My Maps
            </a>{" "}
            → Buat peta baru → Impor → pilih file KML-nya → Bagikan.
          </p>
        </section>

        {/* Rekap */}
        <section className="py-12">
          <h2 className="font-display text-display-sm font-semibold text-ink">Rekap penempatan</h2>
          <div className="mt-6 overflow-x-auto rounded-lg border border-line">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <thead className="bg-surface-2">
                <tr className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-ink-subtle">
                  <th className="px-4 py-3">Rumah</th>
                  <th className="px-4 py-3">Alamat</th>
                  <th className="px-4 py-3 text-right">Penghuni</th>
                  <th className="px-4 py-3 text-right">Ke kampus*</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-surface">
                {houses.map((h, i) => (
                  <tr key={h.id}>
                    <td className="px-4 py-3">
                      <a href={`#${h.id}`} className="font-semibold text-ink hover:text-brand">
                        <span className="tnum mr-2 font-display text-ink-subtle">{String(i + 1).padStart(2, "0")}</span>
                        {h.name}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{fullAddress(h)}</td>
                    <td className="tnum px-4 py-3 text-right font-semibold text-ink">{h.residents.length}</td>
                    <td className="tnum px-4 py-3 text-right text-ink-muted">
                      ±{distanceToCampusKm(h).toFixed(1)} km
                    </td>
                  </tr>
                ))}
                <tr className="bg-surface-2">
                  <td className="px-4 py-3 font-semibold text-ink" colSpan={2}>
                    Total
                  </td>
                  <td className="tnum px-4 py-3 text-right font-semibold text-ink">{totalResidents}</td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-ink-subtle">
            * Jarak garis lurus ke {UCR_CAMPUS.name}, bukan jarak tempuh. Gunakan tombol &ldquo;Rute ke kampus&rdquo;
            di tiap rumah untuk jarak &amp; waktu perjalanan sebenarnya.
          </p>
        </section>

        {/* Detail per rumah */}
        <section className="space-y-8 border-t border-line pt-12">
          <h2 className="font-display text-display-sm font-semibold text-ink">Detail tiap rumah</h2>

          {houses.map((h, i) => (
            <article key={h.id} id={h.id} className="scroll-mt-20 overflow-hidden rounded-lg border border-line bg-surface">
              <div className="grid md:grid-cols-[1fr_1.1fr]">
                <div className="flex flex-col p-5 sm:p-6">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-gold">
                    Rumah {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1.5 font-display text-xl font-semibold text-ink">{h.name}</h3>

                  <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-ink-muted">
                    <Icon name="map-pin" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    <span>
                      {h.street}
                      <br />
                      {h.city}
                      {h.note && <span className="mt-1 block text-xs text-ink-subtle">{h.note}</span>}
                    </span>
                  </p>
                  <p className="tnum mt-1.5 pl-6 text-xs text-ink-subtle">
                    {h.lat.toFixed(5)}, {h.lng.toFixed(5)}
                  </p>

                  <div className="mt-5">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-ink-subtle">
                      Penghuni · {h.residents.length} orang
                    </p>
                    <ol className="mt-2 divide-y divide-line border-y border-line">
                      {h.residents.map((r, j) => (
                        <li key={r.name} className="flex min-h-[2.75rem] items-center gap-3 py-1.5 text-sm">
                          <span className="tnum w-5 shrink-0 text-right font-display text-ink-subtle">{j + 1}</span>
                          <span className="min-w-0 flex-1">
                            <span className="font-medium text-ink">{r.name}</span>
                            {r.nickname !== r.name && <span className="ml-1.5 text-ink-subtle">({r.nickname})</span>}
                            {r.phone && <span className="tnum block text-xs text-ink-muted">{r.phone}</span>}
                          </span>
                          {r.phone && (
                            <a
                              href={telUrl(r.phone)}
                              aria-label={`Telepon ${r.nickname} ${r.phone}`}
                              title={`Telepon ${r.phone}`}
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-success/30 bg-success-soft text-success transition hover:border-success hover:bg-success hover:text-white"
                            >
                              <Icon name="phone" className="h-4 w-4" />
                            </a>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <a
                      href={mapsUrl(h)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md bg-brand px-3.5 py-2 text-sm font-semibold text-brand-on shadow-subtle transition hover:bg-brand-hover"
                    >
                      <Icon name="map-pin" className="h-4 w-4" />
                      Buka di Google Maps
                    </a>
                    <a
                      href={directionsToCampusUrl(h)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md border border-line-strong px-3.5 py-2 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
                    >
                      Rute ke kampus
                      <Icon name="arrow-up-right" className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                <iframe
                  title={`Peta ${fullAddress(h)}`}
                  src={mapsEmbedUrl(h)}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-64 w-full border-t border-line md:h-full md:min-h-[20rem] md:border-l md:border-t-0"
                />
              </div>
            </article>
          ))}
        </section>

        <p className="mt-12 border-t border-line pt-6 text-xs leading-relaxed text-ink-subtle">
          Ada perpindahan penghuni atau salah alamat? Kabari Bidang Operasional supaya laporan ini diperbarui. Titik
          peta diambil dari OpenStreetMap berdasarkan nomor rumah — cek ulang di lokasi bila ada selisih.
        </p>
      </main>
    </div>
  );
}
