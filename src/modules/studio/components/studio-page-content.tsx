"use client";

import Link from "next/link";
import { useMemo } from "react";
import { JobOfferPanel } from "@/modules/studio/components/job-offer-panel";
import { AiRecommendationsPanel } from "@/modules/studio/components/ai-recommendations-panel";
import { StudioCopilot } from "@/modules/studio/components/studio-copilot";
import { StudioCvPanel } from "@/modules/studio/components/studio-cv-panel";
import { useAnalysisWorkspace } from "@/modules/studio/hooks/use-analysis-workspace";
import type { ResumeSectionId } from "@/modules/session/domain/resume-selection";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages/types";

type StudioPageContentProps = Readonly<{
  dictionary: Messages;
  locale: Locale;
}>;

const workspaceGridClassName =
  "grid flex-1 grid-cols-1 items-start gap-(--rt-studio-panel-gap) bg-canvas px-(--rt-space-6) py-(--rt-space-3) lg:grid-cols-[minmax(0,var(--rt-studio-sidebar-width))_minmax(0,var(--rt-studio-cv-panel-width))] min-[1672px]:grid-cols-[minmax(var(--rt-studio-sidebar-width),1fr)_minmax(var(--rt-studio-cv-panel-width),2fr)_minmax(var(--rt-studio-recommendations-width),1.4fr)]!";

export function StudioPageContent({
  dictionary,
  locale,
}: StudioPageContentProps) {
  const workspace = useAnalysisWorkspace(locale);

  const sectionLabels = useMemo<Readonly<Record<ResumeSectionId, string>>>(
    () => ({
      profile: dictionary.studio.cv.profileLabel,
      experience: dictionary.studio.cv.experienceLabel,
      projects: dictionary.studio.cv.projectsLabel,
      skills: dictionary.studio.cv.skillsLabel,
    }),
    [dictionary.studio.cv],
  );

  if (!workspace.isHydrated) {
    return (
      <main className={workspaceGridClassName} aria-busy="true">
        <div className="h-(--rt-studio-panel-min-height) w-full max-w-(--rt-studio-sidebar-width) rounded-xl border border-line-subtle bg-surface shadow-xs min-[1672px]:max-w-none!" />
        <div className="h-(--rt-studio-panel-min-height) w-full max-w-(--rt-studio-cv-panel-width) rounded-xl border border-line-subtle bg-surface shadow-xs min-[1672px]:max-w-none!" />
        <div className="lg:col-span-2 min-[1672px]:col-span-1!">
          <div className="h-(--rt-studio-panel-min-height) w-full max-w-(--rt-studio-recommendations-width) rounded-xl border border-line-subtle bg-surface shadow-xs min-[1672px]:max-w-none!" />
        </div>
      </main>
    );
  }

  if (!workspace.resume) {
    return (
      <main className="flex flex-1 items-center justify-center bg-canvas px-(--rt-space-6) py-(--rt-space-8)">
        <section className="rt-animate-rise w-full max-w-md rounded-xl border border-line-subtle bg-surface p-(--rt-space-8) text-center shadow-xs">
          <h1 className="text-lg font-bold tracking-tight text-ink">
            {dictionary.studio.emptyTitle}
          </h1>
          <p className="mt-(--rt-space-2) text-sm text-ink-muted">
            {dictionary.studio.emptyDescription}
          </p>
          <Link
            href={`/${locale}/upload`}
            className="mt-(--rt-space-5) inline-flex h-(--rt-control-height-md) items-center justify-center rounded-md bg-brand px-(--rt-space-6) text-sm font-semibold text-white shadow-xs transition-colors duration-(--rt-duration-fast) hover:bg-brand-hover"
          >
            {dictionary.studio.emptyActionLabel}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <>
      <main className={workspaceGridClassName}>
        <JobOfferPanel
          messages={dictionary.studio.jobOffer}
          jobOffer={workspace.jobOfferView}
        />
        <StudioCvPanel
          dictionary={dictionary}
          messages={dictionary.studio.cv}
          resume={workspace.resume}
        />
        <div className="lg:col-span-2 min-[1672px]:col-span-1!">
          <AiRecommendationsPanel
            hasAnalysis={Boolean(workspace.analysis)}
            highImpactImprovements={workspace.highImpactImprovements}
            messages={dictionary.studio.recommendations}
            recommendations={workspace.recommendations}
          />
        </div>
      </main>
      <StudioCopilot
        domainErrorMessages={dictionary.domainErrors}
        messages={dictionary.studio.copilot}
        presentLabel={dictionary.resume.experience.presentLabel}
        sectionLabels={sectionLabels}
      />
    </>
  );
}
