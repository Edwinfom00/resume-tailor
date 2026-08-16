"use client";

import { AnalysisBenefitsPanel } from "@/modules/upload/components/analysis-benefits-panel";
import { AnalysisWorkflowSteps } from "@/modules/upload/components/analysis-workflow-steps";
import { JobOfferPanel } from "@/modules/upload/components/job-offer-panel";
import { ResumeUploadPanel } from "@/modules/upload/components/resume-upload-panel";
import { UploadActionPanel } from "@/modules/upload/components/upload-action-panel";
import { useAnalysisLauncher } from "@/modules/upload/hooks/use-analysis-launcher";
import { edwinResume } from "@/modules/resume/fixtures/edwin-resume";
import { useSessionStore } from "@/modules/session/state/session-store";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages/types";

type UploadAnalysisWorkspaceProps = Readonly<{
  analysisBenefitsMessages: Messages["analysisBenefits"];
  domainErrorMessages: Messages["domainErrors"];
  jobOfferMessages: Messages["jobOffer"];
  locale: Locale;
  messages: Messages["upload"];
}>;

export function UploadAnalysisWorkspace({
  analysisBenefitsMessages,
  domainErrorMessages,
  jobOfferMessages,
  locale,
  messages,
}: UploadAnalysisWorkspaceProps) {
  const loadSampleResume = useSessionStore((state) => state.loadSampleResume);
  const resetSession = useSessionStore((state) => state.resetSession);
  const launcher = useAnalysisLauncher({
    domainErrorMessages,
    locale,
    messages,
  });

  return (
    <div>
      <div className="grid items-start gap-(--rt-workspace-grid-gap) xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(19rem,0.6fr)]">
        <ResumeUploadPanel
          domainErrorMessages={domainErrorMessages}
          locale={locale}
          messages={messages}
        />
        <JobOfferPanel
          domainErrorMessages={domainErrorMessages}
          messages={jobOfferMessages}
        />
        <AnalysisBenefitsPanel messages={analysisBenefitsMessages} />
      </div>
      <div className="mt-(--rt-space-5) grid gap-(--rt-space-5) lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <UploadActionPanel
          blockedReason={launcher.blockedReason}
          canAnalyze={launcher.canAnalyze}
          errorMessage={launcher.errorMessage}
          isAnalysisCurrent={launcher.isAnalysisCurrent}
          isBusy={launcher.isBusy}
          messages={messages}
          onAnalyze={() => void launcher.run()}
          onClear={resetSession}
          onOpenWorkspace={launcher.openWorkspace}
          onUseSample={() => loadSampleResume(edwinResume)}
          stageLabel={launcher.stageLabel}
        />
        <AnalysisWorkflowSteps messages={messages} />
      </div>
    </div>
  );
}
