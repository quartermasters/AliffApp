import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allCaseStudies, getCaseStudyBySlug } from "@/data/caseStudies";
import { getServiceBySlug } from "@/data/services";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return allCaseStudies.map((study) => ({
    slug: study.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const caseStudy = getCaseStudyBySlug(params.slug);

  if (!caseStudy) {
    return { title: "Case Study Not Found" };
  }

  return {
    title: `${caseStudy.title} | Case Study | Aliff Services`,
    description: caseStudy.teaser,
  };
}

export default function CaseStudyPage({ params }: Props) {
  const caseStudy = getCaseStudyBySlug(params.slug);

  if (!caseStudy) {
    notFound();
  }

  const relatedServices = caseStudy.relatedServices
    .map((slug) => getServiceBySlug(slug))
    .filter((s) => s !== undefined);

  const categoryLabels: Record<string, string> = {
    govcon: "GOVCON",
    sled: "SLED",
    it: "IT & Development",
    writing: "Writing",
    "b2b-agency": "B2B Agency",
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-navy py-16 md:py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm text-gray-300">
              <Link href="/case-studies" className="hover:text-white transition-colors">
                Case Studies
              </Link>
              <span className="mx-2">→</span>
              <span className="text-white">{caseStudy.title}</span>
            </nav>

            {/* Category & Client Type */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="inline-block px-4 py-2 bg-gold-600 text-white rounded-lg text-sm font-semibold">
                {categoryLabels[caseStudy.category]}
              </span>
              <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg text-sm font-semibold">
                {caseStudy.clientType}
              </span>
              {caseStudy.industry && (
                <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg text-sm">
                  {caseStudy.industry}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-display-lg font-bold text-white mb-6">
              {caseStudy.title}
            </h1>

            {/* Key Metric Hero */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="text-sm font-semibold text-gray-300 mb-2">KEY RESULT</div>
              <div className="text-5xl md:text-6xl font-bold text-gold-400 mb-2">
                {caseStudy.keyMetric}
              </div>
              <div className="text-gray-300">{caseStudy.teaser}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-navy-900">The Challenge</h2>
            <div className="bg-gray-50 rounded-xl p-8 border-l-4 border-red-500">
              <h3 className="text-2xl font-bold mb-4 text-navy-900">
                {caseStudy.challenge.title}
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">The Problem:</h4>
                  <p className="text-gray-700 leading-relaxed">{caseStudy.challenge.problem}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Why Traditional Solutions Failed:
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {caseStudy.challenge.whyTraditionalFailed}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What Was at Stake:</h4>
                  <p className="text-gray-700 leading-relaxed">{caseStudy.challenge.stakes}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-navy-900">Our Solution</h2>

            {/* Approach Overview */}
            <div className="mb-12">
              <p className="text-xl text-gray-700 leading-relaxed">{caseStudy.solution.approach}</p>
            </div>

            {/* Services Deployed */}
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-4 text-navy-900">Services Deployed:</h3>
              <ul className="space-y-2">
                {caseStudy.solution.servicesDeployed.map((service, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-teal-600 mt-1 flex-shrink-0">✓</span>
                    <span className="text-gray-700">{service}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3-Phase Approach */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-navy-900">
                Our 3-Phase Approach in Action
              </h3>
              <div className="space-y-6">
                {/* Phase 1 */}
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-teal-600">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-2 text-navy-900">
                        Strategic Diagnosis
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {caseStudy.solution.threePhaseInAction.strategic}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phase 2 */}
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-teal-600">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-2 text-navy-900">AI-Powered Execution</h4>
                      <p className="text-gray-700 leading-relaxed">
                        {caseStudy.solution.threePhaseInAction.ai}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phase 3 */}
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-teal-600">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-2 text-navy-900">Expert Refinement</h4>
                      <p className="text-gray-700 leading-relaxed">
                        {caseStudy.solution.threePhaseInAction.expert}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-navy-900">The Results</h2>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {caseStudy.results.metrics.map((metric, index) => (
                <div key={index} className="bg-teal-50 rounded-lg p-6 border border-teal-200">
                  <div className="text-sm font-semibold text-teal-700 mb-2">
                    {metric.label.toUpperCase()}
                  </div>
                  <div className="text-3xl font-bold text-teal-900">{metric.value}</div>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div className="mb-12">
              <div className="bg-gold-50 border-l-4 border-gold-600 p-6 rounded-lg">
                <div className="text-sm font-semibold text-gold-700 mb-2">TIMELINE</div>
                <div className="text-xl font-bold text-gold-900">{caseStudy.results.timeline}</div>
              </div>
            </div>

            {/* Client Quote */}
            {caseStudy.results.clientQuote && (
              <div className="bg-navy-900 text-white p-8 rounded-xl">
                <div className="text-6xl text-gold-400 mb-4">"</div>
                <p className="text-xl leading-relaxed mb-6 italic">
                  {caseStudy.results.clientQuote.text}
                </p>
                <div className="border-t border-white/20 pt-4">
                  <div className="font-semibold">{caseStudy.results.clientQuote.author}</div>
                  <div className="text-gray-400">{caseStudy.results.clientQuote.role}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Services Section */}
      {relatedServices.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-navy-900">Services Used in This Case</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedServices.slice(0, 4).map((service) => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.category}/${service.slug}`}
                    className="card-hover p-6 group"
                  >
                    <h3 className="text-xl font-bold mb-2 text-navy-900 group-hover:text-teal-600 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="text-teal-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                      Learn More
                      <span aria-hidden="true">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-navy">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Achieve Similar Results
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Let's discuss how our Strategic Thinking + AI Execution approach can help you solve
              your specific challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary btn-lg">
                Request Free Consultation
              </Link>
              <Link href="/case-studies" className="btn-outline btn-lg text-white border-white hover:bg-white hover:text-navy-900">
                View More Case Studies
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
