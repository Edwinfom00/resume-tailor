"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { FiDownload, FiSearch } from "react-icons/fi";
import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useResumePdfExport } from "@/modules/resume/hooks/use-resume-pdf-export";
import { useSessionStore } from "@/modules/session/state/session-store";
import { useSessionHydrated } from "@/modules/session/state/use-session-hydrated";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages/types";

type WorkspaceHeaderProps = Readonly<{
  languageSwitcherLabel: string;
  locale: Locale;
  messages: Messages["workspaceHeader"];
  exportMessages: Messages["resumeExport"];
}>;

export function WorkspaceHeader({
  languageSwitcherLabel,
  locale,
  messages,
  exportMessages,
}: WorkspaceHeaderProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isHydrated = useSessionHydrated();
  const overallScore = useSessionStore(
    (state) => state.analysis.data?.score.overall,
  );
  const { exportPdf, isExporting } = useResumePdfExport();

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  return (
    <header className="shrink-0 border-b border-line-subtle bg-surface">
      <div className="mx-auto flex h-(--rt-workspace-header-height) max-w-none items-center gap-(--rt-space-5) px-(--rt-workspace-page-gutter)">
        <Link
          href={`/${locale}`}
          className="rounded-md"
          aria-label={messages.homeLabel}
        >
          <Logo size="md" nameClassName="font-bold" preload />
        </Link>

        <form
          className="mx-auto hidden w-full max-w-(--rt-workspace-search-width) md:block"
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="sr-only" htmlFor="workspace-search">
            {messages.searchLabel}
          </label>
          <div className="flex h-(--rt-control-height-md) items-center gap-(--rt-space-3) rounded-lg border border-line-subtle bg-canvas px-(--rt-space-3) text-ink-muted shadow-xs focus-within:border-brand">
            <FiSearch aria-hidden="true" className="h-4 w-4 shrink-0" />
            <input
              ref={searchInputRef}
              id="workspace-search"
              type="search"
              placeholder={messages.searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-tertiary"
            />
            <kbd className="hidden rounded-md bg-surface px-(--rt-space-2) py-0.5 text-xs font-medium text-ink-muted lg:inline">
              ⌘ K
            </kbd>
          </div>
        </form>

        <div className="ml-auto flex items-center gap-(--rt-space-3)">
          <div className="hidden h-(--rt-control-height-md) items-center gap-(--rt-space-2) rounded-lg border border-line-subtle bg-surface px-(--rt-space-3) text-sm font-semibold text-ink shadow-xs sm:flex">
            <span>{messages.matchLabel}</span>
            <span
              aria-hidden="true"
              className="h-6 w-6 rounded-full border-2 border-brand border-l-brand-subtle"
            />
            <span className="text-ink-muted">
              {isHydrated && overallScore !== undefined
                ? `${overallScore}%`
                : messages.matchValue}
            </span>
          </div>

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
  );
}
