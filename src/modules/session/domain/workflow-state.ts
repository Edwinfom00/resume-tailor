export type WorkflowState =
  | "EMPTY"
  | "RESUME_READY"
  | "JOB_READY"
  | "ANALYZING"
  | "ANALYSIS_READY"
  | "EDITING"
  | "ANALYSIS_DIRTY"
  | "REANALYZING";

export interface WorkflowInputs {
  readonly hasResume: boolean;
  readonly hasJob: boolean;
  readonly hasAnalysis: boolean;
  readonly analysisRunning: boolean;
  readonly analysisStale: boolean;
  readonly editing: boolean;
}

export function deriveWorkflowState(inputs: WorkflowInputs): WorkflowState {
  if (!inputs.hasResume) {
    return "EMPTY";
  }

  if (inputs.analysisRunning) {
    return inputs.hasAnalysis ? "REANALYZING" : "ANALYZING";
  }

  if (!inputs.hasJob) {
    return "RESUME_READY";
  }

  if (!inputs.hasAnalysis) {
    return "JOB_READY";
  }

  if (inputs.analysisStale) {
    return "ANALYSIS_DIRTY";
  }

  return inputs.editing ? "EDITING" : "ANALYSIS_READY";
}

export const analysisReadyStates: ReadonlySet<WorkflowState> = new Set([
  "ANALYSIS_READY",
  "EDITING",
  "ANALYSIS_DIRTY",
  "REANALYZING",
]);

export function canRunAnalysis(state: WorkflowState) {
  return (
    state === "JOB_READY" ||
    state === "ANALYSIS_READY" ||
    state === "ANALYSIS_DIRTY" ||
    state === "EDITING"
  );
}

export function isBusy(state: WorkflowState) {
  return state === "ANALYZING" || state === "REANALYZING";
}
