import type { Metadata } from "next";
import Link from "next/link";
import { CaseStudiesGrid } from "@/components/case-studies/CaseStudiesGrid";
import { allCaseStudies } from "@/data/caseStudies";

export const metadata: Metadata = {
  title: "Case Studies - Client Success Stories | Aliff Services",
  description:
    "Real results from clients who use our Strategic Thinking + AI Execution approach. See how agencies and contractors achieve measurable wins.",
};

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-navy py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-display-lg font-bold text-white mb-6">
              Client Success Stories
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Real results from real clients. See how our Strategic Thinking + AI Execution
              approach delivers measurable wins across GOVCON, SLED, IT, and writing services.
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-white">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
                <div className="text-3xl font-bold text-gold-400">
                  {allCaseStudies.length}
                </div>
                <div className="text-sm text-gray-300">Success Stories</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
                <div className="text-3xl font-bold text-gold-400">22%</div>
                <div className="text-sm text-gray-300">Avg Win Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
                <div className="text-3xl font-bold text-gold-400">3x</div>
                <div className="text-sm text-gray-300">Avg Capacity Increase</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Grid with Filters */}
      <section className="py-16">
        <div className="container-custom">
          <CaseStudiesGrid caseStudies={allCaseStudies} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Achieve Similar Results?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Let's discuss how our Strategic Thinking + AI Execution approach can help you win
              more contracts, scale your capacity, or accelerate your growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="btn-primary btn-lg"
              >
                Request Free Consultation
              </Link>
              <Link
                href="/services"
                className="btn-outline btn-lg"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
