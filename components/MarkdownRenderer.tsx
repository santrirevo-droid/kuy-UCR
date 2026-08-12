import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode, TableHTMLAttributes } from "react";

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

export default function MarkdownRenderer({ source }: { source: string }) {
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
          li: ({ children, className, ...props }: HTMLAttributes<HTMLLIElement>) => {
            const isTask = className?.includes("task-list-item");
            return (
              <li
                className={isTask ? "list-none pl-0 [&>input]:mr-2 [&>input]:accent-orange-500" : className}
                {...props}
              >
                {children}
              </li>
            );
          },
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
