import {
  FiAlertTriangle,
  FiBriefcase,
  FiCheckCircle,
  FiExternalLink,
  FiInfo,
  FiLoader,
  FiMapPin,
  FiMoreHorizontal,
} from "react-icons/fi";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { formatTemplate } from "@/modules/shared/ui/format-template";
import type {
  StudioJobOfferView,
  StudioRequirementView,
} from "@/modules/studio/view-models/job-offer-view";
import type { Messages } from "@/i18n/messages/types";

type JobOfferPanelProps = Readonly<{
  isReanalyzing: boolean;
  messages: Messages["studio"]["jobOffer"];
  jobOffer?: StudioJobOfferView;
  recalculatingLabel: string;
}>;

function RequirementStatus({
  requirement,
  messages,
}: Readonly<{
  requirement: StudioRequirementView;
  messages: Messages["studio"]["jobOffer"];
}>) {
  const isMatched = requirement.status === "matched";

  return (
    <li className="flex items-center gap-(--rt-space-2)">
      {isMatched ? (
        <FiCheckCircle aria-hidden="true" className="h-4 w-4 shrink-0 text-positive" />
      ) : (
        <FiAlertTriangle aria-hidden="true" className="h-4 w-4 shrink-0 text-caution" />
      )}
      <span className="min-w-0 flex-1 text-sm text-ink-muted">{requirement.name}</span>
      <span
        className={`rounded-pill px-(--rt-space-2) py-0.5 text-xs font-medium ${isMatched
            ? "bg-success-50 text-positive"
            : "bg-caution-subtle text-caution"
          }`}
      >
        {isMatched ? messages.matchedLabel : messages.missingLabel}
      </span>
    </li>
  );
}

export function JobOfferPanel({
  isReanalyzing,
  messages,
  jobOffer,
  recalculatingLabel,
}: JobOfferPanelProps) {
  return (
    <aside
      aria-busy={isReanalyzing}
      className={`relative flex h-(--rt-studio-panel-min-height) w-full flex-col overflow-hidden rounded-md border border-line-subtle bg-surface p-(--rt-space-5) shadow-xs ${isReanalyzing ? "rt-animate-float shadow-md" : ""
        }`}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-line-subtle pb-(--rt-space-4)">
        <h1 className="flex items-center gap-(--rt-space-3) text-lg font-bold tracking-tight text-ink">
          <FiBriefcase aria-hidden="true" className="h-5 w-5 text-brand" />
          {messages.title}
        </h1>
        <button
          type="button"
          aria-label={messages.optionsLabel}
          className="rounded-md p-1 text-ink-muted transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand hover:text-brand"
        >
          <FiMoreHorizontal aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      {jobOffer ? (
        <div className="scrollbar-hidden mt-(--rt-space-4) min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <section className="rt-animate-rise rounded-lg border border-line-subtle bg-canvas p-(--rt-space-4) shadow-xs">
            <div className="flex gap-(--rt-space-3)">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-surface-brand text-brand">
                <HiBuildingOffice2 aria-hidden="true" className="h-8 w-8" />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-base font-bold tracking-tight text-ink">
                  {jobOffer.title || messages.notDetectedLabel}
                </h2>
                <p className="mt-0.5 flex items-center gap-(--rt-space-2) text-sm font-semibold text-ink-muted">
                  {jobOffer.company || messages.notDetectedLabel}
                  <FiCheckCircle aria-hidden="true" className="h-4 w-4 text-brand" />
                </p>
                {jobOffer.location || jobOffer.type ? (
                  <p className="mt-1 flex flex-wrap items-center gap-x-(--rt-space-2) text-xs text-ink-muted">
                    {jobOffer.location ? (
                      <span className="inline-flex items-center gap-1">
                        <FiMapPin aria-hidden="true" className="h-3.5 w-3.5" />
                        {jobOffer.location}
                      </span>
                    ) : null}
                    {jobOffer.location && jobOffer.type ? (
                      <span aria-hidden="true">•</span>
                    ) : null}
                    {jobOffer.type ? <span>{jobOffer.type}</span> : null}
                  </p>
                ) : null}
                <p className="mt-1 text-xs text-ink-muted">
                  {formatTemplate(messages.extractedOnLabel, {
                    date: jobOffer.extractedOn,
                  })}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-(--rt-space-5)">
            <div className="flex items-center justify-between gap-(--rt-space-3)">
              <h2 className="text-sm font-bold text-ink">
                {messages.detectedRequirementsLabel}
              </h2>
              {jobOffer.totalRequirements > 0 ? (
                <span className="rounded-pill bg-surface-subtle px-(--rt-space-2) py-0.5 text-xs font-semibold text-ink-muted">
                  {jobOffer.matchedRequirements}/{jobOffer.totalRequirements}{" "}
                  {messages.matchedSummarySuffix}
                </span>
              ) : null}
            </div>
            {jobOffer.requirements.length > 0 ? (
              <ul className="mt-(--rt-space-4) space-y-(--rt-space-3)">
                {jobOffer.requirements.map((requirement) => (
                  <RequirementStatus
                    key={requirement.id}
                    requirement={requirement}
                    messages={messages}
                  />
                ))}
              </ul>
            ) : (
              <p className="mt-(--rt-space-4) rounded-lg border border-line-subtle bg-canvas p-(--rt-space-3) text-xs text-ink-muted">
                {messages.noRequirementsLabel}
              </p>
            )}
            <button
              type="button"
              className="mt-(--rt-space-4) inline-flex items-center gap-(--rt-space-2) rounded-md text-xs font-medium text-ink-muted transition-colors duration-(--rt-duration-fast) hover:text-brand"
            >
              {messages.fullDescriptionLabel}
              <FiExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          </section>

          <section className="mt-(--rt-space-5) rounded-lg border border-line-subtle bg-canvas p-(--rt-space-4) shadow-xs">
            <h2 className="flex items-center gap-(--rt-space-2) text-sm font-bold text-ink">
              {messages.priorityKeywordsLabel}
              <FiInfo aria-hidden="true" className="h-4 w-4 text-ink-muted" />
            </h2>
            {jobOffer.keywords.length > 0 ? (
              <ul className="mt-(--rt-space-4) flex flex-wrap gap-(--rt-space-2)">
                {jobOffer.keywords.map((keyword) => (
                  <li
                    key={keyword}
                    className="rounded-sm bg-surface-brand px-(--rt-space-2) py-(--rt-space-1) text-xs font-medium text-brand"
                  >
                    {keyword}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-(--rt-space-4) text-xs text-ink-muted">
                {messages.noKeywordsLabel}
              </p>
            )}
            <p className="mt-(--rt-space-5) text-xs text-ink-muted">
              {messages.priorityKeywordsHint}
            </p>
          </section>
        </div>
      ) : (
        <div className="mt-(--rt-space-4) flex flex-1 items-center justify-center rounded-lg border border-dashed border-brand-line bg-canvas p-(--rt-space-6) text-center">
          <p className="text-sm text-ink-muted">{messages.emptyLabel}</p>
        </div>
      )}
      {isReanalyzing ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-md bg-surface/65 backdrop-blur-[1px]">
          <span
            role="status"
            aria-label={recalculatingLabel}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-brand text-brand shadow-brand"
          >
            <FiLoader aria-hidden="true" className="h-6 w-6 animate-spin" />
          </span>
        </div>
      ) : null}
    </aside>
  );
}
