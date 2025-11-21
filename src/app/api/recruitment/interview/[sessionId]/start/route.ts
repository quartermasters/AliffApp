import { NextRequest, NextResponse } from "next/server";
import { startInterview, createInterviewSession } from "@/lib/aliff/recruiter/interview/engine";

/**
 * POST /api/recruitment/interview/[sessionId]/start
 * Start interview session
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = params.sessionId;

    // In production, load session from database and call startInterview:
    /*
    const dbSession = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
      include: {
        application: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            jobPosting: {
              select: { title: true, slug: true, category: true },
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

    const session = {
      id: dbSession.id,
      applicationId: dbSession.applicationId,
      candidateName: `${dbSession.application.firstName} ${dbSession.application.lastName}`,
      candidateEmail: dbSession.application.email,
      jobTitle: dbSession.application.jobPosting.title,
      jobSlug: dbSession.application.jobPosting.slug,
      channel: dbSession.channel,
      status: dbSession.status,
      messages: dbSession.messages as any,
      questionsAsked: dbSession.questionsAsked,
      currentQuestionIndex: dbSession.currentQuestionIndex,
      metadata: dbSession.metadata as any,
    };

    const { session: updatedSession, greeting } = await startInterview(session);

    // Save updated session to database
    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: {
        status: updatedSession.status,
        startedAt: updatedSession.startedAt,
        messages: updatedSession.messages as any,
      },
    });

    return NextResponse.json({
      success: true,
      session: updatedSession,
      greeting,
    });
    */

    // Simulated for development
    const mockSession = await createInterviewSession(
      "app-123",
      "John Doe",
      "john.doe@example.com",
      "Senior GOVCON Proposal Writer",
      "senior-govcon-proposal-writer",
      "GOVCON"
    );

    const { session, greeting } = await startInterview(mockSession);

    console.log(`[Interview API] Started interview ${sessionId}`);

    return NextResponse.json({
      success: true,
      session,
      greeting,
    });
  } catch (error) {
    console.error("Error starting interview:", error);
    return NextResponse.json(
      { error: "Failed to start interview" },
      { status: 500 }
    );
  }
}
