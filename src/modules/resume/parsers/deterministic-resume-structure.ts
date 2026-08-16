import type {
  ResumeData,
  ResumeDate,
  ResumeDateRange,
  ResumeLink,
  ResumeMonth,
} from "@/@types/resume-data";
import type { ExtractedDocument } from "@/modules/resume/parsers/document-text";
import {
  inferLinkKind,
  normalizeUrl,
} from "@/modules/resume/normalization/normalize-resume";
import { createSlugIdentifier } from "@/modules/shared/domain/identifier";
import { detectTechnologies } from "@/modules/job/normalization/deterministic-job-structure";
import { collapseWhitespace } from "@/modules/shared/text/normalize-text";

type ResumeSectionKind =
  | "profile"
  | "experience"
  | "projects"
  | "education"
  | "skills"
  | "languages"
  | "interests";

const sectionPatterns: readonly Readonly<{
  kind: ResumeSectionKind;
  pattern: RegExp;
}>[] = [
  {
    kind: "profile",
    pattern:
      /^(profile|summary|about( me)?|professional summary|profil|zusammenfassung|über mich|à propos|résumé)\b/i,
  },
  {
    kind: "experience",
    pattern:
      /^(experience|work experience|professional experience|employment|berufserfahrung|erfahrung|expérience(s)? professionnelle(s)?|expériences?)\b/i,
  },
  {
    kind: "projects",
    pattern: /^(projects?|selected projects|projekte|projets?)\b/i,
  },
  {
    kind: "education",
    pattern:
      /^(education|academic|studies|ausbildung|studium|bildung|formation|études)\b/i,
  },
  {
    kind: "skills",
    pattern:
      /^(skills|technical skills|technologies|kenntnisse|fähigkeiten|kompetenzen|compétences|technologies)\b/i,
  },
  {
    kind: "languages",
    pattern: /^(languages?|sprachen|langues)\b/i,
  },
  {
    kind: "interests",
    pattern: /^(interests?|hobbies|interessen|hobbys|centres d'intérêt|loisirs)\b/i,
  },
];

const bulletPrefix = /^[\s•·◦▪—–*\-+>]+/;

const monthNames: Readonly<Record<string, number>> = {
  jan: 1, january: 1, januar: 1, janvier: 1,
  feb: 2, february: 2, februar: 2, "février": 2, fevrier: 2,
  mar: 3, march: 3, "märz": 3, marz: 3, mars: 3,
  apr: 4, april: 4, avril: 4,
  may: 5, mai: 5,
  jun: 6, june: 6, juni: 6, juin: 6,
  jul: 7, july: 7, juli: 7, juillet: 7,
  aug: 8, august: 8, "août": 8, aout: 8,
  sep: 9, sept: 9, september: 9, septembre: 9,
  oct: 10, october: 10, oktober: 10, octobre: 10,
  nov: 11, november: 11, novembre: 11,
  dec: 12, december: 12, dezember: 12, "décembre": 12, decembre: 12,
};

function toResumeMonth(value: number | undefined) {
  return value !== undefined && value >= 1 && value <= 12
    ? (value as ResumeMonth)
    : undefined;
}

function parseMonthToken(token: string) {
  const key = token.toLowerCase().replace(/\.$/, "");

  return toResumeMonth(monthNames[key]);
}

function parseDateToken(token: string): ResumeDate | undefined {
  const numericMatch = token.match(/(\d{1,2})[./-](\d{4})/);

  if (numericMatch) {
    return {
      year: Number.parseInt(numericMatch[2], 10),
      month: toResumeMonth(Number.parseInt(numericMatch[1], 10)),
    };
  }

  const namedMatch = token.match(/([a-zäöüéûà]+)\.?\s+(\d{4})/i);

  if (namedMatch) {
    return {
      year: Number.parseInt(namedMatch[2], 10),
      month: parseMonthToken(namedMatch[1]),
    };
  }

  const yearMatch = token.match(/\b(19|20)\d{2}\b/);

  return yearMatch
    ? { year: Number.parseInt(yearMatch[0], 10), month: undefined }
    : undefined;
}

function parsePeriod(line: string): ResumeDateRange | undefined {
  const rangeMatch = line.match(
    /((?:[a-zäöüéûà]+\.?\s+)?(?:\d{1,2}[./-])?(?:19|20)\d{2})\s*[–—\-]{1,2}\s*((?:[a-zäöüéûà]+\.?\s+)?(?:\d{1,2}[./-])?(?:19|20)\d{2}|present|heute|aktuell|current|now|aujourd'hui|ongoing)/i,
  );

  if (!rangeMatch) {
    const single = parseDateToken(line);

    return single ? { start: single } : undefined;
  }

  const start = parseDateToken(rangeMatch[1]);

  if (!start) {
    return undefined;
  }

  const isOngoing = /present|heute|aktuell|current|now|aujourd'hui|ongoing/i.test(
    rangeMatch[2],
  );
  const end = isOngoing ? undefined : parseDateToken(rangeMatch[2]);

  return end ? { start, end } : { start };
}

function detectSectionKind(line: string): ResumeSectionKind | undefined {
  const trimmed = line.trim();

  if (trimmed.length > 48 || trimmed.length < 3) {
    return undefined;
  }

  const withoutTrailing = trimmed.replace(/[:：]\s*$/, "");

  return sectionPatterns.find((section) => section.pattern.test(withoutTrailing))
    ?.kind;
}

function splitIntoSections(lines: readonly string[]) {
  const sections = new Map<ResumeSectionKind, string[]>();
  const header: string[] = [];
  let current: ResumeSectionKind | undefined;

  lines.forEach((line) => {
    const kind = detectSectionKind(line);

    if (kind) {
      current = kind;

      if (!sections.has(kind)) {
        sections.set(kind, []);
      }

      return;
    }

    if (current) {
      sections.get(current)?.push(line);
    } else {
      header.push(line);
    }
  });

  return { header, sections };
}

function isLikelyName(line: string) {
  const words = line.trim().split(/\s+/);

  return (
    words.length >= 2 &&
    words.length <= 5 &&
    line.length <= 60 &&
    !/\d|@|http/.test(line) &&
    words.every((word) => /^[\p{Lu}]/u.test(word) || word.length <= 3)
  );
}

function buildLinks(urls: readonly string[]): readonly ResumeLink[] {
  const seen = new Set<string>();

  return urls
    .map((rawUrl) => {
      const url = normalizeUrl(rawUrl);

      return {
        kind: inferLinkKind(url),
        label: url.replace(/^https?:\/\//, "").replace(/\/$/, ""),
        url,
      };
    })
    .filter((link) => {
      if (!link.url || seen.has(link.url)) {
        return false;
      }

      seen.add(link.url);

      return true;
    })
    .slice(0, 8);
}

interface ParsedEntry {
  readonly heading: string;
  readonly period?: ResumeDateRange;
  readonly body: string[];
}

function parseEntries(lines: readonly string[]) {
  const entries: ParsedEntry[] = [];

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      return;
    }

    const isBullet = bulletPrefix.test(line);
    const period = parsePeriod(trimmed);

    if (!isBullet && (period || entries.length === 0) && trimmed.length < 160) {
      entries.push({ heading: trimmed, period, body: [] });

      return;
    }

    const target = entries[entries.length - 1];

    if (target) {
      target.body.push(collapseWhitespace(trimmed.replace(bulletPrefix, "")));
    }
  });

  return entries.filter((entry) => entry.heading.length > 2);
}

function splitHeading(heading: string) {
  const withoutPeriod = heading
    .replace(
      /((?:[a-zäöüéûà]+\.?\s+)?(?:\d{1,2}[./-])?(?:19|20)\d{2})\s*[–—\-]{1,2}\s*(?:(?:[a-zäöüéûà]+\.?\s+)?(?:\d{1,2}[./-])?(?:19|20)\d{2}|present|heute|aktuell|current|now|aujourd'hui|ongoing)/i,
      "",
    )
    .replace(/\s*[|,]\s*$/, "")
    .trim();

  const parts = withoutPeriod
    .split(/\s+[|–—]\s+|\s+[-]\s+|\s*,\s*/)
    .map((part) => collapseWhitespace(part))
    .filter((part) => part.length > 1);

  return {
    primary: parts[0] ?? collapseWhitespace(withoutPeriod),
    secondary: parts[1],
  };
}

function parseSkillLines(lines: readonly string[]) {
  return lines
    .map((line) => collapseWhitespace(line.replace(bulletPrefix, "")))
    .filter((line) => line.length > 1)
    .map((line) => {
      const [rawName, rawValues] = line.split(/\s*[:：]\s*/, 2);

      if (rawValues) {
        return {
          name: collapseWhitespace(rawName),
          skills: rawValues
            .split(/\s*[,;•·|]\s*/)
            .map((value) => collapseWhitespace(value))
            .filter(Boolean)
            .map((name) => ({ name })),
        };
      }

      return {
        name: "Skills",
        skills: line
          .split(/\s*[,;•·|]\s*/)
          .map((value) => collapseWhitespace(value))
          .filter(Boolean)
          .map((name) => ({ name })),
      };
    })
    .filter((group) => group.skills.length > 0);
}

function parseLanguageLines(lines: readonly string[]) {
  const proficiencyPattern = /\b(native|muttersprache|langue maternelle|C2|C1|B2|B1|A2|A1)\b/i;

  return lines
    .flatMap((line) =>
      collapseWhitespace(line.replace(bulletPrefix, "")).split(/\s*[,;|]\s*/),
    )
    .map((entry) => collapseWhitespace(entry))
    .filter((entry) => entry.length > 1 && entry.length < 60)
    .map((entry) => {
      const match = entry.match(proficiencyPattern);
      const name = collapseWhitespace(
        entry.replace(proficiencyPattern, "").replace(/[():-]/g, ""),
      );

      if (!name || !match) {
        return undefined;
      }

      const raw = match[1].toLowerCase();
      const proficiency = /native|muttersprache|maternelle/.test(raw)
        ? ("native" as const)
        : (match[1].toUpperCase() as "C2" | "C1" | "B2" | "B1" | "A2" | "A1");

      return { name, proficiency };
    })
    .filter(
      (language): language is { name: string; proficiency: "native" | "C2" | "C1" | "B2" | "B1" | "A2" | "A1" } =>
        language !== undefined,
    )
    .slice(0, 10);
}

export function buildDeterministicResumeDraft(
  document: ExtractedDocument,
): ResumeData {
  const lines = document.text.split("\n").filter((line) => line.trim().length > 0);
  const { header, sections } = splitIntoSections(lines);
  const usedIds = new Set<string>();

  const nameLine = header.find(isLikelyName) ?? header[0] ?? "";
  const headlineLine =
    header.find(
      (line) =>
        line !== nameLine &&
        line.length > 8 &&
        line.length < 120 &&
        !/@|http|\+\d/.test(line),
    ) ?? "";

  const profileLines = sections.get("profile") ?? [];
  const summary = collapseWhitespace(profileLines.join(" "));

  const experienceEntries = parseEntries(sections.get("experience") ?? []);
  const projectEntries = parseEntries(sections.get("projects") ?? []);
  const educationEntries = parseEntries(sections.get("education") ?? []);

  const makeId = (prefix: string, label: string) => {
    const base = createSlugIdentifier(prefix, label);
    let candidate = base;
    let suffix = 2;

    while (usedIds.has(candidate)) {
      candidate = `${base}-${suffix}`;
      suffix += 1;
    }

    usedIds.add(candidate);

    return candidate;
  };

  const currentYear = new Date().getUTCFullYear();

  return {
    identity: {
      name: collapseWhitespace(nameLine),
      headline: collapseWhitespace(headlineLine),
      contact: {
        email: document.emails[0] ?? "",
        phone: document.phones[0],
        links: buildLinks(document.urls),
      },
    },
    profile: {
      summary,
      highlights: [],
    },
    experiences: experienceEntries.map((entry) => {
      const { primary, secondary } = splitHeading(entry.heading);
      const body = entry.body.join("\n");

      return {
        id: makeId("exp", primary),
        employer: secondary ?? primary,
        role: secondary ? primary : "",
        period: entry.period ?? { start: { year: currentYear } },
        achievements: entry.body.filter((line) => line.length > 12),
        technologies: detectTechnologies(`${entry.heading}\n${body}`),
      };
    }),
    projects: projectEntries.map((entry) => {
      const { primary } = splitHeading(entry.heading);
      const body = entry.body.join("\n");

      return {
        id: makeId("prj", primary),
        name: primary,
        period: entry.period,
        description: collapseWhitespace(entry.body[0] ?? ""),
        highlights: entry.body.slice(1).filter((line) => line.length > 12),
        technologies: detectTechnologies(`${entry.heading}\n${body}`),
        links: [],
      };
    }),
    education: educationEntries.map((entry) => {
      const { primary, secondary } = splitHeading(entry.heading);

      return {
        id: makeId("edu", primary),
        institution: secondary ?? primary,
        credential: secondary ? primary : "",
        period: entry.period ?? { start: { year: currentYear } },
        highlights: entry.body.filter((line) => line.length > 12),
      };
    }),
    skills: parseSkillLines(sections.get("skills") ?? []),
    languages: parseLanguageLines(sections.get("languages") ?? []),
    interests: (sections.get("interests") ?? [])
      .map((line) => collapseWhitespace(line.replace(bulletPrefix, "")))
      .filter((line) => line.length > 1 && line.length < 120)
      .slice(0, 8)
      .map((name) => ({ name })),
  };
}
