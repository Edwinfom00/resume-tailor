import type {
  RequirementCategory,
  RequirementPriority,
} from "@/modules/job/domain/job-offer";
import type { JobOfferDraftPayload } from "@/modules/job/domain/job-schema";
import { canonicalizeTerm } from "@/modules/shared/taxonomy/technology-aliases";
import {
  matchableCompetencies,
  seniorityVocabulary,
  softSkillVocabulary,
  spokenLanguageVocabulary,
} from "@/modules/shared/taxonomy/technology-vocabulary";
import {
  collapseWhitespace,
  containsLooseTerm,
  normalizeToken,
  truncateText,
} from "@/modules/shared/text/normalize-text";

type SectionKind =
  | "responsibilities"
  | "required"
  | "preferred"
  | "benefits"
  | "education"
  | "other";

const sectionHeadings: readonly Readonly<{
  kind: SectionKind;
  patterns: readonly RegExp[];
}>[] = [
  {
    kind: "responsibilities",
    patterns: [
      /\b(responsibilities|your (tasks|role|mission)|what you('| wi)ll do|duties|aufgaben|tätigkeiten|missions|vos missions)\b/i,
    ],
  },
  {
    kind: "required",
    patterns: [
      /\b(requirements|qualifications|must[- ]have|what we (expect|require)|your profile|who you are|anforderungen|dein profil|ihr profil|qualifikationen|profil recherché|compétences requises)\b/i,
    ],
  },
  {
    kind: "preferred",
    patterns: [
      /\b(nice[- ]to[- ]have|preferred|bonus|plus|desirable|wünschenswert|von vorteil|atouts|un plus)\b/i,
    ],
  },
  {
    kind: "benefits",
    patterns: [
      /\b(we offer|benefits|perks|what we offer|wir bieten|nous offrons|avantages)\b/i,
    ],
  },
  {
    kind: "education",
    patterns: [
      /\b(education|degree|studies|ausbildung|studium|formation|diplôme)\b/i,
    ],
  },
];

const bulletPrefix = /^[\s•·◦▪—–*\-+>]+/;
const experienceYearsPattern =
  /(\d+)\s*\+?\s*(?:years?|jahre?n?|ans?)\b[^.\n]{0,60}/gi;

function detectSectionKind(line: string): SectionKind | undefined {
  if (line.length > 90) {
    return undefined;
  }

  return sectionHeadings.find((heading) =>
    heading.patterns.some((pattern) => pattern.test(line)),
  )?.kind;
}

function cleanBullet(line: string) {
  return collapseWhitespace(line.replace(bulletPrefix, ""));
}

interface SegmentedJobText {
  readonly responsibilities: readonly string[];
  readonly required: readonly string[];
  readonly preferred: readonly string[];
  readonly education: readonly string[];
}

export function segmentJobText(rawText: string): SegmentedJobText {
  const lines = rawText
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => line.trim().length > 0);

  const buckets: Record<SectionKind, string[]> = {
    responsibilities: [],
    required: [],
    preferred: [],
    benefits: [],
    education: [],
    other: [],
  };

  let currentSection: SectionKind = "other";

  lines.forEach((line) => {
    const trimmed = line.trim();
    const headingKind = detectSectionKind(trimmed);

    if (headingKind) {
      currentSection = headingKind;

      return;
    }

    const content = cleanBullet(trimmed);

    if (content.length < 12 || content.length > 400) {
      return;
    }

    if (currentSection === "benefits") {
      return;
    }

    if (currentSection === "other") {
      return;
    }

    buckets[currentSection].push(content);
  });

  return {
    responsibilities: buckets.responsibilities.slice(0, 20),
    required: buckets.required.slice(0, 25),
    preferred: buckets.preferred.slice(0, 15),
    education: buckets.education.slice(0, 8),
  };
}

export function detectTechnologies(text: string) {
  return matchableCompetencies.filter((technology) =>
    containsLooseTerm(text, technology),
  );
}

export function detectSeniority(text: string) {
  const normalized = normalizeToken(text);

  return Object.entries(seniorityVocabulary).find(([, terms]) =>
    terms.some((term) => normalized.includes(normalizeToken(term))),
  )?.[0];
}

export function detectSpokenLanguages(text: string) {
  const normalized = normalizeToken(text);

  return Object.entries(spokenLanguageVocabulary)
    .filter(([, terms]) =>
      terms.some((term) => normalized.includes(normalizeToken(term))),
    )
    .map(([language]) => language);
}

export function detectSoftSkills(text: string) {
  return softSkillVocabulary.filter((skill) => containsLooseTerm(text, skill));
}

export function detectExperienceRequirements(text: string) {
  return Array.from(new Set(text.match(experienceYearsPattern) ?? []))
    .map((match) => collapseWhitespace(match))
    .slice(0, 6);
}

function priorityForStatement(
  statement: string,
  sectionPriority: RequirementPriority,
): RequirementPriority {
  if (/\b(must|required|essential|zwingend|erforderlich|impératif|obligatoire)\b/i.test(statement)) {
    return "critical";
  }

  if (/\b(nice to have|bonus|plus|wünschenswert|von vorteil|atout)\b/i.test(statement)) {
    return "nice-to-have";
  }

  return sectionPriority;
}

interface RequirementSeed {
  readonly label: string;
  readonly category: RequirementCategory;
  readonly priority: RequirementPriority;
  readonly evidence: string;
}

function findEvidenceLine(rawText: string, term: string) {
  return (
    rawText.split("\n").find((line) => containsLooseTerm(line, term))?.trim() ??
    term
  );
}

function buildLanguageRequirements(
  rawText: string,
  segments: SegmentedJobText,
): readonly RequirementSeed[] {
  const preferredText = segments.preferred.join("\n");

  return detectSpokenLanguages(rawText).map((language) => {
    const evidence = findEvidenceLine(rawText, language);

    return {
      label: language,
      category: "language" as const,
      priority: containsLooseTerm(preferredText, language)
        ? ("nice-to-have" as const)
        : priorityForStatement(evidence, "important"),
      evidence: truncateText(evidence, 400),
    };
  });
}

function buildSoftSkillRequirements(
  rawText: string,
): readonly RequirementSeed[] {
  return detectSoftSkills(rawText).map((skill) => ({
    label: skill,
    category: "soft-skill" as const,
    priority: "nice-to-have" as const,
    evidence: truncateText(findEvidenceLine(rawText, skill), 400),
  }));
}

function buildExperienceRequirements(
  rawText: string,
): readonly RequirementSeed[] {
  return detectExperienceRequirements(rawText).map((statement) => ({
    label: truncateText(statement, 80),
    category: "experience" as const,
    priority: priorityForStatement(statement, "important"),
    evidence: truncateText(findEvidenceLine(rawText, statement), 400),
  }));
}

function buildEducationRequirements(
  segments: SegmentedJobText,
): readonly RequirementSeed[] {
  return segments.education
    .concat(
      segments.required.filter((statement) =>
        /\b(degree|bachelor|master|studium|diplôme|ausbildung)\b/i.test(
          statement,
        ),
      ),
    )
    .slice(0, 4)
    .map((statement) => ({
      label: truncateText(statement, 80),
      category: "education" as const,
      priority: priorityForStatement(statement, "important"),
      evidence: truncateText(statement, 400),
    }));
}

function buildTechnologyRequirements(
  technologies: readonly string[],
  rawText: string,
  segments: SegmentedJobText,
): readonly RequirementSeed[] {
  const requiredText = segments.required.join("\n");
  const preferredText = segments.preferred.join("\n");
  const responsibilitiesText = segments.responsibilities.join("\n");

  return technologies.map((technology) => {
    const evidenceLine = findEvidenceLine(rawText, technology);

    const priority: RequirementPriority = containsLooseTerm(
      preferredText,
      technology,
    )
      ? "nice-to-have"
      : containsLooseTerm(requiredText, technology)
        ? priorityForStatement(evidenceLine, "critical")
        : containsLooseTerm(responsibilitiesText, technology)
          ? "important"
          : "nice-to-have";

    return {
      label: technology,
      category: "technology" as const,
      priority,
      evidence: truncateText(evidenceLine, 400),
    };
  });
}

function buildSummary(rawText: string, title: string | undefined) {
  const paragraphs = rawText
    .split("\n")
    .map((line) => collapseWhitespace(line))
    .filter((line) => line.length > 60);

  return truncateText(paragraphs[0] ?? title ?? rawText, 600);
}

export function buildDeterministicJobDraft(
  rawText: string,
  hints: Readonly<{
    title?: string;
    company?: string;
    location?: string;
    employmentType?: string;
  }> = {},
): JobOfferDraftPayload {
  const segments = segmentJobText(rawText);
  const technologies = detectTechnologies(rawText);
  const preferredText = segments.preferred.join("\n");
  const preferredTechnologies = new Set(detectTechnologies(preferredText));
  const requiredSkills = technologies.filter(
    (technology) => !preferredTechnologies.has(technology),
  );

  const requirements: readonly RequirementSeed[] = [
    ...buildTechnologyRequirements(technologies, rawText, segments),
    ...buildExperienceRequirements(rawText),
    ...buildEducationRequirements(segments),
    ...buildLanguageRequirements(rawText, segments),
    ...buildSoftSkillRequirements(rawText),
  ];

  const deduplicated = new Map<string, (typeof requirements)[number]>();

  requirements.forEach((requirement) => {
    const key = canonicalizeTerm(requirement.label);

    if (!deduplicated.has(key)) {
      deduplicated.set(key, requirement);
    }
  });

  return {
    title: hints.title ? truncateText(hints.title, 160) : undefined,
    company: hints.company ? truncateText(hints.company, 160) : undefined,
    location: hints.location ? truncateText(hints.location, 160) : undefined,
    employmentType: hints.employmentType,
    seniority: detectSeniority(`${hints.title ?? ""}\n${rawText}`),
    domain: undefined,
    summary: buildSummary(rawText, hints.title),
    responsibilities: segments.responsibilities.map((item) =>
      truncateText(item, 400),
    ),
    requiredSkills: requiredSkills.slice(0, 40),
    preferredSkills: Array.from(preferredTechnologies).slice(0, 40),
    technologies: technologies.slice(0, 60),
    keywords: Array.from(
      new Set([...technologies, ...detectSoftSkills(rawText)]),
    ).slice(0, 60),
    languages: detectSpokenLanguages(rawText),
    educationRequirements: segments.education.map((item) =>
      truncateText(item, 240),
    ),
    experienceRequirements: detectExperienceRequirements(rawText),
    requirements: Array.from(deduplicated.values()).slice(0, 60),
  };
}
