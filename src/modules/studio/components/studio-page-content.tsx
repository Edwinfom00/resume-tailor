import { JobOfferPanel } from "@/modules/studio/components/job-offer-panel";
import type { Messages } from "@/i18n/messages/types";

type StudioPageContentProps = Readonly<{
  dictionary: Messages;
}>;

export function StudioPageContent({ dictionary }: StudioPageContentProps) {
  return (
    <main className="grid flex-1 grid-cols-1 items-start gap-(--rt-workspace-grid-gap) bg-canvas px-(--rt-space-6) py-(--rt-space-3) lg:grid-cols-[minmax(0,var(--rt-studio-sidebar-width))_minmax(0,1fr)]">
      <JobOfferPanel messages={dictionary.studio.jobOffer} />
    </main>
  );
}
