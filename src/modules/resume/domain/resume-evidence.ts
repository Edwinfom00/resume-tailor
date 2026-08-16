import type { ResumeData } from "@/@types/resume-data";

export type ResumeEvidenceSection =
  | "profile"
  | "experience"
  | "project"
  | "skills"
  | "education"
  | "languages";

export interface ResumeEvidence {
  readonly section: ResumeEvidenceSection;
  readonly itemId?: string;
  readonly field?: string;
  readonly text: string;
}

export interface ResumeEvidenceIndex {
  readonly entries: readonly ResumeEvidence[];
  readonly byItemId: ReadonlyMap<string, readonly ResumeEvidence[]>;
}

function experienceEvidence(resume: ResumeData): ResumeEvidence[] {
  return resume.experiences.flatMap((experience) => [
    {
      section: "experience" as const,
      itemId: experience.id,
      field: "role",
      text: `${experience.role} — ${experience.employer}`,
    },
    ...(experience.summary
      ? [
          {
            section: "experience" as const,
            itemId: experience.id,
            field: "summary",
            text: experience.summary,
          },
        ]
      : []),
    ...experience.achievements.map((achievement, index) => ({
      section: "experience" as const,
      itemId: experience.id,
      field: `achievements[${index}]`,
      text: achievement,
    })),
    ...experience.technologies.map((technology) => ({
      section: "experience" as const,
      itemId: experience.id,
      field: "technologies",
      text: technology,
    })),
  ]);
}

function projectEvidence(resume: ResumeData): ResumeEvidence[] {
  return resume.projects.flatMap((project) => [
    {
      section: "project" as const,
      itemId: project.id,
      field: "name",
      text: project.role ? `${project.name} — ${project.role}` : project.name,
    },
    {
      section: "project" as const,
      itemId: project.id,
      field: "description",
      text: project.description,
    },
    ...project.highlights.map((highlight, index) => ({
      section: "project" as const,
      itemId: project.id,
      field: `highlights[${index}]`,
      text: highlight,
    })),
    ...project.technologies.map((technology) => ({
      section: "project" as const,
      itemId: project.id,
      field: "technologies",
      text: technology,
    })),
  ]);
}

function skillEvidence(resume: ResumeData): ResumeEvidence[] {
  return resume.skills.flatMap((group) =>
    group.skills.map((skill) => ({
      section: "skills" as const,
      field: group.name,
      text: skill.name,
    })),
  );
}

function educationEvidence(resume: ResumeData): ResumeEvidence[] {
  return resume.education.flatMap((education) => [
    {
      section: "education" as const,
      itemId: education.id,
      field: "credential",
      text: [education.credential, education.fieldOfStudy, education.institution]
        .filter(Boolean)
        .join(" — "),
    },
    ...education.highlights.map((highlight, index) => ({
      section: "education" as const,
      itemId: education.id,
      field: `highlights[${index}]`,
      text: highlight,
    })),
  ]);
}

function profileEvidence(resume: ResumeData): ResumeEvidence[] {
  return [
    {
      section: "profile" as const,
      field: "headline",
      text: resume.identity.headline,
    },
    { section: "profile" as const, field: "summary", text: resume.profile.summary },
    ...resume.profile.highlights.map((highlight, index) => ({
      section: "profile" as const,
      field: `highlights[${index}]`,
      text: highlight,
    })),
  ];
}

function languageEvidence(resume: ResumeData): ResumeEvidence[] {
  return resume.languages.map((language) => ({
    section: "languages" as const,
    field: "proficiency",
    text: `${language.name} (${language.proficiency})`,
  }));
}

export function buildResumeEvidenceIndex(
  resume: ResumeData,
): ResumeEvidenceIndex {
  const entries = [
    ...profileEvidence(resume),
    ...experienceEvidence(resume),
    ...projectEvidence(resume),
    ...skillEvidence(resume),
    ...educationEvidence(resume),
    ...languageEvidence(resume),
  ].filter((entry) => entry.text.trim().length > 0);

  const byItemId = new Map<string, ResumeEvidence[]>();

  entries.forEach((entry) => {
    if (!entry.itemId) {
      return;
    }

    const existing = byItemId.get(entry.itemId);

    if (existing) {
      existing.push(entry);
    } else {
      byItemId.set(entry.itemId, [entry]);
    }
  });

  return { entries, byItemId };
}

export function resumeEvidenceKey(evidence: ResumeEvidence) {
  return `${evidence.section}:${evidence.itemId ?? "-"}:${evidence.field ?? "-"}:${evidence.text}`;
}

export function collectResumeItemIds(resume: ResumeData): ReadonlySet<string> {
  return new Set([
    ...resume.experiences.map((experience) => experience.id),
    ...resume.projects.map((project) => project.id),
    ...resume.education.map((education) => education.id),
  ]);
}
