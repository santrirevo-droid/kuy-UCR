"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import ThemeToggle from "@/components/ThemeToggle";
import { stages } from "@/lib/stages";

export default function EditStagePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const router = useRouter();
  const stage = stages.find((s) => s.slug === slug);

  const [content, setContent] = useState("");
  const [sha, setSha] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsGithub, setNeedsGithub] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  const [pat, setPat] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [connectError, setConnectError] = useState("");

  async function loadContent() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/content/${slug}`);
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (res.status === 428) {
        setNeedsGithub(true);
        return;
      }
      const data = await res.json();
      setNeedsGithub(false);
      setContent(data.content ?? "");
      setSha(data.sha ?? null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function onConnectGithub(e: FormEvent) {
    e.preventDefault();
    setConnecting(true);
    setConnectError("");
    try {
      const res = await fetch("/api/admin/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pat }),
      });
      const data = await res.json();
      if (!res.ok) {
        setConnectError(data.error || "Gagal menyambungkan GitHub");
        return;
      }
      setPat("");
      await loadContent();
    } finally {
      setConnecting(false);
    }
  }

  async function onSave() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/content/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, sha }),
      });
      if (res.status === 428) {
        setNeedsGithub(true);
        return;
      }
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
        <Link href="/admin/konten" className="text-orange-700 dark:text-orange-400">
          ← Kembali
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50/40 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl px-5 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href="/admin/konten" className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              ← Semua tahap
            </Link>
            <h1 className="mt-1 font-heading text-xl font-bold text-slate-900 dark:text-white">
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
            {!needsGithub && (
              <button
                onClick={onSave}
                disabled={saving || loading}
                className="rounded-lg bg-gradient-to-r from-orange-500 via-pink-500 to-violet-500 px-4 py-1.5 text-sm font-bold text-white shadow-sm transition hover:shadow-md disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            )}
            <ThemeToggle />
          </div>
        </div>

        {loading ? (
          <div className="mt-6 flex h-[50vh] items-center justify-center text-slate-400">Memuat...</div>
        ) : needsGithub ? (
          <div className="mx-auto mt-8 max-w-md rounded-2xl border border-orange-100 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
            <div className="text-2xl">🔗</div>
            <h2 className="mt-2 font-heading text-lg font-bold text-slate-900 dark:text-white">
              Sambungkan GitHub dulu
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Mengedit konten butuh GitHub Personal Access Token karena perubahan langsung ter-commit ke repo.
            </p>
            <form onSubmit={onConnectGithub} className="mt-4 space-y-3">
              <input
                type="password"
                value={pat}
                onChange={(e) => setPat(e.target.value)}
                placeholder="github_pat_... atau ghp_..."
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-slate-700 dark:bg-slate-900"
                required
                autoFocus
              />
              <p className="text-xs leading-relaxed text-slate-400">
                Buat token <em>fine-grained</em> di GitHub → Settings → Developer settings, scope hanya ke repo{" "}
                <code className="rounded bg-orange-100 px-1 dark:bg-slate-800">kuy-UCR</code>, permission{" "}
                <strong>Contents: Read and write</strong>. Tersimpan di cookie sesi ini saja (6 jam), tidak pernah di
                server.
              </p>
              {connectError && <p className="text-sm text-red-600 dark:text-red-400">{connectError}</p>}
              <button
                disabled={connecting}
                className="w-full rounded-lg bg-gradient-to-r from-orange-500 via-pink-500 to-violet-500 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:shadow-md disabled:opacity-50"
              >
                {connecting ? "Memeriksa..." : "Sambungkan"}
              </button>
            </form>
          </div>
        ) : (
          <>
            {message && (
              <p
                className={`mt-3 text-sm ${message.type === "ok" ? "text-teal-600 dark:text-teal-400" : "text-red-600 dark:text-red-400"}`}
              >
                {message.type === "ok" ? "✅" : "❌"} {message.text}
              </p>
            )}

            <div className="mt-4 flex gap-2 text-sm">
              <button
                onClick={() => setTab("edit")}
                className={`rounded-full px-3 py-1 font-medium transition ${
                  tab === "edit"
                    ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-sm"
                    : "bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                Edit Markdown
              </button>
              <button
                onClick={() => setTab("preview")}
                className={`rounded-full px-3 py-1 font-medium transition ${
                  tab === "preview"
                    ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-sm"
                    : "bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                Preview
              </button>
            </div>

            <div className="mt-4">
              {tab === "edit" ? (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  spellCheck={false}
                  className="h-[70vh] w-full rounded-xl border border-slate-300 bg-white p-4 font-mono text-sm leading-relaxed text-slate-800 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              ) : (
                <div className="h-[70vh] overflow-y-auto rounded-xl border border-orange-100 bg-white/60 p-6 dark:border-slate-800 dark:bg-slate-900/60">
                  <MarkdownRenderer source={content} />
                </div>
              )}
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Format: Markdown biasa (heading <code>##</code>, tabel, <code>&gt; teks</code> untuk kotak catatan,
              checklist <code>- [ ]</code>, dst).
            </p>
          </>
        )}
      </div>
    </div>
  );
}
