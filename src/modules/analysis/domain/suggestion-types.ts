import type { ResumeAction } from "@/modules/resume/domain/resume-actions";
import type { AnalysisSectionId } from "@/modules/analysis/domain/analysis-types";

export type SuggestionType =
  | "rewrite-profile"
  | "rewrite-experience"
  | "reorder-experiences"
  | "rewrite-project"
  | "reorder-projects"
  | "add-skill"
  | "remove-skill"
  | "highlight-skill"
  | "shorten-content"
  | "keyword-improvement"
  | "missing-skill";

export type SuggestionPriority = "high" | "medium" | "low";

export type SuggestionStatus = "pending" | "accepted" | "ignored" | "edited";

export interface SuggestionTarget {
  readonly section: AnalysisSectionId | "languages" | "education";
  readonly itemId?: string;
  readonly field?: string;
}

export interface ResumeSuggestion {
  readonly id: string;
  readonly type: SuggestionType;
  readonly target: SuggestionTarget;
  readonly priority: SuggestionPriority;
  readonly reason: string;
  readonly jobRequirementIds: readonly string[];
  readonly before?: unknown;
  readonly after?: unknown;
  readonly estimatedImpact: number;
  readonly confidence: number;
  readonly status: SuggestionStatus;
  readonly action?: ResumeAction;
  readonly requiresUserConfirmation: boolean;
  readonly createdAt: string;
}

const priorityRank: Readonly<Record<SuggestionPriority, number>> = {
  high: 3,
  medium: 2,
  low: 1,
};

export function sortSuggestionsByImpact(
  suggestions: readonly ResumeSuggestion[],
) {
  return [...suggestions].sort((first, second) => {
    const impactDelta = second.estimatedImpact - first.estimatedImpact;

    if (impactDelta !== 0) {
      return impactDelta;
    }

    const priorityDelta =
      priorityRank[second.priority] - priorityRank[first.priority];

    return priorityDelta !== 0
      ? priorityDelta
      : second.confidence - first.confidence;
  });
}

export function priorityForImpact(impact: number): SuggestionPriority {
  if (impact >= 8) {
    return "high";
  }

  return impact >= 3 ? "medium" : "low";
}
