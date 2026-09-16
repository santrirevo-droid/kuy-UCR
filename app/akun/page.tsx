import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import Icon from "@/components/Icon";
import ThemeToggle from "@/components/ThemeToggle";
import ChangePasswordForm from "@/components/ChangePasswordForm";

export const metadata = { title: "Akun Saya" };

export default async function AkunPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          {user.mustChangePassword ? (
            <span className="font-display text-sm font-semibold tracking-tight text-ink">Kuy, UCR!</span>
          ) : (
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-ink-muted transition hover:text-ink"
            >
              <Icon name="arrow-left" className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              <span className="font-display tracking-tight">Kuy, UCR!</span>
            </Link>
          )}
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-6 py-14">
        <div className="animate-rise">
          <p className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-gold">Pengaturan akun</p>
          <h1 className="mt-3 font-display text-display-sm font-semibold text-ink">Akun saya</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            Masuk sebagai <strong className="font-semibold text-ink">{user.name}</strong> (@{user.username}). Ganti
            password akunmu di bawah ini.
          </p>

          {user.mustChangePassword && (
            <div className="mt-6 flex items-start gap-3 rounded-lg border border-warn/35 bg-warn-soft px-4 py-3.5 text-sm leading-relaxed text-ink">
              <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
              <span>
                Password kamu masih password default dari admin. Ganti dulu ke password barumu sendiri sebelum lanjut
                memakai situs ini.
              </span>
            </div>
          )}

          <ChangePasswordForm forced={user.mustChangePassword} />
        </div>
      </main>
    </div>
  );
}
