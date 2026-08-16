import type {
  RequirementCategory,
  RequirementPriority,
} from "@/modules/job/domain/job-offer";
import type {
  MatchScoreDimensions,
  RequirementMatchStatus,
} from "@/modules/analysis/domain/analysis-types";

export const priorityWeights: Readonly<Record<RequirementPriority, number>> = {
  critical: 1,
  important: 0.6,
  "nice-to-have": 0.25,
};

export const statusScores: Readonly<Record<RequirementMatchStatus, number>> = {
  "strong-match": 1,
  "partial-match": 0.55,
  missing: 0,
  unknown: 0.15,
};

export const dimensionWeights: Readonly<Record<keyof MatchScoreDimensions, number>> =
  {
    skills: 0.34,
    experience: 0.28,
    projects: 0.14,
    profile: 0.12,
    keywords: 0.12,
  };

export const categoryDimension: Readonly<
  Record<RequirementCategory, keyof MatchScoreDimensions>
> = {
  skill: "skills",
  technology: "skills",
  experience: "experience",
  responsibility: "experience",
  domain: "experience",
  education: "profile",
  language: "profile",
  "soft-skill": "profile",
};

export const matchThresholds = {
  strong: 0.8,
  partial: 0.45,
} as const;

export const evidenceWeights = {
  exactSkillEntry: 1,
  experienceTechnology: 1,
  projectTechnology: 0.92,
  achievementPhrase: 0.75,
  projectHighlight: 0.7,
  profileMention: 0.6,
  educationMention: 0.55,
  looseTextOverlap: 0.45,
} as const;

export const semanticConfidenceFloor = 0.5;

export const itemRelevanceWeights = {
  requirementMatch: 1,
  recencyBonus: 0.15,
  contentDepth: 0.1,
} as const;

export function clampScore(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(value)));
}

export function clampUnit(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}
