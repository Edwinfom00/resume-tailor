"use client";

import { type ChangeEvent } from "react";
import {
  FiBriefcase,
  FiHome,
  FiCheckCircle,
  FiInfo,
  FiLink2,
  FiList,
} from "react-icons/fi";
import type { Messages } from "@/i18n/messages/types";

export type JobOfferDraft = Readonly<{
  description: string;
  url: string;
}>;

type JobOfferPanelProps = Readonly<{
  isParsed: boolean;
  jobOffer: JobOfferDraft;
  messages: Messages["jobOffer"];
  onJobOfferChange: (jobOffer: JobOfferDraft) => void;
  onParse: () => void;
}>;

export function JobOfferPanel({
  isParsed,
  jobOffer,
  messages,
  onJobOfferChange,
  onParse,
}: JobOfferPanelProps) {
  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    onJobOfferChange({ ...jobOffer, url: event.target.value });
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onJobOfferChange({ ...jobOffer, description: event.target.value });
  };

  return (
    <section className="rounded-xl border border-line-subtle bg-surface p-(--rt-space-5) shadow-xs">
      <div className="flex items-center gap-(--rt-space-3)">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-white shadow-brand">
          {messages.stepLabel}
        </span>
        <h2 className="text-lg font-bold tracking-tight text-ink">{messages.heading}</h2>
      </div>

      <p className="mt-(--rt-space-3) text-sm text-ink-muted">
        {messages.supportText}
      </p>

      <div className="mt-(--rt-space-4)">
        <label className="block text-sm font-semibold text-ink" htmlFor="job-offer-url">
          {messages.urlLabel}
        </label>
        <div className="mt-(--rt-space-2) flex gap-(--rt-space-3)">
          <div className="flex h-(--rt-control-height-md) min-w-0 flex-1 items-center gap-(--rt-space-2) rounded-lg border border-line-subtle px-(--rt-space-3) text-ink-muted shadow-xs focus-within:border-brand">
            <FiLink2 aria-hidden="true" className="h-4 w-4 shrink-0" />
            <input
              id="job-offer-url"
              value={jobOffer.url}
              onChange={handleUrlChange}
              placeholder={messages.urlPlaceholder}
              className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-tertiary"
              type="url"
            />
          </div>
          <button
            type="button"
            onClick={onParse}
            className="h-(--rt-control-height-md) rounded-md border border-line-subtle bg-surface px-(--rt-space-5) text-sm font-semibold text-ink shadow-xs transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand"
          >
            {messages.fetchLabel}
          </button>
        </div>
        <p className="mt-(--rt-space-2) text-xs text-ink-muted">{messages.urlHint}</p>
      </div>

      <div className="my-(--rt-space-5) flex items-center gap-(--rt-space-3) text-xs font-medium text-ink-muted before:h-px before:flex-1 before:bg-line-subtle after:h-px after:flex-1 after:bg-line-subtle">
        {messages.separatorLabel}
      </div>

      <div>
        <label className="block text-sm font-semibold text-ink" htmlFor="job-offer-description">
          {messages.descriptionLabel}
        </label>
        <div className="relative mt-(--rt-space-2)">
          <textarea
            id="job-offer-description"
            value={jobOffer.description}
            onChange={handleDescriptionChange}
            maxLength={8000}
            placeholder={messages.descriptionPlaceholder}
            className="min-h-28 w-full resize-none rounded-lg border border-line-subtle bg-surface p-(--rt-space-3) pb-(--rt-space-6) text-sm text-ink outline-none placeholder:text-ink-tertiary focus:border-brand"
          />
          <span className="absolute bottom-(--rt-space-3) right-(--rt-space-3) text-xs text-ink-tertiary">
            {jobOffer.description.length} / 8000
          </span>
        </div>
      </div>

      {isParsed ? (
        <div className="mt-(--rt-space-4) rounded-xl border border-line-subtle bg-canvas p-(--rt-space-4) shadow-xs">
          <div className="flex items-center justify-between gap-(--rt-space-3)">
            <h3 className="text-sm font-bold text-ink">{messages.previewLabel}</h3>
            <span className="inline-flex items-center gap-1 rounded-pill bg-success-50 px-(--rt-space-2) py-0.5 text-xs font-medium text-positive">
              <FiCheckCircle aria-hidden="true" className="h-3 w-3" />
              {messages.autoExtractedLabel}
            </span>
          </div>

          <dl className="mt-(--rt-space-4) space-y-(--rt-space-3) text-sm">
            <div className="flex gap-(--rt-space-2)">
              <FiBriefcase aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <div>
                <dt className="font-semibold text-ink">{messages.roleLabel}</dt>
                <dd className="text-ink-muted">{messages.roleValue}</dd>
              </div>
            </div>
            <div className="flex gap-(--rt-space-2)">
              <FiHome aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <div>
                <dt className="font-semibold text-ink">{messages.companyLabel}</dt>
                <dd className="text-ink-muted">{messages.companyValue}</dd>
              </div>
            </div>
            <div className="flex gap-(--rt-space-2)">
              <FiList aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <div>
                <dt className="font-semibold text-ink">{messages.requirementsLabel}</dt>
                <dd className="text-ink-muted">{messages.requirementsValue}</dd>
              </div>
            </div>
          </dl>

          <p className="mt-(--rt-space-4) flex items-start gap-(--rt-space-2) border-t border-line-subtle pt-(--rt-space-3) text-xs text-ink-muted">
            <FiInfo aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            {messages.previewNote}
          </p>
        </div>
      ) : null}
    </section>
  );
}
