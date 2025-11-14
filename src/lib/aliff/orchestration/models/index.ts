/**
 * Aliff AI - Model Abstraction Layer
 *
 * Provides unified interface for calling different AI models
 * (GPT-4, Claude, Gemini) with consistent error handling and retries.
 */

import type {
  AIModel,
  AIRequest,
  AIResponse,
  ModelConfig,
  ModelError,
} from '../types';
import { OpenAIClient } from './openai';
import { AnthropicClient } from './anthropic';
import { GoogleAIClient } from './google';

/**
 * Model configuration storage
 */
const modelConfigs: Map<AIModel, Partial<ModelConfig>> = new Map();

/**
 * Initialize all model clients
 */
export function initializeModels(configs: {
  openai?: { apiKey: string; baseUrl?: string };
  anthropic?: { apiKey: string; baseUrl?: string };
  google?: { apiKey: string };
}): void {
  if (configs.openai) {
    OpenAIClient.initialize(configs.openai.apiKey, configs.openai.baseUrl);
  }

  if (configs.anthropic) {
    AnthropicClient.initialize(
      configs.anthropic.apiKey,
      configs.anthropic.baseUrl
    );
  }

  if (configs.google) {
    GoogleAIClient.initialize(configs.google.apiKey);
  }

  console.log('[Models] All clients initialized');
}

/**
 * Call a specific AI model with retry logic
 */
export async function callModel(
  model: AIModel,
  request: AIRequest,
  config?: Partial<ModelConfig>
): Promise<AIResponse> {
  const maxRetries = config?.maxRetries ?? 3;
  const retryDelay = config?.retryDelay ?? 1000;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Call appropriate model
      switch (model) {
        case 'gpt-4':
          return await OpenAIClient.call(request, config);

        case 'claude-3.5-sonnet':
          return await AnthropicClient.call(request, config);

        case 'gemini-1.5-pro':
          return await GoogleAIClient.call(request, config);

        default:
          throw new Error(`Unsupported model: ${model}`);
      }
    } catch (error) {
      lastError = error as Error;

      // Check if error is retryable
      const isRetryable = isRetryableError(error);

      if (!isRetryable || attempt === maxRetries) {
        // Don't retry, throw error
        throw error;
      }

      // Wait before retry (exponential backoff)
      const delay = retryDelay * Math.pow(2, attempt);
      console.warn(
        `[Models] ${model} failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms...`
      );

      await sleep(delay);
    }
  }

  // Should never reach here, but TypeScript needs this
  throw lastError || new Error('Unknown error');
}

/**
 * Call multiple models in parallel
 */
export async function callModels(
  models: AIModel[],
  request: AIRequest,
  config?: Partial<ModelConfig>
): Promise<AIResponse[]> {
  const promises = models.map((model) => callModel(model, request, config));

  // Use Promise.allSettled to get all results (even failures)
  const results = await Promise.allSettled(promises);

  const responses: AIResponse[] = [];
  const errors: Array<{ model: AIModel; error: Error }> = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      responses.push(result.value);
    } else {
      errors.push({
        model: models[index],
        error: result.reason,
      });
    }
  });

  // If all models failed, throw error
  if (responses.length === 0) {
    throw new Error(
      `All models failed: ${errors.map((e) => `${e.model}: ${e.error.message}`).join(', ')}`
    );
  }

  // Log partial failures
  if (errors.length > 0) {
    console.warn(
      `[Models] Some models failed:`,
      errors.map((e) => `${e.model}: ${e.error.message}`)
    );
  }

  return responses;
}

/**
 * Estimate cost for a model call
 */
export function estimateCost(
  model: AIModel,
  inputTokens: number,
  outputTokens: number
): number {
  switch (model) {
    case 'gpt-4':
      return OpenAIClient.estimateCost(inputTokens, outputTokens);

    case 'claude-3.5-sonnet':
      return AnthropicClient.estimateCost(inputTokens, outputTokens);

    case 'gemini-1.5-pro':
      return GoogleAIClient.estimateCost(inputTokens, outputTokens);

    default:
      throw new Error(`Unsupported model: ${model}`);
  }
}

/**
 * Estimate tokens for text
 */
export function estimateTokens(text: string, model?: AIModel): number {
  // Use model-specific estimation if provided
  if (model) {
    switch (model) {
      case 'gpt-4':
        return OpenAIClient.estimateTokens(text);
      case 'claude-3.5-sonnet':
        return AnthropicClient.estimateTokens(text);
      case 'gemini-1.5-pro':
        return GoogleAIClient.estimateTokens(text);
    }
  }

  // Default: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}

/**
 * Check if error is retryable
 */
function isRetryableError(error: any): boolean {
  // Retry on network errors
  if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
    return true;
  }

  // Retry on rate limit errors (429)
  if (error.status === 429 || error.statusCode === 429) {
    return true;
  }

  // Retry on server errors (500, 502, 503, 504)
  const statusCode = error.status || error.statusCode;
  if (statusCode >= 500 && statusCode < 600) {
    return true;
  }

  // Don't retry on other errors (auth, invalid request, etc.)
  return false;
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Export model clients
 */
export { OpenAIClient, AnthropicClient, GoogleAIClient };

/**
 * Main Models API
 */
export const Models = {
  initialize: initializeModels,
  call: callModel,
  callMultiple: callModels,
  estimateCost,
  estimateTokens,
} as const;

export default Models;
