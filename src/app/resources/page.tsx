import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resources - Guides & Templates | Aliff Services",
  description:
    "Download free guides, checklists, and templates for federal proposals, agency scaling, and software development best practices.",
};

export default function ResourcesPage() {
  const resources = [
    {
      title: "GOVCON RFP Response Checklist",
      description:
        "Comprehensive checklist for federal proposal submissions. Ensure compliance and maximize evaluation scores.",
      category: "GOVCON",
      format: "PDF",
      pages: "12 pages",
    },
    {
      title: "Agency White-Label Services Evaluation Guide",
      description:
        "Framework for evaluating white-label partners. Compare capabilities, pricing, and quality standards.",
      category: "Agency Growth",
      format: "PDF",
      pages: "18 pages",
    },
    {
      title: "IT Project Architecture Planning Template",
      description:
        "Pre-development architecture planning worksheet. Design scalable systems before writing code.",
      category: "IT & Development",
      format: "PDF",
      pages: "8 pages",
    },
    {
      title: "Brand Voice Development Worksheet",
      description:
        "Define your brand voice before AI content production. Ensure consistent, on-brand messaging.",
      category: "Content & Writing",
      format: "PDF",
      pages: "10 pages",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-navy py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-display-lg font-bold text-white mb-6">
              Free Resources & Templates
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Proven frameworks, checklists, and templates from our work with federal contractors,
              agencies, and software companies.
            </p>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {resources.map((resource, index) => (
                <div key={index} className="card p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="badge-gold">{resource.category}</span>
                    <span className="text-sm text-gray-500">
                      {resource.format} • {resource.pages}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-navy-900 mb-3">{resource.title}</h3>
                  <p className="text-gray-600 mb-6">{resource.description}</p>
                  <button className="btn-primary btn-md w-full">
                    Download Free Resource
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Email Capture Note */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Get New Resources First</h2>
            <p className="text-xl text-gray-600 mb-8">
              We add 2-3 new resources every month. Subscribe to get notified when we publish new
              guides and templates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input type="email" placeholder="Your email" className="input flex-grow" />
              <button className="btn-primary btn-md whitespace-nowrap">Subscribe</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Need More Than a Template?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Our team delivers full-service solutions using the same frameworks and methodologies
              in these resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary btn-lg">
                Schedule Consultation
              </Link>
              <Link href="/services" className="btn-outline btn-lg">
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
