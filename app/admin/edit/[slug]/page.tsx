"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { stages } from "@/lib/stages";

export default function EditStagePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const router = useRouter();
  const stage = stages.find((s) => s.slug === slug);

  const [content, setContent] = useState("");
  const [sha, setSha] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/content/${slug}`)
      .then(async (res) => {
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        const data = await res.json();
        if (cancelled) return;
        setContent(data.content ?? "");
        setSha(data.sha ?? null);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [slug, router]);

  async function onSave() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/content/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, sha }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "err", text: data.error || "Gagal menyimpan" });
        return;
      }
      setSha(data.sha);
      setMessage({ type: "ok", text: "Tersimpan! Perubahan langsung tampil di halaman publik." });
    } catch {
      setMessage({ type: "err", text: "Gagal terhubung ke server" });
    } finally {
      setSaving(false);
    }
  }

  if (!stage) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-12">
        <p>Tahap tidak ditemukan.</p>
        <Link href="/admin" className="text-emerald-700 dark:text-emerald-400">
          ← Kembali
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin" className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            ← Semua tahap
          </Link>
          <h1 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            {stage.icon} Edit: {stage.title}
          </h1>
        </div>
        <div className="flex gap-2">
          <a
            href={`/tahap/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700"
          >
            Lihat halaman ↗
          </a>
          <button
            onClick={onSave}
            disabled={saving || loading}
            className="rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>

      {message && (
        <p className={`mt-3 text-sm ${message.type === "ok" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
          {message.type === "ok" ? "✅" : "❌"} {message.text}
        </p>
      )}

      <div className="mt-4 flex gap-2 text-sm">
        <button
          onClick={() => setTab("edit")}
          className={`rounded-full px-3 py-1 transition ${
            tab === "edit" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 dark:bg-slate-800"
          }`}
        >
          Edit Markdown
        </button>
        <button
          onClick={() => setTab("preview")}
          className={`rounded-full px-3 py-1 transition ${
            tab === "preview" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 dark:bg-slate-800"
          }`}
        >
          Preview
        </button>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="flex h-[70vh] items-center justify-center text-slate-400">Memuat konten...</div>
        ) : tab === "edit" ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            spellCheck={false}
            className="h-[70vh] w-full rounded-xl border border-slate-300 bg-white p-4 font-mono text-sm leading-relaxed text-slate-800 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        ) : (
          <div className="h-[70vh] overflow-y-auto rounded-xl border border-slate-200 p-6 dark:border-slate-800">
            <MarkdownRenderer source={content} />
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-slate-400">
        Format: Markdown biasa (heading <code>##</code>, tabel, <code>&gt; teks</code> untuk kotak catatan, checklist{" "}
        <code>- [ ]</code>, dst).
      </p>
    </div>
  );
}
