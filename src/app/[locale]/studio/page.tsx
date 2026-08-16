import { notFound } from "next/navigation";
import { StudioPageContent } from "@/modules/studio/components/studio-page-content";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/locales";

type StudioPageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export default async function StudioPage({ params }: StudioPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale);

  return <StudioPageContent dictionary={dictionary} locale={locale} />;
}
