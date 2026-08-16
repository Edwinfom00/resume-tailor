"use client";

import { useMemo } from "react";
import type { Locale } from "@/i18n/locales";
import {
  selectWorkflowState,
  useSessionStore,
} from "@/modules/session/state/session-store";
import { useSessionHydrated } from "@/modules/session/state/use-session-hydrated";
import { toStudioJobOfferView } from "@/modules/studio/view-models/job-offer-view";
import {
  toHighImpactImprovements,
  toStudioRecommendations,
} from "@/modules/studio/view-models/recommendations-view";

export function useAnalysisWorkspace(locale: Locale) {
  const isHydrated = useSessionHydrated();
  const resume = useSessionStore((state) => state.resume.data);
  const job = useSessionStore((state) => state.job.data);
  const analysis = useSessionStore((state) => state.analysis.data);
  const suggestions = useSessionStore((state) => state.suggestions);
  const isReanalyzing = useSessionStore((state) => state.analysis.running);
  const workflowState = useSessionStore(selectWorkflowState);

  const jobOfferView = useMemo(
    () => (job ? toStudioJobOfferView(job, analysis, locale) : undefined),
    [analysis, job, locale],
  );

  const recommendations = useMemo(
    () => toStudioRecommendations(resume, job, analysis, suggestions),
    [analysis, job, resume, suggestions],
  );

  const highImpactImprovements = useMemo(
    () => toHighImpactImprovements(resume, suggestions),
    [resume, suggestions],
  );

  return {
    analysis: isHydrated ? analysis : undefined,
    highImpactImprovements: isHydrated ? highImpactImprovements : [],
    isHydrated,
    isReanalyzing,
    jobOfferView: isHydrated ? jobOfferView : undefined,
    recommendations: isHydrated ? recommendations : [],
    resume: isHydrated ? resume : undefined,
    workflowState,
  };
}
