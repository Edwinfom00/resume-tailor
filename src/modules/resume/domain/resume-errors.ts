import {
  createDomainError,
  type DomainError,
} from "@/modules/shared/domain/domain-error";
import type { ResumeErrorCode } from "@/modules/resume/domain/resume-status";

const resumeErrorMessages: Readonly<Record<ResumeErrorCode, string>> = {
  UNSUPPORTED_FILE: "This file type is not supported. Upload a PDF or DOCX resume.",
  FILE_TOO_LARGE: "This file is larger than the 10 MB limit.",
  EMPTY_DOCUMENT: "No readable text was found in this document.",
  TEXT_EXTRACTION_FAILED:
    "The document could not be read. Try exporting it again as a PDF or DOCX.",
  INVALID_RESUME:
    "This document does not look like a resume. Upload your CV instead.",
  PARTIAL_EXTRACTION:
    "Only part of the resume could be structured. Review the imported content.",
  UNKNOWN: "The resume could not be processed.",
};

const unrecoverableResumeErrors: ReadonlySet<ResumeErrorCode> = new Set([]);

export function createResumeError(
  code: ResumeErrorCode,
  options: Readonly<{ message?: string; cause?: unknown }> = {},
): DomainError {
  return createDomainError(code, options.message ?? resumeErrorMessages[code], {
    recoverable: !unrecoverableResumeErrors.has(code),
    cause: options.cause,
  });
}

export function isResumeErrorCode(value: string): value is ResumeErrorCode {
  return value in resumeErrorMessages;
}
