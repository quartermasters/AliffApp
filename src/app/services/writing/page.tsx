import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, FileText, Pen, Book, MessageSquare, Briefcase, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Writing Services - Strategic Content, Not AI Slop",
  description:
    "Content strategists develop your brand voice and messaging framework. AI scales production. Your audience reads authentic insights, not template blog posts.",
};

const services = [
  {
    icon: <Pen className="w-6 h-6" />,
    title: "Copywriting",
    description: "Sales pages, landing pages, ad copy. Conversion-focused writing that positions strategically.",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Content Writing",
    description: "Blog posts, articles, web content. SEO-optimized but reads authentic, not AI-generic.",
  },
  {
    icon: <Book className="w-6 h-6" />,
    title: "Long-Form Content",
    description: "White papers, ebooks, guides. Deep expertise and strategic insights AI cannot fake.",
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Ghostwriting",
    description: "Thought leadership, LinkedIn posts, executive content. Your voice, your insights, scaled.",
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "Business Writing",
    description: "Case studies, reports, proposals. Professional documentation that showcases expertise.",
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Specialized Writing",
    description: "Technical writing, grant proposals, academic content. Domain expertise required.",
  },
];

const problems = [
  {
    title: "AI-Generated Content is Obvious",
    problem: "Every content agency now uses ChatGPT. Every blog post sounds identical: \"In today's digital landscape...\" Generic insights, no brand voice, no strategic positioning.",
    solution: "Content strategists develop YOUR brand voice first. AI produces drafts. Human editors ensure authenticity. Your content sounds like you, not a bot.",
  },
  {
    title: "Content Mills Deliver Volume, Not Value",
    problem: "Cheap content at scale. But it's generic, unsearchable SEO spam that damages your brand and doesn't convert.",
    solution: "Strategic messaging framework guides everything. SEO-optimized but authentic. Content that ranks AND converts.",
  },
  {
    title: "Quality Writers Too Slow & Expensive",
    problem: "Great writers cost $200+/hour and deliver 2-3 pieces per week. Can't scale content marketing.",
    solution: "Strategy from experts, production from AI, editorial polish from humans. 10x volume at 40% lower cost.",
  },
];

const process = [
  {
    title: "Content Strategy Development (Human-Led)",
    description: "Senior content strategist develops messaging framework, defines brand voice, identifies audience psychology, maps content to buyer journey, creates editorial guidelines. This is what makes content authentic.",
    deliverables: ["Brand voice guide", "Messaging framework", "Content strategy", "Editorial guidelines", "Topic clusters"],
  },
  {
    title: "AI-Powered Content Production",
    description: "AI researches topics comprehensively, generates drafts following voice guidelines, optimizes for SEO, creates multiple format variations (blog, social, email).",
    deliverables: ["Content drafts", "SEO optimization", "Meta descriptions", "Multiple formats", "Image suggestions"],
  },
  {
    title: "Expert Editorial Review",
    description: "Expert editor ensures brand voice authenticity, validates strategic messaging, adds industry insights, injects emotional resonance, catches AI hallucinations, strengthens CTAs.",
    deliverables: ["Polished content", "Brand voice validation", "Strategic alignment", "Publishing-ready", "Performance guidelines"],
  },
];

export default function WritingServicesPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-gradient-to-br from-writing/10 via-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-writing/10 border border-writing/20 mb-6">
              <span className="text-sm font-semibold text-writing">Content & Writing Services</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy-900 mb-6 leading-tight">
              Strategic Content. Authentic Voice.
              <br />
              <span className="text-writing">Not AI Slop.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl lg:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Content strategists develop your brand voice and messaging framework. AI scales production. Your audience reads authentic insights, not template blog posts.
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-6 mb-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-writing mb-1">100%</div>
                <div className="text-sm text-gray-600">Strategy First</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-writing mb-1">80%</div>
                <div className="text-sm text-gray-600">AI Production</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-writing mb-1">10x</div>
                <div className="text-sm text-gray-600">Content Volume</div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-writing hover:bg-writing-600 text-white font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all group"
                >
                  Get Content Strategy
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-writing text-writing hover:bg-writing/5 font-semibold px-8 py-6 text-lg rounded-lg transition-all"
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
                Complete Writing Services
              </h2>
              <p className="text-lg text-gray-700">
                6 content categories, all strategically guided and authentically delivered
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl border-2 border-gray-200 hover:border-writing hover:bg-writing/5 transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-writing/10 flex items-center justify-center text-writing mb-4">
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

      {/* Problems & Solutions */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 mb-4">
                The Content Marketing Dilemma
              </h2>
              <p className="text-lg text-gray-700">
                AI content is obvious and generic. Quality writers can't scale. You need both.
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
                Strategy First, Production Second
              </h2>
              <p className="text-lg text-gray-700">
                This is how authentic content is created at scale
              </p>
            </div>

            <div className="space-y-8">
              {process.map((phase, index) => (
                <div
                  key={index}
                  className="flex gap-6 p-8 bg-gray-50 rounded-xl border-2 border-writing/20"
                >
                  <div className="text-5xl font-bold text-writing/20">{String(index + 1).padStart(2, '0')}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-navy-900 mb-3">{phase.title}</h3>
                    <p className="text-gray-700 mb-4">{phase.description}</p>
                    <div>
                      <div className="text-sm font-semibold text-gray-600 mb-2">Deliverables:</div>
                      <div className="flex flex-wrap gap-2">
                        {phase.deliverables.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-writing/10 text-writing text-sm font-medium rounded-full"
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
      <section className="py-16 lg:py-24 bg-gradient-to-br from-writing to-writing-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready for Authentic Content at Scale?
            </h2>
            <p className="text-xl text-writing-50 mb-8">
              Stop publishing AI-generic content. Get strategic positioning and authentic voice.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-white hover:bg-gray-100 text-writing font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Get Content Strategy
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
