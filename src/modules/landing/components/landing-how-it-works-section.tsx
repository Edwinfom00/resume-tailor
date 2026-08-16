import type { ReactNode } from "react";
import {
  JobOfferWorkflowVisual,
  RecommendationsWorkflowVisual,
  UploadWorkflowVisual,
} from "@/modules/landing/components/landing-workflow-visuals";
import type { LandingHome, LabelledItem } from "@/modules/landing/components/landing-types";

type LandingHowItWorksSectionProps = Readonly<{
  home: LandingHome;
}>;

const partnerRows = [
  {
    partners: ["Google", "Microsoft", "amazon", "airbnb", "snowflake", "stripe"],
    reverse: false,
  },
  {
    partners: ["Microsoft", "airbnb", "Google", "stripe", "amazon", "snowflake"],
    reverse: true,
  },
] as const;

function WorkflowCard({
  item,
  visual,
}: Readonly<{
  item: LabelledItem;
  visual: ReactNode;
}>) {
  return (
    <li className="flex flex-col px-(--rt-space-5) py-(--rt-space-8) text-center sm:px-(--rt-space-8)">
      <div className="flex h-(--rt-workflow-visual-height) items-center justify-center overflow-hidden">
        {visual}
      </div>
      <h3 className="mt-(--rt-space-6) text-base font-semibold text-ink">{item.title}</h3>
      <p className="mx-auto mt-(--rt-space-3) max-w-sm text-sm leading-relaxed text-ink-muted">
        {item.description}
      </p>
    </li>
  );
}

export function LandingHowItWorksSection({ home }: LandingHowItWorksSectionProps) {
  return (
    <section id="how-it-works" className="scroll-mt-(--rt-space-8) overflow-hidden bg-surface py-(--rt-space-24)">
      <div className="mx-auto max-w-(--rt-landing-preview-max) px-(--rt-page-gutter)">
        <p className="text-center text-xs font-semibold uppercase tracking-(--rt-letter-spacing-wide) text-ink-subtle">
          {home.trustLabel}
        </p>
        <div className="relative mt-(--rt-space-10) space-y-(--rt-space-6)">
          {partnerRows.map((row, index) => (
            <div key={index} className="overflow-hidden">
              <ul
                aria-hidden="true"
                className={`rt-logo-marquee-track flex items-center gap-x-(--rt-space-16) pr-(--rt-space-16) text-xl font-semibold tracking-tight text-ink-subtle opacity-60 ${row.reverse ? "rt-logo-marquee-track-reverse" : ""}`}
              >
                {[...row.partners, ...row.partners].map((partner, partnerIndex) => (
                  <li key={`${partner}-${partnerIndex}`}>{partner}</li>
                ))}
              </ul>
            </div>
          ))}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-(--rt-space-24) bg-linear-to-r from-surface to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-(--rt-space-24) bg-linear-to-l from-surface to-transparent" />
        </div>
      </div>

      <div className="mx-auto mt-(--rt-space-24) max-w-(--rt-container-max) px-(--rt-page-gutter)">
        <div className="grid gap-(--rt-space-10) lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-(--rt-letter-spacing-wide) text-ink-subtle">
              {home.workflow.eyebrow}
            </p>
            <h2 className="mt-(--rt-space-4) max-w-3xl font-display text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
              {home.workflow.showcaseTitle}
            </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-ink-muted lg:mb-(--rt-space-2)">
            {home.workflow.description}
          </p>
        </div>
        <ol className="mt-(--rt-space-16) overflow-hidden rounded-panel border border-line-subtle bg-surface md:grid md:grid-cols-3 md:divide-x md:divide-line-subtle">
          <WorkflowCard item={home.workflow.upload} visual={<UploadWorkflowVisual />} />
          <WorkflowCard item={home.workflow.jobOffer} visual={<JobOfferWorkflowVisual />} />
          <WorkflowCard item={home.workflow.recommendations} visual={<RecommendationsWorkflowVisual />} />
        </ol>
      </div>
    </section>
  );
}
