import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import ThemeToggle from "@/components/ThemeToggle";
import ChangePasswordForm from "@/components/ChangePasswordForm";

export default async function AkunPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");

  return (
    <div className="relative min-h-screen overflow-hidden bg-orange-50 dark:bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 -top-16 h-64 w-64 animate-blob rounded-full bg-teal-300/40 blur-3xl dark:bg-teal-700/20" />
        <div className="absolute -right-10 bottom-0 h-64 w-64 animate-blob rounded-full bg-pink-300/40 blur-3xl [animation-delay:4s] dark:bg-pink-700/20" />
      </div>
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
        <div className="mb-2 text-3xl">🔑</div>
        <h1 className="font-heading text-2xl font-extrabold text-slate-900 dark:text-white">Akun Saya</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Masuk sebagai <strong>{user.name}</strong> (@{user.username}). Ganti password akunmu di bawah ini.
        </p>

        {user.mustChangePassword && (
          <div className="mt-4 rounded-xl border-2 border-dashed border-amber-400 bg-amber-50 p-3.5 text-sm text-amber-800 dark:border-amber-600 dark:bg-amber-950/30 dark:text-amber-200">
            ⚠️ Password kamu masih password default dari admin. Ganti dulu ke password barumu sendiri sebelum lanjut
            pakai situs ini.
          </div>
        )}

        <ChangePasswordForm forced={user.mustChangePassword} />

        {!user.mustChangePassword && (
          <Link href="/" className="mt-6 text-center text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            ← Kembali ke beranda
          </Link>
        )}
      </div>
    </div>
  );
}
