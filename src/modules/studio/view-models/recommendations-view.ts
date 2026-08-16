import type { ResumeData } from "@/@types/resume-data";
import type { JobOffer } from "@/modules/job/domain/job-offer";
import type { ResumeJobAnalysis } from "@/modules/analysis/domain/analysis-types";
import {
  sortSuggestionsByImpact,
  type ResumeSuggestion,
  type SuggestionPriority,
  type SuggestionStatus,
  type SuggestionType,
} from "@/modules/analysis/domain/suggestion-types";
import {
  buildRewriteAction,
  toRewriteLines,
} from "@/modules/analysis/suggestions/rewrite-action";
import type { ResumeSectionId } from "@/modules/session/domain/resume-selection";
import { canonicalizeTerm } from "@/modules/shared/taxonomy/technology-aliases";

export type StudioRecommendationTone = "positive" | "caution";

export type StudioSuggestionView = Readonly<{
  after: readonly string[];
  before: readonly string[];
  canApply: boolean;
  canEdit: boolean;
  id: string;
  requiresConfirmation: boolean;
  impact: number;
  itemId?: string;
  itemLabel?: string;
  priority: SuggestionPriority;
  reason: string;
  section: ResumeSectionId;
  status: SuggestionStatus;
  type: SuggestionType;
}>;

export type StudioRecommendation = Readonly<{
  currentKeywords?: readonly string[];
  id: ResumeSectionId;
  issues: readonly string[];
  relevanceGain?: number;
  score: number;
  strengths: readonly string[];
  suggestedKeywords?: readonly string[];
  suggestions: readonly StudioSuggestionView[];
  tone: StudioRecommendationTone;
}>;

const positiveScoreThreshold = 80;
const maximumHighImpactImprovements = 3;
const minimumHighImpact = 4;

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
    relevanceGain:
      additions.length === 0 ? undefined : Math.min(30, additions.length * 3),
  };
}

function resolveItemLabel(resume: ResumeData, suggestion: ResumeSuggestion) {
  const { itemId, section } = suggestion.target;

  if (!itemId) {
    return undefined;
  }

  if (section === "experience") {
    return resume.experiences.find((item) => item.id === itemId)?.employer;
  }

  if (section === "projects") {
    return resume.projects.find((item) => item.id === itemId)?.name;
  }

  return undefined;
}

export function toStudioSuggestionView(
  suggestion: ResumeSuggestion,
  resume: ResumeData,
): StudioSuggestionView {
  const after = toRewriteLines(suggestion.after);
  const before = toRewriteLines(suggestion.before);

  return {
    after,
    before,
    canApply: Boolean(suggestion.action),
    canEdit:
      (after.length > 0 || before.length > 0) &&
      buildRewriteAction(suggestion, after.length > 0 ? after : before) !==
        undefined,
    requiresConfirmation: suggestion.requiresUserConfirmation,
    id: suggestion.id,
    impact: suggestion.estimatedImpact,
    itemId: suggestion.target.itemId,
    itemLabel: resolveItemLabel(resume, suggestion),
    priority: suggestion.priority,
    reason: suggestion.reason,
    section: suggestion.target.section as ResumeSectionId,
    status: suggestion.status,
    type: suggestion.type,
  };
}

export function toStudioRecommendations(
  resume: ResumeData | undefined,
  job: JobOffer | undefined,
  analysis: ResumeJobAnalysis | undefined,
  suggestions: readonly ResumeSuggestion[],
): readonly StudioRecommendation[] {
  if (!resume || !analysis) {
    return [];
  }

  return analysis.sections.map((section) => {
    const sectionSuggestions = sortSuggestionsByImpact(
      suggestions.filter(
        (suggestion) => suggestion.target.section === section.section,
      ),
    ).map((suggestion) => toStudioSuggestionView(suggestion, resume));

    const base: StudioRecommendation = {
      id: section.section,
      issues: section.issues,
      score: section.score,
      strengths: section.strengths,
      suggestions: sectionSuggestions,
      tone:
        section.score >= positiveScoreThreshold
          ? ("positive" as const)
          : ("caution" as const),
    };

    return section.section === "skills" && job
      ? { ...base, ...keywordsForSkills(resume, job) }
      : base;
  });
}

export function toHighImpactImprovements(
  resume: ResumeData | undefined,
  suggestions: readonly ResumeSuggestion[],
): readonly StudioSuggestionView[] {
  if (!resume) {
    return [];
  }

  return sortSuggestionsByImpact(
    suggestions.filter(
      (suggestion) =>
        suggestion.status === "pending" &&
        suggestion.estimatedImpact >= minimumHighImpact,
    ),
  )
    .slice(0, maximumHighImpactImprovements)
    .map((suggestion) => toStudioSuggestionView(suggestion, resume));
}

export function hasActionableSuggestions(
  recommendation: StudioRecommendation,
) {
  return recommendation.suggestions.some(
    (suggestion) => suggestion.status !== "ignored",
  );
}
