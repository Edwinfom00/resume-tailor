import type { Messages } from "@/i18n/messages/types";

export type UploadedResume = Readonly<{
  name: string;
  metadata: string;
  type: string;
}>;

const maximumFileSize = 10 * 1024 * 1024;

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
  return /\.(pdf|docx)$/i.test(file.name) && file.size <= maximumFileSize;
}

export function createUploadedResume(
  file: File,
  messages: Messages["upload"],
): UploadedResume {
  const sizeInKilobytes = Math.max(1, Math.round(file.size / 1024));

  return {
    name: file.name,
    metadata: `${sizeInKilobytes} KB · ${messages.uploadedJustNowLabel}`,
    type: file.name.toLowerCase().endsWith(".pdf") ? "PDF" : "DOCX",
  };
}
