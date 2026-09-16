"use client";

import { Children, cloneElement, isValidElement, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Icon, { type IconName } from "@/components/Icon";
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

// Kotak catatan ditulis di markdown sebagai blockquote yang diawali emoji.
// Emoji itu cuma penanda jenis: di layar ia dibuang dan diganti ikon garis +
// label, supaya tampilannya seragam dan tidak bergantung font emoji OS.
type Callout = { prefix: string; icon: IconName; label: string; tone: string };

const CALLOUTS: Callout[] = [
  {
    prefix: "⚠️",
    icon: "alert",
    label: "Perhatian",
    tone: "border-warn/35 bg-warn-soft [--callout:var(--c-warn)]",
  },
  {
    prefix: "💡",
    icon: "bulb",
    label: "Tips",
    tone: "border-brand/30 bg-brand-soft [--callout:var(--c-brand)]",
  },
  {
    prefix: "🕐",
    icon: "clock",
    label: "Jadwal",
    tone: "border-gold/35 bg-gold-soft [--callout:var(--c-gold)]",
  },
  {
    prefix: "🎉",
    icon: "check",
    label: "Catatan baik",
    tone: "border-success/30 bg-success-soft [--callout:var(--c-success)]",
  },
];

const DEFAULT_CALLOUT: Callout = {
  prefix: "",
  icon: "info",
  label: "Catatan",
  tone: "border-line bg-surface-2 [--callout:var(--c-ink-subtle)]",
};

function matchCallout(text: string): Callout {
  const t = text.trim();
  return CALLOUTS.find((c) => t.startsWith(c.prefix)) ?? DEFAULT_CALLOUT;
}

/** Buang emoji penanda di awal teks pertama — sisanya dibiarkan apa adanya. */
function stripPrefix(node: ReactNode, prefix: string): ReactNode {
  if (!prefix) return node;
  let stripped = false;

  function walk(n: ReactNode): ReactNode {
    if (stripped) return n;
    if (typeof n === "string") {
      const trimmed = n.replace(/^\s+/, "");
      if (!trimmed.startsWith(prefix)) return n;
      stripped = true;
      return trimmed.slice(prefix.length).replace(/^[\s:]+/, "");
    }
    if (Array.isArray(n)) return n.map(walk);
    if (isValidElement(n)) {
      const children = (n.props as { children?: ReactNode }).children;
      if (children === undefined) return n;
      return cloneElement(n, undefined, walk(children));
    }
    return n;
  }

  return walk(node);
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
      className="prose max-w-none
        prose-headings:scroll-mt-28 prose-headings:font-display prose-headings:font-semibold prose-headings:tracking-tight
        prose-h2:mb-5 prose-h2:mt-14 prose-h2:border-b prose-h2:border-line prose-h2:pb-3 prose-h2:text-2xl
        prose-h3:mb-3 prose-h3:mt-10 prose-h3:text-lg
        prose-h4:mt-8 prose-h4:text-base
        prose-p:leading-[1.75]
        prose-a:font-medium prose-a:underline prose-a:decoration-brand/30 prose-a:underline-offset-[3px] hover:prose-a:decoration-brand
        prose-li:leading-[1.7] prose-li:marker:text-ink-subtle
        prose-hr:my-12 prose-hr:border-line
        prose-pre:overflow-x-auto prose-pre:rounded-lg prose-pre:border prose-pre:border-line prose-pre:text-[0.82rem] prose-pre:leading-relaxed
        prose-code:rounded prose-code:border prose-code:border-line prose-code:bg-surface-2 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.85em] prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
        prose-img:rounded-lg prose-img:border prose-img:border-line
        [&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Tabel tanpa judul kolom (ditulis "| | |" di markdown) tidak perlu
          // strip header kosong — thead-nya disembunyikan lewat :has().
          table: (props: TableHTMLAttributes<HTMLTableElement>) => (
            <div className="not-prose my-7 overflow-x-auto rounded-lg border border-line bg-surface [&_thead:has(th:empty)]:hidden">
              <table className="w-full min-w-[480px] border-collapse text-sm" {...props} />
            </div>
          ),
          thead: (props: HTMLAttributes<HTMLTableSectionElement>) => <thead className="bg-surface-2" {...props} />,
          th: (props: HTMLAttributes<HTMLTableCellElement>) => (
            <th
              className="border-b border-line px-4 py-3 text-left text-[0.68rem] font-semibold uppercase tracking-eyebrow text-ink-muted"
              {...props}
            />
          ),
          td: (props: HTMLAttributes<HTMLTableCellElement>) => (
            <td className="border-b border-line px-4 py-3 align-top leading-relaxed text-ink-muted" {...props} />
          ),
          blockquote: ({ children }: HTMLAttributes<HTMLQuoteElement>) => {
            const callout = matchCallout(plainText(children));
            return (
              <aside className={`not-prose my-7 rounded-lg border px-5 py-4 ${callout.tone}`}>
                <div className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-eyebrow text-[rgb(var(--callout))]">
                  <Icon name={callout.icon} className="h-3.5 w-3.5" />
                  {callout.label}
                </div>
                <div className="mt-2 space-y-2 text-[0.95rem] leading-relaxed text-ink [&_a]:font-medium [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2 [&_code]:rounded [&_code]:bg-surface/70 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.85em] [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
                  {stripPrefix(children, callout.prefix)}
                </div>
              </aside>
            );
          },
          a: ({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noreferrer" : undefined}
              {...props}
            />
          ),
          // Checklist dirender sebagai kartu tersendiri dengan baris bergaris
          // pemisah — bukan bullet list biasa — supaya tiap blok checklist jadi
          // satu unit visual yang jelas.
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
                className="not-prose my-6 divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface"
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
            // remark-gfm) — dipisah supaya bisa dibungkus markup sendiri.
            const items = Children.toArray(children);
            const [checkbox, ...rest] = items;

            return (
              <li
                className="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-surface-2/60 has-[:checked]:bg-success-soft/50"
                {...props}
              >
                {checkbox}
                <span className="flex-1 text-sm leading-relaxed text-ink transition-colors group-has-[:checked]:text-ink-subtle group-has-[:checked]:line-through">
                  {rest}
                </span>
              </li>
            );
          },
          input: (props: InputHTMLAttributes<HTMLInputElement>) => {
            if (props.type !== "checkbox") return <input {...props} />;

            const index = checkboxCounter++;
            const isDone = tracker ? done.has(index) : !!props.checked;
            const isPending = tracker ? pending.has(index) : false;

            return (
              <span className="relative mt-0.5 flex h-[1.15rem] w-[1.15rem] shrink-0 items-center justify-center">
                <input
                  type="checkbox"
                  checked={isDone}
                  disabled={!tracker || isPending}
                  onChange={tracker ? (e) => toggle(index, e.target.checked) : undefined}
                  className="peer h-full w-full cursor-pointer appearance-none rounded border border-line-strong bg-surface transition checked:border-brand checked:bg-brand disabled:cursor-default"
                />
                <Icon
                  name="check"
                  strokeWidth={3}
                  className="pointer-events-none absolute h-3 w-3 text-brand-on opacity-0 transition-opacity peer-checked:opacity-100"
                />
              </span>
            );
          },
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
