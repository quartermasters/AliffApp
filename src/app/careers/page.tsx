/**
 * Public Careers Page
 *
 * Lists all published job openings
 * Entry point for candidate applications
 */

import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { JobStatus, JobType, JobLocation } from '@prisma/client';
import { Briefcase } from 'lucide-react';
import AIChatWidget from '@/components/careers/AIChatWidget';
import InteractiveJobCard from '@/components/careers/InteractiveJobCard';
import ScrollToChatButton from '@/components/careers/ScrollToChatButton';

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

            {/* Job Listings - Interactive Cards */}
            <div className="grid grid-cols-1 gap-8">
              {jobs.map((job) => (
                <InteractiveJobCard
                  key={job.id}
                  id={job.id}
                  slug={job.slug}
                  title={job.title}
                  department={job.department}
                  type={job.type}
                  location={job.location}
                  salary={job.salary}
                  description={job.description}
                  publishedAt={job.publishedAt?.toISOString() ?? null}
                  applicationsCount={job._count.applications}
                />
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
            <ScrollToChatButton />
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
