"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [pat, setPat] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, pat }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Gagal login");
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
      <div className="mb-2 text-3xl">🔐</div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin — Kuy, UCR!</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Masuk untuk mengedit konten itinerary.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password admin</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900"
            required
            autoFocus
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">GitHub Personal Access Token</label>
          <input
            type="password"
            value={pat}
            onChange={(e) => setPat(e.target.value)}
            placeholder="github_pat_... atau ghp_..."
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900"
            required
          />
          <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
            Buat token <em>fine-grained</em> di GitHub → Settings → Developer settings, scope hanya ke repo{" "}
            <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">kuy-UCR</code>, permission{" "}
            <strong>Contents: Read and write</strong>. Token hanya disimpan di cookie sesi browser ini (httpOnly),
            tidak pernah tersimpan di server.
          </p>
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <button
          disabled={loading}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </div>
  );
}
