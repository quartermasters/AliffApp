import { NextRequest, NextResponse } from "next/server";
import { processResponse } from "@/lib/aliff/recruiter/interview/engine";
import { getQuestionsForJob } from "@/lib/aliff/recruiter/interview/questions";

/**
 * POST /api/recruitment/interview/[sessionId]/respond
 * Process candidate response and generate next question
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = params.sessionId;
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // In production, load session from database:
    /*
    const dbSession = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
      include: {
        application: {
          select: {
            jobPosting: {
              select: { category: true },
            },
          },
        },
      },
    });

    if (!dbSession) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Convert to InterviewSession format
    const session = {
      id: dbSession.id,
      applicationId: dbSession.applicationId,
      candidateName: dbSession.candidateName,
      candidateEmail: dbSession.candidateEmail,
      jobTitle: dbSession.jobTitle,
      jobSlug: dbSession.jobSlug,
      channel: dbSession.channel,
      status: dbSession.status,
      startedAt: dbSession.startedAt,
      completedAt: dbSession.completedAt,
      durationMinutes: dbSession.durationMinutes,
      messages: dbSession.messages as any,
      currentQuestionIndex: dbSession.currentQuestionIndex,
      questionsAsked: dbSession.questionsAsked,
      metadata: dbSession.metadata as any,
    };

    // Get questions for this job category
    const jobCategory = dbSession.application.jobPosting.category;
    const questions = getQuestionsForJob(jobCategory as any, 12);

    // Process the response
    const {
      session: updatedSession,
      response,
      completed,
    } = await processResponse(session, message, questions);

    // Save updated session to database
    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: {
        status: updatedSession.status,
        completedAt: updatedSession.completedAt,
        durationMinutes: updatedSession.durationMinutes,
        messages: updatedSession.messages as any,
        currentQuestionIndex: updatedSession.currentQuestionIndex,
        questionsAsked: updatedSession.questionsAsked,
        metadata: updatedSession.metadata as any,
      },
    });

    // If interview is completed, trigger multi-AI evaluation
    if (completed) {
      await triggerInterviewEvaluation(updatedSession);
    }

    return NextResponse.json({
      success: true,
      session: updatedSession,
      response,
      completed,
    });
    */

    // Simulated for development (using in-memory session)
    // In real implementation, load from DB
    console.log(`[Interview API] Processing message for session ${sessionId}`);
    console.log(`[Interview API] Candidate message: ${message.substring(0, 100)}...`);

    // Mock session (in production, load from database)
    const mockSession: any = {
      id: sessionId,
      applicationId: "app-123",
      candidateName: "John Doe",
      candidateEmail: "john.doe@example.com",
      jobTitle: "Senior GOVCON Proposal Writer",
      jobSlug: "senior-govcon-proposal-writer",
      channel: "WEB",
      status: "IN_PROGRESS",
      startedAt: new Date(Date.now() - 5 * 60 * 1000), // Started 5 min ago
      messages: [], // Load existing messages from DB
      currentQuestionIndex: 0,
      questionsAsked: [],
      metadata: {},
    };

    // Get questions for GOVCON
    const questions = getQuestionsForJob("GOVCON", 12);

    // Process the response
    const {
      session: updatedSession,
      response: aiResponse,
      completed,
    } = await processResponse(mockSession, message, questions);

    console.log(`[Interview API] AI response: ${aiResponse.substring(0, 100)}...`);
    console.log(`[Interview API] Completed: ${completed}`);

    return NextResponse.json({
      success: true,
      session: updatedSession,
      response: aiResponse,
      completed,
    });
  } catch (error) {
    console.error("Error processing interview response:", error);
    return NextResponse.json(
      { error: "Failed to process response" },
      { status: 500 }
    );
  }
}

/**
 * Trigger multi-AI evaluation (Phase 2 Task 3)
 */
async function triggerInterviewEvaluation(
  session: any
): Promise<void> {
  console.log(
    `[Interview API] Triggering multi-AI evaluation for session ${session.id}`
  );

  // Import evaluation queue
  const { triggerInterviewEvaluation: queueEvaluation } = await import(
    "@/lib/aliff/recruiter/interview/queue"
  );

  // Trigger async evaluation
  await queueEvaluation(session);
}
