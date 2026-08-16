import { normalizeToken } from "@/modules/shared/text/normalize-text";

const jobSignalTerms: readonly string[] = [
  "responsibilities",
  "requirements",
  "qualifications",
  "what you will do",
  "what you'll do",
  "your profile",
  "your tasks",
  "we offer",
  "benefits",
  "experience with",
  "years of experience",
  "job description",
  "about the role",
  "who you are",
  "nice to have",
  "must have",
  "apply now",
  "full-time",
  "part-time",
  "aufgaben",
  "anforderungen",
  "qualifikationen",
  "dein profil",
  "ihr profil",
  "wir bieten",
  "berufserfahrung",
  "stellenbeschreibung",
  "missions",
  "profil recherche",
  "competences",
  "vous serez",
  "nous offrons",
  "experience requise",
];

const blockedPageSignals: readonly string[] = [
  "enable javascript",
  "captcha",
  "are you a robot",
  "access denied",
  "verify you are human",
  "cloudflare",
  "unusual traffic",
  "request blocked",
];

export const minimumJobTextLength = 220;

export interface JobContentAssessment {
  readonly likelyJobContent: boolean;
  readonly blocked: boolean;
  readonly signalCount: number;
}

export function assessJobContent(text: string): JobContentAssessment {
  const normalized = normalizeToken(text);
  const blocked =
    text.length < minimumJobTextLength &&
    blockedPageSignals.some((signal) => normalized.includes(signal));

  const signalCount = jobSignalTerms.filter((term) =>
    normalized.includes(normalizeToken(term)),
  ).length;

  return {
    blocked,
    signalCount,
    likelyJobContent: text.length >= minimumJobTextLength && signalCount >= 2,
  };
}
