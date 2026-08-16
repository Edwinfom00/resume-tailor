"use client";

import {
  type FormEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { FiArrowUp, FiChevronDown, FiPaperclip, FiX } from "react-icons/fi";
import { HiMiniSparkles } from "react-icons/hi2";
import type { ResumeSectionId } from "@/modules/session/domain/resume-selection";
import { CopilotConversation } from "@/modules/studio/components/copilot-conversation";
import { useCopilot } from "@/modules/studio/hooks/use-copilot";
import type { Messages } from "@/i18n/messages/types";

type CopilotTab = "actions" | "chat";

type StudioCopilotProps = Readonly<{
  domainErrorMessages: Messages["domainErrors"];
  messages: Messages["studio"]["copilot"];
  presentLabel: string;
  sectionLabels: Readonly<Record<ResumeSectionId, string>>;
}>;

const inlineQuickActionCount = 5;

export function StudioCopilot({
  domainErrorMessages,
  messages,
  presentLabel,
  sectionLabels,
}: StudioCopilotProps) {
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const [activeTab, setActiveTab] = useState<CopilotTab>("chat");
  const [anchorCenter, setAnchorCenter] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const copilot = useCopilot({ domainErrorMessages, messages, sectionLabels });

  useLayoutEffect(() => {
    const panel = document.getElementById("studio-cv-panel");

    if (!panel) {
      return;
    }

    const updateAnchor = () => {
      const bounds = panel.getBoundingClientRect();
      setAnchorCenter(bounds.left + bounds.width / 2);
    };
    const observer = new ResizeObserver(updateAnchor);

    updateAnchor();
    observer.observe(panel);
    window.addEventListener("resize", updateAnchor);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateAnchor);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      composerRef.current?.focus();
    }
  }, [isOpen]);

  useLayoutEffect(() => {
    const composer = composerRef.current;

    if (!composer) {
      return;
    }

    composer.style.height = "auto";
    composer.style.height = `${composer.scrollHeight}px`;
  }, [draft]);

  const submitMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!copilot.canSend) {
      return;
    }

    copilot.send(draft);
    setDraft("");
  };

  const isChatActive = activeTab === "chat";
  const triggerStyle = anchorCenter === null ? undefined : { left: `${anchorCenter}px` };

  const quickActionButtons = (
    <div>
      <p className="text-xs font-semibold text-ink-muted">
        {messages.quickActionsLabel}
      </p>
      <div className="mt-(--rt-space-2) flex flex-wrap gap-(--rt-space-2)">
        {copilot.quickActions.slice(0, inlineQuickActionCount).map((action) => (
          <button
            key={action.id}
            type="button"
            disabled={!copilot.canSend}
            onClick={() => copilot.runQuickAction(action.id)}
            className="rounded-sm bg-surface-brand px-(--rt-space-3) py-(--rt-space-2) text-2xs font-semibold text-brand transition-colors duration-(--rt-duration-fast) hover:bg-brand-subtle active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {action.label}
          </button>
        ))}
        <button
          type="button"
          aria-label={messages.moreActionsLabel}
          onClick={() => setActiveTab("actions")}
          className="rounded-sm bg-surface-brand px-(--rt-space-3) py-(--rt-space-2) text-brand transition-colors duration-(--rt-duration-fast) hover:bg-brand-subtle"
        >
          <FiChevronDown aria-hidden="true" className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );

  if (!isOpen) {
    return (
      <button
        type="button"
        aria-label={messages.openLabel}
        onClick={() => setIsOpen(true)}
        style={triggerStyle}
        className="fixed bottom-(--rt-space-6) left-1/2 z-20 flex h-(--rt-control-height-lg) w-[calc(100vw-var(--rt-space-8))] max-w-(--rt-studio-copilot-composer-width) -translate-x-1/2 items-center gap-(--rt-space-3) rounded-full border border-line-subtle bg-surface px-(--rt-space-4) text-left shadow-md transition-colors duration-(--rt-duration-fast) hover:border-brand-line"
      >
        <HiMiniSparkles aria-hidden="true" className="h-5 w-5 shrink-0 text-brand" />
        <span className="min-w-0 flex-1 truncate text-sm text-ink-subtle">
          {messages.composerPlaceholder}
        </span>
        <FiPaperclip aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-muted" />
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white">
          <FiArrowUp aria-hidden="true" className="h-4 w-4" />
        </span>
      </button>
    );
  }

  return (
    <aside className="rt-animate-slide-in-end fixed top-[calc(var(--rt-workspace-header-height)+var(--rt-space-3))] right-(--rt-space-6) bottom-(--rt-space-6) z-30 flex w-[calc(100vw-var(--rt-space-8))] max-w-xl flex-col overflow-hidden rounded-xl border border-line-subtle bg-surface shadow-lg">
      <div className="flex items-center justify-between px-(--rt-space-5) pt-(--rt-space-4)">
        <h2 className="flex items-center gap-(--rt-space-3) text-lg font-bold tracking-tight text-ink">
          <HiMiniSparkles aria-hidden="true" className="h-5 w-5 text-brand" />
          {messages.title}
        </h2>
        <button
          type="button"
          aria-label={messages.closeLabel}
          onClick={() => setIsOpen(false)}
          className="rounded-md p-(--rt-space-1) text-ink-muted transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand hover:text-brand"
        >
          <FiX aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      <div className="px-(--rt-space-5) pb-(--rt-space-3) pt-(--rt-space-4)">
        <p className="text-xs text-ink-muted">{messages.workingWithLabel}</p>
        <p className="mt-(--rt-space-1) flex items-center gap-(--rt-space-2) text-sm font-bold text-ink">
          <span
            className={`h-2 w-2 rounded-pill ${
              copilot.jobTitle ? "bg-positive" : "bg-ink-subtle"
            }`}
          />
          {copilot.jobTitle ? (
            <>
              {copilot.jobTitle}
              {copilot.jobCompany ? (
                <>
                  <span aria-hidden="true">·</span>
                  {copilot.jobCompany}
                </>
              ) : null}
            </>
          ) : (
            messages.noJobContextLabel
          )}
        </p>
        {copilot.selectionLabel ? (
          <p className="rt-animate-rise mt-(--rt-space-2) flex items-center gap-(--rt-space-2) text-2xs text-ink-muted">
            <span className="rounded-pill bg-surface-brand px-(--rt-space-2) py-0.5 font-semibold text-brand">
              {messages.focusedOnLabel}: {copilot.selectionLabel}
            </span>
            <button
              type="button"
              onClick={copilot.clearSelection}
              className="rounded-md px-1 font-semibold text-ink-muted transition-colors duration-(--rt-duration-fast) hover:text-brand"
            >
              {messages.clearFocusLabel}
            </button>
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 border-y border-line-subtle bg-canvas px-(--rt-space-3)">
        <button
          type="button"
          aria-current={isChatActive ? "page" : undefined}
          onClick={() => setActiveTab("chat")}
          className={`relative h-(--rt-control-height-sm) text-xs font-semibold after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-brand after:transition-transform after:duration-(--rt-duration-normal) ${
            isChatActive
              ? "text-brand after:scale-x-100"
              : "text-ink-muted after:scale-x-0"
          }`}
        >
          {messages.chatLabel}
        </button>
        <button
          type="button"
          aria-current={!isChatActive ? "page" : undefined}
          onClick={() => setActiveTab("actions")}
          className={`relative h-(--rt-control-height-sm) text-xs font-semibold after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-brand after:transition-transform after:duration-(--rt-duration-normal) ${
            !isChatActive
              ? "text-brand after:scale-x-100"
              : "text-ink-muted after:scale-x-0"
          }`}
        >
          {messages.actionsLabel}
          <span className="ml-(--rt-space-2) rounded-full bg-brand px-1.5 py-0.5 text-white">
            {copilot.quickActions.length}
          </span>
        </button>
      </div>

      {isChatActive ? (
        <CopilotConversation
          applyingProposalId={copilot.applyingProposalId}
          applicationPhase={copilot.applicationPhase}
          canRetry={copilot.canRetry}
          canUndo={copilot.canUndo}
          conversation={copilot.conversation}
          errorMessage={copilot.errorMessage}
          footer={quickActionButtons}
          isPending={copilot.isPending}
          messages={messages}
          onApplyProposal={copilot.applyProposal}
          onDismissError={copilot.dismissError}
          onEditProposal={copilot.editProposal}
          onIgnoreProposal={copilot.ignoreProposal}
          onRetry={copilot.retry}
          onUndo={copilot.undo}
          presentLabel={presentLabel}
          proposalById={copilot.proposalById}
          resume={copilot.resume}
        />
      ) : (
        <div className="min-h-0 flex-1 space-y-(--rt-space-2) overflow-y-auto bg-canvas p-(--rt-space-4)">
          {copilot.quickActions.length > 0 ? (
            copilot.quickActions.map((action) => (
              <button
                key={action.id}
                type="button"
                disabled={!copilot.canSend}
                onClick={() => {
                  setActiveTab("chat");
                  copilot.runQuickAction(action.id);
                }}
                className="rt-animate-rise flex w-full items-center gap-(--rt-space-3) rounded-md border border-line-subtle bg-surface p-(--rt-space-3) text-left text-sm font-semibold text-ink transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand hover:text-brand active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <HiMiniSparkles aria-hidden="true" className="h-4 w-4 text-brand" />
                {action.label}
              </button>
            ))
          ) : (
            <p className="text-sm text-ink-muted">{messages.noActionsLabel}</p>
          )}
        </div>
      )}

      <form
        onSubmit={submitMessage}
        className="border-t border-line-subtle bg-surface p-(--rt-space-3)"
      >
        <div className="flex min-h-(--rt-control-height-md) items-end gap-(--rt-space-2) rounded-md border border-line-subtle bg-canvas px-(--rt-space-3) py-(--rt-space-2) focus-within:border-brand">
          <textarea
            ref={composerRef}
            rows={2}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            aria-label={messages.composerPlaceholder}
            placeholder={
              copilot.hasResume
                ? messages.composerPlaceholder
                : messages.needsResumeLabel
            }
            className="min-w-0 flex-1 appearance-none resize-none overflow-hidden border-0 bg-transparent text-xs leading-relaxed text-ink shadow-none outline-none placeholder:text-ink-subtle focus-visible:shadow-none!"
          />
          <button
            type="button"
            aria-label={messages.attachLabel}
            className="text-ink-muted transition-colors duration-(--rt-duration-fast) hover:text-brand"
          >
            <FiPaperclip aria-hidden="true" className="h-4 w-4" />
          </button>
          <button
            type="submit"
            aria-label={messages.sendLabel}
            disabled={!copilot.canSend || draft.trim().length === 0}
            className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-white transition-colors duration-(--rt-duration-fast) hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiArrowUp aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-(--rt-space-2) text-center text-2xs text-ink-subtle">
          {messages.reviewNotice}
        </p>
      </form>
    </aside>
  );
}
