"use client";

import { useCallback, useMemo } from "react";
import type { Messages } from "@/i18n/messages/types";
import type { JobAnalysisStatus } from "@/modules/job/domain/job-offer";
import { useSessionStore } from "@/modules/session/state/session-store";
import { useSessionHydrated } from "@/modules/session/state/use-session-hydrated";
import { toLocalizedErrorMessage } from "@/modules/session/state/use-domain-error-message";

export type JobInputMode = "url" | "text";

export type JobInputStage =
  | "idle"
  | "validating"
  | "fetching"
  | "structuring"
  | "ready"
  | "error";

const stageByStatus = {
  idle: "idle",
  validating: "validating",
  fetching: "fetching",
  extracting: "structuring",
  structuring: "structuring",
  completed: "ready",
  failed: "error",
} as const satisfies Record<JobAnalysisStatus, JobInputStage>;

const maximumPreviewRequirements = 6;

type UseJobInputOptions = Readonly<{
  domainErrorMessages: Messages["domainErrors"];
  messages: Messages["jobOffer"];
}>;

export function useJobInput({
  domainErrorMessages,
  messages,
}: UseJobInputOptions) {
  const isHydrated = useSessionHydrated();
  const url = useSessionStore((state) => state.job.url);
  const description = useSessionStore((state) => state.job.description);
  const status = useSessionStore((state) => state.job.status);
  const jobOffer = useSessionStore((state) => state.job.data);
  const error = useSessionStore((state) => state.job.error);
  const setJobUrl = useSessionStore((state) => state.setJobUrl);
  const setJobDescription = useSessionStore((state) => state.setJobDescription);
  const extractJob = useSessionStore((state) => state.extractJob);

  const stage: JobInputStage = isHydrated ? stageByStatus[status] : "idle";
  const isExtracting =
    stage === "validating" || stage === "fetching" || stage === "structuring";
  const mode: JobInputMode = url.trim().length > 0 ? "url" : "text";

  const stageLabel = useMemo(() => {
    if (stage === "validating") {
      return messages.validatingLabel;
    }

    if (stage === "fetching") {
      return messages.fetchingLabel;
    }

    return stage === "structuring" ? messages.structuringLabel : null;
  }, [messages, stage]);

  const preview = useMemo(() => {
    if (!isHydrated || !jobOffer) {
      return undefined;
    }

    return {
      company: jobOffer.company,
      requirements: jobOffer.requirements
        .slice(0, maximumPreviewRequirements)
        .map((requirement) => requirement.label),
      requirementCount: jobOffer.requirements.length,
      role: jobOffer.title,
    };
  }, [isHydrated, jobOffer]);

  const submit = useCallback(() => {
    void extractJob();
  }, [extractJob]);

  return {
    canSubmit:
      !isExtracting &&
      (mode === "url" ? url.trim().length > 0 : description.trim().length > 0),
    description: isHydrated ? description : "",
    errorMessage: isHydrated
      ? toLocalizedErrorMessage(error, domainErrorMessages)
      : null,
    isExtracting,
    mode,
    preview,
    setJobDescription,
    setJobUrl,
    stage,
    stageLabel,
    submit,
    submitLabel:
      mode === "url" ? messages.fetchLabel : messages.parseDescriptionLabel,
    url: isHydrated ? url : "",
  };
}
