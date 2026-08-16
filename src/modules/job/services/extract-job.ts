import "server-only";
import { analyzeJobWithAi } from "@/modules/ai/analyze-job";
import { createJobError } from "@/modules/job/domain/job-errors";
import type { JobOffer } from "@/modules/job/domain/job-offer";
import {
  assessJobContent,
  minimumJobTextLength,
} from "@/modules/job/extraction/detect-job-content";
import { fetchJobPage } from "@/modules/job/extraction/fetch-job-page";
import { buildDeterministicJobDraft } from "@/modules/job/normalization/deterministic-job-structure";
import {
  assembleJobOffer,
  mergeJobDrafts,
} from "@/modules/job/services/assemble-job-offer";
import type { DomainError } from "@/modules/shared/domain/domain-error";
import { err, ok, type Result } from "@/modules/shared/domain/result";
import { collapseWhitespace } from "@/modules/shared/text/normalize-text";

interface JobSourceContent {
  readonly rawText: string;
  readonly url?: string;
  readonly hints: Readonly<{
    title?: string;
    company?: string;
    location?: string;
    employmentType?: string;
  }>;
}

async function structureJobOffer(
  content: JobSourceContent,
  source: "url" | "text",
): Promise<JobOffer> {
  const deterministic = buildDeterministicJobDraft(
    content.rawText,
    content.hints,
  );
  const aiResult = await analyzeJobWithAi(content.rawText, content.hints);
  const draft = aiResult.ok
    ? mergeJobDrafts(deterministic, aiResult.value)
    : deterministic;

  return assembleJobOffer(draft, {
    source,
    rawText: content.rawText,
    url: content.url,
  });
}

export async function extractJobFromUrl(
  url: string,
): Promise<Result<JobOffer, DomainError>> {
  const pageResult = await fetchJobPage(url);

  if (!pageResult.ok) {
    return pageResult;
  }

  const page = pageResult.value;

  return ok(
    await structureJobOffer(
      {
        rawText: page.text,
        url: page.url,
        hints: {
          title: page.title,
          company: page.company,
          location: page.location,
          employmentType: page.employmentType,
        },
      },
      "url",
    ),
  );
}

export async function extractJobFromText(
  description: string,
): Promise<Result<JobOffer, DomainError>> {
  const rawText = description.replace(/\r\n?/g, "\n").trim();

  if (collapseWhitespace(rawText).length < minimumJobTextLength) {
    return err(createJobError("EMPTY_DESCRIPTION"));
  }

  const assessment = assessJobContent(rawText);

  if (assessment.signalCount === 0 && rawText.length < 400) {
    return err(createJobError("NO_JOB_CONTENT"));
  }

  return ok(await structureJobOffer({ rawText, hints: {} }, "text"));
}
