"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // localStorage tidak tersedia — abaikan, toggle tetap jalan untuk sesi ini
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label="Ganti tema gelap/terang"
      title="Ganti tema gelap/terang"
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-base shadow-sm backdrop-blur transition hover:scale-105 hover:shadow-md active:scale-95 dark:border-slate-700 dark:bg-slate-900/80 ${className}`}
    >
      <span aria-hidden="true" suppressHydrationWarning>
        {mounted ? (dark ? "☀️" : "🌙") : "🌙"}
      </span>
    </button>
  );
}
