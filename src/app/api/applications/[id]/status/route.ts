/**
 * Application Status API Endpoint
 *
 * Returns current status and details of an application
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    // Fetch application with related data
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            department: true,
            location: true,
          },
        },
        interviewSession: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Determine next step based on status and fit score
    let nextStep = 'REVIEW';
    let shouldInterview = false;

    if (application.status === 'SUBMITTED' || application.status === 'SCREENING') {
      if ((application.fitScore || 0) >= 70) {
        nextStep = 'INTERVIEW';
        shouldInterview = true;
      } else {
        nextStep = 'REVIEW';
      }
    } else if (application.status === 'INTERVIEWING') {
      nextStep = 'INTERVIEW_IN_PROGRESS';
    } else if (application.status === 'INTERVIEW_COMPLETE') {
      nextStep = 'EVALUATION';
    } else if (application.status === 'SHORTLISTED') {
      nextStep = 'HUMAN_INTERVIEW';
    }

    // Get interview session if exists
    const interviewSession = application.interviewSession;

    // Build response
    const response = {
      applicationNumber: application.id.substring(0, 8).toUpperCase(),
      submittedAt: application.createdAt,
      candidateName: `${application.firstName} ${application.lastName}`,
      email: application.email,
      jobTitle: application.job.title,
      jobDepartment: application.job.department,
      jobLocation: application.job.location,
      status: application.status,
      fitScore: application.fitScore,
      nextStep,
      shouldInterview,

      // Interview data (if exists)
      interviewCompleted: application.interviewCompleted,
      interviewScore: application.interviewScore,
      interviewStatus: interviewSession?.status,

      // Timeline
      timeline: [
        {
          step: 'Application Submitted',
          status: 'completed',
          date: application.createdAt,
        },
        {
          step: 'Resume Screening',
          status: application.status === 'SUBMITTED' ? 'in_progress' : 'completed',
          date: application.updatedAt,
        },
        {
          step: 'AI Interview',
          status: application.interviewCompleted
            ? 'completed'
            : shouldInterview
            ? 'pending'
            : 'skipped',
          date: interviewSession?.completedAt || null,
        },
        {
          step: 'Team Review',
          status:
            application.status === 'SHORTLISTED' ||
            application.status === 'INTERVIEW_SCHEDULED'
              ? 'in_progress'
              : application.status === 'REJECTED'
              ? 'completed'
              : 'pending',
          date: null,
        },
        {
          step: 'Decision',
          status:
            application.status === 'ACCEPTED' ||
            application.status === 'REJECTED'
              ? 'completed'
              : 'pending',
          date: null,
        },
      ],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[API] Application status error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch application status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
