import { notFound } from "next/navigation";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/locales";
import { ResumeDownloadButton } from "@/modules/resume/components/resume-download-button";
import { ResumePreviewDocument } from "@/modules/resume/components/resume-preview-document";
import { edwinResume } from "@/modules/resume/fixtures/edwin-resume";

type LocalePageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export default async function ResumePreview({ params }: LocalePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale);
  return (
    <main className="flex flex-1 flex-col bg-canvas">
      <div className="flex shrink-0 justify-end gap-2 p-4">
        <LanguageSwitcher
          label={dictionary.languageSwitcher.label}
          locale={locale}
        />
        <ResumeDownloadButton {...dictionary.resumeExport} />
      </div>
      <ResumePreviewDocument dictionary={dictionary} resume={edwinResume} />
    </main>
  );
}
