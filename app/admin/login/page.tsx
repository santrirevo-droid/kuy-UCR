"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
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
        body: JSON.stringify({ password }),
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
    <div className="relative min-h-screen overflow-hidden bg-orange-50 dark:bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 -top-16 h-64 w-64 animate-blob rounded-full bg-orange-300/40 blur-3xl dark:bg-orange-700/20" />
        <div className="absolute -right-10 bottom-0 h-64 w-64 animate-blob rounded-full bg-violet-300/40 blur-3xl [animation-delay:4s] dark:bg-violet-700/20" />
      </div>
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
        <div className="mb-2 text-3xl">🔐</div>
        <h1 className="font-heading text-2xl font-extrabold text-slate-900 dark:text-white">Admin — Kuy, UCR!</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Masuk untuk melihat progres peserta, kelola user, dan kelola konten.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-6 space-y-4 rounded-2xl border border-orange-100 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70"
        >
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password admin</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-slate-700 dark:bg-slate-900"
              required
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-orange-500 via-pink-500 to-violet-500 px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:shadow-lg disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-400">
          💡 GitHub Personal Access Token baru akan diminta nanti, khusus saat kamu membuka tab <strong>Kelola Konten</strong> —
          tidak dibutuhkan untuk melihat progres peserta atau kelola user.
        </p>
      </div>
    </div>
  );
}
