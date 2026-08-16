import "server-only";
import { createJobError } from "@/modules/job/domain/job-errors";
import {
  assessJobContent,
  minimumJobTextLength,
} from "@/modules/job/extraction/detect-job-content";
import {
  extractHtmlTitle,
  extractJsonLdJobPosting,
  extractMetaContent,
  htmlToText,
} from "@/modules/job/extraction/html-to-text";
import { validateJobUrl } from "@/modules/job/extraction/validate-job-url";
import type { DomainError } from "@/modules/shared/domain/domain-error";
import { err, ok, type Result } from "@/modules/shared/domain/result";
import { collapseWhitespace } from "@/modules/shared/text/normalize-text";

const requestTimeoutMs = 12000;
const maximumResponseBytes = 3 * 1024 * 1024;

const userAgent =
  "Mozilla/5.0 (compatible; ResumeTailorBot/1.0; +https://resume-tailor.local/bot)";

export interface FetchedJobPage {
  readonly url: string;
  readonly text: string;
  readonly title?: string;
  readonly company?: string;
  readonly location?: string;
  readonly employmentType?: string;
}

function readJsonLdString(value: unknown) {
  return typeof value === "string" ? collapseWhitespace(value) : undefined;
}

function readJobPostingHints(posting: Record<string, unknown> | undefined) {
  if (!posting) {
    return {};
  }

  const organization = posting.hiringOrganization as
    | Record<string, unknown>
    | undefined;
  const jobLocation = (
    Array.isArray(posting.jobLocation) ? posting.jobLocation[0] : posting.jobLocation
  ) as Record<string, unknown> | undefined;
  const address = jobLocation?.address as Record<string, unknown> | undefined;

  return {
    title: readJsonLdString(posting.title),
    company: readJsonLdString(organization?.name),
    location: [
      readJsonLdString(address?.addressLocality),
      readJsonLdString(address?.addressCountry),
    ]
      .filter(Boolean)
      .join(", "),
    employmentType: Array.isArray(posting.employmentType)
      ? readJsonLdString(posting.employmentType[0])
      : readJsonLdString(posting.employmentType),
    description: readJsonLdString(posting.description),
  };
}

async function readLimitedText(response: Response) {
  const buffer = await response.arrayBuffer();

  if (buffer.byteLength > maximumResponseBytes) {
    return new TextDecoder().decode(buffer.slice(0, maximumResponseBytes));
  }

  return new TextDecoder().decode(buffer);
}

export async function fetchJobPage(
  rawUrl: string,
): Promise<Result<FetchedJobPage, DomainError>> {
  const urlResult = validateJobUrl(rawUrl);

  if (!urlResult.ok) {
    return urlResult;
  }

  const url = urlResult.value;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
  let response: Response;

  try {
    response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "user-agent": userAgent,
        accept: "text/html,application/xhtml+xml",
        "accept-language": "en,de;q=0.8,fr;q=0.7",
      },
    });
  } catch (cause) {
    clearTimeout(timeout);

    const aborted = cause instanceof Error && cause.name === "AbortError";

    return err(
      createJobError(aborted ? "REQUEST_TIMEOUT" : "UNREACHABLE_URL", { cause }),
    );
  } finally {
    clearTimeout(timeout);
  }

  if (response.status === 403 || response.status === 429) {
    return err(createJobError("BLOCKED_PAGE"));
  }

  if (!response.ok) {
    return err(createJobError("UNREACHABLE_URL"));
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("html") && !contentType.includes("text/plain")) {
    return err(createJobError("NON_HTML_RESPONSE"));
  }

  const html = await readLimitedText(response);

  if (!html.trim()) {
    return err(createJobError("EMPTY_PAGE"));
  }

  const posting = extractJsonLdJobPosting(html);
  const hints = readJobPostingHints(posting);
  const pageText = htmlToText(html);
  const structuredDescription = hints.description
    ? htmlToText(hints.description)
    : "";
  const text =
    structuredDescription.length > pageText.length
      ? structuredDescription
      : pageText;

  const assessment = assessJobContent(text);

  if (assessment.blocked) {
    return err(createJobError("BLOCKED_PAGE"));
  }

  if (text.length < minimumJobTextLength) {
    return err(createJobError("EMPTY_PAGE"));
  }

  if (!assessment.likelyJobContent) {
    return err(createJobError("NO_JOB_CONTENT"));
  }

  return ok({
    url: url.toString(),
    text,
    title:
      hints.title ??
      extractMetaContent(html, "og:title") ??
      extractHtmlTitle(html),
    company: hints.company ?? extractMetaContent(html, "og:site_name"),
    location: hints.location || undefined,
    employmentType: hints.employmentType,
  });
}
