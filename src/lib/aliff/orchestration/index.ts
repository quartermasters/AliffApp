/**
 * Aliff AI - Multi-AI Orchestration Module
 *
 * Main export for multi-AI orchestration system.
 * Coordinates GPT-4, Claude, and Gemini for consensus-based AI responses.
 */

// Export types
export * from './types';

// Export models
export * from './models';
export { Models } from './models';

// Export router
export * from './router';
export { Router } from './router';

// Export consensus
export * from './consensus';
export { Consensus } from './consensus';

// Export cost tracking
export * from './cost';
export { CostTracker } from './cost';

// Export orchestrator
export * from './orchestrator';
export { Orchestrator } from './orchestrator';

// Convenience default export
import { Orchestrator } from './orchestrator';
export default Orchestrator;
