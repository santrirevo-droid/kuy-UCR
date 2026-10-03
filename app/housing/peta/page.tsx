import Link from "next/link";
import { houses, UCR_CAMPUS } from "@/lib/housing";
import HousingMap from "@/components/HousingMap";
import Icon from "@/components/Icon";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata = {
  title: "Peta Housing",
  description: "Peta gabungan lokasi semua housing rombongan PKUMI–LPDP dan kampus UC Riverside.",
};

export default function HousingMapPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="border-b border-line bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
          <Link
            href="/housing"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-ink-muted transition hover:text-ink"
          >
            <Icon name="arrow-left" className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <Logo size={28} />
            <span className="font-display tracking-tight">Laporan Housing</span>
          </Link>
          <div className="flex items-center gap-2">
            <a
              href="/housing/kml"
              className="hidden items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-xs font-semibold text-ink-muted transition hover:border-brand hover:text-brand sm:inline-flex"
            >
              Unduh KML
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-5 sm:px-6">
        <h1 className="font-display text-xl font-semibold text-ink sm:text-2xl">Peta Housing Rombongan</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {houses.length} rumah di Riverside + kampus UCR. Klik pin untuk melihat penghuni &amp; menelepon kontak
          rumah.
        </p>
        <div className="mt-4">
          <HousingMap houses={houses} campus={UCR_CAMPUS} className="h-[62vh] min-h-[22rem]" />
        </div>
      </main>
    </div>
  );
}
