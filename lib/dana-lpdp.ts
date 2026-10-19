// Asumsi biaya admin untuk halaman /dana-lpdp. Semua angka berasal dari
// catatan peserta (Okt 2026) dan bisa berubah — cek ulang ke bank sebelum
// dipakai sebagai patokan.

export const MONTHLY_USD = 2000;
export const MONTHS = 3;
export const TOTAL_USD = MONTHLY_USD * MONTHS;

export type Assumptions = {
  /** Total dana yang masuk ke Mandiri Rupiah selama 3 bulan. */
  idrReceived: number;
  /** Kurs normal (tengah) Rp per $1. */
  rate: number;
  /** Tambahan kurs dari jaringan kartu + bank, Rp per $1. */
  markup: number;
  /** Berapa kali tarik tunai di ATM AS setiap bulan. */
  withdrawalsPerMonth: number;
};

export const DEFAULT_ASSUMPTIONS: Assumptions = {
  idrReceived: 107_840_000,
  rate: 17_800,
  markup: 324,
  withdrawalsPerMonth: 1,
};

/** Biaya ATM pemilik mesin di AS, mis. SchoolsFirst FCU. */
export const US_ATM_FEE = 3;
/** Mandiri Rupiah: biaya tarik tunai di ATM luar negeri. */
export const MANDIRI_IDR_ATM_FEE = 25_000;
/** Mandiri Multicurrency: biaya bulanan saldo USD dan biaya tarik tunai luar negeri. */
export const MULTI_MONTHLY_FEE = 1;
export const MULTI_ATM_FEE = 2;
/** Chase Secure Banking: biaya terima transfer internasional dan biaya bulanan. */
export const CHASE_INCOMING_WIRE_FEE = 15;
export const CHASE_MONTHLY_FEE = 4.95;

export type FeeLine = { label: string; detail: string; amount: number };

export type BankCost = {
  id: "idr" | "multi" | "chase";
  name: string;
  currency: "IDR" | "USD";
  /** Biaya sekali bayar selama program (mis. potongan dana masuk). */
  oneTime: FeeLine[];
  /** Rincian biaya per bulan, dalam mata uang rekening. */
  monthly: FeeLine[];
  monthlyTotal: number;
  totalFees: number;
  /** Biaya 3 bulan dalam USD, untuk perbandingan lintas bank. */
  totalFeesUsd: number;
  /** Dolar yang benar-benar bisa dipakai di AS setelah semua biaya, selama 3 bulan. */
  spendableUsd: number;
};

export function computeCosts(a: Assumptions): BankCost[] {
  const n = Math.max(0, Math.round(a.withdrawalsPerMonth));
  const cardRate = a.rate + a.markup;

  // Mandiri Rupiah: tiap dolar yang ditarik dibeli dengan kurs + markup.
  const idrMonthly: FeeLine[] = [
    {
      label: "Selisih kurs",
      detail: `$${MONTHLY_USD.toLocaleString("id-ID")} × Rp${a.markup.toLocaleString("id-ID")}`,
      amount: MONTHLY_USD * a.markup,
    },
    {
      label: "Admin Mandiri tarik tunai",
      detail: `${n} × Rp${MANDIRI_IDR_ATM_FEE.toLocaleString("id-ID")}`,
      amount: n * MANDIRI_IDR_ATM_FEE,
    },
    {
      label: "Admin ATM AS",
      detail: `${n} × $${US_ATM_FEE}, dikonversi Rp${cardRate.toLocaleString("id-ID")}`,
      amount: n * US_ATM_FEE * cardRate,
    },
  ];
  const idrMonthlyTotal = sum(idrMonthly);
  const idrTotal = idrMonthlyTotal * MONTHS;
  // Biaya tetap (di luar selisih kurs) dipotong dari saldo Rupiah, sisanya
  // dibelanjakan dengan kurs kartu.
  const idrFixedTotal = (idrMonthly[1].amount + idrMonthly[2].amount) * MONTHS;
  const idrSpendable = (a.idrReceived - idrFixedTotal) / cardRate;

  const multiMonthly: FeeLine[] = [
    { label: "Biaya bulanan saldo USD", detail: "1 × $1", amount: MULTI_MONTHLY_FEE },
    { label: "Admin Mandiri tarik tunai", detail: `${n} × $${MULTI_ATM_FEE}`, amount: n * MULTI_ATM_FEE },
    { label: "Admin ATM AS", detail: `${n} × $${US_ATM_FEE}`, amount: n * US_ATM_FEE },
  ];
  const multiTotal = sum(multiMonthly) * MONTHS;

  // Dana LPDP $6.000 masuk sekali di bulan pertama, jadi potongan terima
  // transfer hanya terjadi satu kali.
  const chaseOneTime: FeeLine[] = [
    {
      label: "Potongan terima transfer",
      detail: `1 × $${CHASE_INCOMING_WIRE_FEE}, saat $${TOTAL_USD.toLocaleString("id-ID")} masuk`,
      amount: CHASE_INCOMING_WIRE_FEE,
    },
  ];
  const chaseMonthly: FeeLine[] = [
    { label: "Biaya bulanan", detail: `1 × $${CHASE_MONTHLY_FEE.toLocaleString("id-ID")}`, amount: CHASE_MONTHLY_FEE },
    { label: "Tarik tunai di ATM Chase", detail: `${n} × $0`, amount: 0 },
  ];
  const chaseTotal = sum(chaseOneTime) + sum(chaseMonthly) * MONTHS;

  return [
    {
      id: "idr",
      name: "Mandiri Rupiah",
      currency: "IDR",
      oneTime: [],
      monthly: idrMonthly,
      monthlyTotal: idrMonthlyTotal,
      totalFees: idrTotal,
      totalFeesUsd: idrTotal / a.rate,
      spendableUsd: idrSpendable,
    },
    {
      id: "multi",
      name: "Mandiri Multicurrency",
      currency: "USD",
      oneTime: [],
      monthly: multiMonthly,
      monthlyTotal: sum(multiMonthly),
      totalFees: multiTotal,
      totalFeesUsd: multiTotal,
      spendableUsd: TOTAL_USD - multiTotal,
    },
    {
      id: "chase",
      name: "Chase",
      currency: "USD",
      oneTime: chaseOneTime,
      monthly: chaseMonthly,
      monthlyTotal: sum(chaseMonthly),
      totalFees: chaseTotal,
      totalFeesUsd: chaseTotal,
      spendableUsd: TOTAL_USD - chaseTotal,
    },
  ];
}

function sum(lines: FeeLine[]) {
  return lines.reduce((n, l) => n + l.amount, 0);
}
