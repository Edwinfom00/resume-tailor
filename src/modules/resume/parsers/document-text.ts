import "server-only";
import { createResumeError } from "@/modules/resume/domain/resume-errors";
import type { ResumeDocumentFormat } from "@/modules/resume/parsers/file-validation";
import type { DomainError } from "@/modules/shared/domain/domain-error";
import { err, ok, type Result } from "@/modules/shared/domain/result";

export interface ExtractedDocument {
  readonly text: string;
  readonly pageCount?: number;
  readonly emails: readonly string[];
  readonly phones: readonly string[];
  readonly urls: readonly string[];
}

const minimumMeaningfulLength = 120;

const emailPattern = /[\w.+-]+@[\w-]+\.[\w.-]{2,}/g;
const urlPattern = /\bhttps?:\/\/[^\s<>"')]+|\bwww\.[^\s<>"')]+/gi;
const phonePattern = /(?:\+\d{1,3}[\s.-]?)?(?:\(\d{1,4}\)[\s.-]?)?\d[\d\s.-]{6,}\d/g;

function unique(values: readonly string[]) {
  return Array.from(new Set(values.map((value) => value.trim()))).filter(Boolean);
}

function normalizeExtractedText(raw: string) {
  return raw
    .replace(/\r\n?/g, "\n")
    .replace(/ /g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/ ?\n ?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function collectMetadata(text: string) {
  return {
    emails: unique(text.match(emailPattern) ?? []).map((value) =>
      value.toLowerCase(),
    ),
    urls: unique(text.match(urlPattern) ?? []).map((value) =>
      value.replace(/[.,;:]+$/, ""),
    ),
    phones: unique(text.match(phonePattern) ?? [])
      .map((value) => value.trim())
      .filter((value) => value.replace(/\D/g, "").length >= 8),
  };
}

async function extractPdfText(data: Uint8Array) {
  const { extractText, getDocumentProxy } = await import("unpdf");
  const document = await getDocumentProxy(data);
  const { text, totalPages } = await extractText(document, { mergePages: true });

  return {
    text: Array.isArray(text) ? text.join("\n") : text,
    pageCount: totalPages,
  };
}

async function extractDocxText(data: Uint8Array) {
  const mammoth = await import("mammoth");
  const { value } = await mammoth.extractRawText({
    buffer: Buffer.from(data),
  });

  return { text: value, pageCount: undefined };
}

export async function extractDocumentText(
  data: Uint8Array,
  format: ResumeDocumentFormat,
): Promise<Result<ExtractedDocument, DomainError>> {
  let extracted: Readonly<{ text: string; pageCount?: number }>;

  try {
    extracted =
      format === "pdf" ? await extractPdfText(data) : await extractDocxText(data);
  } catch (cause) {
    return err(createResumeError("TEXT_EXTRACTION_FAILED", { cause }));
  }

  const text = normalizeExtractedText(extracted.text);

  if (text.length < minimumMeaningfulLength) {
    return err(createResumeError("EMPTY_DOCUMENT"));
  }

  return ok({
    text,
    pageCount: extracted.pageCount,
    ...collectMetadata(text),
  });
}
