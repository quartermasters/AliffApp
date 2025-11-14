/**
 * Aliff AI - Embedding Generation
 *
 * Generates vector embeddings for text using OpenAI's embedding models.
 * Used by the RAG system for semantic search.
 */

import OpenAI from 'openai';
import { DEFAULT_EMBEDDING_CONFIG, type EmbeddingConfig } from '../types';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

/**
 * Generate embedding for a single text
 *
 * @param text - The text to embed
 * @param config - Optional embedding configuration
 * @returns Vector embedding as number array
 */
export async function embedText(
  text: string,
  config: EmbeddingConfig = DEFAULT_EMBEDDING_CONFIG
): Promise<number[]> {
  try {
    // Validate input
    if (!text || text.trim().length === 0) {
      throw new Error('Cannot embed empty text');
    }

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable not set');
    }

    // Generate embedding
    const response = await openai.embeddings.create({
      model: config.model,
      input: text.trim(),
      dimensions: config.dimensions,
    });

    // Extract embedding vector
    const embedding = response.data[0].embedding;

    if (!embedding || embedding.length !== config.dimensions) {
      throw new Error(
        `Expected embedding of ${config.dimensions} dimensions, got ${embedding?.length || 0}`
      );
    }

    return embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error(
      `Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate embeddings for multiple texts in batch
 *
 * @param texts - Array of texts to embed
 * @param config - Optional embedding configuration
 * @returns Array of vector embeddings
 */
export async function embedBatch(
  texts: string[],
  config: EmbeddingConfig = DEFAULT_EMBEDDING_CONFIG
): Promise<number[][]> {
  try {
    // Validate input
    if (!texts || texts.length === 0) {
      throw new Error('Cannot embed empty text array');
    }

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable not set');
    }

    // Filter out empty texts
    const validTexts = texts.filter((t) => t && t.trim().length > 0);

    if (validTexts.length === 0) {
      throw new Error('No valid texts to embed');
    }

    // Process in batches to avoid API limits
    const batchSize = config.batchSize;
    const embeddings: number[][] = [];

    for (let i = 0; i < validTexts.length; i += batchSize) {
      const batch = validTexts.slice(i, i + batchSize);

      const response = await openai.embeddings.create({
        model: config.model,
        input: batch.map((t) => t.trim()),
        dimensions: config.dimensions,
      });

      // Extract embeddings from response
      const batchEmbeddings = response.data.map((item) => item.embedding);
      embeddings.push(...batchEmbeddings);
    }

    // Validate all embeddings have correct dimensions
    for (const embedding of embeddings) {
      if (embedding.length !== config.dimensions) {
        throw new Error(
          `Embedding dimension mismatch: expected ${config.dimensions}, got ${embedding.length}`
        );
      }
    }

    return embeddings;
  } catch (error) {
    console.error('Error generating batch embeddings:', error);
    throw new Error(
      `Failed to generate batch embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Calculate cosine similarity between two embeddings
 *
 * @param a - First embedding vector
 * @param b - Second embedding vector
 * @returns Similarity score between -1 and 1 (1 = identical, -1 = opposite)
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Embeddings must have same dimensions');
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Normalize embedding vector to unit length
 * Useful for faster similarity calculations
 *
 * @param embedding - Embedding vector to normalize
 * @returns Normalized embedding vector
 */
export function normalizeEmbedding(embedding: number[]): number[] {
  const magnitude = Math.sqrt(
    embedding.reduce((sum, val) => sum + val * val, 0)
  );

  if (magnitude === 0) {
    return embedding;
  }

  return embedding.map((val) => val / magnitude);
}

/**
 * Estimate token count for text (rough approximation)
 * Used for cost estimation
 *
 * @param text - Text to count tokens for
 * @returns Estimated token count
 */
export function estimateTokens(text: string): number {
  // Rough estimate: ~4 characters per token on average
  return Math.ceil(text.length / 4);
}

/**
 * Calculate estimated cost for embedding text
 *
 * @param text - Text to calculate cost for
 * @param model - Embedding model to use
 * @returns Estimated cost in USD
 */
export function estimateEmbeddingCost(
  text: string,
  model: 'text-embedding-3-small' | 'text-embedding-3-large' = 'text-embedding-3-small'
): number {
  const tokens = estimateTokens(text);

  // Pricing as of 2024 (verify with current OpenAI pricing)
  const costPer1kTokens = model === 'text-embedding-3-small' ? 0.00002 : 0.00013;

  return (tokens / 1000) * costPer1kTokens;
}
