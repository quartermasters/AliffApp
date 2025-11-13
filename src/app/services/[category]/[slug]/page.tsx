import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getServiceBySlug, getServicesByCategory, allServices } from "@/data/services";
import { Button } from "@/components/ui/button";

type Props = {
  params: {
    category: string;
    slug: string;
  };
};

export async function generateStaticParams() {
  return allServices.map((service) => ({
    category: service.category,
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getServiceBySlug(params.slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: service.name,
    description: service.description,
  };
}

export default function ServicePage({ params }: Props) {
  const service = getServiceBySlug(params.slug);

  if (!service || service.category !== params.category) {
    notFound();
  }

  const relatedServicesData = service.relatedServices
    .map((slug) => getServiceBySlug(slug))
    .filter((s) => s !== undefined)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-navy-900 text-white py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <Link
                href={`/services/${service.category}`}
                className="text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors"
              >
                ← Back to {service.category.toUpperCase()} Services
              </Link>
            </div>
            <h1 className="text-display-md md:text-display-lg font-bold mb-6">
              {service.headline}
            </h1>
            <p className="text-xl text-gray-300 mb-8">{service.description}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 font-semibold"
              >
                <Link href="/contact">Get Started</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-navy-900 px-8 py-3 font-semibold"
              >
                <Link href="/contact">Request Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Overview</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-lg mb-3">What It Is</h3>
                <p className="text-gray-700">{service.overview.whatItIs}</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-3">Who Needs It</h3>
                <p className="text-gray-700">{service.overview.whoNeedsIt}</p>
              </div>
            </div>
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-3">Key Challenges This Solves</h3>
              <ul className="space-y-2">
                {service.overview.keyChallenges.map((challenge, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-teal-600 mt-1">✗</span>
                    <span className="text-gray-700">{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-teal-50 border-l-4 border-teal-600 p-6 rounded-r-lg">
              <h3 className="font-bold text-lg mb-2">Why Strategic Thinking Matters</h3>
              <p className="text-gray-700">{service.overview.whyStrategic}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach - 3 Phase Process */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Approach</h2>
            <div className="space-y-8">
              {/* Phase 1 */}
              <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-teal-600">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                    1
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{service.approach.phase1.title}</h3>
                    <p className="text-gray-600">{service.approach.phase1.description}</p>
                  </div>
                </div>
                <ul className="ml-16 space-y-2">
                  {service.approach.phase1.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-teal-600 mt-1">•</span>
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Phase 2 */}
              <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-navy-600">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-navy-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                    2
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{service.approach.phase2.title}</h3>
                    <p className="text-gray-600">{service.approach.phase2.description}</p>
                  </div>
                </div>
                <ul className="ml-16 space-y-2">
                  {service.approach.phase2.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-navy-600 mt-1">•</span>
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Phase 3 */}
              <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-teal-600">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                    3
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{service.approach.phase3.title}</h3>
                    <p className="text-gray-600">{service.approach.phase3.description}</p>
                  </div>
                </div>
                <ul className="ml-16 space-y-2">
                  {service.approach.phase3.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-teal-600 mt-1">•</span>
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get - Deliverables */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">What You Get</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {service.deliverables.map((deliverable, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg mb-2">{deliverable.name}</h3>
                  <p className="text-gray-600 text-sm">{deliverable.description}</p>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-6 bg-teal-50 p-6 rounded-lg">
              <div>
                <h3 className="font-semibold mb-2">Turnaround Time</h3>
                <p className="text-gray-700">{service.turnaroundTime}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Revisions</h3>
                <p className="text-gray-700">{service.revisionsIncluded}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We're Different - 3 Column Comparison */}
      <section className="py-16 bg-navy-900 text-white">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Why We&apos;re Different</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-navy-800 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-red-400">AI-Only Competitors</h3>
                <p className="text-gray-300 text-sm">{service.differentiators.aiOnly}</p>
              </div>
              <div className="bg-navy-800 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-yellow-400">Traditional Firms</h3>
                <p className="text-gray-300 text-sm">{service.differentiators.traditional}</p>
              </div>
              <div className="bg-teal-600 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-white">Aliff Services</h3>
                <p className="text-white text-sm">{service.differentiators.aliff}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Pricing</h2>
            <p className="text-xl text-gray-700 mb-4">{service.pricing.message}</p>
            {service.pricing.note && (
              <p className="text-gray-600 mb-8">{service.pricing.note}</p>
            )}
            <Button
              asChild
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 font-semibold"
            >
              <Link href="/contact">Request Custom Quote</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      {service.caseStudies.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-12">Success Stories</h2>
              {service.caseStudies.map((caseStudy, index) => (
                <div key={index} className="bg-white p-8 rounded-lg shadow-sm mb-8">
                  <h3 className="text-2xl font-bold mb-6">{caseStudy.title}</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold text-teal-600 mb-2">Challenge</h4>
                      <p className="text-gray-700 text-sm">{caseStudy.challenge}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-navy-600 mb-2">Solution</h4>
                      <p className="text-gray-700 text-sm">{caseStudy.solution}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-teal-600 mb-2">Result</h4>
                      <p className="text-gray-700 text-sm mb-3">{caseStudy.result}</p>
                      {caseStudy.metrics && (
                        <ul className="space-y-1">
                          {caseStudy.metrics.map((metric, i) => (
                            <li key={i} className="text-sm font-semibold text-gray-900">
                              ✓ {metric}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Services */}
      {relatedServicesData.length > 0 && (
        <section className="py-16">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Related Services</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedServicesData.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/services/${related.category}/${related.slug}`}
                    className="bg-gray-50 p-6 rounded-lg hover:bg-teal-50 hover:border-teal-200 border-2 border-transparent transition-all"
                  >
                    <h3 className="font-bold text-lg mb-2">{related.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{related.description}</p>
                    <span className="text-teal-600 font-medium text-sm">Learn more →</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {service.faq.map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-bold text-lg mb-3">{item.question}</h3>
                  <p className="text-gray-700">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-teal-600 text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8">
              Let&apos;s discuss how we can help you with {service.name.toLowerCase()}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-white hover:bg-gray-100 text-teal-600 px-8 py-3 font-semibold"
              >
                <Link href="/contact">Get Started</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-teal-600 px-8 py-3 font-semibold"
              >
                <Link href="/contact">Schedule Consultation</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-teal-100">
              20+ years combined expertise • 22% average win rate • Fast turnaround
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
