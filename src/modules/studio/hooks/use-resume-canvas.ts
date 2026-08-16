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

const visibilityMargin = 24;

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
  const target =
    selection && findTarget(container, selection.section, selection.itemId);

  container
    .querySelectorAll<HTMLElement>("[data-resume-selected]")
    .forEach((element) => {
      if (element !== target) {
        delete element.dataset.resumeSelected;
      }
    });

  if (target && target.dataset.resumeSelected !== "true") {
    target.dataset.resumeSelected = "true";
  }
}

// Scrolls the preview canvas only, and only when the target is actually out of
// view. scrollIntoView would also scroll every scrollable ancestor, which makes
// the whole workspace lurch whenever the resume re-paginates.
function revealWithinCanvas(
  container: HTMLElement,
  target: HTMLElement,
  smooth: boolean,
) {
  const containerBounds = container.getBoundingClientRect();
  const targetBounds = target.getBoundingClientRect();
  const overflowTop = containerBounds.top + visibilityMargin - targetBounds.top;
  const overflowBottom =
    targetBounds.bottom - (containerBounds.bottom - visibilityMargin);

  if (overflowTop <= 0 && overflowBottom <= 0) {
    return;
  }

  const delta = overflowTop > 0 ? -overflowTop : overflowBottom;

  container.scrollTo({
    behavior: smooth ? "smooth" : "auto",
    top: container.scrollTop + delta,
  });
}

export function useResumeCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const pageCountRef = useRef(pageCount);
  const displayedPageRef = useRef(0);
  const focusedKeyRef = useRef<string | null>(null);
  const highlightedRef = useRef<HTMLElement | null>(null);

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
      frameId = null;

      const pages = getRenderedPages(canvas);
      const nextPageCount = Math.max(1, pages.length);
      const nextCurrentPage = Math.min(currentPage, nextPageCount - 1);
      const isPageSwitch = displayedPageRef.current !== nextCurrentPage;
      const scrollTop = canvas.scrollTop;

      pages.forEach((page, pageIndex) => {
        const display = pageIndex === nextCurrentPage ? "" : "none";

        if (page.style.display !== display) {
          page.style.display = display;
        }
      });

      if (isPageSwitch) {
        displayedPageRef.current = nextCurrentPage;
        canvas.scrollTop = 0;
      } else if (canvas.scrollTop !== scrollTop) {
        // Re-pagination rebuilds the page elements and clamps the offset;
        // restoring it keeps the preview still while a change is applied.
        canvas.scrollTop = scrollTop;
      }

      if (pageCountRef.current !== nextPageCount) {
        pageCountRef.current = nextPageCount;
        setPageCount(nextPageCount);
      }

      if (currentPage !== nextCurrentPage) {
        setCurrentPage(nextCurrentPage);
      }
    };

    const scheduleSync = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(syncCanvas);
      }
    };
    const observer = new MutationObserver(scheduleSync);

    observer.observe(canvas, { childList: true, subtree: true });
    syncCanvas();

    return () => {
      observer.disconnect();

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [currentPage]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    let frameId: number | null = null;
    const syncSelection = () => {
      frameId = null;
      markSelection(canvas, selection);
    };
    const scheduleSelection = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(syncSelection);
      }
    };
    const observer = new MutationObserver(scheduleSelection);

    observer.observe(canvas, { childList: true, subtree: true });
    syncSelection();

    return () => {
      observer.disconnect();

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [selection]);

  // Deliberately does not depend on currentPage: it updates that state, and it
  // is a dependency of the effects below, so reading it here would make those
  // effects re-run themselves until React bails out with a depth error.
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

      if (pageIndex >= 0) {
        setCurrentPage((previous) =>
          previous === pageIndex ? previous : pageIndex,
        );
      }

      const target = findTarget(canvas, section, itemId);

      if (target && scroll) {
        revealWithinCanvas(canvas, target, !prefersReducedMotion);
      }

      return target;
    },
    [prefersReducedMotion],
  );

  useEffect(() => {
    if (!selection) {
      focusedKeyRef.current = null;

      return;
    }

    const key = `${selection.section}:${selection.itemId ?? ""}`;

    if (focusedKeyRef.current === key) {
      return;
    }

    focusedKeyRef.current = key;
    focusTarget(selection.section, selection.itemId, true);
  }, [focusTarget, selection]);

  useEffect(() => {
    if (!highlight) {
      return;
    }

    // Wait one frame so the resume has finished re-paginating around the change
    // before the single reveal scroll runs.
    const frameId = window.requestAnimationFrame(() => {
      const target = focusTarget(highlight.section, highlight.itemId, true);

      if (target) {
        target.dataset.resumeHighlight = "active";
        highlightedRef.current = target;
      }
    });

    return () => {
      window.cancelAnimationFrame(frameId);

      const highlighted = highlightedRef.current;

      if (highlighted) {
        delete highlighted.dataset.resumeHighlight;
        highlightedRef.current = null;
      }
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
