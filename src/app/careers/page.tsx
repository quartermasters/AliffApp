/**
 * Public Careers Page
 *
 * Lists all published job openings
 * Entry point for candidate applications
 */

import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { JobStatus, JobType, JobLocation } from '@prisma/client';

export default async function CareersPage() {
  // Fetch published jobs
  const jobs = await prisma.jobPosting.findMany({
    where: {
      status: JobStatus.PUBLISHED,
    },
    orderBy: {
      publishedAt: 'desc',
    },
    select: {
      id: true,
      slug: true,
      title: true,
      department: true,
      type: true,
      location: true,
      salary: true,
      description: true,
      publishedAt: true,
      _count: {
        select: {
          applications: true,
        },
      },
    },
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Build your career with Aliff Services. We're looking for talented professionals
              passionate about government contracting and AI-powered solutions.
            </p>
            <p className="mt-4 text-lg text-blue-200">
              Remote opportunities • Competitive rates • Growth-focused
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {jobs.length === 0 ? (
          /* No jobs available */
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">💼</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              No Open Positions Right Now
            </h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              We don't have any active job openings at the moment, but we're always looking
              for talented individuals to join our talent pool.
            </p>
            <p className="text-sm text-gray-500">
              Check back soon or follow us on LinkedIn for updates.
            </p>
          </div>
        ) : (
          <>
            {/* Job Count */}
            <div className="mb-8">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{jobs.length}</span> open position
                {jobs.length !== 1 && 's'}
              </p>
            </div>

            {/* Job Listings */}
            <div className="grid grid-cols-1 gap-6">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/careers/${job.slug}`}
                  className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 hover:border-blue-300"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-blue-600">
                          {job.title}
                        </h2>
                        {job.department && (
                          <p className="text-sm text-gray-600">{job.department}</p>
                        )}
                      </div>
                      <div className="ml-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(
                            job.type
                          )}`}
                        >
                          {job.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getLocationIcon(job.location)}</span>
                        <span>{job.location.replace('_', ' ')}</span>
                      </div>
                      {job.salary && (
                        <div className="flex items-center gap-2">
                          <span className="text-lg">💰</span>
                          <span>{job.salary}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📅</span>
                        <span>
                          Posted {new Date(job.publishedAt!).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Description Preview */}
                    <p className="text-gray-700 line-clamp-2 mb-4">
                      {job.description.substring(0, 200)}...
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-500">
                        {job._count.applications} application
                        {job._count.applications !== 1 && 's'}
                      </div>
                      <div className="text-blue-600 font-medium">
                        View Details →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Footer CTA */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center border border-blue-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Don't see the right role?
          </h3>
          <p className="text-gray-600 mb-4">
            We're always open to exceptional talent. Send us your resume and we'll keep you in mind
            for future opportunities.
          </p>
          <p className="text-sm text-gray-500">
            Email us at{' '}
            <a
              href="mailto:hr@aliffcapital.com"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              hr@aliffcapital.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
