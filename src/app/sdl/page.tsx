import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Solicitation Diagnosis Lab (SDL) | Aliff Services",
  description:
    "Strategic analysis that beats AI commodity competitors. Discover how we diagnose solicitations before execution to achieve 22% win rates.",
};

export default function SDLPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-navy py-20 md:py-28">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-gold-600 text-white rounded-lg text-sm font-semibold mb-6">
              Our Methodology
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-display-lg font-bold text-white mb-6">
              The Solicitation Diagnosis Lab
            </h1>
            <p className="text-2xl text-gray-300 mb-8">
              Why We Diagnose Before We Execute
            </p>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Strategic analysis that beats AI commodity competitors. When everyone uses the same AI
              tools, diagnosis becomes your only differentiator.
            </p>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-navy-900 text-center">
              The AI Commodity Problem
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-red-900 mb-3">What's Happening</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>AI tools can execute fast, but can't think strategically</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Result: 30 proposals that all look identical</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Contracting officers spot AI templates immediately</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Generic content = "Acceptable" ratings = Losing</span>
                  </li>
                </ul>
              </div>
              <div className="bg-teal-50 border-l-4 border-teal-600 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-teal-900 mb-3">The Reality</h3>
                <p className="text-gray-700 mb-4">
                  Every contractor has access to ChatGPT. Everyone can write proposals "faster."
                </p>
                <p className="text-gray-700 font-semibold">
                  But speed without strategy just means losing faster.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SDL Approach */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-navy-900 text-center">
              Our Solution: The SDL Approach
            </h2>
            <div className="space-y-6">
              {[
                {
                  title: "Solicitation Intent Analysis",
                  desc: "What they really want vs what they asked for. Reading between the lines of RFP language.",
                },
                {
                  title: "Evaluation Criteria Mapping",
                  desc: "How to maximize points. Understanding unstated evaluator priorities and scoring psychology.",
                },
                {
                  title: "Competitive Landscape Assessment",
                  desc: "Who else is bidding, what they'll propose, and how to differentiate against known competitors.",
                },
                {
                  title: "Win Themes Development",
                  desc: "Strategic messaging unique to YOUR company, YOUR experience, and THIS opportunity.",
                },
                {
                  title: "Compliance Risk Identification",
                  desc: "Hidden traps and gotchas that disqualify proposals before evaluation even begins.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-teal-600">
                  <h3 className="text-xl font-bold text-navy-900 mb-2">{item.title}</h3>
                  <p className="text-gray-700">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-navy-900 text-center">
              How SDL Works
            </h2>
            <div className="space-y-8">
              {[
                {
                  step: "1",
                  title: "Human Expert Analysis",
                  points: [
                    "Former contracting officers review your solicitation",
                    "Strategic diagnosis phase (12-16 hours of deep analysis)",
                    "Custom approach designed for YOUR specific competitive situation",
                  ],
                },
                {
                  step: "2",
                  title: "Execution Planning",
                  points: [
                    "Task breakdown based on diagnosis insights",
                    "Resource allocation (human + AI work streams)",
                    "Timeline development with quality checkpoints",
                  ],
                },
                {
                  step: "3",
                  title: "Quality Validation",
                  points: [
                    "Multiple review stages by domain experts",
                    "Strategic alignment verification (does it execute the diagnosis?)",
                    "Competitive positioning validation (does it differentiate?)",
                  ],
                },
              ].map((phase) => (
                <div key={phase.step} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      {phase.step}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-navy-900 mb-3">{phase.title}</h3>
                    <ul className="space-y-2">
                      {phase.points.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700">
                          <span className="text-teal-600 mt-1">✓</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-navy-900 text-center">
              What Makes SDL Different
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="p-4 text-left text-gray-600 font-semibold">Approach</th>
                    <th className="p-4 text-left text-gray-600 font-semibold">Strategy</th>
                    <th className="p-4 text-left text-gray-600 font-semibold">Execution</th>
                    <th className="p-4 text-left text-gray-600 font-semibold">Result</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-semibold text-gray-900">AI-Only Tools</td>
                    <td className="p-4 text-gray-700">None - template based</td>
                    <td className="p-4 text-gray-700">Fast but generic</td>
                    <td className="p-4 text-red-600">Identical to competitors</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-semibold text-gray-900">Traditional Consulting</td>
                    <td className="p-4 text-gray-700">Human strategy</td>
                    <td className="p-4 text-gray-700">All-human execution (slow)</td>
                    <td className="p-4 text-yellow-600">Good but expensive/slow</td>
                  </tr>
                  <tr className="bg-teal-50">
                    <td className="p-4 font-bold text-teal-900">Aliff SDL</td>
                    <td className="p-4 text-gray-900 font-semibold">Human expert diagnosis</td>
                    <td className="p-4 text-gray-900 font-semibold">AI + Expert refinement</td>
                    <td className="p-4 text-teal-600 font-bold">Strategic & differentiated</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-navy-900">
              SDL Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { metric: "22%", label: "Average Win Rate", sub: "vs 4-8% industry baseline" },
                { metric: "5-7 days", label: "Turnaround Time", sub: "vs 2-3 weeks traditional" },
                { metric: "100%", label: "Strategic Differentiation", sub: "in every proposal" },
              ].map((stat, i) => (
                <div key={i} className="bg-teal-50 rounded-lg p-8 border-2 border-teal-200">
                  <div className="text-5xl font-bold text-teal-600 mb-2">{stat.metric}</div>
                  <div className="text-xl font-semibold text-gray-900 mb-2">{stat.label}</div>
                  <div className="text-sm text-gray-600">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Using SDL */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-navy-900 text-center">
              Services That Use SDL Methodology
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "Proposal Development", category: "govcon", slug: "proposal-development" },
                { name: "Capture Strategy", category: "govcon", slug: "capture-strategy" },
                { name: "SLED RFP Response", category: "sled", slug: "rfp-response" },
                { name: "Technical Volume Writing", category: "govcon", slug: "technical-volume" },
              ].map((service, i) => (
                <Link
                  key={i}
                  href={`/services/${service.category}/${service.slug}`}
                  className="card-hover p-6 group"
                >
                  <h3 className="text-xl font-bold mb-2 text-navy-900 group-hover:text-teal-600 transition-colors">
                    {service.name}
                  </h3>
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

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-navy-900 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "What is solicitation diagnosis?",
                  a: "Strategic analysis of an RFP to understand evaluator priorities, competitive landscape, and win strategy before writing begins. It's what separates 'Acceptable' proposals from 'Outstanding' ones.",
                },
                {
                  q: "How long does diagnosis take?",
                  a: "12-16 hours for comprehensive diagnosis. This happens in the first 48 hours after RFP release, leaving time for execution.",
                },
                {
                  q: "Can I see a sample diagnosis?",
                  a: "Due to client confidentiality, we can't share full diagnosis reports. However, we're happy to walk through our methodology on a consultation call.",
                },
                {
                  q: "What if my solicitation is urgent?",
                  a: "We offer expedited diagnosis (8-hour turnaround) for urgent opportunities. Strategy still comes first, just faster.",
                },
                {
                  q: "Is SDL available as a standalone service?",
                  a: "Yes. Some clients use our diagnosis to guide their in-house writing teams. Most combine diagnosis + execution for best results.",
                },
              ].map((faq, i) => (
                <div key={i} className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-navy-900 mb-3">{faq.q}</h3>
                  <p className="text-gray-700">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-navy">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Get Your Solicitation Diagnosed
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Stop competing with generic AI proposals. Let former contracting officers diagnose
              your opportunity and develop a winning strategy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary btn-lg">
                Schedule Diagnosis Consultation
              </Link>
              <Link
                href="/services/govcon/proposal-development"
                className="btn-outline btn-lg text-white border-white hover:bg-white hover:text-navy-900"
              >
                View Proposal Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
