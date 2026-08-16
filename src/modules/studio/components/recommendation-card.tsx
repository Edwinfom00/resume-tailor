"use client";

import {
  FiBriefcase,
  FiChevronDown,
  FiChevronUp,
  FiCode,
  FiTool,
  FiUser,
} from "react-icons/fi";
import type { Messages } from "@/i18n/messages/types";
import type { ResumeSectionId } from "@/modules/session/domain/resume-selection";
import type { ApplicationPhase } from "@/modules/session/domain/application-phase";
import { formatTemplate } from "@/modules/shared/ui/format-template";
import { RecommendationSuggestion } from "@/modules/studio/components/recommendation-suggestion";
import type { StudioRecommendation } from "@/modules/studio/view-models/recommendations-view";

const sectionIcons = {
  profile: FiUser,
  experience: FiBriefcase,
  projects: FiCode,
  skills: FiTool,
} as const satisfies Record<ResumeSectionId, unknown>;

type RecommendationCardProps = Readonly<{
  applyingSuggestionId?: string;
  applyingSuggestionPhase?: ApplicationPhase;
  canUndo: boolean;
  editingSuggestionId: string | null;
  exitingSuggestionId: string | null;
  isExpanded: boolean;
  isReanalyzing: boolean;
  messages: Messages["studio"]["recommendations"];
  onAccept: (suggestionId: string) => void;
  onCancelEdit: () => void;
  onEdit: (suggestionId: string) => void;
  onIgnore: (suggestionId: string) => void;
  onRestore: (suggestionId: string) => void;
  onSaveEdit: (suggestionId: string, lines: readonly string[]) => void;
  onToggle: (sectionId: ResumeSectionId) => void;
  onUndo: () => void;
  recommendation: StudioRecommendation;
  scoreDelta?: Readonly<{ previous: number; next: number }>;
}>;

export function RecommendationCard({
  applyingSuggestionId,
  applyingSuggestionPhase,
  canUndo,
  editingSuggestionId,
  exitingSuggestionId,
  isExpanded,
  isReanalyzing,
  messages,
  onAccept,
  onCancelEdit,
  onEdit,
  onIgnore,
  onRestore,
  onSaveEdit,
  onToggle,
  onUndo,
  recommendation,
  scoreDelta,
}: RecommendationCardProps) {
  const Icon = sectionIcons[recommendation.id];
  const copy = messages.items[recommendation.id];
  const isPositive = recommendation.tone === "positive";
  const panelId = `recommendation-panel-${recommendation.id}`;
  const visibleSuggestions = recommendation.suggestions.filter(
    (suggestion) => suggestion.status !== "ignored",
  );
  const ignoredSuggestions = recommendation.suggestions.filter(
    (suggestion) => suggestion.status === "ignored",
  );

  return (
    <section
      className={`overflow-hidden rounded-lg border bg-surface transition-colors duration-(--rt-duration-fast) ${
        isExpanded ? "border-brand-line" : "border-line-subtle"
      }`}
    >
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={panelId}
        aria-label={`${isExpanded ? messages.closeLabel : messages.openLabel}: ${copy.title}`}
        onClick={() => onToggle(recommendation.id)}
        className="flex w-full items-center gap-(--rt-space-3) px-(--rt-space-3) py-(--rt-space-2) text-left"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface-brand text-brand">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold text-ink">{copy.title}</span>
          <span className="mt-0.5 block truncate text-xs text-ink-muted">
            {copy.description}
          </span>
        </span>
        <span
          aria-label={`${messages.sectionScoreLabel}: ${recommendation.score}%`}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors duration-(--rt-duration-normal) ${
            isPositive
              ? "border-positive bg-success-50 text-positive"
              : "border-caution bg-caution-subtle text-caution"
          }`}
        >
          {recommendation.score}%
        </span>
        {isExpanded ? (
          <FiChevronUp aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-muted" />
        ) : (
          <FiChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-muted" />
        )}
      </button>

      {isExpanded ? (
        <div
          id={panelId}
          className="rt-animate-expand-in border-t border-line-subtle px-(--rt-space-3) pb-(--rt-space-2) pt-(--rt-space-2)"
        >
          {recommendation.currentKeywords && recommendation.suggestedKeywords ? (
            <>
              <div className="rounded-md border border-line-subtle bg-canvas p-(--rt-space-2)">
                <p className="text-xs font-bold text-ink">{messages.currentLabel}</p>
                <p className="mt-(--rt-space-2) text-2xs leading-relaxed text-ink-muted">
                  {recommendation.currentKeywords.join(", ")}
                </p>
              </div>
              <div className="mt-(--rt-space-2) rounded-md border border-line-subtle bg-canvas p-(--rt-space-2)">
                <div className="flex items-center justify-between gap-(--rt-space-3)">
                  <p className="text-xs font-bold text-ink">
                    {messages.suggestedImprovementLabel}
                  </p>
                  {recommendation.relevanceGain ? (
                    <span className="rounded-pill bg-success-50 px-(--rt-space-2) py-0.5 text-xs font-semibold text-positive">
                      {formatTemplate(messages.relevanceLabel, {
                        value: recommendation.relevanceGain,
                      })}
                    </span>
                  ) : null}
                </div>
                <p className="mt-(--rt-space-2) text-xs leading-relaxed text-ink-muted">
                  {recommendation.suggestedKeywords.join(", ")}
                </p>
              </div>
            </>
          ) : null}

          {recommendation.strengths.length > 0 ? (
            <div className="mt-(--rt-space-2)">
              <p className="text-2xs font-bold text-ink">{messages.strengthsLabel}</p>
              <p className="mt-1 text-2xs leading-relaxed text-ink-muted">
                {recommendation.strengths.join(" · ")}
              </p>
            </div>
          ) : null}

          {visibleSuggestions.length > 0 ? (
            visibleSuggestions.map((suggestion) => (
              <RecommendationSuggestion
                key={suggestion.id}
                canUndo={canUndo}
                isApplying={applyingSuggestionId === suggestion.id}
                applicationPhase={applyingSuggestionPhase}
                isBlocked={Boolean(applyingSuggestionId)}
                isEditing={editingSuggestionId === suggestion.id}
                isExiting={exitingSuggestionId === suggestion.id}
                isReanalyzing={isReanalyzing}
                messages={messages}
                onAccept={() => onAccept(suggestion.id)}
                onCancelEdit={onCancelEdit}
                onEdit={() => onEdit(suggestion.id)}
                onIgnore={() => onIgnore(suggestion.id)}
                onSaveEdit={(lines) => onSaveEdit(suggestion.id, lines)}
                onUndo={onUndo}
                scoreDelta={scoreDelta}
                sectionTitle={copy.title}
                suggestion={suggestion}
              />
            ))
          ) : (
            <p className="mt-(--rt-space-2) rounded-md border border-line-subtle bg-canvas p-(--rt-space-3) text-xs text-ink-muted">
              {messages.alignedLabel}
            </p>
          )}

          {ignoredSuggestions.length > 0 ? (
            <ul className="mt-(--rt-space-2) space-y-1">
              {ignoredSuggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  className="flex items-center gap-(--rt-space-2) text-2xs text-ink-tertiary"
                >
                  <span className="min-w-0 flex-1 truncate">
                    {messages.suggestionTypes[suggestion.type]} ·{" "}
                    {messages.ignoredLabel}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRestore(suggestion.id)}
                    className="rounded-md px-(--rt-space-2) py-0.5 font-semibold text-brand transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand"
                  >
                    {messages.restoreLabel}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
