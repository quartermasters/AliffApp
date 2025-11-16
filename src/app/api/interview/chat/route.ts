/**
 * Interview Chat API Endpoint
 *
 * Handles real-time chat messages during AI interview
 * Processes responses and returns next questions
 */

import { NextRequest, NextResponse } from 'next/server';
import { processResponse, generateInterviewReport } from '@/lib/ai/interview-conductor';
import { prisma } from '@/lib/prisma';

// Import interview sessions map from start endpoint
const interviewSessions = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId, messages, timeElapsed } = body;

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    // Get interview state
    let state = interviewSessions.get(applicationId);

    if (!state) {
      return NextResponse.json(
        { error: 'Interview session not found. Please start a new interview.' },
        { status: 404 }
      );
    }

    // Get last user message
    const lastUserMessage = messages
      .filter((m: any) => m.role === 'user')
      .pop();

    if (!lastUserMessage) {
      return NextResponse.json(
        { error: 'No user message found' },
        { status: 400 }
      );
    }

    console.log('[API] Processing interview response:', {
      applicationId,
      messageLength: lastUserMessage.content.length,
      questionsAnswered: state.answers?.length || 0,
    });

    // Process response and get next question
    const result = await processResponse(state, lastUserMessage.content);

    // Update stored state
    interviewSessions.set(applicationId, result.state);

    // If interview is complete, save final results
    if (result.isComplete) {
      const report = generateInterviewReport(result.state);

      // Update interview session in database
      await prisma.interviewSession.updateMany({
        where: { applicationId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          transcript: {
            messages: result.state.messages,
            answers: result.state.answers,
          },
          gpt4Score: report.finalScore,
          overallScore: report.finalScore,
          duration: Math.round((Date.now() - result.state.startTime.getTime()) / 1000 / 60),
          feedback: report.summary,
        },
      });

      // Update application status
      await prisma.application.update({
        where: { id: applicationId },
        data: {
          status: 'INTERVIEW_COMPLETE',
          interviewCompleted: true,
          interviewScore: report.finalScore,
          interviewTranscript: {
            messages: result.state.messages,
            report,
          },
        },
      });

      console.log('[API] Interview completed:', {
        applicationId,
        finalScore: report.finalScore,
        recommendation: report.recommendation,
      });

      // Clean up session after completion
      setTimeout(() => {
        interviewSessions.delete(applicationId);
      }, 60000); // Keep for 1 minute

      return NextResponse.json({
        success: true,
        message: result.nextMessage,
        isComplete: true,
        finalScore: report.finalScore,
        currentScore: result.currentScore,
        report,
      });
    }

    return NextResponse.json({
      success: true,
      message: result.nextMessage,
      questionId: result.questionId,
      isComplete: false,
      currentScore: result.currentScore,
    });
  } catch (error) {
    console.error('[API] Interview chat error:', error);

    return NextResponse.json(
      {
        error: 'Failed to process interview message',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
