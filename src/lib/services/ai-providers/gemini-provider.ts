/**
 * Gemini Provider Integration
 *
 * Implements Gemini 1.5 Pro calls for SDL tasks
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeminiConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export interface GeminiResponse {
  content: string;
  confidence?: number;
  tokensUsed: number;
  model: string;
}

export class GeminiProvider {
  private client: GoogleGenerativeAI;
  private config: GeminiConfig;

  constructor(config: GeminiConfig) {
    this.config = config;
    this.client = new GoogleGenerativeAI(config.apiKey);
  }

  /**
   * Execute Gemini completion
   */
  async execute(prompt: string, documentContent: string): Promise<GeminiResponse> {
    const startTime = Date.now();

    try {
      const model = this.client.getGenerativeModel({
        model: this.config.model,
        generationConfig: {
          maxOutputTokens: this.config.maxTokens,
          temperature: this.config.temperature,
          responseMimeType: 'application/json',
        },
      });

      const systemInstruction = `You are an expert government contracting analyst. Analyze the provided solicitation document and respond in valid JSON format as specified in the prompt.`;

      const fullPrompt = `${systemInstruction}\n\n${prompt}\n\n---\nDOCUMENT CONTENT:\n${documentContent.substring(0, 50000)}`;

      const result = await model.generateContent(fullPrompt);
      const response = result.response;

      const content = response.text();

      // Gemini doesn't provide token counts in the same way, estimate based on content
      const tokensUsed = Math.ceil((fullPrompt.length + content.length) / 4);

      console.log(
        `[Gemini Provider] Completed in ${Date.now() - startTime}ms, ~${tokensUsed} tokens`
      );

      return {
        content,
        tokensUsed,
        model: this.config.model,
      };
    } catch (error) {
      console.error('[Gemini Provider] Error:', error);
      throw new Error(
        `Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Parse JSON response
   */
  parseResponse<T>(response: GeminiResponse): T {
    try {
      // Gemini sometimes wraps JSON in markdown code blocks
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
      console.error('[Gemini Provider] JSON parse error:', error);
      throw new Error('Failed to parse Gemini response as JSON');
    }
  }
}

/**
 * Create Gemini Provider instance
 */
export function createGeminiProvider(): GeminiProvider | null {
  const apiKey = process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    console.warn('[Gemini Provider] GOOGLE_AI_API_KEY not found');
    return null;
  }

  return new GeminiProvider({
    apiKey,
    model: 'gemini-1.5-pro',
    maxTokens: 4096,
    temperature: 0.7,
  });
}
