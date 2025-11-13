import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, FileText, Target, Shield, TrendingUp, DollarSign, Users, Network, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "GOVCON Services - Win 22% of Federal Contracts",
  description:
    "Strategic diagnosis + AI execution for federal contracting. Proposal writing, capture management, compliance. 5-7 day turnaround, 22% win rate vs 4% industry average.",
};

const services = [
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Proposal Writing",
    description: "Win themes that address unstated requirements. Not generic AI-generated responses.",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Capture Management",
    description: "Full capture support from opportunity identification through contract award.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Compliance & Registration",
    description: "SAM registration, CAGE codes, GSA Schedule, OASIS+, and all federal requirements.",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Past Performance Development",
    description: "Document and present your experience to maximize evaluation scores.",
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Pricing & Cost Analysis",
    description: "Competitive pricing strategies that win while maintaining your margins.",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Technical Writing",
    description: "Technical volumes, SOWs, specifications that demonstrate capability.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Subcontracting & Teaming",
    description: "For new entrants: find the right primes, negotiate teaming agreements, build relationships.",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Website & Mobile Development",
    description: "Government-compliant websites and mobile applications. Section 508 accessible.",
  },
];

const differentiators = [
  {
    title: "Strategic Diagnosis First",
    description: "We discover what RFPs don't say. While competitors rush to compliance, we identify unstated requirements that win contracts.",
  },
  {
    title: "Beat AI Commodity Proposals",
    description: "Evaluators receive 30 identical AI-generated proposals. Ours reads strategic because senior experts design the approach.",
  },
  {
    title: "22% Win Rate vs 4% Industry",
    description: "Our diagnosis-first methodology delivers 5.5x better win rates. Strategic differentiation beats template responses.",
  },
  {
    title: "5-7 Day Turnaround",
    description: "AI execution at 10x speed. Human strategy ensures quality. You win time-sensitive opportunities competitors miss.",
  },
];

export default function GOVCONServicesPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-gradient-to-br from-govcon/10 via-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-govcon/10 border border-govcon/20 mb-6">
              <span className="text-sm font-semibold text-govcon">Federal Contracting Services</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy-900 mb-6 leading-tight">
              Win 22% of Federal Contracts.
              <br />
              <span className="text-govcon">Not 4%.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl lg:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Strategic diagnosis discovers what RFPs don't say. AI execution delivers at speed. Expert refinement ensures you win.
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-6 mb-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-govcon mb-1">22%</div>
                <div className="text-sm text-gray-600">Win Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-govcon mb-1">5-7</div>
                <div className="text-sm text-gray-600">Day Turnaround</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-govcon mb-1">5.5x</div>
                <div className="text-sm text-gray-600">Better Than Industry</div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-govcon hover:bg-govcon-600 text-white font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all group"
                >
                  Analyze Your Next RFP
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
                Complete Federal Contracting Support
              </h2>
              <p className="text-lg text-gray-700">
                8 core services to win, execute, and grow your federal business
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
                Our Process: Strategy First, AI Second
              </h2>
              <p className="text-lg text-gray-700">
                While competitors rush to write proposals, we diagnose first
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl border-2 border-govcon/20">
                <div className="text-5xl font-bold text-govcon/20 mb-4">01</div>
                <h3 className="text-xl font-bold text-navy-900 mb-3">Strategic Intelligence</h3>
                <p className="text-gray-700">
                  Senior experts analyze the RFP, identify unstated requirements, discover real pain points. This is what wins contracts.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl border-2 border-govcon/20">
                <div className="text-5xl font-bold text-govcon/20 mb-4">02</div>
                <h3 className="text-xl font-bold text-navy-900 mb-3">AI-Powered Execution</h3>
                <p className="text-gray-700">
                  AI handles 80-90% of work at 10x speed. Research, drafting, compliance matrices, formatting. Human strategy drives what AI builds.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl border-2 border-govcon/20">
                <div className="text-5xl font-bold text-govcon/20 mb-4">03</div>
                <h3 className="text-xl font-bold text-navy-900 mb-3">Expert Refinement</h3>
                <p className="text-gray-700">
                  Humans ensure strategic excellence, authentic voice, differentiation. Your proposal reads like an expert wrote it - because one did.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 mb-4">
                Why We Win When Others Lose
              </h2>
            </div>

            <div className="space-y-6">
              {differentiators.map((item, index) => (
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
              Ready to Win Your Next Federal Contract?
            </h2>
            <p className="text-xl text-govcon-50 mb-8">
              Get strategic analysis of your next RFP. Discover what competitors miss.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-white hover:bg-gray-100 text-govcon font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Analyze Your RFP
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
