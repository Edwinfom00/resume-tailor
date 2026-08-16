"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnalysisBenefitsPanel } from "@/modules/upload/components/analysis-benefits-panel";
import { AnalysisWorkflowSteps } from "@/modules/upload/components/analysis-workflow-steps";
import {
  JobOfferPanel,
  type JobOfferDraft,
} from "@/modules/upload/components/job-offer-panel";
import {
  fromFileMetadata,
  type UploadedResume,
} from "@/modules/upload/components/resume-file";
import { ResumeUploadPanel } from "@/modules/upload/components/resume-upload-panel";
import { UploadActionPanel } from "@/modules/upload/components/upload-action-panel";
import { edwinResume } from "@/modules/resume/fixtures/edwin-resume";
import { useSessionStore } from "@/modules/session/state/session-store";
import { useSessionHydrated } from "@/modules/session/state/use-session-hydrated";
import { toLocalizedErrorMessage } from "@/modules/session/state/use-domain-error-message";
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
  const router = useRouter();
  const isHydrated = useSessionHydrated();
  const [resetKey, setResetKey] = useState(0);

  const resume = useSessionStore((state) => state.resume);
  const job = useSessionStore((state) => state.job);
  const analysis = useSessionStore((state) => state.analysis);
  const uploadResume = useSessionStore((state) => state.uploadResume);
  const clearResume = useSessionStore((state) => state.clearResume);
  const loadSampleResume = useSessionStore((state) => state.loadSampleResume);
  const setJobUrl = useSessionStore((state) => state.setJobUrl);
  const setJobDescription = useSessionStore((state) => state.setJobDescription);
  const extractJob = useSessionStore((state) => state.extractJob);
  const runAnalysis = useSessionStore((state) => state.runAnalysis);
  const resetSession = useSessionStore((state) => state.resetSession);

  const uploadedFile: UploadedResume | null = !isHydrated
    ? null
    : resume.originalFile
      ? fromFileMetadata(resume.originalFile, messages)
      : resume.data
        ? {
            name: messages.mockFileName,
            metadata: messages.mockFileMetadata,
            type: messages.fileTypeLabel,
          }
        : null;

  const jobOfferDraft: JobOfferDraft = {
    description: isHydrated ? job.description : "",
    url: isHydrated ? job.url : "",
  };

  const isAnalyzing = resume.status === "extracting" || analysis.running;

  const handleUploadedFileChange = (nextFile: UploadedResume | null) => {
    if (!nextFile) {
      clearResume();

      return;
    }

    if (nextFile.source) {
      void uploadResume(nextFile.source);
    }
  };

  const handleJobOfferChange = (nextJobOffer: JobOfferDraft) => {
    if (nextJobOffer.url !== job.url) {
      setJobUrl(nextJobOffer.url);
    }

    if (nextJobOffer.description !== job.description) {
      setJobDescription(nextJobOffer.description);
    }
  };

  const handleAnalyze = async () => {
    if (!resume.data) {
      return;
    }

    if (!job.data) {
      await extractJob();
    }

    await runAnalysis();

    if (useSessionStore.getState().analysis.data) {
      router.push(`/${locale}/studio`);
    }
  };

  const handleClear = () => {
    resetSession();
    setResetKey((currentKey) => currentKey + 1);
  };

  const handleUseSample = () => {
    loadSampleResume(edwinResume);
    setResetKey((currentKey) => currentKey + 1);
  };

  return (
    <div>
      <div className="grid items-start gap-(--rt-workspace-grid-gap) xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(19rem,0.6fr)]">
        <ResumeUploadPanel
          key={resetKey}
          messages={messages}
          uploadedFile={uploadedFile}
          onUploadedFileChange={handleUploadedFileChange}
          extractionErrorMessage={toLocalizedErrorMessage(
            resume.error,
            domainErrorMessages,
          )}
        />
        <JobOfferPanel
          isParsed={isHydrated && job.status === "completed"}
          isParsing={job.status === "fetching" || job.status === "structuring"}
          jobOffer={jobOfferDraft}
          messages={jobOfferMessages}
          onJobOfferChange={handleJobOfferChange}
          onParse={() => void extractJob()}
          errorMessage={toLocalizedErrorMessage(job.error, domainErrorMessages)}
          preview={{
            role: job.data?.title,
            company: job.data?.company,
            requirements: job.data
              ? job.data.requirements
                  .slice(0, 6)
                  .map((requirement) => requirement.label)
                  .join(", ")
              : undefined,
          }}
        />
        <AnalysisBenefitsPanel messages={analysisBenefitsMessages} />
      </div>
      <div className="mt-(--rt-space-5) grid gap-(--rt-space-5) lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <UploadActionPanel
          canAnalyze={Boolean(resume.data)}
          isAnalyzing={isAnalyzing}
          messages={messages}
          onAnalyze={() => void handleAnalyze()}
          onClear={handleClear}
          onUseSample={handleUseSample}
        />
        <AnalysisWorkflowSteps messages={messages} />
      </div>
    </div>
  );
}
