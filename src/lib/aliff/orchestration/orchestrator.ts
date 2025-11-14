/**
 * Aliff AI - Main Orchestrator
 *
 * Coordinates multiple AI models to achieve consensus on complex tasks.
 * This is the primary interface for multi-AI orchestration.
 */

import type {
  AIModel,
  OrchestrationRequest,
  OrchestrationResult,
  OrchestrationStrategy,
  AIRequest,
  TaskType,
} from './types';
import { Models } from './models';
import { Router } from './router';
import { Consensus } from './consensus';
import { CostTracker } from './cost';
import { AuditLogger } from '../security/audit';

/**
 * Orchestrate AI request with automatic routing and consensus
 */
export async function orchestrate(
  request: OrchestrationRequest
): Promise<OrchestrationResult> {
  const startTime = Date.now();

  // Determine strategy
  const strategy = request.strategy || 'single';

  // Determine which models to use
  let modelsToUse: AIModel[];

  if (request.models && request.models.length > 0) {
    // User specified models
    modelsToUse = request.models;
  } else {
    // Auto-select models based on strategy and task
    modelsToUse = selectModels(strategy, request.prompt, request.systemPrompt, request.taskType);
  }

  // Prepare AI request
  const aiRequest: AIRequest = {
    prompt: request.prompt,
    systemPrompt: request.systemPrompt,
    temperature: request.temperature,
    maxTokens: request.maxTokens,
  };

  // Execute strategy
  let responses;
  let consensusResult;

  if (strategy === 'single' || modelsToUse.length === 1) {
    // Single model - no consensus needed
    const response = await Models.call(modelsToUse[0], aiRequest);
    responses = [response];
  } else {
    // Multiple models - need consensus
    responses = await Models.callMultiple(modelsToUse, aiRequest);

    // Build consensus if required
    if (request.requireConsensus !== false && responses.length > 1) {
      consensusResult = await Consensus.build(responses);
    }
  }

  // Track costs
  const taskType = request.taskType || Router.classifyTask(request.prompt).taskType;
  CostTracker.trackMultiple(responses, {
    taskType,
    userId: request.userId,
    sessionId: request.sessionId,
  });

  // Determine primary response
  const primary = consensusResult
    ? {
        ...responses[0],
        content: consensusResult.result,
      }
    : responses[0];

  // Calculate totals
  const totalCost = responses.reduce((sum, r) => sum + r.cost, 0);
  const totalLatencyMs = Date.now() - startTime;

  // Build result
  const result: OrchestrationResult = {
    strategy,
    responses,
    consensus: consensusResult,
    primary,
    totalCost,
    totalLatencyMs,
    timestamp: new Date(),
    metadata: {
      modelsUsed: modelsToUse,
      taskType,
      routing: consensusResult
        ? `Multi-model (${modelsToUse.join(', ')})`
        : `Single model (${modelsToUse[0]})`,
    },
  };

  // Log orchestration
  if (request.userId || request.sessionId) {
    await AuditLogger.logResponse(
      request.prompt,
      primary.content,
      'OPS', // Orchestration = OPS role
      responses.map((r) => r.model),
      totalLatencyMs,
      false,
      request.userId,
      request.sessionId,
      {
        model: modelsToUse.join(','),
        tokensUsed: responses.reduce((sum, r) => sum + r.usage.totalTokens, 0),
        cost: totalCost,
      }
    );
  }

  return result;
}

/**
 * Select models based on strategy and task
 */
function selectModels(
  strategy: OrchestrationStrategy,
  prompt: string,
  systemPrompt?: string,
  taskType?: TaskType
): AIModel[] {
  switch (strategy) {
    case 'single': {
      // Route to single best model
      const routing = Router.routeTask(prompt, systemPrompt, { taskType });
      return [routing.primary];
    }

    case 'dual': {
      // Route to primary + first fallback
      const routing = Router.routeTask(prompt, systemPrompt, { taskType });
      return [routing.primary, routing.fallback[0]];
    }

    case 'triple': {
      // Route to primary + first two fallbacks
      const routing = Router.routeTask(prompt, systemPrompt, { taskType });
      return [routing.primary, routing.fallback[0], routing.fallback[1]];
    }

    case 'custom':
      // Should never reach here (custom requires explicit models)
      return ['gpt-4'];

    default:
      return ['gpt-4'];
  }
}

/**
 * Orchestrate with specific models (bypass routing)
 */
export async function orchestrateWith(
  models: AIModel[],
  request: Omit<OrchestrationRequest, 'models' | 'strategy'>
): Promise<OrchestrationResult> {
  return orchestrate({
    ...request,
    models,
    strategy: 'custom',
  });
}

/**
 * Quick orchestration for simple tasks (single model)
 */
export async function ask(
  prompt: string,
  options?: {
    systemPrompt?: string;
    model?: AIModel;
    temperature?: number;
    userId?: string;
    sessionId?: string;
  }
): Promise<string> {
  const result = await orchestrate({
    prompt,
    systemPrompt: options?.systemPrompt,
    models: options?.model ? [options.model] : undefined,
    strategy: 'single',
    temperature: options?.temperature,
    userId: options?.userId,
    sessionId: options?.sessionId,
  });

  return result.primary.content;
}

/**
 * Orchestrate with consensus (dual or triple)
 */
export async function askWithConsensus(
  prompt: string,
  options?: {
    systemPrompt?: string;
    strategy?: 'dual' | 'triple';
    taskType?: string;
    temperature?: number;
    userId?: string;
    sessionId?: string;
  }
): Promise<OrchestrationResult> {
  return orchestrate({
    prompt,
    systemPrompt: options?.systemPrompt,
    strategy: options?.strategy || 'dual',
    taskType: options?.taskType,
    requireConsensus: true,
    temperature: options?.temperature,
    userId: options?.userId,
    sessionId: options?.sessionId,
  });
}

/**
 * Compare responses from all models (for testing/evaluation)
 */
export async function compareModels(
  prompt: string,
  systemPrompt?: string
): Promise<OrchestrationResult> {
  return orchestrate({
    prompt,
    systemPrompt,
    models: ['gpt-4', 'claude-3.5-sonnet', 'gemini-1.5-pro'],
    strategy: 'custom',
    requireConsensus: true,
  });
}

/**
 * Export orchestrator API
 */
export const Orchestrator = {
  orchestrate,
  orchestrateWith,
  ask,
  askWithConsensus,
  compareModels,
} as const;

export default Orchestrator;
