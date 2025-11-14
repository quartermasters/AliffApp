/**
 * Aliff AI - Task Router Engine
 *
 * Analyzes tasks and routes them to the best AI model
 * based on task type, cost, latency, and accuracy requirements.
 */

import type { AIModel, TaskType } from '../types';
import type {
  TaskClassification,
  RoutingDecision,
  TaskAnalysis,
  RouterConfig,
} from './types';
import { DEFAULT_ROUTER_CONFIG, TASK_TYPE_KEYWORDS } from './types';
import { MODEL_INFO } from '../types';
import { estimateTokens } from '../models';

/**
 * Current router configuration
 */
let currentConfig: RouterConfig = DEFAULT_ROUTER_CONFIG;

/**
 * Initialize router with custom configuration
 */
export function initializeRouter(config?: Partial<RouterConfig>): void {
  currentConfig = {
    ...DEFAULT_ROUTER_CONFIG,
    ...config,
  };

  console.log('[Router] Initialized:', {
    rules: currentConfig.rules.length,
    preferCheap: currentConfig.preferCheap,
    preferFast: currentConfig.preferFast,
  });
}

/**
 * Get current router configuration
 */
export function getRouterConfig(): RouterConfig {
  return { ...currentConfig };
}

/**
 * Classify task type from prompt
 */
export function classifyTask(prompt: string): TaskClassification {
  const lowerPrompt = prompt.toLowerCase();
  const scores: Record<TaskType, { score: number; matches: string[] }> = {
    technical: { score: 0, matches: [] },
    strategic: { score: 0, matches: [] },
    analytical: { score: 0, matches: [] },
    creative: { score: 0, matches: [] },
    classification: { score: 0, matches: [] },
    summarization: { score: 0, matches: [] },
    extraction: { score: 0, matches: [] },
    mixed: { score: 0, matches: [] },
  };

  // Score each task type based on keyword matches
  for (const [taskType, keywords] of Object.entries(TASK_TYPE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerPrompt.includes(keyword.toLowerCase())) {
        scores[taskType as TaskType].score++;
        scores[taskType as TaskType].matches.push(keyword);
      }
    }
  }

  // Find highest scoring task type
  let maxScore = 0;
  let bestType: TaskType = 'mixed';
  let indicators: string[] = [];

  for (const [taskType, data] of Object.entries(scores)) {
    if (data.score > maxScore) {
      maxScore = data.score;
      bestType = taskType as TaskType;
      indicators = data.matches;
    }
  }

  // If no clear match, analyze structure
  if (maxScore === 0) {
    if (lowerPrompt.includes('?') && lowerPrompt.length < 100) {
      bestType = 'classification';
      indicators = ['short question'];
    } else if (lowerPrompt.startsWith('write') || lowerPrompt.startsWith('create')) {
      bestType = 'creative';
      indicators = ['imperative verb'];
    } else {
      bestType = 'mixed';
      indicators = ['no clear indicators'];
    }
  }

  // Calculate confidence
  const confidence = maxScore > 0 ? Math.min(maxScore / 5, 1.0) : 0.3;

  return {
    taskType: bestType,
    confidence,
    reasoning: `Classified as ${bestType} based on ${indicators.length} indicators`,
    indicators,
  };
}

/**
 * Analyze task characteristics
 */
export function analyzeTask(prompt: string, systemPrompt?: string): TaskAnalysis {
  const classification = classifyTask(prompt);

  // Analyze complexity
  let complexity: 'simple' | 'medium' | 'complex' = 'medium';
  if (prompt.length < 100) complexity = 'simple';
  else if (prompt.length > 500) complexity = 'complex';

  // Determine characteristics
  const characteristics = {
    length: prompt.length,
    complexity,
    domain: classification.indicators,
    requiresReasoning: classification.taskType === 'technical' || classification.taskType === 'analytical',
    requiresCreativity: classification.taskType === 'creative' || classification.taskType === 'strategic',
    requiresData: classification.taskType === 'analytical' || classification.taskType === 'extraction',
  };

  // Estimate tokens
  const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
  const estimatedInputTokens = estimateTokens(fullPrompt);

  // Estimate output tokens based on task type and complexity
  let estimatedOutputTokens = 500; // Default
  if (classification.taskType === 'summarization') {
    estimatedOutputTokens = Math.min(estimatedInputTokens / 4, 1000);
  } else if (classification.taskType === 'classification') {
    estimatedOutputTokens = 100;
  } else if (complexity === 'complex') {
    estimatedOutputTokens = 1500;
  }

  return {
    prompt,
    classification,
    characteristics,
    estimatedInputTokens,
    estimatedOutputTokens,
  };
}

/**
 * Route task to best model
 */
export function routeTask(
  prompt: string,
  systemPrompt?: string,
  options?: {
    preferCheap?: boolean;
    preferFast?: boolean;
    taskType?: TaskType; // Override auto-classification
  }
): RoutingDecision {
  // Analyze task
  const analysis = analyzeTask(prompt, systemPrompt);
  const taskType = options?.taskType || analysis.classification.taskType;

  // Find matching routing rule
  const rule = currentConfig.rules.find((r) => r.taskType === taskType);

  if (!rule) {
    throw new Error(`No routing rule found for task type: ${taskType}`);
  }

  let primary = rule.primary;
  const fallback = [...rule.fallback];

  // Apply cost/speed preferences
  const preferCheap = options?.preferCheap ?? currentConfig.preferCheap;
  const preferFast = options?.preferFast ?? currentConfig.preferFast;

  if (preferCheap) {
    // Re-route to cheapest model if task is simple
    if (analysis.characteristics.complexity === 'simple') {
      primary = 'gemini-1.5-pro';
      fallback.unshift(rule.primary); // Original primary becomes fallback
    }
  }

  if (preferFast) {
    // Re-route to fastest model
    if (MODEL_INFO[primary].speed !== 'fast') {
      const fastModel = fallback.find((m) => MODEL_INFO[m].speed === 'fast');
      if (fastModel) {
        fallback.unshift(primary);
        primary = fastModel;
      }
    }
  }

  // Estimate cost
  const primaryInfo = MODEL_INFO[primary];
  const inputCost =
    (analysis.estimatedInputTokens / 1000) * primaryInfo.pricing.inputPer1K;
  const outputCost =
    (analysis.estimatedOutputTokens / 1000) * primaryInfo.pricing.outputPer1K;
  const estimatedCost = inputCost + outputCost;

  // Check against max cost
  if (estimatedCost > currentConfig.maxCostPerRequest) {
    console.warn(
      `[Router] Estimated cost $${estimatedCost.toFixed(4)} exceeds max $${currentConfig.maxCostPerRequest}`
    );

    // Try to find cheaper model
    const cheaperModel = [primary, ...fallback].find((model) => {
      const info = MODEL_INFO[model];
      const cost =
        (analysis.estimatedInputTokens / 1000) * info.pricing.inputPer1K +
        (analysis.estimatedOutputTokens / 1000) * info.pricing.outputPer1K;
      return cost <= currentConfig.maxCostPerRequest;
    });

    if (cheaperModel && cheaperModel !== primary) {
      console.log(`[Router] Switching to cheaper model: ${cheaperModel}`);
      fallback.unshift(primary);
      primary = cheaperModel;
    }
  }

  // Estimate latency (rough)
  let estimatedLatency = 2000; // Default 2s
  if (primaryInfo.speed === 'fast') estimatedLatency = 1000;
  if (primaryInfo.speed === 'slow') estimatedLatency = 3000;

  // Adjust for output length
  estimatedLatency += (analysis.estimatedOutputTokens / 100) * 100;

  return {
    primary,
    fallback,
    reasoning: `${rule.reasoning}. Task type: ${taskType}, complexity: ${analysis.characteristics.complexity}`,
    estimatedCost,
    estimatedLatency,
    confidence: analysis.classification.confidence,
  };
}

/**
 * Get best model for task type
 */
export function getBestModel(taskType: TaskType): AIModel {
  const rule = currentConfig.rules.find((r) => r.taskType === taskType);
  return rule?.primary || 'gpt-4';
}

/**
 * Get all suitable models for task type (ordered by preference)
 */
export function getSuitableModels(taskType: TaskType): AIModel[] {
  const rule = currentConfig.rules.find((r) => r.taskType === taskType);
  return rule ? [rule.primary, ...rule.fallback] : ['gpt-4', 'claude-3.5-sonnet', 'gemini-1.5-pro'];
}

/**
 * Compare models for a specific task
 */
export function compareModels(
  prompt: string,
  models: AIModel[],
  systemPrompt?: string
): Array<{
  model: AIModel;
  estimatedCost: number;
  estimatedLatency: number;
  suitability: number; // 0.0-1.0
}> {
  const analysis = analyzeTask(prompt, systemPrompt);
  const taskType = analysis.classification.taskType;

  return models.map((model) => {
    const info = MODEL_INFO[model];

    // Calculate cost
    const inputCost =
      (analysis.estimatedInputTokens / 1000) * info.pricing.inputPer1K;
    const outputCost =
      (analysis.estimatedOutputTokens / 1000) * info.pricing.outputPer1K;
    const estimatedCost = inputCost + outputCost;

    // Estimate latency
    let estimatedLatency = 2000;
    if (info.speed === 'fast') estimatedLatency = 1000;
    if (info.speed === 'slow') estimatedLatency = 3000;
    estimatedLatency += (analysis.estimatedOutputTokens / 100) * 100;

    // Calculate suitability (0.0-1.0)
    let suitability = 0.5; // Base suitability
    if (info.recommendedFor.includes(taskType)) {
      suitability = 0.9;
    } else if (info.strengths.some((s) => analysis.classification.indicators.includes(s.toLowerCase()))) {
      suitability = 0.7;
    }

    return {
      model,
      estimatedCost,
      estimatedLatency,
      suitability,
    };
  }).sort((a, b) => b.suitability - a.suitability);
}

/**
 * Export router engine API
 */
export const Router = {
  initialize: initializeRouter,
  getConfig: getRouterConfig,
  classifyTask,
  analyzeTask,
  routeTask,
  getBestModel,
  getSuitableModels,
  compareModels,
} as const;

export default Router;
