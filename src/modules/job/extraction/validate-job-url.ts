import { createJobError } from "@/modules/job/domain/job-errors";
import type { DomainError } from "@/modules/shared/domain/domain-error";
import { err, ok, type Result } from "@/modules/shared/domain/result";

const blockedHostnames = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "metadata.google.internal",
  "169.254.169.254",
]);

const privateHostPattern =
  /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|::1$|fc00:|fe80:)/i;

export function validateJobUrl(value: string): Result<URL, DomainError> {
  const trimmed = value.trim();

  if (!trimmed) {
    return err(createJobError("INVALID_URL"));
  }

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let url: URL;

  try {
    url = new URL(candidate);
  } catch (cause) {
    return err(createJobError("INVALID_URL", { cause }));
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return err(createJobError("INVALID_URL"));
  }

  const hostname = url.hostname.toLowerCase();

  if (blockedHostnames.has(hostname) || privateHostPattern.test(hostname)) {
    return err(createJobError("UNREACHABLE_URL"));
  }

  if (!hostname.includes(".")) {
    return err(createJobError("INVALID_URL"));
  }

  return ok(url);
}
