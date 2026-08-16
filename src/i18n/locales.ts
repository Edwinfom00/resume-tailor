export const locales = ["en", "fr", "de"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeCookieName = "resume-tailor-locale";

export const localeCookieMaxAge = 60 * 60 * 24 * 365;

export const localeOptions: ReadonlyArray<{
  code: Locale;
  label: string;
}> = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getPreferredLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) {
    return defaultLocale;
  }

  const preferences = acceptLanguage
    .split(",")
    .map((entry, index) => {
      const [tag, ...parameters] = entry.trim().toLowerCase().split(";");
      const qualityParameter = parameters.find((parameter) =>
        parameter.trim().startsWith("q="),
      );
      const quality = qualityParameter
        ? Number.parseFloat(qualityParameter.trim().slice(2))
        : 1;

      return {
        tag,
        quality: Number.isFinite(quality) ? quality : 0,
        index,
      };
    })
    .filter(({ tag, quality }) => tag && tag !== "*" && quality > 0)
    .sort((first, second) => second.quality - first.quality || first.index - second.index);

  for (const { tag } of preferences) {
    if (isLocale(tag)) {
      return tag;
    }

    const [language] = tag.split("-");

    if (isLocale(language)) {
      return language;
    }
  }

  return defaultLocale;
}
