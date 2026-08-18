"use client";

import { FiArrowRight, FiFileText, FiTrash2 } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import type { Messages } from "@/i18n/messages/types";

type UploadActionPanelProps = Readonly<{
  blockedReason: string | null;
  canAnalyze: boolean;
  errorMessage: string | null;
  isAnalysisCurrent: boolean;
  isBusy: boolean;
  messages: Messages["upload"];
  onAnalyze: () => void;
  onClear: () => void;
  onOpenWorkspace: () => void;
  onUseSample: () => void;
  stageLabel: string | null;
}>;

export function UploadActionPanel({
  blockedReason,
  canAnalyze,
  errorMessage,
  isAnalysisCurrent,
  isBusy,
  messages,
  onAnalyze,
  onClear,
  onOpenWorkspace,
  onUseSample,
  stageLabel,
}: UploadActionPanelProps) {
  const primaryLabel = isBusy
    ? messages.analyzingLabel
    : isAnalysisCurrent
      ? messages.openWorkspaceLabel
      : messages.analyzeLabel;
  const primaryDescription =
    stageLabel ?? blockedReason ?? messages.analyzeDescription;

  return (
    <section className="rounded-md border border-line-subtle bg-surface p-(--rt-space-4) shadow-xs">
      <div className="grid grid-cols-1 gap-(--rt-space-3) sm:grid-cols-2 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.8fr)]">
        <button
          type="button"
          aria-busy={isBusy}
          disabled={isBusy || (!canAnalyze && !isAnalysisCurrent)}
          onClick={isAnalysisCurrent && !canAnalyze ? onOpenWorkspace : onAnalyze}
          className="relative flex min-h-16 items-center gap-(--rt-space-3) overflow-hidden rounded-md bg-brand px-(--rt-space-4) text-left text-white shadow-brand transition-opacity duration-(--rt-duration-fast) hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isBusy ? (
            <HiSparkles
              aria-hidden="true"
              className="rt-animate-breathe h-5 w-5 shrink-0"
            />
          ) : isAnalysisCurrent ? (
            <FiArrowRight aria-hidden="true" className="h-5 w-5 shrink-0" />
          ) : (
            <HiSparkles aria-hidden="true" className="h-5 w-5 shrink-0" />
          )}
          <span className="min-w-0">
            <span className="block text-sm font-semibold">{primaryLabel}</span>
            <span
              key={primaryDescription}
              className="rt-animate-rise block truncate text-xs text-brand-subtle"
            >
              {primaryDescription}
            </span>
          </span>
          {isBusy ? (
            <span
              aria-hidden="true"
              className="rt-sweep absolute inset-x-0 bottom-0 h-0.5 bg-brand-hover"
            />
          ) : null}
        </button>

        <button
          type="button"
          onClick={onUseSample}
          className="flex min-h-16 items-center gap-(--rt-space-3) rounded-md border border-line-subtle bg-surface px-(--rt-space-4) text-left text-ink shadow-xs transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand"
        >
          <FiFileText aria-hidden="true" className="h-5 w-5 shrink-0 text-ink-muted" />
          <span>
            <span className="block text-sm font-semibold">{messages.sampleLabel}</span>
            <span className="block text-xs text-ink-muted">
              {messages.sampleDescription}
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={onClear}
          className="flex min-h-16 items-center gap-(--rt-space-3) rounded-md border border-line-subtle bg-surface px-(--rt-space-4) text-left text-ink shadow-xs transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand"
        >
          <FiTrash2 aria-hidden="true" className="h-5 w-5 shrink-0 text-ink-muted" />
          <span>
            <span className="block text-sm font-semibold">{messages.clearLabel}</span>
            <span className="block text-xs text-ink-muted">
              {messages.clearDescription}
            </span>
          </span>
        </button>
      </div>

      {errorMessage ? (
        <p
          role="alert"
          className="rt-animate-rise mt-(--rt-space-3) text-sm text-negative"
        >
          {errorMessage}
        </p>
      ) : null}
    </section>
  );
}
