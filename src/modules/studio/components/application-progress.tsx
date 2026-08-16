import { FiCheck, FiLoader } from "react-icons/fi";
import type { ApplicationPhase } from "@/modules/session/domain/application-phase";
import type { Messages } from "@/i18n/messages/types";

type ApplicationProgressMessages = Pick<
  Messages["studio"]["copilot"],
  | "applyingChangesTitle"
  | "applyingChangesDescription"
  | "evaluatingMatchTitle"
  | "evaluatingMatchDescription"
  | "applicationStepLabel"
  | "evaluationStepLabel"
  | "processingLabel"
>;

type ApplicationProgressProps = Readonly<{
  messages: ApplicationProgressMessages;
  phase: ApplicationPhase;
}>;

export function ApplicationProgress({
  messages,
  phase,
}: ApplicationProgressProps) {
  const isEvaluating = phase === "evaluating";
  const title = isEvaluating
    ? messages.evaluatingMatchTitle
    : messages.applyingChangesTitle;
  const description = isEvaluating
    ? messages.evaluatingMatchDescription
    : messages.applyingChangesDescription;

  return (
    <div
      aria-live="polite"
      className="rt-animate-expand-in border-t border-line-subtle bg-surface-brand p-(--rt-space-3)"
    >
      <div className="flex items-start gap-(--rt-space-3)">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-surface text-brand shadow-xs">
          <FiLoader aria-hidden="true" className="h-4 w-4 animate-spin" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-(--rt-space-3)">
            <p className="text-xs font-bold text-ink">{title}</p>
            <span className="rounded-pill bg-surface px-(--rt-space-2) py-0.5 text-2xs font-semibold text-brand shadow-xs">
              {messages.processingLabel}
            </span>
          </div>
          <p className="mt-1 text-2xs leading-relaxed text-ink-muted">
            {description}
          </p>
        </div>
      </div>

      <div className="rt-indeterminate-track mt-(--rt-space-3) h-1.5 rounded-pill bg-brand-subtle" />

      <ol className="mt-(--rt-space-3) space-y-(--rt-space-2)">
        <li className="flex items-center gap-(--rt-space-2) text-2xs font-semibold text-ink-muted">
          {isEvaluating ? (
            <span className="flex h-4 w-4 items-center justify-center rounded-pill bg-success-50 text-positive">
              <FiCheck aria-hidden="true" className="h-3 w-3" />
            </span>
          ) : (
            <FiLoader aria-hidden="true" className="h-4 w-4 animate-spin text-brand" />
          )}
          {messages.applicationStepLabel}
        </li>
        <li
          className={`flex items-center gap-(--rt-space-2) text-2xs font-semibold ${
            isEvaluating ? "text-brand" : "text-ink-subtle"
          }`}
        >
          {isEvaluating ? (
            <FiLoader aria-hidden="true" className="h-4 w-4 animate-spin" />
          ) : (
            <span className="h-4 w-4 rounded-pill border border-line" />
          )}
          {messages.evaluationStepLabel}
        </li>
      </ol>
    </div>
  );
}
