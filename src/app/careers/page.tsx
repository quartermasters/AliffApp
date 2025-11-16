/**
 * Public Careers Page
 *
 * Lists all published job openings
 * Entry point for candidate applications
 */

import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { JobStatus, JobType, JobLocation } from '@prisma/client';
import { Briefcase, Globe, Building, Laptop, MapPin, DollarSign, Calendar, FileText, MessageCircle } from 'lucide-react';
import AIChatWidget from '@/components/careers/AIChatWidget';

// Force dynamic rendering (requires database access)
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function CareersPage() {
  // Fetch published jobs with error handling
  let jobs: Array<{
    id: string;
    slug: string;
    title: string;
    department: string | null;
    type: JobType;
    location: JobLocation;
    salary: string | null;
    description: string;
    publishedAt: Date | null;
    _count: {
      applications: number;
    };
  }> = [];

  try {
    jobs = await prisma.jobPosting.findMany({
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
  } catch (error) {
    console.error('Error fetching jobs:', error);
    // Return empty array on error - will show "No Open Positions" message
    jobs = [];
  }

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

  const LocationIcon = ({ location }: { location: JobLocation }) => {
    switch (location) {
      case 'REMOTE':
        return <Globe className="w-5 h-5" />;
      case 'HYBRID':
        return <Building className="w-5 h-5" />;
      case 'ON_SITE':
        return <Building className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-navy-900 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our Team
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              Build your career with Aliff Services. We're looking for talented professionals
              passionate about government contracting and AI-powered solutions.
            </p>
            <p className="text-lg text-gold-400">
              Remote opportunities • Competitive rates • Growth-focused
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {jobs.length === 0 ? (
          /* No jobs available */
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-12 h-12 text-gray-400" />
            </div>
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
                  className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 hover:border-teal-300"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-teal-600">
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
                        <LocationIcon location={job.location} />
                        <span>{job.location.replace('_', ' ')}</span>
                      </div>
                      {job.salary && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5" />
                          <span>{job.salary}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
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
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FileText className="w-4 h-4" />
                        <span>
                          {job._count.applications} application
                          {job._count.applications !== 1 && 's'}
                        </span>
                      </div>
                      <div className="text-teal-600 font-medium">
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
        <div className="mt-12 bg-navy-50 rounded-lg p-8 text-center border border-navy-200">
          <h3 className="text-xl font-semibold text-navy-900 mb-2">
            Don't see the right role?
          </h3>
          <p className="text-gray-600 mb-4">
            We're always open to exceptional talent. Join our talent pool and we'll notify you
            when positions matching your skills become available.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={() => {
                // Scroll to bottom to make AI chat widget visible
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                // Widget will auto-appear at bottom-right
              }}
              className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat with AI Recruiter</span>
            </button>
            <Link
              href="/candidate-portal"
              className="inline-flex items-center gap-2 bg-white text-navy-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-navy-900"
            >
              <span>Access Candidate Portal</span>
            </Link>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            All communication is handled through our secure, AI-powered platform
          </p>
        </div>
      </div>
      </section>

      {/* AI Chat Widget */}
      <AIChatWidget />
    </main>
  );
}
