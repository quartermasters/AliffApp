/**
 * Interview Start API Endpoint
 *
 * Initializes a new interview session with assigned recruiter
 * - Creates InterviewSession record
 * - Uses recruiter persona from application
 * - Generates personalized welcome message from recruiter
 * - Returns session ID and first recruiter message
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import type { RecruiterPersona } from '@/lib/recruiter-personas';

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

    // Get assigned recruiter persona from application
    const recruiterPersona = (application.resumeParsedData as any)?.assignedRecruiter as RecruiterPersona;

    // Create new interview session
    const firstName = candidateName?.split(' ')[0] || application.firstName;

    // Use recruiter's personalized greeting (SHORT and conversational)
    const welcomeMessage = recruiterPersona?.greeting
      ? recruiterPersona.greeting.replace('Thanks for applying', `Thanks for applying to the ${jobTitle || application.job.title} position`)
      : `Hi ${firstName}! Thanks for applying to the ${jobTitle || application.job.title} position.`;

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
      recruiterPersona, // NEW: Include recruiter persona for frontend
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
