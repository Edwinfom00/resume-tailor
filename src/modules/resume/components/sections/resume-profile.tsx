import type { ResumeData } from "@/@types/resume-data";
import { ResumeSectionHeading } from "./resume-section-heading";

type ResumeProfileProps = Readonly<{
  resume: ResumeData;
  title: string;
}>;

export function ResumeProfile({ resume, title }: ResumeProfileProps) {
  return (
    <section data-resume-section="profile">
      <ResumeSectionHeading>{title}</ResumeSectionHeading>
      <p className="mt-3 mb-0 text-sm leading-tight text-(--rt-color-resume-copy)">
        {resume.profile.summary}
      </p>
    </section>
  );
}
