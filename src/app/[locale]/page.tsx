import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/locales";
import { UploadPageContent } from "@/modules/upload/components/upload-page-content";

type LocalePageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export default async function UploadResume({ params }: LocalePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale);

  return <UploadPageContent dictionary={dictionary} locale={locale} />;
}
