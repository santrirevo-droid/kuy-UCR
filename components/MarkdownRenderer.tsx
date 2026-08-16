"use client";

import { Children, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TableHTMLAttributes,
} from "react";

function plainText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(plainText).join("");
  if (node && typeof node === "object" && "props" in node) {
    const el = node as { props?: { children?: ReactNode } };
    return plainText(el.props?.children);
  }
  return "";
}

// Kotak catatan otomatis berganti warna sesuai emoji di awal teks:
// ⚠️ = peringatan (amber/merah), 💡 = tips (sky/teal), lainnya = netral (violet).
function calloutStyle(text: string) {
  const t = text.trim();
  if (t.startsWith("⚠️")) {
    return "border-amber-400 bg-amber-50 text-amber-900 dark:border-amber-600 dark:bg-amber-950/30 dark:text-amber-100";
  }
  if (t.startsWith("💡")) {
    return "border-sky-400 bg-sky-50 text-sky-900 dark:border-sky-600 dark:bg-sky-950/30 dark:text-sky-100";
  }
  if (t.startsWith("🕐") || t.startsWith("🎉")) {
    return "border-teal-400 bg-teal-50 text-teal-900 dark:border-teal-600 dark:bg-teal-950/30 dark:text-teal-100";
  }
  return "border-violet-400 bg-violet-50 text-violet-900 dark:border-violet-600 dark:bg-violet-950/30 dark:text-violet-100";
}

export type ChecklistTracker = {
  stageSlug: string;
  initialDone: number[];
};

export default function MarkdownRenderer({
  source,
  tracker,
}: {
  source: string;
  /** Kalau diisi, checkbox checklist jadi interaktif & tersimpan per-user. */
  tracker?: ChecklistTracker;
}) {
  const [done, setDone] = useState<Set<number>>(() => new Set(tracker?.initialDone ?? []));
  const [pending, setPending] = useState<Set<number>>(() => new Set());

  async function toggle(index: number, next: boolean) {
    if (!tracker) return;
    setDone((prev) => {
      const s = new Set(prev);
      next ? s.add(index) : s.delete(index);
      return s;
    });
    setPending((prev) => new Set(prev).add(index));
    try {
      const res = await fetch(`/api/progress/${tracker.stageSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index, done: next }),
      });
      if (!res.ok) throw new Error("failed");
    } catch {
      // gagal simpan — kembalikan ke state semula
      setDone((prev) => {
        const s = new Set(prev);
        next ? s.delete(index) : s.add(index);
        return s;
      });
    } finally {
      setPending((prev) => {
        const s = new Set(prev);
        s.delete(index);
        return s;
      });
    }
  }

  // Counter urutan checkbox — direset tiap render, dipakai sebagai index stabil
  // selama konten markdown-nya sendiri tidak berubah.
  let checkboxCounter = 0;

  return (
    <div
      className="prose prose-slate dark:prose-invert max-w-none
        prose-headings:scroll-mt-28 prose-headings:font-heading prose-headings:font-bold
        prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-orange-200 prose-h2:pb-2 prose-h2:text-2xl dark:prose-h2:border-slate-800
        prose-h3:mt-8 prose-h3:text-lg
        prose-p:leading-relaxed
        prose-li:marker:text-orange-500
        prose-strong:text-slate-900 dark:prose-strong:text-white
        prose-a:font-semibold prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-orange-400
        prose-pre:rounded-2xl prose-pre:bg-slate-900 prose-pre:text-slate-100
        prose-code:rounded prose-code:bg-orange-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal prose-code:text-orange-800 prose-code:before:content-none prose-code:after:content-none dark:prose-code:bg-slate-800 dark:prose-code:text-orange-300
        prose-img:rounded-xl"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: (props: TableHTMLAttributes<HTMLTableElement>) => (
            <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-orange-100 shadow-sm dark:border-slate-700">
              <table className="w-full min-w-[480px] border-collapse text-sm" {...props} />
            </div>
          ),
          thead: (props: HTMLAttributes<HTMLTableSectionElement>) => (
            <thead className="bg-orange-50 dark:bg-slate-800" {...props} />
          ),
          th: (props: HTMLAttributes<HTMLTableCellElement>) => (
            <th
              className="border-b border-orange-100 px-4 py-2.5 text-left font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
              {...props}
            />
          ),
          td: (props: HTMLAttributes<HTMLTableCellElement>) => (
            <td
              className="border-b border-orange-50 px-4 py-2.5 align-top text-slate-600 dark:border-slate-800 dark:text-slate-300"
              {...props}
            />
          ),
          blockquote: ({ children, ...props }: HTMLAttributes<HTMLQuoteElement>) => (
            <blockquote
              className={`not-italic my-6 rounded-r-xl border-l-4 px-5 py-3 shadow-sm [&>p]:my-1 ${calloutStyle(plainText(children))}`}
              {...props}
            >
              {children}
            </blockquote>
          ),
          a: ({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noreferrer" : undefined}
              {...props}
            />
          ),
          hr: () => <hr className="my-10 border-orange-200 dark:border-slate-800" />,
          // Checklist ("- [ ] ...") dirender sebagai kartu terpisah dengan baris
          // bergaris pemisah — bukan bullet list biasa — supaya tiap section
          // checklist kelihatan rapi & jadi satu unit visual.
          ul: ({ children, className, ...props }: HTMLAttributes<HTMLUListElement>) => {
            if (!className?.includes("contains-task-list")) {
              return (
                <ul className={className} {...props}>
                  {children}
                </ul>
              );
            }
            return (
              <ul
                className="not-prose my-5 divide-y divide-orange-100 overflow-hidden rounded-2xl border border-orange-100 bg-white/70 shadow-sm backdrop-blur dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/70"
                {...props}
              >
                {children}
              </ul>
            );
          },
          li: ({ children, className, ...props }: HTMLAttributes<HTMLLIElement>) => {
            const isTask = className?.includes("task-list-item");
            if (!isTask) {
              return (
                <li className={className} {...props}>
                  {children}
                </li>
              );
            }

            // Anak pertama dari <li> checklist selalu checkbox-nya (dari
            // remark-gfm) — dipisah supaya bisa ditaruh di kanan lewat flex,
            // sementara urutan DOM tetap checkbox-lalu-teks (aksesibel, dan
            // bikin selector peer-checked di bawah bisa jalan).
            const items = Children.toArray(children);
            const [checkbox, ...rest] = items;

            return (
              <li
                className="group flex flex-row-reverse items-center gap-3 px-4 py-3 transition hover:bg-orange-50/60 has-[:checked]:bg-teal-50/50 dark:hover:bg-slate-800/40 dark:has-[:checked]:bg-teal-950/20"
                {...props}
              >
                {checkbox}
                <span className="flex-1 text-sm leading-relaxed text-slate-700 peer-checked:text-slate-400 peer-checked:line-through dark:text-slate-200 dark:peer-checked:text-slate-500">
                  {rest}
                </span>
              </li>
            );
          },
          input: (props: InputHTMLAttributes<HTMLInputElement>) => {
            if (props.type !== "checkbox") return <input {...props} />;

            const index = checkboxCounter++;
            const boxClass =
              "peer h-6 w-6 shrink-0 cursor-pointer rounded-md border-2 border-slate-300 accent-teal-500 disabled:cursor-wait disabled:opacity-60 dark:border-slate-600";

            if (!tracker) {
              return <input type="checkbox" checked={!!props.checked} disabled className={boxClass} />;
            }

            const isDone = done.has(index);
            const isPending = pending.has(index);
            return (
              <input
                type="checkbox"
                checked={isDone}
                disabled={isPending}
                onChange={(e) => toggle(index, e.target.checked)}
                className={boxClass}
              />
            );
          },
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
