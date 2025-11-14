/**
 * Aliff AI - Output Filtering Module
 *
 * Main export for output filtering, semantic detection, and filter rules.
 */

// Export types
export * from './types';

// Export engine
export * from './engine';
export { FilterEngine } from './engine';

// Export semantic detector
export * from './semantic';
export { SemanticDetector } from './semantic';

// Convenience re-exports
import { FilterEngine } from './engine';
import { SemanticDetector } from './semantic';

/**
 * Main Filter API
 */
export const Filter = {
  // Engine methods
  initialize: FilterEngine.initialize,
  getConfig: FilterEngine.getConfig,
  addRule: FilterEngine.addRule,
  removeRule: FilterEngine.removeRule,
  updateRule: FilterEngine.updateRule,
  filter: FilterEngine.filter,
  testRule: FilterEngine.testRule,

  // Semantic detection methods
  detectContent: SemanticDetector.detectContent,
  classify: SemanticDetector.classify,
  containsSensitive: SemanticDetector.containsSensitive,
} as const;

export default Filter;
