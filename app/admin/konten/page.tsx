import Link from "next/link";
import { stages, stageNumber } from "@/lib/stages";
import AdminNav from "@/components/AdminNav";
import Icon from "@/components/Icon";
import { eyebrow } from "@/lib/ui";

export const metadata = { title: "Kelola Konten" };

export default function AdminKontenPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <AdminNav />

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="border-b border-line pb-6">
          <p className={eyebrow}>Editor</p>
          <h1 className="mt-2.5 font-display text-display-sm font-semibold text-ink">Kelola konten</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
            Pilih tahap yang ingin diedit. Perubahan tersimpan ke GitHub dan tampil di halaman publik dalam hitungan
            detik — tanpa perlu redeploy.
          </p>
        </div>

        <ul className="mt-2">
          {stages.map((s, i) => (
            <li key={s.slug}>
              <Link
                href={`/admin/edit/${s.slug}`}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-line px-2 py-4 transition-colors hover:bg-surface"
              >
                <span className="flex items-center gap-3">
                  <span className="tnum font-display text-sm font-semibold text-ink-subtle group-hover:text-gold">
                    {stageNumber(i)}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-surface text-ink-muted transition-colors group-hover:border-brand/40 group-hover:bg-brand-soft group-hover:text-brand">
                    <Icon name={s.icon} className="h-4 w-4" />
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium text-ink">{s.title}</span>
                  <span className="block truncate text-xs text-ink-subtle">content/{s.slug}.md</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-subtle transition group-hover:text-brand">
                  <Icon name="pencil" className="h-4 w-4" />
                  <span className="hidden sm:inline">Edit</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
