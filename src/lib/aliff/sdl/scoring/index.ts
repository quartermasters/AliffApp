/**
 * Aliff AI - SDL Scoring Module
 *
 * Complexity and win probability scoring.
 */

// Export types
export * from './types';

// Export prompts
export * from './prompts';

// Export scorer
export * from './scorer';
export { scoreOpportunity, getComplexityLevel, getScoringsSummary } from './scorer';

/**
 * Main scoring API
 */
export { scoreOpportunity as default } from './scorer';
