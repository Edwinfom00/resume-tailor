"use client";

import { useEffect } from "react";
import type { ResumeSectionId } from "@/modules/session/domain/resume-selection";
import { matchesSelection } from "@/modules/session/domain/resume-selection";
import { useSessionStore } from "@/modules/session/state/session-store";

const highlightDurationMs = 1200;

export function useResumeHighlight() {
  const highlight = useSessionStore((state) => state.highlight);
  const dismissHighlight = useSessionStore((state) => state.dismissHighlight);

  useEffect(() => {
    if (!highlight) {
      return;
    }

    const timeoutId = window.setTimeout(
      () => dismissHighlight(highlight.id),
      highlightDurationMs,
    );

    return () => window.clearTimeout(timeoutId);
  }, [dismissHighlight, highlight]);

  return {
    highlight,
    isHighlighted: (section: ResumeSectionId, itemId?: string) =>
      Boolean(highlight && matchesSelection(highlight, section, itemId)),
  };
}
