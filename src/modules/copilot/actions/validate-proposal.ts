import type { ResumeData } from "@/@types/resume-data";
import type { ResumeAction } from "@/modules/resume/domain/resume-actions";
import { collectResumeItemIds } from "@/modules/resume/domain/resume-evidence";
import { checkActionAgainstResume } from "@/modules/analysis/suggestions/anti-hallucination";
import type { CopilotResponsePayload } from "@/modules/copilot/domain/copilot-schema";
import type {
  CopilotActionProposal,
  CopilotResult,
} from "@/modules/copilot/domain/copilot-types";
import { createIdentifier } from "@/modules/shared/domain/identifier";

function referencesExistingItems(action: ResumeAction, resume: ResumeData) {
  const itemIds = collectResumeItemIds(resume);

  switch (action.type) {
    case "experience.update":
    case "experience.delete":
    case "project.update":
    case "project.delete":
      return itemIds.has(action.itemId);

    case "experience.reorder":
      return action.order.every((itemId) =>
        resume.experiences.some((experience) => experience.id === itemId),
      );

    case "project.reorder":
      return action.order.every((itemId) =>
        resume.projects.some((project) => project.id === itemId),
      );

    case "skill.remove":
      return resume.skills.some((group) =>
        group.skills.some(
          (skill) =>
            skill.name.toLowerCase() === action.skillName.toLowerCase(),
        ),
      );

    default:
      return true;
  }
}

function summarizeAction(action: ResumeAction): readonly string[] {
  switch (action.type) {
    case "profile.update":
      return [
        action.headline ? "Headline rewritten" : "",
        action.summary ? "Profile summary rewritten" : "",
        action.highlights ? `${action.highlights.length} highlight(s) set` : "",
      ].filter(Boolean);

    case "experience.create":
      return [
        `Add experience: ${action.experience.role} at ${action.experience.employer}`,
        `${action.experience.achievements.length} achievement(s)`,
      ];

    case "experience.update":
      return Object.keys(action.changes).map((field) => `Update ${field}`);

    case "experience.delete":
      return ["Remove experience"];

    case "experience.reorder":
      return ["Reorder experiences"];

    case "project.create":
      return [`Add project: ${action.project.name}`];

    case "project.update":
      return Object.keys(action.changes).map((field) => `Update ${field}`);

    case "project.delete":
      return ["Remove project"];

    case "project.reorder":
      return ["Reorder projects"];

    case "skill.add":
      return [`Add skill: ${action.skill.name}`];

    case "skill.remove":
      return [`Remove skill: ${action.skillName}`];

    default:
      return [];
  }
}

export function buildCopilotResult(
  payload: CopilotResponsePayload,
  resume: ResumeData,
): CopilotResult {
  if (payload.kind !== "action-proposal" || !payload.action) {
    return {
      type:
        payload.kind === "action-proposal"
          ? "message"
          : (payload.kind as "message" | "question" | "analysis"),
      content: payload.content,
      intent: payload.intent,
    };
  }

  const action = payload.action as ResumeAction;

  if (!referencesExistingItems(action, resume)) {
    return {
      type: "message",
      content: payload.content,
      intent: payload.intent,
    };
  }

  const factCheck = checkActionAgainstResume(action, resume);

  return {
    id: createIdentifier("prp"),
    type: "action-proposal",
    intent: payload.intent,
    action,
    explanation: payload.content,
    changeSummary: payload.changeSummary?.length
      ? payload.changeSummary
      : summarizeAction(action),
    estimatedImpact: payload.estimatedImpact ?? undefined,
    requiresConfirmation: true,
    requiresFactConfirmation: !factCheck.supported,
    unsupportedFacts: factCheck.violations.map((violation) => violation.value),
    status: "pending",
    createdAt: new Date().toISOString(),
  } satisfies CopilotActionProposal;
}
