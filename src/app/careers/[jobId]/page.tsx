/**
 * Job Detail Page
 *
 * Shows full job description and requirements
 * Includes AI chat widget for candidate assistance
 * Primary CTA: Apply Now button
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { JobStatus, JobType, JobLocation } from '@prisma/client';

// Force dynamic rendering (requires database access)
export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    jobId: string;
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const { jobId } = params;

  // Fetch job by slug
  const job = await prisma.jobPosting.findUnique({
    where: {
      slug: jobId,
      status: JobStatus.PUBLISHED,
    },
    include: {
      creator: {
        select: {
          name: true,
        },
      },
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

  const getTypeColor = (type: JobType) => {
    switch (type) {
      case 'FULL_TIME':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PART_TIME':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CONTRACT':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'INTERNSHIP':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLocationIcon = (location: JobLocation) => {
    switch (location) {
      case 'REMOTE':
        return '🌍';
      case 'HYBRID':
        return '🏢💻';
      case 'ON_SITE':
        return '🏢';
      default:
        return '📍';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/careers"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-4"
          >
            ← Back to all jobs
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              {job.department && <p className="text-lg text-gray-600">{job.department}</p>}
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium border ${getTypeColor(
                job.type
              )}`}
            >
              {job.type.replace('_', ' ')}
            </span>
          </div>

          {/* Job Meta */}
          <div className="mt-6 flex flex-wrap items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-xl">{getLocationIcon(job.location)}</span>
              <span className="font-medium">{job.location.replace('_', ' ')}</span>
            </div>
            {job.salary && (
              <div className="flex items-center gap-2">
                <span className="text-xl">💰</span>
                <span className="font-medium">{job.salary}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-xl">👁️</span>
              <span>{job.views} views</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📝</span>
              <span>{job._count.applications} applications</span>
            </div>
          </div>

          {/* Apply CTA */}
          <div className="mt-6">
            <Link
              href={`/careers/${job.slug}/apply`}
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Apply Now →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
              {/* Description */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Role</h2>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {job.description}
                </div>
              </section>

              {/* Requirements */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {job.requirements}
                </div>
              </section>

              {/* Responsibilities */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Responsibilities</h2>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {job.responsibilities}
                </div>
              </section>

              {/* Benefits */}
              {job.benefits && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits</h2>
                  <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {job.benefits}
                  </div>
                </section>
              )}

              {/* Apply CTA Bottom */}
              <div className="pt-8 border-t border-gray-200">
                <Link
                  href={`/careers/${job.slug}/apply`}
                  className="block w-full bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center shadow-lg hover:shadow-xl"
                >
                  Apply for this Position →
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Quick Apply Card */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Apply</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Our AI-powered application process makes it easy. Just upload your resume and
                  we'll help you complete the rest.
                </p>
                <Link
                  href={`/careers/${job.slug}/apply`}
                  className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
                >
                  Start Application
                </Link>
              </div>

              {/* Job Summary Card */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Job Summary</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="text-gray-500 mb-1">Posted Date</div>
                    <div className="font-medium text-gray-900">
                      {new Date(job.publishedAt!).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Employment Type</div>
                    <div className="font-medium text-gray-900">
                      {job.type.replace('_', ' ')}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Location</div>
                    <div className="font-medium text-gray-900">
                      {job.location.replace('_', ' ')}
                    </div>
                  </div>
                  {job.salary && (
                    <div>
                      <div className="text-gray-500 mb-1">Compensation</div>
                      <div className="font-medium text-gray-900">{job.salary}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Help Card */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Have questions about this role or the application process?
                </p>
                <a
                  href="mailto:hr@aliffcapital.com"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  hr@aliffcapital.com
                </a>
              </div>

              {/* Share Card */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Share this Job</h3>
                <div className="flex gap-3">
                  <button className="flex-1 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium">
                    LinkedIn
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Widget Placeholder */}
      {/* TODO: Implement AI chat widget in Sprint 4 */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-105 flex items-center gap-2">
          <span className="text-xl">💬</span>
          <span className="font-medium">Need Help?</span>
        </button>
      </div>
    </div>
  );
}
