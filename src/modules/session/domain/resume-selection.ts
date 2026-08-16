import type { AnalysisSectionId } from "@/modules/analysis/domain/analysis-types";
import type { ResumeAction } from "@/modules/resume/domain/resume-actions";
import type { SuggestionTarget } from "@/modules/analysis/domain/suggestion-types";

export type ResumeSectionId = AnalysisSectionId;

export interface ResumeSelection {
  readonly section: ResumeSectionId;
  readonly itemId?: string;
}

export interface ResumeHighlight extends ResumeSelection {
  readonly id: string;
}

export const resumeSectionIds: readonly ResumeSectionId[] = [
  "profile",
  "experience",
  "projects",
  "skills",
];

export function isResumeSectionId(value: string): value is ResumeSectionId {
  return (resumeSectionIds as readonly string[]).includes(value);
}

export function selectionForAction(
  action: ResumeAction,
): ResumeSelection | undefined {
  switch (action.type) {
    case "profile.update":
      return { section: "profile" };

    case "experience.create":
      return { section: "experience", itemId: action.experience.id };

    case "experience.update":
    case "experience.delete":
      return { section: "experience", itemId: action.itemId };

    case "experience.reorder":
      return { section: "experience" };

    case "project.create":
      return { section: "projects", itemId: action.project.id };

    case "project.update":
    case "project.delete":
      return { section: "projects", itemId: action.itemId };

    case "project.reorder":
      return { section: "projects" };

    case "skill.add":
    case "skill.remove":
      return { section: "skills" };

    default:
      return undefined;
  }
}

export function selectionForSuggestionTarget(
  target: SuggestionTarget,
): ResumeSelection | undefined {
  return isResumeSectionId(target.section)
    ? { section: target.section, itemId: target.itemId }
    : undefined;
}

export function isSameSelection(
  first: ResumeSelection | undefined,
  second: ResumeSelection | undefined,
) {
  return (
    first?.section === second?.section && first?.itemId === second?.itemId
  );
}

export function matchesSelection(
  selection: ResumeSelection,
  section: ResumeSectionId,
  itemId?: string,
) {
  if (selection.section !== section) {
    return false;
  }

  return selection.itemId === undefined || selection.itemId === itemId;
}
