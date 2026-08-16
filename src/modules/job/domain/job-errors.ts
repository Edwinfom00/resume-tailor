import {
  createDomainError,
  type DomainError,
} from "@/modules/shared/domain/domain-error";

export type JobErrorCode =
  | "INVALID_URL"
  | "UNREACHABLE_URL"
  | "REQUEST_TIMEOUT"
  | "NON_HTML_RESPONSE"
  | "EMPTY_PAGE"
  | "BLOCKED_PAGE"
  | "NO_JOB_CONTENT"
  | "EMPTY_DESCRIPTION"
  | "INVALID_JOB_OFFER"
  | "UNKNOWN";

const jobErrorMessages: Readonly<Record<JobErrorCode, string>> = {
  INVALID_URL: "This job link is not a valid URL.",
  UNREACHABLE_URL:
    "Could not open this job page. Paste the job description instead.",
  REQUEST_TIMEOUT:
    "The job page took too long to respond. Paste the job description instead.",
  NON_HTML_RESPONSE:
    "This link does not point to a job page. Paste the job description instead.",
  EMPTY_PAGE:
    "This job page returned no readable content. Paste the job description instead.",
  BLOCKED_PAGE:
    "This site blocked the request. Paste the job description instead.",
  NO_JOB_CONTENT:
    "Could not extract this job page. Paste the job description instead.",
  EMPTY_DESCRIPTION: "Add a job URL or paste the job description first.",
  INVALID_JOB_OFFER: "The job offer could not be structured from this content.",
  UNKNOWN: "The job offer could not be processed.",
};

export function createJobError(
  code: JobErrorCode,
  options: Readonly<{ message?: string; cause?: unknown }> = {},
): DomainError {
  return createDomainError(code, options.message ?? jobErrorMessages[code], {
    recoverable: true,
    cause: options.cause,
  });
}
