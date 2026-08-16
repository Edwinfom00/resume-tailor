"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  localeOptions,
  type Locale,
} from "@/i18n/locales";
import { getLocalizedPathname } from "@/i18n/routing";

type LanguageSwitcherProps = Readonly<{
  locale: Locale;
  label: string;
}>;

export function LanguageSwitcher({ locale, label }: LanguageSwitcherProps) {
  const pathname = usePathname();

  function persistLocale(nextLocale: Locale) {
    void fetch(`/api/locale?locale=${nextLocale}`, {
      method: "POST",
      keepalive: true,
    });
  }

  return (
    <nav aria-label={label} className="flex items-center gap-2">
      {localeOptions.map((option) => (
        <Link
          key={option.code}
          href={getLocalizedPathname(option.code, pathname)}
          onClick={() => persistLocale(option.code)}
          aria-current={option.code === locale ? "page" : undefined}
          className={`rounded-md px-2 py-1 text-sm font-medium transition-colors ${
            option.code === locale
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          }`}
        >
          {option.label}
        </Link>
      ))}
    </nav>
  );
}
