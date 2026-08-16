import type { ResumeData } from "@/@types/resume-data";
import type { JobOffer } from "@/modules/job/domain/job-offer";
import type { ResumeJobAnalysis } from "@/modules/analysis/domain/analysis-types";
import type { ResumeSuggestion } from "@/modules/analysis/domain/suggestion-types";
import type { CopilotMessage, CopilotResult } from "@/modules/copilot/domain/copilot-types";
import type { FileMetadata } from "@/modules/resume/domain/resume-status";
import type { ResumeWarningCode } from "@/modules/resume/validation/validate-resume";
import {
  createDomainError,
  isDomainError,
  type DomainError,
} from "@/modules/shared/domain/domain-error";
import { err, ok, type Result } from "@/modules/shared/domain/result";

async function readError(response: Response): Promise<DomainError> {
  const payload: unknown = await response.json().catch(() => null);
  const candidate = (payload as { error?: unknown } | null)?.error;

  if (isDomainError(candidate)) {
    return candidate;
  }

  return createDomainError(
    "REQUEST_FAILED",
    "The request could not be completed. Please try again.",
  );
}

async function postJson<TResponse>(
  url: string,
  body: unknown,
  signal?: AbortSignal,
): Promise<Result<TResponse, DomainError>> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });

    if (!response.ok) {
      return err(await readError(response));
    }

    return ok((await response.json()) as TResponse);
  } catch (cause) {
    return err(
      createDomainError("NETWORK_ERROR", "The request could not be sent.", {
        cause,
      }),
    );
  }
}

export interface ResumeExtractionResponse {
  readonly resume: ResumeData;
  readonly rawText: string;
  readonly warnings: readonly ResumeWarningCode[];
  readonly aiStructured: boolean;
  readonly file: FileMetadata;
}

export async function requestResumeExtraction(
  file: File,
  signal?: AbortSignal,
): Promise<Result<ResumeExtractionResponse, DomainError>> {
  const formData = new FormData();

  formData.append("file", file);

  try {
    const response = await fetch("/api/resume/extract", {
      method: "POST",
      body: formData,
      signal,
    });

    if (!response.ok) {
      return err(await readError(response));
    }

    return ok((await response.json()) as ResumeExtractionResponse);
  } catch (cause) {
    return err(
      createDomainError("NETWORK_ERROR", "The resume could not be uploaded.", {
        cause,
      }),
    );
  }
}

export function requestJobExtractionFromUrl(url: string, signal?: AbortSignal) {
  return postJson<{ job: JobOffer }>(
    "/api/job/extract",
    { source: "url", url },
    signal,
  );
}

export function requestJobExtractionFromText(
  description: string,
  signal?: AbortSignal,
) {
  return postJson<{ job: JobOffer }>(
    "/api/job/extract",
    { source: "text", description },
    signal,
  );
}

export function requestAnalysis(
  resume: ResumeData,
  job: JobOffer,
  signal?: AbortSignal,
) {
  return postJson<{
    analysis: ResumeJobAnalysis;
    suggestions: readonly ResumeSuggestion[];
  }>("/api/analysis/run", { resume, job }, signal);
}

export function requestCopilot(
  payload: Readonly<{
    resume: ResumeData;
    job?: JobOffer;
    analysis?: ResumeJobAnalysis;
    pendingSuggestions: readonly ResumeSuggestion[];
    message: string;
    history: readonly CopilotMessage[];
  }>,
  signal?: AbortSignal,
) {
  return postJson<{ result: CopilotResult }>("/api/copilot", payload, signal);
}
