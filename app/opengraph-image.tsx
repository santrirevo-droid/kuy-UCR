import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Gambar pratinjau link (WhatsApp, Telegram, dsb.) untuk semua halaman:
// logo program + nama situs. Halaman turunan memakai gambar yang sama.

export const alt = "Kuy, UCR! — Panduan Program PKUMI–LPDP di UC Riverside";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 88px",
          background: "#f6f5f2",
          borderBottom: "16px solid #1b3a5c",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={380} height={380} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#967228",
            }}
          >
            PKUMI–LPDP × UC Riverside
          </div>
          <div style={{ marginTop: 16, fontSize: 96, fontWeight: 700, color: "#1b3a5c", lineHeight: 1 }}>
            Kuy, UCR!
          </div>
          <div style={{ marginTop: 24, fontSize: 34, color: "#16191d", lineHeight: 1.3, maxWidth: 600 }}>
            Panduan operasional short course di UC Riverside, California
          </div>
          <div style={{ marginTop: 24, fontSize: 26, color: "#5b6168" }}>28 Sep – 25 Des 2026</div>
        </div>
      </div>
    ),
    size,
  );
}
