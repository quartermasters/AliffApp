/**
 * Aliff AI - Task Router Types
 *
 * Defines task types and routing configurations for intelligent
 * model selection based on task characteristics.
 */

import type { AIModel, TaskType } from '../types';

/**
 * Task classification result
 */
export interface TaskClassification {
  taskType: TaskType;
  confidence: number; // 0.0-1.0
  reasoning: string;
  indicators: string[]; // Keywords/patterns that led to classification
}

/**
 * Routing decision
 */
export interface RoutingDecision {
  primary: AIModel;
  fallback: AIModel[];
  reasoning: string;
  estimatedCost: number;
  estimatedLatency: number; // milliseconds
  confidence: number; // 0.0-1.0
}

/**
 * Routing rule
 */
export interface RoutingRule {
  taskType: TaskType;
  primary: AIModel;
  fallback: AIModel[];
  conditions?: {
    maxCost?: number; // USD
    maxLatency?: number; // milliseconds
    requiresAccuracy?: boolean;
    requiresSpeed?: boolean;
  };
  reasoning: string;
}

/**
 * Routing configuration
 */
export interface RouterConfig {
  rules: RoutingRule[];
  preferCheap: boolean; // Prefer cheaper models when possible
  preferFast: boolean; // Prefer faster models when possible
  allowFallback: boolean; // Allow fallback to other models on failure
  maxCostPerRequest: number; // USD (hard limit)
}

/**
 * Task analysis result
 */
export interface TaskAnalysis {
  prompt: string;
  classification: TaskClassification;
  characteristics: {
    length: number; // Character count
    complexity: 'simple' | 'medium' | 'complex';
    domain: string[]; // e.g., ['technical', 'business']
    requiresReasoning: boolean;
    requiresCreativity: boolean;
    requiresData: boolean;
  };
  estimatedInputTokens: number;
  estimatedOutputTokens: number;
}

/**
 * Default routing rules
 */
export const DEFAULT_ROUTING_RULES: RoutingRule[] = [
  {
    taskType: 'technical',
    primary: 'gpt-4',
    fallback: ['claude-3.5-sonnet', 'gemini-1.5-pro'],
    reasoning: 'GPT-4 excels at technical analysis, code, and complex reasoning',
  },
  {
    taskType: 'strategic',
    primary: 'claude-3.5-sonnet',
    fallback: ['gpt-4', 'gemini-1.5-pro'],
    reasoning: 'Claude best for strategic thinking, nuanced understanding',
  },
  {
    taskType: 'analytical',
    primary: 'gemini-1.5-pro',
    fallback: ['gpt-4', 'claude-3.5-sonnet'],
    reasoning: 'Gemini best for data analysis, math, large context',
  },
  {
    taskType: 'creative',
    primary: 'claude-3.5-sonnet',
    fallback: ['gpt-4', 'gemini-1.5-pro'],
    reasoning: 'Claude produces best creative writing and brainstorming',
  },
  {
    taskType: 'classification',
    primary: 'gemini-1.5-pro',
    fallback: ['gpt-4', 'claude-3.5-sonnet'],
    reasoning: 'Gemini is fastest and cheapest for classification tasks',
    conditions: {
      requiresSpeed: true,
    },
  },
  {
    taskType: 'summarization',
    primary: 'gemini-1.5-pro',
    fallback: ['claude-3.5-sonnet', 'gpt-4'],
    reasoning: 'Gemini handles massive context (1M tokens) for long documents',
  },
  {
    taskType: 'extraction',
    primary: 'gpt-4',
    fallback: ['gemini-1.5-pro', 'claude-3.5-sonnet'],
    reasoning: 'GPT-4 best at structured data extraction with high accuracy',
  },
  {
    taskType: 'mixed',
    primary: 'gpt-4',
    fallback: ['claude-3.5-sonnet', 'gemini-1.5-pro'],
    reasoning: 'GPT-4 most balanced for multi-faceted tasks',
  },
];

/**
 * Default router configuration
 */
export const DEFAULT_ROUTER_CONFIG: RouterConfig = {
  rules: DEFAULT_ROUTING_RULES,
  preferCheap: false,
  preferFast: false,
  allowFallback: true,
  maxCostPerRequest: 0.50, // $0.50 hard limit
};

/**
 * Task type keywords for classification
 */
export const TASK_TYPE_KEYWORDS: Record<TaskType, string[]> = {
  technical: [
    'code',
    'programming',
    'debug',
    'algorithm',
    'function',
    'API',
    'technical',
    'implementation',
    'architecture',
    'system design',
    'database',
    'performance',
  ],
  strategic: [
    'strategy',
    'business',
    'decision',
    'plan',
    'approach',
    'recommendation',
    'positioning',
    'competitive',
    'market',
    'growth',
    'vision',
  ],
  analytical: [
    'analyze',
    'analysis',
    'data',
    'calculate',
    'metrics',
    'statistics',
    'compare',
    'evaluate',
    'measure',
    'trend',
    'pattern',
  ],
  creative: [
    'write',
    'create',
    'brainstorm',
    'ideas',
    'creative',
    'story',
    'content',
    'marketing',
    'copy',
    'narrative',
  ],
  classification: [
    'classify',
    'categorize',
    'label',
    'tag',
    'identify',
    'determine',
    'is this',
    'which category',
    'type of',
  ],
  summarization: [
    'summarize',
    'summary',
    'overview',
    'brief',
    'key points',
    'main ideas',
    'condense',
    'TLDR',
  ],
  extraction: [
    'extract',
    'parse',
    'find',
    'list',
    'identify',
    'get',
    'retrieve',
    'pull out',
    'structured data',
  ],
  mixed: [
    // Fallback category
  ],
};
