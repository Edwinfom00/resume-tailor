"use client";

import type { ResumeData, ResumeInterest } from "@/@types/resume-data";
import type { Messages } from "@/i18n/messages/types";
import { InterestsSectionEditor } from "./editors/interests-section-editor";
import { SectionEditWrapper } from "./editors/section-edit-wrapper";
import { ResumeSectionHeading } from "./resume-section-heading";

type ResumeInterestsProps = Readonly<{
  resume: ResumeData;
  title: string;
  dictionary?: Messages;
}>;

type ResumeInterestItemProps = Readonly<{
  interest: ResumeInterest;
}>;

function ResumeInterestItem({ interest }: ResumeInterestItemProps) {
  const details = interest.details?.join(", ");

  return (
    <li>
      {interest.name}
      {details ? ` – ${details}` : null}
    </li>
  );
}

export function ResumeInterests({ resume, title, dictionary }: ResumeInterestsProps) {
  const content = (
    <section data-resume-section="interests">
      <ResumeSectionHeading>{title}</ResumeSectionHeading>
      <ul className="mt-3 mb-0 list-disc space-y-0 pl-6 [font-size:var(--rt-font-size-resume-copy)] leading-(--rt-line-height-resume-copy) text-(--rt-color-resume-copy)">
        {resume.interests.map((interest) => (
          <ResumeInterestItem key={interest.name} interest={interest} />
        ))}
      </ul>
    </section>
  );

  if (!dictionary) {
    return content;
  }

  return (
    <SectionEditWrapper
      sectionId="interests"
      dictionary={dictionary}
      editor={({ onClose }) => (
        <InterestsSectionEditor
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
