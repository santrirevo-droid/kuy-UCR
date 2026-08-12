export type AccentKey = "violet" | "sky" | "orange" | "teal" | "pink" | "amber" | "indigo" | "red" | "emerald";

export type Stage = {
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  accent: AccentKey;
};

// Urutan "tahapan" perjalanan — dari persiapan sampai pulang.
// Menambah/menghapus tahap perlu redeploy (ini bagian dari kode app, bukan konten).
export const stages: Stage[] = [
  {
    slug: "ringkasan",
    title: "Ringkasan Program",
    subtitle: "Gambaran umum program & progress tracker",
    icon: "🎯",
    accent: "violet",
  },
  {
    slug: "pra-keberangkatan",
    title: "Persiapan Sebelum Berangkat",
    subtitle: "Visa, tiket, asuransi, vaksin, packing list",
    icon: "🧳",
    accent: "sky",
  },
  {
    slug: "hari-keberangkatan",
    title: "Hari Keberangkatan & Perjalanan",
    subtitle: "Jakarta → transit → tiba di California",
    icon: "✈️",
    accent: "orange",
  },
  {
    slug: "akomodasi-riverside",
    title: "Akomodasi & Kehidupan di Riverside",
    subtitle: "Tempat tinggal, transportasi, makanan halal",
    icon: "🏠",
    accent: "teal",
  },
  {
    slug: "itinerary-mingguan",
    title: "Itinerary Mingguan",
    subtitle: "13 minggu — akademik + eksplorasi akhir pekan",
    icon: "🗺️",
    accent: "pink",
  },
  {
    slug: "budget-keuangan",
    title: "Budget & Keuangan",
    subtitle: "Estimasi biaya hidup, wisata, dan dana LPDP",
    icon: "💰",
    accent: "amber",
  },
  {
    slug: "kepulangan",
    title: "Kepulangan & Pelaporan",
    subtitle: "Checkout, packing, laporan akhir LPDP",
    icon: "🏁",
    accent: "indigo",
  },
  {
    slug: "kontak-darurat",
    title: "Kontak Darurat",
    subtitle: "KJRI, kampus, asuransi, keluarga",
    icon: "🆘",
    accent: "red",
  },
  {
    slug: "checklist-dokumen",
    title: "Checklist Dokumen",
    subtitle: "Semua dokumen yang wajib dibawa & disiapkan",
    icon: "📋",
    accent: "emerald",
  },
];

export function getStage(slug: string): Stage | undefined {
  return stages.find((s) => s.slug === slug);
}

export function getStageIndex(slug: string): number {
  return stages.findIndex((s) => s.slug === slug);
}

// Kelas Tailwind lengkap per warna aksen — ditulis literal (bukan digabung dari
// string) supaya kescan oleh Tailwind JIT. Dipakai untuk badge ikon, hover
// kartu, dan highlight nav aktif di seluruh halaman.
export const accentStyles: Record<
  AccentKey,
  { badge: string; hover: string; activeText: string; activeBg: string; ring: string }
> = {
  violet: {
    badge: "bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300",
    hover: "hover:border-violet-300 hover:bg-violet-50/70 dark:hover:border-violet-700 dark:hover:bg-violet-950/30",
    activeText: "text-violet-700 dark:text-violet-300",
    activeBg: "bg-violet-50 dark:bg-violet-950/40",
    ring: "ring-violet-200 dark:ring-violet-900",
  },
  sky: {
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300",
    hover: "hover:border-sky-300 hover:bg-sky-50/70 dark:hover:border-sky-700 dark:hover:bg-sky-950/30",
    activeText: "text-sky-700 dark:text-sky-300",
    activeBg: "bg-sky-50 dark:bg-sky-950/40",
    ring: "ring-sky-200 dark:ring-sky-900",
  },
  orange: {
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-300",
    hover: "hover:border-orange-300 hover:bg-orange-50/70 dark:hover:border-orange-700 dark:hover:bg-orange-950/30",
    activeText: "text-orange-700 dark:text-orange-300",
    activeBg: "bg-orange-50 dark:bg-orange-950/40",
    ring: "ring-orange-200 dark:ring-orange-900",
  },
  teal: {
    badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300",
    hover: "hover:border-teal-300 hover:bg-teal-50/70 dark:hover:border-teal-700 dark:hover:bg-teal-950/30",
    activeText: "text-teal-700 dark:text-teal-300",
    activeBg: "bg-teal-50 dark:bg-teal-950/40",
    ring: "ring-teal-200 dark:ring-teal-900",
  },
  pink: {
    badge: "bg-pink-100 text-pink-700 dark:bg-pink-900/60 dark:text-pink-300",
    hover: "hover:border-pink-300 hover:bg-pink-50/70 dark:hover:border-pink-700 dark:hover:bg-pink-950/30",
    activeText: "text-pink-700 dark:text-pink-300",
    activeBg: "bg-pink-50 dark:bg-pink-950/40",
    ring: "ring-pink-200 dark:ring-pink-900",
  },
  amber: {
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
    hover: "hover:border-amber-300 hover:bg-amber-50/70 dark:hover:border-amber-700 dark:hover:bg-amber-950/30",
    activeText: "text-amber-700 dark:text-amber-300",
    activeBg: "bg-amber-50 dark:bg-amber-950/40",
    ring: "ring-amber-200 dark:ring-amber-900",
  },
  indigo: {
    badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300",
    hover: "hover:border-indigo-300 hover:bg-indigo-50/70 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/30",
    activeText: "text-indigo-700 dark:text-indigo-300",
    activeBg: "bg-indigo-50 dark:bg-indigo-950/40",
    ring: "ring-indigo-200 dark:ring-indigo-900",
  },
  red: {
    badge: "bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300",
    hover: "hover:border-red-300 hover:bg-red-50/70 dark:hover:border-red-700 dark:hover:bg-red-950/30",
    activeText: "text-red-700 dark:text-red-300",
    activeBg: "bg-red-50 dark:bg-red-950/40",
    ring: "ring-red-200 dark:ring-red-900",
  },
  emerald: {
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
    hover: "hover:border-emerald-300 hover:bg-emerald-50/70 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30",
    activeText: "text-emerald-700 dark:text-emerald-300",
    activeBg: "bg-emerald-50 dark:bg-emerald-950/40",
    ring: "ring-emerald-200 dark:ring-emerald-900",
  },
};
