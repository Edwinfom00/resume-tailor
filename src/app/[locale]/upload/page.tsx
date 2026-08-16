import { notFound } from "next/navigation";
import { UploadPageContent } from "@/modules/upload/components/upload-page-content";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/locales";

type UploadPageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export default async function UploadPage({ params }: UploadPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale);

  return <UploadPageContent dictionary={dictionary} locale={locale} />;
}
