/**
 * Application Submission API
 *
 * Handles job application submissions
 * Triggers AI resume parsing and screening
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus } from '@prisma/client';
import { createAIResumeParser } from '@/lib/services/recruiter/ai-resume-parser';
import { createScreeningAlgorithm } from '@/lib/services/recruiter/screening-algorithm';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      jobId,
      firstName,
      lastName,
      email,
      phone,
      resumeUrl,
      linkedinUrl,
      portfolioUrl,
      coverLetter,
    } = body;

    // Validate required fields
    if (!jobId || !firstName || !lastName || !email || !resumeUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find job by slug
    const job = await prisma.jobPosting.findUnique({
      where: { slug: jobId },
      select: { id: true, title: true, requirements: true, responsibilities: true },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        jobId: job.id,
        firstName,
        lastName,
        email,
        phone,
        resumeUrl,
        linkedinUrl,
        portfolioUrl,
        coverLetter,
        status: ApplicationStatus.SUBMITTED,
      },
    });

    // Trigger AI resume parsing (async, don't wait)
    parseResumeAsync(application.id, resumeUrl, job);

    return NextResponse.json({
      id: application.id,
      message: 'Application submitted successfully',
    });
  } catch (error) {
    console.error('Application submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}

/**
 * Parse resume asynchronously (background task)
 */
async function parseResumeAsync(
  applicationId: string,
  resumeUrl: string,
  job: { id: string; title: string; requirements: string; responsibilities: string }
) {
  try {
    // Update status to SCREENING
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: ApplicationStatus.SCREENING },
    });

    // Parse resume with AI
    const parser = createAIResumeParser();
    const parsedData = await parser.parseResume(resumeUrl);

    // Run screening algorithm
    const screener = createScreeningAlgorithm();
    const screeningResult = await screener.screenApplication({
      parsedData,
      jobRequirements: job.requirements,
      jobResponsibilities: job.responsibilities,
    });

    // Update application with results
    await prisma.application.update({
      where: { id: applicationId },
      data: {
        aiScore: screeningResult.score,
        aiNotes: screeningResult.notes,
        status: screeningResult.shouldAdvance
          ? ApplicationStatus.SHORTLISTED
          : ApplicationStatus.REJECTED,
      },
    });

    // If score >= 75, create candidate in CV Bank
    if (screeningResult.score >= 75) {
      await prisma.candidate.create({
        data: {
          applicationId,
          name: `${parsedData.firstName} ${parsedData.lastName}`,
          email: parsedData.email,
          phone: parsedData.phone,
          location: parsedData.location,
          timezone: parsedData.timezone,
          linkedIn: parsedData.linkedinUrl,
          github: parsedData.githubUrl,
          portfolio: parsedData.portfolioUrl,
          skills: parsedData.skills,
          yearsExperience: parsedData.yearsExperience,
          domains: parsedData.domains,
          certifications: parsedData.certifications,
          clearance: parsedData.clearance || 'NONE',
          industryExp: parsedData.industryExperience,
          parsedResumeData: parsedData as any,
        },
      });

      console.log(
        `[ALIFF-RECRUITER] Candidate added to CV Bank: ${parsedData.email} (Score: ${screeningResult.score})`
      );
    }

    // TODO Sprint 2: Send candidate email notification
    // TODO Sprint 4: If shortlisted, trigger AI chat interview

    console.log(
      `[ALIFF-RECRUITER] Application ${applicationId} processed - Score: ${screeningResult.score}, Status: ${screeningResult.shouldAdvance ? 'SHORTLISTED' : 'REJECTED'}`
    );
  } catch (error) {
    console.error('Resume parsing error:', error);
    // Update application with error
    await prisma.application.update({
      where: { id: applicationId },
      data: {
        aiNotes: `Error parsing resume: ${(error as Error).message}`,
        status: ApplicationStatus.SUBMITTED, // Keep as submitted for manual review
      },
    });
  }
}
