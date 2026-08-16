import "server-only";
import type { ResumeData } from "@/@types/resume-data";
import { structureResumeWithAi } from "@/modules/ai/analyze-resume";
import { createResumeError } from "@/modules/resume/domain/resume-errors";
import type { ResumeWarningCode } from "@/modules/resume/validation/validate-resume";
import { validateResumeData } from "@/modules/resume/validation/validate-resume";
import { normalizeResumeData } from "@/modules/resume/normalization/normalize-resume";
import { buildDeterministicResumeDraft } from "@/modules/resume/parsers/deterministic-resume-structure";
import {
  extractDocumentText,
  type ExtractedDocument,
} from "@/modules/resume/parsers/document-text";
import {
  validateResumeFile,
  type ValidatedResumeFile,
} from "@/modules/resume/parsers/file-validation";
import type { DomainError } from "@/modules/shared/domain/domain-error";
import { err, ok, type Result } from "@/modules/shared/domain/result";

export interface ResumeExtractionOutcome {
  readonly resume: ResumeData;
  readonly rawText: string;
  readonly warnings: readonly ResumeWarningCode[];
  readonly aiStructured: boolean;
  readonly file: ValidatedResumeFile;
}

function mergeDrafts(
  deterministic: ResumeData,
  aiDraft: ResumeData,
): ResumeData {
  return {
    identity: {
      name: aiDraft.identity.name || deterministic.identity.name,
      headline: aiDraft.identity.headline || deterministic.identity.headline,
      contact: {
        email:
          aiDraft.identity.contact.email || deterministic.identity.contact.email,
        phone:
          aiDraft.identity.contact.phone ?? deterministic.identity.contact.phone,
        location: aiDraft.identity.contact.location,
        links: aiDraft.identity.contact.links.length
          ? aiDraft.identity.contact.links
          : deterministic.identity.contact.links,
      },
    },
    profile: {
      summary: aiDraft.profile.summary || deterministic.profile.summary,
      highlights: aiDraft.profile.highlights,
    },
    experiences: aiDraft.experiences.length
      ? aiDraft.experiences
      : deterministic.experiences,
    projects: aiDraft.projects.length ? aiDraft.projects : deterministic.projects,
    education: aiDraft.education.length
      ? aiDraft.education
      : deterministic.education,
    skills: aiDraft.skills.length ? aiDraft.skills : deterministic.skills,
    languages: aiDraft.languages.length
      ? aiDraft.languages
      : deterministic.languages,
    interests: aiDraft.interests.length
      ? aiDraft.interests
      : deterministic.interests,
  };
}

function toResumeShape(draft: unknown): ResumeData {
  return draft as unknown as ResumeData;
}

async function structureDocument(
  document: ExtractedDocument,
): Promise<Readonly<{ resume: ResumeData; aiStructured: boolean }>> {
  const deterministic = buildDeterministicResumeDraft(document);
  const aiResult = await structureResumeWithAi(document.text);

  if (!aiResult.ok) {
    return { resume: deterministic, aiStructured: false };
  }

  return {
    resume: mergeDrafts(deterministic, toResumeShape(aiResult.value)),
    aiStructured: true,
  };
}

export async function extractResumeFromFile(
  file: Readonly<{
    name: string;
    size: number;
    type: string;
    data: Uint8Array;
  }>,
): Promise<Result<ResumeExtractionOutcome, DomainError>> {
  const fileResult = validateResumeFile(file);

  if (!fileResult.ok) {
    return fileResult;
  }

  const documentResult = await extractDocumentText(
    file.data,
    fileResult.value.format,
  );

  if (!documentResult.ok) {
    return documentResult;
  }

  const document = documentResult.value;
  const { resume, aiStructured } = await structureDocument(document);
  const normalized = normalizeResumeData(resume);
  const validation = validateResumeData(normalized);

  if (!validation.ok) {
    return err(
      createResumeError("INVALID_RESUME", {
        message: validation.error.message,
        cause: validation.error.cause,
      }),
    );
  }

  return ok({
    resume: validation.value.resume,
    rawText: document.text,
    warnings: validation.value.warnings,
    aiStructured,
    file: fileResult.value,
  });
}
