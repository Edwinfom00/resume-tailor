"use client";

import { useLayoutEffect, useRef, useState } from "react";
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
import type { Messages } from "@/i18n/messages/types";

type StudioSection = "overview" | "profile" | "experience" | "projects" | "skills";

type StudioCvPanelProps = Readonly<{
  dictionary: Messages;
  messages: Messages["studio"]["cv"];
  resume: ResumeData;
}>;

const initialZoom = 100;
const previewBaseScale = 0.74;

function getRenderedResumePages(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>("[data-resume-page]")).filter(
    (page) => !page.closest("[aria-hidden='true']"),
  );
}

function formatPageIndicator(template: string, current: number, total: number) {
  return template
    .replace("{current}", String(current))
    .replace("{total}", String(total));
}

export function StudioCvPanel({
  dictionary,
  messages,
  resume,
}: StudioCvPanelProps) {
  const previewCanvasRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<StudioSection>("overview");
  const [isDarkCanvas, setIsDarkCanvas] = useState(false);
  const [isGuideVisible, setIsGuideVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [zoom, setZoom] = useState(initialZoom);
  const previewScale = (zoom / 100) * previewBaseScale;
  const previewPageSize = {
    height: `${297 * previewScale}mm`,
    width: `${210 * previewScale}mm`,
  };
  const tabs: readonly Readonly<{ id: StudioSection; label: string; title?: string }>[] = [
    { id: "overview", label: messages.overviewLabel },
    {
      id: "profile",
      label: messages.profileLabel,
      title: dictionary.resume.profile.title,
    },
    {
      id: "experience",
      label: messages.experienceLabel,
      title: dictionary.resume.experience.title,
    },
    {
      id: "projects",
      label: messages.projectsLabel,
      title: dictionary.resume.projects.title,
    },
    {
      id: "skills",
      label: messages.skillsLabel,
      title: dictionary.resume.skills.title,
    },
  ];

  const adjustZoom = (amount: number) => {
    setZoom((currentZoom) => Math.min(130, Math.max(70, currentZoom + amount)));
  };

  useLayoutEffect(() => {
    const canvas = previewCanvasRef.current;

    if (!canvas) {
      return;
    }

    let frameId: number | null = null;
    const updatePageView = () => {
      const pages = getRenderedResumePages(canvas);
      const nextPageCount = Math.max(1, pages.length);

      pages.forEach((page, pageIndex) => {
        page.style.display = pageIndex === currentPage ? "" : "none";
      });

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        setPageCount((previousCount) =>
          previousCount === nextPageCount ? previousCount : nextPageCount,
        );
        setCurrentPage((previousPage) => Math.min(previousPage, nextPageCount - 1));
      });
    };
    const observer = new MutationObserver(updatePageView);

    observer.observe(canvas, { childList: true, subtree: true });
    updatePageView();

    return () => {
      observer.disconnect();

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [currentPage]);

  const activateSection = (section: StudioSection) => {
    setActiveSection(section);

    window.requestAnimationFrame(() => {
      const canvas = previewCanvasRef.current;

      if (!canvas) {
        return;
      }

      if (section === "overview") {
        setCurrentPage(0);
        return;
      }

      const selectedTab = tabs.find((tab) => tab.id === section);
      const sections = Array.from(canvas.querySelectorAll("section"));
      const target = sections.find(
        (sectionElement) =>
          sectionElement.querySelector("h2")?.textContent === selectedTab?.title,
      );
      const pages = getRenderedResumePages(canvas);
      const targetPageIndex = pages.findIndex((page) => page.contains(target ?? null));

      if (targetPageIndex >= 0) {
        setCurrentPage(targetPageIndex);
      }
    });
  };

  return (
    <section id="studio-cv-panel" className="flex h-(--rt-studio-panel-min-height) w-full max-w-(--rt-studio-cv-panel-width) min-w-0 flex-col overflow-hidden rounded-xl border border-line-subtle bg-surface shadow-xs min-[1672px]:max-w-none!">
      <div className="flex min-h-(--rt-control-height-lg) items-center gap-(--rt-space-4) border-b border-line-subtle px-(--rt-space-5)">
        <h1 className="mr-auto text-lg font-bold tracking-tight text-ink">{messages.title}</h1>
        <nav aria-label={messages.title} className="hidden h-full items-center gap-(--rt-space-6) lg:flex">
          {tabs.map((tab) => {
            const isActive = tab.id === activeSection;

            return (
              <button
                key={tab.id}
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => activateSection(tab.id)}
                className={`relative h-full text-sm font-medium transition-colors duration-(--rt-duration-fast) ${isActive
                  ? "text-brand after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-brand"
                  : "text-ink-muted hover:text-ink"
                  }`}
              >
                {tab.label}
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
        ref={previewCanvasRef}
        className={`relative flex min-h-0 flex-1 items-start justify-center overflow-auto p-(--rt-space-6) transition-colors duration-(--rt-duration-normal) ${isDarkCanvas ? "bg-ink" : "bg-canvas"
          }`}
      >
        <div
          style={previewPageSize}
          className="relative shrink-0"
        >
          <div
            style={{ transform: `scale(${previewScale})`, transformOrigin: "top left" }}
            className={`w-max [&>section]:min-h-0 [&>section]:overflow-visible [&>section]:p-0 ${isGuideVisible
              ? "**:data-resume-page:outline **:data-resume-page:outline-dashed **:data-resume-page:outline-brand"
              : ""
              }`}
          >
            <ResumePreviewDocument dictionary={dictionary} resume={resume} />
          </div>
        </div>
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
              {formatPageIndicator(messages.pageIndicatorLabel, currentPage + 1, pageCount)}
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
          <output aria-label={messages.zoomLevelLabel.replace("{zoom}", String(zoom))} className="min-w-14 text-center text-sm font-semibold text-ink">
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
