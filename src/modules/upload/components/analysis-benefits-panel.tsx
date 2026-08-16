import {
  FiBriefcase,
  FiFileText,
  FiLock,
  FiTarget,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import type { IconType } from "react-icons";
import type { Messages } from "@/i18n/messages/types";

type AnalysisBenefitsPanelProps = Readonly<{
  messages: Messages["analysisBenefits"];
}>;

type Benefit = Readonly<{
  description: string;
  icon: IconType;
  title: string;
  tone: string;
}>;

export function AnalysisBenefitsPanel({ messages }: AnalysisBenefitsPanelProps) {
  const benefits: readonly Benefit[] = [
    {
      description: messages.sectionRecommendationsDescription,
      icon: HiSparkles,
      title: messages.sectionRecommendationsTitle,
      tone: "bg-surface-brand text-brand",
    },
    {
      description: messages.skillsGapDescription,
      icon: FiTarget,
      title: messages.skillsGapTitle,
      tone: "bg-success-50 text-positive",
    },
    {
      description: messages.projectPrioritizationDescription,
      icon: FiBriefcase,
      title: messages.projectPrioritizationTitle,
      tone: "bg-caution-subtle text-caution",
    },
    {
      description: messages.atsOptimizationDescription,
      icon: FiFileText,
      title: messages.atsOptimizationTitle,
      tone: "bg-surface-brand text-brand",
    },
  ];

  return (
    <aside className="rounded-xl border border-line-subtle bg-surface p-(--rt-space-5) shadow-xs">
      <div className="flex items-center gap-(--rt-space-3)">
        <HiSparkles aria-hidden="true" className="h-6 w-6 text-brand" />
        <h2 className="text-lg font-bold tracking-tight text-ink">{messages.heading}</h2>
      </div>
      <p className="mt-(--rt-space-4) text-sm leading-relaxed text-ink-muted">
        {messages.description}
      </p>

      <ul className="mt-(--rt-space-5) space-y-(--rt-space-4)">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <li key={benefit.title} className="flex items-start gap-(--rt-space-3)">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${benefit.tone}`}>
                <Icon aria-hidden="true" className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">{benefit.title}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-ink-muted">
                  {benefit.description}
                </span>
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-(--rt-space-5) flex items-start gap-(--rt-space-3) rounded-lg border border-line-subtle bg-canvas p-(--rt-space-3)">
        <FiLock aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ink-muted" />
        <div>
          <h3 className="text-sm font-semibold text-ink">{messages.privacyTitle}</h3>
          <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">
            {messages.privacyDescription}
          </p>
        </div>
      </div>
    </aside>
  );
}
