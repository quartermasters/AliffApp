/**
 * AI Interview Conductor
 *
 * Orchestrates the adaptive interview flow:
 * - Selects appropriate questions based on role and responses
 * - Evaluates candidate answers in real-time
 * - Adapts difficulty and follow-ups based on performance
 * - Maintains conversation context
 * - Generates final scores and feedback
 */

import OpenAI from 'openai';
import {
  InterviewQuestion,
  getBalancedQuestionSet,
  selectNextQuestion,
  RoleType,
} from './interview-questions';

// Lazy initialization to avoid build-time errors
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

export interface InterviewMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  questionId?: string;
  score?: number;
}

export interface InterviewState {
  applicationId: string;
  candidateName: string;
  jobTitle: string;
  roleType: RoleType;
  startTime: Date;
  currentQuestionIndex: number;
  questions: InterviewQuestion[];
  answers: Array<{
    questionId: string;
    question: string;
    answer: string;
    score: number;
    evaluation: string;
    redFlags: string[];
  }>;
  messages: InterviewMessage[];
  currentScore: number;
  isComplete: boolean;
}

/**
 * Initialize a new interview session
 */
export async function initializeInterview(
  applicationId: string,
  candidateName: string,
  jobTitle: string,
  roleType: RoleType = 'GENERAL'
): Promise<InterviewState> {
  // Get balanced question set for 15-minute interview
  const questions = getBalancedQuestionSet(roleType, 15);

  const welcomeMessage: InterviewMessage = {
    role: 'assistant',
    content: `Hello ${candidateName}! I'm ALIFF, your AI interviewer for the ${jobTitle} position. I'll be asking you a series of questions to better understand your experience and fit for this role. This interview will take approximately 15 minutes. Let's begin!`,
    timestamp: new Date(),
  };

  return {
    applicationId,
    candidateName,
    jobTitle,
    roleType,
    startTime: new Date(),
    currentQuestionIndex: 0,
    questions,
    answers: [],
    messages: [welcomeMessage],
    currentScore: 0,
    isComplete: false,
  };
}

/**
 * Evaluate a candidate's answer using GPT-4
 */
async function evaluateAnswer(
  question: InterviewQuestion,
  answer: string,
  context: string
): Promise<{
  score: number;
  evaluation: string;
  redFlags: string[];
  strengths: string[];
}> {
  const systemPrompt = `You are an expert interview evaluator. Evaluate candidate answers objectively and fairly.

Scoring Guidelines:
- 90-100: Excellent answer with specific examples, demonstrates deep understanding
- 75-89: Good answer with relevant experience, shows competence
- 60-74: Adequate answer but lacks depth or specifics
- 40-59: Weak answer with vague responses or missing key points
- 0-39: Poor answer showing lack of understanding or experience

Return your evaluation as JSON with:
{
  "score": 0-100,
  "evaluation": "detailed evaluation explaining the score",
  "redFlags": ["list of concerning points"],
  "strengths": ["list of strong points"]
}`;

  const userPrompt = `Evaluate this interview answer:

QUESTION: ${question.question}
CATEGORY: ${question.category}
DIFFICULTY: ${question.difficulty}

EVALUATION CRITERIA:
${question.evaluationCriteria.join('\n')}

RED FLAGS TO WATCH FOR:
${question.redFlags.join('\n')}

IDEAL ANSWER SHOULD INCLUDE:
${question.idealAnswerPoints.join('\n')}

CANDIDATE'S ANSWER:
${answer}

INTERVIEW CONTEXT:
${context}

Provide a fair, objective evaluation.`;

  try {
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No evaluation received from GPT-4');
    }

    const evaluation = JSON.parse(content);

    console.log('[INTERVIEW] Answer evaluated:', {
      score: evaluation.score,
      redFlags: evaluation.redFlags?.length || 0,
    });

    return {
      score: evaluation.score || 50,
      evaluation: evaluation.evaluation || 'Unable to evaluate answer',
      redFlags: evaluation.redFlags || [],
      strengths: evaluation.strengths || [],
    };
  } catch (error) {
    console.error('[INTERVIEW] Evaluation error:', error);
    // Fallback evaluation
    return {
      score: 60,
      evaluation: 'Answer acknowledged',
      redFlags: [],
      strengths: [],
    };
  }
}

/**
 * Generate follow-up question or next question
 */
async function generateNextQuestion(
  state: InterviewState,
  lastAnswer: string
): Promise<{ question: string; questionId?: string; isFollowUp: boolean }> {
  const currentQuestion = state.questions[state.currentQuestionIndex];
  const lastEvaluation = state.answers[state.answers.length - 1];

  // Check if we should ask a follow-up
  const shouldFollowUp =
    currentQuestion.followUpQuestions.length > 0 &&
    lastEvaluation?.score >= 60 && // Only follow up if answer was decent
    state.answers.filter((a) => a.questionId === currentQuestion.id).length === 1; // First answer to this question

  if (shouldFollowUp) {
    // Select appropriate follow-up
    const followUpIndex = Math.min(
      state.answers.filter((a) => a.questionId === currentQuestion.id).length - 1,
      currentQuestion.followUpQuestions.length - 1
    );

    return {
      question: currentQuestion.followUpQuestions[followUpIndex],
      questionId: currentQuestion.id,
      isFollowUp: true,
    };
  }

  // Move to next question
  state.currentQuestionIndex++;

  if (state.currentQuestionIndex >= state.questions.length) {
    // Interview complete
    return {
      question: `Thank you for completing the interview! Your responses have been recorded and will be reviewed by our team. You'll receive feedback within 24-48 hours. Is there anything else you'd like to share before we conclude?`,
      isFollowUp: false,
    };
  }

  // Adaptive question selection based on performance
  const avgScore = state.answers.reduce((sum, a) => sum + a.score, 0) / state.answers.length;
  const timeElapsed = (Date.now() - state.startTime.getTime()) / 1000;
  const timeRemaining = 15 * 60 - timeElapsed; // 15 minutes total

  const nextQuestion = selectNextQuestion(
    state.roleType,
    state.answers.map((a) => ({ questionId: a.questionId, score: a.score })),
    timeRemaining / 60 // convert to minutes
  );

  if (nextQuestion) {
    return {
      question: nextQuestion.question,
      questionId: nextQuestion.id,
      isFollowUp: false,
    };
  }

  // Fallback to sequential question
  const fallbackQuestion = state.questions[state.currentQuestionIndex];
  return {
    question: fallbackQuestion.question,
    questionId: fallbackQuestion.id,
    isFollowUp: false,
  };
}

/**
 * Process candidate response and generate next message
 */
export async function processResponse(
  state: InterviewState,
  userMessage: string
): Promise<{
  state: InterviewState;
  nextMessage: string;
  questionId?: string;
  isComplete: boolean;
  currentScore: number;
}> {
  // Add user message to state
  const userMsg: InterviewMessage = {
    role: 'user',
    content: userMessage,
    timestamp: new Date(),
  };
  state.messages.push(userMsg);

  // Handle initial "ready to begin" response
  if (state.answers.length === 0 && userMessage.toLowerCase().includes('ready')) {
    const firstQuestion = state.questions[0];
    const assistantMsg: InterviewMessage = {
      role: 'assistant',
      content: `Great! Let's start with the first question:\n\n${firstQuestion.question}`,
      timestamp: new Date(),
      questionId: firstQuestion.id,
    };
    state.messages.push(assistantMsg);

    return {
      state,
      nextMessage: assistantMsg.content,
      questionId: firstQuestion.id,
      isComplete: false,
      currentScore: 0,
    };
  }

  // Handle initial "ready" check - first question already asked
  if (state.answers.length === 0) {
    const firstQuestion = state.questions[0];
    // Evaluate this first answer
    const context = `First question of the interview for ${state.jobTitle} position.`;
    const evaluation = await evaluateAnswer(firstQuestion, userMessage, context);

    state.answers.push({
      questionId: firstQuestion.id,
      question: firstQuestion.question,
      answer: userMessage,
      score: evaluation.score,
      evaluation: evaluation.evaluation,
      redFlags: evaluation.redFlags,
    });

    // Calculate current score
    state.currentScore = Math.round(
      state.answers.reduce((sum, a) => sum + a.score, 0) / state.answers.length
    );

    // Get next question
    const next = await generateNextQuestion(state, userMessage);

    const assistantMsg: InterviewMessage = {
      role: 'assistant',
      content: next.question,
      timestamp: new Date(),
      questionId: next.questionId,
      score: evaluation.score,
    };
    state.messages.push(assistantMsg);

    return {
      state,
      nextMessage: next.question,
      questionId: next.questionId,
      isComplete: false,
      currentScore: state.currentScore,
    };
  }

  // Evaluate current answer
  const currentQuestion = state.questions[state.currentQuestionIndex];
  const context = `Interview progress: ${state.answers.length} questions answered. Current score: ${state.currentScore}/100`;

  const evaluation = await evaluateAnswer(currentQuestion, userMessage, context);

  state.answers.push({
    questionId: currentQuestion.id,
    question: currentQuestion.question,
    answer: userMessage,
    score: evaluation.score,
    evaluation: evaluation.evaluation,
    redFlags: evaluation.redFlags,
  });

  // Update current score
  state.currentScore = Math.round(
    state.answers.reduce((sum, a) => sum + a.score, 0) / state.answers.length
  );

  // Check if interview should end
  const timeElapsed = (Date.now() - state.startTime.getTime()) / 1000 / 60; // minutes
  const shouldEnd =
    timeElapsed >= 15 ||
    state.currentQuestionIndex >= state.questions.length ||
    userMessage.toLowerCase().includes('conclude') ||
    userMessage.toLowerCase().includes('finish');

  if (shouldEnd) {
    state.isComplete = true;

    const finalMessage = `Thank you for completing the interview, ${state.candidateName}!

Your final score is ${state.currentScore}/100.

${
  state.currentScore >= 80
    ? "Excellent performance! We're impressed with your responses and look forward to the next steps."
    : state.currentScore >= 60
    ? 'Good interview! Your responses show promise. Our team will review your application and be in touch soon.'
    : 'Thank you for your time. While this role may not be the perfect fit, we will keep your profile in our talent pool for future opportunities.'
}

You'll receive detailed feedback via email within 24-48 hours. Have a great day!`;

    const assistantMsg: InterviewMessage = {
      role: 'assistant',
      content: finalMessage,
      timestamp: new Date(),
    };
    state.messages.push(assistantMsg);

    return {
      state,
      nextMessage: finalMessage,
      isComplete: true,
      currentScore: state.currentScore,
    };
  }

  // Get next question
  const next = await generateNextQuestion(state, userMessage);

  // Add brief acknowledgment before next question
  const acknowledgment =
    evaluation.score >= 80
      ? 'Excellent answer! '
      : evaluation.score >= 60
      ? 'Thank you for sharing that. '
      : 'I appreciate your response. ';

  const fullResponse = next.isFollowUp
    ? `${acknowledgment}Let me ask a follow-up: ${next.question}`
    : `${acknowledgment}Next question:\n\n${next.question}`;

  const assistantMsg: InterviewMessage = {
    role: 'assistant',
    content: fullResponse,
    timestamp: new Date(),
    questionId: next.questionId,
    score: evaluation.score,
  };
  state.messages.push(assistantMsg);

  return {
    state,
    nextMessage: fullResponse,
    questionId: next.questionId,
    isComplete: false,
    currentScore: state.currentScore,
  };
}

/**
 * Generate final interview report
 */
export function generateInterviewReport(state: InterviewState): {
  finalScore: number;
  summary: string;
  strengths: string[];
  areasForImprovement: string[];
  recommendation: string;
} {
  const finalScore = state.currentScore;

  // Identify strengths (questions scored >= 80)
  const strengths = state.answers
    .filter((a) => a.score >= 80)
    .map((a) => `Strong performance on: ${a.question.substring(0, 60)}...`);

  // Identify areas for improvement (questions scored < 60)
  const areasForImprovement = state.answers
    .filter((a) => a.score < 60)
    .map((a) => `Could improve on: ${a.question.substring(0, 60)}...`);

  // Collect all red flags
  const allRedFlags = state.answers.flatMap((a) => a.redFlags);

  // Generate recommendation
  let recommendation: string;
  if (finalScore >= 80 && allRedFlags.length === 0) {
    recommendation = 'STRONG HIRE - Recommend proceeding to next interview stage';
  } else if (finalScore >= 70 && allRedFlags.length <= 1) {
    recommendation = 'HIRE - Good candidate, recommend human interview';
  } else if (finalScore >= 60) {
    recommendation = 'MAYBE - Mixed performance, requires human review';
  } else {
    recommendation = 'NO HIRE - Consider for CV bank and future opportunities';
  }

  const summary = `Interview completed with ${state.answers.length} questions answered.
Final score: ${finalScore}/100.
${allRedFlags.length > 0 ? `Red flags identified: ${allRedFlags.length}` : 'No major red flags identified.'}
Time taken: ${Math.round((Date.now() - state.startTime.getTime()) / 1000 / 60)} minutes.`;

  return {
    finalScore,
    summary,
    strengths,
    areasForImprovement,
    recommendation,
  };
}
