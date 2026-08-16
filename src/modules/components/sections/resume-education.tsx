import type { ResumeData, ResumeEducation } from "@/@types/resume-data";
import {
  formatResumeDateRange,
  formatResumeLocation,
} from "./resume-formatters";
import { ResumeSectionHeading } from "./resume-section-heading";

type ResumeEducationProps = Readonly<{
  resume: ResumeData;
  title: string;
}>;

type ResumeEducationItemProps = Readonly<{
  education: ResumeEducation;
}>;

function getEducationTitle(education: ResumeEducation) {
  return education.fieldOfStudy
    ? `${education.credential} – ${education.fieldOfStudy}`
    : education.credential;
}

function ResumeEducationItem({ education }: ResumeEducationItemProps) {
  const location = formatResumeLocation(education.location);

  return (
    <article>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="m-0 text-sm leading-tight font-bold text-(--rt-color-resume-copy)">
          {getEducationTitle(education)}
        </h3>
        <time className="shrink-0 [font-size:var(--rt-font-size-resume-meta)] leading-tight text-(--rt-color-resume-body)">
          {formatResumeDateRange(education.period)}
        </time>
      </div>
      <p className="m-0 [font-size:var(--rt-font-size-resume-meta)] leading-tight italic">
        <span className="text-(--rt-color-resume-heading)">
          {education.institution}
        </span>
        {location ? (
          <span className="text-(--rt-color-resume-body)"> · {location}</span>
        ) : null}
      </p>
      {education.highlights.length ? (
        <ul className="mt-1 mb-0 list-disc space-y-0 pl-6 [font-size:var(--rt-font-size-resume-copy)] leading-(--rt-line-height-resume-copy) text-(--rt-color-resume-copy)">
          {education.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

export function ResumeEducation({ resume, title }: ResumeEducationProps) {
  return (
    <section>
      <ResumeSectionHeading>{title}</ResumeSectionHeading>
      <div className="mt-3 space-y-(--rt-resume-entry-gap)">
        {resume.education.map((education) => (
          <ResumeEducationItem key={education.id} education={education} />
        ))}
      </div>
    </section>
  );
}
