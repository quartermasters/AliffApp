/**
 * Consensus Engine
 *
 * Analyzes outputs from multiple AI providers to determine:
 * - Full Consensus (>80% similarity)
 * - Majority Consensus (60-80% similarity)
 * - Split Decision (<60% similarity)
 * - Low Confidence (AI confidence scores conflict)
 *
 * Escalates to human experts when needed
 */

import { prisma } from '@/lib/prisma';
import { ConsensusType, AIProvider } from '@prisma/client';
import { AIExecutionResult } from './ai-router';

// ============================================================================
// CONSENSUS ANALYSIS
// ============================================================================

export interface ConsensusResult {
  consensusType: ConsensusType;
  consensusConfidence: number; // 0-100
  finalResult: any;
  escalateToHuman: boolean;
  rationale: string;
  aiOutputs: {
    provider: AIProvider;
    output: any;
    confidence?: number;
  }[];
}

export class ConsensusEngine {
  /**
   * Analyze multiple AI outputs and determine consensus
   */
  async analyzeConsensus(
    sdlTaskId: string,
    projectId: string,
    taskName: string,
    aiResults: AIExecutionResult[]
  ): Promise<ConsensusResult> {
    console.log(`[Consensus Engine] Analyzing ${aiResults.length} AI outputs for task: ${taskName}`);

    if (aiResults.length < 2) {
      throw new Error('Consensus requires at least 2 AI outputs');
    }

    // Extract outputs
    const aiOutputs = aiResults.map((r) => ({
      provider: r.provider,
      output: r.result,
      confidence: r.result?.confidence,
    }));

    // Calculate similarity between outputs
    const similarity = await this.calculateSimilarity(aiResults);

    let consensusType: ConsensusType;
    let consensusConfidence: number;
    let finalResult: any;
    let escalateToHuman: boolean;
    let rationale: string;

    // Determine consensus type based on similarity
    if (similarity >= 0.8) {
      // Full Consensus
      consensusType = ConsensusType.FULL_CONSENSUS;
      consensusConfidence = 90 + similarity * 10; // 90-100%
      finalResult = aiResults[0].result; // All agree, use first
      escalateToHuman = false;
      rationale = `All AIs agree with ${Math.round(similarity * 100)}% similarity. High confidence in result.`;
    } else if (similarity >= 0.6) {
      // Majority Consensus
      consensusType = ConsensusType.MAJORITY_CONSENSUS;
      consensusConfidence = 70 + similarity * 20; // 70-85%
      finalResult = await this.synthesizeOutputs(aiResults);
      escalateToHuman = true; // Recommend human review
      rationale = `Majority consensus with ${Math.round(similarity * 100)}% similarity. Recommend human validation.`;
    } else {
      // Split Decision
      consensusType = ConsensusType.SPLIT_DECISION;
      consensusConfidence = 40 + similarity * 30; // 40-70%
      finalResult = {
        outputs: aiResults.map((r) => ({
          provider: r.provider,
          result: r.result,
        })),
        requiresHumanAdjudication: true,
      };
      escalateToHuman = true; // MANDATORY human review
      rationale = `Significant disagreement (${Math.round(similarity * 100)}% similarity). Human expert must adjudicate.`;
    }

    // Check for low confidence scenarios
    const hasLowConfidence = aiResults.some((r) => (r.result?.confidence || 100) < 70);
    if (hasLowConfidence && consensusType !== ConsensusType.SPLIT_DECISION) {
      consensusType = ConsensusType.LOW_CONFIDENCE;
      escalateToHuman = true;
      rationale = `One or more AIs expressed low confidence (<70%). Human validation recommended.`;
    }

    // Save to database
    await this.saveConsensusLog(
      sdlTaskId,
      projectId,
      taskName,
      aiResults,
      consensusType,
      consensusConfidence,
      finalResult,
      escalateToHuman
    );

    return {
      consensusType,
      consensusConfidence,
      finalResult,
      escalateToHuman,
      rationale,
      aiOutputs,
    };
  }

  /**
   * Calculate similarity between AI outputs
   * Returns 0-1 (0 = completely different, 1 = identical)
   */
  private async calculateSimilarity(aiResults: AIExecutionResult[]): Promise<number> {
    if (aiResults.length < 2) return 1.0;

    // Extract text content from results
    const texts = aiResults.map((r) => this.extractTextContent(r.result));

    // Calculate pairwise similarity
    const similarities: number[] = [];
    for (let i = 0; i < texts.length; i++) {
      for (let j = i + 1; j < texts.length; j++) {
        const sim = this.textSimilarity(texts[i], texts[j]);
        similarities.push(sim);
      }
    }

    // Return average similarity
    return similarities.reduce((a, b) => a + b, 0) / similarities.length;
  }

  /**
   * Extract text content from AI result
   */
  private extractTextContent(result: any): string {
    if (typeof result === 'string') return result;
    if (result?.content) return result.content;
    if (result?.text) return result.text;
    return JSON.stringify(result);
  }

  /**
   * Calculate text similarity (simple Jaccard similarity for now)
   * In production, use embedding-based similarity
   */
  private textSimilarity(text1: string, text2: string): number {
    // Tokenize
    const tokens1 = new Set(text1.toLowerCase().split(/\s+/));
    const tokens2 = new Set(text2.toLowerCase().split(/\s+/));

    // Jaccard similarity: intersection / union
    const intersection = new Set([...tokens1].filter((x) => tokens2.has(x)));
    const union = new Set([...tokens1, ...tokens2]);

    if (union.size === 0) return 0;
    return intersection.size / union.size;
  }

  /**
   * Synthesize outputs from multiple AIs (for majority consensus)
   */
  private async synthesizeOutputs(aiResults: AIExecutionResult[]): Promise<any> {
    // For now, return all outputs for human review
    // In production, could use an AI to synthesize the consensus
    return {
      synthesized: true,
      outputs: aiResults.map((r) => ({
        provider: r.provider,
        result: r.result,
        confidence: r.result?.confidence,
      })),
      recommendation: 'Multiple perspectives captured. Human expert should review and synthesize.',
    };
  }

  /**
   * Save consensus log to database
   */
  private async saveConsensusLog(
    sdlTaskId: string,
    projectId: string,
    taskName: string,
    aiResults: AIExecutionResult[],
    consensusType: ConsensusType,
    consensusConfidence: number,
    finalResult: any,
    escalateToHuman: boolean
  ): Promise<void> {
    const gpt5Output = aiResults.find((r) => r.provider === AIProvider.OPENAI)?.result;
    const claudeOutput = aiResults.find((r) => r.provider === AIProvider.CLAUDE)?.result;
    const geminiOutput = aiResults.find((r) => r.provider === AIProvider.GEMINI)?.result;

    await prisma.consensusLog.create({
      data: {
        sdlTaskId,
        projectId,
        taskName,
        gpt5Output: gpt5Output || null,
        claudeOutput: claudeOutput || null,
        geminiOutput: geminiOutput || null,
        consensusType,
        consensusConfidence,
        finalResult,
        escalatedToHuman: escalateToHuman,
      },
    });

    console.log(
      `[Consensus Engine] Saved consensus log: ${consensusType} (${consensusConfidence}% confidence)`
    );
  }

  /**
   * Get consensus statistics for a project
   */
  async getConsensusStatistics(projectId: string) {
    const logs = await prisma.consensusLog.findMany({
      where: { projectId },
    });

    const total = logs.length;
    const fullConsensus = logs.filter((l) => l.consensusType === ConsensusType.FULL_CONSENSUS).length;
    const majorityConsensus = logs.filter((l) => l.consensusType === ConsensusType.MAJORITY_CONSENSUS).length;
    const splitDecisions = logs.filter((l) => l.consensusType === ConsensusType.SPLIT_DECISION).length;
    const lowConfidence = logs.filter((l) => l.consensusType === ConsensusType.LOW_CONFIDENCE).length;
    const escalated = logs.filter((l) => l.escalatedToHuman).length;

    const avgConfidence =
      total > 0
        ? logs.reduce((sum, l) => sum + (l.consensusConfidence || 0), 0) / total
        : 0;

    return {
      total,
      fullConsensus,
      majorityConsensus,
      splitDecisions,
      lowConfidence,
      escalated,
      avgConfidence: Math.round(avgConfidence),
      consensusRate: total > 0 ? Math.round((fullConsensus / total) * 100) : 0,
    };
  }

  /**
   * Submit human adjudication for consensus conflict
   */
  async submitHumanAdjudication(
    consensusLogId: string,
    humanReviewerId: string,
    decision: any,
    notes?: string
  ): Promise<void> {
    await prisma.consensusLog.update({
      where: { id: consensusLogId },
      data: {
        humanReviewerId,
        humanDecision: decision,
        humanNotes: notes,
        escalatedToHuman: true,
      },
    });

    console.log(`[Consensus Engine] Human adjudication submitted for log ${consensusLogId}`);
  }

  /**
   * Get consensus logs requiring human review
   */
  async getLogsRequiringReview(projectId: string) {
    return await prisma.consensusLog.findMany({
      where: {
        projectId,
        escalatedToHuman: true,
        humanReviewerId: null, // Not yet reviewed
      },
      include: {
        sdlTask: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

/**
 * Create Consensus Engine instance
 */
export function createConsensusEngine(): ConsensusEngine {
  return new ConsensusEngine();
}

/**
 * Get Consensus Engine singleton
 */
let consensusEngineInstance: ConsensusEngine | null = null;

export function getConsensusEngine(): ConsensusEngine {
  if (!consensusEngineInstance) {
    consensusEngineInstance = new ConsensusEngine();
  }
  return consensusEngineInstance;
}
