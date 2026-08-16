"use client";

import { useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import type { Messages } from "@/i18n/messages/types";
import type { StudioSuggestionView } from "@/modules/studio/view-models/recommendations-view";

type RecommendationEditFormProps = Readonly<{
  messages: Messages["studio"]["recommendations"];
  onCancel: () => void;
  onSave: (lines: readonly string[]) => void;
  suggestion: StudioSuggestionView;
}>;

export function RecommendationEditForm({
  messages,
  onCancel,
  onSave,
  suggestion,
}: RecommendationEditFormProps) {
  const proposed = suggestion.after.length > 0 ? suggestion.after : suggestion.before;
  const [draft, setDraft] = useState(proposed.join("\n"));
  const lines = draft
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="rt-animate-expand-in mt-(--rt-space-2) rounded-md border border-brand-line bg-canvas p-(--rt-space-2)">
      <p className="text-xs font-bold text-ink">{messages.editTitle}</p>

      {suggestion.before.length > 0 ? (
        <div className="mt-(--rt-space-2)">
          <p className="text-2xs font-semibold text-ink-muted">
            {messages.originalLabel}
          </p>
          <ul className="mt-1 space-y-1 text-2xs leading-relaxed text-ink-muted">
            {suggestion.before.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-(--rt-space-2)">
        <label
          className="text-2xs font-semibold text-ink-muted"
          htmlFor={`suggestion-draft-${suggestion.id}`}
        >
          {messages.proposedLabel}
        </label>
        <textarea
          id={`suggestion-draft-${suggestion.id}`}
          value={draft}
          rows={Math.min(10, Math.max(3, proposed.length + 1))}
          onChange={(event) => setDraft(event.target.value)}
          className="mt-1 w-full resize-y rounded-md border border-line-subtle bg-surface p-(--rt-space-2) text-2xs leading-relaxed text-ink outline-none focus:border-brand"
        />
        <p className="mt-1 text-2xs text-ink-tertiary">{messages.editHint}</p>
      </div>

      <div className="mt-(--rt-space-2) flex gap-(--rt-space-2)">
        <button
          type="button"
          disabled={lines.length === 0}
          onClick={() => onSave(lines)}
          className="inline-flex h-(--rt-control-height-sm) items-center gap-(--rt-space-2) rounded-md bg-brand px-(--rt-space-4) text-sm font-medium text-white transition-colors duration-(--rt-duration-fast) hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiCheck aria-hidden="true" className="h-4 w-4" />
          {messages.saveChangesLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-(--rt-control-height-sm) items-center gap-(--rt-space-2) rounded-md border border-line-subtle px-(--rt-space-4) text-sm font-medium text-ink-muted transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand hover:text-brand"
        >
          <FiX aria-hidden="true" className="h-4 w-4" />
          {messages.cancelLabel}
        </button>
      </div>
    </div>
  );
}
