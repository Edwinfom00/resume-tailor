"use client";

import type { ResumeData } from "@/@types/resume-data";
import type { Messages } from "@/i18n/messages/types";
import { ProfileSectionEditor } from "./editors/profile-section-editor";
import { SectionEditWrapper } from "./editors/section-edit-wrapper";
import { ResumeSectionHeading } from "./resume-section-heading";

type ResumeProfileProps = Readonly<{
  resume: ResumeData;
  title: string;
  dictionary?: Messages;
}>;

export function ResumeProfile({ resume, title, dictionary }: ResumeProfileProps) {
  const content = (
    <section data-resume-section="profile">
      <ResumeSectionHeading>{title}</ResumeSectionHeading>
      <p className="mt-3 mb-0 text-sm leading-tight text-(--rt-color-resume-copy)">
        {resume.profile.summary}
      </p>
    </section>
  );

  if (!dictionary) {
    return content;
  }

  return (
    <SectionEditWrapper
      sectionId="profile"
      dictionary={dictionary}
      editor={({ onClose }) => (
        <ProfileSectionEditor
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
