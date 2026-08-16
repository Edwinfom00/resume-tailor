import { NextResponse } from "next/server";
import {
  isLocale,
  localeCookieMaxAge,
  localeCookieName,
} from "@/i18n/locales";

export function POST(request: Request) {
  const locale = new URL(request.url).searchParams.get("locale");

  if (!locale || !isLocale(locale)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }

  const response = new NextResponse(null, { status: 204 });

  response.cookies.set({
    name: localeCookieName,
    value: locale,
    maxAge: localeCookieMaxAge,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
