"use client";

import { JobOfferPanel } from "@/modules/studio/components/job-offer-panel";
import { AiRecommendationsPanel } from "@/modules/studio/components/ai-recommendations-panel";
import { StudioCopilot } from "@/modules/studio/components/studio-copilot";
import { StudioCvPanel } from "@/modules/studio/components/studio-cv-panel";
import { edwinResume } from "@/modules/resume/fixtures/edwin-resume";
import { useSessionStore } from "@/modules/session/state/session-store";
import { useSessionHydrated } from "@/modules/session/state/use-session-hydrated";
import { toStudioJobOfferView } from "@/modules/studio/view-models/job-offer-view";
import {
  findImprovementSuggestion,
  findSectionSuggestions,
  toHighImpactImprovements,
  toStudioRecommendations,
} from "@/modules/studio/view-models/recommendations-view";
import type { Messages } from "@/i18n/messages/types";

type StudioPageContentProps = Readonly<{
  dictionary: Messages;
}>;

export function StudioPageContent({ dictionary }: StudioPageContentProps) {
  const isHydrated = useSessionHydrated();
  const sessionResume = useSessionStore((state) => state.resume.data);
  const job = useSessionStore((state) => state.job.data);
  const analysis = useSessionStore((state) => state.analysis.data);
  const suggestions = useSessionStore((state) => state.suggestions);
  const acceptSuggestion = useSessionStore((state) => state.acceptSuggestion);
  const ignoreSuggestion = useSessionStore((state) => state.ignoreSuggestion);
  const sendCopilotMessage = useSessionStore(
    (state) => state.sendCopilotMessage,
  );

  const resume = (isHydrated && sessionResume) || edwinResume;
  const activeJob = isHydrated ? job : undefined;
  const activeAnalysis = isHydrated ? analysis : undefined;
  const activeSuggestions = isHydrated ? suggestions : [];

  const acceptSectionSuggestions = (sectionId: Parameters<typeof findSectionSuggestions>[0]) => {
    findSectionSuggestions(sectionId, activeSuggestions).forEach((suggestion) =>
      acceptSuggestion(suggestion.id),
    );
  };

  const ignoreSectionSuggestions = (sectionId: Parameters<typeof findSectionSuggestions>[0]) => {
    findSectionSuggestions(sectionId, activeSuggestions).forEach((suggestion) =>
      ignoreSuggestion(suggestion.id),
    );
  };

  return (
    <>
      <main className="grid flex-1 grid-cols-1 items-start gap-(--rt-studio-panel-gap) bg-canvas px-(--rt-space-6) py-(--rt-space-3) lg:grid-cols-[minmax(0,var(--rt-studio-sidebar-width))_minmax(0,var(--rt-studio-cv-panel-width))] min-[1672px]:grid-cols-[minmax(var(--rt-studio-sidebar-width),1fr)_minmax(var(--rt-studio-cv-panel-width),2fr)_minmax(var(--rt-studio-recommendations-width),1.4fr)]!">
        <JobOfferPanel
          messages={dictionary.studio.jobOffer}
          jobOffer={
            activeJob
              ? toStudioJobOfferView(activeJob, activeAnalysis)
              : undefined
          }
        />
        <StudioCvPanel
          dictionary={dictionary}
          messages={dictionary.studio.cv}
          resume={resume}
        />
        <div className="lg:col-span-2 min-[1672px]:col-span-1!">
          <AiRecommendationsPanel
            messages={dictionary.studio.recommendations}
            recommendations={
              activeAnalysis
                ? toStudioRecommendations(resume, activeJob, activeAnalysis)
                : undefined
            }
            highImpactImprovements={
              activeAnalysis
                ? toHighImpactImprovements(activeSuggestions)
                : undefined
            }
            onAccept={acceptSectionSuggestions}
            onIgnore={ignoreSectionSuggestions}
            onHighImpactSelect={(improvementId) => {
              const suggestion = findImprovementSuggestion(
                improvementId,
                activeSuggestions,
              );

              if (suggestion) {
                acceptSuggestion(suggestion.id);
              }
            }}
          />
        </div>
      </main>
      <StudioCopilot
        messages={dictionary.studio.copilot}
        onSubmitMessage={sendCopilotMessage}
      />
    </>
  );
}
