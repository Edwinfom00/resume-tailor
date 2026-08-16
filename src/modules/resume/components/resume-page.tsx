import type { ReactNode } from "react";

export type ResumePageProps = Readonly<{
  children: ReactNode;
}>;

export function ResumePage({ children }: ResumePageProps) {
  return (
    <article
      data-resume-page
      className="relative h-[297mm] w-[210mm] shrink-0 overflow-hidden bg-surface text-ink box-border isolate"
    >
      {children}
    </article>
  );
}
