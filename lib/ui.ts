// Kelas Tailwind yang dipakai berulang di form & kartu. Ditaruh di satu tempat
// supaya tombol/input di halaman masuk, akun, dan panel admin benar-benar
// identik — bukan mirip-mirip karena disalin manual.

export const card = "rounded-lg border border-line bg-surface";

export const label = "block text-[0.68rem] font-semibold uppercase tracking-eyebrow text-ink-muted";

export const input =
  "w-full rounded-md border border-line bg-surface px-3.5 py-2.5 text-sm text-ink transition placeholder:text-ink-subtle focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15";

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

export const btnPrimary = `${btnBase} bg-brand text-brand-on shadow-subtle hover:bg-brand-hover`;

export const btnSecondary = `${btnBase} border border-line bg-surface text-ink hover:border-line-strong`;

export const btnGhost =
  "inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition hover:text-ink disabled:opacity-50";

/** Label kecil berhuruf kapital — dipakai sebagai "eyebrow" di atas judul. */
export const eyebrow = "text-[0.62rem] font-semibold uppercase tracking-eyebrow text-ink-subtle";
