import type { ResumeData } from "@/@types/resume-data";
import type { JobOffer } from "@/modules/job/domain/job-offer";
import type {
  ItemRelevance,
  RequirementMatch,
} from "@/modules/analysis/domain/analysis-types";
import {
  clampScore,
  itemRelevanceWeights,
  priorityWeights,
} from "@/modules/analysis/scoring/scoring-config";

function endYear(period: { start: { year: number }; end?: { year: number } }) {
  return period.end?.year ?? new Date().getUTCFullYear();
}

function recencyFactor(year: number) {
  const currentYear = new Date().getUTCFullYear();
  const age = Math.max(0, currentYear - year);

  return Math.max(0, 1 - age / 12);
}

function buildRelevance(
  itemIds: readonly string[],
  matches: readonly RequirementMatch[],
  job: JobOffer,
  depthByItem: ReadonlyMap<string, number>,
  recencyByItem: ReadonlyMap<string, number>,
): readonly ItemRelevance[] {
  const priorityByRequirement = new Map(
    job.requirements.map((requirement) => [
      requirement.id,
      priorityWeights[requirement.priority],
    ]),
  );

  return itemIds.map((itemId) => {
    const matchedRequirements = matches.filter(
      (match) =>
        match.status !== "missing" &&
        match.resumeEvidence.some((evidence) => evidence.itemId === itemId),
    );

    const requirementScore = matchedRequirements.reduce(
      (total, match) =>
        total +
        match.score * (priorityByRequirement.get(match.requirementId) ?? 0.25),
      0,
    );

    const maximumRequirementScore = job.requirements.reduce(
      (total, requirement) => total + priorityWeights[requirement.priority],
      0,
    );

    const normalizedRequirementScore =
      maximumRequirementScore === 0
        ? 0
        : requirementScore / maximumRequirementScore;

    const score =
      normalizedRequirementScore * itemRelevanceWeights.requirementMatch +
      (recencyByItem.get(itemId) ?? 0) * itemRelevanceWeights.recencyBonus +
      (depthByItem.get(itemId) ?? 0) * itemRelevanceWeights.contentDepth;

    return {
      itemId,
      score: clampScore(score * 100),
      matchedRequirements: matchedRequirements.map(
        (match) => match.requirementId,
      ),
    };
  });
}

export function computeExperienceRelevance(
  resume: ResumeData,
  job: JobOffer,
  matches: readonly RequirementMatch[],
): readonly ItemRelevance[] {
  const depth = new Map(
    resume.experiences.map((experience) => [
      experience.id,
      Math.min(1, experience.achievements.length / 6),
    ]),
  );
  const recency = new Map(
    resume.experiences.map((experience) => [
      experience.id,
      recencyFactor(endYear(experience.period)),
    ]),
  );

  return buildRelevance(
    resume.experiences.map((experience) => experience.id),
    matches,
    job,
    depth,
    recency,
  );
}

export function computeProjectRelevance(
  resume: ResumeData,
  job: JobOffer,
  matches: readonly RequirementMatch[],
): readonly ItemRelevance[] {
  const depth = new Map(
    resume.projects.map((project) => [
      project.id,
      Math.min(1, (project.highlights.length + project.technologies.length) / 8),
    ]),
  );
  const recency = new Map(
    resume.projects.map((project) => [
      project.id,
      project.period ? recencyFactor(endYear(project.period)) : 0.5,
    ]),
  );

  return buildRelevance(
    resume.projects.map((project) => project.id),
    matches,
    job,
    depth,
    recency,
  );
}

export function toRecommendedOrder(relevance: readonly ItemRelevance[]) {
  return [...relevance]
    .sort((first, second) => second.score - first.score)
    .map((item) => item.itemId);
}

export function isSameOrder(
  current: readonly string[],
  recommended: readonly string[],
) {
  return (
    current.length === recommended.length &&
    current.every((itemId, index) => itemId === recommended[index])
  );
}
