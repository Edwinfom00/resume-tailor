import { NextResponse } from "next/server";
import { z } from "zod";
import { runFullAnalysis } from "@/modules/analysis/services/run-full-analysis";
import { resumeDataSchema } from "@/modules/resume/domain/resume-schema";
import type { ResumeData } from "@/@types/resume-data";
import type { JobOffer } from "@/modules/job/domain/job-offer";
import {
  createDomainError,
  toTransportError,
} from "@/modules/shared/domain/domain-error";
import {
  jobOfferDraftSchema,
  requirementCategorySchema,
  requirementPrioritySchema,
} from "@/modules/job/domain/job-schema";

export const maxDuration = 120;

const jobOfferSchema = jobOfferDraftSchema.extend({
  id: z.string(),
  source: z.enum(["url", "text"]),
  url: z.string().optional(),
  rawText: z.string(),
  extractedAt: z.string(),
  requirements: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      normalized: z.string(),
      category: requirementCategorySchema,
      priority: requirementPrioritySchema,
      evidence: z.string(),
    }),
  ),
});

const requestSchema = z.object({
  resume: resumeDataSchema,
  job: jobOfferSchema,
});

export async function POST(request: Request) {
  const payload = requestSchema.safeParse(await request.json().catch(() => null));

  if (!payload.success) {
    return NextResponse.json(
      {
        error: toTransportError(
          createDomainError(
            "INVALID_ANALYSIS_INPUT",
            "The analysis request was incomplete.",
          ),
        ),
      },
      { status: 400 },
    );
  }

  const outcome = await runFullAnalysis(
    payload.data.resume as ResumeData,
    payload.data.job as unknown as JobOffer,
  );

  return NextResponse.json({
    analysis: outcome.analysis,
    suggestions: outcome.suggestions,
  });
}
