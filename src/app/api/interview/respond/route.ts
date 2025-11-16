/**
 * Interview Respond API Endpoint
 *
 * Handles candidate messages and generates ALIFF responses
 * - Updates conversation history
 * - Extracts structured data
 * - Progresses through interview stages
 * - Detects interview completion
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {
  generateAliffResponse,
  extractStructuredData,
  ConversationContext,
  InterviewStage,
  Message,
} from '@/lib/ai/interview-conductor-conversational';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { interviewId, message } = body;

    if (!interviewId || !message) {
      return NextResponse.json(
        { error: 'Interview ID and message are required' },
        { status: 400 }
      );
    }

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

    if (session.completedAt) {
      return NextResponse.json({ error: 'Interview already completed' }, { status: 400 });
    }

    // Build conversation context
    const messages = session.messages as Message[];
    const extractedData = (session.extractedData as any) || {};

    const context: ConversationContext = {
      candidateName: `${session.application.firstName} ${session.application.lastName}`,
      jobTitle: session.application.job.title,
      parsedResumeData: session.application.resumeParsedData,
      currentStage: session.currentStage as InterviewStage,
      messages,
      extractedData,
      stageCompletionFlags: (session.stageProgress as any) || {},
    };

    // Generate ALIFF response using Claude API
    const { response, newStage, shouldComplete } = await generateAliffResponse(context, message);

    // Extract structured data from user message using OpenAI
    const newExtractedData = await extractStructuredData(
      extractedData,
      context.currentStage,
      message
    );

    // Merge extracted data
    const updatedExtractedData = {
      ...extractedData,
      ...newExtractedData,
    };

    // Add messages to history
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    const assistantMessage: Message = {
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage, assistantMessage];

    // Calculate duration
    const duration = Math.floor((Date.now() - session.startedAt.getTime()) / 1000);

    // Update session in database
    const updatedSession = await prisma.interviewSession.update({
      where: { id: interviewId },
      data: {
        messages: updatedMessages,
        extractedData: updatedExtractedData,
        currentStage: newStage,
        lastActivityAt: new Date(),
        duration,
        ...(shouldComplete && {
          completedAt: new Date(),
          currentStage: 'COMPLETED',
        }),
      },
    });

    // If interview completed, trigger analysis
    if (shouldComplete) {
      // Update application status
      await prisma.application.update({
        where: { id: session.applicationId },
        data: {
          status: 'INTERVIEW_COMPLETE',
          interviewCompleted: true,
          interviewTranscript: updatedMessages,
        },
      });

      console.log(`[INTERVIEW] Session ${interviewId} completed. Duration: ${duration}s`);
    }

    return NextResponse.json({
      success: true,
      response,
      currentStage: newStage,
      isComplete: shouldComplete,
      extractedData: updatedExtractedData,
    });
  } catch (error) {
    console.error('[INTERVIEW] Respond error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process message',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
