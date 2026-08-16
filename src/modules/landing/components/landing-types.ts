import type { Messages } from "@/i18n/messages/types";

export type LandingHome = Messages["home"];
export type LandingNavigation = Messages["navigation"];
export type LabelledItem = Readonly<LandingHome["features"]["profile"]>;
