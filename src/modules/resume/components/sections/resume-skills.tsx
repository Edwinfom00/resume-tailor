"use client";

import type { ResumeData, ResumeSkillGroup } from "@/@types/resume-data";
import type { Messages } from "@/i18n/messages/types";
import { SkillsSectionEditor } from "./editors/skills-section-editor";
import { SectionEditWrapper } from "./editors/section-edit-wrapper";
import { ResumeSectionHeading } from "./resume-section-heading";

type ResumeSkillsProps = Readonly<{
  resume: ResumeData;
  title: string;
  dictionary?: Messages;
}>;

type ResumeSkillGroupProps = Readonly<{
  group: ResumeSkillGroup;
}>;

function ResumeSkillGroupItem({ group }: ResumeSkillGroupProps) {
  return (
    <p className="m-0 [font-size:var(--rt-font-size-resume-copy)] leading-(--rt-line-height-resume-copy) text-(--rt-color-resume-copy)">
      <span className="font-bold">{group.name}:</span>{" "}
      {group.skills.map((skill) => skill.name).join(", ")}
    </p>
  );
}

export function ResumeSkills({ resume, title, dictionary }: ResumeSkillsProps) {
  const content = (
    <section data-resume-section="skills">
      <ResumeSectionHeading>{title}</ResumeSectionHeading>
      <div className="mt-3 space-y-1">
        {resume.skills.map((group) => (
          <ResumeSkillGroupItem key={group.name} group={group} />
        ))}
      </div>
    </section>
  );

  if (!dictionary) {
    return content;
  }

  return (
    <SectionEditWrapper
      sectionId="skills"
      dictionary={dictionary}
      editor={({ onClose }) => (
        <SkillsSectionEditor
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
