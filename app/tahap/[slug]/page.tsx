import { notFound } from "next/navigation";
import { stages, getStageIndex } from "@/lib/stages";
import { getStageMarkdown } from "@/lib/content";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import StageNav from "@/components/StageNav";
import ProgressHeader from "@/components/ProgressHeader";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function StagePage({ params }: { params: { slug: string } }) {
  const idx = getStageIndex(params.slug);
  if (idx === -1) notFound();

  const stage = stages[idx];
  const content = await getStageMarkdown(stage.slug);
  const prev = idx > 0 ? stages[idx - 1] : null;
  const next = idx < stages.length - 1 ? stages[idx + 1] : null;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <ProgressHeader current={idx + 1} total={stages.length} stages={stages} activeSlug={stage.slug} />
      <main className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
        <div className="mb-8">
          <span className="text-4xl">{stage.icon}</span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {stage.title}
          </h1>
          <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">{stage.subtitle}</p>
        </div>
        <MarkdownRenderer source={content} />
        <StageNav prev={prev} next={next} />
      </main>
    </div>
  );
}
