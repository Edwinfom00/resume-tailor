import type {
  JobInputSource,
  JobOffer,
  JobRequirement,
} from "@/modules/job/domain/job-offer";
import type { JobOfferDraftPayload } from "@/modules/job/domain/job-schema";
import { stripRequirementPrefix } from "@/modules/job/domain/requirement-label";
import { createIdentifier, createSlugIdentifier } from "@/modules/shared/domain/identifier";
import { canonicalizeTerm } from "@/modules/shared/taxonomy/technology-aliases";
import { collapseWhitespace } from "@/modules/shared/text/normalize-text";

function normalizeList(values: readonly string[] | undefined, limit: number) {
  const seen = new Map<string, string>();

  (values ?? []).forEach((value) => {
    const cleaned = collapseWhitespace(value);

    if (!cleaned) {
      return;
    }

    const key = canonicalizeTerm(cleaned);

    if (!seen.has(key)) {
      seen.set(key, cleaned);
    }
  });

  return Array.from(seen.values()).slice(0, limit);
}

function buildRequirements(
  draft: JobOfferDraftPayload,
): readonly JobRequirement[] {
  const used = new Set<string>();

  return draft.requirements
    .map((requirement) => {
      const label = collapseWhitespace(requirement.label);
      const normalized = canonicalizeTerm(stripRequirementPrefix(label));

      return { requirement, label, normalized };
    })
    .filter(({ label, normalized }) => {
      if (!label || used.has(normalized)) {
        return false;
      }

      used.add(normalized);

      return true;
    })
    .map(({ requirement, label, normalized }) => ({
      id: createSlugIdentifier("req", normalized),
      label,
      normalized,
      category: requirement.category,
      priority: requirement.priority,
      evidence: collapseWhitespace(requirement.evidence) || label,
    }));
}

const nonCompetencyKeyword =
  /(^|\s)(gmbh|ag|inc|ltd|sarl|team|abteilung|agentur|agency|standort|remote|vollzeit|teilzeit|full[- ]time|part[- ]time|homeoffice|home office)(\s|$)/i;

function sanitizeKeywords(
  keywords: readonly string[],
  draft: JobOfferDraftPayload,
) {
  const excluded = [draft.company, draft.location, draft.title, draft.domain]
    .filter((value): value is string => Boolean(value))
    .map((value) => canonicalizeTerm(value));

  return keywords.filter((keyword) => {
    const canonical = canonicalizeTerm(keyword);

    return (
      canonical.length > 1 &&
      !excluded.includes(canonical) &&
      !nonCompetencyKeyword.test(keyword) &&
      !excluded.some((value) => value.includes(canonical))
    );
  });
}

export function assembleJobOffer(
  draft: JobOfferDraftPayload,
  context: Readonly<{
    source: JobInputSource;
    rawText: string;
    url?: string;
  }>,
): JobOffer {
  return {
    id: createIdentifier("job"),
    source: context.source,
    url: context.url,
    title: draft.title ? collapseWhitespace(draft.title) : undefined,
    company: draft.company ? collapseWhitespace(draft.company) : undefined,
    location: draft.location ? collapseWhitespace(draft.location) : undefined,
    employmentType: draft.employmentType
      ? collapseWhitespace(draft.employmentType)
      : undefined,
    rawText: context.rawText,
    summary: collapseWhitespace(draft.summary),
    responsibilities: normalizeList(draft.responsibilities, 30),
    requiredSkills: normalizeList(draft.requiredSkills, 40),
    preferredSkills: normalizeList(draft.preferredSkills, 40),
    technologies: normalizeList(draft.technologies, 60),
    keywords: sanitizeKeywords(normalizeList(draft.keywords, 60), draft),
    seniority: draft.seniority ? collapseWhitespace(draft.seniority) : undefined,
    languages: normalizeList(draft.languages, 12),
    educationRequirements: normalizeList(draft.educationRequirements, 12),
    experienceRequirements: normalizeList(draft.experienceRequirements, 12),
    domain: draft.domain ? collapseWhitespace(draft.domain) : undefined,
    requirements: buildRequirements(draft),
    extractedAt: new Date().toISOString(),
  };
}

export function mergeJobDrafts(
  deterministic: JobOfferDraftPayload,
  ai: JobOfferDraftPayload,
): JobOfferDraftPayload {
  return {
    title: ai.title ?? deterministic.title,
    company: ai.company ?? deterministic.company,
    location: ai.location ?? deterministic.location,
    employmentType: ai.employmentType ?? deterministic.employmentType,
    seniority: ai.seniority ?? deterministic.seniority,
    domain: ai.domain ?? deterministic.domain,
    summary: ai.summary || deterministic.summary,
    responsibilities: ai.responsibilities.length
      ? ai.responsibilities
      : deterministic.responsibilities,
    requiredSkills: normalizeList(
      [...ai.requiredSkills, ...deterministic.requiredSkills],
      40,
    ),
    preferredSkills: normalizeList(
      [...ai.preferredSkills, ...deterministic.preferredSkills],
      40,
    ),
    technologies: normalizeList(
      [...ai.technologies, ...deterministic.technologies],
      60,
    ),
    keywords: normalizeList([...ai.keywords, ...deterministic.keywords], 60),
    languages: normalizeList(
      [...(ai.languages ?? []), ...(deterministic.languages ?? [])],
      12,
    ),
    educationRequirements: normalizeList(
      [
        ...(ai.educationRequirements ?? []),
        ...(deterministic.educationRequirements ?? []),
      ],
      12,
    ),
    experienceRequirements: normalizeList(
      [
        ...(ai.experienceRequirements ?? []),
        ...(deterministic.experienceRequirements ?? []),
      ],
      12,
    ),
    requirements: ai.requirements.length
      ? ai.requirements
      : deterministic.requirements,
  };
}
