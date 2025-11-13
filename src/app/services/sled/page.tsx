import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, FileText, Target, Shield, TrendingUp, DollarSign, Users, Network, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "SLED Services - Dominate State, Local & Education Markets",
  description:
    "Strategic diagnosis + AI execution for state, local, and education contracting. Understand unique SLED requirements. Win complex municipal and education RFPs.",
};

const services = [
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Proposal Writing",
    description: "State and local procurement responses that address unique municipal requirements.",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Capture Management",
    description: "Navigate complex state and local procurement processes from identification to award.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Compliance & Registration",
    description: "State-specific registrations, local business certifications, education vendor requirements.",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Past Performance Development",
    description: "Present your experience to meet state and local evaluation criteria.",
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Pricing & Cost Analysis",
    description: "Navigate state pricing requirements, prevailing wage, local preferences.",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Technical Writing",
    description: "Technical proposals that demonstrate understanding of local needs and constraints.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Subcontracting & Teaming",
    description: "Build relationships with local partners. Navigate DBE, MBE, WBE requirements.",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Website & Mobile Development",
    description: "ADA-compliant websites and applications for state and local government use.",
  },
];

const sledAdvantages = [
  {
    title: "Understand SLED Complexity",
    description: "State and local procurement is fundamentally different from federal. We understand DBE requirements, local preferences, prevailing wage, and unique evaluation criteria.",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Navigate Each State's Requirements",
    description: "50 states, 50 different procurement systems. We know the nuances of California CMAS, Texas DIR, New York OGS, and every other state system.",
  },
  {
    title: "Education Market Expertise",
    description: "K-12 and higher education have unique needs. We understand Title I funding, ESSER dollars, E-Rate requirements, and education procurement cycles.",
  },
  {
    title: "Local Relationship Building",
    description: "For new entrants: we help you identify local partners, navigate teaming requirements, and build relationships that win SLED contracts.",
  },
];

export default function SLEDServicesPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-gradient-to-br from-govcon/10 via-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-govcon/10 border border-govcon/20 mb-6">
              <span className="text-sm font-semibold text-govcon">State, Local & Education Services</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy-900 mb-6 leading-tight">
              Dominate State, Local & Education Markets
            </h1>

            {/* Subheadline */}
            <p className="text-xl lg:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              SLED procurement is complex and relationship-driven. Our diagnosis identifies local preferences and unstated requirements that win contracts.
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-6 mb-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-govcon mb-1">50</div>
                <div className="text-sm text-gray-600">State Systems</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-govcon mb-1">5-7</div>
                <div className="text-sm text-gray-600">Day Turnaround</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-govcon mb-1">100%</div>
                <div className="text-sm text-gray-600">Compliance</div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-govcon hover:bg-govcon-600 text-white font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all group"
                >
                  Analyze Your SLED RFP
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-govcon text-govcon hover:bg-govcon/5 font-semibold px-8 py-6 text-lg rounded-lg transition-all"
                >
                  Schedule Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 mb-4">
                Complete SLED Contracting Support
              </h2>
              <p className="text-lg text-gray-700">
                8 core services tailored for state, local, and education markets
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl border-2 border-gray-200 hover:border-govcon hover:bg-govcon/5 transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-govcon/10 flex items-center justify-center text-govcon mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-bold text-navy-900 mb-2">{service.title}</h3>
                  <p className="text-gray-700 text-sm">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 mb-4">
                SLED-Specific Strategic Approach
              </h2>
              <p className="text-lg text-gray-700">
                Navigate complex state and local procurement with strategic intelligence
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl border-2 border-govcon/20">
                <div className="text-5xl font-bold text-govcon/20 mb-4">01</div>
                <h3 className="text-xl font-bold text-navy-900 mb-3">Local Intelligence</h3>
                <p className="text-gray-700">
                  Research state-specific requirements, local preferences, DBE/MBE goals, prevailing wage rules, and relationship dynamics.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl border-2 border-govcon/20">
                <div className="text-5xl font-bold text-govcon/20 mb-4">02</div>
                <h3 className="text-xl font-bold text-navy-900 mb-3">AI Execution</h3>
                <p className="text-gray-700">
                  AI handles compliance matrices, local content requirements, technical volumes. Formatted to exact state specifications.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl border-2 border-govcon/20">
                <div className="text-5xl font-bold text-govcon/20 mb-4">03</div>
                <h3 className="text-xl font-bold text-navy-900 mb-3">Expert Refinement</h3>
                <p className="text-gray-700">
                  SLED experts ensure local nuances addressed, relationships respected, community benefits highlighted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SLED Advantages */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 mb-4">
                Why SLED is Different (And Why We Win)
              </h2>
            </div>

            <div className="space-y-6">
              {sledAdvantages.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-6 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <div className="flex-shrink-0">
                    <Check className="w-6 h-6 text-success-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-navy-900 mb-2">{item.title}</h3>
                    <p className="text-gray-700">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-govcon to-govcon-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Win State & Local Contracts?
            </h2>
            <p className="text-xl text-govcon-50 mb-8">
              Navigate complex SLED procurement with strategic intelligence that wins.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-white hover:bg-gray-100 text-govcon font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Analyze Your SLED RFP
                </Button>
              </Link>
              <Link href="/for-agencies">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg rounded-lg transition-all"
                >
                  Agency Partnership
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
