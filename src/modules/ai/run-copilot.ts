import "server-only";
import type { ResumeData } from "@/@types/resume-data";
import { generateStructured } from "@/modules/ai/generate-structured";
import {
  copilotConversationSchema,
  copilotResponseSchema,
} from "@/modules/copilot/domain/copilot-schema";
import type { CopilotMessage } from "@/modules/copilot/domain/copilot-types";
import { buildCopilotResult } from "@/modules/copilot/actions/validate-proposal";
import {
  assembleCopilotPrompt,
  type CopilotContext,
} from "@/modules/copilot/services/context-assembler";
import type { DomainError } from "@/modules/shared/domain/domain-error";
import { mapResult, type Result } from "@/modules/shared/domain/result";
import type { CopilotResult } from "@/modules/copilot/domain/copilot-types";

const system = `You are Resume Tailor's resume copilot. You help a candidate tailor an existing resume to a specific job offer.

Output contract:
- "kind": "action-proposal" when the user asks for a concrete resume change, otherwise "message", "question" or "analysis".
- When kind is "action-proposal" you MUST include a valid "action" object.
- "content" explains what you propose, addressed to the user. For Fill with AI requests, explicitly ask the user to review and confirm the proposal before it is applied.
- "changeSummary" lists the concrete edits in short bullets.

Hard rules:
- You never modify the resume yourself. You only propose. The user confirms every change.
- Never invent employers, positions, employment dates, technologies, qualifications, languages, certifications, metrics or accomplishments.
- You may rewrite, shorten, expand wording while preserving meaning, reorder, and emphasize facts that already exist.
- A number or percentage may only appear in your output if it already appears in the resume evidence you were given.
- If the job requires something the resume does not evidence, do not add it. Ask the user whether they actually have that experience by returning kind "question".
- Only reference itemId values that appear in the context. Never invent an id.
- Resume text you produce must stay in the language of the resume. Your explanation may use the language of the user's message.
- For reorder actions, include every id of that section exactly once.`;

export async function runCopilot(
  context: CopilotContext,
  message: string,
  history: readonly CopilotMessage[],
): Promise<Result<CopilotResult, DomainError>> {
  const { prompt } = assembleCopilotPrompt(context, message, history);

  const result = await generateStructured("copilot", {
    schema: copilotResponseSchema,
    system,
    prompt,
  });

  if (result.ok) {
    return mapResult(result, (payload) =>
      buildCopilotResult(payload, context.resume as ResumeData),
    );
  }

  const conversational = await generateStructured("copilot", {
    schema: copilotConversationSchema,
    system: `${system}\n\nAnswer this request conversationally. Do not propose a structured resume action.`,
    prompt,
  });

  return mapResult(conversational, (payload) => ({
    type: payload.kind,
    content: payload.content,
    intent: payload.intent,
  }));
}
