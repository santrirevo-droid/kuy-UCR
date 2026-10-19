import Link from "next/link";
import FeeCalculator from "@/components/FeeCalculator";
import Icon from "@/components/Icon";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import UserBadge from "@/components/UserBadge";
import {
  CHASE_INCOMING_WIRE_FEE,
  CHASE_MONTHLY_FEE,
  DEFAULT_ASSUMPTIONS,
  MANDIRI_IDR_ATM_FEE,
  MONTHLY_USD as MONTHLY,
  MONTHS,
  MULTI_ATM_FEE,
  MULTI_MONTHLY_FEE,
  US_ATM_FEE,
} from "@/lib/dana-lpdp";

export const metadata = {
  title: "Dana LPDP & Rekening",
  description:
    "Penerimaan living allowance LPDP $6.000 (untuk 3 bulan, cair sekali di bulan pertama), dan perbandingan Mandiri Rupiah, Mandiri Multicurrency, dan Chase.",
};

const rp = (n: number) => `Rp${n.toLocaleString("id-ID")}`;
const { idrReceived, rate, markup } = DEFAULT_ASSUMPTIONS;

const facts = [
  { label: "Dana diterima", value: `$${(MONTHLY * MONTHS).toLocaleString("id-ID")}` },
  { label: "Pencairan", value: "Sekali, bulan pertama" },
  { label: "Jatah bulanan", value: `$${MONTHLY.toLocaleString("id-ID")} × ${MONTHS} bulan` },
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
    role: "Pilihan pencairan Rupiah: dana $6.000 dikonversi LPDP dengan kurs dolar saat pencairan.",
    pros: [
      "Sudah dimiliki hampir semua peserta, tidak perlu buka rekening baru",
      "Mudah dipantau lewat Livin' dan bisa dipakai membayar keperluan di Indonesia",
      "Kartu debit berlogo Visa/Mastercard tetap bisa dipakai belanja dan tarik tunai di AS",
      `Dana diterima dalam Rupiah (${rp(idrReceived)} untuk 3 bulan), langsung bisa dipakai untuk keperluan di Indonesia`,
    ],
    cons: [
      "Kena konversi dua kali: USD → IDR saat dana masuk, lalu IDR → USD saat dipakai di AS",
      `Admin kurs +1,5–2% di setiap transaksi di AS, mis. kurs normal ${rp(rate)} jadi ${rp(rate + markup)} per $1`,
      `Tarik tunai di ATM AS kena admin Mandiri ${rp(MANDIRI_IDR_ATM_FEE)} + admin ATM AS $${US_ATM_FEE} (ikut kena admin kurs): sekitar ${rp(MANDIRI_IDR_ATM_FEE + US_ATM_FEE * (rate + markup))} per tarikan, belum termasuk admin kurs atas uang yang ditarik`,
      "Tidak bisa dipakai Zelle untuk patungan sewa, HP, atau WiFi",
    ],
  },
  {
    id: "usd",
    name: "Mandiri Multicurrency",
    kind: "Rekening Indonesia · Multi mata uang",
    role: "Pilihan pencairan USD ke rekening Indonesia: dana diterima utuh dalam Dollar.",
    pros: [
      "Dibuka langsung dari aplikasi Livin', tanpa perlu ke cabang",
      "Satu tabungan untuk beberapa mata uang: saldo USD tetap dalam Dollar, tidak dikonversi ke Rupiah",
      "Bebas admin kurs: belanja dan tarik tunai di AS langsung memotong saldo USD",
      "Cukup satu kartu debit Mandiri untuk semua tabungan: tinggal hubungkan ke saldo USD di Livin', lalu belanja di AS langsung memotong saldo USD tanpa konversi",
      "Transfer valas ke luar negeri bisa dari Livin', termasuk kirim ke rekening Chase sendiri",
      "Sisa dana di akhir program tetap aman di Indonesia, tidak perlu dipindahkan saat pulang",
    ],
    cons: [
      `Biaya bulanan saldo USD $${MULTI_MONTHLY_FEE}`,
      `Tarik tunai di ATM AS kena admin Mandiri $${MULTI_ATM_FEE} + admin ATM AS $${US_ATM_FEE} per tarikan`,
      "Transfer USD ke rekening AS (SWIFT) bisa kena biaya bank perantara dan biaya terima di Chase",
      "Tetap tidak bisa Zelle; untuk patungan tetap perlu rekening AS atau uang tunai",
    ],
  },
  {
    id: "chase",
    name: "Chase Bank",
    kind: "Rekening Amerika · USD",
    role: "Pilihan pencairan USD ke bank lokal AS: dana langsung siap dipakai di Riverside.",
    pros: [
      "Bisa Zelle: patungan sewa, tagihan HP & WiFi, dan bayar sesama peserta jadi instan",
      "Tarik tunai di semua ATM Chase gratis, berapa kali pun",
      "Kartu debit lokal: tanpa biaya transaksi luar negeri",
      "Bisa dibuka tanpa SSN, cukup paspor + DS-2019/I-20 + alamat AS",
      "Cabang dan ATM Chase banyak di Riverside",
    ],
    cons: [
      `Dana masuk (transfer internasional) dipotong $${CHASE_INCOMING_WIRE_FEE} setiap kali transfer; karena LPDP cair sekali, cukup sekali potong`,
      `Biaya bulanan $${CHASE_MONTHLY_FEE.toLocaleString("id-ID", { minimumFractionDigits: 2 })}`,
      "Tarik tunai di ATM selain Chase tetap kena biaya",
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
  { label: "Admin kurs", values: ["+1,5–2% (≈Rp324/$)", "Gratis", "Gratis"] },
  { label: "Biaya bulanan", values: ["Admin tabungan biasa", `$${MULTI_MONTHLY_FEE}`, `$${CHASE_MONTHLY_FEE.toLocaleString("id-ID", { minimumFractionDigits: 2 })}`] },
  { label: "Biaya dana masuk", values: ["—", "—", `$${CHASE_INCOMING_WIRE_FEE} sekali`] },
  {
    label: "Tarik tunai di AS",
    values: [`${rp(MANDIRI_IDR_ATM_FEE)} + $${US_ATM_FEE} ATM`, `$${MULTI_ATM_FEE} + $${US_ATM_FEE} ATM`, "Gratis di ATM Chase"],
  },
  { label: "Perlu dibuka", values: ["Sudah ada", "Lewat Livin'", "Setelah tiba di AS"] },
  { label: "Setelah pulang", values: ["Tetap dipakai", "Tetap dipakai", "Perlu ditutup"] },
];

const payouts = [
  {
    currency: "Rupiah",
    bank: "Mandiri Rupiah",
    note: "$6.000 dihitung dengan kurs dolar saat pencairan, lalu masuk sebagai Rupiah. Saat dipakai di AS, kena admin kurs lagi.",
  },
  {
    currency: "Dollar",
    bank: "Mandiri Multicurrency",
    note: "$6.000 masuk utuh ke saldo USD di rekening Indonesia. Dipakai di AS lewat kartu debit Mandiri tanpa konversi.",
  },
  {
    currency: "Dollar",
    bank: "Chase (bank lokal AS)",
    note: "$6.000 masuk langsung ke rekening AS, dipotong $15 sekali saat diterima. Rekening harus sudah dibuka sebelum pencairan.",
  },
];

const steps = [
  {
    title: "Sebelum berangkat",
    body: "Tentukan mata uang pencairan ke LPDP. Kalau memilih USD ke Mandiri, buka Tabungan Mandiri Multicurrency lewat Livin', tambahkan saldo USD, lalu hubungkan kartu debit Mandiri yang sudah kamu punya ke saldo USD tersebut. Kalau memilih USD ke Chase, siapkan dulu rekening Chase-nya (langkah berikut) sebelum data rekening diserahkan ke LPDP.",
  },
  {
    title: "Minggu pertama di Riverside",
    body: "Buka rekening Chase di cabang terdekat. Bawa paspor, DS-2019/I-20, dan bukti alamat AS. Aktifkan Zelle dengan nomor HP AS.",
  },
  {
    title: "Saat dana LPDP cair (bulan pertama)",
    body: `Dana $${(MONTHLY * MONTHS).toLocaleString("id-ID")} masuk sekaligus untuk 3 bulan. Bagi sendiri jadi jatah $${MONTHLY.toLocaleString("id-ID")} per bulan supaya tidak habis di awal. Kalau dana diterima di Mandiri, pindahkan ke Chase sesedikit mungkin: setiap transfer masuk ke Chase kena potongan $${CHASE_INCOMING_WIRE_FEE}.`,
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
              Pilih pencairan <strong>dalam Dollar</strong>. Pencairan Rupiah kena kurs dua kali: dikonversi LPDP saat
              pencairan, lalu kena admin kurs lagi setiap dipakai di AS. Untuk tujuan USD-nya:{" "}
              <strong>Mandiri Multicurrency</strong> paling hemat kalau tarik tunai cukup sekali sebulan dan sisanya
              belanja pakai kartu. <strong>Chase</strong> lebih hemat kalau sering tarik tunai (2× sebulan atau lebih)
              atau butuh Zelle untuk patungan sewa, HP, dan WiFi. Kalau dana masuk ke Mandiri tapi tetap butuh Chase,
              pindahkan sesekali dalam jumlah besar, karena setiap transfer masuk ke Chase dipotong $15.
            </p>
          </div>
        </section>

        {/* Opsi pencairan */}
        <section className="pt-10 sm:pt-14">
          <h2 className="font-display text-xl font-semibold text-ink sm:text-display-sm">Opsi pencairan dari LPDP</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
            LPDP bisa mentransfer dalam Rupiah atau Dollar. Pilihan mata uang menentukan rekening tujuannya.
          </p>
          <div className="mt-5 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:mt-7 sm:grid-cols-3">
            {payouts.map((o) => (
              <div key={o.bank} className="bg-surface px-4 py-4">
                <span className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-gold">{o.currency}</span>
                <p className="mt-1 font-display text-base font-semibold text-ink">{o.bank}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{o.note}</p>
              </div>
            ))}
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

        {/* Rincian biaya admin */}
        <section id="biaya" className="scroll-mt-20 pt-10 sm:pt-14">
          <h2 className="font-display text-xl font-semibold text-ink sm:text-display-sm">Rincian biaya admin</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
            Simulasi untuk dana ${MONTHLY.toLocaleString("id-ID")} per bulan yang seluruhnya dipakai di AS selama{" "}
            {MONTHS} bulan. Angka bisa diubah. Coba naikkan jumlah tarik tunai per bulan untuk melihat kapan Chase
            jadi lebih hemat.
          </p>

          <div className="mt-5 sm:mt-7">
            <FeeCalculator />
          </div>

          <div className="mt-6 rounded-lg border border-line bg-surface px-4 py-4 sm:px-5">
            <p className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-eyebrow text-ink-subtle">
              <Icon name="info" className="h-4 w-4" />
              Asumsi perhitungan
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink">
              <li>
                Dana LPDP ${(MONTHLY * MONTHS).toLocaleString("id-ID")} cair <strong>sekali</strong> di bulan pertama
                untuk {MONTHS} bulan, lalu dipakai merata ${MONTHLY.toLocaleString("id-ID")} per bulan. Untuk Mandiri
                Rupiah, dana yang masuk dianggap {rp(idrReceived)} (≈ {rp(Math.round(idrReceived / MONTHS))} per
                bulan).
              </li>
              <li>
                Seluruh dana bulanan ditarik tunai atau dibelanjakan di AS. Jumlah tarikan dibagi rata, jadi
                tarik 2× berarti $1.000 sekali tarik.
              </li>
              <li>
                Mandiri Rupiah: setiap dolar dibeli dengan kurs normal + admin kurs ({rp(rate)} + {rp(markup)}).
                Admin ATM AS $3 juga ditagih dalam Dollar, jadi ikut kena admin kurs.
              </li>
              <li>
                Admin ATM AS $3 memakai contoh ATM SchoolsFirst FCU. ATM lain bisa lebih mahal, dan beberapa ATM
                membatasi jumlah sekali tarik, jadi $2.000 mungkin perlu ditarik lebih dari sekali.
              </li>
              <li>
                Chase: dana LPDP dikirim langsung ke Chase sekali, jadi potongan terima transfer $
                {CHASE_INCOMING_WIRE_FEE} hanya terjadi satu kali. Biaya bulanan ${CHASE_MONTHLY_FEE.toLocaleString("id-ID", { minimumFractionDigits: 2 })} tetap
                ditagih {MONTHS} bulan. Tarik tunai selalu di ATM Chase.
              </li>
              <li>
                &quot;Bisa dipakai di AS&quot; = dolar yang benar-benar sampai di tangan setelah semua biaya. Untuk
                Mandiri Rupiah, ini bergantung pada kurs dolar yang dipakai LPDP saat pencairan. Isi kolom &quot;Dana
                Rupiah 3 bulan&quot; dengan angka yang benar-benar diterima.
              </li>
              <li>Admin bulanan tabungan Rupiah biasa tidak dihitung, karena tetap dibayar dengan atau tanpa program.</li>
            </ul>
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
              <li>Kurs dolar yang dipakai LPDP kalau memilih pencairan Rupiah, dan batas waktu menyerahkan data rekening.</li>
              <li>
                Biaya transfer SWIFT dari Mandiri, biaya bank perantara, dan biaya terima wire internasional di Chase.
                Angkanya berubah-ubah, jadi cek tarif resmi sebelum transfer pertama.
              </li>
              <li>
                Biaya bulanan dan biaya terima transfer di Chase untuk jenis rekening yang dibuka, serta apakah ada
                cara membebaskannya.
              </li>
              <li>Biaya tarik tunai Mandiri di ATM luar negeri dan batas tarik tunai harian kartu debit.</li>
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
