import type { DomainError } from "@/modules/shared/domain/domain-error";

export type Result<TValue, TError = DomainError> =
  | Readonly<{ ok: true; value: TValue }>
  | Readonly<{ ok: false; error: TError }>;

export function ok<TValue>(value: TValue): Result<TValue, never> {
  return { ok: true, value };
}

export function err<TError>(error: TError): Result<never, TError> {
  return { ok: false, error };
}

export function mapResult<TValue, TNext, TError>(
  result: Result<TValue, TError>,
  transform: (value: TValue) => TNext,
): Result<TNext, TError> {
  return result.ok ? ok(transform(result.value)) : result;
}

export async function chainResult<TValue, TNext, TError>(
  result: Result<TValue, TError>,
  transform: (value: TValue) => Promise<Result<TNext, TError>>,
): Promise<Result<TNext, TError>> {
  return result.ok ? transform(result.value) : result;
}
