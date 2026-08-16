"use client";

import { useState } from "react";
import { AnalysisWorkflowSteps } from "@/modules/upload/components/analysis-workflow-steps";
import {
  createMockResume,
  type UploadedResume,
} from "@/modules/upload/components/resume-file";
import { ResumeUploadPanel } from "@/modules/upload/components/resume-upload-panel";
import { UploadActionPanel } from "@/modules/upload/components/upload-action-panel";
import type { Messages } from "@/i18n/messages/types";

type UploadAnalysisWorkspaceProps = Readonly<{
  messages: Messages["upload"];
}>;

export function UploadAnalysisWorkspace({
  messages,
}: UploadAnalysisWorkspaceProps) {
  const [uploadedFile, setUploadedFile] = useState<UploadedResume | null>(() =>
    createMockResume(messages),
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
    setResetKey((currentKey) => currentKey + 1);
  };

  const handleUseSample = () => {
    setUploadedFile(createMockResume(messages));
    setIsAnalyzing(false);
    setResetKey((currentKey) => currentKey + 1);
  };

  return (
    <div>
      <ResumeUploadPanel
        key={resetKey}
        messages={messages}
        uploadedFile={uploadedFile}
        onUploadedFileChange={setUploadedFile}
      />
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
