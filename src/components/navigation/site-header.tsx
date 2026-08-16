import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import {
  NavigationBar,
  type NavigationBarItem,
} from "@/components/navigation/navigation-bar";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages/types";

type SiteHeaderProps = Readonly<{
  locale: Locale;
  languageSwitcherLabel: string;
  navigation: Messages["navigation"];
}>;

function ChevronDownIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-3 w-3"
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

export function SiteHeader({
  languageSwitcherLabel,
  locale,
  navigation,
}: SiteHeaderProps) {
  const navigationItems: readonly NavigationBarItem[] = [
    { href: `/${locale}#features`, label: navigation.features },
    { href: `/${locale}#how-it-works`, label: navigation.howItWorks },
    { href: `/${locale}#benefits`, label: navigation.benefits },
    { href: `/${locale}#pricing`, label: navigation.pricing },
    {
      href: `/${locale}#resources`,
      label: navigation.resources,
      trailingContent: <ChevronDownIcon />,
    },
  ];

  return (
    <NavigationBar
      brand={
        <Link
          href={`/${locale}`}
          className="rounded-md"
          aria-label={navigation.homeLabel}
        >
          <Logo
            size="sm"
            nameClassName="hidden font-bold sm:inline"
            preload
          />
        </Link>
      }
      label={navigation.primaryLabel}
      items={navigationItems}
      actions={
        <>
          <LanguageSwitcher
            label={languageSwitcherLabel}
            locale={locale}
          />
          <Link
            href={`/${locale}#tailor-your-resume`}
            className="inline-flex h-(--rt-control-height-sm) items-center justify-center rounded-md bg-brand px-(--rt-space-5) text-sm font-semibold text-white shadow-xs transition-colors duration-(--rt-duration-fast) hover:bg-brand-hover"
          >
            {navigation.getStarted}
          </Link>
        </>
      }
    />
  );
}
