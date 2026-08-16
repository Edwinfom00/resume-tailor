export type ResumeMonth =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12;

export type EmploymentType =
  | "contract"
  | "freelance"
  | "full-time"
  | "internship"
  | "part-time";

export type SkillLevel =
  | "foundational"
  | "intermediate"
  | "advanced"
  | "expert";

export type LanguageProficiency =
  | "native"
  | "C2"
  | "C1"
  | "B2"
  | "B1"
  | "A2"
  | "A1";

export type ResumeLinkKind =
  | "website"
  | "portfolio"
  | "linkedin"
  | "github"
  | "other";

export interface ResumeDate {
  readonly year: number;
  readonly month?: ResumeMonth;
}

export interface ResumeDateRange {
  readonly start: ResumeDate;
  readonly end?: ResumeDate;
}

export interface ResumeLocation {
  readonly city?: string;
  readonly region?: string;
  readonly country?: string;
  readonly remote?: boolean;
}

export interface ResumeLink {
  readonly kind: ResumeLinkKind;
  readonly label: string;
  readonly url: string;
}

export interface ResumeContact {
  readonly email: string;
  readonly phone?: string;
  readonly location?: ResumeLocation;
  readonly links: readonly ResumeLink[];
}

export interface ResumeIdentity {
  readonly name: string;
  readonly headline: string;
  readonly contact: ResumeContact;
}

export interface ResumeProfile {
  readonly summary: string;
  readonly highlights: readonly string[];
}

export interface ResumeExperience {
  readonly id: string;
  readonly employer: string;
  readonly role: string;
  readonly employmentType?: EmploymentType;
  readonly location?: ResumeLocation;
  readonly period: ResumeDateRange;
  readonly summary?: string;
  readonly achievements: readonly string[];
  readonly technologies: readonly string[];
}

export interface ResumeProject {
  readonly id: string;
  readonly name: string;
  readonly role?: string;
  readonly period?: ResumeDateRange;
  readonly description: string;
  readonly highlights: readonly string[];
  readonly technologies: readonly string[];
  readonly links: readonly ResumeLink[];
}

export interface ResumeEducation {
  readonly id: string;
  readonly institution: string;
  readonly credential: string;
  readonly fieldOfStudy?: string;
  readonly location?: ResumeLocation;
  readonly period: ResumeDateRange;
  readonly highlights: readonly string[];
}

export interface ResumeSkill {
  readonly name: string;
  readonly level?: SkillLevel;
}

export interface ResumeSkillGroup {
  readonly name: string;
  readonly skills: readonly ResumeSkill[];
}

export interface ResumeLanguage {
  readonly name: string;
  readonly proficiency: LanguageProficiency;
}

export interface ResumeInterest {
  readonly name: string;
  readonly details?: readonly string[];
}

export interface ResumeData {
  readonly identity: ResumeIdentity;
  readonly profile: ResumeProfile;
  readonly experiences: readonly ResumeExperience[];
  readonly projects: readonly ResumeProject[];
  readonly education: readonly ResumeEducation[];
  readonly skills: readonly ResumeSkillGroup[];
  readonly languages: readonly ResumeLanguage[];
  readonly interests: readonly ResumeInterest[];
}
