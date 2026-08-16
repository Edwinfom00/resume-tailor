import {
  FiAlertTriangle,
  FiBriefcase,
  FiCheckCircle,
  FiExternalLink,
  FiInfo,
  FiMapPin,
  FiMoreHorizontal,
  FiMove,
} from "react-icons/fi";
import { HiBuildingOffice2 } from "react-icons/hi2";
import {
  studioJobOffer,
  type JobRequirement,
} from "@/modules/studio/fixtures/job-offer";
import type { Messages } from "@/i18n/messages/types";

type JobOfferPanelProps = Readonly<{
  messages: Messages["studio"]["jobOffer"];
}>;

function RequirementStatus({
  requirement,
  messages,
}: Readonly<{
  requirement: JobRequirement;
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
        className={`rounded-pill px-(--rt-space-2) py-0.5 text-xs font-medium ${
          isMatched
            ? "bg-success-50 text-positive"
            : "bg-caution-subtle text-caution"
        }`}
      >
        {isMatched ? messages.matchedLabel : messages.missingLabel}
      </span>
    </li>
  );
}

export function JobOfferPanel({ messages }: JobOfferPanelProps) {
  return (
    <aside className="flex min-h-(--rt-studio-panel-min-height) w-full max-w-(--rt-studio-sidebar-width) flex-col rounded-xl border border-line-subtle bg-surface p-(--rt-space-5) shadow-xs">
      <div className="flex items-center justify-between border-b border-line-subtle pb-(--rt-space-4)">
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

      <section className="mt-(--rt-space-4) rounded-lg border border-line-subtle bg-canvas p-(--rt-space-4) shadow-xs">
        <div className="flex gap-(--rt-space-3)">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-surface-brand text-brand">
            <HiBuildingOffice2 aria-hidden="true" className="h-8 w-8" />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-base font-bold tracking-tight text-ink">
              {studioJobOffer.title}
            </h2>
            <p className="mt-0.5 flex items-center gap-(--rt-space-2) text-sm font-semibold text-ink-muted">
              {studioJobOffer.company}
              <FiCheckCircle aria-hidden="true" className="h-4 w-4 text-brand" />
            </p>
            <p className="mt-1 flex flex-wrap items-center gap-x-(--rt-space-2) text-xs text-ink-muted">
              <span className="inline-flex items-center gap-1">
                <FiMapPin aria-hidden="true" className="h-3.5 w-3.5" />
                {studioJobOffer.location}
              </span>
              <span aria-hidden="true">•</span>
              <span>{studioJobOffer.type}</span>
            </p>
            <p className="mt-1 text-xs text-ink-muted">{studioJobOffer.postedDate}</p>
          </div>
        </div>
      </section>

      <section className="mt-(--rt-space-5)">
        <div className="flex items-center justify-between gap-(--rt-space-3)">
          <h2 className="text-sm font-bold text-ink">{messages.detectedRequirementsLabel}</h2>
          <span className="rounded-pill bg-surface-subtle px-(--rt-space-2) py-0.5 text-xs font-semibold text-ink-muted">
            {studioJobOffer.matchedRequirements}/{studioJobOffer.totalRequirements} {messages.matchedSummarySuffix}
          </span>
        </div>
        <ul className="mt-(--rt-space-4) space-y-(--rt-space-3)">
          {studioJobOffer.requirements.map((requirement) => (
            <RequirementStatus
              key={requirement.name}
              requirement={requirement}
              messages={messages}
            />
          ))}
        </ul>
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
        <ul className="mt-(--rt-space-4) flex flex-wrap gap-(--rt-space-2)">
          {studioJobOffer.keywords.map((keyword) => (
            <li key={keyword} className="rounded-sm bg-surface-brand px-(--rt-space-2) py-(--rt-space-1) text-xs font-medium text-brand">
              {keyword}
            </li>
          ))}
        </ul>
        <p className="mt-(--rt-space-5) flex items-center gap-(--rt-space-2) text-xs text-ink-muted">
          {messages.priorityKeywordsHint}
          <FiMove aria-hidden="true" className="h-3.5 w-3.5" />
        </p>
      </section>
    </aside>
  );
}
