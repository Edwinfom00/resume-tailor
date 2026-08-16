import { isLocale, type Locale } from "@/i18n/locales";

function normalizePathname(pathname: string) {
  const value = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const segments = value.split("/");

  if (isLocale(segments[1] ?? "")) {
    const pathWithoutLocale = `/${segments.slice(2).join("/")}`;
    return pathWithoutLocale === "/" ? pathWithoutLocale : pathWithoutLocale.replace(/\/$/, "");
  }

  return value === "/" ? value : value.replace(/\/$/, "");
}

export function getLocalizedPathname(locale: Locale, pathname: string) {
  const normalizedPathname = normalizePathname(pathname);

  return normalizedPathname === "/"
    ? `/${locale}`
    : `/${locale}${normalizedPathname}`;
}
