import { Metadata } from "next";
import { TimelineHero } from "@/components/about/TimelineHero";
import { StoryPhases } from "@/components/about/StoryPhases";
import { LeadershipSection } from "@/components/about/LeadershipSection";
import { ValuesSection } from "@/components/about/ValuesSection";
import { CTASection } from "@/components/about/CTASection";

export const metadata: Metadata = {
  title: "About Us - From Dubai 2009 to AI Revolution 2025 | Aliff Services",
  description:
    "From a napkin sketch over mint tea to the world's first AI-orchestrated workforce platform. Learn about Aliff Services' 16-year journey from GWOT-era federal contracting to AI-powered service delivery.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Timeline Hero - Animated 2009→2025 */}
      <TimelineHero />

      {/* Origin Story - 4 Phases */}
      <StoryPhases />

      {/* Leadership - Founders + AI PM Team */}
      <LeadershipSection />

      {/* Values Grid */}
      <ValuesSection />

      {/* CTA Section */}
      <CTASection />
    </main>
  );
}
