import "server-only";
import { generateObject } from "ai";
import type { z } from "zod";
import {
  aiRequestLimits,
  isAiConfigured,
  resolveModel,
  type AiTaskName,
} from "@/modules/ai/model-config";
import {
  createDomainError,
  describeUnknownCause,
  type DomainError,
} from "@/modules/shared/domain/domain-error";
import { err, ok, type Result } from "@/modules/shared/domain/result";

export const aiUnavailableCode = "AI_UNAVAILABLE";

export function createAiUnavailableError() {
  return createDomainError(
    aiUnavailableCode,
    "AI assistance is not configured. Deterministic analysis is used instead.",
    { recoverable: true },
  );
}

function logAiFailure(task: AiTaskName, cause: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.error(`[ai:${task}]`, describeUnknownCause(cause), cause);
  }
}

export async function generateStructured<TSchema extends z.ZodType>(
  task: AiTaskName,
  options: Readonly<{
    schema: TSchema;
    system: string;
    prompt: string;
  }>,
): Promise<Result<z.infer<TSchema>, DomainError>> {
  if (!isAiConfigured()) {
    return err(createAiUnavailableError());
  }

  const limits = aiRequestLimits[task];

  try {
    const { object } = await generateObject({
      model: resolveModel(task),
      schema: options.schema,
      system: options.system,
      prompt: options.prompt,
      temperature: limits.temperature,
      maxOutputTokens: limits.maxOutputTokens,
    });

    const validated = options.schema.safeParse(object);

    if (!validated.success) {
      logAiFailure(task, validated.error);

      return err(
        createDomainError(
          "AI_INVALID_RESPONSE",
          "The AI response did not match the expected structure.",
          { recoverable: true, cause: validated.error.issues },
        ),
      );
    }

    return ok(validated.data as z.infer<TSchema>);
  } catch (cause) {
    logAiFailure(task, cause);

    return err(
      createDomainError("AI_REQUEST_FAILED", "The AI request could not be completed.", {
        recoverable: true,
        cause,
      }),
    );
  }
}
