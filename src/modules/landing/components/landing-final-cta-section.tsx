import Link from "next/link";
import type { Locale } from "@/i18n/locales";
import type { LandingHome } from "@/modules/landing/components/landing-types";

type LandingFinalCtaSectionProps = Readonly<{
  home: LandingHome;
  locale: Locale;
}>;

export function LandingFinalCtaSection({ home, locale }: LandingFinalCtaSectionProps) {
  const { finalCta } = home;

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-surface via-surface to-surface-subtle px-(--rt-page-gutter) pb-(--rt-space-32) pt-(--rt-space-32)">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-brand-subtle/25 blur-3xl" />
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="font-display text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
          {finalCta.title}
        </h2>
        <p className="mx-auto mt-(--rt-space-5) max-w-xl text-base leading-relaxed text-ink-muted">
          {finalCta.description}
        </p>
        <Link
          href={`/${locale}/upload`}
          className="mt-(--rt-space-8) inline-flex h-(--rt-control-height-lg) items-center justify-center rounded-full bg-ink px-(--rt-space-6) text-sm font-semibold text-white transition-opacity duration-(--rt-duration-fast) hover:opacity-90"
        >
          {finalCta.action}
        </Link>
      </div>
    </section>
  );
}
