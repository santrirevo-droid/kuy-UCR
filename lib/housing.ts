// Data penempatan housing rombongan di Riverside. Nama lengkap mengikuti
// daftar personalia di content/struktur-kepengurusan.md; koordinat dari
// OpenStreetMap (titik bangunan/nomor rumah), dipakai untuk link Google Maps.
// Ubah file ini (+ redeploy) kalau ada perpindahan anggota atau alamat.
// Penghuni yang punya nomor telepon (kontak rumah) ditaruh paling atas.

export type Resident = {
  name: string;
  nickname: string;
  /** Nomor HP AS, format tampilan "(951) 377-8665". */
  phone?: string;
};

export type House = {
  id: string;
  /** Nama pendek rumah — biasanya nama jalannya. */
  name: string;
  street: string;
  city: string;
  lat: number;
  lng: number;
  /** Warna pin di peta gabungan. */
  color: string;
  residents: Resident[];
  note?: string;
};

/** UCR Bell Tower — titik acuan jarak ke kampus. */
export const UCR_CAMPUS = { name: "UCR Bell Tower", lat: 33.97353, lng: -117.32819 };

export const houses: House[] = [
  {
    id: "barret",
    color: "#2563eb",
    name: "Barret Road",
    street: "212 Barret Road",
    city: "Riverside, CA 92507",
    lat: 33.9744118,
    lng: -117.3161787,
    residents: [
      { name: "Risma Hikmawati", nickname: "Risma", phone: "(951) 222-9247" },
      { name: "Umiatu Rohmah", nickname: "Umiatu" },
      { name: "Putri Salsabila Azkya", nickname: "Putri" },
      { name: "Ibnatul Mardiah", nickname: "Ibna" },
      { name: "Enok Ghosiyah", nickname: "Enok" },
      { name: "Siti Nurkholilah", nickname: "Kholilah" },
    ],
  },
  {
    id: "mission-inn",
    color: "#d97706",
    name: "Mission Inn Avenue",
    street: "3050 Mission Inn Avenue",
    city: "Riverside, CA 92507",
    lat: 33.9789812,
    lng: -117.3654355,
    residents: [
      { name: "Muhammad Taufik Hudaya", nickname: "Taufik", phone: "(951) 906-0483" },
      { name: "Al Fahrizal", nickname: "Fahrizal", phone: "(951) 377-8665" },
      { name: "Arif Al Anang", nickname: "Arif" },
      { name: "Zaeni Anwar", nickname: "Zaeni" },
      { name: "Moh. Fadllurrahman", nickname: "Fadlurrahman" },
    ],
  },
  {
    id: "olivewood",
    color: "#059669",
    name: "Olivewood Avenue",
    street: "5470 Olivewood Avenue",
    city: "Riverside, CA 92506",
    lat: 33.9631064,
    lng: -117.3828218,
    residents: [
      { name: "Kiki Adnan Muzaki", nickname: "Kiki", phone: "(951) 906-0496" },
      { name: "Intihaul Fudola", nickname: "Fudola" },
      { name: "Tharekh Era Elraisy", nickname: "Tharekh" },
      { name: "Nurul", nickname: "Nurul" },
      { name: "Makmunzir", nickname: "Munzir" },
    ],
  },
  {
    id: "canyon-crest",
    color: "#7c3aed",
    name: "Canyon Crest",
    street: "1550 Central Avenue",
    city: "Riverside, CA 92507",
    lat: 33.955212,
    lng: -117.3456902,
    note: "Kompleks apartemen di kawasan Canyon Crest.",
    residents: [
      { name: "Dannu Akbar", nickname: "Dannu", phone: "(951) 906-0468" },
      { name: "Ahmad Sayyid Al Adam", nickname: "Sayyid", phone: "(951) 906-0492" },
      { name: "Mahmud Salim", nickname: "Mahmud", phone: "(951) 384-5055" },
      { name: "Muhammad Syamsur Rijal", nickname: "Rijal" },
      { name: "Saepul", nickname: "Saepul" },
      { name: "Azhar Ahmad Falahan", nickname: "Azhar" },
      { name: "M. Syukrillah", nickname: "Syukri" },
    ],
  },
  {
    id: "flanders",
    color: "#e11d48",
    name: "Flanders Road",
    street: "2935 Flanders Road",
    city: "Riverside, CA 92507",
    lat: 33.9863136,
    lng: -117.3229057,
    residents: [
      { name: "Muhammad Hidayat Rasiin", nickname: "Dayat", phone: "(951) 906-0973" },
      { name: "Davik Ihsan Purnama", nickname: "Davik", phone: "(951) 410-5539" },
    ],
  },
];

export function fullAddress(h: House): string {
  return `${h.street}, ${h.city}`;
}

/** Link tel: — nomor AS diawali kode negara +1. */
export function telUrl(phone: string): string {
  return `tel:+1${phone.replace(/\D/g, "")}`;
}

/** Link Google Maps yang membuka titik koordinat rumah. */
export function mapsUrl(h: House): string {
  return `https://www.google.com/maps/search/?api=1&query=${h.lat},${h.lng}`;
}

/** Link petunjuk arah dari rumah ke kampus UCR. */
export function directionsToCampusUrl(h: House): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${h.lat},${h.lng}&destination=${UCR_CAMPUS.lat},${UCR_CAMPUS.lng}`;
}

/** Peta tersemat (tanpa API key) berpusat di titik rumah. */
export function mapsEmbedUrl(h: House): string {
  return `https://maps.google.com/maps?q=${h.lat},${h.lng}&z=16&output=embed`;
}

/** Jarak garis lurus ke kampus dalam km (haversine) — bukan jarak tempuh jalan. */
export function distanceToCampusKm(h: House): number {
  const R = 6371;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(UCR_CAMPUS.lat - h.lat);
  const dLng = rad(UCR_CAMPUS.lng - h.lng);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(h.lat)) * Math.cos(rad(UCR_CAMPUS.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
