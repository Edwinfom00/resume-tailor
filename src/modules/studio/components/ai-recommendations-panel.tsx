"use client";

import { useState } from "react";
import { FiArrowRight, FiInfo, FiZap } from "react-icons/fi";
import { HiMiniSparkles } from "react-icons/hi2";
import type { Messages } from "@/i18n/messages/types";
import type { ResumeSectionId } from "@/modules/session/domain/resume-selection";
import { formatTemplate } from "@/modules/shared/ui/format-template";
import { RecommendationCard } from "@/modules/studio/components/recommendation-card";
import { useRecommendationActions } from "@/modules/studio/hooks/use-recommendation-actions";
import type {
  StudioRecommendation,
  StudioSuggestionView,
} from "@/modules/studio/view-models/recommendations-view";

type AiRecommendationsPanelProps = Readonly<{
  hasAnalysis: boolean;
  highImpactImprovements: readonly StudioSuggestionView[];
  messages: Messages["studio"]["recommendations"];
  recommendations: readonly StudioRecommendation[];
}>;

export function AiRecommendationsPanel({
  hasAnalysis,
  highImpactImprovements,
  messages,
  recommendations,
}: AiRecommendationsPanelProps) {
  const [expandedSectionId, setExpandedSectionId] =
    useState<ResumeSectionId | null>(null);
  const [editingSuggestionId, setEditingSuggestionId] = useState<string | null>(
    null,
  );
  const actions = useRecommendationActions();

  const toggleSection = (sectionId: ResumeSectionId) => {
    setExpandedSectionId((currentId) =>
      currentId === sectionId ? null : sectionId,
    );
    setEditingSuggestionId(null);
  };

  const openImprovement = (suggestion: StudioSuggestionView) => {
    setExpandedSectionId(suggestion.section);
    setEditingSuggestionId(null);
    actions.focusSuggestion(suggestion.id);
  };

  return (
    <aside className="flex min-h-(--rt-studio-panel-min-height) w-full max-w-(--rt-studio-recommendations-width) flex-col rounded-xl border border-line-subtle bg-surface p-(--rt-space-5) shadow-xs min-[1672px]:max-w-none!">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-(--rt-space-3) text-lg font-bold tracking-tight text-ink">
          <HiMiniSparkles aria-hidden="true" className="h-5 w-5 text-brand" />
          {messages.title}
        </h1>
        <span aria-label={messages.infoLabel} className="text-ink-muted">
          <FiInfo aria-hidden="true" className="h-4 w-4" />
        </span>
      </div>

      {hasAnalysis ? (
        <>
          <div className="mt-(--rt-space-3) space-y-(--rt-space-2)">
            {recommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                applyingSuggestionId={actions.applyingSuggestionId}
                applyingSuggestionPhase={actions.applyingSuggestionPhase}
                canUndo={actions.canUndo}
                editingSuggestionId={editingSuggestionId}
                exitingSuggestionId={actions.exitingSuggestionId}
                isExpanded={expandedSectionId === recommendation.id}
                isReanalyzing={actions.isReanalyzing}
                messages={messages}
                onAccept={actions.accept}
                onCancelEdit={() => setEditingSuggestionId(null)}
                onEdit={setEditingSuggestionId}
                onIgnore={actions.ignore}
                onRestore={actions.restore}
                onSaveEdit={(suggestionId, lines) => {
                  actions.saveEdit(suggestionId, lines);
                  setEditingSuggestionId(null);
                }}
                onToggle={toggleSection}
                onUndo={actions.undo}
                recommendation={recommendation}
                scoreDelta={actions.scoreDelta}
              />
            ))}
          </div>

          <section className="mt-(--rt-space-3) rounded-lg border border-line-subtle bg-surface p-(--rt-space-3)">
            <div className="flex items-start gap-(--rt-space-3)">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-caution-subtle text-caution">
                <FiZap aria-hidden="true" className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-ink">
                  {messages.highImpactTitle}
                </h2>
                <p className="mt-0.5 text-xs text-ink-muted">
                  {messages.highImpactDescription}
                </p>
              </div>
            </div>
            {highImpactImprovements.length > 0 ? (
              <ul className="mt-(--rt-space-3) space-y-(--rt-space-2)">
                {highImpactImprovements.map((suggestion) => (
                  <li key={suggestion.id}>
                    <button
                      type="button"
                      onClick={() => openImprovement(suggestion)}
                      className="flex w-full items-center gap-(--rt-space-3) rounded-md border border-line-subtle bg-surface p-(--rt-space-2) text-left transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-brand text-brand">
                        <HiMiniSparkles aria-hidden="true" className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-bold text-ink">
                          {messages.suggestionTypes[suggestion.type]}
                          {suggestion.itemLabel ? ` · ${suggestion.itemLabel}` : ""}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-ink-muted">
                          {suggestion.reason}
                        </span>
                      </span>
                      <span className="rounded-pill bg-success-50 px-(--rt-space-2) py-0.5 text-xs font-semibold text-positive">
                        {formatTemplate(messages.impactLabel, {
                          value: suggestion.impact,
                        })}
                      </span>
                      <FiArrowRight
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0 text-ink-muted"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-(--rt-space-3) rounded-md border border-line-subtle bg-canvas p-(--rt-space-3) text-xs text-ink-muted">
                {messages.noHighImpactLabel}
              </p>
            )}
          </section>
        </>
      ) : (
        <div className="mt-(--rt-space-5) flex flex-1 items-center justify-center rounded-lg border border-dashed border-brand-line bg-canvas p-(--rt-space-6) text-center">
          <p className="text-sm text-ink-muted">{messages.emptyLabel}</p>
        </div>
      )}
    </aside>
  );
}
