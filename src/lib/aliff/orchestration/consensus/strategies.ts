/**
 * Aliff AI - Consensus Strategies
 *
 * Implements different consensus algorithms for combining
 * outputs from multiple AI models.
 */

import type { AIResponse, ConsensusResult, ConsensusMethod } from '../types';
import { embedText } from '../../rag/embeddings';

/**
 * Majority vote consensus (for classification/boolean tasks)
 */
export async function majorityVote(
  responses: AIResponse[]
): Promise<ConsensusResult> {
  if (responses.length === 0) {
    throw new Error('No responses to consensus');
  }

  // Count votes for each unique response
  const votes = new Map<string, { count: number; models: string[] }>();

  for (const response of responses) {
    const content = response.content.trim().toLowerCase();
    const existing = votes.get(content);

    if (existing) {
      existing.count++;
      existing.models.push(response.model);
    } else {
      votes.set(content, { count: 1, models: [response.model] });
    }
  }

  // Find majority
  let maxVotes = 0;
  let winner: string = '';
  let winnerModels: string[] = [];

  for (const [content, data] of votes) {
    if (data.count > maxVotes) {
      maxVotes = data.count;
      winner = content;
      winnerModels = data.models;
    }
  }

  // Calculate agreement
  const agreement = maxVotes / responses.length;

  // Calculate confidence
  const confidence = agreement;

  // Find disagreements
  const disagreements = responses
    .filter((r) => r.content.trim().toLowerCase() !== winner)
    .map((r) => ({
      model: r.model,
      response: r.content,
      reason: 'Different classification',
    }));

  return {
    method: 'majority-vote',
    result: winner,
    confidence,
    agreement,
    disagreements: disagreements.length > 0 ? disagreements : undefined,
    requiresReview: agreement < 0.7,
  };
}

/**
 * Weighted average consensus (for scoring tasks)
 */
export async function weightedAverage(
  responses: AIResponse[]
): Promise<ConsensusResult> {
  if (responses.length === 0) {
    throw new Error('No responses to consensus');
  }

  // Extract numeric scores from responses
  const scores: Array<{ value: number; model: string; weight: number }> = [];

  for (const response of responses) {
    // Try to extract number from response
    const match = response.content.match(/(\d+(?:\.\d+)?)/);
    if (match) {
      const value = parseFloat(match[1]);
      // Weight by inverse of cost (cheaper models get slightly less weight)
      const weight = 1.0 / (response.cost + 0.001);
      scores.push({ value, model: response.model, weight });
    }
  }

  if (scores.length === 0) {
    // Fallback to first response if no numbers found
    return {
      method: 'weighted-average',
      result: responses[0].content,
      confidence: 0.3,
      agreement: 0.3,
      requiresReview: true,
    };
  }

  // Calculate weighted average
  const totalWeight = scores.reduce((sum, s) => sum + s.weight, 0);
  const weightedSum = scores.reduce((sum, s) => sum + s.value * s.weight, 0);
  const average = weightedSum / totalWeight;

  // Calculate standard deviation
  const variance =
    scores.reduce((sum, s) => {
      const diff = s.value - average;
      return sum + diff * diff * s.weight;
    }, 0) / totalWeight;
  const stdDev = Math.sqrt(variance);

  // Agreement based on std dev (lower = higher agreement)
  const agreement = Math.max(0, 1 - stdDev / average);

  // Confidence based on agreement
  const confidence = agreement;

  return {
    method: 'weighted-average',
    result: average.toFixed(2),
    confidence,
    agreement,
    requiresReview: confidence < 0.7,
  };
}

/**
 * Semantic similarity consensus (for text responses)
 */
export async function semanticSimilarity(
  responses: AIResponse[]
): Promise<ConsensusResult> {
  if (responses.length === 0) {
    throw new Error('No responses to consensus');
  }

  if (responses.length === 1) {
    return {
      method: 'semantic-similarity',
      result: responses[0].content,
      confidence: 0.6,
      agreement: 1.0,
    };
  }

  // Generate embeddings for each response
  const embeddings = await Promise.all(
    responses.map(async (r) => ({
      model: r.model,
      content: r.content,
      embedding: await embedText(r.content),
    }))
  );

  // Calculate pairwise similarities
  const similarities: number[] = [];

  for (let i = 0; i < embeddings.length; i++) {
    for (let j = i + 1; j < embeddings.length; j++) {
      const sim = cosineSimilarity(
        embeddings[i].embedding,
        embeddings[j].embedding
      );
      similarities.push(sim);
    }
  }

  // Average similarity = agreement
  const agreement =
    similarities.reduce((sum, s) => sum + s, 0) / similarities.length;

  // Find most central response (highest avg similarity to others)
  let maxAvgSim = 0;
  let centralIndex = 0;

  for (let i = 0; i < embeddings.length; i++) {
    let avgSim = 0;
    let count = 0;

    for (let j = 0; j < embeddings.length; j++) {
      if (i !== j) {
        const sim = cosineSimilarity(
          embeddings[i].embedding,
          embeddings[j].embedding
        );
        avgSim += sim;
        count++;
      }
    }

    avgSim /= count;

    if (avgSim > maxAvgSim) {
      maxAvgSim = avgSim;
      centralIndex = i;
    }
  }

  const result = responses[centralIndex].content;
  const confidence = agreement;

  // Find significant disagreements (similarity < 0.7)
  const disagreements = responses
    .filter((r, i) => {
      if (i === centralIndex) return false;
      const sim = cosineSimilarity(
        embeddings[i].embedding,
        embeddings[centralIndex].embedding
      );
      return sim < 0.7;
    })
    .map((r) => ({
      model: r.model,
      response: r.content,
      reason: 'Semantically different',
    }));

  return {
    method: 'semantic-similarity',
    result,
    confidence,
    agreement,
    disagreements: disagreements.length > 0 ? disagreements : undefined,
    requiresReview: agreement < 0.75,
  };
}

/**
 * Cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Longest common substring consensus
 */
export async function longestCommon(
  responses: AIResponse[]
): Promise<ConsensusResult> {
  if (responses.length === 0) {
    throw new Error('No responses to consensus');
  }

  if (responses.length === 1) {
    return {
      method: 'longest-common',
      result: responses[0].content,
      confidence: 0.6,
      agreement: 1.0,
    };
  }

  // Find longest common substring across all responses
  let commonParts: string[] = [];

  // Start with first response
  const base = responses[0].content;

  // Find common parts (sentences)
  const baseSentences = base.split(/[.!?]\s+/);

  for (const sentence of baseSentences) {
    if (sentence.trim().length < 10) continue; // Skip short fragments

    let commonCount = 0;

    for (let i = 1; i < responses.length; i++) {
      if (responses[i].content.includes(sentence.trim())) {
        commonCount++;
      }
    }

    // If majority contains this sentence
    if (commonCount >= responses.length / 2) {
      commonParts.push(sentence.trim());
    }
  }

  const result = commonParts.join('. ') + (commonParts.length > 0 ? '.' : '');

  // Agreement = proportion of common content
  const agreement =
    result.length > 0 ? Math.min(result.length / base.length, 1.0) : 0.1;

  return {
    method: 'longest-common',
    result: result || responses[0].content,
    confidence: agreement,
    agreement,
    requiresReview: agreement < 0.5,
  };
}

/**
 * Confidence-weighted consensus
 */
export async function confidenceWeighted(
  responses: AIResponse[]
): Promise<ConsensusResult> {
  if (responses.length === 0) {
    throw new Error('No responses to consensus');
  }

  // Weight responses by inverse cost (proxy for model capability)
  const weights = responses.map((r) => {
    // Cheaper models get lower weight
    return 1.0 / (r.cost + 0.001);
  });

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  // Use semantic similarity with weights
  return semanticSimilarity(responses);
}

/**
 * Export consensus strategies
 */
export const ConsensusStrategies = {
  majorityVote,
  weightedAverage,
  semanticSimilarity,
  longestCommon,
  confidenceWeighted,
} as const;
