"use client";

import Link from "next/link";
import { useState } from "react";
import { accentStyles, type Stage } from "@/lib/stages";
import ThemeToggle from "@/components/ThemeToggle";

export default function ProgressHeader({
  current,
  total,
  stages,
  activeSlug,
}: {
  current: number;
  total: number;
  stages: Stage[];
  activeSlug: string;
}) {
  const [open, setOpen] = useState(false);
  const pct = Math.round((current / total) * 100);

  return (
    <header className="sticky top-0 z-30 border-b border-orange-100/80 bg-orange-50/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-5 py-3">
        <Link
          href="/"
          className="text-sm font-bold text-slate-500 transition hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
        >
          ← Kuy, UCR!
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-600 shadow-sm transition hover:shadow dark:bg-slate-800 dark:text-slate-300"
          >
            Tahap {current} dari {total}
            <span className={`transition-transform ${open ? "rotate-180" : ""}`}>⌄</span>
          </button>
          <ThemeToggle />
        </div>
      </div>
      <div className="h-1.5 w-full bg-orange-100 dark:bg-slate-800">
        <div
          className="h-1.5 bg-gradient-to-r from-orange-400 via-pink-500 to-violet-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      {open && (
        <nav className="border-t border-orange-100 bg-orange-50 dark:border-slate-800 dark:bg-slate-950">
          <ul className="mx-auto grid max-w-3xl grid-cols-1 gap-1 px-5 py-3 sm:grid-cols-2">
            {stages.map((s, i) => {
              const accent = accentStyles[s.accent];
              const isActive = s.slug === activeSlug;
              return (
                <li key={s.slug}>
                  <Link
                    href={`/tahap/${s.slug}`}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? `${accent.activeBg} ${accent.activeText} font-bold`
                        : "text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-900"
                    }`}
                  >
                    <span>{s.icon}</span>
                    <span>
                      {i + 1}. {s.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
