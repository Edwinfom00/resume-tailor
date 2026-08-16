import type { ResumeData } from "@/@types/resume-data";
import type { JobOffer } from "@/modules/job/domain/job-offer";
import type { ResumeJobAnalysis } from "@/modules/analysis/domain/analysis-types";
import type {
  ResumeSuggestion,
  SuggestionType,
} from "@/modules/analysis/domain/suggestion-types";
import {
  studioHighImpactImprovements,
  studioRecommendations,
  type StudioHighImpactImprovement,
  type StudioHighImpactImprovementId,
  type StudioRecommendation,
  type StudioRecommendationId,
} from "@/modules/studio/fixtures/recommendations";
import { canonicalizeTerm } from "@/modules/shared/taxonomy/technology-aliases";

const positiveScoreThreshold = 80;

const improvementSuggestionTypes: Readonly<
  Record<StudioHighImpactImprovementId, readonly SuggestionType[]>
> = {
  rewriteProfile: ["rewrite-profile"],
  reorderProjects: ["reorder-projects", "reorder-experiences"],
  highlightPostgres: ["highlight-skill", "missing-skill", "keyword-improvement"],
};

function keywordsForSkills(resume: ResumeData, job: JobOffer) {
  const current = resume.skills.flatMap((group) =>
    group.skills.map((skill) => skill.name),
  );
  const declared = new Set(current.map(canonicalizeTerm));
  const additions = job.keywords.filter(
    (keyword) => !declared.has(canonicalizeTerm(keyword)),
  );

  return {
    currentKeywords: current,
    suggestedKeywords: [...current, ...additions],
    relevanceGain: additions.length === 0 ? undefined : Math.min(30, additions.length * 3),
  };
}

export function toStudioRecommendations(
  resume: ResumeData | undefined,
  job: JobOffer | undefined,
  analysis: ResumeJobAnalysis | undefined,
): readonly StudioRecommendation[] {
  if (!resume || !job || !analysis) {
    return studioRecommendations;
  }

  return analysis.sections.map((section) => {
    const base = {
      id: section.section as StudioRecommendationId,
      score: section.score,
      tone:
        section.score >= positiveScoreThreshold
          ? ("positive" as const)
          : ("caution" as const),
    };

    return section.section === "skills"
      ? { ...base, ...keywordsForSkills(resume, job) }
      : base;
  });
}

export function toHighImpactImprovements(
  suggestions: readonly ResumeSuggestion[],
): readonly StudioHighImpactImprovement[] {
  const pending = suggestions.filter(
    (suggestion) => suggestion.status === "pending",
  );

  if (pending.length === 0) {
    return studioHighImpactImprovements;
  }

  return studioHighImpactImprovements.filter((improvement) =>
    pending.some((suggestion) =>
      improvementSuggestionTypes[improvement.id].includes(suggestion.type),
    ),
  );
}

export function findImprovementSuggestion(
  improvementId: StudioHighImpactImprovementId,
  suggestions: readonly ResumeSuggestion[],
) {
  return suggestions.find(
    (suggestion) =>
      suggestion.status === "pending" &&
      improvementSuggestionTypes[improvementId].includes(suggestion.type),
  );
}

export function findSectionSuggestions(
  sectionId: StudioRecommendationId,
  suggestions: readonly ResumeSuggestion[],
) {
  return suggestions.filter(
    (suggestion) =>
      suggestion.target.section === sectionId &&
      suggestion.status === "pending",
  );
}
