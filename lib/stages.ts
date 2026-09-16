import type { IconName } from "@/components/Icon";

export type Stage = {
  slug: string;
  title: string;
  /** Judul ringkas untuk nav & header tabel yang sempit. */
  shortTitle: string;
  subtitle: string;
  icon: IconName;
};

// Urutan "tahapan" perjalanan — dari persiapan sampai pulang.
// Menambah/menghapus tahap perlu redeploy (ini bagian dari kode app, bukan konten).
export const stages: Stage[] = [
  {
    slug: "ringkasan",
    title: "Ringkasan Program",
    shortTitle: "Ringkasan",
    subtitle: "Gambaran umum program & progress tracker",
    icon: "compass",
  },
  {
    slug: "struktur-kepengurusan",
    title: "Struktur Kepengurusan & Job Description",
    shortTitle: "Kepengurusan",
    subtitle: "Bagan organisasi, personalia, dan tugas pokok tiap bidang",
    icon: "users",
  },
  {
    slug: "checklist-dokumen",
    title: "Checklist Dokumen",
    shortTitle: "Dokumen",
    subtitle: "Semua dokumen yang wajib dibawa & disiapkan",
    icon: "clipboard-check",
  },
  {
    slug: "pra-keberangkatan",
    title: "Persiapan Sebelum Berangkat",
    shortTitle: "Pra-keberangkatan",
    subtitle: "Visa, tiket, asuransi, vaksin, packing list",
    icon: "suitcase",
  },
  {
    slug: "hari-keberangkatan",
    title: "Hari Keberangkatan & Perjalanan",
    shortTitle: "Keberangkatan",
    subtitle: "Jakarta → transit → tiba di California",
    icon: "plane",
  },
  {
    slug: "akomodasi-riverside",
    title: "Akomodasi & Kehidupan di Riverside",
    shortTitle: "Akomodasi",
    subtitle: "Tempat tinggal, transportasi, makanan halal",
    icon: "building",
  },
  {
    slug: "itinerary-mingguan",
    title: "Itinerary Mingguan",
    shortTitle: "Itinerary",
    subtitle: "13 minggu — akademik + eksplorasi akhir pekan",
    icon: "calendar",
  },
  {
    slug: "budget-keuangan",
    title: "Budget & Keuangan",
    shortTitle: "Budget",
    subtitle: "Estimasi biaya hidup, wisata, dan dana LPDP",
    icon: "wallet",
  },
  {
    slug: "kepulangan",
    title: "Kepulangan & Pelaporan",
    shortTitle: "Kepulangan",
    subtitle: "Checkout, packing, laporan akhir LPDP",
    icon: "flag",
  },
  {
    slug: "kontak-darurat",
    title: "Kontak Darurat",
    shortTitle: "Kontak Darurat",
    subtitle: "KJRI, kampus, asuransi, keluarga",
    icon: "lifebuoy",
  },
];

export function getStage(slug: string): Stage | undefined {
  return stages.find((s) => s.slug === slug);
}

export function getStageIndex(slug: string): number {
  return stages.findIndex((s) => s.slug === slug);
}

/** Nomor tahap dua digit ("01", "02", …) — dipakai sebagai penanda visual. */
export function stageNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}
