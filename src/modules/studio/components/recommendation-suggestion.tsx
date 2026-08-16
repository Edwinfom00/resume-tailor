"use client";

import { useState } from "react";
import {
  FiAlertTriangle,
  FiCheck,
  FiCornerUpLeft,
  FiEdit3,
  FiLoader,
  FiX,
} from "react-icons/fi";
import type { SuggestionPriority } from "@/modules/analysis/domain/suggestion-types";
import { formatTemplate } from "@/modules/shared/ui/format-template";
import type { ApplicationPhase } from "@/modules/session/domain/application-phase";
import { ApplicationProgress } from "@/modules/studio/components/application-progress";
import { RecommendationEditForm } from "@/modules/studio/components/recommendation-edit-form";
import type { StudioSuggestionView } from "@/modules/studio/view-models/recommendations-view";
import type { Messages } from "@/i18n/messages/types";

type RecommendationSuggestionProps = Readonly<{
  applicationPhase?: ApplicationPhase;
  isApplying: boolean;
  isBlocked: boolean;
  isEditing: boolean;
  isExiting: boolean;
  isReanalyzing: boolean;
  canUndo: boolean;
  messages: Messages["studio"]["recommendations"];
  onAccept: () => void;
  onCancelEdit: () => void;
  onEdit: () => void;
  onIgnore: () => void;
  onSaveEdit: (lines: readonly string[]) => void;
  onUndo: () => void;
  scoreDelta?: Readonly<{ previous: number; next: number }>;
  sectionTitle: string;
  suggestion: StudioSuggestionView;
}>;

function priorityLabel(
  priority: SuggestionPriority,
  messages: Messages["studio"]["recommendations"],
) {
  if (priority === "high") {
    return messages.priorityHighLabel;
  }

  return priority === "medium"
    ? messages.priorityMediumLabel
    : messages.priorityLowLabel;
}

export function RecommendationSuggestion({
  applicationPhase,
  canUndo,
  isApplying,
  isBlocked,
  isEditing,
  isExiting,
  isReanalyzing,
  messages,
  onAccept,
  onCancelEdit,
  onEdit,
  onIgnore,
  onSaveEdit,
  onUndo,
  scoreDelta,
  sectionTitle,
  suggestion,
}: RecommendationSuggestionProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const isApplied =
    suggestion.status === "accepted" || suggestion.status === "edited";
  const needsConfirmation =
    suggestion.requiresConfirmation && !isApplied && !isConfirmed;

  return (
    <div
      className={`mt-(--rt-space-2) rounded-md border border-line-subtle bg-canvas p-(--rt-space-2) ${
        isExiting ? "rt-animate-collapse-out" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-(--rt-space-3)">
        <div className="min-w-0">
          <p className="text-xs font-bold text-ink">
            {messages.suggestionTypes[suggestion.type]}
            {suggestion.itemLabel ? ` · ${suggestion.itemLabel}` : ""}
          </p>
          <p className="mt-1 text-2xs leading-relaxed text-ink-muted">
            {suggestion.reason}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {suggestion.impact > 0 ? (
            <span className="rounded-pill bg-success-50 px-(--rt-space-2) py-0.5 text-2xs font-semibold text-positive">
              {formatTemplate(messages.impactLabel, { value: suggestion.impact })}
            </span>
          ) : null}
          <span className="text-2xs text-ink-tertiary">
            {priorityLabel(suggestion.priority, messages)}
          </span>
        </div>
      </div>

      {suggestion.after.length > 0 && !isEditing ? (
        <div className="mt-(--rt-space-2) rounded-md border border-line-subtle bg-surface p-(--rt-space-2)">
          <p className="text-2xs font-bold text-ink">
            {messages.proposedChangeLabel}
          </p>
          <ul className="mt-1 space-y-1 text-2xs leading-relaxed text-ink-muted">
            {suggestion.after.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {isApplying ? (
        <ApplicationProgress
          messages={messages}
          phase={applicationPhase ?? "applying"}
        />
      ) : isEditing ? (
        <RecommendationEditForm
          messages={messages}
          onCancel={onCancelEdit}
          onSave={onSaveEdit}
          suggestion={suggestion}
        />
      ) : isApplied ? (
        <div className="rt-animate-rise mt-(--rt-space-2) flex flex-wrap items-center gap-(--rt-space-2)">
          <span className="inline-flex items-center gap-(--rt-space-2) rounded-md bg-success-50 px-(--rt-space-3) py-1 text-xs font-semibold text-positive">
            <FiCheck aria-hidden="true" className="h-3.5 w-3.5" />
            {formatTemplate(messages.sectionUpdatedLabel, {
              section: sectionTitle,
            })}
          </span>
          {isReanalyzing ? (
            <span className="inline-flex items-center gap-1 text-2xs text-ink-muted">
              <FiLoader aria-hidden="true" className="h-3 w-3 animate-spin" />
              {messages.applyingLabel}
            </span>
          ) : scoreDelta ? (
            <span
              className={`text-2xs font-semibold ${
                scoreDelta.next >= scoreDelta.previous
                  ? "text-positive"
                  : "text-caution"
              }`}
            >
              {formatTemplate(messages.scoreChangeLabel, {
                next: scoreDelta.next,
                previous: scoreDelta.previous,
              })}
            </span>
          ) : null}
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
      ) : (
        <>
          {suggestion.requiresConfirmation ? (
            <div className="mt-(--rt-space-2) rounded-md border border-line-subtle bg-caution-subtle p-(--rt-space-2)">
              <p className="flex items-center gap-(--rt-space-2) text-2xs font-semibold text-caution">
                <FiAlertTriangle aria-hidden="true" className="h-3.5 w-3.5" />
                {messages.confirmTitle}
              </p>
              <p className="mt-1 text-2xs text-ink-muted">
                {messages.confirmDescription}
              </p>
              <label className="mt-(--rt-space-2) flex items-center gap-(--rt-space-2) text-2xs font-semibold text-ink">
                <input
                  type="checkbox"
                  checked={isConfirmed}
                  onChange={(event) => setIsConfirmed(event.target.checked)}
                />
                {messages.confirmAcknowledgeLabel}
              </label>
            </div>
          ) : null}

          <div className="mt-(--rt-space-2) flex flex-wrap gap-(--rt-space-2)">
            <button
              type="button"
              disabled={
                !suggestion.canApply || isBlocked || needsConfirmation
              }
              onClick={onAccept}
              className="inline-flex h-(--rt-control-height-sm) items-center gap-(--rt-space-2) rounded-md bg-brand px-(--rt-space-4) text-sm font-medium text-white transition-colors duration-(--rt-duration-fast) hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isApplying ? (
                <FiLoader aria-hidden="true" className="h-4 w-4 animate-spin" />
              ) : (
                <FiCheck aria-hidden="true" className="h-4 w-4" />
              )}
              {isApplying ? messages.applyingLabel : messages.acceptLabel}
            </button>
            <button
              type="button"
              disabled={!suggestion.canEdit}
              onClick={onEdit}
              className="inline-flex h-(--rt-control-height-sm) items-center gap-(--rt-space-2) rounded-md border border-line-subtle px-(--rt-space-4) text-sm font-medium text-ink-muted transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiEdit3 aria-hidden="true" className="h-4 w-4" />
              {messages.editLabel}
            </button>
            <button
              type="button"
              onClick={onIgnore}
              className="inline-flex h-(--rt-control-height-sm) items-center gap-(--rt-space-2) rounded-md border border-line-subtle px-(--rt-space-4) text-sm font-medium text-ink-muted transition-colors duration-(--rt-duration-fast) hover:bg-negative-subtle hover:text-negative"
            >
              <FiX aria-hidden="true" className="h-4 w-4" />
              {messages.ignoreLabel}
            </button>
          </div>

          {!suggestion.canApply && !suggestion.canEdit ? (
            <p className="mt-(--rt-space-2) text-2xs text-ink-tertiary">
              {messages.noProposedContentLabel}
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}
