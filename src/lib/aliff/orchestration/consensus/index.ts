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
export { Consensus } from './engine';

export default Consensus;
