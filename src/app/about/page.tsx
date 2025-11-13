import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Aliff Services - where strategic thinking meets AI execution. We combine human expertise with AI capabilities to deliver superior results across GOVCON, IT, and writing services.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-navy-900 text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-display-md md:text-display-lg font-bold mb-6">
              Strategic Thinking + AI Execution
            </h1>
            <p className="text-xl text-gray-300">
              We exist to solve a problem: AI can execute fast, but it can&apos;t think
              strategically. We bridge that gap.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-gray-700 mb-4">
                  The AI revolution has created a crisis of commodity. When everyone uses ChatGPT
                  templates, everything looks identical. Proposals read like they were written by
                  the same person. Systems are built with the same architecture. Content shares the
                  same voice.
                </p>
                <p className="text-lg text-gray-700">
                  We fix this by putting human strategic thinking first, then leveraging AI for
                  execution. The result: innovative solutions delivered at AI speed.
                </p>
              </div>
              <div className="bg-teal-50 p-8 rounded-lg border-l-4 border-teal-600">
                <h3 className="font-bold text-xl mb-4 text-navy-900">The Aliff Difference</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-teal-600 font-bold text-xl">1.</span>
                    <span className="text-gray-700">
                      <strong>Strategic Analysis First:</strong> Human experts diagnose the
                      challenge and design the solution
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-teal-600 font-bold text-xl">2.</span>
                    <span className="text-gray-700">
                      <strong>AI Execution:</strong> Multi-AI orchestration handles 80% of
                      implementation
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-teal-600 font-bold text-xl">3.</span>
                    <span className="text-gray-700">
                      <strong>Expert Refinement:</strong> Human review ensures quality and
                      innovation
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Built This */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Why We Built Aliff Services</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-govcon/10 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-govcon-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-3">The Proposal Problem</h3>
                <p className="text-gray-600 text-sm">
                  Contracting officers receive 30 proposals that look identical because
                  everyone uses the same AI templates. Strategic diagnosis is the only way to
                  stand out and win.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-it/10 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-it-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-3">The Architecture Problem</h3>
                <p className="text-gray-600 text-sm">
                  AI can write code fast, but it can&apos;t design systems that scale. We put
                  architecture-first thinking before any code is written.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-writing/10 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-writing-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-3">The Content Problem</h3>
                <p className="text-gray-600 text-sm">
                  AI-generated content all sounds the same. We develop your unique brand voice
                  first, then use AI to scale production while maintaining authenticity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">How We Work</h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Strategic Diagnosis</h3>
                  <p className="text-gray-600">
                    Human experts analyze your challenge, understand context, and design an
                    innovative solution. This is where we beat AI commodity competitors - we think,
                    not template.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">AI Orchestration</h3>
                  <p className="text-gray-600">
                    We deploy multiple AI systems (GPT-5, Claude, Gemini, and specialized models)
                    based on the strategic plan. Each AI handles what it does best, executing 80%
                    of the work at machine speed.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Expert Refinement</h3>
                  <p className="text-gray-600">
                    Human experts review, refine, and polish the AI output. We catch
                    hallucinations, ensure coherence, and add the final strategic touches that AI
                    misses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Credentials */}
      <section className="py-20 bg-navy-900 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Expertise</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-teal-400">
                  Government Contracting
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400">•</span>
                    <span>Former contracting officers and procurement specialists</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400">•</span>
                    <span>Track record of 22% win rates vs 4% industry average</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400">•</span>
                    <span>Federal, state, and local contracting experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400">•</span>
                    <span>Compliance expertise across all contract types</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 text-teal-400">
                  IT & Development
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400">•</span>
                    <span>Enterprise architects with Fortune 500 experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400">•</span>
                    <span>Full-stack development across modern frameworks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400">•</span>
                    <span>Cloud infrastructure and DevOps expertise</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400">•</span>
                    <span>Security and compliance for regulated industries</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 text-teal-400">
                  Content & Writing
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400">•</span>
                    <span>Professional writers and content strategists</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400">•</span>
                    <span>Brand voice development and content systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400">•</span>
                    <span>Technical writing and documentation expertise</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400">•</span>
                    <span>SEO and conversion-focused content</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 text-teal-400">AI & Technology</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400">•</span>
                    <span>Multi-AI orchestration and prompt engineering</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400">•</span>
                    <span>Custom AI model fine-tuning and deployment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400">•</span>
                    <span>AI quality control and hallucination detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400">•</span>
                    <span>Process automation and workflow optimization</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="border-l-4 border-teal-600 pl-6">
                <h3 className="text-xl font-bold mb-3">Strategy Over Templates</h3>
                <p className="text-gray-600">
                  We never use generic templates or commodity approaches. Every project starts with
                  strategic thinking tailored to your unique situation.
                </p>
              </div>

              <div className="border-l-4 border-teal-600 pl-6">
                <h3 className="text-xl font-bold mb-3">Honest Assessment</h3>
                <p className="text-gray-600">
                  If we&apos;re not the right fit, we&apos;ll tell you. We&apos;d rather lose a
                  project than deliver mediocre results.
                </p>
              </div>

              <div className="border-l-4 border-teal-600 pl-6">
                <h3 className="text-xl font-bold mb-3">Quality Over Speed</h3>
                <p className="text-gray-600">
                  AI gives us speed, but we never sacrifice quality. Every deliverable goes through
                  human expert review.
                </p>
              </div>

              <div className="border-l-4 border-teal-600 pl-6">
                <h3 className="text-xl font-bold mb-3">Partnership Mindset</h3>
                <p className="text-gray-600">
                  We succeed when you succeed. Whether you&apos;re a direct client or an agency
                  partner, your goals are our goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Work Together?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Let&apos;s discuss how strategic thinking + AI execution can solve your challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-block px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md transition-colors"
              >
                Get in Touch
              </a>
              <a
                href="/for-agencies"
                className="inline-block px-8 py-3 bg-white hover:bg-gray-50 text-navy-900 font-semibold rounded-md border-2 border-navy-900 transition-colors"
              >
                Agency Partnerships
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
