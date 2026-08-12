"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import ThemeToggle from "@/components/ThemeToggle";

const TABS = [
  { href: "/admin", label: "📊 Progres Peserta" },
  { href: "/admin/konten", label: "📋 Kelola Konten" },
  { href: "/admin/users", label: "👥 Kelola User" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-100 pb-4 dark:border-slate-800">
      <nav className="flex flex-wrap gap-1">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                isActive
                  ? "bg-gradient-to-r from-orange-500 via-pink-500 to-violet-500 text-white shadow-sm"
                  : "bg-white/70 text-slate-600 hover:bg-white dark:bg-slate-900/70 dark:text-slate-300"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <LogoutButton />
      </div>
    </div>
  );
}
