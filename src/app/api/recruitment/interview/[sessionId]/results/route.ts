import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/recruitment/interview/[sessionId]/results
 * Get interview evaluation results
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = params.sessionId;

    // In production, load evaluation from database:
    /*
    const session = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        candidateName: true,
        jobTitle: true,
        status: true,
        completedAt: true,
        durationMinutes: true,
        overallScore: true,
        recommendation: true,
        evaluationData: true,
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    if (session.status !== "COMPLETED" || !session.evaluationData) {
      return NextResponse.json(
        { error: "Evaluation not yet complete" },
        { status: 202 } // 202 Accepted - processing
      );
    }

    const results = session.evaluationData as any;

    return NextResponse.json({
      success: true,
      results: {
        sessionId: session.id,
        candidateName: session.candidateName,
        jobTitle: session.jobTitle,
        overallScore: session.overallScore,
        recommendation: session.recommendation,
        breakdown: results.breakdown,
        strengths: results.strengths,
        concerns: results.concerns,
        topAnswers: results.topAnswers,
        aiConsensusNotes: results.aiConsensusNotes,
        nextSteps: results.nextSteps,
        completedAt: session.completedAt,
        durationMinutes: session.durationMinutes,
      },
    });
    */

    // Simulated results for development
    const mockResults = {
      sessionId,
      candidateName: "John Doe",
      jobTitle: "Senior GOVCON Proposal Writer",
      overallScore: 82,
      recommendation: "ADVANCE",
      breakdown: {
        behavioralScore: 85,
        technicalScore: 88,
        situationalScore: 78,
        culturalScore: 80,
        communicationScore: 83,
      },
      strengths: [
        "Strong understanding of FAR/DFARS compliance requirements",
        "Excellent communication skills with clear, structured responses",
        "Demonstrated 8+ years of relevant GOVCON proposal experience",
        "Specific examples with quantifiable results (70% win rate)",
        "Proactive problem-solving approach",
      ],
      concerns: [
        "Could provide more details on CMMC implementation experience",
        "Limited exposure to DoD oral presentation requirements",
      ],
      topAnswers: [
        {
          question:
            "Walk me through your process for responding to an RFP from initial receipt to final submission.",
          answer:
            "When I receive an RFP, my first step is always to create a comprehensive compliance matrix mapping all Section L requirements to Section M evaluation criteria. I immediately schedule a kick-off meeting with the capture manager and technical SMEs to review the solicitation and develop our win themes...",
          score: 92,
        },
        {
          question:
            "Tell me about a time when you had to meet a tight deadline. How did you manage your time and priorities?",
          answer:
            "Last year, we had a DoD RFP with only 18 days from release to submission - half the typical timeframe. I created a detailed schedule with daily milestones, identified the critical path activities, and implemented daily stand-ups with the proposal team...",
          score: 88,
        },
        {
          question:
            "How do you develop win themes that resonate with federal evaluators?",
          answer:
            "My approach starts with thoroughly analyzing the agency's mission, pain points, and evaluation criteria. I review their strategic plans, recent contract awards, and past performance requirements to understand what matters most to them...",
          score: 86,
        },
      ],
      aiConsensusNotes: `Multi-AI Consensus Evaluation (GPT-4, Claude, Gemini):

OVERALL SCORE: 82/100

PERFORMANCE DISTRIBUTION:
- Excellent responses: 5
- Good responses: 3
- Acceptable responses: 1
- Poor responses: 0

CATEGORY BREAKDOWN:
- Behavioral: 85/100
- Technical: 88/100
- Situational: 78/100
- Cultural: 80/100
- Communication: 83/100

CONSENSUS: The candidate demonstrated strong interview performance across all AI evaluators. Majority of responses exceeded expectations. Technical knowledge of GOVCON processes (FAR/DFARS, RFP management, compliance) was particularly impressive. Communication was clear, structured, and professional throughout.`,
      nextSteps:
        "Candidate passed interview evaluation. Next step: Send skills assessment test within 3 business days.",
      completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      durationMinutes: 14,
    };

    return NextResponse.json({
      success: true,
      results: mockResults,
    });
  } catch (error) {
    console.error("Error loading interview results:", error);
    return NextResponse.json(
      { error: "Failed to load results" },
      { status: 500 }
    );
  }
}
