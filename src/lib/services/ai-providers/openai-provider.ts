/**
 * OpenAI Provider Integration
 *
 * Implements GPT-4 Turbo calls for SDL tasks
 */

import OpenAI from 'openai';

export interface OpenAIConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export interface OpenAIResponse {
  content: string;
  confidence?: number;
  tokensUsed: number;
  model: string;
}

export class OpenAIProvider {
  private client: OpenAI;
  private config: OpenAIConfig;

  constructor(config: OpenAIConfig) {
    this.config = config;
    this.client = new OpenAI({
      apiKey: config.apiKey,
    });
  }

  /**
   * Execute OpenAI completion
   */
  async execute(prompt: string, documentContent: string): Promise<OpenAIResponse> {
    const startTime = Date.now();

    try {
      const response = await this.client.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: `You are an expert government contracting analyst. Analyze the provided solicitation document and respond in valid JSON format as specified in the prompt.`,
          },
          {
            role: 'user',
            content: `${prompt}\n\n---\nDOCUMENT CONTENT:\n${documentContent.substring(0, 50000)}`,
          },
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content || '';
      const tokensUsed = response.usage?.total_tokens || 0;

      console.log(
        `[OpenAI Provider] Completed in ${Date.now() - startTime}ms, ${tokensUsed} tokens`
      );

      return {
        content,
        tokensUsed,
        model: response.model,
      };
    } catch (error) {
      console.error('[OpenAI Provider] Error:', error);
      throw new Error(`OpenAI API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse JSON response
   */
  parseResponse<T>(response: OpenAIResponse): T {
    try {
      return JSON.parse(response.content) as T;
    } catch (error) {
      console.error('[OpenAI Provider] JSON parse error:', error);
      throw new Error('Failed to parse OpenAI response as JSON');
    }
  }
}

/**
 * Create OpenAI Provider instance
 */
export function createOpenAIProvider(): OpenAIProvider | null {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn('[OpenAI Provider] OPENAI_API_KEY not found');
    return null;
  }

  return new OpenAIProvider({
    apiKey,
    model: 'gpt-4-turbo-preview',
    maxTokens: 4096,
    temperature: 0.7,
  });
}
