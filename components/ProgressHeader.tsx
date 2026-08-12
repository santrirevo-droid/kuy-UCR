"use client";

import Link from "next/link";
import { useState } from "react";
import type { Stage } from "@/lib/stages";

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
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
        <Link
          href="/"
          className="text-sm font-semibold text-slate-500 transition hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
        >
          ← Kuy, UCR!
        </Link>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          Tahap {current} dari {total}
          <span className={`transition-transform ${open ? "rotate-180" : ""}`}>⌄</span>
        </button>
      </div>
      <div className="h-1 w-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-1 bg-emerald-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      {open && (
        <nav className="border-t border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-950">
          <ul className="mx-auto grid max-w-3xl grid-cols-1 gap-1 px-5 py-3 sm:grid-cols-2">
            {stages.map((s, i) => (
              <li key={s.slug}>
                <Link
                  href={`/tahap/${s.slug}`}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                    s.slug === activeSlug
                      ? "bg-emerald-50 font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                      : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                  }`}
                >
                  <span>{s.icon}</span>
                  <span>
                    {i + 1}. {s.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
