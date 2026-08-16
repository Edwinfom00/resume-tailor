import type { ResumeData } from "@/@types/resume-data";

type ResumeProfileProps = Readonly<{
  resume: ResumeData;
  title: string;
}>;

export function ResumeProfile({ resume, title }: ResumeProfileProps) {
  return (
    <section className="mt-[4.5mm] px-(--rt-resume-page-inset-inline)">
      <h2 className="m-0 border-b border-(--rt-color-resume-heading) pb-1 text-base leading-tight font-bold uppercase tracking-normal text-(--rt-color-resume-heading)">
        {title}
      </h2>
      <p className="mt-3 mb-0 text-sm leading-(--rt-line-height-resume-copy) text-(--rt-color-resume-copy)">
        {resume.profile.summary}
      </p>
    </section>
  );
}
