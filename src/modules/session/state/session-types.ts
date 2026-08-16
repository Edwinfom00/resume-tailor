import type { ResumeData } from "@/@types/resume-data";
import type { JobAnalysisStatus, JobOffer } from "@/modules/job/domain/job-offer";
import type { ResumeJobAnalysis } from "@/modules/analysis/domain/analysis-types";
import type { ResumeSuggestion } from "@/modules/analysis/domain/suggestion-types";
import type { CopilotState } from "@/modules/copilot/domain/copilot-types";
import type {
  FileMetadata,
  ResumeParseStatus,
} from "@/modules/resume/domain/resume-status";
import type { ResumeWarningCode } from "@/modules/resume/validation/validate-resume";
import type { BackgroundJobState } from "@/modules/session/domain/background-job";
import type { ApplicationPhase } from "@/modules/session/domain/application-phase";
import type { ResumeHistory } from "@/modules/session/domain/resume-history";
import type {
  ResumeHighlight,
  ResumeSelection,
} from "@/modules/session/domain/resume-selection";
import type { DomainError } from "@/modules/shared/domain/domain-error";

export interface ResumeSlice {
  readonly originalFile?: FileMetadata;
  readonly rawText?: string;
  readonly data?: ResumeData;
  readonly baseline?: ResumeData;
  readonly status: ResumeParseStatus;
  readonly warnings: readonly ResumeWarningCode[];
  readonly error?: DomainError;
  readonly aiStructured: boolean;
}

export interface JobSlice {
  readonly inputType?: "url" | "text";
  readonly url: string;
  readonly description: string;
  readonly rawText?: string;
  readonly data?: JobOffer;
  readonly status: JobAnalysisStatus;
  readonly error?: DomainError;
}

export interface AnalysisSlice {
  readonly data?: ResumeJobAnalysis;
  readonly running: boolean;
  readonly previousScore?: number;
  readonly error?: DomainError;
  readonly cache: Readonly<
    Record<
      string,
      Readonly<{
        analysis: ResumeJobAnalysis;
        suggestions: readonly ResumeSuggestion[];
      }>
    >
  >;
}

export interface TailorSessionState {
  readonly id: string;
  readonly resume: ResumeSlice;
  readonly job: JobSlice;
  readonly analysis: AnalysisSlice;
  readonly suggestions: readonly ResumeSuggestion[];
  readonly copilot: CopilotState;
  readonly history: ResumeHistory;
  readonly jobs: readonly BackgroundJobState[];
  readonly selection?: ResumeSelection;
  readonly highlight?: ResumeHighlight;
  readonly applyingSuggestionId?: string;
  readonly applyingSuggestionPhase?: ApplicationPhase;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export const initialResumeSlice: ResumeSlice = {
  status: "idle",
  warnings: [],
  aiStructured: false,
};

export const initialJobSlice: JobSlice = {
  url: "",
  description: "",
  status: "idle",
};

export const initialAnalysisSlice: AnalysisSlice = {
  running: false,
  cache: {},
};
