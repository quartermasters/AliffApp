/**
 * Aliff AI - SDL Triage Module
 *
 * Complete RFP/solicitation triage orchestration.
 */

// Export types
export * from './types';

// Export orchestrator
export * from './orchestrator';
export { runTriage, runBatchTriage } from './orchestrator';

// Export reporter
export * from './reporter';
export {
  generateExecutiveReport,
  generateBatchReport,
  generateJSONReport,
  generateConciseSummary,
} from './reporter';

/**
 * Main triage API
 */
export { runTriage as default } from './orchestrator';
