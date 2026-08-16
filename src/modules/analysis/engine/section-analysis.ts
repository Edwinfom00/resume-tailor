import type { ResumeData } from "@/@types/resume-data";
import type { JobOffer } from "@/modules/job/domain/job-offer";
import type {
  AnalysisSectionId,
  MatchScore,
  RequirementMatch,
  SectionAnalysis,
} from "@/modules/analysis/domain/analysis-types";
import type { ResumeSuggestion } from "@/modules/analysis/domain/suggestion-types";
import { clampScore } from "@/modules/analysis/scoring/scoring-config";
import type { ResumeEvidenceSection } from "@/modules/resume/domain/resume-evidence";

const sectionEvidenceSource: Readonly<
  Record<AnalysisSectionId, ResumeEvidenceSection>
> = {
  profile: "profile",
  experience: "experience",
  projects: "project",
  skills: "skills",
};

function strengthsForSection(
  section: AnalysisSectionId,
  matches: readonly RequirementMatch[],
  job: JobOffer,
) {
  const labelById = new Map(
    job.requirements.map((requirement) => [requirement.id, requirement.label]),
  );

  return matches
    .filter(
      (match) =>
        match.status === "strong-match" &&
        match.resumeEvidence.some(
          (evidence) => evidence.section === sectionEvidenceSource[section],
        ),
    )
    .map((match) => labelById.get(match.requirementId))
    .filter((label): label is string => Boolean(label))
    .slice(0, 8);
}

function issuesForSection(
  section: AnalysisSectionId,
  resume: ResumeData,
  suggestions: readonly ResumeSuggestion[],
) {
  const sectionSuggestions = suggestions.filter(
    (suggestion) => suggestion.target.section === section,
  );
  const structuralIssues: string[] = [];

  if (section === "profile" && resume.profile.summary.length < 120) {
    structuralIssues.push("The profile summary is too short to position you.");
  }

  if (section === "experience" && resume.experiences.length === 0) {
    structuralIssues.push("No professional experience is listed.");
  }

  if (section === "projects" && resume.projects.length === 0) {
    structuralIssues.push("No projects are listed.");
  }

  if (section === "skills" && resume.skills.length === 0) {
    structuralIssues.push("No skills are listed.");
  }

  return [
    ...structuralIssues,
    ...sectionSuggestions.map((suggestion) => suggestion.reason),
  ].slice(0, 8);
}

function sectionScore(
  section: AnalysisSectionId,
  score: MatchScore,
  matches: readonly RequirementMatch[],
) {
  const relevant = matches.filter((match) =>
    match.resumeEvidence.some(
      (evidence) => evidence.section === sectionEvidenceSource[section],
    ),
  );

  if (section === "profile") {
    return score.dimensions.profile;
  }

  if (section === "skills") {
    return score.dimensions.skills;
  }

  if (section === "projects") {
    return score.dimensions.projects;
  }

  if (relevant.length === 0) {
    return score.dimensions.experience;
  }

  const average =
    relevant.reduce((total, match) => total + match.score, 0) / relevant.length;

  return clampScore(average * 100);
}

export function buildSectionAnalyses(
  resume: ResumeData,
  job: JobOffer,
  matches: readonly RequirementMatch[],
  score: MatchScore,
  suggestions: readonly ResumeSuggestion[],
): readonly SectionAnalysis[] {
  const sections: readonly AnalysisSectionId[] = [
    "profile",
    "experience",
    "projects",
    "skills",
  ];

  return sections.map((section) => {
    const sectionSuggestions = suggestions.filter(
      (suggestion) => suggestion.target.section === section,
    );

    return {
      section,
      score: sectionScore(section, score, matches),
      strengths: strengthsForSection(section, matches, job),
      issues: issuesForSection(section, resume, suggestions),
      missingRequirementIds: sectionSuggestions.flatMap(
        (suggestion) => suggestion.jobRequirementIds,
      ),
      suggestionIds: sectionSuggestions.map((suggestion) => suggestion.id),
    };
  });
}
