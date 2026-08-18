"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import {
  FiAlertTriangle,
  FiCornerUpLeft,
  FiCornerUpRight,
  FiDownload,
  FiPlusCircle,
  FiX,
} from "react-icons/fi";
import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { MatchIndicator } from "@/components/navigation/match-indicator";
import { useResumePdfExport } from "@/modules/resume/hooks/use-resume-pdf-export";
import {
  selectCanRedo,
  selectCanUndo,
  useSessionStore,
} from "@/modules/session/state/session-store";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages/types";

type WorkspaceHeaderProps = Readonly<{
  languageSwitcherLabel: string;
  locale: Locale;
  messages: Messages["workspaceHeader"];
  exportMessages: Messages["resumeExport"];
  previewScore?: number;
}>;

export function WorkspaceHeader({
  languageSwitcherLabel,
  locale,
  messages,
  exportMessages,
  previewScore,
}: WorkspaceHeaderProps) {
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const canUndo = useSessionStore(selectCanUndo);
  const canRedo = useSessionStore(selectCanRedo);
  const undoLastChange = useSessionStore((state) => state.undoLastChange);
  const redoLastChange = useSessionStore((state) => state.redoLastChange);
  const clearJob = useSessionStore((state) => state.clearJob);
  const { exportPdf, isExporting } = useResumePdfExport();

  const handleConfirmAnalyzeAnotherJob = useCallback(() => {
    setIsConfirmOpen(false);
    clearJob();
    router.push(`/${locale}/upload`);
  }, [clearJob, locale, router]);

  return (
    <>
      <header className="shrink-0 border-b border-line-subtle bg-surface">
        <div className="mx-auto flex h-(--rt-workspace-header-height) max-w-none items-center gap-(--rt-space-5) px-(--rt-workspace-page-gutter)">
          <Link
            href={`/${locale}`}
            className="rounded-md"
            aria-label={messages.homeLabel}
          >
            <Logo size="md" nameClassName="font-bold" preload />
          </Link>

          <div className="ml-auto flex items-center gap-(--rt-space-3)">
            <MatchIndicator messages={messages} previewScore={previewScore} />

            <div className="hidden items-center rounded-lg border border-line-subtle bg-surface shadow-xs sm:flex">
              <button
                type="button"
                aria-label={messages.undoLabel}
                disabled={!canUndo}
                onClick={() => void undoLastChange()}
                className="inline-flex h-(--rt-control-height-md) w-(--rt-control-height-md) items-center justify-center rounded-l-lg text-ink-muted transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiCornerUpLeft aria-hidden="true" className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label={messages.redoLabel}
                disabled={!canRedo}
                onClick={() => void redoLastChange()}
                className="inline-flex h-(--rt-control-height-md) w-(--rt-control-height-md) items-center justify-center rounded-r-lg text-ink-muted transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiCornerUpRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsConfirmOpen(true)}
              className="inline-flex h-(--rt-control-height-md) items-center justify-center gap-(--rt-space-2) rounded-md border border-line-subtle bg-surface px-(--rt-space-3) text-sm font-medium text-ink shadow-xs transition-colors duration-(--rt-duration-fast) hover:bg-surface-subtle hover:text-brand"
              title={messages.analyzeAnotherJobLabel}
            >
              <FiPlusCircle aria-hidden="true" className="h-4 w-4 text-brand" />
              <span className="hidden md:inline">
                {messages.analyzeAnotherJobLabel}
              </span>
            </button>

            <button
              type="button"
              disabled={isExporting}
              onClick={() => void exportPdf()}
              className="inline-flex h-(--rt-control-height-md) items-center justify-center gap-(--rt-space-2) rounded-md bg-brand px-(--rt-space-4) text-sm font-semibold text-white shadow-xs transition-colors duration-(--rt-duration-fast) hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiDownload aria-hidden="true" className="h-4 w-4" />
              <span className="hidden sm:inline">
                {isExporting ? exportMessages.exportingLabel : messages.exportLabel}
              </span>
            </button>

            <LanguageSwitcher label={languageSwitcherLabel} locale={locale} />
          </div>
        </div>
      </header>

      {isConfirmOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-2xl border border-line-subtle bg-surface p-6 shadow-xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-4 border-b border-line-subtle pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                  <FiAlertTriangle className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-ink leading-snug">
                  {messages.analyzeAnotherJobConfirmTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                className="rounded-lg p-1.5 text-ink-muted hover:bg-surface-subtle hover:text-ink transition-colors"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-ink-muted leading-relaxed">
              {messages.analyzeAnotherJobConfirmDescription}
            </p>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 border-t border-line-subtle pt-4">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                className="inline-flex min-h-(--rt-control-height-md) items-center justify-center rounded-md border border-line-subtle bg-surface px-5 text-sm font-semibold text-ink-muted hover:bg-surface-subtle transition-colors"
              >
                {messages.analyzeAnotherJobCancelAction}
              </button>
              <button
                type="button"
                onClick={handleConfirmAnalyzeAnotherJob}
                className="inline-flex min-h-(--rt-control-height-md) items-center justify-center rounded-md bg-brand px-5 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-brand-hover transition-colors"
              >
                {messages.analyzeAnotherJobConfirmAction}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
