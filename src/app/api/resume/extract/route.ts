import { NextResponse } from "next/server";
import { extractResumeFromFile } from "@/modules/resume/services/extract-resume";
import { createResumeError } from "@/modules/resume/domain/resume-errors";
import { toTransportError } from "@/modules/shared/domain/domain-error";

export const maxDuration = 60;

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: toTransportError(createResumeError("UNSUPPORTED_FILE")) },
      { status: 400 },
    );
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: toTransportError(createResumeError("UNSUPPORTED_FILE")) },
      { status: 400 },
    );
  }

  const result = await extractResumeFromFile({
    name: file.name,
    size: file.size,
    type: file.type,
    data: new Uint8Array(await file.arrayBuffer()),
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: toTransportError(result.error) },
      { status: 422 },
    );
  }

  return NextResponse.json({
    resume: result.value.resume,
    rawText: result.value.rawText,
    warnings: result.value.warnings,
    aiStructured: result.value.aiStructured,
    file: {
      name: result.value.file.name,
      mimeType: result.value.file.mimeType,
      size: result.value.file.size,
      uploadedAt: new Date().toISOString(),
    },
  });
}
