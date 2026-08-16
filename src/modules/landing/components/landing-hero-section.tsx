import Link from "next/link";
import type { ReactNode } from "react";
import { FiPlayCircle, FiShield, FiSun, FiTarget, FiUpload } from "react-icons/fi";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages/types";
import { LandingStudioPreview } from "@/modules/landing/components/landing-studio-preview";
import type { LabelledItem } from "@/modules/landing/components/landing-types";

type LandingHeroSectionProps = Readonly<{
  dictionary: Messages;
  locale: Locale;
}>;

function Pillar({
  icon,
  item,
}: Readonly<{
  icon: ReactNode;
  item: LabelledItem;
}>) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="inline-flex h-(--rt-control-height-sm) w-(--rt-control-height-sm) shrink-0 items-center justify-center rounded-full bg-surface-brand text-brand">
        {icon}
      </span>
      <div className="mt-(--rt-space-2)">
        <h2 className="text-sm font-semibold text-ink">{item.title}</h2>
        <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">{item.description}</p>
      </div>
    </div>
  );
}

export function LandingHeroSection({ dictionary, locale }: LandingHeroSectionProps) {
  const { home } = dictionary;

  return (
    <section id="tailor-your-resume" className="scroll-mt-(--rt-space-8) border-b border-line-subtle bg-surface">
      <div className="mx-auto max-w-(--rt-landing-preview-max) px-(--rt-page-gutter) py-(--rt-space-20) lg:py-(--rt-space-24)">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex rounded-full border border-line-subtle bg-canvas px-(--rt-space-3) py-(--rt-space-1) text-xs font-semibold text-brand shadow-xs">
            {home.eyebrow}
          </p>
          <h1 className="mt-(--rt-space-4) max-w-3xl text-5xl font-bold leading-tight tracking-tight text-ink">
            {home.title}
            <span className="block text-brand">{home.titleAccent}</span>
          </h1>
          <p className="mx-auto mt-(--rt-space-5) max-w-2xl text-base leading-relaxed text-ink-muted">
            {home.description}
          </p>
          <div className="mt-(--rt-space-8) flex flex-col gap-(--rt-space-3) sm:flex-row sm:justify-center">
            <Link
              href={`/${locale}/upload`}
              className="inline-flex h-(--rt-control-height-lg) items-center justify-center gap-(--rt-space-2) rounded-md bg-brand px-(--rt-space-5) text-sm font-semibold text-white shadow-brand transition-colors duration-(--rt-duration-fast) hover:bg-brand-hover"
            >
              <FiUpload aria-hidden="true" className="h-4 w-4" />
              {home.primaryAction}
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex h-(--rt-control-height-lg) items-center justify-center gap-(--rt-space-2) rounded-md border border-line bg-surface px-(--rt-space-5) text-sm font-semibold text-ink shadow-xs transition-colors duration-(--rt-duration-fast) hover:bg-surface-subtle"
            >
              <FiPlayCircle aria-hidden="true" className="h-4 w-4" />
              {home.secondaryAction}
            </Link>
          </div>
        </div>
        <LandingStudioPreview dictionary={dictionary} locale={locale} />
        <div className="mx-auto mt-(--rt-space-10) grid max-w-2xl gap-(--rt-space-5) text-center sm:grid-cols-3">
          <Pillar icon={<FiTarget aria-hidden="true" className="h-4 w-4" />} item={home.pillars.matching} />
          <Pillar icon={<FiSun aria-hidden="true" className="h-4 w-4" />} item={home.pillars.recommendations} />
          <Pillar icon={<FiShield aria-hidden="true" className="h-4 w-4" />} item={home.pillars.ats} />
        </div>
      </div>
    </section>
  );
}
