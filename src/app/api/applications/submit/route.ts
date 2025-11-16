/**
 * Application Submission API Endpoint
 *
 * Handles complete application submission:
 * 1. Creates Application record
 * 2. Calculates fit score
 * 3. Creates CV Bank profile (EVERY applicant)
 * 4. Determines next steps
 * 5. Sends confirmation email
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateFitScore } from '@/lib/ai/fit-scorer';
import { createOrUpdateCVBankProfile } from '@/lib/services/cv-bank-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      jobId,
      // Step 1 data
      resumeUrl,
      photoUrl,
      parsedResumeData,
      extractedPhotoUrl,
      // Step 2 data
      firstName,
      lastName,
      email,
      phone,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      currentSalary,
      expectedSalary,
      salaryType,
      hoursPerDay,
      daysPerMonth,
      startDate,
      employmentStatus,
      // Step 3 data
      coverLetter,
      additionalNotes,
      heardAboutUs,
      agreedToTerms,
    } = body;

    // Validation
    if (!jobId || !email || !firstName || !lastName || !resumeUrl || !photoUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!agreedToTerms) {
      return NextResponse.json(
        { error: 'You must agree to the terms and privacy policy' },
        { status: 400 }
      );
    }

    console.log('[SUBMIT] Processing application submission:', { email, jobId });

    // Fetch job posting
    const jobPosting = await prisma.jobPosting.findUnique({
      where: { id: jobId },
    });

    if (!jobPosting) {
      return NextResponse.json(
        { error: 'Job posting not found' },
        { status: 404 }
      );
    }

    // Check if already applied
    const existingApplication = await prisma.application.findFirst({
      where: {
        email,
        jobPostingId: jobId,
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied for this position' },
        { status: 409 }
      );
    }

    // Calculate fit score
    console.log('[SUBMIT] Calculating fit score...');
    const jobRequirements = {
      id: jobPosting.id,
      title: jobPosting.title,
      description: jobPosting.description,
      requiredSkills: jobPosting.requiredSkills || [],
      preferredSkills: jobPosting.preferredSkills || [],
      minYearsExperience: jobPosting.experienceLevel === 'ENTRY_LEVEL' ? 0
        : jobPosting.experienceLevel === 'MID_LEVEL' ? 3
        : jobPosting.experienceLevel === 'SENIOR_LEVEL' ? 7
        : 0,
      educationLevel: jobPosting.educationRequirement ? [jobPosting.educationRequirement] : [],
      salaryRange: {
        min: jobPosting.salaryMin || 0,
        max: jobPosting.salaryMax || 200000,
        type: (jobPosting.salaryType || 'ANNUAL') as 'HOURLY' | 'ANNUAL',
      },
      location: jobPosting.location,
      remote: jobPosting.remote || false,
      industry: [jobPosting.industry || 'Technology'],
      employmentType: jobPosting.employmentType || 'FULL_TIME',
      hoursPerWeek: 40,
    };

    const fitScore = calculateFitScore(
      parsedResumeData,
      { expected: expectedSalary, type: salaryType },
      { hoursPerDay, daysPerMonth },
      jobRequirements
    );

    console.log('[SUBMIT] Fit score calculated:', fitScore.overall);

    // Create application
    const application = await prisma.application.create({
      data: {
        jobPostingId: jobId,

        // Personal Information
        firstName,
        lastName,
        email,
        phone,
        linkedinUrl,
        githubUrl,
        portfolioUrl,

        // Files
        resumeUrl,
        uploadedPhotoUrl: photoUrl,
        cvExtractedPhotoUrl: extractedPhotoUrl,

        // Parsed Data
        parsedResumeData: parsedResumeData as any,

        // Salary & Availability
        currentSalary,
        expectedSalary,
        salaryType,
        hoursPerDay,
        daysPerMonth,
        startDate: startDate ? new Date(startDate) : null,

        // Additional Info
        coverLetter,
        additionalNotes,
        heardAboutUs,

        // Scores
        fitScore: fitScore.overall,
        fitScoreBreakdown: fitScore.breakdown as any,

        // Status
        status: 'SUBMITTED',
        source: 'WEBSITE',

        // Metadata
        metadata: {
          fitReport: fitScore,
          employmentStatus,
          userAgent: request.headers.get('user-agent'),
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        } as any,
      },
    });

    console.log('[SUBMIT] Application created:', application.id);

    // Create CV Bank profile (EVERY applicant gets a profile)
    console.log('[SUBMIT] Creating CV Bank profile...');
    const cvBankResult = await createOrUpdateCVBankProfile({
      applicationId: application.id,
      jobPostingId: jobId,
      firstName,
      lastName,
      email,
      phone,
      location: parsedResumeData.location?.city,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      websiteUrl: parsedResumeData.websiteUrl,
      uploadedPhotoUrl: photoUrl,
      cvExtractedPhotoUrl: extractedPhotoUrl,
      resumeUrl,
      parsedResumeData,
      currentJobTitle: parsedResumeData.currentJobTitle,
      currentCompany: parsedResumeData.currentCompany,
      totalYearsExperience: parsedResumeData.totalYearsExperience || 0,
      technicalSkills: parsedResumeData.skills?.technical || [],
      softSkills: parsedResumeData.skills?.soft || [],
      languages: parsedResumeData.spokenLanguages?.map((l: any) => l.language) || [],
      highestDegree: parsedResumeData.education?.[0]?.degree,
      fieldOfStudy: parsedResumeData.education?.[0]?.field,
      institution: parsedResumeData.education?.[0]?.institution,
      currentSalary,
      expectedSalary,
      salaryType,
      hoursPerDay,
      daysPerMonth,
      startDate: startDate ? new Date(startDate) : undefined,
      fitScore: fitScore.overall,
      applicationSource: 'WEBSITE',
      applicationDate: new Date(),
      coverLetter,
      additionalNotes,
      heardAboutUs,
    });

    console.log('[SUBMIT] CV Bank profile:', {
      candidateId: cvBankResult.candidateId,
      isNew: cvBankResult.isNew,
    });

    // Link candidate to application
    await prisma.application.update({
      where: { id: application.id },
      data: {
        candidateId: cvBankResult.candidateId,
      },
    });

    // Determine next steps based on fit score
    let nextStep = 'REVIEW'; // Default: human review
    let shouldInterview = false;

    if (fitScore.overall >= 70) {
      // Strong candidates: proceed to AI interview
      nextStep = 'INTERVIEW';
      shouldInterview = true;

      await prisma.application.update({
        where: { id: application.id },
        data: { status: 'SCREENING' },
      });
    } else if (fitScore.overall >= 50) {
      // Moderate candidates: screening
      nextStep = 'SCREENING';

      await prisma.application.update({
        where: { id: application.id },
        data: { status: 'SCREENING' },
      });
    } else {
      // Lower fit: add to CV bank for future opportunities
      nextStep = 'CV_BANK';

      await prisma.application.update({
        where: { id: application.id },
        data: { status: 'UNDER_REVIEW' },
      });
    }

    // TODO: Send confirmation email
    console.log('[SUBMIT] TODO: Send confirmation email to', email);

    // Return success response
    return NextResponse.json({
      success: true,
      applicationId: application.id,
      candidateId: cvBankResult.candidateId,
      fitScore: fitScore.overall,
      nextStep,
      shouldInterview,
      message: 'Application submitted successfully',
      data: {
        applicationNumber: application.id.substring(0, 8).toUpperCase(),
        submittedAt: application.createdAt,
        fitScore: fitScore.overall,
        recommendation: fitScore.recommendations[0],
      },
    });
  } catch (error) {
    console.error('[SUBMIT] Application submission error:', error);

    return NextResponse.json(
      {
        error: 'Failed to submit application',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
