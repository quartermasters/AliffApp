import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Shield, Zap, Users, TrendingUp, Lock, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "For GOVCON Agencies - Scale Without Hiring",
  description:
    "White-label Aliff's services for your clients. Volume discounts, superior quality at lower rates, pay per project. Scale delivery without adding headcount.",
};

const benefits = [
  {
    icon: <Scale className="w-6 h-6" />,
    title: "Elastic Capacity",
    description: "Handle 10 simultaneous proposals or 1. No hiring lag, no capacity constraints.",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Complete White-Label",
    description: "Your branding, your client relationship. We're invisible. All deliverables branded as yours.",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Maintain Margins",
    description: "Volume discounts available while you maintain healthy margins with your clients.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "5-7 Day Turnaround",
    description: "Win time-sensitive opportunities. Our speed becomes your competitive advantage.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Quality Guaranteed",
    description: "Strategic thinking + AI execution. Not commodity AI output. Your reputation stays intact.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Multi-Client Dashboard",
    description: "Manage all your clients in one place. Track projects, usage, and billing effortlessly.",
  },
];

const whyAgenciesChooseUs = [
  {
    challenge: "Can't scale without hiring",
    solution: "Elastic capacity - handle 10x volume instantly",
  },
  {
    challenge: "Quality inconsistent with freelancers",
    solution: "Strategic diagnosis + expert refinement every time",
  },
  {
    challenge: "Clients want faster turnaround",
    solution: "5-7 days vs. industry 3-4 weeks",
  },
  {
    challenge: "Margins squeezed by competition",
    solution: "Volume discounts maintain your profitability",
  },
  {
    challenge: "AI-generated proposals too obvious",
    solution: "Human strategy + AI execution = differentiated output",
  },
];

const faqs = [
  {
    question: "How does white-labeling work?",
    answer:
      "All deliverables are unbranded and formatted to your specifications. Your clients never know we exist. You present everything as your own work, maintaining full client relationships and loyalty.",
  },
  {
    question: "What volume discounts are available?",
    answer:
      "We offer tiered volume discounts based on project volume. Pricing is customized for each agency partnership. Contact us to discuss your specific needs and volume expectations.",
  },
  {
    question: "How quickly can we get started?",
    answer:
      "Partnership setup takes 1-2 days. We'll configure your white-label settings, create your agency dashboard, and provide onboarding. You can submit your first client project immediately after setup.",
  },
  {
    question: "What services can we white-label?",
    answer:
      "All of them: GOVCON services (proposals, capture, compliance), SLED services, IT development, and writing services. You choose which services to offer your clients.",
  },
  {
    question: "How do you ensure our client confidentiality?",
    answer:
      "Complete information security. Your clients' data is isolated, encrypted, and never visible to other agencies. Our team signs NDAs. All communication goes through you - we never contact your clients directly.",
  },
  {
    question: "What if our client isn't satisfied?",
    answer:
      "We work until they are. Unlimited revisions within scope. Our quality guarantee means your reputation stays intact. If we can't deliver to standard, you don't pay.",
  },
];

export default function ForAgenciesPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-gradient-to-br from-teal-50 via-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-600/10 border border-teal-600/20 mb-6">
              <span className="text-sm font-semibold text-teal-700">B2B Partnership Program</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy-900 mb-6 leading-tight">
              Your Agency Wins More.
              <br />
              <span className="text-teal-600">Delivers Faster. Without Adding Headcount.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl lg:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              White-label our services as your own. Keep client relationships. Scale unlimited.
              Maintain margins.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all group"
                >
                  Schedule Agency Demo
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-teal-600 text-teal-700 hover:bg-teal-50 font-semibold px-8 py-6 text-lg rounded-lg transition-all"
                >
                  Discuss Partnership
                </Button>
              </Link>
            </div>

            {/* Trust Signal */}
            <p className="text-gray-600">
              Trusted by several leading GOVCON agencies nationwide
            </p>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 mb-4">
                The Agency Growth Dilemma
              </h2>
              <p className="text-lg text-gray-700">
                You can't scale without hiring. But hiring is expensive, slow, and risky.
              </p>
            </div>

            <div className="space-y-6">
              {whyAgenciesChooseUs.map((item, index) => (
                <div
                  key={index}
                  className="grid md:grid-cols-2 gap-4 p-6 rounded-xl border-2 border-gray-200 hover:border-teal-200 hover:bg-teal-50/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-red-600 font-bold text-lg">✕</span>
                    </div>
                    <span className="text-gray-700 font-medium">{item.challenge}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-success-100 flex items-center justify-center">
                      <Check className="w-5 h-5 text-success-600" />
                    </div>
                    <span className="text-navy-900 font-semibold">{item.solution}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 mb-4">
                Why Leading Agencies Partner With Aliff
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl border border-gray-200 hover:border-teal-200 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-700">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-700 mb-12">
              Pay per project. No platform fees. No monthly minimums. Volume discounts available.
            </p>

            <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 border-2 border-teal-200 rounded-2xl p-8 lg:p-12">
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600 mb-2">Pay Per Project</div>
                  <p className="text-gray-700">Only pay for what you use</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600 mb-2">Volume Discounts</div>
                  <p className="text-gray-700">More projects = better rates</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600 mb-2">Zero Fees</div>
                  <p className="text-gray-700">No platform or monthly fees</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-teal-200">
                <p className="text-gray-800 font-medium mb-4">
                  Custom pricing based on your volume and service mix. Let's discuss what works for
                  your agency.
                </p>
                <Link href="/contact">
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold">
                    Get Custom Quote
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works for Agencies */}
      <section className="py-16 lg:py-24 bg-navy-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
              How Agency Partnership Works
            </h2>

            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Setup Your Agency Account",
                  description:
                    "Configure white-label settings, branding preferences, and billing. Takes 1-2 days.",
                },
                {
                  step: "02",
                  title: "Submit Client Projects",
                  description:
                    "Upload RFPs or project briefs through your agency dashboard. We start immediately.",
                },
                {
                  step: "03",
                  title: "We Deliver, You Present",
                  description:
                    "Receive unbranded deliverables in your format. Present to your clients as your work.",
                },
                {
                  step: "04",
                  title: "Scale Unlimited",
                  description:
                    "Handle 1 project or 100. Your capacity is now unlimited. Your clients never know.",
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className="flex gap-6 items-start p-6 bg-white/5 rounded-xl border border-white/10"
                >
                  <div className="text-4xl font-bold text-teal-400 opacity-50">{step.step}</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-gray-300">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-bold text-navy-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-teal-600 to-teal-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Scale Your Agency?
            </h2>
            <p className="text-xl text-teal-50 mb-8">
              Join several leading GOVCON agencies who trust Aliff to deliver exceptional results for
              their clients.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-white hover:bg-gray-100 text-teal-700 font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Schedule Agency Demo
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg rounded-lg transition-all"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
