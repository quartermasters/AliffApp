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
        jobId: jobId,
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

    // Parse skills from requirements text (JobPosting schema has limited fields)
    const requiredSkillsFromText = jobPosting.requirements
      .toLowerCase()
      .match(/\b(?:python|javascript|react|node|java|sql|aws|docker|kubernetes|typescript|nextjs|next\.js)\b/gi) || [];

    const jobRequirements = {
      id: jobPosting.id,
      title: jobPosting.title,
      description: jobPosting.description,
      requiredSkills: [...new Set(requiredSkillsFromText)], // Deduplicate
      preferredSkills: [], // Not in schema
      minYearsExperience: jobPosting.type === 'INTERNSHIP' ? 0 : 2, // Default
      educationLevel: [], // Not in schema
      salaryRange: {
        min: 0,
        max: 200000,
        type: 'ANNUAL' as 'HOURLY' | 'ANNUAL',
      },
      location: jobPosting.location,
      remote: jobPosting.location === 'REMOTE',
      industry: [jobPosting.department || 'Technology'],
      employmentType: jobPosting.type,
      hoursPerWeek: jobPosting.type === 'FULL_TIME' ? 40 : jobPosting.type === 'PART_TIME' ? 20 : 40,
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
        jobId: jobId,

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
        resumeParsedData: parsedResumeData as any,

        // Salary & Availability
        currentSalary,
        expectedSalary,
        salaryType,
        hoursPerDay,
        daysPerMonth,
        startDate: startDate ? new Date(startDate) : null,

        // Additional Info
        coverLetter,
        // Note: additionalNotes and heardAboutUs are not in schema
        // They are passed to CV Bank only

        // Scores
        fitScore: fitScore.overall,
        // Note: fitScoreBreakdown stored in parsedResumeData

        // Status
        status: 'SUBMITTED',
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

    // Note: No need to link candidate to application
    // The Candidate model already has applicationId linking back to this application

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
