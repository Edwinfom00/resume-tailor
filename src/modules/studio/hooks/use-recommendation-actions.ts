"use client";

import { useCallback, useState } from "react";
import {
  buildRewriteAction,
  fromRewriteLines,
} from "@/modules/analysis/suggestions/rewrite-action";
import {
  selectCanUndo,
  useSessionStore,
} from "@/modules/session/state/session-store";
import { selectionForSuggestionTarget } from "@/modules/session/domain/resume-selection";

const exitAnimationMs = 200;

export function useRecommendationActions() {
  const [exitingSuggestionId, setExitingSuggestionId] = useState<string | null>(
    null,
  );

  const applyingSuggestionId = useSessionStore(
    (state) => state.applyingSuggestionId,
  );
  const isReanalyzing = useSessionStore((state) => state.analysis.running);
  const previousScore = useSessionStore((state) => state.analysis.previousScore);
  const currentScore = useSessionStore(
    (state) => state.analysis.data?.score.overall,
  );
  const canUndo = useSessionStore(selectCanUndo);
  const acceptSuggestion = useSessionStore((state) => state.acceptSuggestion);
  const ignoreSuggestion = useSessionStore((state) => state.ignoreSuggestion);
  const restoreSuggestion = useSessionStore((state) => state.restoreSuggestion);
  const editSuggestion = useSessionStore((state) => state.editSuggestion);
  const undoLastChange = useSessionStore((state) => state.undoLastChange);
  const selectResumeSection = useSessionStore(
    (state) => state.selectResumeSection,
  );

  const accept = useCallback(
    (suggestionId: string) => {
      void acceptSuggestion(suggestionId);
    },
    [acceptSuggestion],
  );

  const ignore = useCallback(
    (suggestionId: string) => {
      setExitingSuggestionId(suggestionId);
      window.setTimeout(() => {
        ignoreSuggestion(suggestionId);
        setExitingSuggestionId((current) =>
          current === suggestionId ? null : current,
        );
      }, exitAnimationMs);
    },
    [ignoreSuggestion],
  );

  const saveEdit = useCallback(
    (suggestionId: string, lines: readonly string[]) => {
      const suggestion = useSessionStore
        .getState()
        .suggestions.find((item) => item.id === suggestionId);

      if (!suggestion) {
        return;
      }

      const after = fromRewriteLines(
        lines,
        suggestion.after ?? suggestion.before,
      );
      const action = buildRewriteAction(suggestion, after);

      if (!action) {
        return;
      }

      editSuggestion(suggestionId, { after, action });
      void acceptSuggestion(suggestionId);
    },
    [acceptSuggestion, editSuggestion],
  );

  const focusSuggestion = useCallback(
    (suggestionId: string) => {
      const suggestion = useSessionStore
        .getState()
        .suggestions.find((item) => item.id === suggestionId);

      if (suggestion) {
        selectResumeSection(selectionForSuggestionTarget(suggestion.target));
      }
    },
    [selectResumeSection],
  );

  const scoreDelta =
    !isReanalyzing &&
    previousScore !== undefined &&
    currentScore !== undefined &&
    previousScore !== currentScore
      ? { next: currentScore, previous: previousScore }
      : undefined;

  return {
    accept,
    applyingSuggestionId,
    canUndo,
    exitingSuggestionId,
    focusSuggestion,
    ignore,
    isReanalyzing,
    restore: restoreSuggestion,
    saveEdit,
    scoreDelta,
    undo: () => void undoLastChange(),
  };
}
