"use client";

import { FiFileText, FiTrash2 } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import type { Messages } from "@/i18n/messages/types";

type UploadActionPanelProps = Readonly<{
  canAnalyze: boolean;
  isAnalyzing: boolean;
  messages: Messages["upload"];
  onAnalyze: () => void;
  onClear: () => void;
  onUseSample: () => void;
}>;

export function UploadActionPanel({
  canAnalyze,
  isAnalyzing,
  messages,
  onAnalyze,
  onClear,
  onUseSample,
}: UploadActionPanelProps) {
  return (
    <section className="rounded-xl border border-line-subtle bg-surface p-(--rt-space-4) shadow-xs">
      <div className="grid grid-cols-1 gap-(--rt-space-3) sm:grid-cols-2 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.8fr)]">
        <button
          type="button"
          disabled={!canAnalyze || isAnalyzing}
          onClick={onAnalyze}
          className="flex min-h-16 items-center gap-(--rt-space-3) rounded-md bg-brand px-(--rt-space-4) text-left text-white shadow-brand transition-opacity duration-(--rt-duration-fast) hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <HiSparkles aria-hidden="true" className="h-5 w-5 shrink-0" />
          <span>
            <span className="block text-sm font-semibold">
              {isAnalyzing ? messages.analyzingLabel : messages.analyzeLabel}
            </span>
            <span className="block text-xs text-brand-subtle">
              {messages.analyzeDescription}
            </span>
          </span>
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
    </section>
  );
}
