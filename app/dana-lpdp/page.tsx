import Link from "next/link";
import Icon from "@/components/Icon";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import UserBadge from "@/components/UserBadge";

export const metadata = {
  title: "Dana LPDP & Rekening",
  description:
    "Penerimaan living allowance LPDP $2.000/bulan selama 3 bulan, dan perbandingan Mandiri Rupiah, Mandiri Multicurrency, dan Chase.",
};

const MONTHLY = 2000;
const MONTHS = 3;

const facts = [
  { label: "Dana bulanan", value: `$${MONTHLY.toLocaleString("id-ID")}` },
  { label: "Durasi", value: `${MONTHS} bulan` },
  { label: "Total diterima", value: `$${(MONTHLY * MONTHS).toLocaleString("id-ID")}` },
  { label: "Periode", value: "Okt – Des 2026" },
];

type Bank = {
  id: string;
  name: string;
  kind: string;
  role: string;
  pros: string[];
  cons: string[];
};

const banks: Bank[] = [
  {
    id: "idr",
    name: "Mandiri Rupiah",
    kind: "Rekening Indonesia · IDR",
    role: "Cocok jika LPDP hanya bisa mentransfer ke rekening Rupiah.",
    pros: [
      "Sudah dimiliki hampir semua peserta, tidak perlu buka rekening baru",
      "Mudah dipantau lewat Livin' dan bisa dipakai membayar keperluan di Indonesia",
      "Kartu debit berlogo Visa/Mastercard tetap bisa dipakai belanja dan tarik tunai di AS",
    ],
    cons: [
      "Kena konversi dua kali: USD → IDR saat dana masuk, lalu IDR → USD saat dipakai di AS",
      "Tiap transaksi luar negeri kena selisih kurs jaringan kartu + markup bank",
      "Tarik tunai di ATM AS kena biaya dari Mandiri dan biasanya dari pemilik ATM ($3–5)",
      "Tidak bisa dipakai Zelle untuk patungan sewa, HP, atau WiFi",
    ],
  },
  {
    id: "usd",
    name: "Mandiri Multicurrency",
    kind: "Rekening Indonesia · Multi mata uang",
    role: "Paling hemat untuk menyimpan dana bila LPDP bisa mentransfer dalam USD.",
    pros: [
      "Dibuka langsung dari aplikasi Livin', tanpa perlu ke cabang",
      "Satu tabungan untuk beberapa mata uang: saldo USD tetap dalam Dollar, tidak dikonversi ke Rupiah",
      "Bisa dihubungkan ke Mandiri Debit Multicurrency (Visa): belanja di AS langsung memotong saldo USD tanpa konversi",
      "Transfer valas ke luar negeri bisa dari Livin', termasuk kirim ke rekening Chase sendiri",
      "Sisa dana di akhir program tetap aman di Indonesia, tidak perlu dipindahkan saat pulang",
    ],
    cons: [
      "Kartu Debit Multicurrency fisik sebaiknya diurus sebelum berangkat; kalau belum sempat, kartu virtual bisa diaktifkan dari Livin'",
      "Tarik tunai di ATM AS tetap bisa kena biaya ATM",
      "Transfer USD ke rekening AS (SWIFT) bisa kena biaya bank perantara dan biaya terima di Chase",
      "Tetap tidak bisa Zelle; untuk patungan tetap perlu rekening AS atau uang tunai",
    ],
  },
  {
    id: "chase",
    name: "Chase Bank",
    kind: "Rekening Amerika · USD",
    role: "Rekening operasional harian selama di Riverside.",
    pros: [
      "Bisa Zelle: patungan sewa, tagihan HP & WiFi, dan bayar sesama peserta jadi instan",
      "Kartu debit lokal: tanpa biaya transaksi luar negeri, ATM Chase gratis",
      "Bisa dibuka tanpa SSN, cukup paspor + DS-2019/I-20 + alamat AS",
      "Cabang dan ATM Chase banyak di Riverside",
    ],
    cons: [
      "Total Checking kena biaya $15/bulan kecuali syarat bebas biaya terpenuhi (mis. saldo minimum harian)",
      "College Checking (bebas biaya) dibatasi usia 17–24, jadi kebanyakan peserta tidak memenuhi syarat",
      "Dana harus dipindahkan dulu dari Indonesia (Wise atau SWIFT), jadi ada biaya dan jeda waktu",
      "Wajib ditutup sebelum pulang dan sisa saldo dipindahkan, padahal program cuma 3 bulan",
    ],
  },
];

type Row = { label: string; values: [string, string, string] };

const rows: Row[] = [
  { label: "Mata uang saldo", values: ["Rupiah", "USD", "USD"] },
  { label: "Konversi kurs", values: ["2 kali", "Tidak ada", "Saat dana dipindah"] },
  { label: "Belanja di AS", values: ["Bisa, kena kurs", "Bisa, tanpa konversi", "Bisa, tanpa biaya"] },
  { label: "Zelle / patungan", values: ["Tidak", "Tidak", "Ya"] },
  { label: "Biaya bulanan", values: ["Biaya admin biasa", "Biaya admin biasa", "$15 kecuali dibebaskan"] },
  { label: "Perlu dibuka", values: ["Sudah ada", "Lewat Livin'", "Setelah tiba di AS"] },
  { label: "Setelah pulang", values: ["Tetap dipakai", "Tetap dipakai", "Perlu ditutup"] },
];

const steps = [
  {
    title: "Sebelum berangkat",
    body: "Tanyakan ke LPDP rekening jenis apa yang diterima untuk pencairan (Rupiah atau valas USD). Jika USD bisa, buka Tabungan Mandiri Multicurrency lewat Livin', tambahkan saldo USD, dan sambungkan ke kartu Mandiri Debit Multicurrency.",
  },
  {
    title: "Minggu pertama di Riverside",
    body: "Buka Chase Total Checking di cabang terdekat. Bawa paspor, DS-2019/I-20, dan bukti alamat AS. Aktifkan Zelle dengan nomor HP AS.",
  },
  {
    title: "Setiap dana LPDP cair",
    body: "Biarkan dana utama di Mandiri. Pindahkan ke Chase hanya sejumlah kebutuhan bulan itu (sewa, patungan, belanja), lewat Wise atau transfer valas dari Livin'.",
  },
  {
    title: "Sebelum pulang (Desember)",
    body: "Habiskan atau kirim balik sisa saldo Chase ke Mandiri, lalu tutup rekeningnya di cabang supaya tidak ada biaya bulanan setelah kamu pulang.",
  },
];

function BankCard({ bank }: { bank: Bank }) {
  return (
    <article className="flex flex-col rounded-lg border border-line bg-surface">
      <header className="border-b border-line px-4 py-4 sm:px-5">
        <span className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-ink-subtle">{bank.kind}</span>
        <h3 className="mt-1 font-display text-lg font-semibold text-ink">{bank.name}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{bank.role}</p>
      </header>
      <div className="flex flex-1 flex-col gap-5 px-4 py-4 sm:px-5">
        <div>
          <h4 className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-success">Kelebihan</h4>
          <ul className="mt-2 space-y-2">
            {bank.pros.map((p) => (
              <li key={p} className="flex gap-2 text-sm leading-relaxed text-ink">
                <Icon name="check" className="mt-[0.2rem] h-3.5 w-3.5 shrink-0 text-success" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-danger">Kekurangan</h4>
          <ul className="mt-2 space-y-2">
            {bank.cons.map((c) => (
              <li key={c} className="flex gap-2 text-sm leading-relaxed text-ink">
                <Icon name="x" className="mt-[0.2rem] h-3.5 w-3.5 shrink-0 text-danger" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export default function LpdpFundsPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-30 border-b border-line bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-4 sm:px-6 py-3">
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

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-16">
        <header className="animate-rise border-b border-line pb-7 sm:pb-10">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md border border-line bg-surface text-brand">
              <Icon name="building" className="h-5 w-5" />
            </span>
            <span className="flex flex-col">
              <span className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-ink-subtle">
                Keuangan Peserta
              </span>
              <span className="mt-0.5 text-sm font-medium text-gold">Living allowance</span>
            </span>
          </div>

          <h1 className="mt-4 font-display sm:mt-6 text-display-xs font-semibold text-ink sm:text-display-md">
            Penerimaan Dana LPDP &amp; Pilihan Rekening
          </h1>
          <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-ink-muted sm:text-lg">
            Setiap peserta menerima ${MONTHLY.toLocaleString("id-ID")} per bulan selama {MONTHS} bulan. Halaman ini
            membandingkan tiga tempat menampung dana itu: Mandiri Rupiah, Mandiri Multicurrency, dan Chase, beserta
            kelebihan dan kekurangannya.
          </p>

          <dl className="mt-6 grid grid-cols-2 sm:mt-9 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="bg-surface px-4 py-3.5">
                <dt className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-ink-subtle">{f.label}</dt>
                <dd className="tnum mt-1.5 text-sm font-semibold text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
        </header>

        {/* Rekomendasi singkat */}
        <section className="pt-7 sm:pt-10">
          <div className="rounded-lg border border-brand/30 bg-brand-soft px-4 py-4 sm:px-5 sm:py-5">
            <p className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-eyebrow text-brand">
              <Icon name="bulb" className="h-4 w-4" />
              Rekomendasi
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink sm:text-[0.95rem]">
              Pakai <strong>dua rekening</strong>. <strong>Mandiri Multicurrency</strong> (saldo USD, dengan kartu Debit
              Multicurrency) untuk menerima dan menyimpan dana LPDP, dan <strong>Chase</strong> untuk kebutuhan harian
              dan patungan lewat Zelle. Pindahkan ke Chase hanya sebanyak kebutuhan tiap bulan. Jika LPDP hanya bisa
              mentransfer ke rekening Rupiah, terima di Mandiri Rupiah lalu kirim ke Chase lewat Wise supaya kursnya
              lebih baik daripada memakai kartu debit Rupiah langsung di AS.
            </p>
          </div>
        </section>

        {/* Kartu per bank */}
        <section className="pt-10 sm:pt-14">
          <h2 className="font-display text-xl font-semibold text-ink sm:text-display-sm">Kelebihan &amp; kekurangan</h2>
          <div className="mt-5 grid gap-4 sm:mt-7 lg:grid-cols-3">
            {banks.map((b) => (
              <BankCard key={b.id} bank={b} />
            ))}
          </div>
        </section>

        {/* Tabel perbandingan */}
        <section className="pt-10 sm:pt-14">
          <h2 className="font-display text-xl font-semibold text-ink sm:text-display-sm">Perbandingan sekilas</h2>
          <div className="mt-5 overflow-x-auto rounded-lg border border-line sm:mt-7">
            <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
              <thead className="bg-surface-2">
                <tr>
                  <th className="px-4 py-3 text-[0.62rem] font-semibold uppercase tracking-eyebrow text-ink-subtle"></th>
                  {banks.map((b) => (
                    <th
                      key={b.id}
                      className="px-4 py-3 text-[0.62rem] font-semibold uppercase tracking-eyebrow text-ink-subtle"
                    >
                      {b.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-surface">
                {rows.map((r) => (
                  <tr key={r.label} className="border-t border-line">
                    <th scope="row" className="px-4 py-3 font-medium text-ink-muted">
                      {r.label}
                    </th>
                    {r.values.map((v, i) => (
                      <td key={i} className="px-4 py-3 text-ink">
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Alur */}
        <section className="pt-10 sm:pt-14">
          <h2 className="font-display text-xl font-semibold text-ink sm:text-display-sm">Alur yang disarankan</h2>
          <ol className="mt-5 border-t border-line sm:mt-7">
            {steps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[auto_1fr] gap-x-4 border-b border-line py-4 sm:gap-x-6 sm:py-5">
                <span className="tnum font-display text-base font-semibold text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block font-display text-[1.05rem] font-semibold text-ink">{s.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-ink-muted">{s.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="pt-10 sm:pt-14">
          <div className="rounded-lg border border-warn/30 bg-warn-soft px-4 py-4 sm:px-5">
            <p className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-eyebrow text-warn">
              <Icon name="alert" className="h-4 w-4" />
              Perlu dicek ulang
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink">
              <li>Jenis rekening dan mata uang yang diterima LPDP untuk pencairan program ini.</li>
              <li>
                Biaya transfer SWIFT dari Mandiri, biaya bank perantara, dan biaya terima wire internasional di Chase.
                Angkanya berubah-ubah, jadi cek tarif resmi sebelum transfer pertama.
              </li>
              <li>Syarat terbaru agar Chase Total Checking bebas biaya bulanan $15.</li>
              <li>Biaya tarik tunai Mandiri di ATM luar negeri.</li>
            </ul>
          </div>
        </section>

        <p className="mt-10 border-t border-line pt-6 sm:mt-12 text-xs leading-relaxed text-ink-subtle">
          Ini catatan persiapan pribadi, bukan saran keuangan resmi LPDP, Bank Mandiri, atau Chase. Lihat juga tahap{" "}
          <Link href="/tahap/budget-keuangan" className="underline hover:text-brand">
            Budget &amp; Keuangan
          </Link>{" "}
          untuk estimasi biaya hidup.
        </p>
      </main>
    </div>
  );
}
