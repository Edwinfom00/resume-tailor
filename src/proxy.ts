import { NextResponse, type NextRequest } from "next/server";
import {
  getPreferredLocale,
  isLocale,
  localeCookieName,
} from "@/i18n/locales";

function hasLocalePrefix(pathname: string) {
  const [, locale] = pathname.split("/");

  return isLocale(locale ?? "");
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (hasLocalePrefix(pathname)) {
    return NextResponse.next();
  }

  const savedLocale = request.cookies.get(localeCookieName)?.value;
  const locale = isLocale(savedLocale ?? "")
    ? savedLocale
    : getPreferredLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();

  url.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/((?!api|_next|.*\\..*).*)",
};
