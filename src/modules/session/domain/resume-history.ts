import type { ResumeData } from "@/@types/resume-data";
import type { ResumeAction } from "@/modules/resume/domain/resume-actions";

export interface ResumeHistoryEntry {
  readonly action: ResumeAction;
  readonly previousResume: ResumeData;
  readonly nextResume: ResumeData;
  readonly timestamp: string;
  readonly suggestionId?: string;
}

export interface ResumeHistory {
  readonly past: readonly ResumeHistoryEntry[];
  readonly future: readonly ResumeHistoryEntry[];
}

const maximumHistoryDepth = 20;

export const emptyResumeHistory: ResumeHistory = { past: [], future: [] };

export function recordHistoryEntry(
  history: ResumeHistory,
  entry: ResumeHistoryEntry,
): ResumeHistory {
  return {
    past: [...history.past, entry].slice(-maximumHistoryDepth),
    future: [],
  };
}

export function canUndo(history: ResumeHistory) {
  return history.past.length > 0;
}

export function canRedo(history: ResumeHistory) {
  return history.future.length > 0;
}

export function undoHistory(history: ResumeHistory) {
  const entry = history.past[history.past.length - 1];

  if (!entry) {
    return undefined;
  }

  return {
    resume: entry.previousResume,
    entry,
    history: {
      past: history.past.slice(0, -1),
      future: [entry, ...history.future].slice(0, maximumHistoryDepth),
    },
  };
}

export function redoHistory(history: ResumeHistory) {
  const [entry, ...remaining] = history.future;

  if (!entry) {
    return undefined;
  }

  return {
    resume: entry.nextResume,
    entry,
    history: {
      past: [...history.past, entry].slice(-maximumHistoryDepth),
      future: remaining,
    },
  };
}
