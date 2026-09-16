import Link from "next/link";
import { stages } from "@/lib/stages";
import { getStageMarkdown } from "@/lib/content";
import { getAllUsers } from "@/lib/users";
import { getStageProgress, countChecklistItems } from "@/lib/progress";
import AdminNav from "@/components/AdminNav";
import Icon from "@/components/Icon";
import { card, eyebrow } from "@/lib/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Progres Peserta" };

// Satu sel = progres satu peserta di satu tahap: angka + meter tipis.
function ProgressCell({ done, total }: { done: number; total: number }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const complete = total > 0 && done >= total;
  const started = done > 0;

  return (
    <span className="inline-flex flex-col items-center gap-1.5">
      <span
        className={`tnum text-xs font-semibold ${
          complete ? "text-success" : started ? "text-ink" : "text-ink-subtle"
        }`}
      >
        {done}/{total}
      </span>
      <span className="block h-0.5 w-9 overflow-hidden rounded-full bg-surface-2">
        <span
          className={`block h-0.5 rounded-full ${complete ? "bg-success" : "bg-brand"}`}
          style={{ width: `${pct}%` }}
        />
      </span>
    </span>
  );
}

export default async function AdminProgressPage() {
  let dbError = false;
  let users: Awaited<ReturnType<typeof getAllUsers>> = [];
  try {
    users = await getAllUsers();
  } catch {
    dbError = true;
  }

  // Total item checklist per tahap — dihitung sekali dari konten aktif.
  const totals = await Promise.all(
    stages.map(async (s) => ({ slug: s.slug, total: countChecklistItems(await getStageMarkdown(s.slug)) }))
  );
  const totalMap = Object.fromEntries(totals.map((t) => [t.slug, t.total]));
  const grandTotal = totals.reduce((sum, t) => sum + t.total, 0);

  const rows = dbError
    ? []
    : await Promise.all(
        users.map(async (u) => {
          const perStage = await Promise.all(
            stages.map(async (s) => {
              const done = await getStageProgress(u.username, s.slug).catch(() => []);
              return { slug: s.slug, done: done.length };
            })
          );
          const doneMap = Object.fromEntries(perStage.map((p) => [p.slug, p.done]));
          const totalDone = perStage.reduce((sum, p) => sum + p.done, 0);
          return { user: u, doneMap, totalDone };
        })
      );

  return (
    <div className="min-h-screen bg-canvas">
      <AdminNav />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
          <div>
            <p className={eyebrow}>Rekapitulasi</p>
            <h1 className="mt-2.5 font-display text-display-sm font-semibold text-ink">Progres peserta</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
              Jumlah item checklist yang sudah dicentang tiap peserta di setiap tahap.
            </p>
          </div>
          {!dbError && users.length > 0 && (
            <dl className="flex gap-6">
              <div>
                <dt className={eyebrow}>Peserta</dt>
                <dd className="tnum mt-1.5 font-display text-2xl font-semibold text-ink">{users.length}</dd>
              </div>
              <div>
                <dt className={eyebrow}>Item / orang</dt>
                <dd className="tnum mt-1.5 font-display text-2xl font-semibold text-ink">{grandTotal}</dd>
              </div>
            </dl>
          )}
        </div>

        {dbError && (
          <div className="mt-8 flex items-start gap-3 rounded-lg border border-warn/35 bg-warn-soft px-5 py-4 text-sm leading-relaxed text-ink">
            <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
            <span>
              Database belum tersambung ke project ini, jadi data progres belum bisa dibaca. Sambungkan lewat Vercel
              Dashboard → Storage → Create Database → Redis → Connect Project, lalu redeploy.
            </span>
          </div>
        )}

        {!dbError && users.length === 0 && (
          <div className="mt-8 rounded-lg border border-dashed border-line-strong px-6 py-10 text-center">
            <p className="text-sm text-ink-muted">
              Belum ada akun peserta. Buat akun pertama di{" "}
              <Link href="/admin/users" className="font-semibold text-brand underline underline-offset-2">
                Kelola User
              </Link>
              .
            </p>
          </div>
        )}

        {!dbError && users.length > 0 && (
          <div className={`${card} mt-8 overflow-x-auto`}>
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="bg-surface-2">
                  <th className="sticky left-0 z-10 border-b border-line bg-surface-2 px-5 py-3 text-left text-[0.62rem] font-semibold uppercase tracking-eyebrow text-ink-muted">
                    Peserta
                  </th>
                  {stages.map((s) => (
                    <th key={s.slug} title={s.title} className="border-b border-line px-2 py-3 text-center">
                      <span className="flex justify-center text-ink-muted">
                        <Icon name={s.icon} className="h-4 w-4" />
                      </span>
                    </th>
                  ))}
                  <th className="border-b border-line px-5 py-3 text-right text-[0.62rem] font-semibold uppercase tracking-eyebrow text-ink-muted">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ user, doneMap, totalDone }) => {
                  const pct = grandTotal > 0 ? Math.round((totalDone / grandTotal) * 100) : 0;
                  return (
                    <tr key={user.username} className="border-b border-line last:border-0 hover:bg-surface-2/50">
                      <td className="sticky left-0 z-10 bg-surface px-5 py-3.5">
                        <span className="block font-medium text-ink">{user.name}</span>
                        <span className="block text-xs text-ink-subtle">@{user.username}</span>
                      </td>
                      {stages.map((s) => (
                        <td key={s.slug} className="px-2 py-3.5 text-center">
                          <ProgressCell done={doneMap[s.slug] || 0} total={totalMap[s.slug] || 0} />
                        </td>
                      ))}
                      <td className="px-5 py-3.5 text-right">
                        <span
                          className={`tnum font-display text-base font-semibold ${
                            pct === 100 ? "text-success" : pct > 0 ? "text-ink" : "text-ink-subtle"
                          }`}
                        >
                          {pct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
