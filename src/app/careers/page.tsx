/**
 * Careers Page - Server Component Wrapper
 * Fetches data and passes to client component
 */

import { prisma } from '@/lib/prisma';
import { JobStatus } from '@prisma/client';
import CareersPageClient from './page-client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function CareersPage() {
  // Fetch published jobs
  let jobs: any[] = [];

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
    jobs = [];
  }

  // Serialize dates for client component
  const serializedJobs = jobs.map(job => ({
    ...job,
    publishedAt: job.publishedAt,
  }));

  return <CareersPageClient jobs={serializedJobs} />;
}
