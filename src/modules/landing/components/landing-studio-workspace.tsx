"use client";

import type { ResumeData } from "@/@types/resume-data";
import { WorkspaceHeader } from "@/components/navigation/workspace-header";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages/types";
import { AiRecommendationsPanel } from "@/modules/studio/components/ai-recommendations-panel";
import { JobOfferPanel } from "@/modules/studio/components/job-offer-panel";
import { StudioCvPanel } from "@/modules/studio/components/studio-cv-panel";
import type { StudioJobOfferView } from "@/modules/studio/view-models/job-offer-view";
import type {
  StudioRecommendation,
  StudioSuggestionView,
} from "@/modules/studio/view-models/recommendations-view";

type LandingStudioWorkspaceProps = Readonly<{
  dictionary: Messages;
  highImpactImprovements: readonly StudioSuggestionView[];
  jobOffer: StudioJobOfferView;
  locale: Locale;
  recommendations: readonly StudioRecommendation[];
  resume: ResumeData;
  score: number;
}>;

export function LandingStudioWorkspace({
  dictionary,
  highImpactImprovements,
  jobOffer,
  locale,
  recommendations,
  resume,
  score,
}: LandingStudioWorkspaceProps) {
  return (
    <section
      aria-hidden="true"
      className="relative mx-auto mt-(--rt-space-12) h-(--rt-landing-preview-height) max-w-(--rt-landing-preview-max) overflow-hidden rounded-panel border border-line-subtle bg-canvas shadow-lg"
    >
      <div className="pointer-events-none">
        <WorkspaceHeader
          languageSwitcherLabel={dictionary.languageSwitcher.label}
          locale={locale}
          messages={dictionary.workspaceHeader}
          exportMessages={dictionary.resumeExport}
          previewScore={score}
        />
        <div className="grid gap-(--rt-space-3) p-(--rt-space-3) xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.7fr)_minmax(0,1.15fr)] [&>aside]:max-w-none! [&>section]:max-w-none!">
          <JobOfferPanel
            jobOffer={jobOffer}
            messages={dictionary.studio.jobOffer}
          />
          <StudioCvPanel
            dictionary={dictionary}
            messages={dictionary.studio.cv}
            resume={resume}
          />
          <AiRecommendationsPanel
            hasAnalysis
            highImpactImprovements={highImpactImprovements}
            messages={dictionary.studio.recommendations}
            recommendations={recommendations}
          />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-(--rt-landing-preview-fade-height) bg-linear-to-b from-transparent via-canvas/85 to-canvas"
      />
    </section>
  );
}
