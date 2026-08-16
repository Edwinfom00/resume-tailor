export type ResumeParseStatus =
  | "idle"
  | "validating"
  | "extracting"
  | "structuring"
  | "validating-result"
  | "completed"
  | "failed";

export type ResumeErrorCode =
  | "UNSUPPORTED_FILE"
  | "FILE_TOO_LARGE"
  | "EMPTY_DOCUMENT"
  | "TEXT_EXTRACTION_FAILED"
  | "INVALID_RESUME"
  | "PARTIAL_EXTRACTION"
  | "UNKNOWN";

export const resumeParseProgress: Readonly<Record<ResumeParseStatus, number>> = {
  idle: 0,
  validating: 10,
  extracting: 35,
  structuring: 70,
  "validating-result": 90,
  completed: 100,
  failed: 100,
};

export interface FileMetadata {
  readonly name: string;
  readonly mimeType: string;
  readonly size: number;
  readonly uploadedAt: string;
}
