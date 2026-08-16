"use client";

import { type FormEvent, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import { HiMiniSparkles } from "react-icons/hi2";
import type { Messages } from "@/i18n/messages/types";
import {
  resumeSectionIds,
  type ResumeSectionId,
} from "@/modules/session/domain/resume-selection";

type AiSectionFillFormProps = Readonly<{
  disabled: boolean;
  initialSection?: ResumeSectionId;
  messages: Messages["studio"]["copilot"];
  onSubmit: (section: ResumeSectionId, details: string) => void;
  sectionLabels: Readonly<Record<ResumeSectionId, string>>;
}>;

export function AiSectionFillForm({
  disabled,
  initialSection,
  messages,
  onSubmit,
  sectionLabels,
}: AiSectionFillFormProps) {
  const [details, setDetails] = useState("");
  const [section, setSection] = useState<ResumeSectionId>(
    initialSection ?? "profile",
  );

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = details.trim();

    if (!value || disabled) {
      return;
    }

    onSubmit(section, value);
    setDetails("");
  };

  return (
    <section className="rounded-lg border border-brand-line bg-surface p-(--rt-space-3)">
      <div className="flex items-start gap-(--rt-space-2)">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-surface-brand text-brand">
          <HiMiniSparkles aria-hidden="true" className="h-4 w-4" />
        </span>
        <div>
          <h3 className="text-sm font-bold text-ink">{messages.fillTitle}</h3>
          <p className="mt-0.5 text-2xs leading-relaxed text-ink-muted">
            {messages.fillDescription}
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-(--rt-space-3)">
        <fieldset>
          <legend className="text-2xs font-semibold text-ink-muted">
            {messages.fillSectionLabel}
          </legend>
          <div className="mt-1 grid grid-cols-2 gap-(--rt-space-2)">
            {resumeSectionIds.map((sectionId) => {
              const isSelected = sectionId === section;

              return (
                <button
                  key={sectionId}
                  type="button"
                  aria-pressed={isSelected}
                  disabled={disabled}
                  onClick={() => setSection(sectionId)}
                  className={`h-(--rt-control-height-sm) rounded-md border px-(--rt-space-2) text-xs font-semibold transition-colors duration-(--rt-duration-fast) disabled:cursor-not-allowed disabled:opacity-50 ${
                    isSelected
                      ? "border-brand bg-surface-brand text-brand"
                      : "border-line-subtle text-ink-muted hover:bg-surface-brand hover:text-brand"
                  }`}
                >
                  {sectionLabels[sectionId]}
                </button>
              );
            })}
          </div>
        </fieldset>

        <label
          htmlFor="copilot-fill-details"
          className="mt-(--rt-space-3) block text-2xs font-semibold text-ink-muted"
        >
          {messages.fillDetailsLabel}
        </label>
        <textarea
          id="copilot-fill-details"
          value={details}
          disabled={disabled}
          maxLength={4000}
          rows={5}
          onChange={(event) => setDetails(event.target.value)}
          placeholder={messages.fillDetailsPlaceholder}
          className="mt-1 w-full resize-y rounded-md border border-line-subtle bg-canvas p-(--rt-space-2) text-xs leading-relaxed text-ink outline-none placeholder:text-ink-subtle focus:border-brand disabled:cursor-not-allowed disabled:opacity-50"
        />

        {section === "projects" ? (
          <p className="mt-(--rt-space-2) rounded-md bg-surface-brand p-(--rt-space-2) text-2xs leading-relaxed text-brand">
            {messages.fillProjectHint}
          </p>
        ) : null}

        <p className="mt-(--rt-space-2) text-2xs leading-relaxed text-ink-muted">
          {messages.fillConfirmationHint}
        </p>

        <button
          type="submit"
          disabled={disabled || details.trim().length === 0}
          className="mt-(--rt-space-3) inline-flex h-(--rt-control-height-sm) items-center gap-(--rt-space-2) rounded-md bg-brand px-(--rt-space-3) text-xs font-semibold text-white transition-colors duration-(--rt-duration-fast) hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FiArrowUp aria-hidden="true" className="h-3.5 w-3.5" />
          {messages.fillSubmitLabel}
        </button>
      </form>
    </section>
  );
}
