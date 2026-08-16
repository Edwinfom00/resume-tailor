import { z } from "zod";
import type { ResumeData } from "@/@types/resume-data";

const resumeMonthSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
  z.literal(9),
  z.literal(10),
  z.literal(11),
  z.literal(12),
]);

export const employmentTypeSchema = z.enum([
  "contract",
  "freelance",
  "full-time",
  "internship",
  "part-time",
]);

export const skillLevelSchema = z.enum([
  "foundational",
  "intermediate",
  "advanced",
  "expert",
]);

export const languageProficiencySchema = z.enum([
  "native",
  "C2",
  "C1",
  "B2",
  "B1",
  "A2",
  "A1",
]);

export const resumeLinkKindSchema = z.enum([
  "website",
  "portfolio",
  "linkedin",
  "github",
  "other",
]);

export const resumeDateSchema = z.object({
  year: z.number().int().min(1900).max(2100),
  month: resumeMonthSchema.optional(),
});

export const resumeDateRangeSchema = z.object({
  start: resumeDateSchema,
  end: resumeDateSchema.optional(),
});

export const resumeLocationSchema = z.object({
  city: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  remote: z.boolean().optional(),
  remoteStatus: z.string().optional(),
});

export const resumeLinkSchema = z.object({
  kind: resumeLinkKindSchema,
  label: z.string(),
  url: z.string(),
});

export const resumeContactSchema = z.object({
  email: z.string(),
  phone: z.string().optional(),
  location: resumeLocationSchema.optional(),
  links: z.array(resumeLinkSchema),
});

export const resumeIdentitySchema = z.object({
  name: z.string(),
  headline: z.string(),
  contact: resumeContactSchema,
});

export const resumeProfileSchema = z.object({
  summary: z.string(),
  highlights: z.array(z.string()),
});

export const resumeExperienceSchema = z.object({
  id: z.string(),
  employer: z.string(),
  role: z.string(),
  employmentType: employmentTypeSchema.optional(),
  location: resumeLocationSchema.optional(),
  period: resumeDateRangeSchema,
  summary: z.string().optional(),
  achievements: z.array(z.string()),
  technologies: z.array(z.string()),
});

export const resumeProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string().optional(),
  period: resumeDateRangeSchema.optional(),
  description: z.string(),
  highlights: z.array(z.string()),
  technologies: z.array(z.string()),
  links: z.array(resumeLinkSchema),
});

export const resumeEducationSchema = z.object({
  id: z.string(),
  institution: z.string(),
  credential: z.string(),
  fieldOfStudy: z.string().optional(),
  location: resumeLocationSchema.optional(),
  period: resumeDateRangeSchema,
  highlights: z.array(z.string()),
});

export const resumeSkillSchema = z.object({
  name: z.string(),
  level: skillLevelSchema.optional(),
});

export const resumeSkillGroupSchema = z.object({
  name: z.string(),
  skills: z.array(resumeSkillSchema),
});

export const resumeLanguageSchema = z.object({
  name: z.string(),
  proficiency: languageProficiencySchema,
});

export const resumeInterestSchema = z.object({
  name: z.string(),
  details: z.array(z.string()).optional(),
});

export const resumeDataSchema = z.object({
  identity: resumeIdentitySchema,
  profile: resumeProfileSchema,
  experiences: z.array(resumeExperienceSchema),
  projects: z.array(resumeProjectSchema),
  education: z.array(resumeEducationSchema),
  skills: z.array(resumeSkillGroupSchema),
  languages: z.array(resumeLanguageSchema),
  interests: z.array(resumeInterestSchema),
});

export type ParsedResumeData = z.infer<typeof resumeDataSchema>;

export function toResumeData(parsed: ParsedResumeData): ResumeData {
  return parsed as ResumeData;
}
