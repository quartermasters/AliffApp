/**
 * Claude Provider Integration
 *
 * Implements Claude 3.5 Sonnet calls for SDL tasks
 */

import Anthropic from '@anthropic-ai/sdk';

export interface ClaudeConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export interface ClaudeResponse {
  content: string;
  confidence?: number;
  tokensUsed: number;
  model: string;
}

export class ClaudeProvider {
  private client: Anthropic;
  private config: ClaudeConfig;

  constructor(config: ClaudeConfig) {
    this.config = config;
    this.client = new Anthropic({
      apiKey: config.apiKey,
    });
  }

  /**
   * Execute Claude completion
   */
  async execute(prompt: string, documentContent: string): Promise<ClaudeResponse> {
    const startTime = Date.now();

    try {
      const response = await this.client.messages.create({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        system: `You are an expert government contracting analyst. Analyze the provided solicitation document and respond in valid JSON format as specified in the prompt.`,
        messages: [
          {
            role: 'user',
            content: `${prompt}\n\n---\nDOCUMENT CONTENT:\n${documentContent.substring(0, 50000)}`,
          },
        ],
      });

      const textContent = response.content.find((c) => c.type === 'text');
      const content = textContent?.type === 'text' ? textContent.text : '';

      const tokensUsed = response.usage.input_tokens + response.usage.output_tokens;

      console.log(
        `[Claude Provider] Completed in ${Date.now() - startTime}ms, ${tokensUsed} tokens`
      );

      return {
        content,
        tokensUsed,
        model: response.model,
      };
    } catch (error) {
      console.error('[Claude Provider] Error:', error);
      throw new Error(
        `Claude API error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Parse JSON response
   */
  parseResponse<T>(response: ClaudeResponse): T {
    try {
      // Claude sometimes wraps JSON in markdown code blocks
      let jsonContent = response.content;

      // Remove markdown code blocks if present
      if (jsonContent.includes('```json')) {
        const match = jsonContent.match(/```json\n([\s\S]*?)\n```/);
        if (match) {
          jsonContent = match[1];
        }
      } else if (jsonContent.includes('```')) {
        const match = jsonContent.match(/```\n([\s\S]*?)\n```/);
        if (match) {
          jsonContent = match[1];
        }
      }

      return JSON.parse(jsonContent) as T;
    } catch (error) {
      console.error('[Claude Provider] JSON parse error:', error);
      throw new Error('Failed to parse Claude response as JSON');
    }
  }
}

/**
 * Create Claude Provider instance
 */
export function createClaudeProvider(): ClaudeProvider | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.warn('[Claude Provider] ANTHROPIC_API_KEY not found');
    return null;
  }

  return new ClaudeProvider({
    apiKey,
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 4096,
    temperature: 0.7,
  });
}
