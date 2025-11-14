import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle,
  ArrowLeft,
  Users,
} from "lucide-react";

// This would come from database in production
const jobs = [
  {
    id: "1",
    slug: "senior-govcon-proposal-writer",
    title: "Senior GOVCON Proposal Writer",
    category: "GOVCON",
    type: "CONTRACT",
    location: "REMOTE",
    salary: "PKR 350-600/hour",
    description:
      "Write winning federal proposals using our AI orchestration system. Work with cutting-edge SDL technology to produce high-quality RFP responses in compressed timelines.",
    requirements: [
      "5+ years federal proposal writing experience",
      "Proven track record with at least 3 contract wins",
      "Expert knowledge of FAR, DFARS, and agency-specific requirements",
      "Proficiency with Shipley methodology (preferred)",
      "Comfortable using AI tools for efficiency (required)",
      "Active Secret clearance (preferred but not required)",
    ],
    responsibilities: [
      "Develop compliant responses to federal RFPs (FAR-based)",
      "Write technical, management, and past performance volumes",
      "Collaborate with ALIFF-OPS AI for research and first drafts",
      "Coordinate with teaming partners and subcontractors",
      "Ensure Section L/M compliance for all submissions",
      "Review and edit AI-generated content for strategic positioning",
    ],
    benefits: [
      "Work with cutting-edge AI (GPT-4, Claude, Gemini)",
      "Complete anonymity (never know end client, focus on craft)",
      "Flexible hours (take projects when available, decline when not)",
      "Fast payment (Net-15 via direct deposit)",
      "Continuous upskilling (free access to ALIFF-TRAINER courses)",
      "Performance bonuses for high client satisfaction (4.5+ stars = 10% monthly bonus)",
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
    description:
      "Build modern web applications for government contractors and businesses. Work with Next.js, React, TypeScript, and AI integrations in our cutting-edge tech stack.",
    requirements: [
      "3+ years Next.js and React experience",
      "Strong TypeScript skills",
      "Experience with PostgreSQL and Prisma ORM",
      "Understanding of federal compliance requirements (preferred)",
      "Knowledge of AI API integrations (OpenAI, Anthropic)",
    ],
    responsibilities: [
      "Develop responsive web applications using Next.js 14+",
      "Build tRPC APIs and integrate with PostgreSQL databases",
      "Implement AI-powered features using OpenAI and Anthropic APIs",
      "Ensure WCAG 2.1 AA accessibility compliance",
      "Optimize performance and implement best practices",
    ],
    benefits: [
      "Work on high-impact projects for government contractors",
      "Flexible remote work hours",
      "Access to latest technologies and AI tools",
      "Performance-based rate increases every 3 months",
      "Continuous learning opportunities",
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
    description:
      "Specialize in state, local, and education government contracts. Develop winning proposals for SLED opportunities using strategic AI assistance.",
    requirements: [
      "4+ years SLED proposal experience",
      "Knowledge of state procurement processes",
      "Strong understanding of education sector RFPs",
      "Excellent project management skills",
      "Experience with state-specific compliance requirements",
    ],
    responsibilities: [
      "Respond to state, local, and education RFPs",
      "Navigate varying state procurement regulations",
      "Develop education sector proposals (K-12, higher ed)",
      "Coordinate with local teaming partners",
      "Ensure state-specific compliance (varies by state)",
    ],
    benefits: [
      "Diverse project portfolio (state, county, city, education)",
      "AI assistance for research and drafting",
      "Flexible project selection",
      "Competitive hourly rates",
      "Career growth into federal GOVCON",
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
    description:
      "Create high-quality technical content, white papers, case studies, and thought leadership articles for government contracting and technology industries.",
    requirements: [
      "3+ years technical writing experience",
      "Strong research and interviewing skills",
      "Ability to translate complex technical concepts for business audiences",
      "Experience with AI-assisted writing tools",
      "Portfolio of published technical content",
    ],
    responsibilities: [
      "Write technical white papers and case studies",
      "Develop thought leadership content for government contracting industry",
      "Create web content, blog posts, and social media copy",
      "Interview subject matter experts and synthesize insights",
      "Edit and refine AI-generated drafts",
    ],
    benefits: [
      "Work on diverse content projects",
      "Build portfolio with high-profile industry content",
      "AI tools for research and drafting acceleration",
      "Byline opportunities on industry publications",
      "Flexible project loads",
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
    description:
      "Build and optimize our multi-AI orchestration system (SDL). Work with GPT-4, Claude, Gemini, and custom models for proposal analysis and generation.",
    requirements: [
      "4+ years AI/ML experience",
      "Strong Python and TypeScript skills",
      "Experience with OpenAI, Anthropic, Google AI APIs",
      "Knowledge of RAG systems and vector databases (Pinecone, Weaviate)",
      "Understanding of prompt engineering and fine-tuning",
    ],
    responsibilities: [
      "Develop and optimize multi-AI orchestration pipelines",
      "Build RAG systems for proposal knowledge retrieval",
      "Implement vector search with Pinecone",
      "Fine-tune models for domain-specific tasks",
      "Monitor AI performance and cost optimization",
    ],
    benefits: [
      "Work on cutting-edge AI systems",
      "Access to GPT-4, Claude, Gemini APIs",
      "High hourly rate for experienced engineers",
      "Challenging technical problems",
      "Direct impact on AI product development",
    ],
    publishedAt: "2025-11-12",
    applicationsCount: 8,
  },
];

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

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const job = jobs.find((j) => j.slug === params.slug);

  if (!job) {
    return {
      title: "Job Not Found",
    };
  }

  return {
    title: `${job.title} - Careers at Aliff Services`,
    description: job.description,
  };
}

export default function JobDetailPage({ params }: { params: { slug: string } }) {
  const job = jobs.find((j) => j.slug === params.slug);

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-4">
          <Link
            href="/careers"
            className="flex items-center gap-2 text-gray-600 hover:text-gold-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Careers
          </Link>
        </div>
      </div>

      {/* Job Header */}
      <section className="bg-navy-900 py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border mb-6 ${
                categoryColors[job.category as keyof typeof categoryColors]
              }`}
            >
              {categoryLabels[job.category as keyof typeof categoryLabels]}
            </span>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{job.title}</h1>

            <div className="flex flex-wrap gap-6 text-gray-300 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{typeLabels[job.type as keyof typeof typeLabels]}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{locationLabels[job.location as keyof typeof locationLabels]}</span>
              </div>
              <div className="flex items-center gap-2 font-semibold text-gold-400">
                <DollarSign className="w-5 h-5" />
                <span>{job.salary}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{job.applicationsCount} applicants</span>
              </div>
            </div>

            <Link
              href={`/careers/${job.slug}/apply`}
              className="btn-primary btn-lg inline-block"
            >
              Apply for This Position
            </Link>
          </div>
        </div>
      </section>

      {/* Job Details */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">About the Role</h2>
              <p className="text-lg text-gray-700 leading-relaxed">{job.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Requirements */}
              <div className="bg-white rounded-xl shadow-md p-8">
                <h3 className="text-xl font-bold text-navy-900 mb-6">Requirements</h3>
                <ul className="space-y-4">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Responsibilities */}
              <div className="bg-white rounded-xl shadow-md p-8">
                <h3 className="text-xl font-bold text-navy-900 mb-6">Responsibilities</h3>
                <ul className="space-y-4">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Briefcase className="w-5 h-5 text-victory-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-xl shadow-md p-8 mt-8">
              <h3 className="text-xl font-bold text-navy-900 mb-6">
                What Makes This Different
              </h3>
              <ul className="grid md:grid-cols-2 gap-4">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-victory-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-gradient-gold rounded-xl p-8 mt-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Apply?</h3>
              <p className="text-white/90 mb-6 text-lg">
                Join our team and work with cutting-edge AI technology
              </p>
              <Link
                href={`/careers/${job.slug}/apply`}
                className="btn-secondary btn-lg inline-block"
              >
                Start Your Application
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  return jobs.map((job) => ({
    slug: job.slug,
  }));
}
