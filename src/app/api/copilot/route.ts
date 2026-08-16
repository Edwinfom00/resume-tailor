import { NextResponse } from "next/server";
import { z } from "zod";
import { runCopilot } from "@/modules/ai/run-copilot";
import { resumeDataSchema } from "@/modules/resume/domain/resume-schema";
import type { ResumeData } from "@/@types/resume-data";
import type { JobOffer } from "@/modules/job/domain/job-offer";
import type { ResumeJobAnalysis } from "@/modules/analysis/domain/analysis-types";
import type { ResumeSuggestion } from "@/modules/analysis/domain/suggestion-types";
import { toTransportError } from "@/modules/shared/domain/domain-error";
import {
  createDomainError,
} from "@/modules/shared/domain/domain-error";

export const maxDuration = 60;

const requestSchema = z.object({
  resume: resumeDataSchema,
  job: z.unknown().optional(),
  analysis: z.unknown().optional(),
  pendingSuggestions: z.array(z.unknown()).max(20).default([]),
  message: z.string().min(1).max(4000),
  fillSection: z
    .enum(["profile", "experience", "projects", "skills"])
    .optional(),
  history: z
    .array(
      z.object({
        id: z.string(),
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().max(4000),
        createdAt: z.string(),
      }),
    )
    .max(20)
    .default([]),
});

export async function POST(request: Request) {
  const payload = requestSchema.safeParse(await request.json().catch(() => null));

  if (!payload.success) {
    return NextResponse.json(
      {
        error: toTransportError(
          createDomainError(
            "INVALID_COPILOT_REQUEST",
            "The copilot request was incomplete.",
          ),
        ),
      },
      { status: 400 },
    );
  }

  const result = await runCopilot(
    {
      resume: payload.data.resume as ResumeData,
      job: payload.data.job as JobOffer | undefined,
      analysis: payload.data.analysis as ResumeJobAnalysis | undefined,
      pendingSuggestions: payload.data
        .pendingSuggestions as readonly ResumeSuggestion[],
      fillSection: payload.data.fillSection,
    },
    payload.data.message,
    payload.data.history,
  );

  if (!result.ok) {
    return NextResponse.json(
      { error: toTransportError(result.error) },
      { status: 422 },
    );
  }

  return NextResponse.json({ result: result.value });
}
