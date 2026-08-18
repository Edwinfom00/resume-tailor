"use client";

import type { ResumeData, ResumeExperience } from "@/@types/resume-data";
import type { Messages } from "@/i18n/messages/types";
import { ExperienceSectionEditor } from "./editors/experience-section-editor";
import { SectionEditWrapper } from "./editors/section-edit-wrapper";
import {
  formatResumeDateRange,
  formatResumeLocation,
} from "./resume-formatters";
import { ResumeSectionHeading } from "./resume-section-heading";

type ResumeExperienceProps = Readonly<{
  resume: ResumeData;
  title: string;
  presentLabel: string;
  dictionary?: Messages;
}>;

type ResumeExperienceItemProps = Readonly<{
  experience: ResumeExperience;
  presentLabel: string;
}>;

function ResumeExperienceItem({
  experience,
  presentLabel,
}: ResumeExperienceItemProps) {
  const location = formatResumeLocation(experience.location);

  return (
    <article data-resume-item={experience.id}>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="m-0 text-sm leading-tight font-bold text-(--rt-color-resume-copy)">
          {experience.role}
        </h3>
        <time className="shrink-0 [font-size:var(--rt-font-size-resume-meta)] leading-tight text-(--rt-color-resume-body)">
          {formatResumeDateRange(experience.period, presentLabel)}
        </time>
      </div>
      <p className="m-0 [font-size:var(--rt-font-size-resume-meta)] leading-tight italic">
        <span className="text-(--rt-color-resume-heading)">
          {experience.employer}
        </span>
        {location ? (
          <span className="text-(--rt-color-resume-body)"> · {location}</span>
        ) : null}
      </p>
      <ul className="mt-1 mb-0 list-disc space-y-0 pl-6 [font-size:var(--rt-font-size-resume-copy)] leading-(--rt-line-height-resume-copy) text-(--rt-color-resume-copy)">
        {experience.achievements.map((achievement) => (
          <li key={achievement}>{achievement}</li>
        ))}
      </ul>
    </article>
  );
}

export function ResumeExperience({
  resume,
  title,
  presentLabel,
  dictionary,
}: ResumeExperienceProps) {
  const content = (
    <section data-resume-section="experience">
      <ResumeSectionHeading>{title}</ResumeSectionHeading>
      <div className="mt-3 space-y-(--rt-resume-entry-gap)">
        {resume.experiences.map((experience) => (
          <ResumeExperienceItem
            key={experience.id}
            experience={experience}
            presentLabel={presentLabel}
          />
        ))}
      </div>
    </section>
  );

  if (!dictionary) {
    return content;
  }

  return (
    <SectionEditWrapper
      sectionId="experience"
      dictionary={dictionary}
      editor={({ onClose }) => (
        <ExperienceSectionEditor
          resume={resume}
          dictionary={dictionary}
          title={title}
          onClose={onClose}
        />
      )}
    >
      {content}
    </SectionEditWrapper>
  );
}
