import { z } from "zod";
import {
  employmentTypeSchema,
  resumeDateRangeSchema,
  resumeLinkSchema,
  resumeLocationSchema,
  skillLevelSchema,
} from "@/modules/resume/domain/resume-schema";

export const copilotIntentSchema = z.enum([
  "profile.rewrite",
  "experience.create",
  "experience.update",
  "experience.remove",
  "experience.reorder",
  "project.create",
  "project.update",
  "project.remove",
  "project.reorder",
  "skill.add",
  "skill.remove",
  "resume.optimizeForJob",
  "resume.explainMatch",
  "resume.findWeaknesses",
  "resume.findStrengths",
  "section.optimize",
  "general",
]);

const experienceDraftSchema = z.object({
  employer: z.string().max(160),
  role: z.string().max(160),
  employmentType: employmentTypeSchema.optional(),
  location: resumeLocationSchema.optional(),
  period: resumeDateRangeSchema,
  summary: z.string().max(800).optional(),
  achievements: z.array(z.string().max(600)).max(20),
  technologies: z.array(z.string().max(80)).max(40),
});

const projectDraftSchema = z.object({
  name: z.string().max(160),
  role: z.string().max(120).optional(),
  period: resumeDateRangeSchema.optional(),
  description: z.string().max(1200),
  highlights: z.array(z.string().max(600)).max(12),
  technologies: z.array(z.string().max(80)).max(40),
  links: z.array(resumeLinkSchema).max(6),
});

export const copilotActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("profile.update"),
    summary: z.string().max(2400).optional(),
    headline: z.string().max(240).optional(),
    highlights: z.array(z.string().max(400)).max(10).optional(),
  }),
  z.object({
    type: z.literal("experience.create"),
    experience: experienceDraftSchema,
    position: z.number().int().min(0).max(50).optional(),
  }),
  z.object({
    type: z.literal("experience.update"),
    itemId: z.string().max(120),
    changes: experienceDraftSchema.partial(),
  }),
  z.object({
    type: z.literal("experience.delete"),
    itemId: z.string().max(120),
  }),
  z.object({
    type: z.literal("experience.reorder"),
    order: z.array(z.string().max(120)).max(50),
  }),
  z.object({
    type: z.literal("project.create"),
    project: projectDraftSchema,
    position: z.number().int().min(0).max(50).optional(),
  }),
  z.object({
    type: z.literal("project.update"),
    itemId: z.string().max(120),
    changes: projectDraftSchema.partial(),
  }),
  z.object({
    type: z.literal("project.delete"),
    itemId: z.string().max(120),
  }),
  z.object({
    type: z.literal("project.reorder"),
    order: z.array(z.string().max(120)).max(50),
  }),
  z.object({
    type: z.literal("skill.add"),
    groupName: z.string().max(120),
    skill: z.object({
      name: z.string().max(80),
      level: skillLevelSchema.optional(),
    }),
  }),
  z.object({
    type: z.literal("skill.remove"),
    skillName: z.string().max(80),
  }),
]);

export const copilotResponseSchema = z.object({
  kind: z.enum(["message", "question", "analysis", "action-proposal"]),
  intent: copilotIntentSchema,
  content: z.string().max(6000),
  changeSummary: z.array(z.string().max(300)).max(8).nullish(),
  estimatedImpact: z.number().min(0).max(30).nullish(),
  action: copilotActionSchema.nullish(),
});

export const copilotConversationSchema = z.object({
  kind: z.enum(["message", "question", "analysis"]),
  intent: copilotIntentSchema,
  content: z.string().max(6000),
});

export type CopilotResponsePayload = z.infer<typeof copilotResponseSchema>;
export type CopilotConversationPayload = z.infer<
  typeof copilotConversationSchema
>;
