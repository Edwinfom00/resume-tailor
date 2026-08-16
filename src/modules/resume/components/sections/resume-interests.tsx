import type { ResumeData, ResumeInterest } from "@/@types/resume-data";
import { ResumeSectionHeading } from "./resume-section-heading";

type ResumeInterestsProps = Readonly<{
  resume: ResumeData;
  title: string;
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

export function ResumeInterests({ resume, title }: ResumeInterestsProps) {
  return (
    <section>
      <ResumeSectionHeading>{title}</ResumeSectionHeading>
      <ul className="mt-3 mb-0 list-disc space-y-0 pl-6 [font-size:var(--rt-font-size-resume-copy)] leading-(--rt-line-height-resume-copy) text-(--rt-color-resume-copy)">
        {resume.interests.map((interest) => (
          <ResumeInterestItem key={interest.name} interest={interest} />
        ))}
      </ul>
    </section>
  );
}
