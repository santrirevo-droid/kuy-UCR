import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kuy, UCR! 🇺🇸📚",
  description:
    "Panduan operasional short course PKUMI-LPDP di UC Riverside, California — dari persiapan keberangkatan sampai pulang lagi.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-white text-slate-800 antialiased dark:bg-slate-950 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
