/**
 * ALIFF-RECRUITER Conversation Engine
 *
 * Conducts intelligent, conversational interviews with candidates
 * Supports both web and SMS channels
 */

import {
  InterviewSession,
  InterviewMessage,
  InterviewQuestion,
  MessageRole,
  DEFAULT_INTERVIEW_CONFIG,
  InterviewConfiguration,
} from "./types";
import { getQuestionsForJob } from "./questions";
import { nanoid } from "nanoid";

// AI SDK imports (production)
// import { generateText } from "ai";
// import { openai } from "@ai-sdk/openai";

/**
 * ALIFF-RECRUITER Interview Persona
 */
const INTERVIEWER_SYSTEM_PROMPT = `You are ALIFF-RECRUITER, an AI hiring assistant for Aliff Services. You are conducting a professional, conversational interview with a job candidate.

YOUR PERSONALITY:
- Warm, friendly, and professional
- Encouraging and supportive
- Clear and concise
- Patient and understanding
- Culturally aware (serving Pakistan, UAE, and US markets)

YOUR RESPONSIBILITIES:
- Ask interview questions naturally and conversationally
- Listen actively to candidate responses
- Ask thoughtful follow-up questions when appropriate
- Keep the interview focused and on track
- Provide smooth transitions between topics
- Thank candidates for their time and responses

INTERVIEW GUIDELINES:
- Start with a warm greeting and introduction
- Ask 8-12 questions over 15 minutes
- Mix behavioral, technical, situational, and cultural questions
- Ask follow-ups for vague or incomplete answers
- Acknowledge good answers positively
- Keep questions concise (1-2 sentences)
- End with next steps and timeline

COMMUNICATION STYLE:
- Use conversational language (not robotic)
- Ask one question at a time
- Avoid jargon unless discussing technical topics
- Be respectful of cultural differences
- Maintain professionalism while being personable

WHAT NOT TO DO:
- Don't ask discriminatory questions (age, religion, marital status, etc.)
- Don't make promises about hiring outcomes
- Don't share confidential company information
- Don't rush the candidate
- Don't ask multiple questions at once`;

/**
 * Create a new interview session
 */
export async function createInterviewSession(
  applicationId: string,
  candidateName: string,
  candidateEmail: string,
  jobTitle: string,
  jobSlug: string,
  jobCategory: "GOVCON" | "SLED" | "IT_SERVICES" | "WRITING_SERVICES",
  config: InterviewConfiguration = DEFAULT_INTERVIEW_CONFIG
): Promise<InterviewSession> {
  const sessionId = nanoid();

  // Generate interview questions for this job
  const questions = getQuestionsForJob(
    jobCategory,
    config.maxQuestionsAllowed
  );

  const session: InterviewSession = {
    id: sessionId,
    applicationId,
    candidateName,
    candidateEmail,
    jobTitle,
    jobSlug,
    channel: "WEB",
    status: "SCHEDULED",
    messages: [],
    currentQuestionIndex: 0,
    questionsAsked: [],
    metadata: {},
  };

  console.log(
    `[Interview Engine] Created session ${sessionId} for ${candidateName}`
  );

  return session;
}

/**
 * Start interview session
 */
export async function startInterview(
  session: InterviewSession
): Promise<{ session: InterviewSession; greeting: string }> {
  const greeting = generateGreeting(session);

  session.status = "IN_PROGRESS";
  session.startedAt = new Date();

  // Add greeting message
  addMessage(session, "interviewer", greeting);

  console.log(`[Interview Engine] Started interview ${session.id}`);

  return { session, greeting };
}

/**
 * Generate personalized greeting
 */
function generateGreeting(session: InterviewSession): string {
  const firstName = session.candidateName.split(" ")[0];

  return `Hi ${firstName}! 👋

I'm ALIFF, your AI hiring assistant. Thanks for taking the time to chat with me today about the ${session.jobTitle} position at Aliff Services.

This will be a conversational interview lasting about 15 minutes. I'll ask you 8-12 questions about your experience, skills, and how you approach your work. There are no trick questions - just be yourself and share your authentic experiences.

Feel free to take your time with your answers, and ask me to clarify if any question isn't clear.

Ready to get started?`;
}

/**
 * Process candidate response and generate next question
 */
export async function processResponse(
  session: InterviewSession,
  candidateMessage: string,
  questions: InterviewQuestion[],
  config: InterviewConfiguration = DEFAULT_INTERVIEW_CONFIG
): Promise<{ session: InterviewSession; response: string; completed: boolean }> {
  // Add candidate message to transcript
  addMessage(session, "candidate", candidateMessage);

  // Check if interview should end
  if (shouldEndInterview(session, config)) {
    const closingMessage = generateClosingMessage(session);
    addMessage(session, "interviewer", closingMessage);
    session.status = "COMPLETED";
    session.completedAt = new Date();
    session.durationMinutes = calculateDuration(session);

    console.log(
      `[Interview Engine] Completed interview ${session.id} - ${session.durationMinutes} minutes`
    );

    return { session, response: closingMessage, completed: true };
  }

  // Decide next action: follow-up or new question
  const shouldFollowUp = await shouldAskFollowUp(
    session,
    candidateMessage,
    questions[session.currentQuestionIndex]
  );

  let nextMessage: string;

  if (shouldFollowUp && config.enableFollowUps) {
    // Generate follow-up question
    nextMessage = await generateFollowUpQuestion(session, candidateMessage);
  } else {
    // Move to next question
    session.currentQuestionIndex++;
    if (session.currentQuestionIndex < questions.length) {
      const nextQuestion = questions[session.currentQuestionIndex];
      nextMessage = await generateQuestionTransition(
        session,
        nextQuestion,
        candidateMessage
      );
      session.questionsAsked.push(nextQuestion.id);
    } else {
      // No more questions
      nextMessage = generateClosingMessage(session);
      session.status = "COMPLETED";
      session.completedAt = new Date();
      session.durationMinutes = calculateDuration(session);
      return { session, response: nextMessage, completed: true };
    }
  }

  addMessage(session, "interviewer", nextMessage);

  return { session, response: nextMessage, completed: false };
}

/**
 * Determine if follow-up question is needed
 */
async function shouldAskFollowUp(
  session: InterviewSession,
  candidateResponse: string,
  currentQuestion?: InterviewQuestion
): Promise<boolean> {
  // Simple heuristics for now
  // In production, use AI to determine if response is incomplete/vague

  // Too short response (likely vague)
  if (candidateResponse.trim().split(/\s+/).length < 20) {
    return true;
  }

  // Check if current question has follow-ups defined
  if (
    currentQuestion?.followUps &&
    currentQuestion.followUps.length > 0 &&
    Math.random() > 0.6
  ) {
    // 40% chance to ask follow-up
    return true;
  }

  return false;
}

/**
 * Generate follow-up question
 */
async function generateFollowUpQuestion(
  session: InterviewSession,
  candidateResponse: string
): Promise<string> {
  // In production, use AI to generate contextual follow-ups
  /*
  const result = await generateText({
    model: openai("gpt-4-turbo"),
    system: INTERVIEWER_SYSTEM_PROMPT,
    prompt: `The candidate just answered: "${candidateResponse}"

    Generate a brief, natural follow-up question to get more details or clarity.
    Keep it conversational and friendly. One sentence only.`,
  });

  return result.text;
  */

  // Simulated follow-ups
  const followUps = [
    "That's interesting! Can you tell me more about the outcome?",
    "Thanks for sharing that. What would you do differently if you could do it again?",
    "I appreciate that example. How did this experience shape your approach going forward?",
    "Good point. Can you walk me through your specific role in that situation?",
    "That makes sense. What was the most challenging part of that for you?",
  ];

  return followUps[Math.floor(Math.random() * followUps.length)];
}

/**
 * Generate question with smooth transition
 */
async function generateQuestionTransition(
  session: InterviewSession,
  question: InterviewQuestion,
  previousResponse: string
): Promise<string> {
  // In production, use AI to generate natural transitions
  /*
  const result = await generateText({
    model: openai("gpt-4-turbo"),
    system: INTERVIEWER_SYSTEM_PROMPT,
    prompt: `The candidate just answered: "${previousResponse}"

    Now ask this next question naturally with a brief transition: "${question.question}"

    Keep it conversational and friendly. 2-3 sentences maximum.`,
  });

  return result.text;
  */

  // Simulated transitions
  const transitions = [
    `Great, thanks for that! Let me ask you about something different.`,
    `I appreciate that answer. Now I'd like to shift gears a bit.`,
    `That's helpful to know. Moving on to another topic:`,
    `Perfect. Let's talk about another aspect of your experience.`,
    `Thank you for sharing that. Here's my next question:`,
  ];

  const transition =
    transitions[Math.floor(Math.random() * transitions.length)];

  return `${transition}\n\n${question.question}`;
}

/**
 * Check if interview should end
 */
function shouldEndInterview(
  session: InterviewSession,
  config: InterviewConfiguration
): boolean {
  // Minimum questions asked
  if (session.questionsAsked.length < config.minQuestionsRequired) {
    return false;
  }

  // Maximum questions reached
  if (session.questionsAsked.length >= config.maxQuestionsAllowed) {
    return true;
  }

  // Time limit reached (if available)
  if (session.startedAt) {
    const elapsedMinutes =
      (Date.now() - session.startedAt.getTime()) / 1000 / 60;
    if (elapsedMinutes >= config.maxDurationMinutes) {
      return true;
    }
  }

  return false;
}

/**
 * Generate closing message
 */
function generateClosingMessage(session: InterviewSession): string {
  const firstName = session.candidateName.split(" ")[0];

  return `${firstName}, thank you so much for taking the time to chat with me today! I really enjoyed learning about your experience and background.

Here's what happens next:

1. **AI Evaluation** (1-2 hours): Your responses will be reviewed by our multi-AI system (GPT-4, Claude, and Gemini working together) for a comprehensive, unbiased evaluation.

2. **Skills Test** (if qualified, within 3 days): Top candidates will receive a role-specific skills assessment. This typically takes 2-3 hours and is done on your own schedule.

3. **Final Decision** (within 5 business days): We'll send you a detailed email with your results and next steps.

Questions or concerns in the meantime? Feel free to email us at recruiting@aliff.services

Thanks again, and best of luck! 🚀`;
}

/**
 * Calculate interview duration
 */
function calculateDuration(session: InterviewSession): number {
  if (!session.startedAt || !session.completedAt) return 0;
  return Math.round(
    (session.completedAt.getTime() - session.startedAt.getTime()) / 1000 / 60
  );
}

/**
 * Add message to session transcript
 */
function addMessage(
  session: InterviewSession,
  role: MessageRole,
  content: string
): void {
  const message: InterviewMessage = {
    id: nanoid(),
    role,
    content,
    timestamp: new Date(),
  };

  session.messages.push(message);
}

/**
 * Get interview transcript as formatted text
 */
export function getInterviewTranscript(session: InterviewSession): string {
  let transcript = `INTERVIEW TRANSCRIPT\n`;
  transcript += `===================\n\n`;
  transcript += `Candidate: ${session.candidateName}\n`;
  transcript += `Position: ${session.jobTitle}\n`;
  transcript += `Date: ${session.startedAt?.toISOString() || "N/A"}\n`;
  transcript += `Duration: ${session.durationMinutes || "N/A"} minutes\n\n`;
  transcript += `CONVERSATION:\n`;
  transcript += `=============\n\n`;

  for (const message of session.messages) {
    const speaker =
      message.role === "interviewer"
        ? "ALIFF"
        : message.role === "candidate"
        ? session.candidateName
        : "SYSTEM";
    const time = message.timestamp.toISOString().split("T")[1].slice(0, 5);
    transcript += `[${time}] ${speaker}:\n${message.content}\n\n`;
  }

  return transcript;
}

/**
 * Get conversation summary
 */
export function getConversationSummary(session: InterviewSession): {
  totalMessages: number;
  candidateMessages: number;
  interviewerMessages: number;
  questionsAsked: number;
  avgResponseLength: number;
} {
  const candidateMessages = session.messages.filter(
    (m) => m.role === "candidate"
  );
  const interviewerMessages = session.messages.filter(
    (m) => m.role === "interviewer"
  );

  const avgResponseLength =
    candidateMessages.length > 0
      ? Math.round(
          candidateMessages.reduce((sum, m) => sum + m.content.length, 0) /
            candidateMessages.length
        )
      : 0;

  return {
    totalMessages: session.messages.length,
    candidateMessages: candidateMessages.length,
    interviewerMessages: interviewerMessages.length,
    questionsAsked: session.questionsAsked.length,
    avgResponseLength,
  };
}

/**
 * Export interview data for evaluation
 */
export function exportForEvaluation(session: InterviewSession): {
  sessionId: string;
  candidateName: string;
  jobTitle: string;
  transcript: string;
  summary: any;
  qaExtracts: Array<{ question: string; answer: string }>;
} {
  const qaExtracts: Array<{ question: string; answer: string }> = [];

  // Extract Q&A pairs
  for (let i = 0; i < session.messages.length - 1; i++) {
    if (
      session.messages[i].role === "interviewer" &&
      session.messages[i + 1].role === "candidate"
    ) {
      // Check if it's a question (not greeting or closing)
      if (
        session.messages[i].content.includes("?") ||
        i > 0 // Not the first message (greeting)
      ) {
        qaExtracts.push({
          question: session.messages[i].content,
          answer: session.messages[i + 1].content,
        });
      }
    }
  }

  return {
    sessionId: session.id,
    candidateName: session.candidateName,
    jobTitle: session.jobTitle,
    transcript: getInterviewTranscript(session),
    summary: getConversationSummary(session),
    qaExtracts,
  };
}
