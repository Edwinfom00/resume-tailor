import type { ResumeData } from "@/@types/resume-data";
import type { ResumeAction } from "@/modules/resume/domain/resume-actions";
import {
  formatResumeDateRange,
  formatResumeLocation,
} from "@/modules/resume/components/sections/resume-formatters";

export type ProposalFieldKey = "company" | "role" | "dates" | "location";

export type ProposalPreviewKind =
  | "update"
  | "create-experience"
  | "create-project"
  | "skill"
  | "reorder"
  | "other";

export interface ProposalField {
  readonly key: ProposalFieldKey;
  readonly value: string;
}

export interface ProposalPreview {
  readonly bullets: readonly string[];
  readonly contextLabel?: string;
  readonly editableLines: readonly string[];
  readonly fields: readonly ProposalField[];
  readonly kind: ProposalPreviewKind;
}

function toField(key: ProposalFieldKey, value: string | undefined) {
  return value ? [{ key, value }] : [];
}

export function describeProposal(
  action: ResumeAction,
  resume: ResumeData,
  presentLabel: string,
): ProposalPreview {
  switch (action.type) {
    case "profile.update": {
      const lines = action.summary ? [action.summary] : [];

      return {
        bullets: lines,
        editableLines: lines,
        fields: [],
        kind: "update",
      };
    }

    case "experience.create": {
      const { experience } = action;

      return {
        bullets: experience.achievements,
        contextLabel: `${experience.employer} · ${experience.role}`,
        editableLines: experience.achievements,
        fields: [
          ...toField("company", experience.employer),
          ...toField("role", experience.role),
          ...toField("dates", formatResumeDateRange(experience.period, presentLabel)),
          ...toField("location", formatResumeLocation(experience.location)),
        ],
        kind: "create-experience",
      };
    }

    case "experience.update": {
      const experience = resume.experiences.find(
        (item) => item.id === action.itemId,
      );
      const lines = action.changes.achievements
        ? [...action.changes.achievements]
        : action.changes.summary
          ? [action.changes.summary]
          : [];

      return {
        bullets: lines,
        contextLabel: experience
          ? `${experience.employer} · ${experience.role}`
          : undefined,
        editableLines: lines,
        fields: [],
        kind: "update",
      };
    }

    case "project.create": {
      const { project } = action;

      return {
        bullets: project.highlights,
        contextLabel: project.name,
        editableLines: project.highlights,
        fields: [
          ...toField("role", project.role),
          ...toField(
            "dates",
            project.period
              ? formatResumeDateRange(project.period, presentLabel)
              : undefined,
          ),
        ],
        kind: "create-project",
      };
    }

    case "project.update": {
      const project = resume.projects.find((item) => item.id === action.itemId);
      const lines = action.changes.highlights
        ? [...action.changes.highlights]
        : action.changes.description
          ? [action.changes.description]
          : [];

      return {
        bullets: lines,
        contextLabel: project?.name,
        editableLines: lines,
        fields: [],
        kind: "update",
      };
    }

    case "skill.add":
      return {
        bullets: [action.skill.name],
        contextLabel: action.groupName,
        editableLines: [],
        fields: [],
        kind: "skill",
      };

    case "skill.remove":
      return {
        bullets: [action.skillName],
        editableLines: [],
        fields: [],
        kind: "skill",
      };

    case "experience.reorder":
      return {
        bullets: action.order
          .map(
            (itemId) =>
              resume.experiences.find((item) => item.id === itemId)?.employer,
          )
          .filter((label): label is string => Boolean(label)),
        editableLines: [],
        fields: [],
        kind: "reorder",
      };

    case "project.reorder":
      return {
        bullets: action.order
          .map((itemId) => resume.projects.find((item) => item.id === itemId)?.name)
          .filter((label): label is string => Boolean(label)),
        editableLines: [],
        fields: [],
        kind: "reorder",
      };

    default:
      return {
        bullets: [],
        editableLines: [],
        fields: [],
        kind: "other",
      };
  }
}

export function withEditedLines(
  action: ResumeAction,
  lines: readonly string[],
): ResumeAction {
  switch (action.type) {
    case "profile.update":
      return { ...action, summary: lines.join(" ") };

    case "experience.create":
      return {
        ...action,
        experience: { ...action.experience, achievements: lines },
      };

    case "experience.update":
      return action.changes.achievements
        ? { ...action, changes: { ...action.changes, achievements: lines } }
        : { ...action, changes: { ...action.changes, summary: lines.join(" ") } };

    case "project.create":
      return { ...action, project: { ...action.project, highlights: lines } };

    case "project.update":
      return action.changes.highlights
        ? { ...action, changes: { ...action.changes, highlights: lines } }
        : {
            ...action,
            changes: { ...action.changes, description: lines.join(" ") },
          };

    default:
      return action;
  }
}
