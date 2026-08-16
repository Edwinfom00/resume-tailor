"use client";

import { useState } from "react";
import { AnalysisBenefitsPanel } from "@/modules/upload/components/analysis-benefits-panel";
import { AnalysisWorkflowSteps } from "@/modules/upload/components/analysis-workflow-steps";
import {
  JobOfferPanel,
  type JobOfferDraft,
} from "@/modules/upload/components/job-offer-panel";
import {
  createMockResume,
  type UploadedResume,
} from "@/modules/upload/components/resume-file";
import { ResumeUploadPanel } from "@/modules/upload/components/resume-upload-panel";
import { UploadActionPanel } from "@/modules/upload/components/upload-action-panel";
import type { Messages } from "@/i18n/messages/types";

type UploadAnalysisWorkspaceProps = Readonly<{
  analysisBenefitsMessages: Messages["analysisBenefits"];
  jobOfferMessages: Messages["jobOffer"];
  messages: Messages["upload"];
}>;

export function UploadAnalysisWorkspace({
  analysisBenefitsMessages,
  jobOfferMessages,
  messages,
}: UploadAnalysisWorkspaceProps) {
  const [uploadedFile, setUploadedFile] = useState<UploadedResume | null>(() =>
    createMockResume(messages),
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isJobOfferParsed, setIsJobOfferParsed] = useState(true);
  const [jobOffer, setJobOffer] = useState<JobOfferDraft>({
    description: "",
    url: "",
  });
  const [resetKey, setResetKey] = useState(0);

  const handleAnalyze = () => {
    if (!uploadedFile) {
      return;
    }

    setIsAnalyzing(true);
    window.setTimeout(() => setIsAnalyzing(false), 700);
  };

  const handleClear = () => {
    setUploadedFile(null);
    setIsAnalyzing(false);
    setIsJobOfferParsed(false);
    setJobOffer({ description: "", url: "" });
    setResetKey((currentKey) => currentKey + 1);
  };

  const handleUseSample = () => {
    setUploadedFile(createMockResume(messages));
    setIsAnalyzing(false);
    setIsJobOfferParsed(true);
    setJobOffer({ description: "", url: "" });
    setResetKey((currentKey) => currentKey + 1);
  };

  return (
    <div>
      <div className="grid items-start gap-(--rt-workspace-grid-gap) xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(19rem,0.6fr)]">
        <ResumeUploadPanel
          key={resetKey}
          messages={messages}
          uploadedFile={uploadedFile}
          onUploadedFileChange={setUploadedFile}
        />
        <JobOfferPanel
          isParsed={isJobOfferParsed}
          jobOffer={jobOffer}
          messages={jobOfferMessages}
          onJobOfferChange={(nextJobOffer) => {
            setJobOffer(nextJobOffer);
            setIsJobOfferParsed(false);
          }}
          onParse={() => setIsJobOfferParsed(true)}
        />
        <AnalysisBenefitsPanel messages={analysisBenefitsMessages} />
      </div>
      <div className="mt-(--rt-space-5) grid gap-(--rt-space-5) lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <UploadActionPanel
          canAnalyze={uploadedFile !== null}
          isAnalyzing={isAnalyzing}
          messages={messages}
          onAnalyze={handleAnalyze}
          onClear={handleClear}
          onUseSample={handleUseSample}
        />
        <AnalysisWorkflowSteps messages={messages} />
      </div>
    </div>
  );
}
