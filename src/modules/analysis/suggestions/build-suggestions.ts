import type { ResumeData } from "@/@types/resume-data";
import type { JobOffer, JobRequirement } from "@/modules/job/domain/job-offer";
import type {
  ItemRelevance,
  RequirementMatch,
} from "@/modules/analysis/domain/analysis-types";
import {
  priorityForImpact,
  sortSuggestionsByImpact,
  type ResumeSuggestion,
} from "@/modules/analysis/domain/suggestion-types";
import { isSameOrder } from "@/modules/analysis/engine/item-relevance";
import { priorityWeights } from "@/modules/analysis/scoring/scoring-config";
import { stripRequirementPrefix } from "@/modules/job/domain/requirement-label";
import { createIdentifier } from "@/modules/shared/domain/identifier";
import { canonicalizeTerm } from "@/modules/shared/taxonomy/technology-aliases";
import { containsLooseTerm, truncateText } from "@/modules/shared/text/normalize-text";

const genericAchievementPatterns: readonly RegExp[] = [
  /^(worked|responsible for|participated|involved|helped|assisted)/i,
  /^(mitarbeit|verantwortlich für|beteiligt)/i,
  /^(participation|responsable de|aide)/i,
];

const maximumProfileLength = 900;
const maximumAchievementLength = 240;

const maximumAtomicLabelWords = 4;
const maximumAtomicLabelLength = 40;

const skillLikeCategories = new Set(["technology", "skill"]);

function isAtomicSkillRequirement(requirement: JobRequirement) {
  return (
    skillLikeCategories.has(requirement.category) &&
    requirement.label.length <= maximumAtomicLabelLength &&
    requirement.label.trim().split(/\s+/).length <= maximumAtomicLabelWords
  );
}

function impactForRequirement(requirement: JobRequirement) {
  return Math.round(priorityWeights[requirement.priority] * 14);
}

function suggestionBase(createdAt: string) {
  return { status: "pending" as const, createdAt };
}

function buildMissingSkillSuggestions(
  job: JobOffer,
  matches: readonly RequirementMatch[],
  createdAt: string,
): readonly ResumeSuggestion[] {
  const requirementById = new Map(
    job.requirements.map((requirement) => [requirement.id, requirement]),
  );

  return matches
    .filter((match) => match.status === "missing")
    .map((match) => requirementById.get(match.requirementId))
    .filter((requirement): requirement is JobRequirement =>
      requirement !== undefined,
    )
    .filter(isAtomicSkillRequirement)
    .map((requirement) => {
      const impact = impactForRequirement(requirement);

      return {
        ...suggestionBase(createdAt),
        id: createIdentifier("sug"),
        type: "missing-skill" as const,
        target: { section: "skills" as const },
        priority: priorityForImpact(impact),
        reason: `The offer asks for ${requirement.label}, but no evidence of it exists in the resume.`,
        jobRequirementIds: [requirement.id],
        before: null,
        after: stripRequirementPrefix(requirement.label),
        estimatedImpact: impact,
        confidence: 0.9,
        requiresUserConfirmation: true,
        action: {
          type: "skill.add" as const,
          groupName: "Tools & Practices",
          skill: { name: stripRequirementPrefix(requirement.label) },
        },
      };
    });
}

function buildHighlightSkillSuggestions(
  resume: ResumeData,
  job: JobOffer,
  matches: readonly RequirementMatch[],
  createdAt: string,
): readonly ResumeSuggestion[] {
  const requirementById = new Map(
    job.requirements.map((requirement) => [requirement.id, requirement]),
  );
  const declaredSkills = new Set(
    resume.skills.flatMap((group) =>
      group.skills.map((skill) => canonicalizeTerm(skill.name)),
    ),
  );

  return matches
    .filter(
      (match) =>
        match.status !== "missing" &&
        match.resumeEvidence.some(
          (evidence) =>
            evidence.section === "experience" || evidence.section === "project",
        ) &&
        !match.resumeEvidence.some((evidence) => evidence.section === "skills"),
    )
    .flatMap((match): readonly ResumeSuggestion[] => {
      const requirement = requirementById.get(match.requirementId);

      if (!requirement || !isAtomicSkillRequirement(requirement)) {
        return [];
      }

      if (
        declaredSkills.has(requirement.normalized) ||
        resume.skills.some((group) =>
          group.skills.some((skill) =>
            containsLooseTerm(requirement.label, skill.name),
          ),
        )
      ) {
        return [];
      }

      const impact = Math.round(impactForRequirement(requirement) * 0.6);

      return [{
        ...suggestionBase(createdAt),
        id: createIdentifier("sug"),
        type: "highlight-skill" as const,
        target: { section: "skills" as const },
        priority: priorityForImpact(impact),
        reason: `${requirement.label} appears in your experience but is missing from the skills section.`,
        jobRequirementIds: [requirement.id],
        before: null,
        after: stripRequirementPrefix(requirement.label),
        estimatedImpact: impact,
        confidence: 0.85,
        requiresUserConfirmation: false,
        action: {
          type: "skill.add" as const,
          groupName: "Tools & Practices",
          skill: { name: stripRequirementPrefix(requirement.label) },
        },
      }];
    });
}

function buildProfileSuggestion(
  resume: ResumeData,
  job: JobOffer,
  matches: readonly RequirementMatch[],
  createdAt: string,
): readonly ResumeSuggestion[] {
  const summary = resume.profile.summary;
  const criticalRequirements = job.requirements.filter(
    (requirement) => requirement.priority === "critical",
  );
  const uncoveredInProfile = criticalRequirements.filter(
    (requirement) => !containsLooseTerm(summary, requirement.label),
  );

  const tooLong = summary.length > maximumProfileLength;

  if (uncoveredInProfile.length === 0 && !tooLong) {
    return [];
  }

  const matchedIds = new Set(
    matches
      .filter((match) => match.status !== "missing")
      .map((match) => match.requirementId),
  );
  const targetRequirements = uncoveredInProfile.filter((requirement) =>
    matchedIds.has(requirement.id),
  );
  const impact = Math.min(14, 4 + targetRequirements.length * 2);

  return [
    {
      ...suggestionBase(createdAt),
      id: createIdentifier("sug"),
      type: "rewrite-profile" as const,
      target: { section: "profile" as const, field: "summary" },
      priority: priorityForImpact(impact),
      reason: tooLong
        ? "The profile is long and does not lead with the requirements this offer prioritizes."
        : "The profile does not mention critical requirements your experience already supports.",
      jobRequirementIds: targetRequirements.map((requirement) => requirement.id),
      before: summary,
      after: undefined,
      estimatedImpact: impact,
      confidence: 0.7,
      requiresUserConfirmation: false,
    },
  ];
}

function buildExperienceRewriteSuggestions(
  resume: ResumeData,
  job: JobOffer,
  relevance: readonly ItemRelevance[],
  createdAt: string,
): readonly ResumeSuggestion[] {
  const relevanceById = new Map(
    relevance.map((item) => [item.itemId, item]),
  );

  return resume.experiences.flatMap((experience) => {
    const itemRelevance = relevanceById.get(experience.id);
    const weakAchievements = experience.achievements.filter((achievement) =>
      genericAchievementPatterns.some((pattern) => pattern.test(achievement)),
    );
    const longAchievements = experience.achievements.filter(
      (achievement) => achievement.length > maximumAchievementLength,
    );

    if (weakAchievements.length === 0 && longAchievements.length === 0) {
      return [];
    }

    const impact = Math.min(
      12,
      weakAchievements.length * 3 + longAchievements.length * 2,
    );

    return [
      {
        ...suggestionBase(createdAt),
        id: createIdentifier("sug"),
        type: (longAchievements.length > weakAchievements.length
          ? "shorten-content"
          : "rewrite-experience") as ResumeSuggestion["type"],
        target: {
          section: "experience" as const,
          itemId: experience.id,
          field: "achievements",
        },
        priority: priorityForImpact(impact),
        reason:
          longAchievements.length > weakAchievements.length
            ? `${experience.employer}: ${longAchievements.length} bullet(s) are too long to scan quickly.`
            : `${experience.employer}: ${weakAchievements.length} bullet(s) describe duties instead of outcomes relevant to this offer.`,
        jobRequirementIds: itemRelevance?.matchedRequirements ?? [],
        before: experience.achievements,
        after: undefined,
        estimatedImpact: impact,
        confidence: 0.65,
        requiresUserConfirmation: false,
      },
    ];
  });
}

function buildProjectRewriteSuggestions(
  resume: ResumeData,
  relevance: readonly ItemRelevance[],
  createdAt: string,
): readonly ResumeSuggestion[] {
  const relevanceById = new Map(relevance.map((item) => [item.itemId, item]));

  return resume.projects
    .filter((project) => project.description.length < 80 || project.highlights.length === 0)
    .map((project) => {
      const itemRelevance = relevanceById.get(project.id);
      const impact = itemRelevance && itemRelevance.score > 40 ? 8 : 4;

      return {
        ...suggestionBase(createdAt),
        id: createIdentifier("sug"),
        type: "rewrite-project" as const,
        target: {
          section: "projects" as const,
          itemId: project.id,
          field: "description",
        },
        priority: priorityForImpact(impact),
        reason: `${project.name} is described too briefly to demonstrate its relevance to this offer.`,
        jobRequirementIds: itemRelevance?.matchedRequirements ?? [],
        before: project.description,
        after: undefined,
        estimatedImpact: impact,
        confidence: 0.6,
        requiresUserConfirmation: false,
      };
    });
}

function buildReorderSuggestions(
  resume: ResumeData,
  experienceOrder: readonly string[],
  projectOrder: readonly string[],
  createdAt: string,
): readonly ResumeSuggestion[] {
  const currentExperienceOrder = resume.experiences.map(
    (experience) => experience.id,
  );
  const currentProjectOrder = resume.projects.map((project) => project.id);
  const suggestions: ResumeSuggestion[] = [];

  if (
    currentExperienceOrder.length > 1 &&
    !isSameOrder(currentExperienceOrder, experienceOrder)
  ) {
    suggestions.push({
      ...suggestionBase(createdAt),
      id: createIdentifier("sug"),
      type: "reorder-experiences",
      target: { section: "experience" },
      priority: "medium",
      reason:
        "Reordering experiences puts the roles closest to this offer at the top.",
      jobRequirementIds: [],
      before: currentExperienceOrder,
      after: experienceOrder,
      estimatedImpact: 6,
      confidence: 0.8,
      requiresUserConfirmation: false,
      action: { type: "experience.reorder", order: experienceOrder },
    });
  }

  if (
    currentProjectOrder.length > 1 &&
    !isSameOrder(currentProjectOrder, projectOrder)
  ) {
    suggestions.push({
      ...suggestionBase(createdAt),
      id: createIdentifier("sug"),
      type: "reorder-projects",
      target: { section: "projects" },
      priority: "medium",
      reason:
        "Reordering projects surfaces the work that matches this offer first.",
      jobRequirementIds: [],
      before: currentProjectOrder,
      after: projectOrder,
      estimatedImpact: 5,
      confidence: 0.8,
      requiresUserConfirmation: false,
      action: { type: "project.reorder", order: projectOrder },
    });
  }

  return suggestions;
}

function buildKeywordSuggestion(
  resume: ResumeData,
  job: JobOffer,
  createdAt: string,
): readonly ResumeSuggestion[] {
  const declaredSkills = resume.skills.flatMap((group) =>
    group.skills.map((skill) => skill.name),
  );
  const declared = new Set(declaredSkills.map(canonicalizeTerm));
  const missingKeywords = job.keywords.filter(
    (keyword) => !declared.has(canonicalizeTerm(keyword)),
  );

  if (missingKeywords.length === 0) {
    return [];
  }

  const impact = Math.min(12, missingKeywords.length * 2);

  return [
    {
      ...suggestionBase(createdAt),
      id: createIdentifier("sug"),
      type: "keyword-improvement",
      target: { section: "skills" },
      priority: priorityForImpact(impact),
      reason: `${missingKeywords.length} priority keyword(s) from the offer are absent from the skills section.`,
      jobRequirementIds: [],
      before: declaredSkills,
      after: [...declaredSkills, ...missingKeywords],
      estimatedImpact: impact,
      confidence: 0.75,
      requiresUserConfirmation: true,
    },
  ];
}

export function buildDeterministicSuggestions(
  resume: ResumeData,
  job: JobOffer,
  matches: readonly RequirementMatch[],
  experienceRelevance: readonly ItemRelevance[],
  projectRelevance: readonly ItemRelevance[],
  recommendedExperienceOrder: readonly string[],
  recommendedProjectOrder: readonly string[],
): readonly ResumeSuggestion[] {
  const createdAt = new Date().toISOString();

  return sortSuggestionsByImpact([
    ...buildMissingSkillSuggestions(job, matches, createdAt),
    ...buildHighlightSkillSuggestions(resume, job, matches, createdAt),
    ...buildProfileSuggestion(resume, job, matches, createdAt),
    ...buildExperienceRewriteSuggestions(
      resume,
      job,
      experienceRelevance,
      createdAt,
    ),
    ...buildProjectRewriteSuggestions(resume, projectRelevance, createdAt),
    ...buildReorderSuggestions(
      resume,
      recommendedExperienceOrder,
      recommendedProjectOrder,
      createdAt,
    ),
    ...buildKeywordSuggestion(resume, job, createdAt),
  ]);
}

export function describeSuggestion(suggestion: ResumeSuggestion) {
  return truncateText(suggestion.reason, 160);
}
