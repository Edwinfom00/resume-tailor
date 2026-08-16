"use client";

import { useState } from "react";
import {
  FiArrowRight,
  FiBriefcase,
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiCode,
  FiEdit3,
  FiInfo,
  FiTool,
  FiUser,
  FiX,
  FiZap,
} from "react-icons/fi";
import { HiMiniSparkles } from "react-icons/hi2";
import type { Messages } from "@/i18n/messages/types";
import {
  studioHighImpactImprovements,
  studioRecommendations,
  type StudioHighImpactImprovement,
  type StudioHighImpactImprovementId,
  type StudioRecommendation,
  type StudioRecommendationId,
} from "@/modules/studio/fixtures/recommendations";

type AiRecommendationsPanelProps = Readonly<{
  messages: Messages["studio"]["recommendations"];
  recommendations?: readonly StudioRecommendation[];
  highImpactImprovements?: readonly StudioHighImpactImprovement[];
  onAccept?: (recommendationId: StudioRecommendationId) => void;
  onEdit?: (recommendationId: StudioRecommendationId) => void;
  onIgnore?: (recommendationId: StudioRecommendationId) => void;
  onHighImpactSelect?: (improvementId: StudioHighImpactImprovementId) => void;
}>;

const recommendationIcons = {
  profile: FiUser,
  experience: FiBriefcase,
  projects: FiCode,
  skills: FiTool,
} as const;

function getRelevanceLabel(template: string, value: number) {
  return template.replace("{value}", String(value));
}

export function AiRecommendationsPanel({
  messages,
  recommendations = studioRecommendations,
  highImpactImprovements = studioHighImpactImprovements,
  onAccept,
  onEdit,
  onIgnore,
  onHighImpactSelect,
}: AiRecommendationsPanelProps) {
  const [expandedRecommendationId, setExpandedRecommendationId] =
    useState<StudioRecommendationId | null>("skills");
  const [acceptedRecommendationIds, setAcceptedRecommendationIds] = useState<
    readonly StudioRecommendationId[]
  >([]);
  const [ignoredRecommendationIds, setIgnoredRecommendationIds] = useState<
    readonly StudioRecommendationId[]
  >([]);

  const visibleRecommendations = recommendations.filter(
    (recommendation) => !ignoredRecommendationIds.includes(recommendation.id),
  );

  const toggleRecommendation = (recommendationId: StudioRecommendationId) => {
    setExpandedRecommendationId((currentId) =>
      currentId === recommendationId ? null : recommendationId,
    );
  };

  const acceptRecommendation = (recommendationId: StudioRecommendationId) => {
    setAcceptedRecommendationIds((currentIds) =>
      currentIds.includes(recommendationId)
        ? currentIds
        : [...currentIds, recommendationId],
    );
    onAccept?.(recommendationId);
  };

  const ignoreRecommendation = (recommendationId: StudioRecommendationId) => {
    setIgnoredRecommendationIds((currentIds) => [...currentIds, recommendationId]);
    setExpandedRecommendationId((currentId) =>
      currentId === recommendationId ? null : currentId,
    );
    onIgnore?.(recommendationId);
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

      <div className="mt-(--rt-space-3) space-y-(--rt-space-2)">
        {visibleRecommendations.map((recommendation) => {
          const Icon = recommendationIcons[recommendation.id];
          const copy = messages.items[recommendation.id];
          const isExpanded = expandedRecommendationId === recommendation.id;
          const isAccepted = acceptedRecommendationIds.includes(recommendation.id);
          const isPositive = recommendation.tone === "positive";

          return (
            <section
              key={recommendation.id}
              className={`overflow-hidden rounded-lg border bg-surface transition-colors duration-(--rt-duration-fast) ${isExpanded ? "border-brand-line" : "border-line-subtle"
                }`}
            >
              <button
                type="button"
                aria-expanded={isExpanded}
                aria-label={`${isExpanded ? messages.closeLabel : messages.openLabel}: ${copy.title}`}
                onClick={() => toggleRecommendation(recommendation.id)}
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
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${isPositive
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

              {isExpanded &&
                recommendation.currentKeywords &&
                recommendation.suggestedKeywords ? (
                <div className="border-t border-line-subtle px-(--rt-space-3) pb-(--rt-space-2) pt-(--rt-space-2)">
                  <div className="rounded-md border border-line-subtle bg-canvas p-(--rt-space-2)">
                    <p className="text-xs font-bold text-ink">{messages.currentLabel}</p>
                    <p className="mt-(--rt-space-2) text-2xs leading-relaxed text-ink-muted">
                      {recommendation.currentKeywords.join(", ")}
                    </p>
                  </div>
                  <div className="mt-(--rt-space-2) rounded-md border border-line-subtle bg-canvas p-(--rt-space-2)">
                    <div className="flex items-center justify-between gap-(--rt-space-3)">
                      <p className="text-xs font-bold text-ink">{messages.suggestedImprovementLabel}</p>
                      {recommendation.relevanceGain ? (
                        <span className="rounded-pill bg-success-50 px-(--rt-space-2) py-0.5 text-xs font-semibold text-positive">
                          {getRelevanceLabel(messages.relevanceLabel, recommendation.relevanceGain)}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-(--rt-space-2) text-xs leading-relaxed text-ink-muted">
                      {recommendation.suggestedKeywords.join(", ")}
                    </p>
                  </div>
                  <div className="mt-(--rt-space-2) flex gap-(--rt-space-2)">
                    <button
                      type="button"
                      onClick={() => acceptRecommendation(recommendation.id)}
                      className={`inline-flex h-(--rt-control-height-sm) items-center gap-(--rt-space-2) rounded-md px-(--rt-space-4) text-sm font-medium transition-colors duration-(--rt-duration-fast) ${isAccepted
                        ? "bg-success-50 text-positive"
                        : "bg-brand text-white hover:bg-brand-hover"
                        }`}
                    >
                      <FiCheck aria-hidden="true" className="h-4 w-4" />
                      {isAccepted ? messages.acceptedLabel : messages.acceptLabel}
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit?.(recommendation.id)}
                      className="inline-flex h-(--rt-control-height-sm) items-center gap-(--rt-space-2) rounded-md border border-line-subtle px-(--rt-space-4) text-sm font-medium text-ink-muted transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand hover:text-brand"
                    >
                      <FiEdit3 aria-hidden="true" className="h-4 w-4" />
                      {messages.editLabel}
                    </button>
                    <button
                      type="button"
                      onClick={() => ignoreRecommendation(recommendation.id)}
                      className="inline-flex h-(--rt-control-height-sm) items-center gap-(--rt-space-2) rounded-md border border-line-subtle px-(--rt-space-4) text-sm font-medium text-ink-muted transition-colors duration-(--rt-duration-fast) hover:bg-negative-subtle hover:text-negative"
                    >
                      <FiX aria-hidden="true" className="h-4 w-4" />
                      {messages.ignoreLabel}
                    </button>
                  </div>
                </div>
              ) : null}
            </section>
          );
        })}
      </div>

      <section className="mt-(--rt-space-3) rounded-lg border border-line-subtle bg-surface p-(--rt-space-3)">
        <div className="flex items-start gap-(--rt-space-3)">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-caution-subtle text-caution">
            <FiZap aria-hidden="true" className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-ink">{messages.highImpactTitle}</h2>
            <p className="mt-0.5 text-xs text-ink-muted">{messages.highImpactDescription}</p>
          </div>
        </div>
        <ul className="mt-(--rt-space-3) space-y-(--rt-space-2)">
          {highImpactImprovements.map((improvement) => {
            const copy = messages.improvements[improvement.id];

            return (
              <li key={improvement.id}>
                <button
                  type="button"
                  onClick={() => onHighImpactSelect?.(improvement.id)}
                  className="flex w-full items-center gap-(--rt-space-3) rounded-md border border-line-subtle bg-surface p-(--rt-space-2) text-left transition-colors duration-(--rt-duration-fast) hover:bg-surface-brand"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-brand text-brand">
                    <HiMiniSparkles aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-ink">{copy.title}</span>
                    <span className="mt-0.5 block truncate text-xs text-ink-muted">
                      {copy.description}
                    </span>
                  </span>
                  <span className="rounded-pill bg-success-50 px-(--rt-space-2) py-0.5 text-xs font-semibold text-positive">
                    {messages.highImpactBadge}
                  </span>
                  <FiArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-muted" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </aside>
  );
}
