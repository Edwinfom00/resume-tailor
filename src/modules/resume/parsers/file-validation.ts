import { createResumeError } from "@/modules/resume/domain/resume-errors";
import type { DomainError } from "@/modules/shared/domain/domain-error";
import { err, ok, type Result } from "@/modules/shared/domain/result";

export type ResumeDocumentFormat = "pdf" | "docx";

export const maximumResumeFileSize = 10 * 1024 * 1024;

const formatByExtension: Readonly<Record<string, ResumeDocumentFormat>> = {
  pdf: "pdf",
  docx: "docx",
};

const formatByMimeType: Readonly<Record<string, ResumeDocumentFormat>> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
};

export interface ValidatedResumeFile {
  readonly name: string;
  readonly size: number;
  readonly mimeType: string;
  readonly format: ResumeDocumentFormat;
}

export function detectResumeFormat(name: string, mimeType: string) {
  const extension = name.split(".").pop()?.toLowerCase() ?? "";

  return formatByExtension[extension] ?? formatByMimeType[mimeType];
}

export function validateResumeFile(
  file: Readonly<{ name: string; size: number; type: string }>,
): Result<ValidatedResumeFile, DomainError> {
  const format = detectResumeFormat(file.name, file.type);

  if (!format) {
    return err(createResumeError("UNSUPPORTED_FILE"));
  }

  if (file.size <= 0) {
    return err(createResumeError("EMPTY_DOCUMENT"));
  }

  if (file.size > maximumResumeFileSize) {
    return err(createResumeError("FILE_TOO_LARGE"));
  }

  return ok({
    name: file.name,
    size: file.size,
    mimeType: file.type || (format === "pdf" ? "application/pdf" : ""),
    format,
  });
}
