"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icon";
import ThemeToggle from "@/components/ThemeToggle";
import PasswordInput from "@/components/PasswordInput";
import { btnPrimary, card, input, label } from "@/lib/ui";

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
      const data = await res.json();
      if (data.admin) {
        router.push("/admin");
      } else if (data.user?.mustChangePassword) {
        router.push("/akun");
      } else {
        router.push("/");
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-ink-muted transition hover:text-ink"
          >
            <Icon name="arrow-left" className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="font-display tracking-tight">Kuy, UCR!</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-6 py-14">
        <div className="animate-rise">
          <p className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-gold">Akses peserta</p>
          <h1 className="mt-3 font-display text-display-sm font-semibold text-ink">Masuk ke akunmu</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            Masuk untuk mencentang dan menyimpan progres persiapanmu sendiri. Belum punya akun? Minta dibuatkan ke
            admin program.
          </p>

          <form onSubmit={onSubmit} className={`${card} mt-8 space-y-5 p-6`}>
            <div>
              <label htmlFor="username" className={label}>
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`${input} mt-2`}
                required
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="password" className={label}>
                Password
              </label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${input} mt-2`}
                required
              />
            </div>
            {error && (
              <p className="flex items-start gap-2 rounded-md border border-danger/30 bg-danger-soft px-3 py-2.5 text-sm text-danger">
                <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </p>
            )}
            <button disabled={loading} className={`${btnPrimary} w-full`}>
              {loading ? "Memproses…" : "Masuk"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
