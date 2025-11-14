/**
 * Aliff AI - RAG System Main Interface
 *
 * This is the main entry point for the Retrieval-Augmented Generation (RAG) system.
 * All 5 Aliff roles use this system to retrieve knowledge.
 */

// Export all types
export * from '../types';

// Export embedding functions
export {
  embedText,
  embedBatch,
  cosineSimilarity,
  normalizeEmbedding,
  estimateTokens,
  estimateEmbeddingCost,
} from './embeddings';

// Export storage functions
export {
  initializePinecone,
  getPineconeIndex,
  storeDocument,
  storeBatch,
  deleteDocument,
  deleteBatch,
  updateDocument,
  getIndexStats,
} from './storage';

// Export retrieval functions
export {
  retrieveKnowledge,
  retrieveKnowledgeSecure,
  retrieveSimilar,
} from './retrieval';

// Re-export for convenience
import { retrieveKnowledgeSecure } from './retrieval';
import { storeDocument, storeBatch } from './storage';
import { embedText } from './embeddings';

/**
 * Main RAG interface - convenience export
 */
export const RAG = {
  // Retrieval
  retrieve: retrieveKnowledgeSecure,

  // Storage
  store: storeDocument,
  storeBatch,

  // Embedding
  embed: embedText,
} as const;

/**
 * Default export
 */
export default RAG;
