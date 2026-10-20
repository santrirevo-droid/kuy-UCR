import Link from "next/link";
import Icon from "@/components/Icon";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import UserBadge from "@/components/UserBadge";
import {
  DRIVE_ROOT_ID,
  filePreviewUrl,
  folderEmbedUrl,
  folderUrl,
  sortedEntries,
  type AlbumEntry,
} from "@/lib/album";

export const metadata = {
  title: "Album Kegiatan",
  description: "Dokumentasi kegiatan rombongan PKUMI–LPDP di UC Riverside, urut dari awal program.",
};

const fmtDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

function EntryMedia({ entry }: { entry: AlbumEntry }) {
  return (
    <div className="mt-4 space-y-3">
      {entry.folderId && (
        <iframe
          src={folderEmbedUrl(entry.folderId)}
          title={`Foto: ${entry.title}`}
          loading="lazy"
          className="h-[420px] w-full rounded-lg border border-line bg-white sm:h-[520px]"
        />
      )}
      {entry.fileIds && (
        <div className="grid gap-3 sm:grid-cols-2">
          {entry.fileIds.map((id) => (
            <iframe
              key={id}
              src={filePreviewUrl(id)}
              title={entry.title}
              loading="lazy"
              allow="autoplay; fullscreen"
              allowFullScreen
              className="aspect-video w-full rounded-lg border border-line bg-black"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function AlbumPage() {
  const entries = sortedEntries();

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-30 border-b border-line bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-4 sm:px-6 py-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-ink-muted transition hover:text-ink"
          >
            <Icon name="arrow-left" className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <Logo size={28} />
            <span className="font-display tracking-tight">Kuy, UCR!</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <UserBadge />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-16">
        <header className="animate-rise border-b border-line pb-7 sm:pb-10">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md border border-line bg-surface text-brand">
              <Icon name="camera" className="h-5 w-5" />
            </span>
            <span className="flex flex-col">
              <span className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-ink-subtle">
                Dokumentasi
              </span>
              <span className="mt-0.5 text-sm font-medium text-gold">Kronologis</span>
            </span>
          </div>

          <h1 className="mt-4 font-display sm:mt-6 text-display-xs font-semibold text-ink sm:text-display-md">
            Album Kegiatan
          </h1>
          <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-ink-muted sm:text-lg">
            Foto dan video kegiatan rombongan, diurutkan dari awal program. Semua file tetap tersimpan di Google Drive
            bersama.
          </p>
          <a
            href={folderUrl(DRIVE_ROOT_ID)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-md border border-line-strong px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
          >
            Buka folder Drive
            <Icon name="arrow-up-right" className="h-4 w-4" />
          </a>
        </header>

        <ol className="relative mt-8 border-l border-line pl-6 sm:mt-12 sm:pl-8">
          {entries.map((e) => (
            <li key={`${e.date ?? "x"}-${e.title}`} className="relative pb-10 last:pb-0 sm:pb-14">
              <span className="absolute -left-[1.85rem] top-1.5 h-3 w-3 rounded-full border-2 border-canvas bg-gold sm:-left-[2.35rem]" />
              <p className="text-[0.68rem] font-semibold uppercase tracking-eyebrow text-gold">
                {e.date ? fmtDate(e.date) : "Tanggal belum diisi"}
              </p>
              <h2 className="mt-1 font-display text-lg font-semibold text-ink sm:text-xl">{e.title}</h2>
              {(e.description || e.credit) && (
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                  {e.description}
                  {e.description && e.credit && " · "}
                  {e.credit && <span className="text-ink-subtle">Dok. {e.credit}</span>}
                </p>
              )}
              <EntryMedia entry={e} />
              {e.folderId && (
                <a
                  href={folderUrl(e.folderId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                >
                  Lihat ukuran penuh di Drive
                  <Icon name="arrow-up-right" className="h-3 w-3" />
                </a>
              )}
            </li>
          ))}
        </ol>

        <section className="mt-12 border-t border-line pt-8 sm:mt-16 sm:pt-10">
          <h2 className="font-display text-xl font-semibold text-ink sm:text-display-sm">Semua dokumentasi</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
            Isi lengkap folder Drive, termasuk foto yang belum dikelompokkan per kegiatan.
          </p>
          <iframe
            src={folderEmbedUrl(DRIVE_ROOT_ID)}
            title="Semua dokumentasi"
            loading="lazy"
            className="mt-5 h-[320px] w-full rounded-lg border border-line bg-white"
          />
        </section>
      </main>
    </div>
  );
}
