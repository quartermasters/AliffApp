import { RotatingHero } from "@/components/marketing/hero/RotatingHero";
import { ServiceGrid } from "@/components/marketing/services/ServiceGrid";
import { B2BCallout } from "@/components/marketing/b2b/B2BCallout";
import { HowItWorks } from "@/components/marketing/process/HowItWorks";
import { Stats } from "@/components/marketing/Stats";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Auto-Rotating Hero - 3 Variants (GOVCON, IT, Writing) */}
      <RotatingHero />

      {/* Service Selector Cards - 4 Main Categories */}
      <ServiceGrid />

      {/* B2B Callout Banner - Critical (70-90% revenue) */}
      <B2BCallout />

      {/* How It Works - 3 Phase Process */}
      <HowItWorks />

      {/* Stats/Metrics Section */}
      <Stats />

      {/* TODO: Add remaining sections in future iterations:
        - Competitive Differentiation (Why Aliff vs AI-only vs Traditional)
        - Case Studies Preview
        - Final CTA Section
      */}
    </main>
  );
}
