"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import ThemeToggle from "@/components/ThemeToggle";
import Icon, { type IconName } from "@/components/Icon";

const TABS: { href: string; label: string; icon: IconName }[] = [
  { href: "/admin", label: "Progres Peserta", icon: "chart-bar" },
  { href: "/admin/konten", label: "Kelola Konten", icon: "file-text" },
  { href: "/admin/users", label: "Kelola User", icon: "user-cog" },
];

// Chrome panel admin: baris identitas di atas, lalu tab dengan penanda garis
// bawah — bukan pil berwarna — supaya terbaca seperti aplikasi kerja.
export default function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-6 py-3.5">
        <span className="flex items-baseline gap-2.5">
          <span className="font-display text-base font-semibold tracking-tight text-ink">Kuy, UCR!</span>
          <span className="h-3.5 w-px bg-line-strong" />
          <span className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-gold">Panel Admin</span>
        </span>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="hidden h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-ink-muted transition hover:text-ink sm:inline-flex"
          >
            Situs publik
            <Icon name="arrow-up-right" className="h-3.5 w-3.5" />
          </Link>
          <ThemeToggle />
          <LogoutButton />
        </div>
      </div>

      <nav className="mx-auto max-w-5xl px-6">
        <ul className="-mb-px flex gap-1 overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm transition ${
                    isActive
                      ? "border-brand font-semibold text-brand"
                      : "border-transparent font-medium text-ink-muted hover:border-line-strong hover:text-ink"
                  }`}
                >
                  <Icon name={tab.icon} className="h-4 w-4" />
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
