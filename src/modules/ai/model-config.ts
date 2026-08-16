import "server-only";
import { createDeepSeek } from "@ai-sdk/deepseek";

export type AiTaskName =
  | "resume-structuring"
  | "job-structuring"
  | "semantic-comparison"
  | "suggestion-generation"
  | "copilot";

const defaultModelId = "deepseek-chat";

const modelIdByTask: Readonly<Record<AiTaskName, string>> = {
  "resume-structuring": defaultModelId,
  "job-structuring": defaultModelId,
  "semantic-comparison": defaultModelId,
  "suggestion-generation": defaultModelId,
  copilot: defaultModelId,
};

export const aiRequestLimits: Readonly<
  Record<AiTaskName, Readonly<{ maxOutputTokens: number; temperature: number }>>
> = {
  "resume-structuring": { maxOutputTokens: 8000, temperature: 0 },
  "job-structuring": { maxOutputTokens: 4000, temperature: 0 },
  "semantic-comparison": { maxOutputTokens: 2000, temperature: 0 },
  "suggestion-generation": { maxOutputTokens: 4000, temperature: 0.2 },
  copilot: { maxOutputTokens: 2500, temperature: 0.3 },
};

export function readApiKey() {
  return process.env.DEEPSEEK_API_KEY?.trim() ?? "";
}

export function isAiConfigured() {
  return readApiKey().length > 0;
}

export function resolveModel(task: AiTaskName) {
  const provider = createDeepSeek({ apiKey: readApiKey() });

  return provider(modelIdByTask[task]);
}
