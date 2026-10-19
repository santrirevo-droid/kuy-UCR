import Link from "next/link";
import FeeCalculator from "@/components/FeeCalculator";
import Icon from "@/components/Icon";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import UserBadge from "@/components/UserBadge";
import {
  CHASE_INCOMING_WIRE_FEE,
  CHASE_MONTHLY_FEE,
  CHASE_PROMO_BONUS,
  CHASE_PROMO_URL,
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
const { rate, markupPct } = DEFAULT_ASSUMPTIONS;
const markup = Math.round((rate * markupPct) / 100);
const pct = markupPct.toLocaleString("id-ID");

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
      "Dana diterima dalam Rupiah ($6.000 × kurs dolar saat pencairan), langsung bisa dipakai untuk keperluan di Indonesia",
    ],
    cons: [
      "Kena konversi dua kali: USD → IDR saat dana masuk, lalu IDR → USD saat dipakai di AS",
      `Admin kurs +1,5–2% di setiap transaksi di AS, mis. kurs normal ${rp(rate)} jadi ${rp(rate + markup)} per $1 (+${pct}%)`,
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
      `Promo nasabah baru: bonus $${CHASE_PROMO_BONUS} setelah 10 transaksi dalam 60 hari (lihat bagian Promo di bawah)`,
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
  { label: "Admin kurs", values: [`+${pct}% (rentang 1,5–2%)`, "Gratis", "Gratis"] },
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

// Aplikasi transfer antar mata uang. Biaya & kurs berubah tiap hari —
// selalu bandingkan kuotasi di aplikasi pada hari yang sama.
const idrToUsd: Bank[] = [
  {
    id: "flip",
    name: "Flip",
    kind: "Rupiah → Dollar · Flip Globe",
    role: "Kirim dari Mandiri Rupiah ke rekening Chase dengan alur yang familiar.",
    pros: [
      "Aplikasi Indonesia: bahasa Indonesia, layanan pelanggan lokal, terdaftar di Bank Indonesia",
      "Bayar dari Mandiri Rupiah pakai transfer bank atau virtual account biasa",
      "Biaya dan jumlah yang diterima ditampilkan di depan sebelum konfirmasi",
      "Cocok untuk yang sudah biasa pakai Flip untuk transfer antarbank",
    ],
    cons: [
      "Kurs yang dipakai Flip, bukan kurs tengah, jadi sebagian biaya tersembunyi di selisih kurs",
      "Negara tujuan dan limit per transaksi lebih terbatas, jadi cek dulu apakah tujuan AS dan nominal yang mau dikirim tersedia",
      "Perlu verifikasi identitas (KTP) sebelum transfer luar negeri pertama",
      "Hanya untuk kirim; tidak bisa menyimpan saldo USD di aplikasi",
    ],
  },
  {
    id: "wise",
    name: "Wise",
    kind: "Rupiah → Dollar",
    role: "Biasanya paling hemat untuk mengisi rekening Chase dari Rupiah.",
    pros: [
      "Memakai kurs tengah (sama dengan yang tampil di Google); biayanya terpisah dan transparan, contoh Wise: sekitar Rp62.741 untuk kirim Rp10 juta",
      "Ke Chase biasanya dikirim sebagai transfer lokal AS (ACH), bukan wire internasional, jadi umumnya tidak kena potongan terima $15 dan bisa ikut dihitung sebagai transaksi promo",
      "Bisa menyimpan saldo USD di akun Wise dan dipakai lagi nanti",
      "Bisa dipakai dari Indonesia maupun saat sudah di AS",
    ],
    cons: [
      "Perlu verifikasi identitas (KTP/paspor) yang bisa makan waktu, jadi daftar sebelum butuh",
      "Ada biaya tetap + persentase, jadi kirim kecil-kecil berkali-kali lebih boros daripada sekali kirim besar",
      "Transfer besar bisa diminta dokumen tambahan (mis. bukti sumber dana LPDP)",
      "Bayar pakai transfer bank paling murah tapi bisa lebih lambat dibanding kartu",
    ],
  },
];

const usdToIdr: Bank[] = [
  {
    id: "remitly",
    name: "Remitly",
    kind: "Dollar → Rupiah",
    role: "Kirim sisa dana dari Chase ke Mandiri, BCA, atau e-wallet di Indonesia.",
    pros: [
      "Biaya kirim ke rekening bank Indonesia rendah, sekitar $1,99",
      "Dua pilihan: Economy (dibayar dari rekening Chase, lebih murah) atau Express (dibayar kartu debit, uang sampai dalam hitungan menit)",
      "Kurs promo untuk transfer pertama, berlaku sampai $1.000",
      "Tujuan bisa rekening bank maupun e-wallet",
    ],
    cons: [
      "Kurs tetap mengandung margin di atas kurs tengah",
      "Kurs promo hanya untuk transfer pertama; sisanya pakai kurs biasa",
      "Express lewat kartu lebih mahal dibanding Economy",
      "Transfer besar bisa tertahan untuk pemeriksaan tambahan",
    ],
  },
  {
    id: "panda",
    name: "Panda Remit",
    kind: "Dollar → Rupiah",
    role: "Alternatif dengan kurs yang sering lebih bagus untuk nominal besar.",
    pros: [
      "Margin kurs kecil, sekitar 0,1–0,65% menurut ulasan Finder",
      "Kurs promo untuk pengguna baru",
      "Fokus ke negara Asia, termasuk Indonesia",
      "Layak dibandingkan untuk kirim $1.000 ke atas",
    ],
    cons: [
      "Biaya kirim sekitar $2–8,99, jadi kurang hemat untuk nominal kecil",
      "Kurs yang tampil di situs sering kurs promo pengguna baru, bukan kurs biasa",
      "Kurang dikenal dibanding Remitly atau Wise; layanan pelanggan tidak berbahasa Indonesia",
      "Biaya dan kurs untuk rute AS → Indonesia sebaiknya dicek langsung di aplikasi",
    ],
  },
];

const promoSteps = [
  {
    title: "Tulis email di halaman promo",
    body: "Buka tautan promo, isi alamat email, lalu kirim. Kode promo dikirim ke email tersebut.",
  },
  {
    title: "Tunjukkan email kode promo di cabang",
    body: "Datang ke cabang Chase dan tunjukkan email kode promonya ke banker saat membuka Chase Secure Banking. Bawa dua identitas (paspor + DS-2019/I-20) dan siapkan waktu sekitar 1 jam, atau buat janji dulu.",
  },
  {
    title: "Selesaikan 10 transaksi dalam 60 hari",
    body: "Yang dihitung: belanja pakai kartu debit, Zelle, ACH masuk, Chase QuickDeposit, dan bayar tagihan online. Patungan sewa, HP, dan WiFi lewat Zelle juga termasuk.",
  },
  {
    title: `Bonus $${CHASE_PROMO_BONUS} masuk dalam 15 hari`,
    body: "Bonus dikirim ke rekening paling lambat 15 hari setelah 10 transaksi tercatat. Bonus dilaporkan sebagai bunga (formulir pajak 1042-S untuk non-resident).",
  },
];

const steps = [
  {
    title: "Sebelum berangkat",
    body: "Tentukan mata uang pencairan ke LPDP. Kalau memilih USD ke Mandiri, buka Tabungan Mandiri Multicurrency lewat Livin', tambahkan saldo USD, lalu hubungkan kartu debit Mandiri yang sudah kamu punya ke saldo USD tersebut. Kalau memilih USD ke Chase, siapkan dulu rekening Chase-nya (langkah berikut) sebelum data rekening diserahkan ke LPDP.",
  },
  {
    title: "Minggu pertama di Riverside",
    body: `Daftarkan email di halaman promo Chase untuk dapat kode promo $${CHASE_PROMO_BONUS}, lalu buka rekening Chase Secure Banking di cabang terdekat. Tunjukkan email kode promo ke banker, bawa paspor, DS-2019/I-20, dan bukti alamat AS. Aktifkan Zelle dengan nomor HP AS.`,
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

        {/* Promo Chase */}
        <section id="promo-chase" className="scroll-mt-20 pt-10 sm:pt-14">
          <div className="overflow-hidden rounded-lg border border-gold/40 bg-surface">
            <div className="flex flex-col gap-4 border-b border-line bg-gold-soft px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-gold">
                  Promo Chase · berlaku s.d. 27 Jan 2027
                </p>
                <h2 className="mt-1 font-display text-xl font-semibold text-ink sm:text-display-sm">
                  Bonus ${CHASE_PROMO_BONUS} buka rekening Chase
                </h2>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-muted">
                  Untuk nasabah baru Chase Secure Banking. Cukup tulis email di halaman promo, lalu tunjukkan email
                  kode promonya ke banker di kantor cabang.
                </p>
              </div>
              <a
                href={CHASE_PROMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-brand-on shadow-subtle transition hover:bg-brand-hover"
              >
                Ambil kode promo
                <Icon name="arrow-up-right" className="h-4 w-4" />
              </a>
            </div>
            <ol className="divide-y divide-line">
              {promoSteps.map((p, i) => (
                <li key={p.title} className="grid grid-cols-[auto_1fr] gap-x-4 px-4 py-3.5 sm:px-5">
                  <span className="tnum font-display text-sm font-semibold text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">{p.title}</span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-ink-muted">{p.body}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="flex gap-2 border-t border-line bg-warn-soft px-4 py-3 text-xs leading-relaxed text-ink sm:px-5">
              <Icon name="alert" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warn" />
              <span>
                Bonus hanya dibayar kalau rekening masih terbuka saat pencairan. Program selesai 25 Des, jadi kejar 10
                transaksi secepatnya dan jangan tutup rekening sebelum bonus masuk. Promo tidak berlaku bagi yang
                sudah punya rekening checking Chase.
              </span>
            </p>
          </div>
        </section>

        {/* Transfer antar mata uang */}
        <section id="transfer" className="scroll-mt-20 pt-10 sm:pt-14">
          <h2 className="font-display text-xl font-semibold text-ink sm:text-display-sm">Transfer antar mata uang</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
            Kalau dana diterima dalam Rupiah tapi perlu Dollar di rekening Chase, atau sebaliknya ingin mengirim sisa
            Dollar pulang ke Indonesia.
          </p>

          <h3 className="mt-6 flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-eyebrow text-gold sm:mt-8">
            Rupiah → Dollar
            <span className="h-px flex-1 bg-line" />
          </h3>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {idrToUsd.map((b) => (
              <BankCard key={b.id} bank={b} />
            ))}
          </div>

          <h3 className="mt-8 flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-eyebrow text-gold">
            Dollar → Rupiah
            <span className="h-px flex-1 bg-line" />
          </h3>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {usdToIdr.map((b) => (
              <BankCard key={b.id} bank={b} />
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-brand/30 bg-brand-soft px-4 py-4 sm:px-5">
            <p className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-eyebrow text-brand">
              <Icon name="bulb" className="h-4 w-4" />
              Tips memilih
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink">
              <li>
                Bandingkan <strong>jumlah yang diterima</strong>, bukan hanya biayanya. Kurs yang jelek bisa lebih mahal
                daripada biaya kirim.
              </li>
              <li>Cek kuotasi di kedua aplikasi pada hari dan jam yang sama, karena kurs bergerak terus.</li>
              <li>Kirim sekali dalam jumlah besar lebih hemat daripada berkali-kali, karena ada biaya tetap per transfer.</li>
              <li>
                Daftar dan selesaikan verifikasi identitas sebelum benar-benar butuh, karena verifikasi bisa makan waktu
                beberapa hari.
              </li>
            </ul>
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
                Rupiah, dana yang masuk dianggap ${(MONTHLY * MONTHS).toLocaleString("id-ID")} × kurs normal, karena
                LPDP mengonversinya dengan kurs dolar saat pencairan.
              </li>
              <li>
                Seluruh dana bulanan ditarik tunai atau dibelanjakan di AS. Jumlah tarikan dibagi rata, jadi
                tarik 2× berarti $1.000 sekali tarik.
              </li>
              <li>
                Mandiri Rupiah: setiap dolar dibeli dengan kurs normal + admin kurs {pct}% (mis. {rp(rate)} +{" "}
                {rp(markup)}). Kurs normal diambil otomatis dari kuotasi pasar USD/IDR (setara yang tampil di
                Google) dan diperbarui tiap 10 menit; bisa diganti manual.
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
                Apakah transfer LPDP dihitung sebagai &quot;qualifying deposit&quot; $250 yang membebaskan biaya bulanan
                Chase $4,95. Kalau ya, biaya bulanan Chase bisa jadi $0.
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
