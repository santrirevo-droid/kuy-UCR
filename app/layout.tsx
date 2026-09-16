import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import PwaRegister from "@/components/PwaRegister";
import "./globals.css";

// Fraunces — serif editorial dengan kontras tinggi, dipakai khusus untuk judul
// & angka besar. Inter untuk seluruh teks antarmuka.
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kuy, UCR! — Panduan Program PKUMI–LPDP di UC Riverside",
    template: "%s · Kuy, UCR!",
  },
  description:
    "Panduan operasional short course PKUMI-LPDP di UC Riverside, California — dari persiapan keberangkatan sampai pulang lagi.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kuy, UCR!",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f5f2" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0f13" },
  ],
};

// Set class 'dark' sebelum React hydrate supaya tidak ada flash tema salah
// saat reload (baca preferensi tersimpan, fallback ke preferensi sistem).
const noFlashThemeScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (stored === "dark" || (!stored && prefersDark)) {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${display.variable} ${body.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashThemeScript }} />
      </head>
      <body className="bg-canvas font-sans text-ink antialiased">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
