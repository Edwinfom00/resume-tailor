import type { Messages } from "@/i18n/messages/types";
import type { FileMetadata } from "@/modules/resume/domain/resume-status";
import { maximumResumeFileSize } from "@/modules/resume/parsers/file-validation";

export type UploadedResume = Readonly<{
  name: string;
  metadata: string;
  type: string;
  source?: File;
}>;

export function createMockResume(
  messages: Messages["upload"],
): UploadedResume {
  return {
    name: messages.mockFileName,
    metadata: messages.mockFileMetadata,
    type: messages.fileTypeLabel,
  };
}

export function isSupportedResume(file: File) {
  return /\.(pdf|docx)$/i.test(file.name) && file.size <= maximumResumeFileSize;
}

function describeFormat(name: string) {
  return name.toLowerCase().endsWith(".pdf") ? "PDF" : "DOCX";
}

export function createUploadedResume(
  file: File,
  messages: Messages["upload"],
): UploadedResume {
  const sizeInKilobytes = Math.max(1, Math.round(file.size / 1024));

  return {
    name: file.name,
    metadata: `${sizeInKilobytes} KB · ${messages.uploadedJustNowLabel}`,
    type: describeFormat(file.name),
    source: file,
  };
}

export function fromFileMetadata(
  file: FileMetadata,
  messages: Messages["upload"],
): UploadedResume {
  const sizeInKilobytes = Math.max(1, Math.round(file.size / 1024));

  return {
    name: file.name,
    metadata: `${sizeInKilobytes} KB · ${messages.uploadedJustNowLabel}`,
    type: describeFormat(file.name),
  };
}
