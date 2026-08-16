"use client";

import { type ChangeEvent } from "react";
import {
  FiBriefcase,
  FiHome,
  FiCheckCircle,
  FiInfo,
  FiLink2,
  FiList,
  FiLoader,
  FiRefreshCw,
} from "react-icons/fi";
import { useJobInput } from "@/modules/upload/hooks/use-job-input";
import { formatTemplate } from "@/modules/shared/ui/format-template";
import type { Messages } from "@/i18n/messages/types";

type JobOfferPanelProps = Readonly<{
  domainErrorMessages: Messages["domainErrors"];
  messages: Messages["jobOffer"];
}>;

const descriptionLimit = 8000;

export function JobOfferPanel({
  domainErrorMessages,
  messages,
}: JobOfferPanelProps) {
  const {
    canSubmit,
    description,
    errorMessage,
    isExtracting,
    preview,
    setJobDescription,
    setJobUrl,
    stage,
    stageLabel,
    submit,
    submitLabel,
    url,
  } = useJobInput({ domainErrorMessages, messages });

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    setJobUrl(event.target.value);
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescription(event.target.value);
  };

  const hintClassName = errorMessage
    ? "text-negative"
    : stage === "ready"
      ? "text-positive"
      : "text-ink-muted";
  const hintMessage = errorMessage
    ? errorMessage
    : stageLabel
      ? stageLabel
      : stage === "ready"
        ? messages.readyLabel
        : messages.urlHint;

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
              value={url}
              onChange={handleUrlChange}
              disabled={isExtracting}
              placeholder={messages.urlPlaceholder}
              className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-tertiary disabled:cursor-not-allowed"
              type="url"
            />
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className="inline-flex h-(--rt-control-height-md) items-center gap-(--rt-space-2) rounded-md border border-line-subtle bg-surface px-(--rt-space-5) text-sm font-semibold text-ink shadow-xs transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isExtracting ? (
              <FiLoader aria-hidden="true" className="h-4 w-4 animate-spin" />
            ) : stage === "ready" ? (
              <FiCheckCircle aria-hidden="true" className="h-4 w-4 text-positive" />
            ) : stage === "error" ? (
              <FiRefreshCw aria-hidden="true" className="h-4 w-4" />
            ) : null}
            {stage === "error" ? messages.retryLabel : submitLabel}
          </button>
        </div>
        <p
          aria-live="polite"
          className={`mt-(--rt-space-2) text-xs ${hintClassName}`}
          role={errorMessage ? "alert" : undefined}
        >
          {hintMessage}
        </p>
        {isExtracting ? (
          <span
            aria-hidden="true"
            className="rt-sweep mt-(--rt-space-2) block h-0.5 w-full rounded-pill bg-brand-subtle"
          />
        ) : null}
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
            value={description}
            onChange={handleDescriptionChange}
            disabled={isExtracting}
            maxLength={descriptionLimit}
            placeholder={messages.descriptionPlaceholder}
            className="min-h-28 w-full resize-none rounded-lg border border-line-subtle bg-surface p-(--rt-space-3) pb-(--rt-space-6) text-sm text-ink outline-none placeholder:text-ink-tertiary focus:border-brand disabled:cursor-not-allowed"
          />
          <span className="absolute bottom-(--rt-space-3) right-(--rt-space-3) text-xs text-ink-tertiary">
            {description.length} / {descriptionLimit}
          </span>
        </div>
      </div>

      {preview ? (
        <div className="rt-animate-rise mt-(--rt-space-4) rounded-xl border border-line-subtle bg-canvas p-(--rt-space-4) shadow-xs">
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
                <dd className="text-ink-muted">
                  {preview.role || messages.notDetectedLabel}
                </dd>
              </div>
            </div>
            <div className="flex gap-(--rt-space-2)">
              <FiHome aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <div>
                <dt className="font-semibold text-ink">{messages.companyLabel}</dt>
                <dd className="text-ink-muted">
                  {preview.company || messages.notDetectedLabel}
                </dd>
              </div>
            </div>
            <div className="flex gap-(--rt-space-2)">
              <FiList aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <div>
                <dt className="font-semibold text-ink">
                  {messages.requirementsLabel}
                </dt>
                <dd className="text-ink-muted">
                  {preview.requirements.length > 0
                    ? preview.requirements.join(", ")
                    : messages.notDetectedLabel}
                </dd>
                {preview.requirementCount > 0 ? (
                  <dd className="mt-0.5 text-xs text-ink-tertiary">
                    {formatTemplate(messages.requirementsCountLabel, {
                      count: preview.requirementCount,
                    })}
                  </dd>
                ) : null}
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
