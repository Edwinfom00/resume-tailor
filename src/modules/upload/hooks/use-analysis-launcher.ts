"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages/types";
import {
  selectWorkflowState,
  useSessionStore,
} from "@/modules/session/state/session-store";
import { useSessionHydrated } from "@/modules/session/state/use-session-hydrated";
import { toLocalizedErrorMessage } from "@/modules/session/state/use-domain-error-message";
import { analysisReadyStates } from "@/modules/session/domain/workflow-state";

type UseAnalysisLauncherOptions = Readonly<{
  domainErrorMessages: Messages["domainErrors"];
  locale: Locale;
  messages: Messages["upload"];
}>;

export function useAnalysisLauncher({
  domainErrorMessages,
  locale,
  messages,
}: UseAnalysisLauncherOptions) {
  const router = useRouter();
  const isRunningRef = useRef(false);
  const isHydrated = useSessionHydrated();

  const workflowState = useSessionStore(selectWorkflowState);
  const jobStatus = useSessionStore((state) => state.job.status);
  const hasJobInput = useSessionStore(
    (state) =>
      state.job.url.trim().length > 0 || state.job.description.trim().length > 0,
  );
  const hasJobOffer = useSessionStore((state) => Boolean(state.job.data));
  const hasResume = useSessionStore((state) => Boolean(state.resume.data));
  const isAnalysisRunning = useSessionStore((state) => state.analysis.running);
  const hasAnalysis = useSessionStore((state) => Boolean(state.analysis.data));
  const analysisError = useSessionStore((state) => state.analysis.error);
  const extractJob = useSessionStore((state) => state.extractJob);
  const runAnalysis = useSessionStore((state) => state.runAnalysis);

  const isExtractingJob =
    jobStatus === "validating" ||
    jobStatus === "fetching" ||
    jobStatus === "extracting" ||
    jobStatus === "structuring";
  const isBusy = isExtractingJob || isAnalysisRunning;
  const isAnalysisCurrent =
    isHydrated && hasAnalysis && analysisReadyStates.has(workflowState);

  const stageLabel = (() => {
    if (jobStatus === "validating") {
      return messages.stageValidatingJob;
    }

    if (jobStatus === "fetching") {
      return messages.stageFetchingJob;
    }

    if (jobStatus === "extracting" || jobStatus === "structuring") {
      return messages.stageStructuringJob;
    }

    if (!isAnalysisRunning) {
      return null;
    }

    return hasAnalysis
      ? messages.stageGeneratingRecommendations
      : messages.stageReadingResume;
  })();

  const openWorkspace = useCallback(() => {
    router.push(`/${locale}/studio`);
  }, [locale, router]);

  const run = useCallback(async () => {
    if (isRunningRef.current || !hasResume) {
      return;
    }

    isRunningRef.current = true;

    try {
      if (!useSessionStore.getState().job.data) {
        await extractJob();

        if (!useSessionStore.getState().job.data) {
          return;
        }
      }

      await runAnalysis();

      if (useSessionStore.getState().analysis.data) {
        openWorkspace();
      }
    } finally {
      isRunningRef.current = false;
    }
  }, [extractJob, hasResume, openWorkspace, runAnalysis]);

  const blockedReason = !isHydrated
    ? null
    : !hasResume
      ? messages.needsResumeLabel
      : !hasJobOffer && !hasJobInput
        ? messages.needsJobLabel
        : null;

  return {
    blockedReason,
    canAnalyze:
      isHydrated && hasResume && (hasJobOffer || hasJobInput) && !isBusy,
    errorMessage: isHydrated
      ? toLocalizedErrorMessage(analysisError, domainErrorMessages)
      : null,
    isAnalysisCurrent,
    isBusy,
    openWorkspace,
    run,
    stageLabel,
    workflowState,
  };
}
