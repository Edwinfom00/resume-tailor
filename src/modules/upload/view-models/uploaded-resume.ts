import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages/types";
import type { FileMetadata } from "@/modules/resume/domain/resume-status";
import { detectResumeFormat } from "@/modules/resume/parsers/file-validation";

export type UploadedResumeView = Readonly<{
  name: string;
  metadata: string;
  format: string;
}>;

const kilobyte = 1024;
const megabyte = kilobyte * 1024;
const justNowThresholdMs = 60_000;

export function formatFileSize(bytes: number, locale: Locale) {
  if (bytes >= megabyte) {
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(bytes / megabyte)} MB`;
  }

  return `${new Intl.NumberFormat(locale).format(Math.max(1, Math.round(bytes / kilobyte)))} KB`;
}

function describeUploadedAt(
  uploadedAt: string,
  locale: Locale,
  justNowLabel: string,
) {
  const timestamp = Date.parse(uploadedAt);

  if (Number.isNaN(timestamp)) {
    return justNowLabel;
  }

  if (Date.now() - timestamp < justNowThresholdMs) {
    return justNowLabel;
  }

  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);
}

export function toUploadedResumeView(
  file: FileMetadata,
  locale: Locale,
  messages: Messages["upload"],
): UploadedResumeView {
  return {
    name: file.name,
    metadata: `${formatFileSize(file.size, locale)} · ${describeUploadedAt(file.uploadedAt, locale, messages.uploadedJustNowLabel)}`,
    format:
      detectResumeFormat(file.name, file.mimeType)?.toUpperCase() ?? "",
  };
}
