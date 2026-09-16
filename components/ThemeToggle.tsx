"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/Icon";

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
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line bg-surface text-ink-muted transition hover:border-line-strong hover:text-ink ${className}`}
    >
      <span suppressHydrationWarning>
        <Icon name={mounted && dark ? "sun" : "moon"} className="h-[1.05rem] w-[1.05rem]" />
      </span>
    </button>
  );
}
