import type { ResumeData } from "@/@types/resume-data";
import { resumeDataSchema } from "@/modules/resume/domain/resume-schema";
import { createResumeError } from "@/modules/resume/domain/resume-errors";
import type { DomainError } from "@/modules/shared/domain/domain-error";
import { err, ok, type Result } from "@/modules/shared/domain/result";

export type ResumeWarningCode =
  | "MISSING_EMAIL"
  | "MISSING_HEADLINE"
  | "MISSING_SUMMARY"
  | "NO_EXPERIENCE"
  | "NO_SKILLS"
  | "NO_PROJECTS"
  | "NO_EDUCATION"
  | "SPARSE_ACHIEVEMENTS";

export interface ResumeValidationOutcome {
  readonly valid: true;
  readonly resume: ResumeData;
  readonly warnings: readonly ResumeWarningCode[];
}

const minimumMeaningfulSections = 1;

function countMeaningfulSections(resume: ResumeData) {
  return [
    resume.experiences.length > 0,
    resume.projects.length > 0,
    resume.education.length > 0,
    resume.skills.length > 0,
  ].filter(Boolean).length;
}

export function collectResumeWarnings(
  resume: ResumeData,
): readonly ResumeWarningCode[] {
  const warnings: ResumeWarningCode[] = [];

  if (!resume.identity.contact.email) {
    warnings.push("MISSING_EMAIL");
  }

  if (!resume.identity.headline) {
    warnings.push("MISSING_HEADLINE");
  }

  if (resume.profile.summary.length < 40) {
    warnings.push("MISSING_SUMMARY");
  }

  if (resume.experiences.length === 0) {
    warnings.push("NO_EXPERIENCE");
  }

  if (resume.projects.length === 0) {
    warnings.push("NO_PROJECTS");
  }

  if (resume.education.length === 0) {
    warnings.push("NO_EDUCATION");
  }

  if (resume.skills.length === 0) {
    warnings.push("NO_SKILLS");
  }

  const totalAchievements = resume.experiences.reduce(
    (total, experience) => total + experience.achievements.length,
    0,
  );

  if (resume.experiences.length > 0 && totalAchievements < resume.experiences.length) {
    warnings.push("SPARSE_ACHIEVEMENTS");
  }

  return warnings;
}

export function validateResumeData(
  candidate: unknown,
): Result<ResumeValidationOutcome, DomainError> {
  const parsed = resumeDataSchema.safeParse(candidate);

  if (!parsed.success) {
    return err(
      createResumeError("INVALID_RESUME", {
        cause: parsed.error.issues,
      }),
    );
  }

  const resume = parsed.data as ResumeData;

  if (!resume.identity.name) {
    return err(
      createResumeError("INVALID_RESUME", {
        message: "No candidate name could be identified in this document.",
      }),
    );
  }

  if (countMeaningfulSections(resume) < minimumMeaningfulSections) {
    return err(createResumeError("INVALID_RESUME"));
  }

  return ok({
    valid: true,
    resume,
    warnings: collectResumeWarnings(resume),
  });
}
