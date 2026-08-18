import type {
  ResumeEducation,
  ResumeExperience,
  ResumeLanguage,
  ResumeProject,
  ResumeSkill,
} from "@/@types/resume-data";

export type ResumeActionType = ResumeAction["type"];

export interface UpdateProfileAction {
  readonly type: "profile.update";
  readonly summary?: string;
  readonly headline?: string;
  readonly highlights?: readonly string[];
}

export interface CreateExperienceAction {
  readonly type: "experience.create";
  readonly experience: Omit<ResumeExperience, "id"> & { readonly id?: string };
  readonly position?: number;
}

export interface UpdateExperienceAction {
  readonly type: "experience.update";
  readonly itemId: string;
  readonly changes: Partial<Omit<ResumeExperience, "id">>;
}

export interface DeleteExperienceAction {
  readonly type: "experience.delete";
  readonly itemId: string;
}

export interface ReorderExperienceAction {
  readonly type: "experience.reorder";
  readonly order: readonly string[];
}

export interface CreateProjectAction {
  readonly type: "project.create";
  readonly project: Omit<ResumeProject, "id"> & { readonly id?: string };
  readonly position?: number;
}

export interface UpdateProjectAction {
  readonly type: "project.update";
  readonly itemId: string;
  readonly changes: Partial<Omit<ResumeProject, "id">>;
}

export interface DeleteProjectAction {
  readonly type: "project.delete";
  readonly itemId: string;
}

export interface ReorderProjectAction {
  readonly type: "project.reorder";
  readonly order: readonly string[];
}

export interface AddSkillAction {
  readonly type: "skill.add";
  readonly groupName: string;
  readonly skill: ResumeSkill;
}

export interface RemoveSkillAction {
  readonly type: "skill.remove";
  readonly skillName: string;
}

export interface UpdateEducationAction {
  readonly type: "education.update";
  readonly itemId: string;
  readonly changes: Partial<Omit<ResumeEducation, "id">>;
}

export interface UpdateLanguageAction {
  readonly type: "language.update";
  readonly languageName: string;
  readonly changes: Partial<ResumeLanguage>;
}

export interface UpdateHeaderAction {
  readonly type: "header.update";
  readonly name?: string;
  readonly headline?: string;
  readonly email?: string;
  readonly phone?: string;
  readonly location?: {
    readonly city?: string;
    readonly region?: string;
    readonly country?: string;
    readonly remote?: boolean;
    readonly remoteStatus?: string;
  };
}

export type ResumeAction =
  | UpdateHeaderAction
  | UpdateProfileAction
  | CreateExperienceAction
  | UpdateExperienceAction
  | DeleteExperienceAction
  | ReorderExperienceAction
  | CreateProjectAction
  | UpdateProjectAction
  | DeleteProjectAction
  | ReorderProjectAction
  | AddSkillAction
  | RemoveSkillAction
  | UpdateEducationAction
  | UpdateLanguageAction;

export const factCreatingActionTypes: ReadonlySet<ResumeActionType> = new Set([
  "experience.create",
  "project.create",
  "skill.add",
]);

export function isFactCreatingAction(action: ResumeAction) {
  return factCreatingActionTypes.has(action.type);
}
