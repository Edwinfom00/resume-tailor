"use client";

import { type FormEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  FiArrowUp,
  FiCheck,
  FiChevronDown,
  FiEdit3,
  FiPaperclip,
  FiX,
} from "react-icons/fi";
import { HiMiniSparkles } from "react-icons/hi2";
import type { Messages } from "@/i18n/messages/types";
import { studioCopilotContext } from "@/modules/studio/fixtures/copilot";
import { useSessionStore } from "@/modules/session/state/session-store";
import { useSessionHydrated } from "@/modules/session/state/use-session-hydrated";

type CopilotTab = "actions" | "chat";

type StudioCopilotProps = Readonly<{
  messages: Messages["studio"]["copilot"];
  onSubmitMessage?: (message: string) => void | Promise<void>;
}>;

export function StudioCopilot({
  messages,
  onSubmitMessage,
}: StudioCopilotProps) {
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const [activeTab, setActiveTab] = useState<CopilotTab>("chat");
  const [anchorCenter, setAnchorCenter] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const isHydrated = useSessionHydrated();
  const job = useSessionStore((state) => state.job.data);
  const conversation = useSessionStore((state) => state.copilot.messages);
  const proposals = useSessionStore((state) => state.copilot.proposals);
  const applyCopilotProposal = useSessionStore(
    (state) => state.applyCopilotProposal,
  );
  const ignoreCopilotProposal = useSessionStore(
    (state) => state.ignoreCopilotProposal,
  );

  const latestProposal = isHydrated
    ? [...proposals].reverse().find((proposal) => proposal.status !== "ignored")
    : undefined;
  const isApplied = latestProposal?.status === "applied";
  const isIgnored = Boolean(isHydrated && proposals.length > 0 && !latestProposal);
  const conversationMessages = isHydrated ? conversation : [];
  const contextRole = job?.title || studioCopilotContext.role;
  const contextCompany = job?.company || studioCopilotContext.company;

  const quickActions = [
    messages.improveProfileLabel,
    messages.reorderProjectsLabel,
    messages.addExperienceLabel,
    messages.addSkillsLabel,
    messages.optimizeForJobLabel,
    messages.moreActionsLabel,
  ];

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

  const selectQuickAction = (action: string) => {
    setActiveTab("chat");
    setDraft(action);
  };

  const submitMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = draft.trim();

    if (!content) {
      return;
    }

    void onSubmitMessage?.(content);
    setDraft("");
  };

  const isChatActive = activeTab === "chat";
  const triggerStyle = anchorCenter === null ? undefined : { left: `${anchorCenter}px` };

  return (
    <>
      {!isOpen ? (
        <button
          type="button"
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
      ) : (
        <aside className="fixed top-[calc(var(--rt-workspace-header-height)+var(--rt-space-3))] right-(--rt-space-6) bottom-(--rt-space-6) z-30 flex w-[calc(100vw-var(--rt-space-8))] max-w-xl flex-col overflow-hidden rounded-xl border border-line-subtle bg-surface shadow-lg">
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
              <span className="h-2 w-2 rounded-pill bg-positive" />
              {contextRole}
              <span aria-hidden="true">·</span>
              {contextCompany}
            </p>
          </div>

          <div className="grid grid-cols-2 border-y border-line-subtle bg-canvas px-(--rt-space-3)">
            <button
              type="button"
              aria-current={isChatActive ? "page" : undefined}
              onClick={() => setActiveTab("chat")}
              className={`relative h-(--rt-control-height-sm) text-xs font-semibold ${isChatActive
                ? "text-brand after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-brand"
                : "text-ink-muted"
                }`}
            >
              {messages.chatLabel}
            </button>
            <button
              type="button"
              aria-current={!isChatActive ? "page" : undefined}
              onClick={() => setActiveTab("actions")}
              className={`relative h-(--rt-control-height-sm) text-xs font-semibold ${!isChatActive
                ? "text-brand after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-brand"
                : "text-ink-muted"
                }`}
            >
              {messages.actionsLabel}
              <span className="ml-(--rt-space-2) rounded-full bg-brand px-1.5 py-0.5 text-white">
                {quickActions.length}
              </span>
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto bg-canvas p-(--rt-space-4)">
            {isChatActive ? (
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

                <div className="ml-auto max-w-(--rt-studio-copilot-message-width) rounded-lg rounded-tr-sm bg-brand p-(--rt-space-3) text-xs leading-relaxed text-white shadow-xs">
                  <p className="text-white/70">{messages.userLabel}</p>
                  <p className="mt-(--rt-space-1)">{messages.sampleUserMessage}</p>
                </div>

                {!isIgnored ? (
                  <div className="flex items-start gap-(--rt-space-2)">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-surface-brand text-brand">
                      <HiMiniSparkles aria-hidden="true" className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-ink-muted">
                        {messages.assistantLabel}
                      </p>
                      <p className="mt-(--rt-space-1) text-xs text-ink-muted">
                        {latestProposal?.explanation ?? messages.improvementsFoundLabel}
                      </p>
                      <section className="mt-(--rt-space-2) overflow-hidden rounded-lg border border-line-subtle bg-surface">
                        <div className="border-b border-line-subtle p-(--rt-space-3)">
                          <div className="flex items-center justify-between gap-(--rt-space-3)">
                            <div>
                              <h3 className="text-xs font-bold text-ink">
                                {messages.suggestedChangeTitle}
                              </h3>
                              <p className="mt-1 text-xs text-ink-muted">
                                {messages.changedBulletsLabel}
                              </p>
                            </div>
                            <span className="rounded-pill bg-success-50 px-(--rt-space-2) py-0.5 text-2xs font-semibold text-positive">
                              {latestProposal?.estimatedImpact
                                ? `+${latestProposal.estimatedImpact}%`
                                : messages.impactLabel}
                            </span>
                          </div>
                          <ul className="mt-(--rt-space-3) list-disc space-y-(--rt-space-2) pl-(--rt-space-4) text-2xs leading-relaxed text-ink-muted">
                            {(latestProposal?.changeSummary ?? messages.changeBullets).map(
                              (bullet) => (
                                <li key={bullet}>{bullet}</li>
                              ),
                            )}
                          </ul>
                        </div>
                        <button
                          type="button"
                          className="flex w-full items-center justify-between px-(--rt-space-3) py-(--rt-space-2) text-xs font-medium text-ink-muted transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand hover:text-brand"
                        >
                          {messages.detailedChangesLabel}
                          <FiChevronDown aria-hidden="true" className="h-4 w-4" />
                        </button>
                        <div className="flex gap-(--rt-space-2) border-t border-line-subtle p-(--rt-space-2)">
                          <button
                            type="button"
                            disabled={!latestProposal || isApplied}
                            onClick={() =>
                              latestProposal &&
                              applyCopilotProposal(latestProposal.id)
                            }
                            className={`inline-flex h-(--rt-control-height-sm) items-center gap-(--rt-space-2) rounded-md px-(--rt-space-3) text-xs font-semibold transition-colors duration-(--rt-duration-fast) ${isApplied
                              ? "bg-success-50 text-positive"
                              : "bg-brand text-white hover:bg-brand-hover"
                              }`}
                          >
                            <FiCheck aria-hidden="true" className="h-4 w-4" />
                            {isApplied ? messages.appliedLabel : messages.applyChangesLabel}
                          </button>
                          <button
                            type="button"
                            className="inline-flex h-(--rt-control-height-sm) items-center gap-(--rt-space-2) rounded-md border border-line-subtle px-(--rt-space-3) text-xs font-semibold text-ink-muted transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand hover:text-brand"
                          >
                            <FiEdit3 aria-hidden="true" className="h-4 w-4" />
                            {messages.editLabel}
                          </button>
                          <button
                            type="button"
                            disabled={!latestProposal}
                            onClick={() =>
                              latestProposal &&
                              ignoreCopilotProposal(latestProposal.id)
                            }
                            className="inline-flex h-(--rt-control-height-sm) items-center gap-(--rt-space-2) rounded-md border border-line-subtle px-(--rt-space-3) text-xs font-semibold text-ink-muted transition-colors duration-(--rt-duration-fast) hover:bg-negative-subtle hover:text-negative"
                          >
                            <FiX aria-hidden="true" className="h-4 w-4" />
                            {messages.ignoreLabel}
                          </button>
                        </div>
                      </section>
                    </div>
                  </div>
                ) : null}

                {conversationMessages.map((message) => (
                  <div
                    key={message.id}
                    className={
                      message.role === "user"
                        ? "ml-auto max-w-(--rt-studio-copilot-message-width) rounded-lg rounded-tr-sm bg-brand p-(--rt-space-3) text-xs leading-relaxed text-white"
                        : "max-w-(--rt-studio-copilot-message-width) rounded-lg border border-line-subtle bg-surface p-(--rt-space-3) text-xs leading-relaxed text-ink-muted"
                    }
                  >
                    <p className={message.role === "user" ? "text-white/70" : "font-semibold text-ink"}>
                      {message.role === "user" ? messages.userLabel : messages.assistantLabel}
                    </p>
                    <p className="mt-(--rt-space-1)">{message.content}</p>
                  </div>
                ))}

                <div>
                  <p className="text-xs font-semibold text-ink-muted">{messages.quickActionsLabel}</p>
                  <div className="mt-(--rt-space-2) flex flex-wrap gap-(--rt-space-2)">
                    {quickActions.slice(0, 5).map((action) => (
                      <button
                        key={action}
                        type="button"
                        onClick={() => selectQuickAction(action)}
                        className="rounded-sm bg-surface-brand px-(--rt-space-3) py-(--rt-space-2) text-2xs font-semibold text-brand transition-colors duration-(--rt-duration-fast) hover:bg-brand-subtle"
                      >
                        {action}
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
              </div>
            ) : (
              <div className="space-y-(--rt-space-2)">
                {quickActions.length ? (
                  quickActions.map((action) => (
                    <button
                      key={action}
                      type="button"
                      onClick={() => selectQuickAction(action)}
                      className="flex w-full items-center gap-(--rt-space-3) rounded-md border border-line-subtle bg-surface p-(--rt-space-3) text-left text-sm font-semibold text-ink transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand hover:text-brand"
                    >
                      <HiMiniSparkles aria-hidden="true" className="h-4 w-4 text-brand" />
                      {action}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-ink-muted">{messages.noActionsLabel}</p>
                )}
              </div>
            )}
          </div>

          <form onSubmit={submitMessage} className="border-t border-line-subtle bg-surface p-(--rt-space-3)">
            <div className="flex min-h-(--rt-control-height-md) items-end gap-(--rt-space-2) rounded-md border border-line-subtle bg-canvas px-(--rt-space-3) py-(--rt-space-2) focus-within:border-brand">
              <textarea
                ref={composerRef}
                rows={2}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                aria-label={messages.composerPlaceholder}
                placeholder={messages.composerPlaceholder}
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
                className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-white transition-colors duration-(--rt-duration-fast) hover:bg-brand-hover"
              >
                <FiArrowUp aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-(--rt-space-2) text-center text-2xs text-ink-subtle">
              {messages.reviewNotice}
            </p>
          </form>
        </aside>
      )}
    </>
  );
}
