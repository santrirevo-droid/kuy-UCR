import Link from "next/link";
import { isAdmin } from "@/lib/admin-session";
import { BILLING_MONTHS, PHONE_FEE, WIFI_FEE, getPayments, phoneBills, wifiBills, type PaymentMap } from "@/lib/billing";
import BillingBoard from "@/components/BillingBoard";
import Icon from "@/components/Icon";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import UserBadge from "@/components/UserBadge";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tagihan Bulanan",
  description: "Rekap pembayaran nomor HP ($20/bulan) dan WiFi rumah ($50/bulan) rombongan PKUMI–LPDP di Riverside.",
};

export default async function BillingPage() {
  const admin = isAdmin();
  let payments: PaymentMap = {};
  let dbError = false;
  try {
    payments = await getPayments();
  } catch {
    dbError = true;
  }

  const facts = [
    { label: "Nomor HP", value: `${phoneBills.length} × $${PHONE_FEE}/bln` },
    { label: "WiFi rumah", value: `${wifiBills.length} × $${WIFI_FEE}/bln` },
    { label: "Periode", value: "Okt – Des 2026" },
    {
      label: "Total / bulan",
      value: `$${phoneBills.length * PHONE_FEE + wifiBills.length * WIFI_FEE}`,
    },
  ];

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
              <Icon name="wallet" className="h-5 w-5" />
            </span>
            <span className="flex flex-col">
              <span className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-ink-subtle">
                Laporan Bendahara
              </span>
              <span className="mt-0.5 text-sm font-medium text-gold">Iuran bulanan</span>
            </span>
          </div>

          <h1 className="mt-4 font-display sm:mt-6 text-display-xs font-semibold text-ink sm:text-display-md">
            Tagihan Nomor HP &amp; WiFi
          </h1>
          <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-ink-muted sm:text-lg">
            Rekap pembayaran tiga bulan ke depan: paket nomor HP Amerika ${PHONE_FEE}/bulan per nomor dan WiFi rumah $
            {WIFI_FEE}/bulan per rumah.
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

        <div className="pt-7 sm:pt-10">
          {dbError ? (
            <p className="rounded-lg border border-warn/30 bg-warn-soft px-4 py-3.5 text-sm text-ink">
              Database belum tersambung, jadi status pembayaran belum bisa ditampilkan. Sambungkan Redis lewat Vercel
              Storage lalu redeploy.
            </p>
          ) : (
            <BillingBoard
              months={BILLING_MONTHS.map((m) => ({ ...m }))}
              initialPayments={payments}
              editable={admin}
              sections={[
                {
                  id: "phone",
                  title: "Nomor HP",
                  note: `$${PHONE_FEE} per nomor / bulan`,
                  bills: phoneBills,
                },
                {
                  id: "wifi",
                  title: "WiFi rumah",
                  note: `$${WIFI_FEE} per rumah / bulan, dibagi rata penghuni`,
                  bills: wifiBills,
                },
              ]}
            />
          )}
        </div>

        <p className="mt-10 border-t border-line pt-6 sm:mt-12 text-xs leading-relaxed text-ink-subtle">
          {admin ? (
            "Anda masuk sebagai admin — perubahan status langsung terlihat oleh semua orang."
          ) : (
            <>
              Status pembayaran hanya bisa diubah admin.{" "}
              <Link href="/masuk" className="underline hover:text-brand">
                Masuk sebagai admin
              </Link>{" "}
              untuk memperbarui. Ada yang salah catat? Hubungi bendahara.
            </>
          )}
        </p>
      </main>
    </div>
  );
}
