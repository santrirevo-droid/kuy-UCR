// Album kegiatan rombongan. Foto & video TIDAK di-upload ke situs — semuanya
// tetap di Google Drive "Dokumentasi SC UCR" dan hanya di-embed. Menambah
// kegiatan cukup dengan menambah satu entri di bawah (urutan bebas; halaman
// mengurutkan sendiri berdasarkan tanggal).

export const DRIVE_ROOT_ID = "1x4QY6aSlTJA50N8vkg64n2EOX10z-Cag";

export type AlbumEntry = {
  /** Tanggal kegiatan, format YYYY-MM-DD. Kosongkan kalau belum diketahui. */
  date?: string;
  title: string;
  description?: string;
  /** Siapa yang mengambil / mengunggah, mis. "HP Umia". */
  credit?: string;
  /** Folder Drive berisi foto kegiatan — ditampilkan sebagai grid. */
  folderId?: string;
  /** File Drive tunggal (video/foto) — ditampilkan sebagai pratinjau. */
  fileIds?: string[];
};

export const albumEntries: AlbumEntry[] = [
  {
    date: "2026-10-02",
    title: "Dokumentasi 2 Oktober 2026",
    credit: "HP Umia",
    folderId: "1BZL8tv1OT_SPZVX_Tw-29X15SV-8UVUI",
  },
  {
    title: "Workshop Thesis 01",
    credit: "HP Makmunzir",
    fileIds: ["1OOJcw55kmb_3-n5C2sqciizAlqjwW_uC", "1grEQE0AOMs3J8BkmHPzRsQUFeFwcxTSC"],
  },
];

/** Kronologis: yang bertanggal dulu (lama → baru), yang belum bertanggal di akhir. */
export function sortedEntries(entries: AlbumEntry[] = albumEntries) {
  return [...entries].sort((a, b) => {
    if (a.date && b.date) return a.date.localeCompare(b.date);
    if (a.date) return -1;
    if (b.date) return 1;
    return 0;
  });
}

export const folderEmbedUrl = (id: string) => `https://drive.google.com/embeddedfolderview?id=${id}#grid`;
export const folderUrl = (id: string) => `https://drive.google.com/drive/folders/${id}`;
export const filePreviewUrl = (id: string) => `https://drive.google.com/file/d/${id}/preview`;
