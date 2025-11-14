/**
 * Aliff AI - OpenAI (GPT-4) Client
 *
 * Handles communication with OpenAI API for GPT-4 model.
 */

import OpenAI from 'openai';
import type {
  AIRequest,
  AIResponse,
  ModelConfig,
  ModelError,
} from '../types';

/**
 * OpenAI client instance
 */
let openaiClient: OpenAI | null = null;

/**
 * Initialize OpenAI client
 */
export function initializeOpenAI(apiKey: string, baseUrl?: string): void {
  openaiClient = new OpenAI({
    apiKey,
    baseURL: baseUrl,
  });

  console.log('[OpenAI] Client initialized');
}

/**
 * Get OpenAI client (lazy initialization)
 */
function getClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not set');
    }
    initializeOpenAI(apiKey);
  }
  return openaiClient!;
}

/**
 * Call GPT-4 model
 */
export async function callGPT4(
  request: AIRequest,
  config?: Partial<ModelConfig>
): Promise<AIResponse> {
  const startTime = Date.now();

  try {
    const client = getClient();

    // Prepare messages
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

    if (request.systemPrompt) {
      messages.push({
        role: 'system',
        content: request.systemPrompt,
      });
    }

    messages.push({
      role: 'user',
      content: request.prompt,
    });

    // Call OpenAI API
    const completion = await client.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens ?? 4096,
      top_p: request.topP ?? 1.0,
      stop: request.stopSequences,
    });

    const choice = completion.choices[0];
    const usage = completion.usage;

    if (!choice || !usage) {
      throw new Error('Invalid response from OpenAI');
    }

    // Calculate cost
    const inputCost = (usage.prompt_tokens / 1000) * 0.01;
    const outputCost = (usage.completion_tokens / 1000) * 0.03;
    const totalCost = inputCost + outputCost;

    const latencyMs = Date.now() - startTime;

    return {
      model: 'gpt-4',
      provider: 'openai',
      content: choice.message.content || '',
      finishReason:
        choice.finish_reason === 'stop'
          ? 'stop'
          : choice.finish_reason === 'length'
          ? 'length'
          : 'error',
      usage: {
        inputTokens: usage.prompt_tokens,
        outputTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
      },
      cost: totalCost,
      latencyMs,
      timestamp: new Date(),
      metadata: {
        model: completion.model,
        finishReason: choice.finish_reason,
      },
    };
  } catch (error) {
    const latencyMs = Date.now() - startTime;

    console.error('[OpenAI] Error calling GPT-4:', error);

    // Create error response
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    throw {
      name: 'ModelError',
      message: `GPT-4 error: ${errorMessage}`,
      model: 'gpt-4',
      statusCode: (error as any)?.status,
      cause: error instanceof Error ? error : undefined,
    } as ModelError;
  }
}

/**
 * Estimate GPT-4 cost
 */
export function estimateGPT4Cost(
  inputTokens: number,
  outputTokens: number
): number {
  const inputCost = (inputTokens / 1000) * 0.01;
  const outputCost = (outputTokens / 1000) * 0.03;
  return inputCost + outputCost;
}

/**
 * Count tokens (rough estimate)
 * In production, use tiktoken library for accurate counting
 */
export function estimateTokens(text: string): number {
  // Rough estimate: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}

/**
 * Export OpenAI client API
 */
export const OpenAIClient = {
  initialize: initializeOpenAI,
  call: callGPT4,
  estimateCost: estimateGPT4Cost,
  estimateTokens,
} as const;
