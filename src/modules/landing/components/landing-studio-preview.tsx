import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages/types";
import { runDeterministicAnalysis } from "@/modules/analysis/engine/run-analysis";
import { toHighImpactImprovements, toStudioRecommendations } from "@/modules/studio/view-models/recommendations-view";
import { edwinResume } from "@/modules/resume/fixtures/edwin-resume";
import { sampleJobDescription } from "@/modules/job/fixtures/sample-job-description";
import { buildDeterministicJobDraft } from "@/modules/job/normalization/deterministic-job-structure";
import { assembleJobOffer } from "@/modules/job/services/assemble-job-offer";
import { toStudioJobOfferView } from "@/modules/studio/view-models/job-offer-view";
import { LandingStudioWorkspace } from "@/modules/landing/components/landing-studio-workspace";

type LandingStudioPreviewProps = Readonly<{
  dictionary: Messages;
  locale: Locale;
}>;

export function LandingStudioPreview({
  dictionary,
  locale,
}: LandingStudioPreviewProps) {
  const job = assembleJobOffer(buildDeterministicJobDraft(sampleJobDescription), {
    source: "text",
    rawText: sampleJobDescription,
  });
  const outcome = runDeterministicAnalysis(edwinResume, job);

  return (
    <LandingStudioWorkspace
      dictionary={dictionary}
      highImpactImprovements={toHighImpactImprovements(
        edwinResume,
        outcome.suggestions,
      )}
      jobOffer={toStudioJobOfferView(job, outcome.analysis, locale)}
      locale={locale}
      recommendations={toStudioRecommendations(
        edwinResume,
        job,
        outcome.analysis,
        outcome.suggestions,
      )}
      resume={edwinResume}
      score={outcome.analysis.score.overall}
    />
  );
}
