/**
 * Multi-AI Evaluation System
 *
 * Uses multiple AI models (GPT-4, Claude, Gemini) to evaluate candidates
 * Generates consensus scores and reduces bias
 */

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Lazy initialization to avoid build-time errors
let openaiClient: OpenAI | null = null;
let anthropicClient: Anthropic | null = null;
let geminiClient: GoogleGenerativeAI | null = null;

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

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set');
    }
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropicClient;
}

function getGeminiClient(): GoogleGenerativeAI {
  if (!geminiClient) {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY environment variable is not set');
    }
    geminiClient = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  }
  return geminiClient;
}

export interface CandidateEvaluation {
  applicationId: string;
  candidateName: string;
  jobTitle: string;
  resumeData: any;
  interviewTranscript: any;
  fitScore: number;
}

export interface AIEvaluation {
  model: 'gpt4' | 'claude' | 'gemini';
  score: number; // 0-100
  reasoning: string;
  strengths: string[];
  weaknesses: string[];
  redFlags: string[];
  recommendation: 'STRONG_HIRE' | 'HIRE' | 'MAYBE' | 'NO_HIRE';
  confidence: number; // 0-100
}

export interface ConsensusEvaluation {
  gpt4: AIEvaluation;
  claude: AIEvaluation;
  gemini: AIEvaluation;
  consensusScore: number;
  consensusRecommendation: string;
  agreementLevel: number; // 0-100 (how much the AIs agree)
  finalDecision: 'STRONG_HIRE' | 'HIRE' | 'MAYBE' | 'NO_HIRE';
  combinedStrengths: string[];
  combinedWeaknesses: string[];
  criticalRedFlags: string[];
}

/**
 * Evaluate with GPT-4
 */
async function evaluateWithGPT4(data: CandidateEvaluation): Promise<AIEvaluation> {
  const prompt = buildEvaluationPrompt(data);

  try {
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are an expert hiring manager evaluating candidates. Provide objective, unbiased assessments based on skills, experience, and interview performance. Return evaluations as JSON.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from GPT-4');
    }

    const evaluation = JSON.parse(content);

    return {
      model: 'gpt4',
      score: evaluation.score || 50,
      reasoning: evaluation.reasoning || '',
      strengths: evaluation.strengths || [],
      weaknesses: evaluation.weaknesses || [],
      redFlags: evaluation.redFlags || [],
      recommendation: evaluation.recommendation || 'MAYBE',
      confidence: evaluation.confidence || 70,
    };
  } catch (error) {
    console.error('[EVAL] GPT-4 evaluation error:', error);
    return getFallbackEvaluation('gpt4');
  }
}

/**
 * Evaluate with Claude
 */
async function evaluateWithClaude(data: CandidateEvaluation): Promise<AIEvaluation> {
  const prompt = buildEvaluationPrompt(data);

  try {
    const anthropic = getAnthropicClient();
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: `You are an expert hiring manager. ${prompt}\n\nReturn your evaluation as valid JSON only, no other text.`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    const evaluation = JSON.parse(content.text);

    return {
      model: 'claude',
      score: evaluation.score || 50,
      reasoning: evaluation.reasoning || '',
      strengths: evaluation.strengths || [],
      weaknesses: evaluation.weaknesses || [],
      redFlags: evaluation.redFlags || [],
      recommendation: evaluation.recommendation || 'MAYBE',
      confidence: evaluation.confidence || 70,
    };
  } catch (error) {
    console.error('[EVAL] Claude evaluation error:', error);
    return getFallbackEvaluation('claude');
  }
}

/**
 * Evaluate with Gemini
 */
async function evaluateWithGemini(data: CandidateEvaluation): Promise<AIEvaluation> {
  const prompt = buildEvaluationPrompt(data);

  try {
    const gemini = getGeminiClient();
    const model = gemini.getGenerativeModel({ model: 'gemini-pro' });

    const result = await model.generateContent([
      `You are an expert hiring manager. ${prompt}\n\nReturn your evaluation as valid JSON only, no other text.`,
    ]);

    const response = await result.response;
    const text = response.text();

    // Extract JSON from response (Gemini sometimes wraps it)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in Gemini response');
    }

    const evaluation = JSON.parse(jsonMatch[0]);

    return {
      model: 'gemini',
      score: evaluation.score || 50,
      reasoning: evaluation.reasoning || '',
      strengths: evaluation.strengths || [],
      weaknesses: evaluation.weaknesses || [],
      redFlags: evaluation.redFlags || [],
      recommendation: evaluation.recommendation || 'MAYBE',
      confidence: evaluation.confidence || 70,
    };
  } catch (error) {
    console.error('[EVAL] Gemini evaluation error:', error);
    return getFallbackEvaluation('gemini');
  }
}

/**
 * Build evaluation prompt
 */
function buildEvaluationPrompt(data: CandidateEvaluation): string {
  return `Evaluate this candidate for the ${data.jobTitle} position.

CANDIDATE: ${data.candidateName}

RESUME SUMMARY:
- Years of Experience: ${data.resumeData?.totalYearsExperience || 'Unknown'}
- Current Role: ${data.resumeData?.currentJobTitle || 'Unknown'}
- Skills: ${data.resumeData?.skills?.technical?.join(', ') || 'Not specified'}
- Education: ${data.resumeData?.education?.[0]?.degree || 'Not specified'}

INTERVIEW PERFORMANCE:
- Score: ${data.interviewTranscript?.report?.finalScore || 'Not available'}
- Questions Answered: ${data.interviewTranscript?.answers?.length || 0}
- Strengths: ${data.interviewTranscript?.report?.strengths?.join(', ') || 'None noted'}
- Areas for Improvement: ${data.interviewTranscript?.report?.areasForImprovement?.join(', ') || 'None noted'}

FIT SCORE: ${data.fitScore}/100

Provide a comprehensive evaluation in the following JSON format:
{
  "score": 0-100,
  "reasoning": "detailed explanation of your assessment",
  "strengths": ["list of key strengths"],
  "weaknesses": ["list of key weaknesses"],
  "redFlags": ["list of any concerning issues"],
  "recommendation": "STRONG_HIRE" | "HIRE" | "MAYBE" | "NO_HIRE",
  "confidence": 0-100 (how confident you are in this assessment)
}

Consider:
1. Technical skills match
2. Experience level appropriateness
3. Interview performance
4. Cultural fit indicators
5. Growth potential
6. Any red flags or concerns`;
}

/**
 * Fallback evaluation if AI call fails
 */
function getFallbackEvaluation(model: 'gpt4' | 'claude' | 'gemini'): AIEvaluation {
  return {
    model,
    score: 60,
    reasoning: 'Evaluation unavailable - using baseline score',
    strengths: [],
    weaknesses: [],
    redFlags: [],
    recommendation: 'MAYBE',
    confidence: 30,
  };
}

/**
 * Calculate consensus from multiple AI evaluations
 */
function calculateConsensus(
  gpt4: AIEvaluation,
  claude: AIEvaluation,
  gemini: AIEvaluation
): ConsensusEvaluation {
  // Calculate weighted consensus score
  // GPT-4: 40%, Claude: 35%, Gemini: 25%
  const consensusScore = Math.round(
    gpt4.score * 0.4 + claude.score * 0.35 + gemini.score * 0.25
  );

  // Calculate agreement level (how similar the scores are)
  const scores = [gpt4.score, claude.score, gemini.score];
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance =
    scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);
  const agreementLevel = Math.max(0, Math.round(100 - stdDev * 2)); // Lower std dev = higher agreement

  // Combine all strengths (deduplicated)
  const combinedStrengths = [
    ...new Set([...gpt4.strengths, ...claude.strengths, ...gemini.strengths]),
  ];

  // Combine all weaknesses (deduplicated)
  const combinedWeaknesses = [
    ...new Set([...gpt4.weaknesses, ...claude.weaknesses, ...gemini.weaknesses]),
  ];

  // Critical red flags (mentioned by 2+ AIs)
  const allRedFlags = [...gpt4.redFlags, ...claude.redFlags, ...gemini.redFlags];
  const redFlagCounts = allRedFlags.reduce((acc, flag) => {
    acc[flag] = (acc[flag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const criticalRedFlags = Object.entries(redFlagCounts)
    .filter(([_, count]) => count >= 2)
    .map(([flag, _]) => flag);

  // Determine final decision based on consensus
  let finalDecision: 'STRONG_HIRE' | 'HIRE' | 'MAYBE' | 'NO_HIRE';
  if (consensusScore >= 85 && criticalRedFlags.length === 0) {
    finalDecision = 'STRONG_HIRE';
  } else if (consensusScore >= 70 && criticalRedFlags.length <= 1) {
    finalDecision = 'HIRE';
  } else if (consensusScore >= 55) {
    finalDecision = 'MAYBE';
  } else {
    finalDecision = 'NO_HIRE';
  }

  // Generate consensus recommendation
  const consensusRecommendation = `Based on multi-AI evaluation:
- Consensus Score: ${consensusScore}/100
- Agreement Level: ${agreementLevel}%
- Final Decision: ${finalDecision}

${
  agreementLevel < 70
    ? '⚠️ Note: Low agreement among AI models - human review recommended'
    : '✓ High agreement among AI models'
}

${criticalRedFlags.length > 0 ? `🚩 Critical Red Flags: ${criticalRedFlags.join(', ')}` : ''}`;

  return {
    gpt4,
    claude,
    gemini,
    consensusScore,
    consensusRecommendation,
    agreementLevel,
    finalDecision,
    combinedStrengths,
    combinedWeaknesses,
    criticalRedFlags,
  };
}

/**
 * Main function: Evaluate candidate with all three AI models
 */
export async function evaluateWithMultipleAIs(
  data: CandidateEvaluation
): Promise<ConsensusEvaluation> {
  console.log(`[MULTI-AI] Starting evaluation for ${data.candidateName}`);

  // Run all evaluations in parallel
  const [gpt4Eval, claudeEval, geminiEval] = await Promise.all([
    evaluateWithGPT4(data),
    evaluateWithClaude(data),
    evaluateWithGemini(data),
  ]);

  console.log('[MULTI-AI] Individual scores:', {
    gpt4: gpt4Eval.score,
    claude: claudeEval.score,
    gemini: geminiEval.score,
  });

  // Calculate consensus
  const consensus = calculateConsensus(gpt4Eval, claudeEval, geminiEval);

  console.log('[MULTI-AI] Consensus:', {
    score: consensus.consensusScore,
    decision: consensus.finalDecision,
    agreement: consensus.agreementLevel,
  });

  return consensus;
}
