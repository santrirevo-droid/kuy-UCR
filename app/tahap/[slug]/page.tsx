import { notFound } from "next/navigation";
import Link from "next/link";
import { stages, getStageIndex, stageNumber } from "@/lib/stages";
import { getStageMarkdown } from "@/lib/content";
import { getCurrentUser } from "@/lib/session";
import { getStageProgress, countChecklistItems } from "@/lib/progress";
import { getPersonalData } from "@/lib/personal";
import Icon from "@/components/Icon";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import PersonalSpace from "@/components/PersonalSpace";
import StageNav from "@/components/StageNav";
import ProgressHeader from "@/components/ProgressHeader";
import UserBadge from "@/components/UserBadge";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const idx = getStageIndex(params.slug);
  if (idx === -1) return {};
  return { title: stages[idx].title, description: stages[idx].subtitle };
}

export default async function StagePage({ params }: { params: { slug: string } }) {
  const idx = getStageIndex(params.slug);
  if (idx === -1) notFound();

  const stage = stages[idx];
  const content = await getStageMarkdown(stage.slug);
  const prev = idx > 0 ? stages[idx - 1] : null;
  const next = idx < stages.length - 1 ? stages[idx + 1] : null;

  const totalItems = countChecklistItems(content);
  const user = await getCurrentUser();
  const doneItems = user ? await getStageProgress(user.username, stage.slug).catch(() => []) : [];
  const personalData = user ? await getPersonalData(user.username, stage.slug) : null;
  const donePct = totalItems > 0 ? Math.round((doneItems.length / totalItems) * 100) : 0;

  return (
    <div className="min-h-screen bg-canvas">
      <ProgressHeader
        current={idx + 1}
        total={stages.length}
        stages={stages}
        activeSlug={stage.slug}
        userBadge={<UserBadge />}
      />

      <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        {/* Kepala artikel */}
        <header className="animate-rise border-b border-line pb-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md border border-line bg-surface text-brand">
              <Icon name={stage.icon} className="h-5 w-5" />
            </span>
            <span className="flex flex-col">
              <span className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-ink-subtle">
                Tahap {stageNumber(idx)} dari {stageNumber(stages.length - 1)}
              </span>
              <span className="mt-0.5 text-sm font-medium text-gold">{stage.shortTitle}</span>
            </span>
          </div>

          <h1 className="mt-6 font-display text-display-sm font-semibold text-ink sm:text-display-md">{stage.title}</h1>
          <p className="mt-3 text-lg leading-relaxed text-ink-muted">{stage.subtitle}</p>

          {totalItems > 0 &&
            (user ? (
              <div className="mt-7 rounded-lg border border-line bg-surface px-4 py-3.5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[0.68rem] font-semibold uppercase tracking-eyebrow text-ink-subtle">
                    Progres checklist
                  </span>
                  <span className="tnum text-sm font-semibold text-ink">
                    {doneItems.length}
                    <span className="text-ink-subtle"> / {totalItems}</span>
                    <span className="ml-2 font-display text-ink-muted">{donePct}%</span>
                  </span>
                </div>
                <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-surface-2">
                  <div
                    className={`h-1 rounded-full transition-all duration-500 ${donePct === 100 ? "bg-success" : "bg-brand"}`}
                    style={{ width: `${donePct}%` }}
                  />
                </div>
              </div>
            ) : (
              <Link
                href="/masuk"
                className="group mt-7 flex items-center justify-between gap-3 rounded-lg border border-dashed border-line-strong px-4 py-3.5 text-sm text-ink-muted transition hover:border-brand hover:text-brand"
              >
                <span className="flex items-center gap-2.5">
                  <Icon name="lock" className="h-4 w-4" />
                  Masuk untuk menyimpan centangan checklist di tahap ini
                </span>
                <Icon name="arrow-right" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
        </header>

        <div className="mt-10">
          <MarkdownRenderer
            source={content}
            tracker={user ? { stageSlug: stage.slug, initialDone: doneItems } : undefined}
          />
        </div>

        {personalData ? (
          <PersonalSpace stageSlug={stage.slug} initialData={personalData} />
        ) : (
          <Link
            href="/masuk"
            className="group mt-12 flex items-center justify-between gap-3 rounded-lg border border-dashed border-line-strong bg-surface/50 px-5 py-4 text-sm text-ink-muted transition hover:border-brand hover:text-brand"
          >
            <span className="flex items-center gap-2.5">
              <Icon name="lock" className="h-4 w-4" />
              Masuk untuk punya checklist &amp; catatan pribadi di tahap ini
            </span>
            <Icon name="arrow-right" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}

        <StageNav prev={prev} next={next} />
      </main>
    </div>
  );
}
