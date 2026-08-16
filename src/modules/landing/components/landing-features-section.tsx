import type { ReactNode } from "react";
import {
  ExportReadinessVisual,
  ProfileOptimizationVisual,
  ProjectsPriorityVisual,
  SkillsSuggestionsVisual,
} from "@/modules/landing/components/landing-feature-visuals";
import type { LandingHome, LabelledItem } from "@/modules/landing/components/landing-types";

type LandingFeaturesSectionProps = Readonly<{
  home: LandingHome;
}>;

function FeatureShowcaseCard({
  item,
  visual,
}: Readonly<{
  item: LabelledItem;
  visual: ReactNode;
}>) {
  return (
    <article className="flex h-(--rt-feature-panel-height) flex-col overflow-hidden rounded-panel border border-line-subtle bg-surface p-(--rt-space-6)">
      <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
      <p className="mt-(--rt-space-2) max-w-xl text-base leading-relaxed text-ink-muted">
        {item.description}
      </p>
      <div className="mt-(--rt-space-6) min-h-0 flex-1">{visual}</div>
    </article>
  );
}

export function LandingFeaturesSection({ home }: LandingFeaturesSectionProps) {
  return (
    <section id="features" className="scroll-mt-(--rt-space-8) bg-canvas px-(--rt-page-gutter) py-(--rt-space-24)">
      <div className="mx-auto max-w-(--rt-container-max)">
        <div className="grid gap-(--rt-space-10) lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
          <h2 className="max-w-3xl font-display text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
            {home.features.title}
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-ink-muted lg:mt-(--rt-space-2)">
            {home.features.description}
          </p>
        </div>
        <div className="mt-(--rt-space-16) grid gap-(--rt-space-5) md:grid-cols-2">
          <FeatureShowcaseCard item={home.features.profile} visual={<ProfileOptimizationVisual />} />
          <FeatureShowcaseCard item={home.features.skills} visual={<SkillsSuggestionsVisual />} />
          <FeatureShowcaseCard item={home.features.projects} visual={<ProjectsPriorityVisual />} />
          <FeatureShowcaseCard item={home.features.export} visual={<ExportReadinessVisual />} />
        </div>
      </div>
    </section>
  );
}
