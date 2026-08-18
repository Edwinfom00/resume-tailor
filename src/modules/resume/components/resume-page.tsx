import type { ReactNode } from "react";

export type ResumePageProps = Readonly<{
  children: ReactNode;
}>;

export function ResumePage({ children }: ResumePageProps) {
  return (
    <article
      data-resume-page
      className="relative min-h-[297mm] h-[297mm] w-[210mm] shrink-0 overflow-hidden [&:has([data-editing-section])]:h-auto [&:has([data-editing-section])]:overflow-visible bg-surface text-ink box-border isolate"
    >
      {children}
    </article>
  );
}
