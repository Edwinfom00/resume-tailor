import { Fragment } from "react";
import type { Messages } from "@/i18n/messages/types";

type AnalysisWorkflowStepsProps = Readonly<{
  messages: Messages["upload"];
}>;

export function AnalysisWorkflowSteps({ messages }: AnalysisWorkflowStepsProps) {
  const steps = [
    {
      description: messages.workflow.uploadDescription,
      title: messages.workflow.uploadTitle,
    },
    {
      description: messages.workflow.offerDescription,
      title: messages.workflow.offerTitle,
    },
    {
      description: messages.workflow.recommendationsDescription,
      title: messages.workflow.recommendationsTitle,
    },
  ];

  return (
    <section className="rounded-md border border-line-subtle bg-surface p-(--rt-space-5) shadow-xs">
      <ol className="grid grid-cols-1 gap-(--rt-space-4) md:grid-cols-[minmax(0,1fr)_var(--rt-workflow-connector-width)_minmax(0,1fr)_var(--rt-workflow-connector-width)_minmax(0,1fr)] md:gap-0">
        {steps.map((step, index) => (
          <Fragment key={step.title}>
            <li className="flex min-w-0 items-start gap-(--rt-space-3)">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white shadow-brand">
                {index + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink">{step.title}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-ink-muted">
                  {step.description}
                </span>
              </span>
            </li>
            {index < steps.length - 1 ? (
              <li
                aria-hidden="true"
                className="hidden h-8 items-center md:flex"
              >
                <span className="w-full border-t border-dashed border-brand-line" />
              </li>
            ) : null}
          </Fragment>
        ))}
      </ol>
    </section>
  );
}
