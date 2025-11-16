/**
 * Interview Start API Endpoint
 *
 * Initializes a new AI interview session
 */

import { NextRequest, NextResponse } from 'next/server';
import { initializeInterview } from '@/lib/ai/interview-conductor';
import { RoleType } from '@/lib/ai/interview-questions';
import { prisma } from '@/lib/prisma';

// In-memory interview state storage (in production, use Redis or database)
const interviewSessions = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId, candidateName, jobTitle } = body;

    if (!applicationId || !candidateName || !jobTitle) {
      return NextResponse.json(
        { error: 'Application ID, candidate name, and job title are required' },
        { status: 400 }
      );
    }

    console.log(`[API] Starting interview for application: ${applicationId}`);

    // Fetch application to get job details
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { jobPosting: true },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Determine role type based on job title
    const roleType = determineRoleType(application.jobPosting.title);

    // Initialize interview
    const interviewState = await initializeInterview(
      applicationId,
      candidateName,
      jobTitle,
      roleType
    );

    // Store interview state
    interviewSessions.set(applicationId, interviewState);

    // Update application status
    await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: 'INTERVIEWING',
      },
    });

    // Create interview session record
    await prisma.interviewSession.create({
      data: {
        applicationId,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
        transcript: {},
        metadata: {},
      },
    });

    console.log('[API] Interview initialized successfully');

    return NextResponse.json({
      success: true,
      welcomeMessage: interviewState.messages[0].content,
      message: 'Interview session started',
    });
  } catch (error) {
    console.error('[API] Interview start error:', error);

    return NextResponse.json(
      {
        error: 'Failed to start interview',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Determine role type from job title
 */
function determineRoleType(jobTitle: string): RoleType {
  const title = jobTitle.toLowerCase();

  if (title.includes('engineer') || title.includes('developer')) {
    return 'SOFTWARE_ENGINEER';
  } else if (title.includes('product') || title.includes('pm')) {
    return 'PRODUCT_MANAGER';
  } else if (title.includes('design') || title.includes('ux') || title.includes('ui')) {
    return 'DESIGNER';
  } else if (title.includes('data') || title.includes('analyst') || title.includes('scientist')) {
    return 'DATA_SCIENTIST';
  } else if (title.includes('sales') || title.includes('business development')) {
    return 'SALES';
  } else if (title.includes('marketing')) {
    return 'MARKETING';
  } else if (title.includes('customer') || title.includes('support')) {
    return 'CUSTOMER_SUCCESS';
  } else if (title.includes('hr') || title.includes('people') || title.includes('talent')) {
    return 'HR';
  } else if (title.includes('finance') || title.includes('accounting')) {
    return 'FINANCE';
  } else if (title.includes('operations') || title.includes('ops')) {
    return 'OPERATIONS';
  }

  return 'GENERAL';
}

/**
 * Export interview sessions for other endpoints
 */
export { interviewSessions };
