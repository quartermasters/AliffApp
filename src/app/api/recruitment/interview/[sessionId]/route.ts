import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/recruitment/interview/[sessionId]
 * Load interview session
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = params.sessionId;

    // In production, load from database:
    /*
    const session = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
      include: {
        application: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            jobPosting: {
              select: {
                title: true,
                slug: true,
                category: true,
              },
            },
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }
    */

    // Simulated session for development
    const session = {
      id: sessionId,
      candidateName: "John Doe",
      jobTitle: "Senior GOVCON Proposal Writer",
      jobSlug: "senior-govcon-proposal-writer",
      status: "SCHEDULED",
      messages: [],
      questionsAsked: [],
      currentQuestionIndex: 0,
    };

    return NextResponse.json({ success: true, session });
  } catch (error) {
    console.error("Error loading interview session:", error);
    return NextResponse.json(
      { error: "Failed to load session" },
      { status: 500 }
    );
  }
}
