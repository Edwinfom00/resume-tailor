import Link from "next/link";
import type { ReactNode } from "react";
import { FiArrowRight, FiCode, FiHeart, FiLock } from "react-icons/fi";
import type { Locale } from "@/i18n/locales";
import type { LandingHome, LabelledItem } from "@/modules/landing/components/landing-types";

type LandingPricingSectionProps = Readonly<{
  home: LandingHome;
  locale: Locale;
}>;

function PricingPromise({
  icon,
  item,
}: Readonly<{
  icon: ReactNode;
  item: LabelledItem;
}>) {
  return (
    <li className="flex gap-(--rt-space-4)">
      <span className="inline-flex h-(--rt-control-height-md) w-(--rt-control-height-md) shrink-0 items-center justify-center rounded-md bg-surface-brand text-brand">
        {icon}
      </span>
      <div>
        <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">{item.description}</p>
      </div>
    </li>
  );
}

export function LandingPricingSection({ home, locale }: LandingPricingSectionProps) {
  const { pricing } = home;

  return (
    <section id="pricing" className="scroll-mt-(--rt-space-8) bg-surface px-(--rt-page-gutter) py-(--rt-space-24)">
      <div className="mx-auto max-w-(--rt-container-max)">
        <div className="grid gap-(--rt-space-10) lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-(--rt-letter-spacing-wide) text-ink-subtle">
              {pricing.eyebrow}
            </p>
            <h2 className="mt-(--rt-space-4) max-w-3xl font-display text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
              {pricing.title}
            </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-ink-muted lg:mb-(--rt-space-2)">
            {pricing.description}
          </p>
        </div>

        <article className="mt-(--rt-space-16) overflow-hidden rounded-panel border border-line-subtle bg-surface shadow-sm lg:grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="flex flex-col justify-between bg-brand p-(--rt-space-8) text-white sm:p-(--rt-space-10)">
            <div>
              <p className="text-sm font-semibold text-white/80">{pricing.planName}</p>
              <div className="mt-(--rt-space-8) flex items-end gap-(--rt-space-3)">
                <span className="text-6xl font-bold leading-none tracking-tight">{pricing.price}</span>
                <span className="mb-(--rt-space-2) text-sm font-medium text-white/75">{pricing.cadence}</span>
              </div>
            </div>
            <FiHeart aria-hidden="true" className="mt-(--rt-space-12) h-8 w-8 text-white/70" />
          </div>

          <div className="p-(--rt-space-8) sm:p-(--rt-space-10)">
            <ul className="space-y-(--rt-space-6)">
              <PricingPromise icon={<FiLock aria-hidden="true" className="h-4 w-4" />} item={pricing.privacy} />
              <PricingPromise icon={<FiCode aria-hidden="true" className="h-4 w-4" />} item={pricing.openSource} />
              <PricingPromise icon={<FiHeart aria-hidden="true" className="h-4 w-4" />} item={pricing.free} />
            </ul>
            <div className="mt-(--rt-space-8) border-t border-line-subtle pt-(--rt-space-6)">
              <Link
                href={`/${locale}/upload`}
                className="inline-flex h-(--rt-control-height-lg) items-center justify-center gap-(--rt-space-2) rounded-md bg-brand px-(--rt-space-5) text-sm font-semibold text-white shadow-brand transition-colors duration-(--rt-duration-fast) hover:bg-brand-hover"
              >
                {pricing.action}
                <FiArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <p className="mt-(--rt-space-3) text-xs text-ink-subtle">{pricing.note}</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
