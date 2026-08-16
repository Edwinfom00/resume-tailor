import type { ResumeEvidence } from "@/modules/resume/domain/resume-evidence";

export type RequirementMatchStatus =
  | "strong-match"
  | "partial-match"
  | "missing"
  | "unknown";

export type AnalysisSectionId = "profile" | "experience" | "projects" | "skills";

export interface RequirementMatch {
  readonly requirementId: string;
  readonly status: RequirementMatchStatus;
  readonly score: number;
  readonly resumeEvidence: readonly ResumeEvidence[];
  readonly reasoning?: string;
  readonly semantic?: boolean;
}

export interface MatchScoreDimensions {
  readonly skills: number;
  readonly experience: number;
  readonly projects: number;
  readonly profile: number;
  readonly keywords: number;
}

export interface MatchScore {
  readonly overall: number;
  readonly dimensions: MatchScoreDimensions;
}

export interface ItemRelevance {
  readonly itemId: string;
  readonly score: number;
  readonly matchedRequirements: readonly string[];
}

export interface SectionAnalysis {
  readonly section: AnalysisSectionId;
  readonly score: number;
  readonly strengths: readonly string[];
  readonly issues: readonly string[];
  readonly missingRequirementIds: readonly string[];
  readonly suggestionIds: readonly string[];
}

export interface ResumeJobAnalysis {
  readonly id: string;
  readonly analysisKey: string;
  readonly resumeHash: string;
  readonly jobHash: string;
  readonly score: MatchScore;
  readonly requirementMatches: readonly RequirementMatch[];
  readonly sections: readonly SectionAnalysis[];
  readonly experienceRelevance: readonly ItemRelevance[];
  readonly projectRelevance: readonly ItemRelevance[];
  readonly recommendedExperienceOrder: readonly string[];
  readonly recommendedProjectOrder: readonly string[];
  readonly semanticApplied: boolean;
  readonly createdAt: string;
}

export function matchedRequirementIds(analysis: ResumeJobAnalysis) {
  return analysis.requirementMatches
    .filter((match) => match.status === "strong-match")
    .map((match) => match.requirementId);
}

export function missingRequirementIds(analysis: ResumeJobAnalysis) {
  return analysis.requirementMatches
    .filter((match) => match.status === "missing")
    .map((match) => match.requirementId);
}
