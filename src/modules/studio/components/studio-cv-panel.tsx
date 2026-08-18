"use client";

import { useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMaximize2,
  FiMinus,
  FiMoon,
  FiPlus,
  FiSliders,
} from "react-icons/fi";
import type { ResumeData } from "@/@types/resume-data";
import { ResumePreviewDocument } from "@/modules/resume/components/resume-preview-document";
import {
  resumeSectionIds,
  type ResumeSectionId,
} from "@/modules/session/domain/resume-selection";
import { useSessionStore } from "@/modules/session/state/session-store";
import { useResumeCanvas } from "@/modules/studio/hooks/use-resume-canvas";
import { formatTemplate } from "@/modules/shared/ui/format-template";
import type { Messages } from "@/i18n/messages/types";

type StudioCvPanelProps = Readonly<{
  dictionary: Messages;
  messages: Messages["studio"]["cv"];
  resume?: ResumeData;
}>;

const initialZoom = 100;
const previewBaseScale = 0.74;

export function StudioCvPanel({
  dictionary,
  messages,
  resume,
}: StudioCvPanelProps) {
  const [isDarkCanvas, setIsDarkCanvas] = useState(false);
  const [isGuideVisible, setIsGuideVisible] = useState(false);
  const [zoom, setZoom] = useState(initialZoom);

  const selectResumeSection = useSessionStore(
    (state) => state.selectResumeSection,
  );
  const {
    canvasRef,
    currentPage,
    focusSection,
    pageCount,
    selectFromEvent,
    selection,
    setCurrentPage,
  } = useResumeCanvas();

  const previewScale = (zoom / 100) * previewBaseScale;
  const previewPageSize = {
    height: `${297 * previewScale}mm`,
    width: `${210 * previewScale}mm`,
  };
  const sectionLabels: Readonly<Record<ResumeSectionId, string>> = {
    profile: messages.profileLabel,
    experience: messages.experienceLabel,
    projects: messages.projectsLabel,
    skills: messages.skillsLabel,
  };

  const adjustZoom = (amount: number) => {
    setZoom((currentZoom) => Math.min(130, Math.max(70, currentZoom + amount)));
  };

  const activateSection = (section: ResumeSectionId | null) => {
    if (!section) {
      selectResumeSection(undefined);
      setCurrentPage(0);

      return;
    }

    selectResumeSection({ section });
    focusSection(section);
  };

  return (
    <section
      id="studio-cv-panel"
      className="flex h-(--rt-studio-panel-min-height) w-full min-w-0 flex-col overflow-hidden rounded-md border border-line-subtle bg-surface shadow-xs"
    >
      <div className="flex min-h-(--rt-control-height-lg) items-center gap-(--rt-space-4) border-b border-line-subtle px-(--rt-space-5)">
        <h1 className="mr-auto text-lg font-bold tracking-tight text-ink">
          {messages.title}
        </h1>
        <nav
          aria-label={messages.title}
          className="hidden h-full items-center gap-(--rt-space-6) lg:flex"
        >
          {[null, ...resumeSectionIds].map((section) => {
            const isActive = section === (selection?.section ?? null);
            const label = section ? sectionLabels[section] : messages.overviewLabel;

            return (
              <button
                key={label}
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => activateSection(section)}
                className={`relative h-full text-sm font-medium transition-colors duration-(--rt-duration-fast) after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-center after:bg-brand after:transition-transform after:duration-(--rt-duration-normal) after:ease-(--rt-easing-emphasized) ${isActive
                    ? "text-brand after:scale-x-100"
                    : "text-ink-muted after:scale-x-0 hover:text-ink"
                  }`}
              >
                {label}
              </button>
            );
          })}
        </nav>
        <button
          type="button"
          aria-label={messages.toggleGuidesLabel}
          onClick={() => setIsGuideVisible((currentValue) => !currentValue)}
          className={`rounded-md p-(--rt-space-2) transition-colors duration-(--rt-duration-fast) ${isGuideVisible
              ? "bg-surface-brand text-brand"
              : "text-ink-muted hover:bg-surface-brand hover:text-brand"
            }`}
        >
          <FiSliders aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={canvasRef}
        onClick={(event) => selectFromEvent(event.target)}
        className={`scrollbar-hidden relative flex min-h-0 flex-1 items-start justify-center overflow-auto p-(--rt-space-6) transition-colors duration-(--rt-duration-normal) ${isDarkCanvas ? "bg-ink" : "bg-canvas"
          }`}
      >
        {resume ? (
          <div style={previewPageSize} className="relative shrink-0">
            <div
              style={{
                transform: `scale(${previewScale})`,
                transformOrigin: "top left",
              }}
              className={`w-max [&>section]:min-h-0 [&>section]:overflow-visible [&>section]:p-0 ${isGuideVisible
                  ? "**:data-resume-page:outline **:data-resume-page:outline-dashed **:data-resume-page:outline-brand"
                  : ""
                }`}
            >
              <ResumePreviewDocument dictionary={dictionary} resume={resume} />
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-brand-line bg-surface p-(--rt-space-6) text-center">
            <p className="text-sm text-ink-muted">{messages.emptyLabel}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-(--rt-space-3) border-t border-line-subtle bg-surface p-(--rt-space-3)">
        {pageCount > 1 ? (
          <div className="inline-flex h-(--rt-control-height-md) items-center rounded-pill border border-line-subtle bg-surface shadow-xs">
            <button
              type="button"
              aria-label={messages.previousPageLabel}
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((page) => page - 1)}
              className="inline-flex h-full w-(--rt-control-height-md) items-center justify-center rounded-l-pill text-ink-muted transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiChevronLeft aria-hidden="true" className="h-4 w-4" />
            </button>
            <output
              aria-live="polite"
              className="min-w-20 text-center text-sm font-semibold text-ink"
            >
              {formatTemplate(messages.pageIndicatorLabel, {
                current: currentPage + 1,
                total: pageCount,
              })}
            </output>
            <button
              type="button"
              aria-label={messages.nextPageLabel}
              disabled={currentPage >= pageCount - 1}
              onClick={() => setCurrentPage((page) => page + 1)}
              className="inline-flex h-full w-(--rt-control-height-md) items-center justify-center rounded-r-pill text-ink-muted transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        ) : null}
        <div className="inline-flex h-(--rt-control-height-md) items-center rounded-pill border border-line-subtle bg-surface shadow-xs">
          <button
            type="button"
            aria-label={messages.zoomOutLabel}
            onClick={() => adjustZoom(-10)}
            className="inline-flex h-full w-(--rt-control-height-md) items-center justify-center rounded-l-pill text-ink-muted transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand hover:text-brand"
          >
            <FiMinus aria-hidden="true" className="h-4 w-4" />
          </button>
          <output
            aria-label={formatTemplate(messages.zoomLevelLabel, { zoom })}
            className="min-w-14 text-center text-sm font-semibold text-ink"
          >
            {zoom}%
          </output>
          <button
            type="button"
            aria-label={messages.zoomInLabel}
            onClick={() => adjustZoom(10)}
            className="inline-flex h-full w-(--rt-control-height-md) items-center justify-center rounded-r-pill text-ink-muted transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand hover:text-brand"
          >
            <FiPlus aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          aria-label={messages.fitPreviewLabel}
          onClick={() => setZoom(initialZoom)}
          className="inline-flex h-(--rt-control-height-md) w-(--rt-control-height-md) items-center justify-center rounded-pill border border-line-subtle bg-surface text-ink-muted shadow-xs transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand hover:text-brand"
        >
          <FiMaximize2 aria-hidden="true" className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label={messages.toggleCanvasThemeLabel}
          onClick={() => setIsDarkCanvas((currentValue) => !currentValue)}
          className="inline-flex h-(--rt-control-height-md) w-(--rt-control-height-md) items-center justify-center rounded-pill border border-line-subtle bg-surface text-ink-muted shadow-xs transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand hover:text-brand"
        >
          <FiMoon aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
