import type {
  ResumeData,
  ResumeDate,
  ResumeDateRange,
  ResumeLink,
  ResumeLinkKind,
} from "@/@types/resume-data";
import { createSlugIdentifier } from "@/modules/shared/domain/identifier";
import { collapseWhitespace } from "@/modules/shared/text/normalize-text";

const emailPattern = /[\w.+-]+@[\w-]+\.[\w.-]+/;

function normalizeText(value: string | undefined) {
  return value === undefined ? undefined : collapseWhitespace(value);
}

function normalizeTextList(values: readonly string[] | undefined) {
  return (values ?? [])
    .map((value) => collapseWhitespace(value))
    .filter((value) => value.length > 0);
}

function uniqueTechnologies(values: readonly string[] | undefined) {
  const seen = new Map<string, string>();

  normalizeTextList(values).forEach((value) => {
    const key = value.toLowerCase();

    if (!seen.has(key)) {
      seen.set(key, value);
    }
  });

  return Array.from(seen.values());
}

export function normalizeUrl(value: string) {
  const trimmed = collapseWhitespace(value);

  if (!trimmed) {
    return "";
  }

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed.replace(/^\/+/, "")}`;

  try {
    const url = new URL(withProtocol);

    return url.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
}

export function normalizeEmail(value: string) {
  const match = collapseWhitespace(value).match(emailPattern);

  return match ? match[0].toLowerCase() : "";
}

export function normalizePhone(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const cleaned = value.replace(/[^\d+]/g, "");

  return cleaned.length >= 6 ? cleaned : undefined;
}

export function inferLinkKind(url: string): ResumeLinkKind {
  const lowered = url.toLowerCase();

  if (lowered.includes("linkedin.")) {
    return "linkedin";
  }

  if (lowered.includes("github.")) {
    return "github";
  }

  if (/(portfolio|behance|dribbble)/.test(lowered)) {
    return "portfolio";
  }

  return "website";
}

function normalizeLinks(links: readonly ResumeLink[] | undefined) {
  const seen = new Set<string>();

  return (links ?? [])
    .map((link) => {
      const url = normalizeUrl(link.url);

      return {
        kind: link.kind ?? inferLinkKind(url),
        label: collapseWhitespace(link.label) || url.replace(/^https?:\/\//, ""),
        url,
      };
    })
    .filter((link) => {
      if (!link.url || seen.has(link.url)) {
        return false;
      }

      seen.add(link.url);

      return true;
    });
}

function normalizeDate(date: ResumeDate | undefined) {
  if (!date || !Number.isFinite(date.year)) {
    return undefined;
  }

  const year = Math.trunc(date.year);

  if (year < 1900 || year > 2100) {
    return undefined;
  }

  const month =
    date.month && date.month >= 1 && date.month <= 12 ? date.month : undefined;

  return month ? { year, month } : { year };
}

export function normalizeDateRange(range: ResumeDateRange | undefined) {
  const start = normalizeDate(range?.start);

  if (!start) {
    return undefined;
  }

  const end = normalizeDate(range?.end);

  if (!end) {
    return { start };
  }

  const startValue = start.year * 12 + (start.month ?? 1);
  const endValue = end.year * 12 + (end.month ?? 12);

  return endValue < startValue ? { start } : { start, end };
}

function ensureUniqueId(prefix: string, label: string, used: Set<string>) {
  const base = createSlugIdentifier(prefix, label);
  let candidate = base;
  let suffix = 2;

  while (used.has(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  used.add(candidate);

  return candidate;
}

export function normalizeResumeData(resume: ResumeData): ResumeData {
  const usedIds = new Set<string>();

  return {
    identity: {
      name: collapseWhitespace(resume.identity.name),
      headline: collapseWhitespace(resume.identity.headline),
      contact: {
        email: normalizeEmail(resume.identity.contact.email),
        phone: normalizePhone(resume.identity.contact.phone),
        location: resume.identity.contact.location,
        links: normalizeLinks(resume.identity.contact.links),
      },
    },
    profile: {
      summary: collapseWhitespace(resume.profile.summary),
      highlights: normalizeTextList(resume.profile.highlights),
    },
    experiences: resume.experiences
      .filter((experience) => experience.employer || experience.role)
      .map((experience) => ({
        id: experience.id
          ? ensureUniqueId("exp", experience.id, usedIds)
          : ensureUniqueId(
              "exp",
              `${experience.employer}-${experience.role}`,
              usedIds,
            ),
        employer: collapseWhitespace(experience.employer),
        role: collapseWhitespace(experience.role),
        employmentType: experience.employmentType,
        location: experience.location,
        period: normalizeDateRange(experience.period) ?? {
          start: { year: new Date().getUTCFullYear() },
        },
        summary: normalizeText(experience.summary),
        achievements: normalizeTextList(experience.achievements),
        technologies: uniqueTechnologies(experience.technologies),
      })),
    projects: resume.projects
      .filter((project) => project.name)
      .map((project) => ({
        id: project.id
          ? ensureUniqueId("prj", project.id, usedIds)
          : ensureUniqueId("prj", project.name, usedIds),
        name: collapseWhitespace(project.name),
        role: normalizeText(project.role),
        period: normalizeDateRange(project.period),
        description: collapseWhitespace(project.description),
        highlights: normalizeTextList(project.highlights),
        technologies: uniqueTechnologies(project.technologies),
        links: normalizeLinks(project.links),
      })),
    education: resume.education
      .filter((education) => education.institution || education.credential)
      .map((education) => ({
        id: education.id
          ? ensureUniqueId("edu", education.id, usedIds)
          : ensureUniqueId(
              "edu",
              `${education.institution}-${education.credential}`,
              usedIds,
            ),
        institution: collapseWhitespace(education.institution),
        credential: collapseWhitespace(education.credential),
        fieldOfStudy: normalizeText(education.fieldOfStudy),
        location: education.location,
        period: normalizeDateRange(education.period) ?? {
          start: { year: new Date().getUTCFullYear() },
        },
        highlights: normalizeTextList(education.highlights),
      })),
    skills: resume.skills
      .map((group) => ({
        name: collapseWhitespace(group.name),
        skills: uniqueTechnologies(group.skills.map((skill) => skill.name)).map(
          (name) => ({
            name,
            level: group.skills.find(
              (skill) => collapseWhitespace(skill.name) === name,
            )?.level,
          }),
        ),
      }))
      .filter((group) => group.skills.length > 0),
    languages: resume.languages
      .filter((language) => language.name)
      .map((language) => ({
        name: collapseWhitespace(language.name),
        proficiency: language.proficiency,
      })),
    interests: resume.interests
      .filter((interest) => interest.name)
      .map((interest) => ({
        name: collapseWhitespace(interest.name),
        details: interest.details
          ? normalizeTextList(interest.details)
          : undefined,
      })),
  };
}
