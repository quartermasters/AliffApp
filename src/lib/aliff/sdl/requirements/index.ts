/**
 * Aliff AI - SDL Requirements Module
 *
 * Extraction and analysis of solicitation requirements.
 */

// Export types
export * from './types';

// Export prompts
export * from './prompts';

// Export extractor
export * from './extractor';
export {
  extractRequirements,
  filterByPriority,
  filterByCategory,
  searchRequirements,
  getHighComplexityRequirements,
  getRequirementsStats,
} from './extractor';

/**
 * Main requirements API
 */
export { extractRequirements as default } from './extractor';
