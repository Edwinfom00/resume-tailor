"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { FiAlertCircle, FiRefreshCw, FiX } from "react-icons/fi";
import { HiMiniSparkles } from "react-icons/hi2";
import type { ResumeData } from "@/@types/resume-data";
import type {
  CopilotActionProposal,
  CopilotMessage,
} from "@/modules/copilot/domain/copilot-types";
import type { ResumeAction } from "@/modules/resume/domain/resume-actions";
import type { ApplicationPhase } from "@/modules/session/domain/application-phase";
import { CopilotProposalCard } from "@/modules/studio/components/copilot-proposal-card";
import type { Messages } from "@/i18n/messages/types";

type CopilotConversationProps = Readonly<{
  applyingProposalId?: string;
  applicationPhase?: ApplicationPhase;
  canRetry: boolean;
  canUndo: boolean;
  conversation: readonly CopilotMessage[];
  errorMessage: string | null;
  footer: ReactNode;
  isPending: boolean;
  messages: Messages["studio"]["copilot"];
  onApplyProposal: (proposalId: string) => void;
  onDismissError: () => void;
  onEditProposal: (proposalId: string, action: ResumeAction) => void;
  onIgnoreProposal: (proposalId: string) => void;
  onRetry: () => void;
  onUndo: () => void;
  presentLabel: string;
  proposalById: ReadonlyMap<string, CopilotActionProposal>;
  resume?: ResumeData;
}>;

const nearBottomThreshold = 96;

export function CopilotConversation({
  applyingProposalId,
  applicationPhase,
  canRetry,
  canUndo,
  conversation,
  errorMessage,
  footer,
  isPending,
  messages,
  onApplyProposal,
  onDismissError,
  onEditProposal,
  onIgnoreProposal,
  onRetry,
  onUndo,
  presentLabel,
  proposalById,
  resume,
}: CopilotConversationProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);

  useEffect(() => {
    const container = scrollRef.current;

    if (!container || !isNearBottomRef.current) {
      return;
    }

    container.scrollTop = container.scrollHeight;
  }, [conversation, isPending]);

  const handleScroll = () => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    isNearBottomRef.current =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      nearBottomThreshold;
  };

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="min-h-0 flex-1 overflow-y-auto bg-canvas p-(--rt-space-4)"
    >
      <div className="space-y-(--rt-space-3)">
        <div className="flex items-start gap-(--rt-space-2)">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-surface-brand text-brand">
            <HiMiniSparkles aria-hidden="true" className="h-4 w-4" />
          </span>
          <div className="max-w-(--rt-studio-copilot-message-width) rounded-lg border border-line-subtle bg-surface p-(--rt-space-3) text-xs leading-relaxed text-ink-muted">
            <p className="font-semibold text-ink">{messages.greeting}</p>
            <p className="mt-(--rt-space-1)">{messages.greetingPrompt}</p>
          </div>
        </div>

        {conversation.map((message) => {
          const proposal = message.actionProposalId
            ? proposalById.get(message.actionProposalId)
            : undefined;

          if (message.role === "user") {
            return (
              <div
                key={message.id}
                className="rt-animate-rise ml-auto max-w-(--rt-studio-copilot-message-width) rounded-lg rounded-tr-sm bg-brand p-(--rt-space-3) text-xs leading-relaxed text-white shadow-xs"
              >
                <p className="text-white/70">{messages.userLabel}</p>
                <p className="mt-(--rt-space-1)">{message.content}</p>
              </div>
            );
          }

          return (
            <div
              key={message.id}
              className="rt-animate-rise flex items-start gap-(--rt-space-2)"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-surface-brand text-brand">
                <HiMiniSparkles aria-hidden="true" className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-ink-muted">
                  {messages.assistantLabel}
                </p>
                <p className="mt-(--rt-space-1) text-xs leading-relaxed text-ink-muted">
                  {message.content}
                </p>
                {proposal && resume ? (
                  <CopilotProposalCard
                    canUndo={canUndo}
                    isApplying={applyingProposalId === proposal.id}
                    applicationPhase={applicationPhase}
                    messages={messages}
                    onApply={() => onApplyProposal(proposal.id)}
                    onEdit={(action) => onEditProposal(proposal.id, action)}
                    onIgnore={() => onIgnoreProposal(proposal.id)}
                    onUndo={onUndo}
                    presentLabel={presentLabel}
                    proposal={proposal}
                    resume={resume}
                  />
                ) : null}
              </div>
            </div>
          );
        })}

        {isPending ? (
          <div
            aria-live="polite"
            className="rt-animate-rise flex items-center gap-(--rt-space-2)"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-surface-brand text-brand">
              <HiMiniSparkles
                aria-hidden="true"
                className="rt-animate-breathe h-4 w-4"
              />
            </span>
            <span className="inline-flex items-center gap-(--rt-space-2) rounded-lg border border-line-subtle bg-surface px-(--rt-space-3) py-(--rt-space-2) text-xs text-ink-muted">
              {messages.thinkingLabel}
              <span aria-hidden="true" className="flex gap-0.5">
                <span className="rt-thinking-dot h-1 w-1 rounded-pill bg-brand" />
                <span className="rt-thinking-dot h-1 w-1 rounded-pill bg-brand" />
                <span className="rt-thinking-dot h-1 w-1 rounded-pill bg-brand" />
              </span>
            </span>
          </div>
        ) : null}

        {errorMessage ? (
          <div
            role="alert"
            className="rt-animate-rise rounded-lg border border-line-subtle bg-negative-subtle p-(--rt-space-3)"
          >
            <p className="flex items-center gap-(--rt-space-2) text-xs font-semibold text-negative">
              <FiAlertCircle aria-hidden="true" className="h-4 w-4" />
              {messages.errorTitle}
            </p>
            <p className="mt-(--rt-space-1) text-2xs text-ink-muted">
              {errorMessage}
            </p>
            <div className="mt-(--rt-space-2) flex gap-(--rt-space-2)">
              {canRetry ? (
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex h-(--rt-control-height-sm) items-center gap-(--rt-space-2) rounded-md bg-brand px-(--rt-space-3) text-xs font-semibold text-white transition-colors duration-(--rt-duration-fast) hover:bg-brand-hover"
                >
                  <FiRefreshCw aria-hidden="true" className="h-3.5 w-3.5" />
                  {messages.retryLabel}
                </button>
              ) : null}
              <button
                type="button"
                onClick={onDismissError}
                className="inline-flex h-(--rt-control-height-sm) items-center gap-(--rt-space-2) rounded-md border border-line-subtle px-(--rt-space-3) text-xs font-semibold text-ink-muted transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand hover:text-brand"
              >
                <FiX aria-hidden="true" className="h-3.5 w-3.5" />
                {messages.dismissLabel}
              </button>
            </div>
          </div>
        ) : null}

        {footer}
      </div>
    </div>
  );
}
