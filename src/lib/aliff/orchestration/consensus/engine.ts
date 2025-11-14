/**
 * Aliff AI - Consensus Engine
 *
 * Main consensus engine that combines multiple AI model outputs
 * using various strategies to achieve higher accuracy.
 */

import type { AIResponse, ConsensusResult, ConsensusMethod } from '../types';
import type {
  ConsensusConfig,
  AgreementAnalysis,
  ConsensusValidation,
} from './types';
import { DEFAULT_CONSENSUS_CONFIGS } from './types';
import { ConsensusStrategies } from './strategies';

/**
 * Current consensus configuration
 */
let currentConfig: Record<ConsensusMethod, ConsensusConfig> =
  DEFAULT_CONSENSUS_CONFIGS;

/**
 * Initialize consensus engine
 */
export function initializeConsensus(
  configs?: Partial<Record<ConsensusMethod, Partial<ConsensusConfig>>>
): void {
  if (configs) {
    for (const [method, config] of Object.entries(configs)) {
      currentConfig[method as ConsensusMethod] = {
        ...DEFAULT_CONSENSUS_CONFIGS[method as ConsensusMethod],
        ...config,
      };
    }
  }

  console.log('[Consensus] Engine initialized');
}

/**
 * Get consensus configuration
 */
export function getConsensusConfig(
  method: ConsensusMethod
): ConsensusConfig {
  return { ...currentConfig[method] };
}

/**
 * Build consensus from multiple AI responses
 */
export async function buildConsensus(
  responses: AIResponse[],
  method?: ConsensusMethod
): Promise<ConsensusResult> {
  if (responses.length === 0) {
    throw new Error('No responses to build consensus from');
  }

  if (responses.length === 1) {
    // Single response - no consensus needed
    return {
      method: 'semantic-similarity',
      result: responses[0].content,
      confidence: 0.7,
      agreement: 1.0,
    };
  }

  // Auto-select consensus method if not specified
  const consensusMethod = method || selectConsensusMethod(responses);

  // Apply consensus strategy
  let result: ConsensusResult;

  switch (consensusMethod) {
    case 'majority-vote':
      result = await ConsensusStrategies.majorityVote(responses);
      break;

    case 'weighted-average':
      result = await ConsensusStrategies.weightedAverage(responses);
      break;

    case 'semantic-similarity':
      result = await ConsensusStrategies.semanticSimilarity(responses);
      break;

    case 'longest-common':
      result = await ConsensusStrategies.longestCommon(responses);
      break;

    case 'confidence-weighted':
      result = await ConsensusStrategies.confidenceWeighted(responses);
      break;

    case 'tiebreaker':
      // Tiebreaker requires calling a 3rd model - not implemented here
      // Fall back to semantic similarity
      result = await ConsensusStrategies.semanticSimilarity(responses);
      break;

    default:
      throw new Error(`Unsupported consensus method: ${consensusMethod}`);
  }

  // Validate consensus
  const validation = validateConsensus(result, consensusMethod);

  // Add validation warnings to result
  if (validation.warnings.length > 0) {
    console.warn('[Consensus] Validation warnings:', validation.warnings);
  }

  return {
    ...result,
    requiresReview: validation.requiresReview || result.requiresReview,
  };
}

/**
 * Auto-select best consensus method based on responses
 */
function selectConsensusMethod(responses: AIResponse[]): ConsensusMethod {
  // Check if responses look like classifications (short, similar structure)
  const avgLength =
    responses.reduce((sum, r) => sum + r.content.length, 0) / responses.length;

  if (avgLength < 50) {
    // Short responses - likely classification
    return 'majority-vote';
  }

  // Check if responses contain numbers (likely scoring)
  const hasNumbers = responses.some((r) => /\d+(?:\.\d+)?/.test(r.content));

  if (hasNumbers) {
    return 'weighted-average';
  }

  // Default to semantic similarity for text
  return 'semantic-similarity';
}

/**
 * Validate consensus result
 */
function validateConsensus(
  result: ConsensusResult,
  method: ConsensusMethod
): ConsensusValidation {
  const config = currentConfig[method];
  const warnings: string[] = [];

  // Check minimum agreement
  const hasMinAgreement = result.agreement >= config.minAgreement;
  if (!hasMinAgreement) {
    warnings.push(
      `Low agreement: ${(result.agreement * 100).toFixed(1)}% (min: ${(config.minAgreement * 100).toFixed(1)}%)`
    );
  }

  // Check confidence
  const hasMinConfidence = result.confidence >= config.confidenceThreshold;
  if (!hasMinConfidence) {
    warnings.push(
      `Low confidence: ${(result.confidence * 100).toFixed(1)}% (min: ${(config.confidenceThreshold * 100).toFixed(1)}%)`
    );
  }

  // Check for disagreements
  if (result.disagreements && result.disagreements.length > 0) {
    warnings.push(
      `${result.disagreements.length} model(s) disagreed with consensus`
    );
  }

  const isValid = hasMinAgreement && hasMinConfidence;
  const requiresReview =
    !isValid || config.requireHumanReview || warnings.length > 0;

  return {
    isValid,
    confidence: result.confidence,
    warnings,
    requiresReview,
  };
}

/**
 * Analyze agreement between responses
 */
export async function analyzeAgreement(
  responses: AIResponse[]
): Promise<AgreementAnalysis> {
  if (responses.length < 2) {
    return {
      agreementScore: 1.0,
      similarities: [],
      divergences: [],
    };
  }

  // Calculate pairwise similarities (simplified - could use embeddings)
  const similarities: Array<{
    model1: string;
    model2: string;
    similarity: number;
  }> = [];

  for (let i = 0; i < responses.length; i++) {
    for (let j = i + 1; j < responses.length; j++) {
      const r1 = responses[i];
      const r2 = responses[j];

      // Simple similarity: Jaccard similarity of words
      const words1 = new Set(r1.content.toLowerCase().split(/\s+/));
      const words2 = new Set(r2.content.toLowerCase().split(/\s+/));

      const intersection = new Set(
        [...words1].filter((w) => words2.has(w))
      );
      const union = new Set([...words1, ...words2]);

      const similarity = intersection.size / union.size;

      similarities.push({
        model1: r1.model,
        model2: r2.model,
        similarity,
      });
    }
  }

  // Calculate overall agreement score
  const agreementScore =
    similarities.reduce((sum, s) => sum + s.similarity, 0) /
    similarities.length;

  // Find divergences (similarity < 0.5)
  const divergences = similarities
    .filter((s) => s.similarity < 0.5)
    .map((s) => ({
      models: [s.model1, s.model2] as any,
      reason: `Low similarity: ${(s.similarity * 100).toFixed(1)}%`,
    }));

  return {
    agreementScore,
    similarities: similarities.map((s) => ({
      model1: s.model1 as any,
      model2: s.model2 as any,
      similarity: s.similarity,
    })),
    divergences,
  };
}

/**
 * Check if consensus requires human review
 */
export function requiresHumanReview(result: ConsensusResult): boolean {
  return result.requiresReview || result.confidence < 0.7;
}

/**
 * Get consensus confidence level
 */
export function getConfidenceLevel(
  confidence: number
): 'high' | 'medium' | 'low' {
  if (confidence >= 0.85) return 'high';
  if (confidence >= 0.7) return 'medium';
  return 'low';
}

/**
 * Export consensus engine API
 */
export const Consensus = {
  initialize: initializeConsensus,
  getConfig: getConsensusConfig,
  build: buildConsensus,
  analyzeAgreement,
  requiresHumanReview,
  getConfidenceLevel,
} as const;

export default Consensus;
