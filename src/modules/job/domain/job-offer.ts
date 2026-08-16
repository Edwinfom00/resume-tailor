export type JobInputSource = "url" | "text";

export type RequirementPriority = "critical" | "important" | "nice-to-have";

export type RequirementCategory =
  | "skill"
  | "technology"
  | "experience"
  | "education"
  | "language"
  | "responsibility"
  | "domain"
  | "soft-skill";

export interface JobRequirement {
  readonly id: string;
  readonly label: string;
  readonly normalized: string;
  readonly category: RequirementCategory;
  readonly priority: RequirementPriority;
  readonly evidence: string;
}

export interface JobOffer {
  readonly id: string;
  readonly source: JobInputSource;
  readonly url?: string;
  readonly title?: string;
  readonly company?: string;
  readonly location?: string;
  readonly employmentType?: string;
  readonly rawText: string;
  readonly summary: string;
  readonly responsibilities: readonly string[];
  readonly requiredSkills: readonly string[];
  readonly preferredSkills: readonly string[];
  readonly technologies: readonly string[];
  readonly keywords: readonly string[];
  readonly seniority?: string;
  readonly languages?: readonly string[];
  readonly educationRequirements?: readonly string[];
  readonly experienceRequirements?: readonly string[];
  readonly domain?: string;
  readonly requirements: readonly JobRequirement[];
  readonly extractedAt: string;
}

export type JobAnalysisStatus =
  | "idle"
  | "validating"
  | "fetching"
  | "extracting"
  | "structuring"
  | "completed"
  | "failed";

export const jobAnalysisProgress: Readonly<Record<JobAnalysisStatus, number>> = {
  idle: 0,
  validating: 10,
  fetching: 30,
  extracting: 55,
  structuring: 80,
  completed: 100,
  failed: 100,
};

export const requirementPriorityWeight: Readonly<
  Record<RequirementPriority, number>
> = {
  critical: 1,
  important: 0.6,
  "nice-to-have": 0.25,
};

export function sortRequirementsByPriority(
  requirements: readonly JobRequirement[],
) {
  return [...requirements].sort(
    (first, second) =>
      requirementPriorityWeight[second.priority] -
      requirementPriorityWeight[first.priority],
  );
}
