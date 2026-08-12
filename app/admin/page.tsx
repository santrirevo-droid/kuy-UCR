import Link from "next/link";
import { stages } from "@/lib/stages";
import { getStageMarkdown } from "@/lib/content";
import { getAllUsers } from "@/lib/users";
import { getStageProgress, countChecklistItems } from "@/lib/progress";
import AdminNav from "@/components/AdminNav";

export const dynamic = "force-dynamic";

function cellColor(pct: number) {
  if (pct >= 100) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300";
  if (pct > 0) return "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300";
  return "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500";
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
    <div className="min-h-screen bg-orange-50/40 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl px-5 py-8">
        <AdminNav />

        <h1 className="mt-6 font-heading text-2xl font-extrabold text-slate-900 dark:text-white">
          📊 Progres Peserta
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Ringkasan checklist yang sudah dicentang tiap peserta di setiap tahap.
        </p>

        {dbError && (
          <div className="mt-6 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 p-5 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-200">
            ⚠️ Database (Vercel KV) belum tersambung ke project ini, jadi data progres belum bisa dibaca. Sambungkan
            dulu lewat Vercel Dashboard → Storage → Create Database → KV → Connect Project, lalu redeploy.
          </div>
        )}

        {!dbError && users.length === 0 && (
          <div className="mt-6 rounded-2xl border-2 border-dashed border-slate-300 bg-white/60 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
            Belum ada user peserta. Buat akun pertama di{" "}
            <Link href="/admin/users" className="font-semibold text-orange-600 hover:underline dark:text-orange-400">
              Kelola User
            </Link>
            .
          </div>
        )}

        {!dbError && users.length > 0 && (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-orange-100 bg-white/70 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="bg-orange-50 dark:bg-slate-800">
                  <th className="sticky left-0 border-b border-orange-100 bg-orange-50 px-4 py-3 text-left font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    Peserta
                  </th>
                  {stages.map((s) => (
                    <th
                      key={s.slug}
                      title={s.title}
                      className="border-b border-orange-100 px-2 py-3 text-center font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                    >
                      <span className="text-base">{s.icon}</span>
                    </th>
                  ))}
                  <th className="border-b border-orange-100 px-4 py-3 text-center font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ user, doneMap, totalDone }) => (
                  <tr key={user.username} className="border-b border-orange-50 last:border-0 dark:border-slate-800">
                    <td className="sticky left-0 bg-white px-4 py-3 font-medium text-slate-800 dark:bg-slate-900 dark:text-slate-100">
                      {user.name}
                      <div className="text-xs font-normal text-slate-400">@{user.username}</div>
                    </td>
                    {stages.map((s) => {
                      const total = totalMap[s.slug] || 0;
                      const done = doneMap[s.slug] || 0;
                      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                      return (
                        <td key={s.slug} className="px-2 py-3 text-center">
                          <span className={`inline-block min-w-[3rem] rounded-full px-2 py-1 text-xs font-bold ${cellColor(pct)}`}>
                            {done}/{total}
                          </span>
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block min-w-[3.5rem] rounded-full px-2.5 py-1 text-xs font-bold ${cellColor(
                          grandTotal > 0 ? Math.round((totalDone / grandTotal) * 100) : 0
                        )}`}
                      >
                        {grandTotal > 0 ? Math.round((totalDone / grandTotal) * 100) : 0}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/"
            className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            ← Lihat situs publik
          </Link>
        </div>
      </div>
    </div>
  );
}
