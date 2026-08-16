"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ResumeData } from "@/@types/resume-data";
import type { JobOffer } from "@/modules/job/domain/job-offer";
import type { ResumeSuggestion } from "@/modules/analysis/domain/suggestion-types";
import { buildAnalysisKey } from "@/modules/analysis/engine/analysis-key";
import { runDeterministicAnalysis } from "@/modules/analysis/engine/run-analysis";
import {
  boundMessages,
  emptyCopilotState,
  isActionProposal,
  type CopilotActionProposal,
  type CopilotMessage,
} from "@/modules/copilot/domain/copilot-types";
import type { ResumeAction } from "@/modules/resume/domain/resume-actions";
import { applyResumeAction } from "@/modules/resume/services/apply-resume-action";
import { normalizeResumeData } from "@/modules/resume/normalization/normalize-resume";
import { validateResumeFile } from "@/modules/resume/parsers/file-validation";
import { validateJobUrl } from "@/modules/job/extraction/validate-job-url";
import { createJobError } from "@/modules/job/domain/job-errors";
import {
  canRedo,
  canUndo,
  emptyResumeHistory,
  recordHistoryEntry,
  redoHistory,
  undoHistory,
} from "@/modules/session/domain/resume-history";
import {
  isResumable,
  upsertJob,
  type BackgroundJobState,
  type BackgroundJobType,
} from "@/modules/session/domain/background-job";
import {
  selectionForAction,
  type ResumeSelection,
} from "@/modules/session/domain/resume-selection";
import {
  deriveWorkflowState,
  type WorkflowState,
} from "@/modules/session/domain/workflow-state";
import {
  requestAnalysis,
  requestCopilot,
  requestJobExtractionFromText,
  requestJobExtractionFromUrl,
  requestResumeExtraction,
} from "@/modules/session/services/api-client";
import {
  initialAnalysisSlice,
  initialJobSlice,
  initialResumeSlice,
  type TailorSessionState,
} from "@/modules/session/state/session-types";
import { createIdentifier } from "@/modules/shared/domain/identifier";
import { stableHash } from "@/modules/shared/domain/stable-hash";
import type { DomainError } from "@/modules/shared/domain/domain-error";

export interface ApplyActionOptions {
  readonly suggestionId?: string;
  readonly proposalId?: string;
}

interface SessionActions {
  uploadResume: (file: File) => Promise<void>;
  clearResume: () => void;
  loadSampleResume: (resume: ResumeData) => void;

  setJobUrl: (url: string) => void;
  setJobDescription: (description: string) => void;
  extractJob: () => Promise<void>;

  runAnalysis: () => Promise<void>;

  acceptSuggestion: (suggestionId: string) => Promise<void>;
  ignoreSuggestion: (suggestionId: string) => void;
  restoreSuggestion: (suggestionId: string) => void;
  editSuggestion: (suggestionId: string, payload: Partial<ResumeSuggestion>) => void;

  applyAction: (action: ResumeAction, options?: ApplyActionOptions) => Promise<void>;
  undoLastChange: () => Promise<void>;
  redoLastChange: () => Promise<void>;

  sendCopilotMessage: (message: string) => Promise<void>;
  retryCopilotMessage: () => Promise<void>;
  dismissCopilotError: () => void;
  applyCopilotProposal: (proposalId: string) => Promise<void>;
  ignoreCopilotProposal: (proposalId: string) => void;
  editCopilotProposal: (proposalId: string, action: ResumeAction) => void;

  selectResumeSection: (selection: ResumeSelection | undefined) => void;
  dismissHighlight: (highlightId: string) => void;

  resetSession: () => void;
}

export type SessionStore = TailorSessionState & SessionActions;

function now() {
  return new Date().toISOString();
}

function waitForDuration(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function createJob(
  type: BackgroundJobType,
  inputHash: string,
): BackgroundJobState {
  return {
    id: createIdentifier("job"),
    type,
    status: "running",
    progress: 5,
    inputHash,
    createdAt: now(),
    updatedAt: now(),
  };
}

function completeJob(
  job: BackgroundJobState,
  error?: DomainError,
): BackgroundJobState {
  return {
    ...job,
    status: error ? "failed" : "completed",
    progress: 100,
    error,
    updatedAt: now(),
  };
}

function createInitialState(): TailorSessionState {
  return {
    id: createIdentifier("ses"),
    resume: initialResumeSlice,
    job: initialJobSlice,
    analysis: initialAnalysisSlice,
    suggestions: [],
    copilot: emptyCopilotState,
    history: emptyResumeHistory,
    jobs: [],
    createdAt: now(),
    updatedAt: now(),
  };
}

const maximumCachedAnalyses = 5;

function boundAnalysisCache(
  cache: TailorSessionState["analysis"]["cache"],
  newestKey: string,
) {
  const keys = Object.keys(cache);

  if (keys.length <= maximumCachedAnalyses) {
    return cache;
  }

  const retained = [
    newestKey,
    ...keys.filter((key) => key !== newestKey).slice(-(maximumCachedAnalyses - 1)),
  ];

  return Object.fromEntries(
    retained.filter((key) => key in cache).map((key) => [key, cache[key]]),
  );
}

function highlightForAction(action: ResumeAction) {
  const selection = selectionForAction(action);

  return selection ? { ...selection, id: createIdentifier("hlt") } : undefined;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      uploadResume: async (file) => {
        const validation = validateResumeFile({
          name: file.name,
          size: file.size,
          type: file.type,
        });

        if (!validation.ok) {
          set((state) => ({
            resume: {
              ...state.resume,
              status: "failed",
              error: validation.error,
            },
            updatedAt: now(),
          }));

          return;
        }

        const inputHash = stableHash({
          name: file.name,
          size: file.size,
          lastModified: file.lastModified,
        });
        const job = createJob("resume-parse", inputHash);

        set((state) => ({
          resume: {
            ...state.resume,
            status: "extracting",
            error: undefined,
            warnings: [],
            originalFile: {
              name: validation.value.name,
              mimeType: validation.value.mimeType,
              size: validation.value.size,
              uploadedAt: now(),
            },
          },
          jobs: upsertJob(state.jobs, job),
          updatedAt: now(),
        }));

        const result = await requestResumeExtraction(file);

        if (!result.ok) {
          set((state) => ({
            resume: {
              ...state.resume,
              status: "failed",
              error: result.error,
            },
            jobs: upsertJob(state.jobs, completeJob(job, result.error)),
            updatedAt: now(),
          }));

          return;
        }

        set((state) => ({
          resume: {
            originalFile: result.value.file,
            rawText: result.value.rawText,
            data: result.value.resume,
            baseline: result.value.resume,
            status: "completed",
            warnings: result.value.warnings,
            aiStructured: result.value.aiStructured,
            error: undefined,
          },
          analysis: initialAnalysisSlice,
          suggestions: [],
          history: emptyResumeHistory,
          selection: undefined,
          highlight: undefined,
          jobs: upsertJob(state.jobs, completeJob(job)),
          updatedAt: now(),
        }));
      },

      clearResume: () =>
        set({
          resume: initialResumeSlice,
          analysis: initialAnalysisSlice,
          suggestions: [],
          history: emptyResumeHistory,
          selection: undefined,
          highlight: undefined,
          updatedAt: now(),
        }),

      loadSampleResume: (resume) => {
        const normalized = normalizeResumeData(resume);

        set({
          resume: {
            data: normalized,
            baseline: normalized,
            status: "completed",
            warnings: [],
            aiStructured: false,
            rawText: undefined,
            originalFile: undefined,
            error: undefined,
          },
          analysis: initialAnalysisSlice,
          suggestions: [],
          history: emptyResumeHistory,
          selection: undefined,
          highlight: undefined,
          updatedAt: now(),
        });
      },

      setJobUrl: (url) =>
        set((state) => ({
          job: {
            ...state.job,
            url,
            inputType: "url",
            error: undefined,
            status: state.job.status === "failed" ? "idle" : state.job.status,
          },
          updatedAt: now(),
        })),

      setJobDescription: (description) =>
        set((state) => ({
          job: {
            ...state.job,
            description,
            inputType: "text",
            error: undefined,
            status: state.job.status === "failed" ? "idle" : state.job.status,
          },
          updatedAt: now(),
        })),

      extractJob: async () => {
        const { job: jobSlice } = get();
        const useUrl = jobSlice.url.trim().length > 0;
        const input = useUrl ? jobSlice.url.trim() : jobSlice.description.trim();

        if (!input) {
          set((state) => ({
            job: {
              ...state.job,
              status: "failed",
              error: createJobError("EMPTY_DESCRIPTION"),
            },
            updatedAt: now(),
          }));

          return;
        }

        if (useUrl) {
          set((state) => ({
            job: { ...state.job, status: "validating", error: undefined },
            updatedAt: now(),
          }));

          const urlValidation = validateJobUrl(input);

          if (!urlValidation.ok) {
            set((state) => ({
              job: {
                ...state.job,
                status: "failed",
                error: urlValidation.error,
              },
              updatedAt: now(),
            }));

            return;
          }
        }

        const inputHash = stableHash({ useUrl, input });
        const backgroundJob = createJob("job-extraction", inputHash);

        set((state) => ({
          job: {
            ...state.job,
            status: useUrl ? "fetching" : "structuring",
            error: undefined,
          },
          jobs: upsertJob(state.jobs, backgroundJob),
          updatedAt: now(),
        }));

        const result = useUrl
          ? await requestJobExtractionFromUrl(input)
          : await requestJobExtractionFromText(input);

        if (!result.ok) {
          set((state) => ({
            job: { ...state.job, status: "failed", error: result.error },
            jobs: upsertJob(state.jobs, completeJob(backgroundJob, result.error)),
            updatedAt: now(),
          }));

          return;
        }

        set((state) => ({
          job: {
            ...state.job,
            inputType: useUrl ? "url" : "text",
            rawText: result.value.job.rawText,
            data: result.value.job,
            status: "completed",
            error: undefined,
          },
          analysis: { ...state.analysis, data: undefined, previousScore: undefined },
          suggestions: [],
          jobs: upsertJob(state.jobs, completeJob(backgroundJob)),
          updatedAt: now(),
        }));
      },

      runAnalysis: async () => {
        const state = get();
        const resume = state.resume.data;
        const job = state.job.data;

        if (!resume || !job || state.analysis.running) {
          return;
        }

        const analysisKey = buildAnalysisKey(resume, job);
        const previousScore = state.analysis.data?.score.overall;
        const cached = state.analysis.cache[analysisKey];

        if (cached) {
          set({
            analysis: {
              ...state.analysis,
              data: cached.analysis,
              previousScore,
              error: undefined,
            },
            suggestions: cached.suggestions,
            updatedAt: now(),
          });

          return;
        }

        const backgroundJob = createJob("resume-analysis", analysisKey);
        const local = runDeterministicAnalysis(resume, job);

        set((current) => ({
          analysis: {
            ...current.analysis,
            running: true,
            data: local.analysis,
            previousScore,
            error: undefined,
          },
          suggestions: local.suggestions,
          jobs: upsertJob(current.jobs, backgroundJob),
          updatedAt: now(),
        }));

        const result = await requestAnalysis(resume, job);

        if (!result.ok) {
          set((current) => ({
            analysis: {
              ...current.analysis,
              running: false,
              error: result.error,
            },
            jobs: upsertJob(
              current.jobs,
              completeJob(backgroundJob, result.error),
            ),
            updatedAt: now(),
          }));

          return;
        }

        set((current) => ({
          analysis: {
            ...current.analysis,
            running: false,
            data: result.value.analysis,
            previousScore,
            error: undefined,
            cache: boundAnalysisCache(
              {
                ...current.analysis.cache,
                [analysisKey]: {
                  analysis: result.value.analysis,
                  suggestions: result.value.suggestions,
                },
              },
              analysisKey,
            ),
          },
          suggestions: result.value.suggestions,
          jobs: upsertJob(current.jobs, completeJob(backgroundJob)),
          updatedAt: now(),
        }));
      },

      applyAction: async (action, options) => {
        const state = get();
        const resume = state.resume.data;

        if (!resume) {
          return;
        }

        const nextResume = normalizeResumeData(applyResumeAction(resume, action));

        set({
          resume: { ...state.resume, data: nextResume },
          history: recordHistoryEntry(state.history, {
            action,
            previousResume: resume,
            nextResume,
            timestamp: now(),
            suggestionId: options?.suggestionId,
            proposalId: options?.proposalId,
          }),
          highlight: highlightForAction(action),
          updatedAt: now(),
        });

        await get().runAnalysis();
      },

      acceptSuggestion: async (suggestionId) => {
        const state = get();
        const suggestion = state.suggestions.find(
          (item) => item.id === suggestionId,
        );

        if (
          !suggestion ||
          suggestion.status === "accepted" ||
          state.applyingSuggestionId
        ) {
          return;
        }

        set({
          applyingSuggestionId: suggestionId,
          applyingSuggestionPhase: "applying",
          updatedAt: now(),
        });

        try {
          if (suggestion.action) {
            await waitForDuration(360);
            const application = get().applyAction(suggestion.action, {
              suggestionId,
            });

            set({
              applyingSuggestionPhase: "evaluating",
              updatedAt: now(),
            });

            await application;
          }

          set((current) => ({
            suggestions: current.suggestions.map((item) =>
              item.id === suggestionId ? { ...item, status: "accepted" } : item,
            ),
            updatedAt: now(),
          }));
        } finally {
          set({
            applyingSuggestionId: undefined,
            applyingSuggestionPhase: undefined,
          });
        }
      },

      ignoreSuggestion: (suggestionId) =>
        set((state) => ({
          suggestions: state.suggestions.map((item) =>
            item.id === suggestionId ? { ...item, status: "ignored" } : item,
          ),
          updatedAt: now(),
        })),

      restoreSuggestion: (suggestionId) =>
        set((state) => ({
          suggestions: state.suggestions.map((item) =>
            item.id === suggestionId ? { ...item, status: "pending" } : item,
          ),
          updatedAt: now(),
        })),

      editSuggestion: (suggestionId, payload) =>
        set((state) => ({
          suggestions: state.suggestions.map((item) =>
            item.id === suggestionId
              ? { ...item, ...payload, id: item.id, status: "edited" }
              : item,
          ),
          updatedAt: now(),
        })),

      undoLastChange: async () => {
        const state = get();
        const outcome = undoHistory(state.history);

        if (!outcome || !state.resume.data) {
          return;
        }

        set({
          resume: { ...state.resume, data: outcome.resume },
          history: outcome.history,
          suggestions: outcome.entry.suggestionId
            ? state.suggestions.map((item) =>
                item.id === outcome.entry.suggestionId
                  ? { ...item, status: "pending" }
                  : item,
              )
            : state.suggestions,
          copilot: outcome.entry.proposalId
            ? {
                ...state.copilot,
                proposals: state.copilot.proposals.map((item) =>
                  item.id === outcome.entry.proposalId
                    ? { ...item, status: "pending" }
                    : item,
                ),
              }
            : state.copilot,
          highlight: highlightForAction(outcome.entry.action),
          updatedAt: now(),
        });

        await get().runAnalysis();
      },

      redoLastChange: async () => {
        const state = get();
        const outcome = redoHistory(state.history);

        if (!outcome) {
          return;
        }

        set({
          resume: { ...state.resume, data: outcome.resume },
          history: outcome.history,
          suggestions: outcome.entry.suggestionId
            ? state.suggestions.map((item) =>
                item.id === outcome.entry.suggestionId
                  ? { ...item, status: "accepted" }
                  : item,
              )
            : state.suggestions,
          copilot: outcome.entry.proposalId
            ? {
                ...state.copilot,
                proposals: state.copilot.proposals.map((item) =>
                  item.id === outcome.entry.proposalId
                    ? { ...item, status: "applied" }
                    : item,
                ),
              }
            : state.copilot,
          highlight: highlightForAction(outcome.entry.action),
          updatedAt: now(),
        });

        await get().runAnalysis();
      },

      sendCopilotMessage: async (message) => {
        const state = get();
        const resume = state.resume.data;

        if (!resume || state.copilot.pending) {
          return;
        }

        const userMessage: CopilotMessage = {
          id: createIdentifier("msg"),
          role: "user",
          content: message,
          createdAt: now(),
        };

        set((current) => ({
          copilot: {
            ...current.copilot,
            messages: boundMessages([...current.copilot.messages, userMessage]),
            pending: true,
            error: undefined,
            retryMessage: undefined,
          },
          updatedAt: now(),
        }));

        const result = await requestCopilot({
          resume,
          job: state.job.data,
          analysis: state.analysis.data,
          pendingSuggestions: state.suggestions.filter(
            (suggestion) => suggestion.status === "pending",
          ),
          message,
          history: state.copilot.messages,
        });

        if (!result.ok) {
          set((current) => ({
            copilot: {
              ...current.copilot,
              pending: false,
              error: result.error,
              retryMessage: message,
            },
            updatedAt: now(),
          }));

          return;
        }

        const copilotResult = result.value.result;
        const proposal = isActionProposal(copilotResult)
          ? copilotResult
          : undefined;
        const assistantContent = proposal
          ? proposal.explanation
          : (copilotResult as { content: string }).content;

        set((current) => ({
          copilot: {
            ...current.copilot,
            messages: boundMessages([
              ...current.copilot.messages,
              {
                id: createIdentifier("msg"),
                role: "assistant",
                content: assistantContent,
                createdAt: now(),
                actionProposalId: proposal?.id,
              },
            ]),
            proposals: proposal
              ? [...current.copilot.proposals, proposal].slice(-10)
              : current.copilot.proposals,
            pending: false,
            error: undefined,
            retryMessage: undefined,
          },
          updatedAt: now(),
        }));
      },

      retryCopilotMessage: async () => {
        const { copilot } = get();

        if (!copilot.retryMessage || copilot.pending) {
          return;
        }

        const message = copilot.retryMessage;

        set((current) => ({
          copilot: {
            ...current.copilot,
            messages: current.copilot.messages.filter(
              (entry, index) =>
                !(
                  index === current.copilot.messages.length - 1 &&
                  entry.role === "user" &&
                  entry.content === message
                ),
            ),
            error: undefined,
            retryMessage: undefined,
          },
        }));

        await get().sendCopilotMessage(message);
      },

      dismissCopilotError: () =>
        set((state) => ({
          copilot: { ...state.copilot, error: undefined, retryMessage: undefined },
        })),

      applyCopilotProposal: async (proposalId) => {
        const state = get();
        const proposal = state.copilot.proposals.find(
          (item) => item.id === proposalId,
        );

        if (
          !proposal ||
          (proposal.status !== "pending" && proposal.status !== "edited") ||
          state.copilot.applyingProposalId
        ) {
          return;
        }

        set((current) => ({
          copilot: {
            ...current.copilot,
            applyingProposalId: proposalId,
            applicationPhase: "applying",
          },
          updatedAt: now(),
        }));

        try {
          await waitForDuration(360);
          const application = get().applyAction(proposal.action, { proposalId });

          set((current) => ({
            copilot: {
              ...current.copilot,
              applicationPhase: "evaluating",
            },
            updatedAt: now(),
          }));

          await application;

          set((current) => ({
            copilot: {
              ...current.copilot,
              proposals: current.copilot.proposals.map((item) =>
                item.id === proposalId
                  ? ({ ...item, status: "applied" } satisfies CopilotActionProposal)
                  : item,
              ),
            },
            updatedAt: now(),
          }));
        } finally {
          set((current) => ({
            copilot: {
              ...current.copilot,
              applyingProposalId: undefined,
              applicationPhase: undefined,
            },
          }));
        }
      },

      ignoreCopilotProposal: (proposalId) =>
        set((state) => ({
          copilot: {
            ...state.copilot,
            proposals: state.copilot.proposals.map((item) =>
              item.id === proposalId ? { ...item, status: "ignored" } : item,
            ),
          },
          updatedAt: now(),
        })),

      editCopilotProposal: (proposalId, action) =>
        set((state) => ({
          copilot: {
            ...state.copilot,
            proposals: state.copilot.proposals.map((item) =>
              item.id === proposalId
                ? { ...item, action, status: "edited" }
                : item,
            ),
          },
          updatedAt: now(),
        })),

      selectResumeSection: (selection) =>
        set({ selection, updatedAt: now() }),

      dismissHighlight: (highlightId) =>
        set((state) =>
          state.highlight?.id === highlightId ? { highlight: undefined } : {},
        ),

      resetSession: () => set(createInitialState()),
    }),
    {
      name: "resume-tailor-session",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        id: state.id,
        resume: {
          originalFile: state.resume.originalFile,
          rawText: state.resume.rawText,
          data: state.resume.data,
          baseline: state.resume.baseline,
          status: state.resume.status,
          warnings: state.resume.warnings,
          aiStructured: state.resume.aiStructured,
        },
        job: {
          inputType: state.job.inputType,
          url: state.job.url,
          description: state.job.description,
          rawText: state.job.rawText,
          data: state.job.data,
          status: state.job.status,
        },
        analysis: {
          data: state.analysis.data,
          running: false,
          cache: state.analysis.cache,
        },
        suggestions: state.suggestions,
        copilot: {
          messages: state.copilot.messages,
          proposals: state.copilot.proposals,
          pending: false,
        },
        history: state.history,
        jobs: state.jobs,
        selection: state.selection,
        createdAt: state.createdAt,
        updatedAt: state.updatedAt,
      }),
      merge: (persisted, current) => {
        const restored = persisted as Partial<TailorSessionState> | undefined;

        if (!restored) {
          return current;
        }

        const resumeStatus =
          restored.resume?.data === undefined &&
          restored.resume?.status !== "idle"
            ? "idle"
            : (restored.resume?.status ?? "idle");

        const jobStatus =
          restored.job?.data === undefined && restored.job?.status !== "idle"
            ? "idle"
            : (restored.job?.status ?? "idle");

        return {
          ...current,
          ...restored,
          resume: {
            ...initialResumeSlice,
            ...restored.resume,
            status: resumeStatus,
            error: undefined,
          },
          job: {
            ...initialJobSlice,
            ...restored.job,
            status: jobStatus,
            error: undefined,
          },
          analysis: {
            ...initialAnalysisSlice,
            ...restored.analysis,
            running: false,
            previousScore: undefined,
            error: undefined,
          },
          copilot: {
            ...emptyCopilotState,
            ...restored.copilot,
            pending: false,
            error: undefined,
            retryMessage: undefined,
            applyingProposalId: undefined,
            applicationPhase: undefined,
          },
          highlight: undefined,
          applyingSuggestionId: undefined,
          applyingSuggestionPhase: undefined,
          jobs: (restored.jobs ?? []).map((job) =>
            isResumable(job)
              ? { ...job, status: "cancelled" as const, updatedAt: now() }
              : job,
          ),
        };
      },
    },
  ),
);

export function selectWorkflowState(state: SessionStore): WorkflowState {
  const analysisKey =
    state.resume.data && state.job.data
      ? buildAnalysisKey(state.resume.data, state.job.data)
      : undefined;

  return deriveWorkflowState({
    hasResume: Boolean(state.resume.data),
    hasJob: Boolean(state.job.data),
    hasAnalysis: Boolean(state.analysis.data),
    analysisRunning: state.analysis.running,
    analysisStale: Boolean(
      analysisKey &&
        state.analysis.data &&
        state.analysis.data.analysisKey !== analysisKey,
    ),
    editing: state.history.past.length > 0,
  });
}

export function selectCanUndo(state: SessionStore) {
  return canUndo(state.history);
}

export function selectCanRedo(state: SessionStore) {
  return canRedo(state.history);
}

export function selectPendingSuggestions(state: SessionStore) {
  return state.suggestions.filter(
    (suggestion) => suggestion.status === "pending",
  );
}

export function selectJobOffer(state: SessionStore): JobOffer | undefined {
  return state.job.data;
}
