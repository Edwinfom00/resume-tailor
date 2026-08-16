import type { JobOffer, JobRequirement } from "@/modules/job/domain/job-offer";
import type {
  MatchScore,
  MatchScoreDimensions,
  RequirementMatch,
} from "@/modules/analysis/domain/analysis-types";
import {
  categoryDimension,
  clampScore,
  dimensionWeights,
  priorityWeights,
  statusScores,
} from "@/modules/analysis/scoring/scoring-config";
import { canonicalizeTerm } from "@/modules/shared/taxonomy/technology-aliases";
import { containsLooseTerm } from "@/modules/shared/text/normalize-text";
import type { ResumeEvidenceIndex } from "@/modules/resume/domain/resume-evidence";

type DimensionKey = keyof MatchScoreDimensions;

interface WeightedAccumulator {
  weighted: number;
  weight: number;
}

function emptyAccumulators(): Record<DimensionKey, WeightedAccumulator> {
  return {
    skills: { weighted: 0, weight: 0 },
    experience: { weighted: 0, weight: 0 },
    projects: { weighted: 0, weight: 0 },
    profile: { weighted: 0, weight: 0 },
    keywords: { weighted: 0, weight: 0 },
  };
}

function ratio(accumulator: WeightedAccumulator) {
  return accumulator.weight === 0 ? 0 : accumulator.weighted / accumulator.weight;
}

function requirementScore(match: RequirementMatch) {
  return match.status === "partial-match" || match.status === "strong-match"
    ? Math.max(statusScores[match.status], match.score)
    : statusScores[match.status];
}

function computeKeywordCoverage(
  job: JobOffer,
  evidenceIndex: ResumeEvidenceIndex,
) {
  if (job.keywords.length === 0) {
    return { weighted: 0, weight: 0 };
  }

  const evidenceText = evidenceIndex.entries
    .map((entry) => entry.text)
    .join("\n");
  const canonicalEvidence = new Set(
    evidenceIndex.entries.map((entry) => canonicalizeTerm(entry.text)),
  );

  const covered = job.keywords.filter(
    (keyword) =>
      canonicalEvidence.has(canonicalizeTerm(keyword)) ||
      containsLooseTerm(evidenceText, keyword),
  ).length;

  return { weighted: covered, weight: job.keywords.length };
}

function profileDimensionScore(
  job: JobOffer,
  matches: readonly RequirementMatch[],
  profileAccumulator: WeightedAccumulator,
) {
  const criticalRequirements = job.requirements.filter(
    (requirement) => requirement.priority === "critical",
  );

  if (criticalRequirements.length === 0) {
    return profileAccumulator;
  }

  const matchById = new Map(
    matches.map((match) => [match.requirementId, match]),
  );

  const coveredInProfile = criticalRequirements.filter((requirement) =>
    matchById
      .get(requirement.id)
      ?.resumeEvidence.some((evidence) => evidence.section === "profile"),
  ).length;

  return {
    weighted: profileAccumulator.weighted + coveredInProfile,
    weight: profileAccumulator.weight + criticalRequirements.length,
  };
}

function projectDimensionScore(matches: readonly RequirementMatch[]) {
  const projectBacked = matches.filter((match) =>
    match.resumeEvidence.some((evidence) => evidence.section === "project"),
  );

  if (matches.length === 0) {
    return { weighted: 0, weight: 0 };
  }

  const weighted = projectBacked.reduce(
    (total, match) => total + requirementScore(match),
    0,
  );

  return { weighted, weight: matches.length };
}

export function computeMatchScore(
  job: JobOffer,
  matches: readonly RequirementMatch[],
  evidenceIndex: ResumeEvidenceIndex,
): MatchScore {
  const requirementById = new Map<string, JobRequirement>(
    job.requirements.map((requirement) => [requirement.id, requirement]),
  );
  const accumulators = emptyAccumulators();

  matches.forEach((match) => {
    const requirement = requirementById.get(match.requirementId);

    if (!requirement) {
      return;
    }

    const dimension = categoryDimension[requirement.category];
    const weight = priorityWeights[requirement.priority];

    accumulators[dimension].weighted += requirementScore(match) * weight;
    accumulators[dimension].weight += weight;
  });

  accumulators.keywords = computeKeywordCoverage(job, evidenceIndex);
  accumulators.projects = projectDimensionScore(matches);
  accumulators.profile = profileDimensionScore(job, matches, accumulators.profile);

  const dimensions: MatchScoreDimensions = {
    skills: clampScore(ratio(accumulators.skills) * 100),
    experience: clampScore(ratio(accumulators.experience) * 100),
    projects: clampScore(ratio(accumulators.projects) * 100),
    profile: clampScore(ratio(accumulators.profile) * 100),
    keywords: clampScore(ratio(accumulators.keywords) * 100),
  };

  const activeDimensions = (
    Object.keys(dimensionWeights) as readonly DimensionKey[]
  ).filter((dimension) => accumulators[dimension].weight > 0);

  const totalWeight = activeDimensions.reduce(
    (total, dimension) => total + dimensionWeights[dimension],
    0,
  );

  const overall =
    totalWeight === 0
      ? 0
      : activeDimensions.reduce(
          (total, dimension) =>
            total + dimensions[dimension] * dimensionWeights[dimension],
          0,
        ) / totalWeight;

  return { overall: clampScore(overall), dimensions };
}
