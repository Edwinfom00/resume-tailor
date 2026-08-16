import type { ResumeData } from "@/@types/resume-data";
import type { JobOffer } from "@/modules/job/domain/job-offer";
import type {
  RequirementMatch,
  ResumeJobAnalysis,
} from "@/modules/analysis/domain/analysis-types";
import type { ResumeSuggestion } from "@/modules/analysis/domain/suggestion-types";
import {
  buildAnalysisKey,
  hashJobOffer,
  hashResume,
} from "@/modules/analysis/engine/analysis-key";
import {
  computeExperienceRelevance,
  computeProjectRelevance,
  toRecommendedOrder,
} from "@/modules/analysis/engine/item-relevance";
import { matchAllRequirements } from "@/modules/analysis/engine/match-requirement";
import { buildSectionAnalyses } from "@/modules/analysis/engine/section-analysis";
import { computeMatchScore } from "@/modules/analysis/scoring/compute-match-score";
import { buildDeterministicSuggestions } from "@/modules/analysis/suggestions/build-suggestions";
import { buildResumeEvidenceIndex } from "@/modules/resume/domain/resume-evidence";
import { createIdentifier } from "@/modules/shared/domain/identifier";

export interface AnalysisOutcome {
  readonly analysis: ResumeJobAnalysis;
  readonly suggestions: readonly ResumeSuggestion[];
}

export function runDeterministicAnalysis(
  resume: ResumeData,
  job: JobOffer,
  semanticMatches: readonly RequirementMatch[] = [],
): AnalysisOutcome {
  const evidenceIndex = buildResumeEvidenceIndex(resume);
  const deterministicMatches = matchAllRequirements(
    job.requirements,
    evidenceIndex,
  );

  const semanticById = new Map(
    semanticMatches.map((match) => [match.requirementId, match]),
  );

  const matches = deterministicMatches.map((match) => {
    const semantic = semanticById.get(match.requirementId);

    if (!semantic || semantic.score <= match.score) {
      return match;
    }

    return { ...semantic, semantic: true };
  });

  const score = computeMatchScore(job, matches, evidenceIndex);
  const experienceRelevance = computeExperienceRelevance(resume, job, matches);
  const projectRelevance = computeProjectRelevance(resume, job, matches);
  const recommendedExperienceOrder = toRecommendedOrder(experienceRelevance);
  const recommendedProjectOrder = toRecommendedOrder(projectRelevance);

  const suggestions = buildDeterministicSuggestions(
    resume,
    job,
    matches,
    experienceRelevance,
    projectRelevance,
    recommendedExperienceOrder,
    recommendedProjectOrder,
  );

  const sections = buildSectionAnalyses(
    resume,
    job,
    matches,
    score,
    suggestions,
  );

  return {
    analysis: {
      id: createIdentifier("ana"),
      analysisKey: buildAnalysisKey(resume, job),
      resumeHash: hashResume(resume),
      jobHash: hashJobOffer(job),
      score,
      requirementMatches: matches,
      sections,
      experienceRelevance,
      projectRelevance,
      recommendedExperienceOrder,
      recommendedProjectOrder,
      semanticApplied: semanticMatches.length > 0,
      createdAt: new Date().toISOString(),
    },
    suggestions,
  };
}
