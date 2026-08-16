import type { ReactNode } from "react";

type ResumeSectionHeadingProps = Readonly<{
  children: ReactNode;
}>;

export function ResumeSectionHeading({ children }: ResumeSectionHeadingProps) {
  return (
    <h2 className="m-0 border-b border-(--rt-color-resume-heading) pb-1 text-base leading-tight font-bold uppercase tracking-normal text-(--rt-color-resume-heading)">
      {children}
    </h2>
  );
}
