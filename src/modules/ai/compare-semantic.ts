import "server-only";
import { z } from "zod";
import type { ResumeData } from "@/@types/resume-data";
import type { JobRequirement } from "@/modules/job/domain/job-offer";
import type { RequirementMatch } from "@/modules/analysis/domain/analysis-types";
import {
  clampUnit,
  matchThresholds,
  semanticConfidenceFloor,
} from "@/modules/analysis/scoring/scoring-config";
import { generateStructured } from "@/modules/ai/generate-structured";
import {
  buildResumeEvidenceIndex,
  resumeEvidenceKey,
  type ResumeEvidence,
} from "@/modules/resume/domain/resume-evidence";
import { truncateText } from "@/modules/shared/text/normalize-text";

const semanticMatchSchema = z.object({
  matches: z
    .array(
      z.object({
        requirementId: z.string(),
        evidenceIds: z.array(z.string()).max(4),
        relevance: z.number().min(0).max(1),
        reasoning: z.string().max(400),
      }),
    )
    .max(40),
});

const system = `You judge whether a resume already demonstrates a job requirement using different wording.

Rules:
- You may only reference evidence by the exact evidenceId values provided. Never invent an evidenceId.
- Never invent resume facts. If the resume does not demonstrate the requirement, return relevance 0.
- "built role-based access control" demonstrates "authorization / RBAC". "developed customs declaration software" demonstrates "enterprise workflow systems".
- A requirement is only demonstrated when the referenced evidence genuinely implies it, not when the words merely look similar.
- relevance 1.0 means clearly demonstrated, 0.6 means partially demonstrated, 0 means not demonstrated.
- Only return requirements you consider at least partially demonstrated.`;

interface EvidenceCatalogEntry {
  readonly id: string;
  readonly evidence: ResumeEvidence;
}

function buildEvidenceCatalog(resume: ResumeData): readonly EvidenceCatalogEntry[] {
  return buildResumeEvidenceIndex(resume)
    .entries.filter((entry) => entry.text.length > 12)
    .slice(0, 120)
    .map((evidence, index) => ({ id: `e${index}`, evidence }));
}

function formatCatalog(catalog: readonly EvidenceCatalogEntry[]) {
  return catalog
    .map(
      (entry) =>
        `${entry.id} [${entry.evidence.section}${entry.evidence.itemId ? `/${entry.evidence.itemId}` : ""}] ${truncateText(entry.evidence.text, 240)}`,
    )
    .join("\n");
}

function formatRequirements(requirements: readonly JobRequirement[]) {
  return requirements
    .map(
      (requirement) =>
        `${requirement.id} (${requirement.category}, ${requirement.priority}): ${requirement.label}`,
    )
    .join("\n");
}

export async function compareSemanticRequirements(
  resume: ResumeData,
  unresolvedRequirements: readonly JobRequirement[],
): Promise<readonly RequirementMatch[]> {
  if (unresolvedRequirements.length === 0) {
    return [];
  }

  const catalog = buildEvidenceCatalog(resume);

  if (catalog.length === 0) {
    return [];
  }

  const catalogById = new Map(catalog.map((entry) => [entry.id, entry.evidence]));
  const requirementIds = new Set(
    unresolvedRequirements.map((requirement) => requirement.id),
  );

  const result = await generateStructured("semantic-comparison", {
    schema: semanticMatchSchema,
    system,
    prompt: `Resume evidence:\n${formatCatalog(catalog)}\n\nUnmatched job requirements:\n${formatRequirements(unresolvedRequirements.slice(0, 40))}`,
  });

  if (!result.ok) {
    return [];
  }

  return result.value.matches
    .filter(
      (match) =>
        requirementIds.has(match.requirementId) &&
        match.relevance >= semanticConfidenceFloor,
    )
    .map((match) => {
      const resolvedEvidence = match.evidenceIds
        .map((evidenceId) => catalogById.get(evidenceId))
        .filter((evidence): evidence is ResumeEvidence => evidence !== undefined);

      return { match, resolvedEvidence };
    })
    .filter(({ resolvedEvidence }) => resolvedEvidence.length > 0)
    .map(({ match, resolvedEvidence }) => {
      const score = clampUnit(match.relevance * 0.9);
      const deduplicated = new Map(
        resolvedEvidence.map((evidence) => [
          resumeEvidenceKey(evidence),
          evidence,
        ]),
      );

      return {
        requirementId: match.requirementId,
        status:
          score >= matchThresholds.strong
            ? ("strong-match" as const)
            : ("partial-match" as const),
        score,
        resumeEvidence: Array.from(deduplicated.values()),
        reasoning: match.reasoning,
        semantic: true,
      };
    });
}
