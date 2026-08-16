import type { JobOffer } from "@/modules/job/domain/job-offer";
import type { ResumeJobAnalysis } from "@/modules/analysis/domain/analysis-types";
import {
  studioJobOffer,
  type JobRequirement,
} from "@/modules/studio/fixtures/job-offer";

export type StudioJobOfferView = Readonly<{
  company: string;
  location: string;
  matchedRequirements: number;
  postedDate: string;
  requirements: readonly JobRequirement[];
  title: string;
  totalRequirements: number;
  type: string;
  keywords: readonly string[];
}>;

const maximumListedRequirements = 12;

export function toStudioJobOfferView(
  job: JobOffer | undefined,
  analysis: ResumeJobAnalysis | undefined,
): StudioJobOfferView {
  if (!job) {
    return studioJobOffer;
  }

  const statusById = new Map(
    (analysis?.requirementMatches ?? []).map((match) => [
      match.requirementId,
      match.status,
    ]),
  );

  const requirements = job.requirements
    .slice(0, maximumListedRequirements)
    .map((requirement) => ({
      name: requirement.label,
      status:
        statusById.get(requirement.id) === "strong-match" ||
        statusById.get(requirement.id) === "partial-match"
          ? ("matched" as const)
          : ("missing" as const),
    }));

  const matchedRequirements = job.requirements.filter((requirement) => {
    const status = statusById.get(requirement.id);

    return status === "strong-match" || status === "partial-match";
  }).length;

  return {
    company: job.company ?? "",
    location: job.location ?? "",
    matchedRequirements,
    postedDate: new Date(job.extractedAt).toLocaleDateString(),
    requirements,
    title: job.title ?? "",
    totalRequirements: job.requirements.length,
    type: job.employmentType ?? "",
    keywords: job.keywords,
  };
}
