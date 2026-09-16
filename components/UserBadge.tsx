import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import LogoutUserButton from "@/components/LogoutUserButton";
import Icon from "@/components/Icon";

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function UserBadge() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Link
        href="/masuk"
        className="group inline-flex h-9 items-center gap-1.5 rounded-md border border-line bg-surface px-3.5 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
      >
        Masuk
        <Icon name="arrow-right" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    );
  }

  if (user.mustChangePassword) {
    return (
      <Link
        href="/akun"
        className="inline-flex h-9 items-center gap-2 rounded-md border border-warn/40 bg-warn-soft px-3 text-sm font-semibold text-warn transition hover:border-warn/70"
      >
        <Icon name="alert" className="h-4 w-4" />
        <span className="hidden sm:inline">Ganti password</span>
      </Link>
    );
  }

  return (
    <div className="flex h-9 items-center gap-2 rounded-md border border-line bg-surface pl-1.5 pr-1.5">
      <Link href="/akun" className="flex items-center gap-2 text-sm" title="Akun saya">
        <span className="flex h-6 w-6 items-center justify-center rounded bg-brand-soft text-[0.62rem] font-bold tracking-wide text-brand">
          {initials(user.name)}
        </span>
        <span className="hidden max-w-[10rem] truncate font-medium text-ink sm:block">{user.name}</span>
      </Link>
      <span className="h-4 w-px bg-line" />
      <LogoutUserButton />
    </div>
  );
}
