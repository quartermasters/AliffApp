/**
 * AI Interview Conductor - Conversational Mode
 *
 * Orchestrates free-flowing conversational interviews with ALIFF (recruiter)
 * - OpenAI GPT-4o: Natural conversation responses
 * - OpenAI GPT-4o: Structured data extraction + scoring
 * - Stage progression: 7 stages from Welcome to Closing
 * - Real-time data extraction from candidate responses
 */

import OpenAI from 'openai';

// Lazy initialization to avoid build-time errors
let openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });
  }
  return openai;
}

// Interview Stage Flow
export enum InterviewStage {
  WELCOME = 'WELCOME',
  AVAILABILITY = 'AVAILABILITY',
  SKILLS = 'SKILLS',
  REMOTE_WORK = 'REMOTE_WORK',
  COMPENSATION = 'COMPENSATION',
  MOTIVATION = 'MOTIVATION',
  CLOSING = 'CLOSING',
  COMPLETED = 'COMPLETED',
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ExtractedData {
  // Availability
  currentSituation?: string;
  hoursPerDay?: number;
  daysPerMonth?: number;
  preferredSchedule?: string;
  startDate?: string;

  // Skills
  skillProficiency?: Record<string, { rating: number; example: string }>;
  portfolioLinks?: string[];
  toolsComfortable?: string[];

  // Remote Work
  remoteExperience?: string;
  homeOfficeSetup?: string;
  communicationPreferences?: string;
  timezone?: string;

  // Compensation
  expectedRate?: number;
  contractorExperience?: boolean;
  rateFlexibility?: string;

  // Motivation
  motivation?: string;
  careerGoals?: string;
  workEnvironmentPreference?: string;

  // Final
  candidateQuestions?: string;
}

export interface ConversationContext {
  candidateName: string;
  jobTitle: string;
  parsedResumeData?: any;
  currentStage: InterviewStage;
  messages: Message[];
  extractedData: ExtractedData;
  stageCompletionFlags: Record<string, boolean>;
}

/**
 * Generate ALIFF's conversational response using OpenAI GPT-4o
 */
export async function generateAliffResponse(
  context: ConversationContext,
  userMessage: string
): Promise<{ response: string; newStage: InterviewStage; shouldComplete: boolean }> {
  const systemPrompt = buildSystemPrompt(context);
  const conversationHistory = buildConversationHistory(context, userMessage);

  try {
    // Use OpenAI GPT-4o instead of Claude
    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1024,
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
      ],
    });

    const aliffResponse = response.choices[0].message.content || '';

    // Determine stage progression
    const { newStage, shouldComplete } = determineStageProgression(
      context.currentStage,
      userMessage,
      aliffResponse,
      context.extractedData
    );

    return {
      response: aliffResponse,
      newStage,
      shouldComplete,
    };
  } catch (error) {
    console.error('[INTERVIEW] OpenAI API error:', error);
    throw new Error('Failed to generate response');
  }
}

/**
 * Extract structured data from candidate response using OpenAI
 */
export async function extractStructuredData(
  currentData: ExtractedData,
  stage: InterviewStage,
  userMessage: string
): Promise<Partial<ExtractedData>> {
  const extractionPrompt = buildExtractionPrompt(stage, userMessage);

  try {
    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.1,
      messages: [
        {
          role: 'system',
          content: `You are a data extraction expert. Extract structured information from candidate interview responses. Return ONLY valid JSON with the extracted fields. If a field cannot be determined, omit it.`,
        },
        {
          role: 'user',
          content: extractionPrompt,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const extracted = JSON.parse(response.choices[0].message.content || '{}');
    return extracted;
  } catch (error) {
    console.error('[INTERVIEW] OpenAI extraction error:', error);
    return {};
  }
}

/**
 * Calculate interview scores using OpenAI GPT-4o
 */
export async function calculateInterviewScores(
  messages: Message[],
  extractedData: ExtractedData,
  jobRequirements: any
): Promise<{
  openaiScore: number;
  consensusScore: number;
  breakdown: {
    communication: number;
    availability: number;
    technical: number;
    motivation: number;
  };
  strengths: string[];
  concerns: string[];
  recommendation: 'PROCEED_TO_HUMAN_REVIEW' | 'ADD_TO_TALENT_POOL' | 'REJECT';
}> {
  // Get scores from OpenAI GPT-4o
  const openaiAnalysis = await analyzeWithOpenAI(messages, extractedData, jobRequirements);

  // Use OpenAI score as final score
  const consensusScore = openaiAnalysis.overallScore;
  const breakdown = openaiAnalysis.breakdown;
  const strengths = openaiAnalysis.strengths;
  const concerns = openaiAnalysis.concerns;

  // Determine recommendation
  let recommendation: 'PROCEED_TO_HUMAN_REVIEW' | 'ADD_TO_TALENT_POOL' | 'REJECT';
  if (consensusScore >= 70) {
    recommendation = 'PROCEED_TO_HUMAN_REVIEW';
  } else if (consensusScore >= 50) {
    recommendation = 'ADD_TO_TALENT_POOL';
  } else {
    recommendation = 'REJECT';
  }

  return {
    openaiScore: openaiAnalysis.overallScore,
    consensusScore,
    breakdown,
    strengths: strengths.slice(0, 5), // Top 5
    concerns: concerns.slice(0, 3), // Top 3
    recommendation,
  };
}

/**
 * Analyze interview with OpenAI GPT-4o
 */
async function analyzeWithOpenAI(
  messages: Message[],
  extractedData: ExtractedData,
  jobRequirements: any
): Promise<{
  overallScore: number;
  breakdown: { communication: number; availability: number; technical: number; motivation: number };
  strengths: string[];
  concerns: string[];
}> {
  const analysisPrompt = `Analyze this candidate interview and provide scores.

**Interview Transcript:**
${messages.map((m) => `${m.role === 'user' ? 'Candidate' : 'ALIFF'}: ${m.content}`).join('\n\n')}

**Extracted Data:**
${JSON.stringify(extractedData, null, 2)}

**Job Requirements:**
${JSON.stringify(jobRequirements, null, 2)}

Provide scores (0-100) for: communication, availability, technical, motivation.
Identify top strengths and concerns.

Format your response as JSON with this structure:
{
  "overallScore": 85,
  "breakdown": {
    "communication": 90,
    "availability": 85,
    "technical": 80,
    "motivation": 85
  },
  "strengths": ["strength1", "strength2"],
  "concerns": ["concern1"]
}`;

  try {
    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content: 'You are an expert recruiter. Analyze interviews and return JSON scores.',
        },
        {
          role: 'user',
          content: analysisPrompt,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const analysis = JSON.parse(response.choices[0].message.content || '{}');
    return analysis;
  } catch (error) {
    console.error('[INTERVIEW] OpenAI analysis error:', error);
    return {
      overallScore: 50,
      breakdown: { communication: 50, availability: 50, technical: 50, motivation: 50 },
      strengths: [],
      concerns: ['Analysis failed'],
    };
  }
}

/**
 * Build system prompt for GPT-4o based on current stage
 */
function buildSystemPrompt(context: ConversationContext): string {
  const { candidateName, jobTitle, currentStage, extractedData } = context;
  const firstName = candidateName.split(' ')[0];

  const basePrompt = `You are a professional and friendly recruiter conducting a conversational interview with ${firstName} for the ${jobTitle} position.

**CRITICAL RULES - YOU MUST FOLLOW THESE:**
1. Keep responses SHORT (1-2 sentences max, 15-25 words ideal)
2. Ask ONLY ONE question at a time
3. Be warm and conversational (like texting a colleague)
4. Use casual language: "I'm" not "I am", "Let's" not "Let us"
5. Show enthusiasm: "Great!", "Love it!", "Perfect!"
6. Do NOT reveal you are AI
7. Do NOT ask multiple questions in one message
8. Do NOT write long paragraphs

**Your Style:**
- Think of this like a friendly WhatsApp chat
- Short bursts of text
- One question, wait for answer, then next question
- Use natural reactions: "Nice!", "Got it", "Makes sense"
- Keep it flowing and relaxed

**Current Interview Stage: ${currentStage}**

**Interview Flow:**
1. WELCOME - Ask about current work situation
2. AVAILABILITY - Hours per day, days per month, start date
3. SKILLS - Technical proficiency, examples, portfolio
4. REMOTE_WORK - Remote experience, setup, communication
5. COMPENSATION - Expected rate, contractor experience
6. MOTIVATION - Why this role, career goals
7. CLOSING - Final questions, next steps

**Stage-Specific Instructions:**`;

  const stageInstructions: Record<InterviewStage, string> = {
    WELCOME: `React warmly to their availability. Then ask ONE simple question: "How many hours per day can you work?" STOP THERE. Wait for their answer.`,

    AVAILABILITY: `You're asking about availability ONE question at a time:
- First: "How many hours per day?"
- Then: "How many days per month?"
- Then: "When can you start?"
Only ask the NEXT question after they answer the CURRENT one. Keep it SHORT and friendly.`,

    SKILLS: `Ask about their skills ONE at a time:
- First: Pick ONE key skill from their CV and ask "How would you rate yourself in [skill]?"
- Then: "Can you share an example of a recent project?"
- Then: "Got a portfolio or GitHub link?"
SHORT questions only! After 2-3 exchanges, move to REMOTE_WORK.`,

    REMOTE_WORK: `Ask about remote work setup ONE question at a time:
- First: "How much remote work experience do you have?"
- Then: "Tell me about your home office setup?"
- Then: "What's your preferred way to communicate? Slack, email, or video?"
Keep it conversational! After 2-3 exchanges, move to COMPENSATION.`,

    COMPENSATION: `Discuss money simply:
- First: "What hourly rate are you looking for?"
- Then: "You cool with contractor setup? (1099, monthly payments)"
Keep it SHORT! After they answer, move to MOTIVATION.`,

    MOTIVATION: `Understand what drives them:
- First: "What got you excited about this role?"
- Then: "Where do you see yourself in a year or two?"
SHORT and friendly! After they answer, move to CLOSING.`,

    CLOSING: `Wrap up warmly:
- First: "Got any questions for me?"
- Then explain BRIEFLY: "We'll review your interview, email you within 24h, then team review in 3-5 days."
- End with: "Thanks so much, [Name]! Best of luck 😊"
After this, mark interview as COMPLETED.`,

    COMPLETED: `Interview complete. Should not reach here.`,
  };

  // Context about what's been covered
  const conversationContext = context.messages.length > 1
    ? `\n\n**IMPORTANT - Conversation So Far:**\nYou've already asked ${context.messages.length / 2} questions. Review the conversation above. DO NOT repeat questions you've already asked! Move forward to the NEXT question in the stage.`
    : '';

  const dataContext =
    Object.keys(extractedData).length > 0
      ? `\n\n**Data Already Collected:**\n${JSON.stringify(extractedData, null, 2)}\n\nDon't re-ask questions you've already covered.`
      : '';

  // Recruiter style adaptation
  const styleContext = context.parsedResumeData?.assignedRecruiter?.style
    ? `\n\n**Your Communication Style:** ${context.parsedResumeData.assignedRecruiter.style} - ${getStyleGuidance(context.parsedResumeData.assignedRecruiter.style)}`
    : '';

  return basePrompt + '\n\n' + stageInstructions[currentStage] + conversationContext + dataContext + styleContext;
}

/**
 * Get style-specific guidance for recruiter persona
 */
function getStyleGuidance(style: string): string {
  const styleGuides: Record<string, string> = {
    casual_friendly: 'Use "Hey", "Awesome!", be warm and approachable',
    enthusiastic: 'High energy! Use "!", show excitement, quick and upbeat',
    professional_concise: 'Keep it brief, direct, respectful. No fluff.',
    relatable_authentic: 'Talk like a real person. No corporate speak. Be genuine.',
  };
  return styleGuides[style] || 'Be professional and friendly';
}

/**
 * Build conversation history for Claude API
 */
function buildConversationHistory(
  context: ConversationContext,
  newUserMessage: string
): Array<{ role: 'user' | 'assistant'; content: string }> {
  const history: Array<{ role: 'user' | 'assistant'; content: string }> = [];

  // Add previous messages (skip the initial welcome since it's in messages array already)
  context.messages.slice(1).forEach((msg) => {
    history.push({
      role: msg.role,
      content: msg.content,
    });
  });

  // Add new user message
  history.push({
    role: 'user',
    content: newUserMessage,
  });

  return history;
}

/**
 * Build extraction prompt for OpenAI
 */
function buildExtractionPrompt(stage: InterviewStage, userMessage: string): string {
  const extractionGuides: Record<InterviewStage, string> = {
    WELCOME: `Extract: currentSituation (text description of their work status)`,
    AVAILABILITY: `Extract: hoursPerDay (number), daysPerMonth (number), preferredSchedule (text), startDate (ISO date string or text)`,
    SKILLS: `Extract: skillProficiency (object with skill names as keys, each containing {rating: number, example: string}), portfolioLinks (array of URLs), toolsComfortable (array of tool names)`,
    REMOTE_WORK: `Extract: remoteExperience (text), homeOfficeSetup (text), communicationPreferences (text), timezone (text)`,
    COMPENSATION: `Extract: expectedRate (number), contractorExperience (boolean), rateFlexibility (text)`,
    MOTIVATION: `Extract: motivation (text), careerGoals (text), workEnvironmentPreference (text)`,
    CLOSING: `Extract: candidateQuestions (text)`,
    COMPLETED: `No extraction needed.`,
  };

  return `Interview Stage: ${stage}

Candidate Response:
"${userMessage}"

${extractionGuides[stage]}

Return extracted data as JSON. Example:
{"hoursPerDay": 8, "daysPerMonth": 20, "startDate": "2025-02-01"}`;
}

/**
 * Determine stage progression logic
 */
function determineStageProgression(
  currentStage: InterviewStage,
  userMessage: string,
  aliffResponse: string,
  extractedData: ExtractedData
): { newStage: InterviewStage; shouldComplete: boolean } {
  // Stage order
  const stageOrder: InterviewStage[] = [
    InterviewStage.WELCOME,
    InterviewStage.AVAILABILITY,
    InterviewStage.SKILLS,
    InterviewStage.REMOTE_WORK,
    InterviewStage.COMPENSATION,
    InterviewStage.MOTIVATION,
    InterviewStage.CLOSING,
    InterviewStage.COMPLETED,
  ];

  // Check if ALIFF's response indicates stage transition (simple heuristic)
  const transitionIndicators = [
    'let me ask',
    "let's talk about",
    "let's discuss",
    'moving on',
    'next',
    'thanks for sharing',
    'perfect',
    'great',
  ];

  const responseHasTransition = transitionIndicators.some((indicator) =>
    aliffResponse.toLowerCase().includes(indicator)
  );

  // Check if current stage has sufficient data
  const stageDataComplete: Record<InterviewStage, boolean> = {
    WELCOME: !!extractedData.currentSituation,
    AVAILABILITY: !!(extractedData.hoursPerDay && extractedData.daysPerMonth),
    SKILLS: !!extractedData.skillProficiency && Object.keys(extractedData.skillProficiency || {}).length > 0,
    REMOTE_WORK: !!extractedData.remoteExperience,
    COMPENSATION: extractedData.expectedRate !== undefined,
    MOTIVATION: !!extractedData.motivation,
    CLOSING: true, // Always complete after asking questions
    COMPLETED: true,
  };

  const currentIndex = stageOrder.indexOf(currentStage);
  const isCurrentStageComplete = stageDataComplete[currentStage];

  // Progress to next stage if response indicates transition AND we have some data
  if ((responseHasTransition || isCurrentStageComplete) && currentIndex < stageOrder.length - 1) {
    const newStage = stageOrder[currentIndex + 1];
    return {
      newStage,
      shouldComplete: newStage === InterviewStage.COMPLETED,
    };
  }

  // Check if we're in CLOSING stage and response contains farewell
  if (currentStage === InterviewStage.CLOSING) {
    const farewellIndicators = ['best of luck', 'good luck', 'thank you', "we'll be in touch"];
    const hasFarewell = farewellIndicators.some((indicator) =>
      aliffResponse.toLowerCase().includes(indicator)
    );

    if (hasFarewell) {
      return {
        newStage: InterviewStage.COMPLETED,
        shouldComplete: true,
      };
    }
  }

  return {
    newStage: currentStage,
    shouldComplete: false,
  };
}
