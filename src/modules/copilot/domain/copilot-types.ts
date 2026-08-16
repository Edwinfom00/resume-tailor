import type { ResumeAction } from "@/modules/resume/domain/resume-actions";
import type { DomainError } from "@/modules/shared/domain/domain-error";

export type CopilotIntent =
  | "profile.rewrite"
  | "experience.create"
  | "experience.update"
  | "experience.remove"
  | "experience.reorder"
  | "project.create"
  | "project.update"
  | "project.remove"
  | "project.reorder"
  | "skill.add"
  | "skill.remove"
  | "resume.optimizeForJob"
  | "resume.explainMatch"
  | "resume.findWeaknesses"
  | "resume.findStrengths"
  | "section.optimize"
  | "general";

export type CopilotMessageRole = "user" | "assistant" | "system";

export interface CopilotMessage {
  readonly id: string;
  readonly role: CopilotMessageRole;
  readonly content: string;
  readonly createdAt: string;
  readonly actionProposalId?: string;
}

export type CopilotProposalStatus =
  | "pending"
  | "applied"
  | "ignored"
  | "edited";

export interface CopilotActionProposal {
  readonly id: string;
  readonly type: "action-proposal";
  readonly intent: CopilotIntent;
  readonly action: ResumeAction;
  readonly explanation: string;
  readonly changeSummary: readonly string[];
  readonly estimatedImpact?: number;
  readonly requiresConfirmation: true;
  readonly requiresFactConfirmation: boolean;
  readonly unsupportedFacts: readonly string[];
  readonly status: CopilotProposalStatus;
  readonly createdAt: string;
}

export interface CopilotTextResult {
  readonly type: "message" | "question" | "analysis";
  readonly content: string;
  readonly intent: CopilotIntent;
}

export type CopilotResult = CopilotTextResult | CopilotActionProposal;

export interface CopilotState {
  readonly messages: readonly CopilotMessage[];
  readonly proposals: readonly CopilotActionProposal[];
  readonly pending: boolean;
  readonly error?: DomainError;
  readonly retryMessage?: string;
  readonly applyingProposalId?: string;
}

export const emptyCopilotState: CopilotState = {
  messages: [],
  proposals: [],
  pending: false,
};

export function proposalForMessage(
  state: CopilotState,
  message: CopilotMessage,
) {
  return message.actionProposalId
    ? state.proposals.find((proposal) => proposal.id === message.actionProposalId)
    : undefined;
}

export const maximumConversationMessages = 40;

export function boundMessages(messages: readonly CopilotMessage[]) {
  return messages.slice(-maximumConversationMessages);
}

export function isActionProposal(
  result: CopilotResult,
): result is CopilotActionProposal {
  return result.type === "action-proposal";
}
