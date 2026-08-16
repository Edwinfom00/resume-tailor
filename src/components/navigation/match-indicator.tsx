"use client";

import { useSessionStore } from "@/modules/session/state/session-store";
import { useSessionHydrated } from "@/modules/session/state/use-session-hydrated";
import { useAnimatedNumber } from "@/modules/shared/ui/use-animated-number";
import { formatTemplate } from "@/modules/shared/ui/format-template";
import type { Messages } from "@/i18n/messages/types";

type MatchIndicatorProps = Readonly<{
  messages: Messages["workspaceHeader"];
  previewScore?: number;
}>;

const circumference = 2 * Math.PI * 10;

export function MatchIndicator({
  messages,
  previewScore,
}: MatchIndicatorProps) {
  const isHydrated = useSessionHydrated();
  const sessionScore = useSessionStore((state) => state.analysis.data?.score.overall);
  const previousScore = useSessionStore((state) => state.analysis.previousScore);
  const isRunning = useSessionStore((state) => state.analysis.running);

  const displayedScore = useAnimatedNumber(
    previewScore ?? (isHydrated ? sessionScore : undefined),
  );
  const delta =
    previewScore === undefined && !isRunning && sessionScore !== undefined && previousScore !== undefined
      ? sessionScore - previousScore
      : 0;

  return (
    <div className="hidden h-(--rt-control-height-md) items-center gap-(--rt-space-2) rounded-lg border border-line-subtle bg-surface px-(--rt-space-3) text-sm font-semibold text-ink shadow-xs sm:flex">
      <span>{messages.matchLabel}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className={`h-6 w-6 -rotate-90 ${isRunning ? "rt-animate-breathe" : ""}`}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          strokeWidth="2.5"
          className="stroke-brand-subtle"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={
            circumference * (1 - Math.min(100, displayedScore ?? 0) / 100)
          }
          className="stroke-brand transition-[stroke-dashoffset] duration-(--rt-duration-slow) ease-(--rt-easing-emphasized)"
        />
      </svg>
      <span
          aria-live="polite"
          aria-label={previewScore === undefined && isRunning ? messages.recalculatingLabel : undefined}
        className="text-ink-muted"
      >
        {displayedScore === undefined ? messages.matchValue : `${displayedScore}%`}
      </span>
      {delta !== 0 ? (
        <span
          className={`rt-animate-rise text-xs font-semibold ${
            delta > 0 ? "text-positive" : "text-caution"
          }`}
        >
          {formatTemplate(
            delta > 0 ? messages.matchGainLabel : messages.matchLossLabel,
            { value: delta },
          )}
        </span>
      ) : null}
    </div>
  );
}
