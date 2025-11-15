/**
 * AI Router Service
 *
 * Routes SDL tasks to appropriate AI providers based on:
 * - Task type and complexity
 * - Cost optimization (Tier 1-4)
 * - AI provider availability
 * - Performance history
 *
 * Implements fallback logic when primary AI unavailable
 */

import { AIProvider } from '@prisma/client';

// ============================================================================
// AI PROVIDER CONFIGURATION
// ============================================================================

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey: string;
  baseURL?: string;
  model: string;
  maxTokens: number;
  temperature: number;
  available: boolean;
  costTier: 1 | 2 | 3 | 4; // 1 = cheapest, 4 = most expensive
}

const AI_PROVIDERS: Record<AIProvider, AIProviderConfig> = {
  OPENAI: {
    provider: AIProvider.OPENAI,
    apiKey: process.env.OPENAI_API_KEY || '',
    model: 'gpt-4-turbo-preview',
    maxTokens: 4096,
    temperature: 0.7,
    available: !!process.env.OPENAI_API_KEY,
    costTier: 4, // Most expensive, best reasoning
  },
  CLAUDE: {
    provider: AIProvider.CLAUDE,
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 4096,
    temperature: 0.7,
    available: !!process.env.ANTHROPIC_API_KEY,
    costTier: 4, // Premium, long context
  },
  GEMINI: {
    provider: AIProvider.GEMINI,
    apiKey: process.env.GOOGLE_AI_API_KEY || '',
    model: 'gemini-1.5-pro',
    maxTokens: 4096,
    temperature: 0.7,
    available: !!process.env.GOOGLE_AI_API_KEY,
    costTier: 2, // Cost-effective, good for research
  },
  GROK: {
    provider: AIProvider.GROK,
    apiKey: process.env.XAI_API_KEY || '',
    baseURL: 'https://api.x.ai/v1',
    model: 'grok-beta',
    maxTokens: 4096,
    temperature: 0.7,
    available: !!process.env.XAI_API_KEY,
    costTier: 3, // Mid-tier, real-time info
  },
};

// ============================================================================
// ROUTING RULES (Based on SDL_MULTI_AI_ORCHESTRATION.md)
// ============================================================================

export interface RoutingRule {
  taskNumbers: number[];
  primaryAI: AIProvider;
  fallbackAI: AIProvider[];
  rationale: string;
  costTier: 1 | 2 | 3 | 4;
}

export const ROUTING_RULES: RoutingRule[] = [
  // TIER 1: Cost-Optimized (Routine/Extraction) - Tasks 1-9, 23
  {
    taskNumbers: [1, 3, 4, 7], // Document processing, compliance
    primaryAI: AIProvider.CLAUDE,
    fallbackAI: [AIProvider.GEMINI, AIProvider.OPENAI],
    rationale: 'Claude excels at document parsing and long context',
    costTier: 2,
  },
  {
    taskNumbers: [2, 5, 6, 8, 9], // Data extraction tasks
    primaryAI: AIProvider.GEMINI,
    fallbackAI: [AIProvider.CLAUDE, AIProvider.OPENAI],
    rationale: 'Gemini optimized for structured data extraction',
    costTier: 1,
  },

  // TIER 2: Strategic (High-Value Reasoning) - Tasks 10-11, 22, 24-25, 30-34
  {
    taskNumbers: [10, 11, 22, 24, 25, 30, 31, 33, 34], // Strategic reasoning
    primaryAI: AIProvider.OPENAI,
    fallbackAI: [AIProvider.CLAUDE, AIProvider.GEMINI],
    rationale: 'GPT-4 excels at strategic reasoning and judgment',
    costTier: 4,
  },

  // TIER 3: Research (Parallel Execution) - Tasks 12-16
  {
    taskNumbers: [12, 13, 15, 16], // Research tasks
    primaryAI: AIProvider.GEMINI,
    fallbackAI: [AIProvider.GROK, AIProvider.OPENAI],
    rationale: 'Gemini good for research aggregation',
    costTier: 2,
  },
  {
    taskNumbers: [14], // Real-time research
    primaryAI: AIProvider.GROK,
    fallbackAI: [AIProvider.GEMINI, AIProvider.OPENAI],
    rationale: 'Grok provides real-time information',
    costTier: 3,
  },

  // TIER 4: Critical Multi-AI (Tasks 17-21, 26-29)
  {
    taskNumbers: [17, 18, 19, 21, 26, 27, 28, 29], // Critical strategic analysis
    primaryAI: AIProvider.OPENAI,
    fallbackAI: [AIProvider.CLAUDE],
    rationale: 'High-stakes decisions require GPT-4 + Claude consensus',
    costTier: 4,
  },
  {
    taskNumbers: [20], // Budget assessment
    primaryAI: AIProvider.OPENAI,
    fallbackAI: [AIProvider.GEMINI],
    rationale: 'Budget analysis uses GPT-4 + Gemini validation',
    costTier: 4,
  },
  {
    taskNumbers: [32], // Teaming recommendations
    primaryAI: AIProvider.GEMINI,
    fallbackAI: [AIProvider.OPENAI],
    rationale: 'Research-based teaming analysis',
    costTier: 2,
  },
];

// ============================================================================
// AI ROUTER CLASS
// ============================================================================

export interface AIExecutionResult {
  provider: AIProvider;
  model: string;
  result: any;
  tokensUsed?: number;
  duration: number;
  error?: string;
  fallbackUsed: boolean;
}

export class AIRouter {
  /**
   * Get AI provider configuration
   */
  private getProviderConfig(provider: AIProvider): AIProviderConfig {
    return AI_PROVIDERS[provider];
  }

  /**
   * Check if AI provider is available
   */
  isProviderAvailable(provider: AIProvider): boolean {
    return this.getProviderConfig(provider).available;
  }

  /**
   * Get routing rule for task
   */
  getRoutingRule(taskNumber: number): RoutingRule | undefined {
    return ROUTING_RULES.find((rule) => rule.taskNumbers.includes(taskNumber));
  }

  /**
   * Get primary AI for task
   */
  getPrimaryAI(taskNumber: number): AIProvider {
    const rule = this.getRoutingRule(taskNumber);
    if (rule) {
      return rule.primaryAI;
    }

    // Default to OpenAI for unknown tasks
    console.warn(`No routing rule for task ${taskNumber}, defaulting to OPENAI`);
    return AIProvider.OPENAI;
  }

  /**
   * Get fallback AIs for task
   */
  getFallbackAIs(taskNumber: number): AIProvider[] {
    const rule = this.getRoutingRule(taskNumber);
    return rule?.fallbackAI || [AIProvider.CLAUDE, AIProvider.GEMINI];
  }

  /**
   * Route task to appropriate AI (with fallback)
   */
  async routeTask(
    taskNumber: number,
    taskName: string,
    prompt: string,
    documentContent: string
  ): Promise<AIExecutionResult> {
    const startTime = Date.now();
    const primaryAI = this.getPrimaryAI(taskNumber);
    const fallbackAIs = this.getFallbackAIs(taskNumber);

    // Try primary AI
    if (this.isProviderAvailable(primaryAI)) {
      try {
        console.log(`[AI Router] Routing task ${taskNumber} to ${primaryAI}`);
        const result = await this.executeAI(primaryAI, prompt, documentContent);
        return {
          provider: primaryAI,
          model: this.getProviderConfig(primaryAI).model,
          result,
          duration: Date.now() - startTime,
          fallbackUsed: false,
        };
      } catch (error) {
        console.error(`[AI Router] ${primaryAI} failed for task ${taskNumber}:`, error);
      }
    }

    // Try fallback AIs
    for (const fallbackAI of fallbackAIs) {
      if (this.isProviderAvailable(fallbackAI)) {
        try {
          console.log(`[AI Router] Fallback: Routing task ${taskNumber} to ${fallbackAI}`);
          const result = await this.executeAI(fallbackAI, prompt, documentContent);
          return {
            provider: fallbackAI,
            model: this.getProviderConfig(fallbackAI).model,
            result,
            duration: Date.now() - startTime,
            fallbackUsed: true,
          };
        } catch (error) {
          console.error(`[AI Router] ${fallbackAI} fallback failed:`, error);
        }
      }
    }

    // All AIs failed
    throw new Error(
      `All AI providers failed for task ${taskNumber}. Primary: ${primaryAI}, Fallbacks: ${fallbackAIs.join(', ')}`
    );
  }

  /**
   * Execute AI call (placeholder - will be implemented with actual AI SDKs)
   */
  private async executeAI(
    provider: AIProvider,
    prompt: string,
    documentContent: string
  ): Promise<any> {
    const config = this.getProviderConfig(provider);

    // TODO: Implement actual AI SDK calls
    // For now, return mock response
    console.log(`[AI Router] Executing ${provider} with model ${config.model}`);

    // This is a placeholder. In production, implement:
    switch (provider) {
      case AIProvider.OPENAI:
        // return await callOpenAI(config, prompt, documentContent);
        break;
      case AIProvider.CLAUDE:
        // return await callClaude(config, prompt, documentContent);
        break;
      case AIProvider.GEMINI:
        // return await callGemini(config, prompt, documentContent);
        break;
      case AIProvider.GROK:
        // return await callGrok(config, prompt, documentContent);
        break;
    }

    // Mock response for development
    return {
      content: `Mock response from ${provider} for prompt: ${prompt.substring(0, 50)}...`,
      confidence: 85,
      provider,
      model: config.model,
    };
  }

  /**
   * Execute multi-AI task (for consensus validation)
   */
  async executeMultiAI(
    taskNumber: number,
    taskName: string,
    prompt: string,
    documentContent: string,
    aiProviders: AIProvider[]
  ): Promise<AIExecutionResult[]> {
    console.log(`[AI Router] Executing multi-AI task ${taskNumber} with ${aiProviders.length} providers`);

    const results: AIExecutionResult[] = [];

    // Execute all AIs in parallel
    const promises = aiProviders.map(async (provider) => {
      const startTime = Date.now();
      try {
        if (!this.isProviderAvailable(provider)) {
          console.warn(`[AI Router] ${provider} not available for multi-AI task ${taskNumber}`);
          return null;
        }

        const result = await this.executeAI(provider, prompt, documentContent);
        return {
          provider,
          model: this.getProviderConfig(provider).model,
          result,
          duration: Date.now() - startTime,
          fallbackUsed: false,
        };
      } catch (error) {
        console.error(`[AI Router] ${provider} failed in multi-AI execution:`, error);
        return {
          provider,
          model: this.getProviderConfig(provider).model,
          result: null,
          duration: Date.now() - startTime,
          error: error instanceof Error ? error.message : 'Unknown error',
          fallbackUsed: false,
        };
      }
    });

    const executionResults = await Promise.all(promises);

    // Filter out null results
    return executionResults.filter((r): r is AIExecutionResult => r !== null);
  }

  /**
   * Get cost estimate for task
   */
  getTaskCostEstimate(taskNumber: number, tokenCount: number = 1000): {
    estimatedCost: number;
    costTier: number;
    provider: AIProvider;
  } {
    const rule = this.getRoutingRule(taskNumber);
    const costTier = rule?.costTier || 4;
    const provider = rule?.primaryAI || AIProvider.OPENAI;

    // Rough cost estimates (per 1M tokens)
    const costPerMillion = {
      1: 0.5, // Gemini Flash
      2: 2.0, // Gemini Pro, Claude Sonnet
      3: 8.0, // Grok
      4: 20.0, // GPT-4, Claude Opus
    };

    const estimatedCost = (tokenCount / 1000000) * costPerMillion[costTier];

    return {
      estimatedCost,
      costTier,
      provider,
    };
  }

  /**
   * Get routing statistics
   */
  getRoutingStatistics() {
    const availableProviders = Object.values(AIProvider).filter((p) => this.isProviderAvailable(p));

    return {
      totalProviders: Object.keys(AIProvider).length,
      availableProviders: availableProviders.length,
      unavailableProviders: Object.keys(AIProvider).length - availableProviders.length,
      providers: Object.values(AIProvider).map((provider) => ({
        provider,
        available: this.isProviderAvailable(provider),
        model: this.getProviderConfig(provider).model,
        costTier: this.getProviderConfig(provider).costTier,
      })),
      routingRules: ROUTING_RULES.length,
    };
  }
}

/**
 * Create AI Router instance
 */
export function createAIRouter(): AIRouter {
  return new AIRouter();
}

/**
 * Get AI Router singleton
 */
let aiRouterInstance: AIRouter | null = null;

export function getAIRouter(): AIRouter {
  if (!aiRouterInstance) {
    aiRouterInstance = new AIRouter();
  }
  return aiRouterInstance;
}
