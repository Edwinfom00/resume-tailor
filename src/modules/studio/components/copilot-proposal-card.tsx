"use client";

import { useState } from "react";
import {
  FiAlertTriangle,
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiCornerUpLeft,
  FiEdit3,
  FiX,
} from "react-icons/fi";
import type { ResumeData } from "@/@types/resume-data";
import type { CopilotActionProposal } from "@/modules/copilot/domain/copilot-types";
import type { ApplicationPhase } from "@/modules/session/domain/application-phase";
import { ApplicationProgress } from "@/modules/studio/components/application-progress";
import {
  describeProposal,
  withEditedLines,
  type ProposalFieldKey,
} from "@/modules/copilot/domain/proposal-preview";
import type { ResumeAction } from "@/modules/resume/domain/resume-actions";
import { formatTemplate } from "@/modules/shared/ui/format-template";
import type { Messages } from "@/i18n/messages/types";

type CopilotProposalCardProps = Readonly<{
  canUndo: boolean;
  isApplying: boolean;
  applicationPhase?: ApplicationPhase;
  messages: Messages["studio"]["copilot"];
  onApply: () => void;
  onEdit: (action: ResumeAction) => void;
  onIgnore: () => void;
  onUndo: () => void;
  presentLabel: string;
  proposal: CopilotActionProposal;
  resume: ResumeData;
}>;

export function CopilotProposalCard({
  canUndo,
  isApplying,
  applicationPhase,
  messages,
  onApply,
  onEdit,
  onIgnore,
  onUndo,
  presentLabel,
  proposal,
  resume,
}: CopilotProposalCardProps) {
  const preview = describeProposal(proposal.action, resume, presentLabel);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(preview.editableLines.join("\n"));
  const [isFactConfirmed, setIsFactConfirmed] = useState(false);

  const fieldLabels: Readonly<Record<ProposalFieldKey, string>> = {
    company: messages.companyLabel,
    role: messages.roleLabel,
    dates: messages.datesLabel,
    location: messages.locationLabel,
  };
  const isApplied = proposal.status === "applied";
  const isIgnored = proposal.status === "ignored";
  const needsFactConfirmation =
    proposal.requiresFactConfirmation && !isApplied && !isFactConfirmed;
  const title =
    preview.kind === "create-experience"
      ? messages.newExperienceLabel
      : preview.kind === "create-project"
        ? messages.newProjectLabel
        : messages.proposalTitle;

  const saveEdit = () => {
    const lines = draft
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length > 0) {
      onEdit(withEditedLines(proposal.action, lines));
    }

    setIsEditing(false);
  };

  return (
    <section className="rt-animate-rise mt-(--rt-space-2) overflow-hidden rounded-lg border border-line-subtle bg-surface">
      <div className="border-b border-line-subtle p-(--rt-space-3)">
        <div className="flex items-start justify-between gap-(--rt-space-3)">
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-ink">
              {preview.contextLabel ?? title}
            </h3>
            {preview.bullets.length > 0 ? (
              <p className="mt-1 text-xs text-ink-muted">
                {formatTemplate(messages.changedBulletsLabel, {
                  count: preview.bullets.length,
                })}
              </p>
            ) : null}
          </div>
          {proposal.estimatedImpact ? (
            <span className="shrink-0 rounded-pill bg-success-50 px-(--rt-space-2) py-0.5 text-2xs font-semibold text-positive">
              {formatTemplate(messages.impactEstimateLabel, {
                value: proposal.estimatedImpact,
              })}
            </span>
          ) : null}
        </div>

        {preview.fields.length > 0 ? (
          <dl className="mt-(--rt-space-3) grid grid-cols-2 gap-(--rt-space-2) text-2xs">
            {preview.fields.map((field) => (
              <div key={field.key}>
                <dt className="font-semibold text-ink">{fieldLabels[field.key]}</dt>
                <dd className="text-ink-muted">{field.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {isEditing ? (
          <div className="rt-animate-expand-in mt-(--rt-space-3)">
            <label
              className="text-2xs font-semibold text-ink-muted"
              htmlFor={`proposal-draft-${proposal.id}`}
            >
              {messages.bulletsLabel}
            </label>
            <textarea
              id={`proposal-draft-${proposal.id}`}
              value={draft}
              rows={Math.min(10, Math.max(3, preview.editableLines.length + 1))}
              onChange={(event) => setDraft(event.target.value)}
              className="mt-1 w-full resize-y rounded-md border border-line-subtle bg-canvas p-(--rt-space-2) text-2xs leading-relaxed text-ink outline-none focus:border-brand"
            />
          </div>
        ) : preview.bullets.length > 0 ? (
          <ul className="mt-(--rt-space-3) list-disc space-y-(--rt-space-2) pl-(--rt-space-4) text-2xs leading-relaxed text-ink-muted">
            {preview.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        ) : null}
      </div>

      {proposal.changeSummary.length > 0 ? (
        <>
          <button
            type="button"
            aria-expanded={isDetailVisible}
            onClick={() => setIsDetailVisible((current) => !current)}
            className="flex w-full items-center justify-between px-(--rt-space-3) py-(--rt-space-2) text-xs font-medium text-ink-muted transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand hover:text-brand"
          >
            {messages.detailedChangesLabel}
            {isDetailVisible ? (
              <FiChevronUp aria-hidden="true" className="h-4 w-4" />
            ) : (
              <FiChevronDown aria-hidden="true" className="h-4 w-4" />
            )}
          </button>
          {isDetailVisible ? (
            <ul className="rt-animate-expand-in list-disc space-y-1 border-t border-line-subtle px-(--rt-space-6) py-(--rt-space-2) text-2xs text-ink-muted">
              {proposal.changeSummary.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          ) : null}
        </>
      ) : null}

      {proposal.requiresFactConfirmation && !isApplied ? (
        <div className="border-t border-line-subtle bg-caution-subtle p-(--rt-space-3)">
          <p className="flex items-center gap-(--rt-space-2) text-2xs font-semibold text-caution">
            <FiAlertTriangle aria-hidden="true" className="h-3.5 w-3.5" />
            {messages.confirmFactsTitle}
          </p>
          <p className="mt-1 text-2xs text-ink-muted">
            {messages.confirmFactsDescription}
          </p>
          {proposal.unsupportedFacts.length > 0 ? (
            <ul className="mt-1 list-disc pl-(--rt-space-4) text-2xs text-ink-muted">
              {proposal.unsupportedFacts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          ) : null}
          <label className="mt-(--rt-space-2) flex items-center gap-(--rt-space-2) text-2xs font-semibold text-ink">
            <input
              type="checkbox"
              checked={isFactConfirmed}
              onChange={(event) => setIsFactConfirmed(event.target.checked)}
            />
            {messages.confirmFactsAcknowledgeLabel}
          </label>
        </div>
      ) : null}

      {isApplying ? (
        <ApplicationProgress
          messages={messages}
          phase={applicationPhase ?? "applying"}
        />
      ) : isApplied ? (
        <div className="flex flex-wrap items-center gap-(--rt-space-2) border-t border-line-subtle p-(--rt-space-2)">
          <span className="inline-flex items-center gap-(--rt-space-2) rounded-md bg-success-50 px-(--rt-space-3) py-1 text-xs font-semibold text-positive">
            <FiCheck aria-hidden="true" className="h-3.5 w-3.5" />
            {messages.appliedLabel}
          </span>
          {canUndo ? (
            <button
              type="button"
              onClick={onUndo}
              className="inline-flex items-center gap-1 rounded-md px-(--rt-space-2) py-1 text-2xs font-semibold text-brand transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand"
            >
              <FiCornerUpLeft aria-hidden="true" className="h-3 w-3" />
              {messages.undoLabel}
            </button>
          ) : null}
        </div>
      ) : isIgnored ? (
        <p className="border-t border-line-subtle p-(--rt-space-3) text-2xs text-ink-tertiary">
          {messages.ignoredLabel}
        </p>
      ) : (
        <div className="flex flex-wrap gap-(--rt-space-2) border-t border-line-subtle p-(--rt-space-2)">
          <button
            type="button"
            disabled={isApplying || needsFactConfirmation}
            onClick={isEditing ? saveEdit : onApply}
            className="inline-flex h-(--rt-control-height-sm) shrink-0 items-center gap-(--rt-space-2) whitespace-nowrap rounded-md bg-brand px-(--rt-space-3) text-xs font-semibold text-white transition-colors duration-(--rt-duration-fast) hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiCheck aria-hidden="true" className="h-4 w-4" />
            {messages.applyChangesLabel}
          </button>
          <button
            type="button"
            disabled={preview.editableLines.length === 0 || isApplying}
            onClick={() => setIsEditing((current) => !current)}
            className="inline-flex h-(--rt-control-height-sm) shrink-0 items-center gap-(--rt-space-2) whitespace-nowrap rounded-md border border-line-subtle px-(--rt-space-3) text-xs font-semibold text-ink-muted transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiEdit3 aria-hidden="true" className="h-4 w-4" />
            {messages.editLabel}
          </button>
          <button
            type="button"
            disabled={isApplying}
            onClick={onIgnore}
            className="inline-flex h-(--rt-control-height-sm) shrink-0 items-center gap-(--rt-space-2) whitespace-nowrap rounded-md border border-line-subtle px-(--rt-space-3) text-xs font-semibold text-ink-muted transition-colors duration-(--rt-duration-fast) hover:bg-negative-subtle hover:text-negative disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiX aria-hidden="true" className="h-4 w-4" />
            {messages.ignoreLabel}
          </button>
        </div>
      )}
    </section>
  );
}
