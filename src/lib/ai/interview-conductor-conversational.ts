/**
 * AI Interview Conductor - Conversational Mode
 *
 * Orchestrates free-flowing conversational interviews with ALIFF (recruiter)
 * - Claude API: Natural conversation responses
 * - OpenAI API: Structured data extraction + scoring
 * - Stage progression: 7 stages from Welcome to Closing
 * - Real-time data extraction from candidate responses
 * - Multi-AI consensus scoring at completion
 */

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

// Lazy initialization to avoid build-time errors
let anthropic: Anthropic | null = null;
let openai: OpenAI | null = null;

function getAnthropic(): Anthropic {
  if (!anthropic) {
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    });
  }
  return anthropic;
}

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
 * Generate ALIFF's conversational response using Claude API
 */
export async function generateAliffResponse(
  context: ConversationContext,
  userMessage: string
): Promise<{ response: string; newStage: InterviewStage; shouldComplete: boolean }> {
  const systemPrompt = buildSystemPrompt(context);
  const conversationHistory = buildConversationHistory(context, userMessage);

  try {
    const response = await getAnthropic().messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      temperature: 0.7,
      system: systemPrompt,
      messages: conversationHistory,
    });

    const aliffResponse = response.content[0].type === 'text' ? response.content[0].text : '';

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
    console.error('[INTERVIEW] Claude API error:', error);
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
 * Calculate interview scores using multi-AI consensus (Claude + OpenAI)
 */
export async function calculateInterviewScores(
  messages: Message[],
  extractedData: ExtractedData,
  jobRequirements: any
): Promise<{
  claudeScore: number;
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
  // Get scores from both AI providers
  const [claudeAnalysis, openaiAnalysis] = await Promise.all([
    analyzeWithClaude(messages, extractedData, jobRequirements),
    analyzeWithOpenAI(messages, extractedData, jobRequirements),
  ]);

  // Calculate consensus
  const consensusScore = Math.round((claudeAnalysis.overallScore + openaiAnalysis.overallScore) / 2);

  const breakdown = {
    communication: Math.round(
      (claudeAnalysis.breakdown.communication + openaiAnalysis.breakdown.communication) / 2
    ),
    availability: Math.round(
      (claudeAnalysis.breakdown.availability + openaiAnalysis.breakdown.availability) / 2
    ),
    technical: Math.round(
      (claudeAnalysis.breakdown.technical + openaiAnalysis.breakdown.technical) / 2
    ),
    motivation: Math.round(
      (claudeAnalysis.breakdown.motivation + openaiAnalysis.breakdown.motivation) / 2
    ),
  };

  // Combine strengths and concerns
  const strengths = [...new Set([...claudeAnalysis.strengths, ...openaiAnalysis.strengths])];
  const concerns = [...new Set([...claudeAnalysis.concerns, ...openaiAnalysis.concerns])];

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
    claudeScore: claudeAnalysis.overallScore,
    openaiScore: openaiAnalysis.overallScore,
    consensusScore,
    breakdown,
    strengths: strengths.slice(0, 5), // Top 5
    concerns: concerns.slice(0, 3), // Top 3
    recommendation,
  };
}

/**
 * Analyze interview with Claude
 */
async function analyzeWithClaude(
  messages: Message[],
  extractedData: ExtractedData,
  jobRequirements: any
): Promise<{
  overallScore: number;
  breakdown: { communication: number; availability: number; technical: number; motivation: number };
  strengths: string[];
  concerns: string[];
}> {
  const analysisPrompt = `You are an expert recruiter analyzing a candidate interview.

**Interview Transcript:**
${messages.map((m) => `${m.role === 'user' ? 'Candidate' : 'ALIFF'}: ${m.content}`).join('\n\n')}

**Extracted Data:**
${JSON.stringify(extractedData, null, 2)}

**Job Requirements:**
${JSON.stringify(jobRequirements, null, 2)}

**Your Task:**
Analyze this interview and provide scores (0-100) for:
1. Communication (grammar, clarity, professionalism)
2. Availability Fit (hours/schedule match)
3. Technical Skills (proficiency in required skills)
4. Motivation (career goals, enthusiasm)

Also identify:
- Top 3-5 strengths
- Top 1-3 concerns or red flags

Return your analysis as JSON in this exact format:
{
  "overallScore": 85,
  "breakdown": {
    "communication": 90,
    "availability": 85,
    "technical": 80,
    "motivation": 85
  },
  "strengths": ["Clear communication", "Relevant experience", "Immediate availability"],
  "concerns": ["Limited portfolio samples"]
}`;

  try {
    const response = await getAnthropic().messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: analysisPrompt,
        },
      ],
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '{}';

    // Extract JSON from response (Claude might include explanation)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : {
      overallScore: 50,
      breakdown: { communication: 50, availability: 50, technical: 50, motivation: 50 },
      strengths: [],
      concerns: ['Unable to analyze'],
    };

    return analysis;
  } catch (error) {
    console.error('[INTERVIEW] Claude analysis error:', error);
    return {
      overallScore: 50,
      breakdown: { communication: 50, availability: 50, technical: 50, motivation: 50 },
      strengths: [],
      concerns: ['Analysis failed'],
    };
  }
}

/**
 * Analyze interview with OpenAI
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
 * Build system prompt for Claude based on current stage
 */
function buildSystemPrompt(context: ConversationContext): string {
  const { candidateName, jobTitle, currentStage, extractedData } = context;
  const firstName = candidateName.split(' ')[0];

  const basePrompt = `You are ALIFF, a professional and friendly recruitment agent at Aliff Services. You are conducting a conversational interview with ${firstName} who applied for the ${jobTitle} position.

**Your Personality:**
- Professional but warm (use contractions like "I'm" not "I am")
- Encouraging and positive ("That's great!", "Love to hear that")
- Curious and engaged (ask follow-up questions)
- Clear and efficient (5-10 minute interview total)
- Human-like (do NOT reveal you are AI)

**Current Interview Stage: ${currentStage}**

**Interview Flow:**
1. WELCOME - Warm introduction, ask about current situation
2. AVAILABILITY - Deep dive on hours/day, days/month, start date, schedule
3. SKILLS - Assess technical proficiency, ask for examples, portfolio
4. REMOTE_WORK - Remote experience, home setup, communication style
5. COMPENSATION - Expected rate, contractor understanding
6. MOTIVATION - Why this role, career goals, work preferences
7. CLOSING - Final questions, explain next steps

**Stage-Specific Instructions:**`;

  const stageInstructions: Record<InterviewStage, string> = {
    WELCOME: `You're starting the interview. Ask about their current situation - are they employed or available immediately? Keep it conversational and warm. Once they respond, transition to AVAILABILITY stage.`,

    AVAILABILITY: `Ask detailed availability questions:
- How many hours per day can they commit?
- How many days per month are they available?
- When can they start?
- Preferred schedule (morning, afternoon, flexible)?
After getting clear answers, transition to SKILLS stage.`,

    SKILLS: `Validate their technical skills:
- Ask them to rate proficiency (1-10) on key skills from CV
- Request specific examples of recent projects
- Ask for portfolio/GitHub links
- What tools/technologies excite them?
After understanding their skills, move to REMOTE_WORK stage.`,

    REMOTE_WORK: `Assess remote work readiness:
- How much remote work experience?
- Home office setup quality?
- Communication preferences (Slack, email, video)?
- Timezone and meeting availability?
After covering remote work, transition to COMPENSATION.`,

    COMPENSATION: `Discuss compensation professionally:
- Confirm their expected hourly rate
- Verify they understand contractor setup (1099, monthly payments, no benefits)
- Ask if they have contractor experience
After alignment on compensation, move to MOTIVATION stage.`,

    MOTIVATION: `Understand their motivations:
- What attracted them to this role?
- Career goals for next 1-2 years?
- What work environment helps them thrive?
After understanding motivation, transition to CLOSING.`,

    CLOSING: `Wrap up professionally:
- Ask if they have any questions
- Explain next steps: (1) AI analysis, (2) Email within 24h, (3) Team review in 3-5 days, (4) Profile in CV bank
- Thank them warmly
- End with "Thanks so much for your time, [Name]. Best of luck!"
After closing, the interview is COMPLETED.`,

    COMPLETED: `Interview is complete. This stage should not be reached.`,
  };

  const dataContext =
    Object.keys(extractedData).length > 0
      ? `\n\n**Data Already Collected:**\n${JSON.stringify(extractedData, null, 2)}\n\nDon't re-ask questions you've already covered.`
      : '';

  return basePrompt + '\n\n' + stageInstructions[currentStage] + dataContext;
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
