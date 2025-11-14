/**
 * Aliff AI - Anthropic (Claude) Client
 *
 * Handles communication with Anthropic API for Claude 3.5 Sonnet model.
 */

import Anthropic from '@anthropic-ai/sdk';
import type {
  AIRequest,
  AIResponse,
  ModelConfig,
  ModelError,
} from '../types';

/**
 * Anthropic client instance
 */
let anthropicClient: Anthropic | null = null;

/**
 * Initialize Anthropic client
 */
export function initializeAnthropic(apiKey: string, baseUrl?: string): void {
  anthropicClient = new Anthropic({
    apiKey,
    baseURL: baseUrl,
  });

  console.log('[Anthropic] Client initialized');
}

/**
 * Get Anthropic client (lazy initialization)
 */
function getClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY not set');
    }
    initializeAnthropic(apiKey);
  }
  return anthropicClient!;
}

/**
 * Call Claude 3.5 Sonnet model
 */
export async function callClaude(
  request: AIRequest,
  config?: Partial<ModelConfig>
): Promise<AIResponse> {
  const startTime = Date.now();

  try {
    const client = getClient();

    // Call Anthropic API
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: request.maxTokens ?? 4096,
      temperature: request.temperature ?? 0.7,
      top_p: request.topP ?? 1.0,
      system: request.systemPrompt,
      messages: [
        {
          role: 'user',
          content: request.prompt,
        },
      ],
      stop_sequences: request.stopSequences,
    });

    // Extract content
    const content = message.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as any).text)
      .join('');

    // Calculate cost
    const inputCost = (message.usage.input_tokens / 1000) * 0.003;
    const outputCost = (message.usage.output_tokens / 1000) * 0.015;
    const totalCost = inputCost + outputCost;

    const latencyMs = Date.now() - startTime;

    return {
      model: 'claude-3.5-sonnet',
      provider: 'anthropic',
      content,
      finishReason:
        message.stop_reason === 'end_turn'
          ? 'stop'
          : message.stop_reason === 'max_tokens'
          ? 'length'
          : 'error',
      usage: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
        totalTokens: message.usage.input_tokens + message.usage.output_tokens,
      },
      cost: totalCost,
      latencyMs,
      timestamp: new Date(),
      metadata: {
        model: message.model,
        stopReason: message.stop_reason,
      },
    };
  } catch (error) {
    const latencyMs = Date.now() - startTime;

    console.error('[Anthropic] Error calling Claude:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    throw {
      name: 'ModelError',
      message: `Claude error: ${errorMessage}`,
      model: 'claude-3.5-sonnet',
      statusCode: (error as any)?.status,
      cause: error instanceof Error ? error : undefined,
    } as ModelError;
  }
}

/**
 * Estimate Claude cost
 */
export function estimateClaudeCost(
  inputTokens: number,
  outputTokens: number
): number {
  const inputCost = (inputTokens / 1000) * 0.003;
  const outputCost = (outputTokens / 1000) * 0.015;
  return inputCost + outputCost;
}

/**
 * Count tokens (rough estimate)
 */
export function estimateTokens(text: string): number {
  // Anthropic: ~1 token ≈ 3.5 characters
  return Math.ceil(text.length / 3.5);
}

/**
 * Export Anthropic client API
 */
export const AnthropicClient = {
  initialize: initializeAnthropic,
  call: callClaude,
  estimateCost: estimateClaudeCost,
  estimateTokens,
} as const;
