import type { ResumeSuggestion } from "@/modules/analysis/domain/suggestion-types";

export type SuggestionRewrite = string | readonly string[];

export function buildRewriteAction(
  suggestion: ResumeSuggestion,
  rewrite: SuggestionRewrite,
): ResumeSuggestion["action"] {
  const isList = Array.isArray(rewrite);

  if (suggestion.target.section === "profile") {
    return {
      type: "profile.update",
      summary: isList ? (rewrite as readonly string[]).join(" ") : (rewrite as string),
    };
  }

  if (suggestion.target.section === "experience" && suggestion.target.itemId) {
    return {
      type: "experience.update",
      itemId: suggestion.target.itemId,
      changes: isList
        ? { achievements: rewrite as readonly string[] }
        : { summary: rewrite as string },
    };
  }

  if (suggestion.target.section === "projects" && suggestion.target.itemId) {
    return {
      type: "project.update",
      itemId: suggestion.target.itemId,
      changes: isList
        ? { highlights: rewrite as readonly string[] }
        : { description: rewrite as string },
    };
  }

  return undefined;
}

export function toRewriteLines(value: unknown): readonly string[] {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === "string");
  }

  return typeof value === "string" && value.length > 0 ? [value] : [];
}

export function fromRewriteLines(
  lines: readonly string[],
  original: unknown,
): SuggestionRewrite {
  const cleaned = lines.map((line) => line.trim()).filter(Boolean);

  return Array.isArray(original) ? cleaned : cleaned.join(" ");
}
