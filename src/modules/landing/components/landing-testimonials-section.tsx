import type { LandingHome } from "@/modules/landing/components/landing-types";

type LandingTestimonialsSectionProps = Readonly<{
  home: LandingHome;
}>;

const avatarStyles = [
  "bg-brand text-white",
  "bg-positive text-white",
  "bg-caution text-ink",
  "bg-surface-brand text-brand",
] as const;

const cardOffsets = ["", "lg:mt-(--rt-space-8)", "lg:mt-(--rt-space-4)", "lg:mt-(--rt-space-12)"] as const;

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

export function LandingTestimonialsSection({ home }: LandingTestimonialsSectionProps) {
  const { testimonials } = home;

  return (
    <section id="testimonials" className="scroll-mt-(--rt-space-8) bg-canvas px-(--rt-page-gutter) py-(--rt-space-24)">
      <div className="mx-auto max-w-(--rt-container-max)">
        <div className="grid gap-(--rt-space-10) lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-(--rt-letter-spacing-wide) text-ink-subtle">
              {testimonials.eyebrow}
            </p>
            <h2 className="mt-(--rt-space-4) max-w-3xl font-display text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
              {testimonials.title}
            </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-ink-muted lg:mt-(--rt-space-2)">
            {testimonials.description}
          </p>
        </div>

        <div className="mt-(--rt-space-16) grid gap-(--rt-space-5) sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.items.map((testimonial, index) => (
            <article
              key={testimonial.name}
              className={`flex h-full flex-col rounded-panel border border-line-subtle bg-surface p-(--rt-space-6) ${cardOffsets[index % cardOffsets.length]}`}
            >
              <div className="flex items-center gap-(--rt-space-3)">
                <span className={`inline-flex h-(--rt-control-height-lg) w-(--rt-control-height-lg) shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarStyles[index % avatarStyles.length]}`}>
                  {getInitials(testimonial.name)}
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-ink">{testimonial.name}</h3>
                  <p className="truncate text-xs text-ink-subtle">{testimonial.role}</p>
                </div>
              </div>
              <p className="mt-(--rt-space-6) text-sm leading-relaxed text-ink-muted">“{testimonial.quote}”</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
