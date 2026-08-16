export interface DomainError {
  readonly code: string;
  readonly message: string;
  readonly recoverable: boolean;
  readonly cause?: unknown;
}

export function createDomainError(
  code: string,
  message: string,
  options: Readonly<{ recoverable?: boolean; cause?: unknown }> = {},
): DomainError {
  return {
    code,
    message,
    recoverable: options.recoverable ?? true,
    cause: options.cause,
  };
}

export function isDomainError(value: unknown): value is DomainError {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as DomainError).code === "string" &&
    typeof (value as DomainError).message === "string" &&
    typeof (value as DomainError).recoverable === "boolean"
  );
}

export function toTransportError(error: DomainError) {
  return {
    code: error.code,
    message: error.message,
    recoverable: error.recoverable,
  };
}

export function describeUnknownCause(cause: unknown) {
  if (cause instanceof Error) {
    return cause.message;
  }

  if (typeof cause === "string") {
    return cause;
  }

  return "Unknown failure";
}
