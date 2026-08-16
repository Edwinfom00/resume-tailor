import type { DomainError } from "@/modules/shared/domain/domain-error";

export type JobStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export type BackgroundJobType =
  | "resume-parse"
  | "job-extraction"
  | "job-analysis"
  | "resume-analysis"
  | "copilot";

export interface BackgroundJobState {
  readonly id: string;
  readonly type: BackgroundJobType;
  readonly status: JobStatus;
  readonly progress: number;
  readonly step?: string;
  readonly inputHash: string;
  readonly error?: DomainError;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export const terminalJobStatuses: ReadonlySet<JobStatus> = new Set([
  "completed",
  "failed",
  "cancelled",
]);

export function isTerminal(job: BackgroundJobState) {
  return terminalJobStatuses.has(job.status);
}

export function isResumable(job: BackgroundJobState) {
  return job.status === "queued" || job.status === "running";
}

export function findActiveJob(
  jobs: readonly BackgroundJobState[],
  type: BackgroundJobType,
) {
  return jobs.find((job) => job.type === type && !isTerminal(job));
}

export function findCompletedJob(
  jobs: readonly BackgroundJobState[],
  type: BackgroundJobType,
  inputHash: string,
) {
  return jobs.find(
    (job) =>
      job.type === type &&
      job.status === "completed" &&
      job.inputHash === inputHash,
  );
}

export function upsertJob(
  jobs: readonly BackgroundJobState[],
  job: BackgroundJobState,
): readonly BackgroundJobState[] {
  const index = jobs.findIndex((existing) => existing.id === job.id);

  if (index === -1) {
    return [...jobs, job].slice(-12);
  }

  return jobs.map((existing, currentIndex) =>
    currentIndex === index ? job : existing,
  );
}
