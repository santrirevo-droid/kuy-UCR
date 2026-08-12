import matter from "gray-matter";
import fs from "node:fs/promises";
import path from "node:path";

export const GITHUB_OWNER = "santrirevo-droid";
export const GITHUB_REPO = "kuy-UCR";
export const GITHUB_BRANCH = "main";

/**
 * Ambil markdown untuk satu tahap.
 *
 * Sumber utama: raw.githubusercontent.com (selalu fresh, tanpa perlu redeploy
 * saat admin menyimpan perubahan lewat panel admin). Jika gagal (mis. saat
 * development lokal offline), fallback ke file lokal di /content.
 */
export async function getStageMarkdown(slug: string): Promise<string> {
  const url = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/content/${slug}.md`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      const raw = await res.text();
      const { content } = matter(raw);
      if (content.trim()) return content.trim();
    }
  } catch {
    // jaringan tidak tersedia (mis. dev lokal) — lanjut ke fallback lokal
  }

  try {
    const filePath = path.join(process.cwd(), "content", `${slug}.md`);
    const raw = await fs.readFile(filePath, "utf-8");
    const { content } = matter(raw);
    return content.trim();
  } catch {
    return "_Konten belum tersedia untuk tahap ini._";
  }
}
