import { Metadata } from "next";
import Link from "next/link";
import { Briefcase, MapPin, Clock, DollarSign, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers - Join the Aliff Services Team",
  description: "Join our international team of GOVCON proposal writers, developers, and content creators. Work remotely with cutting-edge AI technology.",
};

// Starter job postings (5 jobs as per Phase 1 requirement)
const jobs = [
  {
    id: "1",
    slug: "senior-govcon-proposal-writer",
    title: "Senior GOVCON Proposal Writer",
    category: "GOVCON",
    type: "CONTRACT",
    location: "REMOTE",
    salary: "PKR 350-600/hour",
    description: "Write winning federal proposals using our AI orchestration system. Work with cutting-edge SDL technology to produce high-quality RFP responses.",
    requirements: [
      "5+ years federal proposal writing experience",
      "Proven track record with at least 3 contract wins",
      "Expert knowledge of FAR, DFARS, and agency-specific requirements",
      "Comfortable using AI tools for efficiency",
    ],
    publishedAt: "2025-11-14",
    applicationsCount: 23,
  },
  {
    id: "2",
    slug: "full-stack-developer-nextjs",
    title: "Full Stack Developer (Next.js)",
    category: "IT_SERVICES",
    type: "CONTRACT",
    location: "REMOTE",
    salary: "PKR 280-500/hour",
    description: "Build modern web applications for government contractors and businesses. Work with Next.js, React, TypeScript, and AI integrations.",
    requirements: [
      "3+ years Next.js and React experience",
      "Strong TypeScript skills",
      "Experience with PostgreSQL and Prisma",
      "Understanding of federal compliance requirements (preferred)",
    ],
    publishedAt: "2025-11-14",
    applicationsCount: 17,
  },
  {
    id: "3",
    slug: "sled-proposal-specialist",
    title: "SLED Proposal Specialist",
    category: "SLED",
    type: "CONTRACT",
    location: "REMOTE",
    salary: "PKR 300-550/hour",
    description: "Specialize in state, local, and education government contracts. Develop winning proposals for SLED opportunities using strategic AI assistance.",
    requirements: [
      "4+ years SLED proposal experience",
      "Knowledge of state procurement processes",
      "Strong understanding of education sector RFPs",
      "Excellent project management skills",
    ],
    publishedAt: "2025-11-13",
    applicationsCount: 12,
  },
  {
    id: "4",
    slug: "content-writer-technical",
    title: "Technical Content Writer",
    category: "WRITING_SERVICES",
    type: "CONTRACT",
    location: "REMOTE",
    salary: "PKR 200-400/hour",
    description: "Create high-quality technical content, white papers, case studies, and thought leadership articles for government contracting and technology industries.",
    requirements: [
      "3+ years technical writing experience",
      "Strong research and interviewing skills",
      "Ability to translate complex technical concepts",
      "Experience with AI-assisted writing tools",
    ],
    publishedAt: "2025-11-13",
    applicationsCount: 31,
  },
  {
    id: "5",
    slug: "ai-ml-engineer",
    title: "AI/ML Engineer",
    category: "IT_SERVICES",
    type: "CONTRACT",
    location: "REMOTE",
    salary: "PKR 400-700/hour",
    description: "Build and optimize our multi-AI orchestration system (SDL). Work with GPT-4, Claude, Gemini, and custom models for proposal analysis and generation.",
    requirements: [
      "4+ years AI/ML experience",
      "Strong Python and TypeScript skills",
      "Experience with OpenAI, Anthropic, Google AI APIs",
      "Knowledge of RAG systems and vector databases",
    ],
    publishedAt: "2025-11-12",
    applicationsCount: 8,
  },
];

// Category badge colors matching official color schema
const categoryColors = {
  GOVCON: "bg-navy-900 text-gold-400 border-gold-400/20",
  SLED: "bg-navy-900 text-gold-400 border-gold-400/20",
  IT_SERVICES: "bg-gold-100 text-gold-900 border-gold-400/30",
  WRITING_SERVICES: "bg-victory-100 text-victory-900 border-victory-400/30",
};

const categoryLabels = {
  GOVCON: "GOVCON",
  SLED: "SLED",
  IT_SERVICES: "IT Services",
  WRITING_SERVICES: "Writing",
};

const typeLabels = {
  CONTRACT: "Contract",
  FULL_TIME: "Full-Time",
  PART_TIME: "Part-Time",
  INTERNSHIP: "Internship",
};

const locationLabels = {
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  ON_SITE: "On-Site",
};

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-navy-900 py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Join the Future of <span className="text-gold-400">Strategic AI</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Work with cutting-edge AI technology, help businesses win government contracts,
              and grow your career with complete flexibility.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#open-positions" className="btn-primary btn-lg">
                View Open Positions
              </Link>
              <Link href="/about" className="btn-outline btn-lg">
                Learn About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-navy-900 mb-2">500+</div>
              <div className="text-gray-600">Validated Providers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gold-600 mb-2">95%</div>
              <div className="text-gray-600">AI Automation</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-victory-600 mb-2">7 Days</div>
              <div className="text-gray-600">Time to Hire</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-navy-900 mb-2">24/7</div>
              <div className="text-gray-600">Project Availability</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 text-center mb-12">
              Why Join Aliff Services?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6 text-gold-600" />
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-3">
                  Work with AI
                </h3>
                <p className="text-gray-600">
                  Collaborate with GPT-4, Claude, and Gemini. Our SDL system handles
                  80% of repetitive work—you focus on strategy and quality.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-victory-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-victory-600" />
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-3">
                  Complete Flexibility
                </h3>
                <p className="text-gray-600">
                  Work as many hours as you want, whenever you want. Take projects when
                  available, decline when not. 100% remote, worldwide.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-navy-100 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-navy-600" />
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-3">
                  Performance-Based Growth
                </h3>
                <p className="text-gray-600">
                  Start competitive, grow fast. Top performers get 20-30% raises every
                  3 months. Performance bonuses for high client satisfaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="open-positions" className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
                Open Positions
              </h2>
              <p className="text-xl text-gray-600">
                {jobs.length} opportunities available • Updated daily
              </p>
            </div>

            <div className="space-y-6">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/careers/${job.slug}`}
                  className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gold-400 transition-all duration-200 group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                            categoryColors[job.category as keyof typeof categoryColors]
                          }`}
                        >
                          {categoryLabels[job.category as keyof typeof categoryLabels]}
                        </span>
                        <span className="text-sm text-gray-500">
                          Posted {new Date(job.publishedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold text-navy-900 mb-2 group-hover:text-gold-600 transition-colors">
                        {job.title}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {typeLabels[job.type as keyof typeof typeLabels]}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {locationLabels[job.location as keyof typeof locationLabels]}
                        </div>
                        <div className="flex items-center gap-1 font-semibold text-gold-600">
                          <DollarSign className="w-4 h-4" />
                          {job.salary}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Briefcase className="w-4 h-4" />
                        {job.applicationsCount} applications
                      </div>
                      <button className="flex items-center gap-2 px-6 py-3 bg-gold-600 text-white font-semibold rounded-lg hover:bg-gold-700 transition-colors">
                        Apply Now
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-navy-900">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Don't See the Perfect Role?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              We're always looking for talented proposal writers, developers, and content
              creators. Send us your resume and we'll reach out when relevant opportunities arise.
            </p>
            <Link href="/careers/general-application" className="btn-primary btn-lg">
              Submit General Application
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
