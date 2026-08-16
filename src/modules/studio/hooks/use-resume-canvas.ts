"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  isResumeSectionId,
  type ResumeSectionId,
  type ResumeSelection,
} from "@/modules/session/domain/resume-selection";
import { useSessionStore } from "@/modules/session/state/session-store";
import { useResumeHighlight } from "@/modules/studio/hooks/use-resume-highlight";
import { useReducedMotion } from "@/modules/shared/ui/use-reduced-motion";

function getRenderedPages(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>("[data-resume-page]"),
  ).filter((page) => !page.closest("[aria-hidden='true']"));
}

function findTarget(
  container: HTMLElement,
  section: ResumeSectionId,
  itemId?: string,
) {
  const sections = Array.from(
    container.querySelectorAll<HTMLElement>(`[data-resume-section="${section}"]`),
  ).filter((element) => !element.closest("[aria-hidden='true']"));

  if (!itemId) {
    return sections[0];
  }

  return (
    sections
      .map((element) =>
        element.querySelector<HTMLElement>(`[data-resume-item="${itemId}"]`),
      )
      .find((element): element is HTMLElement => element !== null) ?? sections[0]
  );
}

function markSelection(
  container: HTMLElement,
  selection: ResumeSelection | undefined,
) {
  container
    .querySelectorAll<HTMLElement>("[data-resume-selected]")
    .forEach((element) => {
      delete element.dataset.resumeSelected;
    });

  const target =
    selection && findTarget(container, selection.section, selection.itemId);

  if (target) {
    target.dataset.resumeSelected = "true";
  }
}

export function useResumeCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const prefersReducedMotion = useReducedMotion();
  const selection = useSessionStore((state) => state.selection);
  const selectResumeSection = useSessionStore(
    (state) => state.selectResumeSection,
  );
  const { highlight } = useResumeHighlight();

  useLayoutEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    let frameId: number | null = null;
    const syncCanvas = () => {
      const pages = getRenderedPages(canvas);
      const nextPageCount = Math.max(1, pages.length);

      pages.forEach((page, pageIndex) => {
        page.style.display = pageIndex === currentPage ? "" : "none";
      });

      markSelection(canvas, selection);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        setPageCount((previous) =>
          previous === nextPageCount ? previous : nextPageCount,
        );
        setCurrentPage((previous) => Math.min(previous, nextPageCount - 1));
      });
    };
    const observer = new MutationObserver(syncCanvas);

    observer.observe(canvas, { childList: true, subtree: true });
    syncCanvas();

    return () => {
      observer.disconnect();

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [currentPage, selection]);

  const focusTarget = useCallback(
    (section: ResumeSectionId, itemId: string | undefined, scroll: boolean) => {
      const canvas = canvasRef.current;

      if (!canvas) {
        return undefined;
      }

      const pageIndex = getRenderedPages(canvas).findIndex(
        (page) =>
          page.querySelector(`[data-resume-section="${section}"]`) !== null,
      );

      if (pageIndex >= 0 && pageIndex !== currentPage) {
        setCurrentPage(pageIndex);
      }

      const target = findTarget(canvas, section, itemId);

      if (target && scroll) {
        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "nearest",
        });
      }

      return target;
    },
    [currentPage, prefersReducedMotion],
  );

  useEffect(() => {
    if (selection) {
      focusTarget(selection.section, selection.itemId, true);
    }
  }, [focusTarget, selection]);

  useEffect(() => {
    if (!highlight) {
      return;
    }

    const target = focusTarget(highlight.section, highlight.itemId, true);

    if (!target) {
      return;
    }

    target.dataset.resumeHighlight = "active";

    return () => {
      delete target.dataset.resumeHighlight;
    };
  }, [focusTarget, highlight]);

  const selectFromEvent = useCallback(
    (eventTarget: EventTarget | null) => {
      if (!(eventTarget instanceof HTMLElement)) {
        return;
      }

      const sectionId = eventTarget.closest<HTMLElement>("[data-resume-section]")
        ?.dataset.resumeSection;

      if (!sectionId || !isResumeSectionId(sectionId)) {
        return;
      }

      const next: ResumeSelection = {
        itemId: eventTarget.closest<HTMLElement>("[data-resume-item]")?.dataset
          .resumeItem,
        section: sectionId,
      };

      selectResumeSection(
        selection?.section === next.section && selection.itemId === next.itemId
          ? undefined
          : next,
      );
    },
    [selectResumeSection, selection],
  );

  return {
    canvasRef,
    currentPage,
    focusSection: (section: ResumeSectionId) =>
      focusTarget(section, undefined, true),
    pageCount,
    selectFromEvent,
    selection,
    setCurrentPage,
  };
}
