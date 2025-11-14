/**
 * Aliff AI - SDL Compliance Module
 *
 * Compliance framework detection and gap analysis.
 */

// Export types
export * from './types';

// Export prompts
export * from './prompts';

// Export analyzer
export * from './analyzer';
export {
  analyzeCompliance,
  getHighPriorityGaps,
  getGapsByImpact,
  calculateRemediationCost,
  getComplianceSummary,
} from './analyzer';

/**
 * Main compliance API
 */
export { analyzeCompliance as default } from './analyzer';
