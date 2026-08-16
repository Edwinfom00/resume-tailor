import type { ResumeSelection } from "@/modules/session/domain/resume-selection";

export type CopilotQuickActionId =
  | "improveProfile"
  | "reorderProjects"
  | "addExperience"
  | "addProject"
  | "addSkills"
  | "optimizeForJob"
  | "rewriteBullets"
  | "makeMoreRelevant"
  | "makeShorter";

export const generalQuickActionIds: readonly CopilotQuickActionId[] = [
  "improveProfile",
  "reorderProjects",
  "addExperience",
  "addProject",
  "addSkills",
  "optimizeForJob",
];

const selectionQuickActionIds: Readonly<
  Record<ResumeSelection["section"], readonly CopilotQuickActionId[]>
> = {
  profile: ["improveProfile", "makeShorter", "optimizeForJob"],
  experience: ["rewriteBullets", "makeMoreRelevant", "makeShorter"],
  projects: ["makeMoreRelevant", "reorderProjects", "makeShorter"],
  skills: ["addSkills", "optimizeForJob"],
};

export function quickActionIdsForSelection(
  selection: ResumeSelection | undefined,
): readonly CopilotQuickActionId[] {
  return selection
    ? selectionQuickActionIds[selection.section]
    : generalQuickActionIds;
}

export function requiresSelectionTarget(id: CopilotQuickActionId) {
  return (
    id === "rewriteBullets" || id === "makeMoreRelevant" || id === "makeShorter"
  );
}
