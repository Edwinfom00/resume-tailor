import type {
  ResumeData,
  ResumeExperience,
  ResumeProject,
  ResumeSkillGroup,
} from "@/@types/resume-data";
import type { ResumeAction } from "@/modules/resume/domain/resume-actions";
import { createSlugIdentifier } from "@/modules/shared/domain/identifier";
import { collapseWhitespace } from "@/modules/shared/text/normalize-text";

function reorderById<TItem extends { readonly id: string }>(
  items: readonly TItem[],
  order: readonly string[],
): readonly TItem[] {
  const byId = new Map(items.map((item) => [item.id, item]));
  const ordered = order
    .map((itemId) => byId.get(itemId))
    .filter((item): item is TItem => item !== undefined);
  const remaining = items.filter((item) => !order.includes(item.id));

  return [...ordered, ...remaining];
}

function insertAt<TItem>(
  items: readonly TItem[],
  item: TItem,
  position: number | undefined,
): readonly TItem[] {
  if (position === undefined || position < 0 || position >= items.length) {
    return [...items, item];
  }

  return [...items.slice(0, position), item, ...items.slice(position)];
}

function uniqueId(prefix: string, label: string, existing: readonly string[]) {
  const base = createSlugIdentifier(prefix, label);
  let candidate = base;
  let suffix = 2;

  while (existing.includes(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

function addSkillToGroups(
  groups: readonly ResumeSkillGroup[],
  groupName: string,
  skill: ResumeSkillGroup["skills"][number],
): readonly ResumeSkillGroup[] {
  const normalizedName = collapseWhitespace(skill.name);

  if (!normalizedName) {
    return groups;
  }

  const alreadyPresent = groups.some((group) =>
    group.skills.some(
      (existing) =>
        existing.name.toLowerCase() === normalizedName.toLowerCase(),
    ),
  );

  if (alreadyPresent) {
    return groups;
  }

  const targetIndex = groups.findIndex(
    (group) => group.name.toLowerCase() === groupName.toLowerCase(),
  );

  if (targetIndex === -1) {
    return [
      ...groups,
      { name: groupName, skills: [{ ...skill, name: normalizedName }] },
    ];
  }

  return groups.map((group, index) =>
    index === targetIndex
      ? { ...group, skills: [...group.skills, { ...skill, name: normalizedName }] }
      : group,
  );
}

function removeSkillFromGroups(
  groups: readonly ResumeSkillGroup[],
  skillName: string,
): readonly ResumeSkillGroup[] {
  const target = skillName.toLowerCase();

  return groups
    .map((group) => ({
      ...group,
      skills: group.skills.filter(
        (skill) => skill.name.toLowerCase() !== target,
      ),
    }))
    .filter((group) => group.skills.length > 0);
}

export function applyResumeAction(
  resume: ResumeData,
  action: ResumeAction,
): ResumeData {
  switch (action.type) {
    case "header.update":
      return {
        ...resume,
        identity: {
          ...resume.identity,
          name: action.name !== undefined ? collapseWhitespace(action.name) : resume.identity.name,
          headline: action.headline !== undefined ? collapseWhitespace(action.headline) : resume.identity.headline,
          contact: {
            ...resume.identity.contact,
            email: action.email !== undefined ? collapseWhitespace(action.email) : resume.identity.contact.email,
            phone: action.phone !== undefined ? collapseWhitespace(action.phone) : resume.identity.contact.phone,
            location: action.location !== undefined ? action.location : resume.identity.contact.location,
            links: action.links !== undefined ? action.links : resume.identity.contact.links,
          },
        },
      };

    case "profile.update":
      return {
        ...resume,
        identity:
          action.headline === undefined
            ? resume.identity
            : {
                ...resume.identity,
                headline: collapseWhitespace(action.headline),
              },
        profile: {
          summary:
            action.summary === undefined
              ? resume.profile.summary
              : collapseWhitespace(action.summary),
          highlights: action.highlights ?? resume.profile.highlights,
        },
      };

    case "experience.create": {
      const experience: ResumeExperience = {
        ...action.experience,
        id:
          action.experience.id ??
          uniqueId(
            "exp",
            `${action.experience.employer}-${action.experience.role}`,
            resume.experiences.map((item) => item.id),
          ),
      };

      return {
        ...resume,
        experiences: insertAt(resume.experiences, experience, action.position),
      };
    }

    case "experience.update":
      return {
        ...resume,
        experiences: resume.experiences.map((experience) =>
          experience.id === action.itemId
            ? { ...experience, ...action.changes, id: experience.id }
            : experience,
        ),
      };

    case "experience.delete":
      return {
        ...resume,
        experiences: resume.experiences.filter(
          (experience) => experience.id !== action.itemId,
        ),
      };

    case "experience.reorder":
      return {
        ...resume,
        experiences: reorderById(resume.experiences, action.order),
      };

    case "project.create": {
      const project: ResumeProject = {
        ...action.project,
        id:
          action.project.id ??
          uniqueId(
            "prj",
            action.project.name,
            resume.projects.map((item) => item.id),
          ),
      };

      return {
        ...resume,
        projects: insertAt(resume.projects, project, action.position),
      };
    }

    case "project.update":
      return {
        ...resume,
        projects: resume.projects.map((project) =>
          project.id === action.itemId
            ? { ...project, ...action.changes, id: project.id }
            : project,
        ),
      };

    case "project.delete":
      return {
        ...resume,
        projects: resume.projects.filter(
          (project) => project.id !== action.itemId,
        ),
      };

    case "project.reorder":
      return {
        ...resume,
        projects: reorderById(resume.projects, action.order),
      };

    case "skill.add":
      return {
        ...resume,
        skills: addSkillToGroups(resume.skills, action.groupName, action.skill),
      };

    case "skill.remove":
      return {
        ...resume,
        skills: removeSkillFromGroups(resume.skills, action.skillName),
      };

    case "education.create":
      return {
        ...resume,
        education: [
          ...resume.education,
          {
            id: action.education.id ?? `edu-${Date.now()}`,
            institution: action.education.institution,
            credential: action.education.credential,
            fieldOfStudy: action.education.fieldOfStudy,
            location: action.education.location,
            period: action.education.period,
            highlights: action.education.highlights ?? [],
          },
        ],
      };

    case "education.update":
      return {
        ...resume,
        education: resume.education.map((education) =>
          education.id === action.itemId
            ? { ...education, ...action.changes, id: education.id }
            : education,
        ),
      };

    case "education.delete":
      return {
        ...resume,
        education: resume.education.filter((edu) => edu.id !== action.itemId),
      };

    case "language.update":
      return {
        ...resume,
        languages: resume.languages.map((language) =>
          language.name.toLowerCase() === action.languageName.toLowerCase()
            ? { ...language, ...action.changes }
            : language,
        ),
      };

    default:
      return resume;
  }
}

export function applyResumeActions(
  resume: ResumeData,
  actions: readonly ResumeAction[],
): ResumeData {
  return actions.reduce(applyResumeAction, resume);
}
