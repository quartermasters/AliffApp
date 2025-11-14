/**
 * Aliff AI - Google (Gemini) Client
 *
 * Handles communication with Google AI API for Gemini 1.5 Pro model.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type {
  AIRequest,
  AIResponse,
  ModelConfig,
  ModelError,
} from '../types';

/**
 * Google AI client instance
 */
let googleAIClient: GoogleGenerativeAI | null = null;

/**
 * Initialize Google AI client
 */
export function initializeGoogleAI(apiKey: string): void {
  googleAIClient = new GoogleGenerativeAI(apiKey);

  console.log('[GoogleAI] Client initialized');
}

/**
 * Get Google AI client (lazy initialization)
 */
function getClient(): GoogleGenerativeAI {
  if (!googleAIClient) {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY not set');
    }
    initializeGoogleAI(apiKey);
  }
  return googleAIClient!;
}

/**
 * Call Gemini 1.5 Pro model
 */
export async function callGemini(
  request: AIRequest,
  config?: Partial<ModelConfig>
): Promise<AIResponse> {
  const startTime = Date.now();

  try {
    const client = getClient();
    const model = client.getGenerativeModel({
      model: 'gemini-1.5-pro',
    });

    // Prepare prompt (combine system + user)
    let fullPrompt = request.prompt;
    if (request.systemPrompt) {
      fullPrompt = `${request.systemPrompt}\n\n${request.prompt}`;
    }

    // Call Gemini API
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: request.temperature ?? 0.7,
        maxOutputTokens: request.maxTokens ?? 8192,
        topP: request.topP ?? 1.0,
        stopSequences: request.stopSequences,
      },
    });

    const response = result.response;
    const content = response.text();

    // Estimate token usage (Gemini doesn't provide exact counts in response)
    const inputTokens = estimateTokens(fullPrompt);
    const outputTokens = estimateTokens(content);

    // Calculate cost
    const inputCost = (inputTokens / 1000) * 0.00125;
    const outputCost = (outputTokens / 1000) * 0.005;
    const totalCost = inputCost + outputCost;

    const latencyMs = Date.now() - startTime;

    // Determine finish reason
    let finishReason: 'stop' | 'length' | 'error' = 'stop';
    if (response.candidates && response.candidates[0]?.finishReason) {
      const reason = response.candidates[0].finishReason;
      if (reason === 'MAX_TOKENS') {
        finishReason = 'length';
      } else if (reason === 'STOP') {
        finishReason = 'stop';
      } else {
        finishReason = 'error';
      }
    }

    return {
      model: 'gemini-1.5-pro',
      provider: 'google',
      content,
      finishReason,
      usage: {
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens,
      },
      cost: totalCost,
      latencyMs,
      timestamp: new Date(),
      metadata: {
        finishReason: response.candidates?.[0]?.finishReason,
        safetyRatings: response.candidates?.[0]?.safetyRatings,
      },
    };
  } catch (error) {
    const latencyMs = Date.now() - startTime;

    console.error('[GoogleAI] Error calling Gemini:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    throw {
      name: 'ModelError',
      message: `Gemini error: ${errorMessage}`,
      model: 'gemini-1.5-pro',
      cause: error instanceof Error ? error : undefined,
    } as ModelError;
  }
}

/**
 * Estimate Gemini cost
 */
export function estimateGeminiCost(
  inputTokens: number,
  outputTokens: number
): number {
  const inputCost = (inputTokens / 1000) * 0.00125;
  const outputCost = (outputTokens / 1000) * 0.005;
  return inputCost + outputCost;
}

/**
 * Count tokens (rough estimate)
 */
export function estimateTokens(text: string): number {
  // Gemini: ~1 token ≈ 4 characters (similar to GPT)
  return Math.ceil(text.length / 4);
}

/**
 * Export Google AI client API
 */
export const GoogleAIClient = {
  initialize: initializeGoogleAI,
  call: callGemini,
  estimateCost: estimateGeminiCost,
  estimateTokens,
} as const;
