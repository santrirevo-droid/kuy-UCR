import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { AnchorHTMLAttributes, HTMLAttributes, TableHTMLAttributes } from "react";

export default function MarkdownRenderer({ source }: { source: string }) {
  return (
    <div
      className="prose prose-slate dark:prose-invert max-w-none
        prose-headings:scroll-mt-28 prose-headings:font-bold
        prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-2 prose-h2:text-2xl dark:prose-h2:border-slate-800
        prose-h3:mt-8 prose-h3:text-lg
        prose-p:leading-relaxed
        prose-li:marker:text-emerald-500
        prose-strong:text-slate-900 dark:prose-strong:text-white
        prose-a:font-medium prose-a:text-emerald-700 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-emerald-400
        prose-pre:rounded-xl prose-pre:bg-slate-900 prose-pre:text-slate-100
        prose-code:rounded prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none dark:prose-code:bg-slate-800
        prose-img:rounded-xl"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: (props: TableHTMLAttributes<HTMLTableElement>) => (
            <div className="not-prose my-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full min-w-[480px] border-collapse text-sm" {...props} />
            </div>
          ),
          thead: (props: HTMLAttributes<HTMLTableSectionElement>) => (
            <thead className="bg-slate-50 dark:bg-slate-800" {...props} />
          ),
          th: (props: HTMLAttributes<HTMLTableCellElement>) => (
            <th
              className="border-b border-slate-200 px-4 py-2.5 text-left font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
              {...props}
            />
          ),
          td: (props: HTMLAttributes<HTMLTableCellElement>) => (
            <td
              className="border-b border-slate-100 px-4 py-2.5 align-top text-slate-600 dark:border-slate-800 dark:text-slate-300"
              {...props}
            />
          ),
          blockquote: (props: HTMLAttributes<HTMLQuoteElement>) => (
            <blockquote
              className="not-italic my-6 rounded-r-lg border-l-4 border-amber-400 bg-amber-50 px-5 py-3 text-slate-700 dark:border-amber-600 dark:bg-amber-950/30 dark:text-slate-200 [&>p]:my-1"
              {...props}
            />
          ),
          a: ({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noreferrer" : undefined}
              {...props}
            />
          ),
          hr: () => <hr className="my-10 border-slate-200 dark:border-slate-800" />,
          li: ({ children, className, ...props }: HTMLAttributes<HTMLLIElement>) => {
            const isTask = className?.includes("task-list-item");
            return (
              <li
                className={isTask ? "list-none pl-0 [&>input]:mr-2 [&>input]:accent-emerald-600" : className}
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
