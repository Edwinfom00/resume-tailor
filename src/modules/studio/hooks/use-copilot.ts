"use client";

import { useCallback, useMemo } from "react";
import type { Messages } from "@/i18n/messages/types";
import {
  quickActionIdsForSelection,
  requiresSelectionTarget,
  type CopilotQuickActionId,
} from "@/modules/copilot/domain/quick-actions";
import type { ResumeAction } from "@/modules/resume/domain/resume-actions";
import type { ResumeSectionId } from "@/modules/session/domain/resume-selection";
import {
  selectCanUndo,
  useSessionStore,
} from "@/modules/session/state/session-store";
import { useSessionHydrated } from "@/modules/session/state/use-session-hydrated";
import { toLocalizedErrorMessage } from "@/modules/session/state/use-domain-error-message";
import { formatTemplate } from "@/modules/shared/ui/format-template";

type UseCopilotOptions = Readonly<{
  domainErrorMessages: Messages["domainErrors"];
  messages: Messages["studio"]["copilot"];
  sectionLabels: Readonly<Record<ResumeSectionId, string>>;
}>;

export function useCopilot({
  domainErrorMessages,
  messages,
  sectionLabels,
}: UseCopilotOptions) {
  const isHydrated = useSessionHydrated();
  const resume = useSessionStore((state) => state.resume.data);
  const job = useSessionStore((state) => state.job.data);
  const conversation = useSessionStore((state) => state.copilot.messages);
  const proposals = useSessionStore((state) => state.copilot.proposals);
  const isPending = useSessionStore((state) => state.copilot.pending);
  const error = useSessionStore((state) => state.copilot.error);
  const retryMessage = useSessionStore((state) => state.copilot.retryMessage);
  const applyingProposalId = useSessionStore(
    (state) => state.copilot.applyingProposalId,
  );
  const selection = useSessionStore((state) => state.selection);
  const canUndo = useSessionStore(selectCanUndo);

  const sendCopilotMessage = useSessionStore(
    (state) => state.sendCopilotMessage,
  );
  const retryCopilotMessage = useSessionStore(
    (state) => state.retryCopilotMessage,
  );
  const dismissCopilotError = useSessionStore(
    (state) => state.dismissCopilotError,
  );
  const applyCopilotProposal = useSessionStore(
    (state) => state.applyCopilotProposal,
  );
  const ignoreCopilotProposal = useSessionStore(
    (state) => state.ignoreCopilotProposal,
  );
  const editCopilotProposal = useSessionStore(
    (state) => state.editCopilotProposal,
  );
  const selectResumeSection = useSessionStore(
    (state) => state.selectResumeSection,
  );
  const undoLastChange = useSessionStore((state) => state.undoLastChange);

  const selectionLabel = useMemo(() => {
    if (!selection || !resume) {
      return undefined;
    }

    if (selection.section === "experience" && selection.itemId) {
      return resume.experiences.find((item) => item.id === selection.itemId)
        ?.employer;
    }

    if (selection.section === "projects" && selection.itemId) {
      return resume.projects.find((item) => item.id === selection.itemId)?.name;
    }

    return sectionLabels[selection.section];
  }, [resume, sectionLabels, selection]);

  const send = useCallback(
    (content: string) => {
      const trimmed = content.trim();

      if (trimmed) {
        void sendCopilotMessage(trimmed);
      }
    },
    [sendCopilotMessage],
  );

  const quickActions = useMemo(
    () =>
      quickActionIdsForSelection(selection).map((id) => {
        const copy = messages.quickActions[id];

        return {
          id,
          label: copy.label,
          prompt: formatTemplate(copy.prompt, {
            target: selectionLabel ?? "",
          }).replace(/\s{2,}/g, " "),
        };
      }),
    [messages.quickActions, selection, selectionLabel],
  );

  const runQuickAction = useCallback(
    (id: CopilotQuickActionId) => {
      const action = quickActions.find((entry) => entry.id === id);

      if (!action || (requiresSelectionTarget(id) && !selectionLabel)) {
        return;
      }

      send(action.prompt);
    },
    [quickActions, selectionLabel, send],
  );

  const proposalById = useMemo(
    () => new Map(proposals.map((proposal) => [proposal.id, proposal])),
    [proposals],
  );

  return {
    applyProposal: (proposalId: string) => void applyCopilotProposal(proposalId),
    applyingProposalId,
    canSend: Boolean(resume) && !isPending,
    canUndo,
    clearSelection: () => selectResumeSection(undefined),
    conversation: isHydrated ? conversation : [],
    editProposal: (proposalId: string, action: ResumeAction) =>
      editCopilotProposal(proposalId, action),
    errorMessage: toLocalizedErrorMessage(error, domainErrorMessages),
    hasResume: isHydrated && Boolean(resume),
    ignoreProposal: ignoreCopilotProposal,
    isPending,
    jobCompany: job?.company,
    jobTitle: job?.title,
    proposalById,
    resume,
    retry: () => void retryCopilotMessage(),
    quickActions,
    canRetry: Boolean(retryMessage),
    dismissError: dismissCopilotError,
    runQuickAction,
    selection,
    selectionLabel,
    send,
    undo: () => void undoLastChange(),
  };
}
