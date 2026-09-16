"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { stageNumber, type Stage } from "@/lib/stages";
import Icon from "@/components/Icon";
import ThemeToggle from "@/components/ThemeToggle";

export default function ProgressHeader({
  current,
  total,
  stages,
  activeSlug,
  userBadge,
}: {
  current: number;
  total: number;
  stages: Stage[];
  activeSlug: string;
  userBadge?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pct = Math.round((current / total) * 100);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-6 py-3">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-ink-muted transition hover:text-ink"
        >
          <Icon name="arrow-left" className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span className="font-display tracking-tight">Kuy, UCR!</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">{userBadge}</div>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-line bg-surface px-3 text-sm font-medium text-ink transition hover:border-line-strong"
          >
            <span className="tnum">
              Tahap <span className="font-display font-semibold">{stageNumber(current - 1)}</span>
              <span className="text-ink-subtle"> / {stageNumber(total - 1)}</span>
            </span>
            <Icon
              name="chevron-down"
              className={`h-3.5 w-3.5 text-ink-subtle transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* Indikator posisi — garis tipis, bukan bar tebal berwarna. */}
      <div className="h-px w-full bg-line">
        <div className="h-px bg-brand transition-all duration-500 ease-out" style={{ width: `${pct}%` }} />
      </div>

      {open && (
        <nav className="animate-fade border-t border-line bg-surface shadow-card">
          <ul className="mx-auto grid max-w-3xl grid-cols-1 gap-0.5 px-4 py-3 sm:grid-cols-2">
            {stages.map((s, i) => {
              const isActive = s.slug === activeSlug;
              return (
                <li key={s.slug}>
                  <Link
                    href={`/tahap/${s.slug}`}
                    onClick={() => setOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                      isActive ? "bg-brand-soft text-brand" : "text-ink-muted hover:bg-surface-2 hover:text-ink"
                    }`}
                  >
                    <span
                      className={`tnum font-display text-xs font-semibold ${isActive ? "text-brand" : "text-ink-subtle"}`}
                    >
                      {stageNumber(i)}
                    </span>
                    <Icon name={s.icon} className="h-4 w-4 shrink-0" />
                    <span className={`truncate ${isActive ? "font-semibold" : "font-medium"}`}>{s.shortTitle}</span>
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
