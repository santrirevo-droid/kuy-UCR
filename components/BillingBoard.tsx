"use client";

import { useMemo, useState } from "react";
import Icon from "@/components/Icon";
import type { BillItem, PaymentMap } from "@/lib/billing";

type Month = { key: string; label: string; short: string };

const usd = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
const field = (billId: string, month: string) => `${billId}|${month}`;
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

function telUrl(phone: string) {
  return `tel:+1${phone.replace(/\D/g, "")}`;
}

// Papan tagihan: satu baris per tagihan, satu kolom per bulan. Admin bisa
// klik sel untuk menandai lunas/belum; pengunjung lain hanya melihat.
export default function BillingBoard({
  sections,
  months,
  initialPayments,
  editable,
}: {
  sections: { id: string; title: string; note: string; bills: BillItem[] }[];
  months: Month[];
  initialPayments: PaymentMap;
  editable: boolean;
}) {
  const [payments, setPayments] = useState<PaymentMap>(initialPayments);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const allBills = useMemo(() => sections.flatMap((s) => s.bills), [sections]);

  const stats = useMemo(() => {
    const perMonth = months.map((m) => {
      const due = allBills.reduce((n, b) => n + b.amount, 0);
      const paid = allBills.reduce((n, b) => n + (payments[field(b.id, m.key)] ? b.amount : 0), 0);
      return { ...m, due, paid };
    });
    const due = perMonth.reduce((n, m) => n + m.due, 0);
    const paid = perMonth.reduce((n, m) => n + m.paid, 0);
    return { perMonth, due, paid };
  }, [allBills, months, payments]);

  async function toggle(bill: BillItem, month: string) {
    if (!editable || pending) return;
    const key = field(bill.id, month);
    const wasPaid = Boolean(payments[key]);
    setPending(key);
    setError(null);
    // Optimistis — dikembalikan kalau server menolak.
    setPayments((p) => {
      const next = { ...p };
      if (wasPaid) delete next[key];
      else next[key] = new Date().toISOString();
      return next;
    });
    try {
      const res = await fetch("/api/billing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billId: bill.id, month, paid: !wasPaid }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan");
      if (data.paidAt) setPayments((p) => ({ ...p, [key]: data.paidAt }));
    } catch (e) {
      setPayments((p) => {
        const next = { ...p };
        if (wasPaid) next[key] = payments[key];
        else delete next[key];
        return next;
      });
      setError(e instanceof Error ? e.message : "Gagal menyimpan");
    } finally {
      setPending(null);
    }
  }

  const pct = stats.due > 0 ? Math.round((stats.paid / stats.due) * 100) : 0;

  return (
    <div>
      {/* Ringkasan */}
      <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
        <div className="bg-surface px-4 py-4 sm:col-span-1">
          <p className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-ink-subtle">Terkumpul</p>
          <p className="tnum mt-1.5 font-display text-2xl font-semibold text-ink">
            {usd(stats.paid)}
            <span className="text-base text-ink-subtle"> / {usd(stats.due)}</span>
          </p>
          <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className={`h-1 rounded-full transition-all duration-500 ${pct === 100 ? "bg-success" : "bg-brand"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="tnum mt-1.5 text-xs text-ink-muted">
            {pct}% · sisa {usd(stats.due - stats.paid)}
          </p>
        </div>
        {stats.perMonth.map((m) => (
          <div key={m.key} className="bg-surface px-4 py-4">
            <p className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-ink-subtle">{m.label} 2026</p>
            <p className="tnum mt-1.5 text-lg font-semibold text-ink">
              {usd(m.paid)}
              <span className="text-sm font-medium text-ink-subtle"> / {usd(m.due)}</span>
            </p>
            <p className={`tnum mt-1 text-xs ${m.paid >= m.due ? "font-semibold text-success" : "text-ink-muted"}`}>
              {m.paid >= m.due ? "Lunas semua" : `Kurang ${usd(m.due - m.paid)}`}
            </p>
          </div>
        ))}
      </div>

      {editable ? (
        <p className="mt-4 flex items-center gap-2 rounded-md border border-brand/30 bg-brand-soft px-3.5 py-2.5 text-sm text-brand">
          <Icon name="pencil" className="h-4 w-4 shrink-0" />
          Mode admin — klik sel bulan untuk menandai <b>Lunas</b> / <b>Belum</b>. Tersimpan otomatis.
        </p>
      ) : null}
      {error && (
        <p className="mt-3 rounded-md border border-danger/30 bg-danger-soft px-3.5 py-2.5 text-sm text-danger">{error}</p>
      )}

      {sections.map((s) => (
        <section key={s.id} className="mt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="font-display text-display-sm font-semibold text-ink">{s.title}</h2>
            <span className="text-sm text-ink-muted">{s.note}</span>
          </div>
          <div className="mt-4 overflow-x-auto rounded-lg border border-line">
            <table className="w-full min-w-[30rem] text-left text-sm">
              <thead className="bg-surface-2">
                <tr className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-ink-subtle">
                  <th className="px-3 py-3 sm:px-4">{s.id === "wifi" ? "Rumah" : "Pemegang nomor"}</th>
                  {months.map((m) => (
                    <th key={m.key} className="w-[5.5rem] px-1.5 py-3 text-center">
                      {m.short}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-surface">
                {s.bills.map((b) => (
                  <tr key={b.id}>
                    <td className="px-3 py-2.5 sm:px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="h-6 w-1 shrink-0 rounded-full" style={{ background: b.houseColor }} />
                        <div className="min-w-0">
                          <p className="font-semibold text-ink">{b.title}</p>
                          <p className="text-xs text-ink-muted">
                            {b.phone ? (
                              <a href={telUrl(b.phone)} className="tnum hover:text-brand">
                                {b.phone}
                              </a>
                            ) : null}
                            {b.phone ? " · " : null}
                            {b.subtitle}
                          </p>
                        </div>
                      </div>
                    </td>
                    {months.map((m) => {
                      const key = field(b.id, m.key);
                      const paidAt = payments[key];
                      const cls = `inline-flex h-8 w-full max-w-[4.75rem] items-center justify-center gap-1 rounded-md text-xs font-semibold transition ${
                        paidAt
                          ? "bg-success-soft text-success"
                          : "border border-dashed border-line-strong text-ink-subtle"
                      }`;
                      const label = paidAt ? (
                        <>
                          <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.2} />
                          Lunas
                        </>
                      ) : (
                        `${usd(b.amount)}`
                      );
                      const title = paidAt ? `Lunas · ditandai ${fmtDate(paidAt)}` : `Belum dibayar (${usd(b.amount)})`;
                      return (
                        <td key={m.key} className="px-1.5 py-2.5 text-center">
                          {editable ? (
                            <button
                              onClick={() => toggle(b, m.key)}
                              disabled={pending === key}
                              title={title}
                              aria-pressed={Boolean(paidAt)}
                              aria-label={`${b.title} ${m.label}: ${paidAt ? "lunas" : "belum"}`}
                              className={`${cls} ${paidAt ? "hover:bg-success hover:text-white" : "hover:border-brand hover:text-brand"} disabled:opacity-60`}
                            >
                              {label}
                            </button>
                          ) : (
                            <span title={title} className={cls}>
                              {label}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
