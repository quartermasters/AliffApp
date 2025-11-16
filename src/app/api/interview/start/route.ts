/**
 * Interview Start API Endpoint
 *
 * Initializes a new AI interview session
 * - Creates InterviewSession record
 * - Generates personalized welcome message
 * - Returns session ID and first ALIFF message
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId, candidateName, jobTitle } = body;

    if (!applicationId) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    // Check if application exists
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Check if interview session already exists
    const existingSession = await prisma.interviewSession.findUnique({
      where: { applicationId },
    });

    if (existingSession) {
      // Resume existing session or return error
      if (existingSession.completedAt) {
        return NextResponse.json(
          { error: 'Interview already completed' },
          { status: 400 }
        );
      }

      // Allow resume if within 24 hours
      const now = new Date();
      if (existingSession.allowResumeUntil && existingSession.allowResumeUntil > now) {
        return NextResponse.json({
          interviewId: existingSession.id,
          welcomeMessage: `Welcome back, ${candidateName?.split(' ')[0] || 'there'}! Let's continue where we left off.`,
          isResuming: true,
          messages: existingSession.messages,
        });
      }

      return NextResponse.json(
        { error: 'Interview session expired. Please start a new application.' },
        { status: 400 }
      );
    }

    // Create new interview session
    const firstName = candidateName?.split(' ')[0] || application.firstName;
    const welcomeMessage = `Hi ${firstName}! 👋 Thanks for applying to the ${jobTitle || application.job.title} position.

I'm ALIFF, your recruitment agent at Aliff Services. I'll be conducting your interview today, which should only take 5-10 minutes.

I've reviewed your CV and I'm impressed by your background. Let's start - can you tell me a bit about your current situation? Are you currently working or available to start immediately?`;

    const interviewSession = await prisma.interviewSession.create({
      data: {
        applicationId,
        mode: 'CONVERSATIONAL',
        currentStage: 'WELCOME',
        messages: [
          {
            role: 'assistant',
            content: welcomeMessage,
            timestamp: new Date().toISOString(),
          },
        ],
        lastActivityAt: new Date(),
        allowResumeUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        userAgent: request.headers.get('user-agent') || undefined,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      },
    });

    // Update application status
    await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: 'INTERVIEWING',
        interviewDate: new Date(),
      },
    });

    console.log(`[INTERVIEW] Started session ${interviewSession.id} for application ${applicationId}`);

    return NextResponse.json({
      success: true,
      interviewId: interviewSession.id,
      welcomeMessage,
      isResuming: false,
    });
  } catch (error) {
    console.error('[INTERVIEW] Start error:', error);
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
