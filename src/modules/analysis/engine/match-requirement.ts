import type { JobRequirement } from "@/modules/job/domain/job-offer";
import type {
  RequirementMatch,
  RequirementMatchStatus,
} from "@/modules/analysis/domain/analysis-types";
import {
  clampUnit,
  evidenceWeights,
  matchThresholds,
} from "@/modules/analysis/scoring/scoring-config";
import type {
  ResumeEvidence,
  ResumeEvidenceIndex,
} from "@/modules/resume/domain/resume-evidence";
import { canonicalizeTerm } from "@/modules/shared/taxonomy/technology-aliases";
import { containsLooseTerm } from "@/modules/shared/text/normalize-text";
import { overlapRatio } from "@/modules/shared/text/similarity";

const maximumEvidencePerRequirement = 4;

const sectionWeight: Readonly<Record<ResumeEvidence["section"], number>> = {
  skills: evidenceWeights.exactSkillEntry,
  experience: evidenceWeights.experienceTechnology,
  project: evidenceWeights.projectTechnology,
  profile: evidenceWeights.profileMention,
  education: evidenceWeights.educationMention,
  languages: evidenceWeights.educationMention,
};

function fieldWeight(evidence: ResumeEvidence) {
  if (evidence.field === "technologies") {
    return sectionWeight[evidence.section];
  }

  if (evidence.field?.startsWith("achievements")) {
    return evidenceWeights.achievementPhrase;
  }

  if (evidence.field?.startsWith("highlights")) {
    return evidenceWeights.projectHighlight;
  }

  return sectionWeight[evidence.section];
}

const atomicEvidenceFields = new Set(["technologies"]);

function isAtomicEvidence(evidence: ResumeEvidence) {
  return (
    evidence.section === "skills" ||
    evidence.section === "languages" ||
    (evidence.field !== undefined && atomicEvidenceFields.has(evidence.field))
  );
}

function scoreEvidenceAgainstRequirement(
  requirement: JobRequirement,
  evidence: ResumeEvidence,
) {
  const canonicalRequirement = requirement.normalized;
  const canonicalEvidence = canonicalizeTerm(evidence.text);

  if (canonicalEvidence === canonicalRequirement) {
    return fieldWeight(evidence);
  }

  if (containsLooseTerm(evidence.text, requirement.label)) {
    return fieldWeight(evidence) * 0.95;
  }

  if (containsLooseTerm(evidence.text, canonicalRequirement)) {
    return fieldWeight(evidence) * 0.9;
  }

  if (
    isAtomicEvidence(evidence) &&
    (containsLooseTerm(requirement.label, evidence.text) ||
      containsLooseTerm(requirement.label, canonicalEvidence))
  ) {
    return fieldWeight(evidence) * 0.9;
  }

  const wordOverlap = overlapRatio(requirement.label, evidence.text);

  if (wordOverlap >= 0.75) {
    return evidenceWeights.looseTextOverlap * wordOverlap;
  }

  return 0;
}

function statusForScore(score: number): RequirementMatchStatus {
  if (score >= matchThresholds.strong) {
    return "strong-match";
  }

  if (score >= matchThresholds.partial) {
    return "partial-match";
  }

  return "missing";
}

export function matchRequirementDeterministically(
  requirement: JobRequirement,
  evidenceIndex: ResumeEvidenceIndex,
): RequirementMatch {
  const scored = evidenceIndex.entries
    .map((evidence) => ({
      evidence,
      score: scoreEvidenceAgainstRequirement(requirement, evidence),
    }))
    .filter((entry) => entry.score > 0)
    .sort((first, second) => second.score - first.score);

  if (scored.length === 0) {
    return {
      requirementId: requirement.id,
      status: "missing",
      score: 0,
      resumeEvidence: [],
    };
  }

  const bestScore = scored[0].score;
  const corroborationBonus = Math.min(0.12, (scored.length - 1) * 0.04);
  const score = clampUnit(bestScore + corroborationBonus);

  return {
    requirementId: requirement.id,
    status: statusForScore(score),
    score,
    resumeEvidence: scored
      .slice(0, maximumEvidencePerRequirement)
      .map((entry) => entry.evidence),
  };
}

export function matchAllRequirements(
  requirements: readonly JobRequirement[],
  evidenceIndex: ResumeEvidenceIndex,
): readonly RequirementMatch[] {
  return requirements.map((requirement) =>
    matchRequirementDeterministically(requirement, evidenceIndex),
  );
}
