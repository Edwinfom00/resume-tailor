import "server-only";

import { cache } from "react";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages/types";

const dictionaryLoaders: Record<Locale, () => Promise<Messages>> = {
  en: () => import("@/i18n/messages/en").then((module) => module.messages),
  fr: () => import("@/i18n/messages/fr").then((module) => module.messages),
  de: () => import("@/i18n/messages/de").then((module) => module.messages),
};

export const getDictionary = cache(async (locale: Locale): Promise<Messages> =>
  dictionaryLoaders[locale](),
);
