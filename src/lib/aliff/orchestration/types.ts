/**
 * Aliff AI - Multi-AI Orchestration Types
 *
 * Defines core types for orchestrating multiple AI models
 * (GPT-4, Claude, Gemini) to achieve consensus on complex tasks.
 */

/**
 * Supported AI models
 */
export type AIModel = 'gpt-4' | 'claude-3.5-sonnet' | 'gemini-1.5-pro';

/**
 * AI model provider
 */
export type AIProvider = 'openai' | 'anthropic' | 'google';

/**
 * Task types for intelligent routing
 */
export type TaskType =
  | 'technical' // Technical analysis, code, reasoning
  | 'strategic' // Strategic thinking, business decisions
  | 'analytical' // Data analysis, math, calculations
  | 'creative' // Creative writing, brainstorming
  | 'classification' // Classification, categorization
  | 'summarization' // Summarizing long text
  | 'extraction' // Extract structured data from text
  | 'mixed'; // Multiple task types

/**
 * AI model request
 */
export interface AIRequest {
  prompt: string;
  systemPrompt?: string;
  temperature?: number; // 0.0-1.0 (default: 0.7)
  maxTokens?: number; // Max output tokens
  stopSequences?: string[];
  topP?: number; // Nucleus sampling (default: 1.0)
}

/**
 * AI model response
 */
export interface AIResponse {
  model: AIModel;
  provider: AIProvider;
  content: string;
  finishReason: 'stop' | 'length' | 'error';
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  cost: number; // USD
  latencyMs: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Model configuration
 */
export interface ModelConfig {
  model: AIModel;
  provider: AIProvider;
  apiKey: string;
  baseUrl?: string; // Optional custom endpoint
  timeout?: number; // Request timeout in ms (default: 30000)
  maxRetries?: number; // Max retry attempts (default: 3)
  retryDelay?: number; // Delay between retries in ms (default: 1000)
}

/**
 * Model capabilities and pricing
 */
export interface ModelInfo {
  model: AIModel;
  provider: AIProvider;
  name: string;
  description: string;
  contextWindow: number; // Max context tokens
  maxOutputTokens: number;
  pricing: {
    inputPer1K: number; // USD per 1K input tokens
    outputPer1K: number; // USD per 1K output tokens
  };
  strengths: string[];
  weaknesses: string[];
  speed: 'fast' | 'medium' | 'slow';
  recommendedFor: TaskType[];
}

/**
 * Orchestration request
 */
export interface OrchestrationRequest {
  prompt: string;
  systemPrompt?: string;
  taskType?: TaskType;
  strategy?: OrchestrationStrategy;
  models?: AIModel[]; // Specific models to use (optional)
  temperature?: number;
  maxTokens?: number;
  requireConsensus?: boolean; // Require consensus or just use primary
  userId?: string;
  sessionId?: string;
}

/**
 * Orchestration strategy
 */
export type OrchestrationStrategy =
  | 'single' // Use single best model (fast, cheap)
  | 'dual' // Use 2 models for consensus
  | 'triple' // Use 3 models for consensus
  | 'custom'; // User-specified models

/**
 * Orchestration result
 */
export interface OrchestrationResult {
  strategy: OrchestrationStrategy;
  responses: AIResponse[];
  consensus?: ConsensusResult;
  primary: AIResponse; // Primary/final response
  totalCost: number;
  totalLatencyMs: number;
  timestamp: Date;
  metadata: {
    modelsUsed: AIModel[];
    taskType?: TaskType;
    routing?: string;
  };
}

/**
 * Consensus result
 */
export interface ConsensusResult {
  method: ConsensusMethod;
  result: string;
  confidence: number; // 0.0-1.0
  agreement: number; // 0.0-1.0 (how much models agreed)
  disagreements?: Array<{
    model: AIModel;
    response: string;
    reason: string;
  }>;
  requiresReview?: boolean;
}

/**
 * Consensus method
 */
export type ConsensusMethod =
  | 'majority-vote' // For classification/boolean
  | 'weighted-average' // For scoring
  | 'semantic-similarity' // For text (find most similar)
  | 'tiebreaker' // 3rd model breaks tie
  | 'longest-common' // Longest common substring
  | 'confidence-weighted'; // Weight by model confidence

/**
 * Model health status
 */
export interface ModelHealth {
  model: AIModel;
  status: 'healthy' | 'degraded' | 'down';
  lastCheck: Date;
  latency?: number;
  errorRate?: number; // 0.0-1.0
  circuitBreakerOpen?: boolean;
}

/**
 * Cost estimate
 */
export interface CostEstimate {
  model: AIModel;
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number; // USD
}

/**
 * Error types
 */
export class OrchestrationError extends Error {
  constructor(
    message: string,
    public model?: AIModel,
    public cause?: Error
  ) {
    super(message);
    this.name = 'OrchestrationError';
  }
}

export class ModelError extends Error {
  constructor(
    message: string,
    public model: AIModel,
    public statusCode?: number,
    public cause?: Error
  ) {
    super(message);
    this.name = 'ModelError';
  }
}

export class ConsensusError extends Error {
  constructor(
    message: string,
    public responses?: AIResponse[],
    public cause?: Error
  ) {
    super(message);
    this.name = 'ConsensusError';
  }
}

/**
 * Model information database
 */
export const MODEL_INFO: Record<AIModel, ModelInfo> = {
  'gpt-4': {
    model: 'gpt-4',
    provider: 'openai',
    name: 'GPT-4 Turbo',
    description: 'Most capable model for complex reasoning and technical tasks',
    contextWindow: 128000,
    maxOutputTokens: 4096,
    pricing: {
      inputPer1K: 0.01,
      outputPer1K: 0.03,
    },
    strengths: [
      'Complex reasoning',
      'Technical analysis',
      'Code generation',
      'Math and logic',
      'Instruction following',
    ],
    weaknesses: ['Cost (expensive)', 'Slower than alternatives', 'Verbose output'],
    speed: 'medium',
    recommendedFor: ['technical', 'analytical', 'extraction'],
  },

  'claude-3.5-sonnet': {
    model: 'claude-3.5-sonnet',
    provider: 'anthropic',
    name: 'Claude 3.5 Sonnet',
    description: 'Best for strategic thinking, writing, and nuanced understanding',
    contextWindow: 200000,
    maxOutputTokens: 4096,
    pricing: {
      inputPer1K: 0.003,
      outputPer1K: 0.015,
    },
    strengths: [
      'Strategic thinking',
      'Creative writing',
      'Nuanced understanding',
      'Long context',
      'Cost-effective',
    ],
    weaknesses: ['Less technical than GPT-4', 'Slower for simple tasks'],
    speed: 'medium',
    recommendedFor: ['strategic', 'creative', 'summarization'],
  },

  'gemini-1.5-pro': {
    model: 'gemini-1.5-pro',
    provider: 'google',
    name: 'Gemini 1.5 Pro',
    description: 'Fast, cheap, huge context - best for analysis and classification',
    contextWindow: 1000000,
    maxOutputTokens: 8192,
    pricing: {
      inputPer1K: 0.00125,
      outputPer1K: 0.005,
    },
    strengths: [
      'Massive context (1M tokens)',
      'Very fast',
      'Very cheap',
      'Good at analysis',
      'Math and data',
    ],
    weaknesses: ['Less nuanced than Claude', 'Newer, less proven'],
    speed: 'fast',
    recommendedFor: ['analytical', 'classification', 'summarization', 'extraction'],
  },
};

/**
 * Default model configurations
 */
export const DEFAULT_MODEL_CONFIGS: Partial<Record<AIModel, Partial<ModelConfig>>> = {
  'gpt-4': {
    timeout: 30000,
    maxRetries: 3,
    retryDelay: 1000,
  },
  'claude-3.5-sonnet': {
    timeout: 30000,
    maxRetries: 3,
    retryDelay: 1000,
  },
  'gemini-1.5-pro': {
    timeout: 20000,
    maxRetries: 3,
    retryDelay: 500,
  },
};
