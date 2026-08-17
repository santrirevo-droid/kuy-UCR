import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import LogoutUserButton from "@/components/LogoutUserButton";

export default async function UserBadge() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Link
        href="/masuk"
        className="rounded-full border border-slate-200 bg-white/70 px-3.5 py-1.5 text-sm font-semibold text-slate-600 backdrop-blur transition hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300"
      >
        Masuk →
      </Link>
    );
  }

  if (user.mustChangePassword) {
    return (
      <Link
        href="/akun"
        className="flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50/90 px-3.5 py-1.5 text-sm font-semibold text-amber-700 backdrop-blur transition hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
      >
        ⚠️ Ganti password dulu →
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50/80 px-3.5 py-1.5 text-sm backdrop-blur dark:border-teal-800 dark:bg-teal-950/40">
      <span className="font-semibold text-teal-700 dark:text-teal-300">👋 {user.name}</span>
      <span className="text-teal-300 dark:text-teal-700">·</span>
      <Link
        href="/akun"
        className="text-slate-400 underline-offset-2 transition hover:text-slate-700 hover:underline dark:hover:text-slate-200"
      >
        Akun
      </Link>
      <span className="text-teal-300 dark:text-teal-700">·</span>
      <LogoutUserButton />
    </div>
  );
}
