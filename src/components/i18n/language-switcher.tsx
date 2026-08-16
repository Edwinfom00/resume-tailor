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

const localeFlags: Record<Locale, string> = {
  en: "🇺🇸",
  fr: "🇫🇷",
  de: "🇩🇪",
};

function ChevronDownIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-3 w-3 transition-transform duration-(--rt-duration-fast) group-open:rotate-180"
      fill="none"
      viewBox="0 0 12 12"
    >
      <path
        d="m3 4.5 3 3 3-3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function LanguageSwitcher({ locale, label }: LanguageSwitcherProps) {
  const pathname = usePathname();

  function persistLocale(nextLocale: Locale) {
    void fetch(`/api/locale?locale=${nextLocale}`, {
      method: "POST",
      keepalive: true,
    });
  }

  return (
    <details className="group relative">
      <summary
        aria-label={label}
        className="flex h-(--rt-control-height-sm) cursor-pointer list-none items-center gap-(--rt-space-2) rounded-md border border-line-subtle bg-surface px-(--rt-space-3) text-sm font-medium text-ink transition-colors duration-(--rt-duration-fast) hover:border-line hover:bg-surface-subtle [&::-webkit-details-marker]:hidden"
      >
        <span aria-hidden="true" className="text-base leading-none">
          {localeFlags[locale]}
        </span>
        <span className="text-xs uppercase tracking-(--rt-letter-spacing-wide)">
          {locale}
        </span>
        <ChevronDownIcon />
      </summary>
      <nav
        aria-label={label}
        className="absolute right-0 z-10 mt-(--rt-space-2) w-44 rounded-md border border-line-subtle bg-surface p-(--rt-space-2) shadow-md"
      >
        {localeOptions.map((option) => (
          <Link
            key={option.code}
            href={getLocalizedPathname(option.code, pathname)}
            onClick={() => persistLocale(option.code)}
            aria-current={option.code === locale ? "page" : undefined}
            className={`flex items-center gap-(--rt-space-3) rounded-md px-(--rt-space-3) py-(--rt-space-2) text-sm font-medium transition-colors duration-(--rt-duration-fast) ${option.code === locale
              ? "bg-surface-brand text-brand"
              : "text-ink-muted hover:bg-surface-subtle hover:text-ink"
              }`}
          >
            <span aria-hidden="true" className="text-base leading-none">
              {localeFlags[option.code]}
            </span>
            <span>{option.label}</span>
          </Link>
        ))}
      </nav>
    </details>
  );
}
