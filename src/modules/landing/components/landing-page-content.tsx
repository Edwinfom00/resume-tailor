import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/messages/types";
import { LandingFeaturesSection } from "@/modules/landing/components/landing-features-section";
import { LandingFaqSection } from "@/modules/landing/components/landing-faq-section";
import { LandingFinalCtaSection } from "@/modules/landing/components/landing-final-cta-section";
import { LandingFooter } from "@/modules/landing/components/landing-footer";
import { LandingHeroSection } from "@/modules/landing/components/landing-hero-section";
import { LandingHowItWorksSection } from "@/modules/landing/components/landing-how-it-works-section";
import { LandingPricingSection } from "@/modules/landing/components/landing-pricing-section";
import { LandingTestimonialsSection } from "@/modules/landing/components/landing-testimonials-section";

type LandingPageContentProps = Readonly<{
  dictionary: Messages;
  locale: Locale;
}>;

export function LandingPageContent({ dictionary, locale }: LandingPageContentProps) {
  const { home, navigation } = dictionary;

  return (
    <main className="flex-1 overflow-hidden bg-canvas">
      <LandingHeroSection dictionary={dictionary} locale={locale} />
      <LandingHowItWorksSection home={home} />
      <LandingFeaturesSection home={home} />
      <LandingPricingSection home={home} locale={locale} />
      <LandingTestimonialsSection home={home} />
      <LandingFaqSection home={home} />
      <LandingFinalCtaSection home={home} locale={locale} />
      <LandingFooter home={home} locale={locale} navigation={navigation} />
    </main>
  );
}
