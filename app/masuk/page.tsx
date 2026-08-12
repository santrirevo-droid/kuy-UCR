"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function MasukPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Gagal masuk");
        return;
      }
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-orange-50 dark:bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 -top-16 h-64 w-64 animate-blob rounded-full bg-teal-300/40 blur-3xl dark:bg-teal-700/20" />
        <div className="absolute -right-10 bottom-0 h-64 w-64 animate-blob rounded-full bg-pink-300/40 blur-3xl [animation-delay:4s] dark:bg-pink-700/20" />
      </div>
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
        <div className="mb-2 text-3xl">👋</div>
        <h1 className="font-heading text-2xl font-extrabold text-slate-900 dark:text-white">Masuk</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Masuk untuk mencentang & menyimpan progres persiapanmu sendiri. Belum punya akun? Minta dibuatkan ke admin
          program.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-6 space-y-4 rounded-2xl border border-orange-100 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70"
        >
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-teal-500 to-sky-500 px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:shadow-lg disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <Link href="/" className="mt-6 text-center text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          ← Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}
