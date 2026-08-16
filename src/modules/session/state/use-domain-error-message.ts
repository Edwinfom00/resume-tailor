import type { Messages } from "@/i18n/messages/types";
import type { DomainError } from "@/modules/shared/domain/domain-error";

export function toLocalizedErrorMessage(
  error: DomainError | undefined,
  messages: Messages["domainErrors"],
) {
  if (!error) {
    return null;
  }

  return (
    messages[error.code as keyof Messages["domainErrors"]] ?? messages.UNKNOWN
  );
}
