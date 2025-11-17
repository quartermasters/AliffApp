/**
 * Interview Results API Endpoint
 *
 * Returns interview analysis and scores
 * - OpenAI GPT-4o scoring
 * - Breakdown by category
 * - Strengths and concerns
 * - Recommendation
 * - Next steps
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {
  calculateInterviewScores,
  Message,
} from '@/lib/ai/interview-conductor-conversational';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: interviewId } = await params;

    // Fetch interview session
    const session = await prisma.interviewSession.findUnique({
      where: { id: interviewId },
      include: {
        application: {
          include: {
            job: true,
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: 'Interview session not found' }, { status: 404 });
    }

    if (!session.completedAt) {
      return NextResponse.json({ error: 'Interview not yet completed' }, { status: 400 });
    }

    // Check if scores already calculated
    if (session.consensusScore !== null && session.consensusScore !== undefined) {
      // Return cached results
      return NextResponse.json({
        interviewId: session.id,
        candidateName: `${session.application.firstName} ${session.application.lastName}`,
        jobTitle: session.application.job.title,
        completedAt: session.completedAt.toISOString(),
        duration: session.duration || 0,
        overallScore: session.consensusScore,
        recommendation: session.recommendation || 'ADD_TO_TALENT_POOL',
        scores: {
          communication: session.communicationScore || 50,
          availability: session.availabilityFitScore || 50,
          technical: session.technicalScore || 50,
          motivation: session.motivationScore || 50,
        },
        strengths: session.strengths || [],
        concerns: session.concerns || [],
        nextSteps: generateNextSteps(session.recommendation || 'ADD_TO_TALENT_POOL'),
      });
    }

    // Calculate scores using multi-AI consensus
    console.log(`[INTERVIEW] Calculating scores for session ${interviewId}`);

    const messages = (session.messages as unknown) as Message[];
    const extractedData = (session.extractedData as any) || {};

    const jobRequirements = {
      title: session.application.job.title,
      requirements: session.application.job.requirements,
      type: session.application.job.type,
    };

    const scores = await calculateInterviewScores(messages, extractedData, jobRequirements);

    // Update session with calculated scores
    await prisma.interviewSession.update({
      where: { id: interviewId },
      data: {
        gpt4Score: scores.openaiScore,
        consensusScore: scores.consensusScore,
        communicationScore: scores.breakdown.communication,
        availabilityFitScore: scores.breakdown.availability,
        technicalScore: scores.breakdown.technical,
        motivationScore: scores.breakdown.motivation,
        strengths: scores.strengths,
        concerns: scores.concerns,
        recommendation: scores.recommendation,
        detailedFeedback: `Interview completed with ${scores.consensusScore}/100 overall score. Communication: ${scores.breakdown.communication}, Availability: ${scores.breakdown.availability}, Technical: ${scores.breakdown.technical}, Motivation: ${scores.breakdown.motivation}.`,
      },
    });

    // Update application with interview score
    await prisma.application.update({
      where: { id: session.applicationId },
      data: {
        interviewScore: scores.consensusScore,
        status: scores.recommendation === 'PROCEED_TO_HUMAN_REVIEW' ? 'SHORTLISTED' : 'UNDER_REVIEW',
      },
    });

    // If high score, potentially auto-create candidate in CV bank
    if (scores.recommendation === 'PROCEED_TO_HUMAN_REVIEW' && scores.consensusScore >= 85) {
      try {
        const existingCandidate = await prisma.candidate.findUnique({
          where: { applicationId: session.applicationId },
        });

        if (!existingCandidate) {
          await prisma.candidate.create({
            data: {
              applicationId: session.applicationId,
              name: `${session.application.firstName} ${session.application.lastName}`,
              email: session.application.email,
              phone: session.application.phone,
              uploadedPhotoUrl: session.application.uploadedPhotoUrl,
              cvExtractedPhotoUrl: session.application.cvExtractedPhotoUrl,
              currentSalary: session.application.currentSalary,
              expectedSalary: session.application.expectedSalary,
              salaryType: session.application.salaryType,
              hoursPerDay: session.application.hoursPerDay,
              daysPerMonth: session.application.daysPerMonth,
              startDate: session.application.startDate,
              interviewTranscript: messages as any,
              interviewScore: scores.consensusScore,
              interviewScores: {
                openai: scores.openaiScore,
                consensus: scores.consensusScore,
              } as any,
              interviewFeedback: scores.strengths.join(', '),
              interviewDate: session.completedAt,
              fitScore: session.application.fitScore,
              status: 'INTERVIEWED',
              appliedForJobId: session.application.jobId,
              applicationDate: session.application.createdAt,
              parsedResumeData: session.application.resumeParsedData as any,
              resumeUrl: session.application.resumeUrl,
              resumeText: session.application.resumeText,
            },
          });

          console.log(`[INTERVIEW] Auto-created candidate profile for high-scoring applicant`);
        }
      } catch (error) {
        console.error('[INTERVIEW] Failed to create candidate:', error);
        // Non-critical error, continue
      }
    }

    console.log(
      `[INTERVIEW] Analysis complete. Score: ${scores.consensusScore}/100, Recommendation: ${scores.recommendation}`
    );

    return NextResponse.json({
      interviewId: session.id,
      candidateName: `${session.application.firstName} ${session.application.lastName}`,
      jobTitle: session.application.job.title,
      completedAt: session.completedAt.toISOString(),
      duration: session.duration || 0,
      overallScore: scores.consensusScore,
      recommendation: scores.recommendation,
      scores: {
        communication: scores.breakdown.communication,
        availability: scores.breakdown.availability,
        technical: scores.breakdown.technical,
        motivation: scores.breakdown.motivation,
      },
      strengths: scores.strengths,
      concerns: scores.concerns,
      nextSteps: generateNextSteps(scores.recommendation),
    });
  } catch (error) {
    console.error('[INTERVIEW] Results error:', error);
    return NextResponse.json(
      {
        error: 'Failed to calculate interview results',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Generate next steps based on recommendation
 */
function generateNextSteps(recommendation: string): string[] {
  switch (recommendation) {
    case 'PROCEED_TO_HUMAN_REVIEW':
      return [
        'Your interview transcript and CV will be reviewed by our recruitment team within 24 hours.',
        'Qualified candidates will receive an email invitation to schedule a follow-up discussion.',
        'Your profile has been added to our CV bank for future opportunities that match your skills.',
        'Check your application status anytime using the tracking link sent to your email.',
      ];

    case 'ADD_TO_TALENT_POOL':
      return [
        "While you may not be a perfect match for this specific role, we've added your profile to our talent pool.",
        "You'll be notified when positions matching your skills and availability become available.",
        'We typically add 50-100 new opportunities monthly across various domains.',
        'Keep your resume updated by chatting with ALIFF if your availability or skills change.',
      ];

    case 'REJECT':
      return [
        'Thank you for taking the time to interview with us.',
        'We encourage you to apply for other positions that better match your background.',
        'Visit our careers page regularly to see new openings.',
        'Feel free to reach out to ALIFF for career guidance or questions about future roles.',
      ];

    default:
      return [
        'Thank you for completing the interview.',
        "We'll review your application and get back to you soon.",
        'Check your email for updates on your application status.',
      ];
  }
}
