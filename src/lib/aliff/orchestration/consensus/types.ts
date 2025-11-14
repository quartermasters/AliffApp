/**
 * Aliff AI - Consensus Types
 *
 * Defines schemas for combining outputs from multiple AI models
 * to achieve consensus and higher accuracy.
 */

import type { AIModel, AIResponse, ConsensusMethod } from '../types';

/**
 * Consensus strategy configuration
 */
export interface ConsensusConfig {
  method: ConsensusMethod;
  minAgreement: number; // 0.0-1.0 (minimum agreement to accept consensus)
  requireHumanReview: boolean; // Flag low-confidence results for review
  confidenceThreshold: number; // 0.0-1.0 (below this = low confidence)
}

/**
 * Agreement analysis between responses
 */
export interface AgreementAnalysis {
  agreementScore: number; // 0.0-1.0
  similarities: Array<{
    model1: AIModel;
    model2: AIModel;
    similarity: number; // 0.0-1.0
  }>;
  divergences: Array<{
    models: AIModel[];
    reason: string;
  }>;
}

/**
 * Consensus validation result
 */
export interface ConsensusValidation {
  isValid: boolean;
  confidence: number; // 0.0-1.0
  warnings: string[];
  requiresReview: boolean;
}

/**
 * Tiebreaker request
 */
export interface TiebreakerRequest {
  originalResponses: AIResponse[];
  question: string;
  context?: string;
}

/**
 * Default consensus configurations
 */
export const DEFAULT_CONSENSUS_CONFIGS: Record<
  ConsensusMethod,
  ConsensusConfig
> = {
  'majority-vote': {
    method: 'majority-vote',
    minAgreement: 0.5, // At least 50% must agree
    requireHumanReview: false,
    confidenceThreshold: 0.7,
  },
  'weighted-average': {
    method: 'weighted-average',
    minAgreement: 0.6,
    requireHumanReview: false,
    confidenceThreshold: 0.7,
  },
  'semantic-similarity': {
    method: 'semantic-similarity',
    minAgreement: 0.7, // Require 70% similarity
    requireHumanReview: true, // Text consensus may need review
    confidenceThreshold: 0.75,
  },
  'tiebreaker': {
    method: 'tiebreaker',
    minAgreement: 0.5,
    requireHumanReview: false,
    confidenceThreshold: 0.6,
  },
  'longest-common': {
    method: 'longest-common',
    minAgreement: 0.5,
    requireHumanReview: true,
    confidenceThreshold: 0.65,
  },
  'confidence-weighted': {
    method: 'confidence-weighted',
    minAgreement: 0.7,
    requireHumanReview: false,
    confidenceThreshold: 0.75,
  },
};
