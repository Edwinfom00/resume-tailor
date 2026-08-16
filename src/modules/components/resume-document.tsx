import type { ReactNode } from "react";
import { ResumePage } from "./resume-page";

export type ResumeDocumentPage<TData> = Readonly<{
  id: string;
  render: (data: TData) => ReactNode;
}>;

export type ResumeDocumentProps<TData> = Readonly<{
  data: TData;
  pages: readonly ResumeDocumentPage<TData>[];
}>;

export function ResumeDocument<TData>({
  data,
  pages,
}: ResumeDocumentProps<TData>) {
  return (
    <section className="flex w-full flex-col items-center gap-6 overflow-auto p-4">
      {pages.map((page) => (
        <ResumePage key={page.id}>{page.render(data)}</ResumePage>
      ))}
    </section>
  );
}
