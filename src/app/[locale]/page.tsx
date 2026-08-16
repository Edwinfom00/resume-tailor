import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/navigation/site-header";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/locales";
import { LandingPageContent } from "@/modules/landing/components/landing-page-content";

type LocalePageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export default async function UploadResume({ params }: LocalePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale);

  return (
    <>
      <SiteHeader
        languageSwitcherLabel={dictionary.languageSwitcher.label}
        locale={locale}
        navigation={dictionary.navigation}
      />
      <LandingPageContent dictionary={dictionary} locale={locale} />
    </>
  );
}
