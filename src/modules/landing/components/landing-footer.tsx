import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import type { Locale } from "@/i18n/locales";
import type { LandingHome, LandingNavigation } from "@/modules/landing/components/landing-types";

type LandingFooterProps = Readonly<{
  home: LandingHome;
  locale: Locale;
  navigation: LandingNavigation;
}>;

type FooterLink = Readonly<{
  href: string;
  label: string;
}>;

function FooterColumn({ label, links }: Readonly<{ label: string; links: readonly FooterLink[] }>) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-ink">{label}</h2>
      <ul className="mt-(--rt-space-5) space-y-(--rt-space-3)">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-ink-muted transition-colors hover:text-brand">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LandingFooter({ home, locale, navigation }: LandingFooterProps) {
  const { footer, pricing } = home;

  const columns: readonly { label: string; links: readonly FooterLink[] }[] = [
    {
      label: footer.productLabel,
      links: [
        { href: "#features", label: navigation.features },
        { href: "#pricing", label: navigation.pricing },
      ],
    },
    {
      label: footer.workflowLabel,
      links: [
        { href: "#how-it-works", label: navigation.howItWorks },
        { href: "#testimonials", label: home.testimonials.eyebrow },
        { href: `/${locale}/upload`, label: navigation.getStarted },
      ],
    },
    {
      label: footer.commitmentsLabel,
      links: [
        { href: "#faq-group-1", label: pricing.privacy.title },
        { href: "#faq-group-2", label: pricing.openSource.title },
        { href: "#pricing", label: pricing.free.title },
      ],
    },
    {
      label: footer.resourcesLabel,
      links: [{ href: "#faq", label: navigation.faq }],
    },
  ];

  return (
    <footer id="resources" className="relative z-10 -mt-(--rt-space-16) scroll-mt-(--rt-space-8) bg-surface-subtle px-(--rt-page-gutter) pb-(--rt-space-24) pt-0">
      <div className="mx-auto max-w-(--rt-container-max) rounded-panel border border-line-subtle bg-surface px-(--rt-space-6) py-(--rt-space-10) sm:px-(--rt-space-10) lg:px-(--rt-space-12)">
        <div className="grid gap-x-(--rt-space-10) gap-y-(--rt-space-10) lg:grid-cols-[minmax(13rem,1.35fr)_repeat(4,minmax(0,0.8fr))]">
          <div className="max-w-xs">
            <Link href={`/${locale}`} aria-label={navigation.homeLabel} className="inline-flex rounded-md">
              <Logo size="sm" nameClassName="font-bold" />
            </Link>
            <p className="mt-(--rt-space-5) text-sm leading-relaxed text-ink-muted">{footer.description}</p>
            <ul className="mt-(--rt-space-6) flex flex-wrap gap-(--rt-space-2)">
              {footer.badges.map((badge) => (
                <li key={badge} className="rounded-full border border-line-subtle bg-canvas px-(--rt-space-3) py-1 text-xs text-ink-muted">
                  {badge}
                </li>
              ))}
            </ul>
          </div>

          {columns.map((column) => (
            <FooterColumn key={column.label} label={column.label} links={column.links} />
          ))}
        </div>

        <div className="mt-(--rt-space-12) flex flex-col gap-(--rt-space-4) border-t border-line-subtle pt-(--rt-space-6) text-xs text-ink-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.copyright}</p>
          <div className="flex gap-(--rt-space-5)">
            <Link href="#faq-group-1" className="transition-colors hover:text-brand">{pricing.privacy.title}</Link>
            <a
              href="https://github.com/Edwinfom00/resume-tailor"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-brand"
            >
              {pricing.openSource.title}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
