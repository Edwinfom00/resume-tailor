import "server-only";
import { jobOfferDraftSchema } from "@/modules/job/domain/job-schema";
import { generateStructured } from "@/modules/ai/generate-structured";
import { truncateText } from "@/modules/shared/text/normalize-text";

const maximumJobPromptLength = 14000;

const system = `You structure job advertisements into JSON for a resume-matching engine.

Rules:
- Extract only what the advertisement actually states. Never invent requirements.
- Keep every label in the language of the advertisement.
- "evidence" must quote or closely paraphrase the sentence in the advertisement that states the requirement.
- Classify priority as "critical" for explicitly mandatory items, "important" for expected items, and "nice-to-have" for optional or bonus items.
- Use "technology" for concrete tools, languages, frameworks and databases; "skill" for general abilities; "responsibility" for duties; "domain" for industry knowledge.
- Prefer short, canonical labels ("PostgreSQL", not "experience with PostgreSQL databases"). Strip leading phrases such as "Erfahrung mit", "Kenntnisse in", "experience with".
- "keywords" are ATS matching terms: only skills, technologies, tools, methods, certifications or domain competencies. Never company names, locations, job titles, team names or marketing words.
- Return no more than 40 requirements, ordered from most to least important.`;

export function analyzeJobWithAi(
  rawText: string,
  hints: Readonly<{
    title?: string;
    company?: string;
    location?: string;
    employmentType?: string;
  }>,
) {
  const hintLines = Object.entries(hints)
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  return generateStructured("job-structuring", {
    schema: jobOfferDraftSchema,
    system,
    prompt: `${hintLines ? `Known metadata:\n${hintLines}\n\n` : ""}Job advertisement:\n"""\n${truncateText(rawText, maximumJobPromptLength)}\n"""`,
  });
}
