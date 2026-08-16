import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/locales";
import type { ResumeData } from "@/@types/resume-data";
import {
  ResumeDocument,
  type ResumeDocumentPage,
} from "@/modules/components/resume-document";
import { ResumeHeader } from "@/modules/components/sections/resume-header";
import { edwinResume } from "@/modules/fixtures/edwin-resume";

type LocalePageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

const previewPages: readonly ResumeDocumentPage<ResumeData>[] = [
  {
    id: "resume-header",
    render: (resume) => <ResumeHeader resume={resume} />,
  },
];

export default async function ResumePreview({ params }: LocalePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <main className="flex flex-1 bg-canvas">
      <ResumeDocument data={edwinResume} pages={previewPages} />
      </main>
  );
}
