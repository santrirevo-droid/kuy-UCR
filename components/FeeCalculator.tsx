"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import Icon from "@/components/Icon";
import { input, label } from "@/lib/ui";
import { DEFAULT_ASSUMPTIONS, MONTHS, MONTHLY_USD, computeCosts, type Assumptions, type BankCost } from "@/lib/dana-lpdp";

const usd = (n: number) => `$${n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const idr = (n: number) => `Rp${Math.round(n).toLocaleString("id-ID")}`;
const money = (n: number, c: BankCost["currency"]) => (c === "IDR" ? idr(n) : usd(n));

// Kalkulator biaya admin: tiga rekening dihitung dari asumsi yang sama,
// pengunjung bisa mengubah kurs, markup, dan frekuensi tarik tunai.
export default function FeeCalculator() {
  const [a, setA] = useState<Assumptions>(DEFAULT_ASSUMPTIONS);
  const costs = useMemo(() => computeCosts(a), [a]);
  const best = costs.reduce((b, c) => (c.spendableUsd > b.spendableUsd ? c : b));
  const markupPct = ((a.markup / a.rate) * 100).toFixed(2).replace(".", ",");

  const set = (key: keyof Assumptions) => (e: ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value.replace(/\D/g, ""));
    setA((p) => ({ ...p, [key]: Math.max(key === "rate" ? 1 : 0, Number.isFinite(v) ? v : 0) }));
  };

  return (
    <div>
      <div className="grid gap-4 rounded-lg border border-line bg-surface p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
        <div>
          <label htmlFor="rate" className={label}>
            Kurs normal (Rp/$)
          </label>
          <input id="rate" inputMode="numeric" className={`${input} tnum mt-1.5`} value={a.rate} onChange={set("rate")} />
        </div>
        <div>
          <label htmlFor="markup" className={label}>
            Admin kurs (Rp/$)
          </label>
          <input
            id="markup"
            inputMode="numeric"
            className={`${input} tnum mt-1.5`}
            value={a.markup}
            onChange={set("markup")}
          />
          <p className="tnum mt-1 text-xs text-ink-subtle">≈ {markupPct}% di atas kurs normal</p>
        </div>
        <div>
          <label htmlFor="idr" className={label}>
            Dana Rupiah 3 bulan
          </label>
          <input
            id="idr"
            inputMode="numeric"
            className={`${input} tnum mt-1.5`}
            value={a.idrReceived}
            onChange={set("idrReceived")}
          />
          <p className="mt-1 text-xs text-ink-subtle">Hanya untuk Mandiri Rupiah</p>
        </div>
        <div>
          <span className={label}>Tarik tunai / bulan</span>
          <div className="mt-1.5 flex items-center gap-2">
            <button
              type="button"
              aria-label="Kurangi"
              className="h-10 w-10 rounded-md border border-line text-ink transition hover:border-line-strong disabled:opacity-40"
              disabled={a.withdrawalsPerMonth <= 1}
              onClick={() => setA((p) => ({ ...p, withdrawalsPerMonth: p.withdrawalsPerMonth - 1 }))}
            >
              −
            </button>
            <span className="tnum w-10 text-center text-lg font-semibold text-ink">{a.withdrawalsPerMonth}×</span>
            <button
              type="button"
              aria-label="Tambah"
              className="flex h-10 w-10 items-center justify-center rounded-md border border-line text-ink transition hover:border-line-strong disabled:opacity-40"
              disabled={a.withdrawalsPerMonth >= 10}
              onClick={() => setA((p) => ({ ...p, withdrawalsPerMonth: p.withdrawalsPerMonth + 1 }))}
            >
              <Icon name="plus" className="h-4 w-4" />
            </button>
          </div>
          <p className="tnum mt-1 text-xs text-ink-subtle">
            ≈ {usd(MONTHLY_USD / Math.max(1, a.withdrawalsPerMonth))} sekali tarik
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {costs.map((c) => (
          <article
            key={c.id}
            className={`flex flex-col rounded-lg border bg-surface ${c.id === best.id ? "border-success/50" : "border-line"}`}
          >
            <header className="flex items-start justify-between gap-2 border-b border-line px-4 py-3.5">
              <span>
                <span className="block font-display text-base font-semibold text-ink">{c.name}</span>
                <span className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-ink-subtle">
                  Saldo {c.currency === "IDR" ? "Rupiah" : "USD"}
                </span>
              </span>
              {c.id === best.id && (
                <span className="rounded bg-success-soft px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-eyebrow text-success">
                  Paling hemat
                </span>
              )}
            </header>

            <div className="flex-1 px-4 py-3">
              {c.oneTime.length > 0 && (
                <>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-ink-subtle">Biaya sekali</p>
                  <ul className="mb-4 mt-2 space-y-2">
                    {c.oneTime.map((l) => (
                      <li key={l.label} className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="min-w-0">
                          <span className="block text-ink">{l.label}</span>
                          <span className="tnum block text-xs text-ink-subtle">{l.detail}</span>
                        </span>
                        <span className="tnum shrink-0 text-ink">{money(l.amount, c.currency)}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <p className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-ink-subtle">Biaya per bulan</p>
              <ul className="mt-2 space-y-2">
                {c.monthly.map((l) => (
                  <li key={l.label} className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="min-w-0">
                      <span className="block text-ink">{l.label}</span>
                      <span className="tnum block text-xs text-ink-subtle">{l.detail}</span>
                    </span>
                    <span className="tnum shrink-0 text-ink">{money(l.amount, c.currency)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <dl className="border-t border-line px-4 py-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-ink-muted">Total / bulan</dt>
                <dd className="tnum font-semibold text-ink">{money(c.monthlyTotal, c.currency)}</dd>
              </div>
              <div className="mt-1.5 flex justify-between gap-3">
                <dt className="text-ink-muted">Total {MONTHS} bulan</dt>
                <dd className="tnum font-semibold text-ink">
                  {money(c.totalFees, c.currency)}
                  {c.currency === "IDR" && (
                    <span className="block text-right text-xs font-normal text-ink-subtle">≈ {usd(c.totalFeesUsd)}</span>
                  )}
                </dd>
              </div>
              <div className="mt-3 flex justify-between gap-3 border-t border-line pt-3">
                <dt className="text-ink-muted">Bisa dipakai di AS</dt>
                <dd className={`tnum font-semibold ${c.id === best.id ? "text-success" : "text-ink"}`}>
                  {usd(c.spendableUsd)}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}
