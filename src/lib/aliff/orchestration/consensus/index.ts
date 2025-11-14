/**
 * Aliff AI - Consensus Module
 *
 * Main export for consensus engine, strategies, and types.
 */

// Export types
export * from './types';

// Export strategies
export * from './strategies';
export { ConsensusStrategies } from './strategies';

// Export engine
export * from './engine';
import { Consensus } from './engine';
export { Consensus };

export default Consensus;
