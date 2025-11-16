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

    // Parse job requirements from description and requirements fields
    // JobPosting schema only has: title, description, requirements, responsibilities, type, location, department, salary
    // We'll use basic parsing to extract skills from requirements text
    const requiredSkillsFromText = job.requirements
      .toLowerCase()
      .match(/\b(?:python|javascript|react|node|java|sql|aws|docker|kubernetes|typescript|nextjs|next\.js)\b/gi) || [];

    const jobRequirements = {
      id: job.id,
      title: job.title,
      description: job.description,
      requiredSkills: [...new Set(requiredSkillsFromText)], // Deduplicate
      preferredSkills: [], // Not available in schema
      minYearsExperience: job.type === 'INTERNSHIP' ? 0 : 2, // Default based on job type
      educationLevel: [], // Not in schema
      salaryRange: {
        min: 0,
        max: 200000,
        type: 'ANNUAL' as 'HOURLY' | 'ANNUAL',
      },
      location: job.location, // REMOTE, HYBRID, or ON_SITE enum
      remote: job.location === 'REMOTE',
      industry: [job.department || 'Technology'], // Use department as industry proxy
      employmentType: job.type, // FULL_TIME, PART_TIME, CONTRACT, or INTERNSHIP
      hoursPerWeek: job.type === 'FULL_TIME' ? 40 : job.type === 'PART_TIME' ? 20 : 40,
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
