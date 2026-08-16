import { FiChevronDown } from "react-icons/fi";
import type { LandingHome } from "@/modules/landing/components/landing-types";

type LandingFaqSectionProps = Readonly<{
  home: LandingHome;
}>;

export function LandingFaqSection({ home }: LandingFaqSectionProps) {
  const { faq } = home;

  return (
    <section id="faq" className="scroll-mt-(--rt-space-8) bg-surface px-(--rt-page-gutter) py-(--rt-space-24)">
      <div className="mx-auto max-w-(--rt-container-max)">
        <div className="grid gap-(--rt-space-10) lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
          <h2 className="max-w-3xl font-display text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
            {faq.title}
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-ink-muted lg:mt-(--rt-space-2)">{faq.description}</p>
        </div>

        <div className="mt-(--rt-space-16) grid gap-(--rt-space-10) lg:grid-cols-[minmax(10rem,0.3fr)_minmax(0,1fr)]">
          <nav aria-label={faq.title} className="flex gap-(--rt-space-4) text-sm font-medium text-ink-muted lg:sticky lg:top-(--rt-space-8) lg:flex-col">
            {faq.groups.map((group, groupIndex) => (
              <a key={group.title} href={`#faq-group-${groupIndex}`} className="transition-colors hover:text-brand">
                {group.title}
              </a>
            ))}
          </nav>

          <div className="space-y-(--rt-space-12)">
            {faq.groups.map((group, groupIndex) => (
              <section key={group.title} id={`faq-group-${groupIndex}`} className="scroll-mt-(--rt-space-16)">
                <h3 className="text-lg font-semibold text-ink">{group.title}</h3>
                <div className="mt-(--rt-space-4) divide-y divide-line-subtle rounded-card border border-line-subtle bg-surface">
                  {group.items.map((item, itemIndex) => (
                    <details key={item.question} open={groupIndex === 0 && itemIndex === 0} className="group px-(--rt-space-5)">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-(--rt-space-5) py-(--rt-space-4) text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
                        {item.question}
                        <FiChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-muted transition-transform duration-(--rt-duration-fast) group-open:rotate-180" />
                      </summary>
                      <p className="max-w-3xl pb-(--rt-space-5) text-sm leading-relaxed text-ink-muted">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
