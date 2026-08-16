import type { Locale } from "@/i18n/locales";
import type { JobOffer } from "@/modules/job/domain/job-offer";
import type { ResumeJobAnalysis } from "@/modules/analysis/domain/analysis-types";
import { sortRequirementsByPriority } from "@/modules/job/domain/job-offer";

export type StudioRequirementStatus = "matched" | "missing";

export type StudioRequirementView = Readonly<{
  id: string;
  name: string;
  status: StudioRequirementStatus;
}>;

export type StudioJobOfferView = Readonly<{
  company?: string;
  extractedOn: string;
  keywords: readonly string[];
  location?: string;
  matchedRequirements: number;
  requirements: readonly StudioRequirementView[];
  title?: string;
  totalRequirements: number;
  type?: string;
}>;

const maximumListedRequirements = 12;
const matchedStatuses = new Set(["strong-match", "partial-match"]);

export function toStudioJobOfferView(
  job: JobOffer,
  analysis: ResumeJobAnalysis | undefined,
  locale: Locale,
): StudioJobOfferView {
  const statusById = new Map(
    (analysis?.requirementMatches ?? []).map((match) => [
      match.requirementId,
      match.status,
    ]),
  );
  const isMatched = (requirementId: string) =>
    matchedStatuses.has(statusById.get(requirementId) ?? "unknown");

  const ordered = sortRequirementsByPriority(job.requirements);

  return {
    company: job.company,
    extractedOn: new Date(job.extractedAt).toLocaleDateString(locale),
    keywords: job.keywords,
    location: job.location,
    matchedRequirements: job.requirements.filter((requirement) =>
      isMatched(requirement.id),
    ).length,
    requirements: ordered
      .slice(0, maximumListedRequirements)
      .map((requirement) => ({
        id: requirement.id,
        name: requirement.label,
        status: isMatched(requirement.id)
          ? ("matched" as const)
          : ("missing" as const),
      })),
    title: job.title,
    totalRequirements: job.requirements.length,
    type: job.employmentType,
  };
}
