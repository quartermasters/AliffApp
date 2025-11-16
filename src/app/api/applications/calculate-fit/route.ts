/**
 * Fit Score Calculation API Endpoint
 *
 * Calculates candidate-job fit score based on:
 * - Resume data
 * - Job requirements
 * - Salary expectations
 * - Availability
 */

import { NextRequest, NextResponse } from 'next/server';
import { calculateFitScore, generateFitReport } from '@/lib/ai/fit-scorer';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { candidateData, jobId, salary, availability } = body;

    if (!candidateData || !jobId) {
      return NextResponse.json(
        { error: 'Candidate data and job ID are required' },
        { status: 400 }
      );
    }

    console.log(`[API] Calculating fit score for job: ${jobId}`);

    // Fetch job posting details
    const job = await prisma.jobPosting.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job posting not found' },
        { status: 404 }
      );
    }

    // Parse job requirements from description and metadata
    // In production, these would be stored as structured fields
    const jobRequirements = {
      id: job.id,
      title: job.title,
      description: job.description,
      requiredSkills: job.requiredSkills || [],
      preferredSkills: job.preferredSkills || [],
      minYearsExperience: job.experienceLevel === 'ENTRY_LEVEL' ? 0
        : job.experienceLevel === 'MID_LEVEL' ? 3
        : job.experienceLevel === 'SENIOR_LEVEL' ? 7
        : job.experienceLevel === 'EXECUTIVE' ? 12
        : 0,
      maxYearsExperience: job.experienceLevel === 'ENTRY_LEVEL' ? 2
        : job.experienceLevel === 'MID_LEVEL' ? 6
        : job.experienceLevel === 'SENIOR_LEVEL' ? 15
        : undefined,
      educationLevel: job.educationRequirement ? [job.educationRequirement] : [],
      salaryRange: {
        min: job.salaryMin || 0,
        max: job.salaryMax || 200000,
        type: (job.salaryType || 'ANNUAL') as 'HOURLY' | 'ANNUAL',
      },
      location: job.location,
      remote: job.remote || false,
      industry: [job.industry || 'Technology'],
      employmentType: job.employmentType || 'FULL_TIME',
      hoursPerWeek: job.employmentType === 'FULL_TIME' ? 40 : 20,
    };

    // Calculate fit score
    const fitScore = calculateFitScore(
      candidateData,
      salary || { expected: 0, type: 'ANNUAL' },
      availability || { hoursPerDay: 8, daysPerMonth: 20 },
      jobRequirements
    );

    // Generate report
    const report = generateFitReport(fitScore);

    console.log(`[API] Fit score calculated:`, {
      overall: fitScore.overall,
      confidence: fitScore.confidence,
    });

    return NextResponse.json({
      success: true,
      fitScore,
      report,
      message: 'Fit score calculated successfully',
    });
  } catch (error) {
    console.error('[API] Fit score calculation error:', error);

    return NextResponse.json(
      {
        error: 'Failed to calculate fit score',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
