import type { ResumeData } from "@/@types/resume-data";
import type { JobOffer } from "@/modules/job/domain/job-offer";
import { stableHash } from "@/modules/shared/domain/stable-hash";
import { canonicalizeTerm } from "@/modules/shared/taxonomy/technology-aliases";
import { normalizeToken } from "@/modules/shared/text/normalize-text";

export function hashResume(resume: ResumeData) {
  return stableHash({
    headline: normalizeToken(resume.identity.headline),
    summary: normalizeToken(resume.profile.summary),
    highlights: resume.profile.highlights.map(normalizeToken),
    experiences: resume.experiences.map((experience) => ({
      id: experience.id,
      employer: normalizeToken(experience.employer),
      role: normalizeToken(experience.role),
      period: experience.period,
      achievements: experience.achievements.map(normalizeToken),
      technologies: experience.technologies.map(canonicalizeTerm),
    })),
    projects: resume.projects.map((project) => ({
      id: project.id,
      name: normalizeToken(project.name),
      description: normalizeToken(project.description),
      highlights: project.highlights.map(normalizeToken),
      technologies: project.technologies.map(canonicalizeTerm),
    })),
    skills: resume.skills.flatMap((group) =>
      group.skills.map((skill) => canonicalizeTerm(skill.name)),
    ),
    education: resume.education.map((education) => education.id),
    languages: resume.languages.map((language) => language.name),
  });
}

export function hashJobOffer(job: JobOffer) {
  return stableHash({
    title: normalizeToken(job.title ?? ""),
    company: normalizeToken(job.company ?? ""),
    requirements: job.requirements.map((requirement) => ({
      normalized: requirement.normalized,
      priority: requirement.priority,
      category: requirement.category,
    })),
    keywords: job.keywords.map(canonicalizeTerm),
  });
}

export function buildAnalysisKey(resume: ResumeData, job: JobOffer) {
  return `${hashResume(resume)}:${hashJobOffer(job)}`;
}
