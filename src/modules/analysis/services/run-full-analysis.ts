import "server-only";
import type { ResumeData } from "@/@types/resume-data";
import type { JobOffer } from "@/modules/job/domain/job-offer";
import { compareSemanticRequirements } from "@/modules/ai/compare-semantic";
import { enrichSuggestionsWithRewrites } from "@/modules/ai/generate-suggestions";
import { isAiConfigured } from "@/modules/ai/model-config";
import type { AnalysisOutcome } from "@/modules/analysis/engine/run-analysis";
import { runDeterministicAnalysis } from "@/modules/analysis/engine/run-analysis";

export async function runFullAnalysis(
  resume: ResumeData,
  job: JobOffer,
): Promise<AnalysisOutcome> {
  const deterministic = runDeterministicAnalysis(resume, job);

  if (!isAiConfigured()) {
    return deterministic;
  }

  const unresolvedRequirementIds = new Set(
    deterministic.analysis.requirementMatches
      .filter((match) => match.status === "missing" || match.status === "partial-match")
      .map((match) => match.requirementId),
  );

  const unresolvedRequirements = job.requirements.filter((requirement) =>
    unresolvedRequirementIds.has(requirement.id),
  );

  const semanticMatches = await compareSemanticRequirements(
    resume,
    unresolvedRequirements,
  );

  const withSemantics = runDeterministicAnalysis(resume, job, semanticMatches);

  const suggestions = await enrichSuggestionsWithRewrites(
    resume,
    job,
    withSemantics.suggestions,
  );

  return { analysis: withSemantics.analysis, suggestions };
}
