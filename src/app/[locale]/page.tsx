import { notFound } from "next/navigation";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/locales";
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
    <main className="relative flex flex-1 bg-canvas">
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher
          label={dictionary.languageSwitcher.label}
          locale={locale}
        />
      </div>
      <ResumePreviewDocument dictionary={dictionary} resume={edwinResume} />
    </main>
  );
}
