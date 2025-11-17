/**
 * Create Initial Application API Endpoint
 *
 * Creates a partial application record after CV + photo upload (Step 1)
 * This allows the candidate to proceed to the AI interview before
 * completing the full application form.
 *
 * Status: SUBMITTED (will change to INTERVIEWING when interview starts)
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      jobId,
      firstName,
      lastName,
      email,
      phone,
      resumeUrl,
      uploadedPhotoUrl,
      cvExtractedPhotoUrl,
      coverLetterUrl,
      resumeParsedData,
      resumeText,
      assignedRecruiter, // NEW: Recruiter persona assignment
    } = body;

    // Validate required fields
    if (!jobId || !firstName || !lastName || !email || !resumeUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: jobId, firstName, lastName, email, resumeUrl' },
        { status: 400 }
      );
    }

    // Check if job exists (jobId is actually a slug from URL)
    const job = await prisma.jobPosting.findUnique({
      where: { slug: jobId },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job posting not found' }, { status: 404 });
    }

    // Merge recruiter persona into resumeParsedData for easy retrieval
    const enrichedResumeData = {
      ...(resumeParsedData || {}),
      assignedRecruiter: assignedRecruiter || null, // Store recruiter persona
    };

    // Create application record
    const application = await prisma.application.create({
      data: {
        jobId: job.id, // Use the actual job ID, not the slug
        firstName,
        lastName,
        email,
        phone: phone || null,
        resumeUrl,
        coverLetter: coverLetterUrl || null,
        uploadedPhotoUrl: uploadedPhotoUrl || null,
        cvExtractedPhotoUrl: cvExtractedPhotoUrl || null,
        resumeParsedData: enrichedResumeData,
        resumeText: resumeText || null,
        status: 'SUBMITTED', // Will change to INTERVIEWING when interview starts
        photoMetadata: {
          uploadedPhotoSource: uploadedPhotoUrl ? 'direct_upload' : null,
          cvExtractedPhotoSource: cvExtractedPhotoUrl ? 'cv_extraction' : null,
          uploadDate: new Date().toISOString(),
        },
      },
    });

    console.log(`[APPLICATION] Initial application created: ${application.id} for job ${job.title}`);

    return NextResponse.json({
      success: true,
      applicationId: application.id,
      message: 'Initial application created successfully',
    });
  } catch (error) {
    console.error('[APPLICATION] Create initial error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create initial application',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
