import { z } from "zod";

export const requirementPrioritySchema = z.enum([
  "critical",
  "important",
  "nice-to-have",
]);

export const requirementCategorySchema = z.enum([
  "skill",
  "technology",
  "experience",
  "education",
  "language",
  "responsibility",
  "domain",
  "soft-skill",
]);

export const jobRequirementDraftSchema = z.object({
  label: z.string().min(1).max(120),
  category: requirementCategorySchema,
  priority: requirementPrioritySchema,
  evidence: z.string().max(600),
});

export const jobOfferDraftSchema = z.object({
  title: z.string().max(160).optional(),
  company: z.string().max(160).optional(),
  location: z.string().max(160).optional(),
  employmentType: z.string().max(80).optional(),
  seniority: z.string().max(80).optional(),
  domain: z.string().max(120).optional(),
  summary: z.string().max(1200),
  responsibilities: z.array(z.string().max(400)).max(30),
  requiredSkills: z.array(z.string().max(120)).max(40),
  preferredSkills: z.array(z.string().max(120)).max(40),
  technologies: z.array(z.string().max(120)).max(60),
  keywords: z.array(z.string().max(120)).max(60),
  languages: z.array(z.string().max(80)).max(12).optional(),
  educationRequirements: z.array(z.string().max(240)).max(12).optional(),
  experienceRequirements: z.array(z.string().max(240)).max(12).optional(),
  requirements: z.array(jobRequirementDraftSchema).max(60),
});

export type JobOfferDraftPayload = z.infer<typeof jobOfferDraftSchema>;
export type JobRequirementDraft = z.infer<typeof jobRequirementDraftSchema>;
