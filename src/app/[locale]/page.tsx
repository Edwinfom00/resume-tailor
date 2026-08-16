import { notFound } from "next/navigation";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/locales";
import type { ResumeData } from "@/@types/resume-data";
import {
  ResumeDocument,
  type ResumeDocumentPage,
} from "@/modules/components/resume-document";
import { ResumeHeader } from "@/modules/components/sections/resume-header";
import { ResumeProfile } from "@/modules/components/sections/resume-profile";
import { edwinResume } from "@/modules/fixtures/edwin-resume";

type LocalePageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export default async function ResumePreview({ params }: LocalePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale);
  const previewPages: readonly ResumeDocumentPage<ResumeData>[] = [
    {
      id: "resume-preview",
      render: (resume) => (
        <>
          <ResumeHeader resume={resume} />
          <ResumeProfile
            resume={resume}
            title={dictionary.resume.profile.title}
          />
        </>
      ),
    },
  ];

  return (
    <main className="relative flex flex-1 bg-canvas">
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher
          label={dictionary.languageSwitcher.label}
          locale={locale}
        />
      </div>
      <ResumeDocument data={edwinResume} pages={previewPages} />
    </main>
  );
}
