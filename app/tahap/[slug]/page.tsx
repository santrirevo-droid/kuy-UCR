import { notFound } from "next/navigation";
import Link from "next/link";
import { stages, getStageIndex, accentStyles } from "@/lib/stages";
import { getStageMarkdown } from "@/lib/content";
import { getCurrentUser } from "@/lib/session";
import { getStageProgress, countChecklistItems } from "@/lib/progress";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import StageNav from "@/components/StageNav";
import ProgressHeader from "@/components/ProgressHeader";
import UserBadge from "@/components/UserBadge";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function StagePage({ params }: { params: { slug: string } }) {
  const idx = getStageIndex(params.slug);
  if (idx === -1) notFound();

  const stage = stages[idx];
  const accent = accentStyles[stage.accent];
  const content = await getStageMarkdown(stage.slug);
  const prev = idx > 0 ? stages[idx - 1] : null;
  const next = idx < stages.length - 1 ? stages[idx + 1] : null;

  const totalItems = countChecklistItems(content);
  const user = await getCurrentUser();
  const doneItems = user ? await getStageProgress(user.username, stage.slug).catch(() => []) : [];

  return (
    <div className="min-h-screen bg-orange-50/40 dark:bg-slate-950">
      <ProgressHeader
        current={idx + 1}
        total={stages.length}
        stages={stages}
        activeSlug={stage.slug}
        userBadge={<UserBadge />}
      />
      <main className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
        <div className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <span className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ${accent.badge}`}>
              {stage.icon}
            </span>
            {totalItems > 0 &&
              (user ? (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${accent.activeBg} ${accent.activeText}`}
                >
                  ✅ {doneItems.length}/{totalItems} selesai
                </span>
              ) : (
                <Link
                  href="/masuk"
                  className="rounded-full border border-dashed border-slate-300 px-3 py-1 text-xs font-semibold text-slate-400 transition hover:border-slate-400 hover:text-slate-600 dark:border-slate-700 dark:hover:text-slate-300"
                >
                  Masuk untuk simpan centanganmu →
                </Link>
              ))}
          </div>
          <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {stage.title}
          </h1>
          <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">{stage.subtitle}</p>
        </div>
        <MarkdownRenderer
          source={content}
          tracker={user ? { stageSlug: stage.slug, initialDone: doneItems } : undefined}
        />
        <StageNav prev={prev} next={next} />
      </main>
    </div>
  );
}
