import { NextResponse } from "next/server";
import { z } from "zod";
import { createJobError } from "@/modules/job/domain/job-errors";
import {
  extractJobFromText,
  extractJobFromUrl,
} from "@/modules/job/services/extract-job";
import { toTransportError } from "@/modules/shared/domain/domain-error";

export const maxDuration = 60;

const requestSchema = z.union([
  z.object({ source: z.literal("url"), url: z.string().min(1).max(2000) }),
  z.object({
    source: z.literal("text"),
    description: z.string().min(1).max(20000),
  }),
]);

export async function POST(request: Request) {
  const payload = requestSchema.safeParse(await request.json().catch(() => null));

  if (!payload.success) {
    return NextResponse.json(
      { error: toTransportError(createJobError("EMPTY_DESCRIPTION")) },
      { status: 400 },
    );
  }

  const result =
    payload.data.source === "url"
      ? await extractJobFromUrl(payload.data.url)
      : await extractJobFromText(payload.data.description);

  if (!result.ok) {
    return NextResponse.json(
      { error: toTransportError(result.error) },
      { status: 422 },
    );
  }

  return NextResponse.json({ job: result.value });
}
