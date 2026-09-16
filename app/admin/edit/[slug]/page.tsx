"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import ThemeToggle from "@/components/ThemeToggle";
import PasswordInput from "@/components/PasswordInput";
import Icon from "@/components/Icon";
import { stages, getStageIndex, stageNumber } from "@/lib/stages";
import { btnPrimary, btnSecondary, card, input } from "@/lib/ui";

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
        router.push("/masuk");
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
      setMessage({ type: "ok", text: "Tersimpan. Perubahan langsung tampil di halaman publik." });
    } catch {
      setMessage({ type: "err", text: "Gagal terhubung ke server" });
    } finally {
      setSaving(false);
    }
  }

  if (!stage) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="font-display text-display-sm font-semibold text-ink">Tahap tidak ditemukan</h1>
        <Link href="/admin/konten" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand">
          <Icon name="arrow-left" className="h-4 w-4" />
          Kembali ke daftar tahap
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-30 border-b border-line bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-3.5">
          <div className="min-w-0">
            <Link
              href="/admin/konten"
              className="group inline-flex items-center gap-1.5 text-xs font-medium text-ink-subtle transition hover:text-ink"
            >
              <Icon name="arrow-left" className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              Semua tahap
            </Link>
            <h1 className="mt-1 flex items-center gap-2.5 truncate font-display text-base font-semibold text-ink">
              <span className="tnum text-ink-subtle">{stageNumber(getStageIndex(stage.slug))}</span>
              {stage.title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <a href={`/tahap/${slug}`} target="_blank" rel="noreferrer" className={`${btnSecondary} h-9 py-0`}>
              <span className="hidden sm:inline">Lihat halaman</span>
              <Icon name="arrow-up-right" className="h-3.5 w-3.5" />
            </a>
            {!needsGithub && (
              <button onClick={onSave} disabled={saving || loading} className={`${btnPrimary} h-9 py-0`}>
                {saving ? "Menyimpan…" : "Simpan"}
              </button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {loading ? (
          <div className="flex h-[50vh] items-center justify-center text-sm text-ink-subtle">Memuat…</div>
        ) : needsGithub ? (
          <div className={`${card} mx-auto mt-8 max-w-md p-6`}>
            <span className="flex h-11 w-11 items-center justify-center rounded-md border border-line bg-surface-2 text-brand">
              <Icon name="link" className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-display text-lg font-semibold text-ink">Sambungkan GitHub dulu</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Mengedit konten butuh GitHub Personal Access Token karena perubahan langsung ter-commit ke repo.
            </p>
            <form onSubmit={onConnectGithub} className="mt-5 space-y-3">
              <PasswordInput
                value={pat}
                onChange={(e) => setPat(e.target.value)}
                placeholder="github_pat_… atau ghp_…"
                className={`${input} font-mono`}
                required
                autoFocus
              />
              <p className="text-xs leading-relaxed text-ink-subtle">
                Buat token <em>fine-grained</em> di GitHub → Settings → Developer settings, scope hanya ke repo{" "}
                <code className="rounded border border-line bg-surface-2 px-1 py-0.5 font-mono text-[0.75rem] text-ink">
                  kuy-UCR
                </code>
                , permission <strong className="font-semibold text-ink-muted">Contents: Read and write</strong>.
                Tersimpan di cookie sesi ini saja (6 jam), tidak pernah di server.
              </p>
              {connectError && (
                <p className="flex items-start gap-2 rounded-md border border-danger/30 bg-danger-soft px-3 py-2.5 text-sm text-danger">
                  <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
                  {connectError}
                </p>
              )}
              <button disabled={connecting} className={`${btnPrimary} w-full`}>
                {connecting ? "Memeriksa…" : "Sambungkan"}
              </button>
            </form>
          </div>
        ) : (
          <>
            {message && (
              <p
                className={`mb-4 flex items-start gap-2 rounded-md border px-3 py-2.5 text-sm ${
                  message.type === "ok"
                    ? "border-success/30 bg-success-soft text-success"
                    : "border-danger/30 bg-danger-soft text-danger"
                }`}
              >
                <Icon name={message.type === "ok" ? "check" : "alert"} className="mt-0.5 h-4 w-4 shrink-0" />
                {message.text}
              </p>
            )}

            <div className="flex items-center justify-between gap-3 border-b border-line">
              <div className="-mb-px flex gap-1">
                {(
                  [
                    { id: "edit", label: "Markdown" },
                    { id: "preview", label: "Pratinjau" },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`border-b-2 px-3 py-2.5 text-sm transition ${
                      tab === t.id
                        ? "border-brand font-semibold text-brand"
                        : "border-transparent font-medium text-ink-muted hover:border-line-strong hover:text-ink"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <span className="tnum hidden text-xs text-ink-subtle sm:block">{content.length} karakter</span>
            </div>

            <div className="mt-5">
              {tab === "edit" ? (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  spellCheck={false}
                  className={`${input} h-[70vh] resize-none font-mono text-[0.82rem] leading-relaxed`}
                />
              ) : (
                <div className={`${card} h-[70vh] overflow-y-auto px-6 py-6 sm:px-10`}>
                  <MarkdownRenderer source={content} />
                </div>
              )}
            </div>

            <p className="mt-4 text-xs leading-relaxed text-ink-subtle">
              Format: Markdown biasa — heading <code className="font-mono">##</code>, tabel,{" "}
              <code className="font-mono">&gt; teks</code> untuk kotak catatan, checklist{" "}
              <code className="font-mono">- [ ]</code>, dan seterusnya.
            </p>
          </>
        )}
      </main>
    </div>
  );
}
