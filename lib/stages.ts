export type Stage = {
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
};

// Urutan "tahapan" perjalanan — dari persiapan sampai pulang.
// Menambah/menghapus tahap perlu redeploy (ini bagian dari kode app, bukan konten).
export const stages: Stage[] = [
  {
    slug: "ringkasan",
    title: "Ringkasan Program",
    subtitle: "Gambaran umum program & progress tracker",
    icon: "🎯",
  },
  {
    slug: "pra-keberangkatan",
    title: "Persiapan Sebelum Berangkat",
    subtitle: "Visa, tiket, asuransi, vaksin, packing list",
    icon: "🧳",
  },
  {
    slug: "hari-keberangkatan",
    title: "Hari Keberangkatan & Perjalanan",
    subtitle: "Jakarta → transit → tiba di California",
    icon: "✈️",
  },
  {
    slug: "akomodasi-riverside",
    title: "Akomodasi & Kehidupan di Riverside",
    subtitle: "Tempat tinggal, transportasi, makanan halal",
    icon: "🏠",
  },
  {
    slug: "itinerary-mingguan",
    title: "Itinerary Mingguan",
    subtitle: "13 minggu — akademik + eksplorasi akhir pekan",
    icon: "🗺️",
  },
  {
    slug: "budget-keuangan",
    title: "Budget & Keuangan",
    subtitle: "Estimasi biaya hidup, wisata, dan dana LPDP",
    icon: "💰",
  },
  {
    slug: "kepulangan",
    title: "Kepulangan & Pelaporan",
    subtitle: "Checkout, packing, laporan akhir LPDP",
    icon: "🏁",
  },
  {
    slug: "kontak-darurat",
    title: "Kontak Darurat",
    subtitle: "KJRI, kampus, asuransi, keluarga",
    icon: "🆘",
  },
  {
    slug: "checklist-dokumen",
    title: "Checklist Dokumen",
    subtitle: "Semua dokumen yang wajib dibawa & disiapkan",
    icon: "📋",
  },
];

export function getStage(slug: string): Stage | undefined {
  return stages.find((s) => s.slug === slug);
}

export function getStageIndex(slug: string): number {
  return stages.findIndex((s) => s.slug === slug);
}
