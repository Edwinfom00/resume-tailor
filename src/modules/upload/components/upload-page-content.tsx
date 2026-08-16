import { FiArrowLeft } from "react-icons/fi";
import { UploadAnalysisWorkspace } from "@/modules/upload/components/upload-analysis-workspace";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages/types";

type UploadPageContentProps = Readonly<{
  dictionary: Messages;
  locale: Locale;
}>;

export function UploadPageContent({ dictionary, locale }: UploadPageContentProps) {
  return (
    <main className="flex flex-1 flex-col bg-canvas px-(--rt-workspace-page-gutter) py-(--rt-space-6) sm:py-(--rt-space-8)">
      <div className="w-full">
        <div className="mb-(--rt-space-5)">
          <p className="flex items-center gap-(--rt-space-2) text-xs font-medium text-brand">
            <FiArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
            {dictionary.upload.dashboardLabel}
          </p>
          <h1 className="mt-(--rt-space-2) text-3xl font-bold tracking-tight text-ink">
            {dictionary.upload.title}
          </h1>
          <p className="mt-(--rt-space-1) text-sm text-ink-muted">
            {dictionary.upload.description}
          </p>
        </div>
        <UploadAnalysisWorkspace
          analysisBenefitsMessages={dictionary.analysisBenefits}
          domainErrorMessages={dictionary.domainErrors}
          jobOfferMessages={dictionary.jobOffer}
          locale={locale}
          messages={dictionary.upload}
        />
      </div>
    </main>
  );
}
