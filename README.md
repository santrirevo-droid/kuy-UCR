# Kuy, UCR! 🇺🇸📚

Panduan operasional — Short Course PKUMI-LPDP di UC Riverside, California (28 Sep – 25 Des 2026).

Dibangun dengan **Next.js 14 (App Router) + Tailwind CSS**, dibaca seperti perjalanan bertahap ("Tahap 1 dari 9", dst), dan punya **panel admin** untuk mengedit konten langsung dari browser tanpa perlu sentuh kode.

🔗 **Live site:** _(diisi setelah deploy ke Vercel)_

## Struktur

```
app/                 halaman (landing, /tahap/[slug], /admin/*, API routes)
components/          komponen UI (markdown renderer, nav, dsb.)
content/*.md         SUMBER KONTEN — satu file markdown per tahap
lib/                 stage manifest, fetch konten, auth
middleware.ts        proteksi route /admin
```

## Bagaimana kontennya bekerja

- Halaman publik (`/tahap/[slug]`) mengambil markdown dari `content/<slug>.md` di repo ini **secara live** lewat `raw.githubusercontent.com` — dirender dinamis (`force-dynamic`), tanpa cache.
- Artinya: **edit lewat panel admin langsung tampil** di halaman publik dalam hitungan detik, **tanpa perlu Vercel redeploy**.
- Menambah/menghapus/reorder tahap (bukan sekadar isi teks) butuh ubah `lib/stages.ts` + redeploy, karena itu bagian dari kode.

## Progres per-peserta (butuh database)

Setiap peserta bisa **masuk (`/masuk`)** dengan akun yang dibuatkan admin, lalu mencentang checklist di tiap tahap — centangannya tersimpan per akun. Admin bisa melihat rekap semua peserta di **`/admin`** (Progres Peserta).

Fitur ini butuh database **Redis** (Vercel Storage). Sambungkan sekali via dashboard:

1. Buka project di [vercel.com](https://vercel.com) → tab **Storage** → **Create Database** → pilih **Redis** (Upstash, plan Free cukup)
2. Setelah dibuat, klik **Connect Project** → pilih project `kuy-ucr` → Environment: Production (+ Preview/Development kalau perlu) → Connect
3. Vercel otomatis menambahkan environment variable (`KV_REST_API_URL` / `KV_REST_API_TOKEN` atau `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`, tergantung versi integrasi — kode ini mendeteksi keduanya)
4. **Redeploy** project (Deployments → ⋯ pada deployment terakhir → Redeploy) supaya env var baru terbaca

Tanpa database, situs tetap jalan normal untuk pembaca publik — hanya fitur masuk/centang progres yang akan menampilkan pesan "database belum tersambung".

## Panel Admin (`/admin`)

Ada 3 tab:

- **📊 Progres Peserta** — tabel rekap checklist yang sudah dicentang tiap peserta, per tahap
- **📋 Kelola Konten** — edit isi tiap tahap (lihat di bawah)
- **👥 Kelola User** — buat akun untuk peserta baru (nama + username, password digenerate otomatis dan ditampilkan sekali — sampaikan manual ke pesertanya)

**Login admin** (`/admin/login`) beda dari login peserta (`/masuk`):

1. Buka `/admin/login`
2. Masukkan **password admin** (lihat catatan keamanan di bawah)
3. Masukkan **GitHub Personal Access Token** milik kamu sendiri — buat token *fine-grained* di GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens, scope **hanya ke repo `kuy-UCR`**, permission **Contents: Read and write**, beri masa berlaku (mis. 90 hari)

Khusus tab **Kelola Konten**: pilih tahap yang mau diedit, ubah markdown-nya (ada tab Preview), klik **Simpan** — perubahan otomatis ter-commit ke branch `main` repo ini dan langsung tampil di halaman publik.

**Catatan keamanan:** token GitHub yang kamu masukkan **tidak pernah disimpan di server** — hanya hidup di cookie `httpOnly` sesi browser kamu (kedaluwarsa 6 jam), dan hanya dipakai untuk memanggil GitHub API saat kamu membaca/menyimpan konten. Password admin default ada di `lib/auth.ts` — **ganti secepatnya** dengan cara set environment variable `ADMIN_PASSWORD` di Vercel Project Settings (tidak perlu ubah kode). Password akun peserta di-hash (bcrypt) sebelum disimpan ke database.

## Menjalankan secara lokal

```bash
npm install
npm run dev
# buka http://localhost:3000
```

## Deploy

Repo ini di-deploy ke **Vercel**. Jika ingin auto-deploy setiap ada perubahan kode (bukan konten — konten sudah live tanpa redeploy), hubungkan repo ini lewat Vercel Dashboard → Project Settings → Git → Connect Repository.

---

> ⚠️ Ini adalah catatan persiapan pribadi, bukan dokumen resmi LPDP/UCR/Kemenag. Selalu cek ulang info visa, tanggal, dan biaya ke sumber resmi.
