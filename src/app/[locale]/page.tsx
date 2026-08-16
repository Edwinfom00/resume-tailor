import Image from "next/image";
import { notFound } from "next/navigation";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/locales";

type LocalePageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export default async function Home({ params }: LocalePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale);

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-1 flex-col items-center justify-between bg-white px-16 py-16 dark:bg-black sm:items-start sm:py-32">
        <div className="flex w-full items-center justify-between gap-6">
          <Image
            className="h-5 w-25 dark:invert"
            src="/next.svg"
            alt={dictionary.home.logoAlt}
            width={100}
            height={20}
            priority
          />
          <LanguageSwitcher
            locale={locale}
            label={dictionary.languageSwitcher.label}
          />
        </div>
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <p className="text-sm font-semibold tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-400">
            {dictionary.home.eyebrow}
          </p>
          <h1 className="max-w-xl text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            {dictionary.home.title}
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {dictionary.home.description}
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[180px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            {dictionary.home.primaryAction}
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[180px]"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            {dictionary.home.secondaryAction}
          </a>
        </div>
      </main>
    </div>
  );
}
