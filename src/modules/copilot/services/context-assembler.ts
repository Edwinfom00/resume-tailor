import type { ResumeData } from "@/@types/resume-data";
import type { JobOffer } from "@/modules/job/domain/job-offer";
import type { ResumeJobAnalysis } from "@/modules/analysis/domain/analysis-types";
import type { ResumeSuggestion } from "@/modules/analysis/domain/suggestion-types";
import type {
  CopilotIntent,
  CopilotMessage,
} from "@/modules/copilot/domain/copilot-types";
import type { ResumeSectionId } from "@/modules/session/domain/resume-selection";
import { containsLooseTerm, truncateText } from "@/modules/shared/text/normalize-text";
import { overlapRatio } from "@/modules/shared/text/similarity";

export interface CopilotContext {
  readonly resume: ResumeData;
  readonly job?: JobOffer;
  readonly analysis?: ResumeJobAnalysis;
  readonly fillSection?: ResumeSectionId;
  readonly pendingSuggestions: readonly ResumeSuggestion[];
}

const recentMessageCount = 8;

const intentPatterns: readonly Readonly<{
  intent: CopilotIntent;
  patterns: readonly RegExp[];
}>[] = [
  {
    intent: "profile.rewrite",
    patterns: [
      /\b(profile|summary|about me|profil|zusammenfassung|résumé personnel)\b/i,
    ],
  },
  {
    intent: "experience.create",
    patterns: [
      /\b(add|create|ajoute[rz]?|füge?\s+hinzu|hinzufügen)\b[^.]{0,40}\b(experience|position|role|job|erfahrung|stelle|expérience|poste)\b/i,
    ],
  },
  {
    intent: "experience.reorder",
    patterns: [
      /\b(reorder|reorganize|sort|order|réorganise[rz]?|ordre|sortier|reihenfolge)\b[^.]{0,40}\b(experiences?|erfahrungen?|expériences?)\b/i,
    ],
  },
  {
    intent: "experience.update",
    patterns: [
      /\b(improve|rewrite|update|edit|améliore[rz]?|verbessere?|überarbeite)\b[^.]{0,40}\b(experience|role|position|erfahrung|expérience)\b/i,
    ],
  },
  {
    intent: "project.reorder",
    patterns: [
      /\b(reorder|reorganize|sort|order|réorganise[rz]?|ordre|sortier|reihenfolge)\b[^.]{0,40}\b(projects?|projekte?|projets?)\b/i,
    ],
  },
  {
    intent: "project.create",
    patterns: [
      /\b(add|create|ajoute[rz]?|füge?\s+hinzu)\b[^.]{0,40}\b(project|projekt|projet)\b/i,
    ],
  },
  {
    intent: "project.update",
    patterns: [/\b(improve|rewrite|update|project|projekt|projet)\b/i],
  },
  {
    intent: "skill.add",
    patterns: [
      /\b(add|ajoute[rz]?|füge?\s+hinzu)\b[^.]{0,40}\b(skills?|kenntnisse|fähigkeiten|compétences?)\b/i,
    ],
  },
  {
    intent: "skill.remove",
    patterns: [
      /\b(remove|delete|supprime[rz]?|entferne?)\b[^.]{0,40}\b(skills?|kenntnisse|compétences?)\b/i,
    ],
  },
  {
    intent: "resume.optimizeForJob",
    patterns: [
      /\b(optimi[sz]e|tailor|adapt|optimiere?|optimise[rz]?|adapte[rz]?)\b[^.]{0,40}\b(job|offer|position|stelle|offre|poste|cv|resume|lebenslauf)\b/i,
    ],
  },
  {
    intent: "resume.explainMatch",
    patterns: [
      /\b(why|explain|match|score|warum|erkläre?|pourquoi|explique[rz]?|correspondance)\b/i,
    ],
  },
  {
    intent: "resume.findWeaknesses",
    patterns: [
      /\b(weakness|gap|missing|weak|schwäche|lücke|fehlt|faiblesse|manque)\b/i,
    ],
  },
  {
    intent: "resume.findStrengths",
    patterns: [/\b(strength|strong|stärke|force|point fort)\b/i],
  },
  {
    intent: "section.optimize",
    patterns: [/\b(section|abschnitt|rubrique)\b/i],
  },
];

export function detectIntent(message: string): CopilotIntent {
  return (
    intentPatterns.find((entry) =>
      entry.patterns.some((pattern) => pattern.test(message)),
    )?.intent ?? "general"
  );
}

function findReferencedExperienceIds(message: string, resume: ResumeData) {
  return resume.experiences
    .filter(
      (experience) =>
        containsLooseTerm(message, experience.employer) ||
        containsLooseTerm(message, experience.role),
    )
    .map((experience) => experience.id);
}

function findReferencedProjectIds(message: string, resume: ResumeData) {
  return resume.projects
    .filter(
      (project) =>
        containsLooseTerm(message, project.name) ||
        overlapRatio(project.name, message) > 0.6,
    )
    .map((project) => project.id);
}

function formatExperience(
  resume: ResumeData,
  itemIds: readonly string[],
  limit: number,
) {
  const selected = itemIds.length
    ? resume.experiences.filter((experience) => itemIds.includes(experience.id))
    : resume.experiences.slice(0, limit);

  return selected
    .map((experience) =>
      [
        `id: ${experience.id}`,
        `employer: ${experience.employer}`,
        `role: ${experience.role}`,
        `period: ${experience.period.start.year}${experience.period.end ? `–${experience.period.end.year}` : "–present"}`,
        `technologies: ${experience.technologies.join(", ")}`,
        `achievements:\n${experience.achievements.map((item) => `  - ${item}`).join("\n")}`,
      ].join("\n"),
    )
    .join("\n---\n");
}

function formatProjects(
  resume: ResumeData,
  itemIds: readonly string[],
  limit: number,
) {
  const selected = itemIds.length
    ? resume.projects.filter((project) => itemIds.includes(project.id))
    : resume.projects.slice(0, limit);

  return selected
    .map((project) =>
      [
        `id: ${project.id}`,
        `name: ${project.name}`,
        `description: ${truncateText(project.description, 400)}`,
        `technologies: ${project.technologies.join(", ")}`,
        `highlights:\n${project.highlights.map((item) => `  - ${item}`).join("\n")}`,
      ].join("\n"),
    )
    .join("\n---\n");
}

function formatSkills(resume: ResumeData) {
  return resume.skills
    .map(
      (group) =>
        `${group.name}: ${group.skills.map((skill) => skill.name).join(", ")}`,
    )
    .join("\n");
}

function formatRelevantRequirements(
  context: CopilotContext,
  limit: number,
) {
  if (!context.job) {
    return "";
  }

  const matchById = new Map(
    (context.analysis?.requirementMatches ?? []).map((match) => [
      match.requirementId,
      match,
    ]),
  );

  return context.job.requirements
    .slice(0, limit)
    .map((requirement) => {
      const match = matchById.get(requirement.id);

      return `- [${requirement.priority}] ${requirement.label} → ${match?.status ?? "unknown"}`;
    })
    .join("\n");
}

export function assembleCopilotPrompt(
  context: CopilotContext,
  message: string,
  history: readonly CopilotMessage[],
) {
  const intent = detectIntent(message);
  const experienceIds = findReferencedExperienceIds(message, context.resume);
  const projectIds = findReferencedProjectIds(message, context.resume);

  const blocks: string[] = [
    `Resume language sample (preserve this language in resume text): "${truncateText(context.resume.profile.summary || context.resume.identity.headline, 200)}"`,
  ];

  if (context.fillSection) {
    blocks.push(
      `Fill with AI target section: ${context.fillSection}. The user supplied new information for this section. Produce one action proposal only for this section when the details are sufficient. For the projects section, create a new personal project with project.create. Use only facts supplied by the user in this request or already present in the resume. Do not invent dates, metrics, technologies, or links. If required details are missing, ask a focused question instead of proposing a change.`,
    );
  }

  if (context.job) {
    blocks.push(
      `Target job: ${context.job.title ?? "unknown role"}${context.job.company ? ` at ${context.job.company}` : ""}${context.job.seniority ? ` (${context.job.seniority})` : ""}`,
    );
  }

  if (
    intent === "profile.rewrite" ||
    context.fillSection === "profile" ||
    intent === "resume.optimizeForJob" ||
    intent === "general"
  ) {
    blocks.push(
      `Current profile summary:\n${context.resume.profile.summary || "(empty)"}`,
      `Headline: ${context.resume.identity.headline || "(empty)"}`,
    );
  }

  if (
    intent.startsWith("experience") ||
    context.fillSection === "experience" ||
    intent === "resume.optimizeForJob" ||
    intent === "resume.findWeaknesses" ||
    intent === "resume.findStrengths" ||
    experienceIds.length > 0
  ) {
    blocks.push(
      `Experiences:\n${formatExperience(context.resume, experienceIds, 4)}`,
    );
  }

  if (
    intent.startsWith("project") ||
    context.fillSection === "projects" ||
    intent === "resume.optimizeForJob" ||
    projectIds.length > 0
  ) {
    blocks.push(`Projects:\n${formatProjects(context.resume, projectIds, 4)}`);
  }

  if (
    intent.startsWith("skill") ||
    context.fillSection === "skills" ||
    intent === "resume.optimizeForJob" ||
    intent === "resume.explainMatch"
  ) {
    blocks.push(`Skills:\n${formatSkills(context.resume)}`);
  }

  const requirements = formatRelevantRequirements(context, 24);

  if (requirements) {
    blocks.push(`Job requirements and current match status:\n${requirements}`);
  }

  if (context.analysis) {
    blocks.push(
      `Current match score: overall ${context.analysis.score.overall}, skills ${context.analysis.score.dimensions.skills}, experience ${context.analysis.score.dimensions.experience}, projects ${context.analysis.score.dimensions.projects}, profile ${context.analysis.score.dimensions.profile}, keywords ${context.analysis.score.dimensions.keywords}`,
    );
  }

  if (context.pendingSuggestions.length > 0) {
    blocks.push(
      `Pending suggestions:\n${context.pendingSuggestions
        .slice(0, 5)
        .map((suggestion) => `- ${suggestion.type}: ${suggestion.reason}`)
        .join("\n")}`,
    );
  }

  const recentHistory = history.slice(-recentMessageCount);

  if (recentHistory.length > 0) {
    blocks.push(
      `Recent conversation:\n${recentHistory
        .map((entry) => `${entry.role}: ${truncateText(entry.content, 300)}`)
        .join("\n")}`,
    );
  }

  blocks.push(`User request: ${message}`);

  return { intent, prompt: blocks.join("\n\n") };
}
