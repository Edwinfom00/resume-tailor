import "server-only";
import { z } from "zod";
import {
  employmentTypeSchema,
  languageProficiencySchema,
  resumeDateRangeSchema,
  resumeLinkKindSchema,
  resumeLocationSchema,
  skillLevelSchema,
} from "@/modules/resume/domain/resume-schema";
import { generateStructured } from "@/modules/ai/generate-structured";
import { truncateText } from "@/modules/shared/text/normalize-text";

const maximumResumePromptLength = 24000;

export const resumeExtractionSchema = z.object({
  identity: z.object({
    name: z.string().max(160),
    headline: z.string().max(240),
    contact: z.object({
      email: z.string().max(160),
      phone: z.string().max(60).optional(),
      location: resumeLocationSchema.optional(),
      links: z
        .array(
          z.object({
            kind: resumeLinkKindSchema,
            label: z.string().max(120),
            url: z.string().max(400),
          }),
        )
        .max(10),
    }),
  }),
  profile: z.object({
    summary: z.string().max(2400),
    highlights: z.array(z.string().max(400)).max(10),
  }),
  experiences: z
    .array(
      z.object({
        employer: z.string().max(160),
        role: z.string().max(160),
        employmentType: employmentTypeSchema.optional(),
        location: resumeLocationSchema.optional(),
        period: resumeDateRangeSchema,
        summary: z.string().max(800).optional(),
        achievements: z.array(z.string().max(600)).max(20),
        technologies: z.array(z.string().max(80)).max(40),
      }),
    )
    .max(20),
  projects: z
    .array(
      z.object({
        name: z.string().max(160),
        role: z.string().max(120).optional(),
        period: resumeDateRangeSchema.optional(),
        description: z.string().max(1200),
        highlights: z.array(z.string().max(600)).max(12),
        technologies: z.array(z.string().max(80)).max(40),
        links: z
          .array(
            z.object({
              kind: resumeLinkKindSchema,
              label: z.string().max(120),
              url: z.string().max(400),
            }),
          )
          .max(6),
      }),
    )
    .max(20),
  education: z
    .array(
      z.object({
        institution: z.string().max(200),
        credential: z.string().max(200),
        fieldOfStudy: z.string().max(160).optional(),
        location: resumeLocationSchema.optional(),
        period: resumeDateRangeSchema,
        highlights: z.array(z.string().max(400)).max(8),
      }),
    )
    .max(12),
  skills: z
    .array(
      z.object({
        name: z.string().max(120),
        skills: z
          .array(
            z.object({
              name: z.string().max(80),
              level: skillLevelSchema.optional(),
            }),
          )
          .max(40),
      }),
    )
    .max(12),
  languages: z
    .array(
      z.object({
        name: z.string().max(80),
        proficiency: languageProficiencySchema,
      }),
    )
    .max(10),
  interests: z
    .array(
      z.object({
        name: z.string().max(120),
        details: z.array(z.string().max(200)).max(6).optional(),
      }),
    )
    .max(10),
});

export type ResumeExtractionPayload = z.infer<typeof resumeExtractionSchema>;

const system = `You convert raw resume text into structured JSON.

Absolute rules:
- Extract only information that is literally present in the text.
- Never invent an employer, position, date, technology, metric, qualification, certification or language.
- If a field is absent, omit it or use an empty array. Never guess.
- Preserve the original language of the resume in every text field. Do not translate.
- Keep achievement bullets close to the original wording; do not embellish them.
- Preserve URLs, email addresses and phone numbers exactly as written.
- Dates: use the four-digit year and the numeric month when both appear. Omit "end" for ongoing roles.
- Group skills under the headings used in the document when they exist.
- Language proficiency must be one of: native, C2, C1, B2, B1, A2, A1. Map descriptive levels to the closest value; when the document gives no level, use B2 only if it clearly claims professional fluency, otherwise omit the language.`;

export function structureResumeWithAi(rawText: string) {
  return generateStructured("resume-structuring", {
    schema: resumeExtractionSchema,
    system,
    prompt: `Resume text:\n"""\n${truncateText(rawText, maximumResumePromptLength)}\n"""`,
  });
}
