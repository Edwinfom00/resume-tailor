import "server-only";
import { z } from "zod";
import type { ResumeData } from "@/@types/resume-data";
import type { JobOffer } from "@/modules/job/domain/job-offer";
import type { ResumeSuggestion } from "@/modules/analysis/domain/suggestion-types";
import { checkRewriteAgainstResume } from "@/modules/analysis/suggestions/anti-hallucination";
import { buildRewriteAction } from "@/modules/analysis/suggestions/rewrite-action";
import { generateStructured } from "@/modules/ai/generate-structured";
import { truncateText } from "@/modules/shared/text/normalize-text";

const rewriteSchema = z.object({
  rewrites: z
    .array(
      z.object({
        suggestionId: z.string(),
        text: z.string().max(2400).optional(),
        bullets: z.array(z.string().max(600)).max(20).optional(),
        reason: z.string().max(400),
      }),
    )
    .max(12),
});

const system = `You rewrite resume content so it speaks to a specific job offer.

Hard rules:
- Preserve every fact. Never invent employers, dates, technologies, metrics, percentages or accomplishments.
- A number may only appear if it already appears in the original text you were given.
- Write in the same language as the original text. Never translate.
- Keep the same register and length class; do not pad with keywords.
- For "bullets", return the full replacement list in the intended order.
- For "text", return the replacement paragraph only.
- Skip any suggestion you cannot improve honestly.`;

function describeTarget(suggestion: ResumeSuggestion, resume: ResumeData) {
  if (suggestion.target.section === "profile") {
    return `suggestionId: ${suggestion.id}\ntype: profile summary\ncurrent:\n${resume.profile.summary}`;
  }

  if (suggestion.target.section === "experience" && suggestion.target.itemId) {
    const experience = resume.experiences.find(
      (item) => item.id === suggestion.target.itemId,
    );

    if (!experience) {
      return undefined;
    }

    return `suggestionId: ${suggestion.id}\ntype: experience bullets\nemployer: ${experience.employer}\nrole: ${experience.role}\ntechnologies: ${experience.technologies.join(", ")}\ncurrent bullets:\n${experience.achievements.map((item) => `- ${item}`).join("\n")}`;
  }

  if (suggestion.target.section === "projects" && suggestion.target.itemId) {
    const project = resume.projects.find(
      (item) => item.id === suggestion.target.itemId,
    );

    if (!project) {
      return undefined;
    }

    return `suggestionId: ${suggestion.id}\ntype: project description\nname: ${project.name}\ntechnologies: ${project.technologies.join(", ")}\ncurrent:\n${project.description}`;
  }

  return undefined;
}

const rewritableTypes = new Set([
  "rewrite-profile",
  "rewrite-experience",
  "rewrite-project",
  "shorten-content",
]);

export async function enrichSuggestionsWithRewrites(
  resume: ResumeData,
  job: JobOffer,
  suggestions: readonly ResumeSuggestion[],
): Promise<readonly ResumeSuggestion[]> {
  const rewritable = suggestions.filter((suggestion) =>
    rewritableTypes.has(suggestion.type),
  );

  if (rewritable.length === 0) {
    return suggestions;
  }

  const targets = rewritable
    .map((suggestion) => ({
      suggestion,
      description: describeTarget(suggestion, resume),
    }))
    .filter(
      (
        entry,
      ): entry is { suggestion: ResumeSuggestion; description: string } =>
        entry.description !== undefined,
    )
    .slice(0, 8);

  if (targets.length === 0) {
    return suggestions;
  }

  const jobContext = [
    `role: ${job.title ?? "unknown"}`,
    job.seniority ? `seniority: ${job.seniority}` : "",
    `critical requirements: ${job.requirements
      .filter((requirement) => requirement.priority === "critical")
      .map((requirement) => requirement.label)
      .join(", ")}`,
  ]
    .filter(Boolean)
    .join("\n");

  const result = await generateStructured("suggestion-generation", {
    schema: rewriteSchema,
    system,
    prompt: `Target job:\n${jobContext}\n\nItems to rewrite:\n${targets
      .map((entry) => truncateText(entry.description, 2000))
      .join("\n---\n")}`,
  });

  if (!result.ok) {
    return suggestions;
  }

  const rewriteById = new Map(
    result.value.rewrites.map((rewrite) => [rewrite.suggestionId, rewrite]),
  );

  return suggestions.map((suggestion) => {
    const rewrite = rewriteById.get(suggestion.id);

    if (!rewrite) {
      return suggestion;
    }

    const after = rewrite.bullets?.length ? rewrite.bullets : rewrite.text;

    if (after === undefined) {
      return suggestion;
    }

    const factCheck = checkRewriteAgainstResume(
      Array.isArray(after) ? after.join("\n") : after,
      resume,
    );

    if (!factCheck.supported) {
      return suggestion;
    }

    return {
      ...suggestion,
      after,
      reason: rewrite.reason || suggestion.reason,
      confidence: Math.min(0.9, suggestion.confidence + 0.1),
      action: buildRewriteAction(suggestion, after),
    };
  });
}
