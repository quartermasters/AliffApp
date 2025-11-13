import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Code, Database, Shield, Zap, Users, Server } from "lucide-react";

export const metadata: Metadata = {
  title: "IT Services - Enterprise Architecture at Startup Speed",
  description:
    "Senior architects design your system strategy. AI generates 80% of code. You get sustainable solutions, not technical debt. Custom software development and enterprise systems.",
};

const services = [
  {
    icon: <Code className="w-8 h-8" />,
    title: "Custom Software Development",
    description: "Web applications, mobile apps, APIs. Architected for scale, built at speed, maintained for years.",
    benefits: ["System architecture designed first", "AI generates 80-90% of code", "Performance and security built-in", "Clean, maintainable codebase"],
  },
  {
    icon: <Server className="w-8 h-8" />,
    title: "Enterprise Systems",
    description: "CRM, ERP, data platforms, integrations. Systems that scale with your business, not against it.",
    benefits: ["Integration architecture planning", "Scalable from day one", "Technical debt prevention", "Future-proof design"],
  },
];

const problems = [
  {
    title: "AI-Generated Code = Technical Debt",
    problem: "AI-only solutions generate working code fast. But they create architectural nightmares, security gaps, and costly rewrites in 12-18 months.",
    solution: "Senior architects design system strategy first. AI codes to spec. You get sustainable systems that last.",
  },
  {
    title: "Traditional Firms Too Slow & Expensive",
    problem: "All-human development is slow (3-6 months), expensive ($150K+), and still accumulates technical debt without architectural discipline.",
    solution: "Architecture-first approach + AI execution delivers in 4-8 weeks at 40% lower cost. Quality higher because strategy guides execution.",
  },
  {
    title: "Freelancers Can't Architect Systems",
    problem: "Individual developers write code. They can't design system architecture, integration strategies, or long-term scalability.",
    solution: "10+ year architects design your system. AI executes the plan. You get enterprise architecture at startup prices.",
  },
];

const process = [
  {
    title: "Architecture Strategy (Human-Led)",
    description: "Senior architect analyzes your requirements, designs system architecture, plans scalability, identifies integration points, defines security model. This is what prevents technical debt.",
    deliverables: ["System architecture diagram", "Database schema design", "API specifications", "Security architecture", "Performance benchmarks"],
  },
  {
    title: "AI-Powered Development",
    description: "AI generates 80% of codebase from architecture specs. Database schemas, API endpoints, UI components, testing frameworks, documentation.",
    deliverables: ["Working application", "Test coverage", "Documentation", "Deployment scripts", "Performance monitoring"],
  },
  {
    title: "Expert Code Review & Refinement",
    description: "Senior developer reviews for architectural integrity, refactors for performance, validates security, tests edge cases AI missed, ensures maintainability.",
    deliverables: ["Optimized codebase", "Security validation", "Performance tuning", "Deployment support", "Maintenance documentation"],
  },
];

export default function ITServicesPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-gradient-to-br from-it/10 via-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-it/10 border border-it/20 mb-6">
              <span className="text-sm font-semibold text-it">IT Development Services</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy-900 mb-6 leading-tight">
              Enterprise Architecture.
              <br />
              <span className="text-it">Startup Speed.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl lg:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Senior architects design your system strategy. AI generates 80% of code. You get sustainable solutions, not technical debt.
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-6 mb-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-it mb-1">100%</div>
                <div className="text-sm text-gray-600">Architecture First</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-it mb-1">80%</div>
                <div className="text-sm text-gray-600">AI Execution</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-it mb-1">4-8</div>
                <div className="text-sm text-gray-600">Week Delivery</div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-it hover:bg-it-600 text-white font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all group"
                >
                  Discuss Your Project
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-it text-it hover:bg-it/5 font-semibold px-8 py-6 text-lg rounded-lg transition-all"
                >
                  Schedule Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 mb-4">
                Core IT Services
              </h2>
              <p className="text-lg text-gray-700">
                Architected for scale, built at speed, maintained for years
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="p-8 rounded-xl border-2 border-gray-200 hover:border-it hover:bg-it/5 transition-all"
                >
                  <div className="w-16 h-16 rounded-xl bg-it/10 flex items-center justify-center text-it mb-6">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-navy-900 mb-3">{service.title}</h3>
                  <p className="text-gray-700 mb-6">{service.description}</p>
                  <ul className="space-y-2">
                    {service.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-it flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problems & Solutions */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 mb-4">
                The IT Development Dilemma
              </h2>
              <p className="text-lg text-gray-700">
                AI-only is fast but creates technical debt. Traditional firms are slow and expensive.
              </p>
            </div>

            <div className="space-y-8">
              {problems.map((item, index) => (
                <div key={index} className="bg-white p-8 rounded-xl border border-gray-200">
                  <h3 className="text-xl font-bold text-navy-900 mb-4">{item.title}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm font-semibold text-red-600 mb-2">The Problem:</div>
                      <p className="text-gray-700">{item.problem}</p>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-success-600 mb-2">Aliff Solution:</div>
                      <p className="text-gray-700">{item.solution}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 mb-4">
                Architecture First, Code Second
              </h2>
              <p className="text-lg text-gray-700">
                This is how enterprise systems are built. This is how they last.
              </p>
            </div>

            <div className="space-y-8">
              {process.map((phase, index) => (
                <div
                  key={index}
                  className="flex gap-6 p-8 bg-gray-50 rounded-xl border-2 border-it/20"
                >
                  <div className="text-5xl font-bold text-it/20">{String(index + 1).padStart(2, '0')}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-navy-900 mb-3">{phase.title}</h3>
                    <p className="text-gray-700 mb-4">{phase.description}</p>
                    <div>
                      <div className="text-sm font-semibold text-gray-600 mb-2">Deliverables:</div>
                      <div className="flex flex-wrap gap-2">
                        {phase.deliverables.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-it/10 text-it text-sm font-medium rounded-full"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-it to-it-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Build Systems That Last?
            </h2>
            <p className="text-xl text-it-50 mb-8">
              Stop buying technical debt. Get enterprise architecture at startup prices.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-white hover:bg-gray-100 text-it font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Discuss Your Project
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
