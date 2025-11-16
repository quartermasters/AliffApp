/**
 * Modern Job Detail Page
 *
 * Sleek, professional design with accurate content
 * No emojis, no fake bonuses, clean PKR-based compensation
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { JobStatus, JobType, JobLocation } from '@prisma/client';
import {
  MapPin,
  Briefcase,
  Banknote,
  Clock,
  Eye,
  Users,
  ArrowRight,
  CheckCircle,
  Building2
} from 'lucide-react';
import ShareButtons from '@/components/careers/ShareButtons';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface PageProps {
  params: {
    jobId: string;
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const { jobId } = params;

  // Fetch job data
  let job;
  try {
    job = await prisma.jobPosting.findFirst({
      where: {
        slug: jobId,
        status: JobStatus.PUBLISHED,
      },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!job) {
      notFound();
    }

    // Increment view count
    await prisma.jobPosting.update({
      where: { id: job.id },
      data: { views: { increment: 1 } },
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    notFound();
  }

  const getTypeColor = (type: JobType) => {
    switch (type) {
      case 'FULL_TIME':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PART_TIME':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CONTRACT':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'INTERNSHIP':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const formatJobType = (type: JobType) => {
    return type.replace('_', ' ');
  };

  const formatLocation = (location: JobLocation) => {
    return location.replace('_', ' ');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-8 group"
          >
            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            <span>Back to all jobs</span>
          </Link>

          {/* Job Title & Department */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              {job.title}
            </h1>
            {job.department && (
              <p className="text-lg text-slate-300">{job.department}</p>
            )}
          </div>

          {/* Job Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border ${getTypeColor(job.type)}`}>
              <Briefcase className="w-4 h-4" />
              {formatJobType(job.type)}
            </span>

            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">{formatLocation(job.location)}</span>
            </div>

            {job.salary && (
              <div className="flex items-center gap-2 text-emerald-400">
                <Banknote className="w-4 h-4" />
                <span className="text-sm font-semibold">{job.salary}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-slate-400">
              <Eye className="w-4 h-4" />
              <span className="text-sm">{job.views} views</span>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <Users className="w-4 h-4" />
              <span className="text-sm">{job._count.applications} applicants</span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={`/careers/${job.slug}/apply`}
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href={`/careers/track`}
              className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Clock className="w-4 h-4" />
              <span>Track Application</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* About the Role */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-teal-600" />
                About the Role
              </h2>
              <div className="prose prose-slate max-w-none">
                <div className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {job.description}
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-teal-600" />
                Requirements
              </h2>
              <div className="prose prose-slate max-w-none">
                <div className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {job.requirements}
                </div>
              </div>
            </div>

            {/* Responsibilities */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Responsibilities
              </h2>
              <div className="prose prose-slate max-w-none">
                <div className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {job.responsibilities}
                </div>
              </div>
            </div>

            {/* Contractor Benefits */}
            {job.benefits && (
              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-8 border border-teal-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Contractor Benefits
                </h2>
                <div className="prose prose-slate max-w-none">
                  <div className="text-slate-700 leading-relaxed whitespace-pre-line">
                    {job.benefits}
                  </div>
                </div>
              </div>
            )}

            {/* Application Timeline */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Application Process
              </h2>
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Submit Application', time: 'Immediate', desc: 'Upload resume and complete application form' },
                  { step: '2', title: 'AI Resume Analysis', time: '1-2 hours', desc: 'Automated skills extraction and fit scoring' },
                  { step: '3', title: 'AI Interview', time: '2-3 days', desc: '15-minute conversation with ALIFF-RECRUITER (if qualified)' },
                  { step: '4', title: 'Skills Assessment', time: '3-5 days', desc: 'Role-specific practical challenge' },
                  { step: '5', title: 'Final Decision', time: '5-7 days', desc: 'Human review and final decision' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between mb-1">
                        <h3 className="font-semibold text-slate-900">{item.title}</h3>
                        <span className="text-xs text-slate-500 font-medium">{item.time}</span>
                      </div>
                      <p className="text-sm text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-3">Ready to Apply?</h3>
              <p className="text-teal-50 mb-6 max-w-xl mx-auto">
                Join our talent pool and start your journey with Aliff Services. Our AI-powered process makes applying quick and easy.
              </p>
              <Link
                href={`/careers/${job.slug}/apply`}
                className="inline-flex items-center gap-2 bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
              >
                <span>Start Application</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Quick Apply */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Quick Apply</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Our AI-powered process extracts your experience from your resume automatically.
                </p>
                <Link
                  href={`/careers/${job.slug}/apply`}
                  className="block w-full bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold text-center transition-colors"
                >
                  Apply Now
                </Link>
              </div>

              {/* Job Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Job Summary</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="text-slate-500 mb-1 font-medium">Posted Date</div>
                    <div className="text-slate-900">
                      {new Date(job.publishedAt!).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                  <div className="border-t border-slate-200 pt-4">
                    <div className="text-slate-500 mb-1 font-medium">Employment Type</div>
                    <div className="text-slate-900">{formatJobType(job.type)}</div>
                  </div>
                  <div className="border-t border-slate-200 pt-4">
                    <div className="text-slate-500 mb-1 font-medium">Location</div>
                    <div className="text-slate-900">{formatLocation(job.location)}</div>
                  </div>
                  {job.salary && (
                    <div className="border-t border-slate-200 pt-4">
                      <div className="text-slate-500 mb-1 font-medium">Compensation</div>
                      <div className="text-slate-900 font-semibold">{job.salary}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Share */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Share this Job</h3>
                <ShareButtons
                  jobUrl={`${process.env.NEXT_PUBLIC_APP_URL || 'https://aliffservices.com'}/careers/${job.slug}`}
                  jobTitle={job.title}
                />
              </div>

              {/* Need Help */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Need Help?</h3>
                <p className="text-sm text-slate-600">
                  Chat with ALIFF using the widget at the bottom-right of your screen for instant answers about this role.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
