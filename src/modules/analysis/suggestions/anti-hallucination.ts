import type { ResumeData } from "@/@types/resume-data";
import type { ResumeAction } from "@/modules/resume/domain/resume-actions";
import { buildResumeEvidenceIndex } from "@/modules/resume/domain/resume-evidence";
import { canonicalizeTerm } from "@/modules/shared/taxonomy/technology-aliases";
import { matchableCompetencies } from "@/modules/shared/taxonomy/technology-vocabulary";
import { containsLooseTerm } from "@/modules/shared/text/normalize-text";

export type FactViolationKind =
  | "unsupported-metric"
  | "unsupported-technology"
  | "unsupported-employer"
  | "unsupported-credential";

export interface FactViolation {
  readonly kind: FactViolationKind;
  readonly value: string;
}

export interface FactCheckOutcome {
  readonly supported: boolean;
  readonly violations: readonly FactViolation[];
}

const metricPattern = /\b\d+(?:[.,]\d+)?\s*(?:%|percent|prozent|x|k|m|€|\$|usd|eur)\b/gi;
const standaloneNumberPattern = /\b\d{2,}\b/g;

const credentialTerms: readonly string[] = [
  "certified",
  "certification",
  "zertifiziert",
  "zertifikat",
  "certifié",
  "scrum master",
  "pmp",
  "cissp",
  "ccna",
];

function hasCredentialClaim(text: string) {
  return credentialTerms.some((term) => containsLooseTerm(text, term));
}

function collectResumeCorpus(resume: ResumeData) {
  return buildResumeEvidenceIndex(resume)
    .entries.map((entry) => entry.text)
    .join("\n");
}

function collectKnownTechnologies(resume: ResumeData) {
  return new Set(
    [
      ...resume.experiences.flatMap((experience) => experience.technologies),
      ...resume.projects.flatMap((project) => project.technologies),
      ...resume.skills.flatMap((group) =>
        group.skills.map((skill) => skill.name),
      ),
    ].map(canonicalizeTerm),
  );
}

function collectKnownEmployers(resume: ResumeData) {
  return new Set(
    [
      ...resume.experiences.map((experience) => experience.employer),
      ...resume.education.map((education) => education.institution),
      ...resume.projects.map((project) => project.name),
    ].map((value) => value.toLowerCase()),
  );
}

function findUnsupportedMetrics(text: string, corpus: string) {
  const metrics = [
    ...(text.match(metricPattern) ?? []),
    ...(text.match(standaloneNumberPattern) ?? []),
  ];

  return Array.from(new Set(metrics))
    .filter((metric) => !containsLooseTerm(corpus, metric))
    .map((metric) => ({ kind: "unsupported-metric" as const, value: metric }));
}

function findUnsupportedTechnologies(
  candidateTechnologies: readonly string[],
  vocabulary: ReadonlySet<string>,
) {
  return candidateTechnologies
    .filter(
      (technology) => !vocabulary.has(canonicalizeTerm(technology)),
    )
    .map((technology) => ({
      kind: "unsupported-technology" as const,
      value: technology,
    }));
}

function findMentionedTechnologies(text: string) {
  return matchableCompetencies.filter((technology) =>
    containsLooseTerm(text, technology),
  );
}

export function checkTextAgainstResume(
  text: string,
  resume: ResumeData,
): FactCheckOutcome {
  const corpus = collectResumeCorpus(resume);
  const resumeTechnologies = collectKnownTechnologies(resume);

  const violations = [
    ...findUnsupportedMetrics(text, corpus),
    ...findUnsupportedTechnologies(
      findMentionedTechnologies(text),
      resumeTechnologies,
    ),
    ...(hasCredentialClaim(text) && !hasCredentialClaim(corpus)
      ? [{ kind: "unsupported-credential" as const, value: "certification" }]
      : []),
  ];

  return { supported: violations.length === 0, violations };
}

export function checkRewriteAgainstResume(
  rewrittenText: string,
  resume: ResumeData,
): FactCheckOutcome {
  const corpus = collectResumeCorpus(resume);
  const violations = findUnsupportedMetrics(rewrittenText, corpus);

  return { supported: violations.length === 0, violations };
}

export function checkActionAgainstResume(
  action: ResumeAction,
  resume: ResumeData,
): FactCheckOutcome {
  const corpus = collectResumeCorpus(resume);
  const resumeTechnologies = collectKnownTechnologies(resume);
  const knownEmployers = collectKnownEmployers(resume);

  switch (action.type) {
    case "profile.update":
      return checkRewriteAgainstResume(
        [action.summary, action.headline, ...(action.highlights ?? [])]
          .filter(Boolean)
          .join("\n"),
        resume,
      );

    case "experience.update": {
      const text = [
        action.changes.summary,
        ...(action.changes.achievements ?? []),
      ]
        .filter(Boolean)
        .join("\n");

      const violations = [
        ...findUnsupportedMetrics(text, corpus),
        ...findUnsupportedTechnologies(
          action.changes.technologies ?? [],
          resumeTechnologies,
        ),
      ];

      return { supported: violations.length === 0, violations };
    }

    case "project.update": {
      const text = [
        action.changes.description,
        ...(action.changes.highlights ?? []),
      ]
        .filter(Boolean)
        .join("\n");
      const violations = [
        ...findUnsupportedMetrics(text, corpus),
        ...findUnsupportedTechnologies(
          action.changes.technologies ?? [],
          resumeTechnologies,
        ),
      ];

      return { supported: violations.length === 0, violations };
    }

    case "experience.create":
      return {
        supported: knownEmployers.has(
          action.experience.employer.toLowerCase(),
        ),
        violations: knownEmployers.has(action.experience.employer.toLowerCase())
          ? []
          : [
              {
                kind: "unsupported-employer",
                value: action.experience.employer,
              },
            ],
      };

    case "project.create":
      return {
        supported: knownEmployers.has(action.project.name.toLowerCase()),
        violations: knownEmployers.has(action.project.name.toLowerCase())
          ? []
          : [{ kind: "unsupported-employer", value: action.project.name }],
      };

    case "skill.add": {
      const supported = resumeTechnologies.has(
        canonicalizeTerm(action.skill.name),
      );

      return {
        supported,
        violations: supported
          ? []
          : [{ kind: "unsupported-technology", value: action.skill.name }],
      };
    }

    default:
      return { supported: true, violations: [] };
  }
}

export function actionRequiresUserConfirmation(
  action: ResumeAction,
  resume: ResumeData,
) {
  return !checkActionAgainstResume(action, resume).supported;
}
