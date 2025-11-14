/**
 * Aliff AI - SDL Opportunity Scorer
 *
 * AI-powered complexity and win probability scoring.
 */

import type { SolicitationMetadata } from '../extraction/types';
import type { RequirementsExtractionResult } from '../requirements/types';
import type { ComplianceAnalysisResult } from '../compliance/types';
import type {
  ScoringResult,
  ScoringConfig,
  ComplexityScore,
  WinProbability,
  CompetitiveAnalysis,
  BidDecisionFactors,
  BidRecommendation,
  ComplexityFactor,
} from './types';
import { DEFAULT_COMPLEXITY_WEIGHTS, DEFAULT_WIN_WEIGHTS, COMPLEXITY_LEVELS } from './types';
import {
  SCORING_SYSTEM_PROMPT,
  getComplexityPrompt,
  getWinProbabilityPrompt,
  getCompetitivePrompt,
  getBidDecisionPrompt,
} from './prompts';
import * as Models from '../../orchestration/models';
import type { AIRequest } from '../../orchestration/types';

/**
 * Score an opportunity
 */
export async function scoreOpportunity(
  metadata: SolicitationMetadata,
  requirements: RequirementsExtractionResult,
  compliance: ComplianceAnalysisResult,
  config?: Partial<ScoringConfig>
): Promise<ScoringResult> {
  const startTime = Date.now();

  const scoringConfig: ScoringConfig = {
    useAI: config?.useAI ?? true,
    model: config?.model || 'gpt-4', // Use GPT-4 for scoring analysis
    includeCompetitive: config?.includeCompetitive ?? true,
    includeBidDecision: config?.includeBidDecision ?? true,
    customWeights: config?.customWeights,
    organizationProfile: config?.organizationProfile,
  };

  try {
    // Calculate complexity score
    const complexity = await calculateComplexity(
      metadata,
      requirements.requirements,
      compliance,
      scoringConfig
    );

    // Calculate win probability
    const winProbability = await calculateWinProbability(
      metadata,
      requirements.requirements,
      complexity.overall,
      scoringConfig
    );

    // Competitive analysis
    let competitive: CompetitiveAnalysis = {
      estimatedCompetitors: 0,
      incumbentAdvantage: false,
      marketPosition: 'new-entrant',
      competitiveAdvantages: [],
      competitiveDisadvantages: [],
      differentiators: [],
      winThemes: [],
    };

    if (scoringConfig.includeCompetitive) {
      competitive = await analyzeCompetitive(metadata, requirements.requirements, scoringConfig);
    }

    // Bid decision factors
    let bidDecision: BidDecisionFactors = {
      pWin: winProbability.overall,
      estimatedRevenue: metadata.financial.estimatedValue || 0,
      estimatedCost: 0,
      estimatedProfit: 0,
      roi: 0,
      expectedValue: 0,
      strategicValue: 0,
      riskScore: complexity.overall,
      resourceAvailability: 0,
    };

    let recommendation: BidRecommendation = {
      decision: 'conditional',
      confidence: 0.5,
      rationale: 'Insufficient data for recommendation',
      keyFactors: { pros: [], cons: [] },
      strategicFit: 50,
      riskLevel: 'medium',
    };

    if (scoringConfig.includeBidDecision) {
      const decision = await calculateBidDecision(
        metadata,
        complexity.overall,
        winProbability.overall,
        compliance.estimatedEffort.totalCost,
        scoringConfig
      );

      bidDecision = decision.factors;
      recommendation = decision.recommendation;
    }

    return {
      complexity,
      winProbability,
      competitive,
      bidDecision,
      recommendation,
      scoringTimeMs: Date.now() - startTime,
    };
  } catch (error) {
    console.error('[scoreOpportunity] Scoring failed:', error);

    // Return default/fallback scoring
    return {
      complexity: {
        overall: 50,
        breakdown: { technical: 50, compliance: 50, schedule: 50, team: 50, cost: 50 },
        factors: [],
        riskLevel: 'medium',
        confidence: 0.3,
      },
      winProbability: {
        overall: 50,
        breakdown: {
          capability: 50,
          experience: 50,
          relationships: 50,
          pricing: 50,
          differentiation: 50,
        },
        strengths: [],
        weaknesses: [],
        opportunities: [],
        threats: [],
        recommendation: 'monitor',
        rationale: 'Scoring failed - manual analysis required',
        confidence: 0.3,
      },
      competitive: {
        estimatedCompetitors: 0,
        incumbentAdvantage: false,
        marketPosition: 'new-entrant',
        competitiveAdvantages: [],
        competitiveDisadvantages: [],
        differentiators: [],
        winThemes: [],
      },
      bidDecision: {
        pWin: 50,
        estimatedRevenue: metadata.financial.estimatedValue || 0,
        estimatedCost: 0,
        estimatedProfit: 0,
        roi: 0,
        expectedValue: 0,
        strategicValue: 50,
        riskScore: 50,
        resourceAvailability: 50,
      },
      recommendation: {
        decision: 'conditional',
        confidence: 0.3,
        rationale: `Scoring failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        keyFactors: { pros: [], cons: [] },
        strategicFit: 50,
        riskLevel: 'medium',
      },
      scoringTimeMs: Date.now() - startTime,
    };
  }
}

/**
 * Calculate complexity score
 */
async function calculateComplexity(
  metadata: SolicitationMetadata,
  requirements: any[],
  compliance: ComplianceAnalysisResult,
  config: ScoringConfig
): Promise<ComplexityScore> {
  const prompt = getComplexityPrompt(metadata, requirements, compliance);

  const result = await callAI(prompt, config);

  if (!result) {
    // Fallback to heuristic complexity calculation
    return calculateComplexityHeuristic(metadata, requirements, compliance, config);
  }

  try {
    const parsed = JSON.parse(result);

    // Determine risk level based on overall score
    let riskLevel: 'low' | 'medium' | 'high' | 'very-high';
    if (parsed.overall >= 76) riskLevel = 'very-high';
    else if (parsed.overall >= 51) riskLevel = 'high';
    else if (parsed.overall >= 26) riskLevel = 'medium';
    else riskLevel = 'low';

    return {
      overall: parsed.overall || 50,
      breakdown: parsed.breakdown || {
        technical: 50,
        compliance: 50,
        schedule: 50,
        team: 50,
        cost: 50,
      },
      factors: parsed.factors || [],
      riskLevel,
      confidence: parsed.confidence || 0.7,
    };
  } catch (error) {
    console.error('[calculateComplexity] Failed to parse response:', error);
    return calculateComplexityHeuristic(metadata, requirements, compliance, config);
  }
}

/**
 * Fallback: Calculate complexity using heuristics
 */
function calculateComplexityHeuristic(
  metadata: SolicitationMetadata,
  requirements: any[],
  compliance: ComplianceAnalysisResult,
  config: ScoringConfig
): ComplexityScore {
  const weights = config.customWeights || DEFAULT_COMPLEXITY_WEIGHTS;

  // Technical complexity
  const avgReqComplexity =
    requirements.reduce((sum, r) => sum + (r.complexity || 5), 0) / requirements.length;
  const technical = Math.min(avgReqComplexity * 10, 100);

  // Compliance complexity
  const frameworkCount = compliance.detectedFrameworks.length;
  const criticalGaps = compliance.gaps.filter((g) => g.impact === 'critical').length;
  const complianceComplexity = Math.min(frameworkCount * 15 + criticalGaps * 10, 100);

  // Schedule complexity (based on time to deadline)
  let scheduleComplexity = 50;
  if (metadata.timeline.responseDeadline) {
    const daysToDeadline = Math.floor(
      (metadata.timeline.responseDeadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (daysToDeadline < 30) scheduleComplexity = 80;
    else if (daysToDeadline < 60) scheduleComplexity = 60;
    else if (daysToDeadline < 90) scheduleComplexity = 40;
    else scheduleComplexity = 20;
  }

  // Team complexity (based on clearances and skills)
  const clearanceRequired = metadata.technical.securityClearanceRequired !== 'none';
  const teamComplexity = clearanceRequired ? 70 : 40;

  // Cost complexity (based on contract value)
  const contractValue = metadata.financial.estimatedValue || 0;
  const costComplexity =
    contractValue > 50000000
      ? 80
      : contractValue > 10000000
        ? 60
        : contractValue > 1000000
          ? 40
          : 20;

  // Weighted average
  const overall = Math.round(
    technical * (weights.technical ?? DEFAULT_COMPLEXITY_WEIGHTS.technical) +
      complianceComplexity * (weights.compliance ?? DEFAULT_COMPLEXITY_WEIGHTS.compliance) +
      scheduleComplexity * (weights.schedule ?? DEFAULT_COMPLEXITY_WEIGHTS.schedule) +
      teamComplexity * (weights.team ?? DEFAULT_COMPLEXITY_WEIGHTS.team) +
      costComplexity * (weights.cost ?? DEFAULT_COMPLEXITY_WEIGHTS.cost)
  );

  let riskLevel: 'low' | 'medium' | 'high' | 'very-high';
  if (overall >= 76) riskLevel = 'very-high';
  else if (overall >= 51) riskLevel = 'high';
  else if (overall >= 26) riskLevel = 'medium';
  else riskLevel = 'low';

  return {
    overall,
    breakdown: {
      technical: Math.round(technical),
      compliance: Math.round(complianceComplexity),
      schedule: Math.round(scheduleComplexity),
      team: Math.round(teamComplexity),
      cost: Math.round(costComplexity),
    },
    factors: [],
    riskLevel,
    confidence: 0.6,
  };
}

/**
 * Calculate win probability
 */
async function calculateWinProbability(
  metadata: SolicitationMetadata,
  requirements: any[],
  complexity: number,
  config: ScoringConfig
): Promise<WinProbability> {
  const prompt = getWinProbabilityPrompt(
    metadata,
    requirements,
    complexity,
    config.organizationProfile
  );

  const result = await callAI(prompt, config);

  if (!result) {
    // Fallback to heuristic
    return calculateWinProbabilityHeuristic(complexity);
  }

  try {
    const parsed = JSON.parse(result);

    return {
      overall: parsed.overall || 50,
      breakdown: parsed.breakdown || {
        capability: 50,
        experience: 50,
        relationships: 50,
        pricing: 50,
        differentiation: 50,
      },
      strengths: parsed.strengths || [],
      weaknesses: parsed.weaknesses || [],
      opportunities: parsed.opportunities || [],
      threats: parsed.threats || [],
      recommendation: parsed.recommendation || 'monitor',
      rationale: parsed.rationale || 'Insufficient data',
      confidence: parsed.confidence || 0.6,
    };
  } catch (error) {
    console.error('[calculateWinProbability] Failed to parse response:', error);
    return calculateWinProbabilityHeuristic(complexity);
  }
}

/**
 * Fallback: Calculate win probability using heuristics
 */
function calculateWinProbabilityHeuristic(complexity: number): WinProbability {
  // Inverse relationship: higher complexity = lower win probability
  const overall = Math.max(100 - complexity, 20);

  return {
    overall,
    breakdown: {
      capability: overall,
      experience: overall,
      relationships: 40, // Conservative default
      pricing: overall,
      differentiation: 50,
    },
    strengths: [],
    weaknesses: ['Insufficient data for detailed analysis'],
    opportunities: [],
    threats: [],
    recommendation: overall >= 50 ? 'pursue' : 'monitor',
    rationale: 'Heuristic calculation based on complexity',
    confidence: 0.4,
  };
}

/**
 * Analyze competitive landscape
 */
async function analyzeCompetitive(
  metadata: SolicitationMetadata,
  requirements: any[],
  config: ScoringConfig
): Promise<CompetitiveAnalysis> {
  const prompt = getCompetitivePrompt(metadata, requirements);

  const result = await callAI(prompt, config);

  if (!result) {
    return {
      estimatedCompetitors: 5,
      incumbentAdvantage: !!metadata.technical.incumbentInformation,
      incumbentName: metadata.technical.incumbentInformation,
      marketPosition: 'new-entrant',
      competitiveAdvantages: [],
      competitiveDisadvantages: [],
      differentiators: [],
      winThemes: [],
    };
  }

  try {
    const parsed = JSON.parse(result);
    return parsed;
  } catch (error) {
    console.error('[analyzeCompetitive] Failed to parse response:', error);
    return {
      estimatedCompetitors: 5,
      incumbentAdvantage: !!metadata.technical.incumbentInformation,
      marketPosition: 'new-entrant',
      competitiveAdvantages: [],
      competitiveDisadvantages: [],
      differentiators: [],
      winThemes: [],
    };
  }
}

/**
 * Calculate bid decision factors
 */
async function calculateBidDecision(
  metadata: SolicitationMetadata,
  complexity: number,
  winProbability: number,
  complianceCost: number,
  config: ScoringConfig
): Promise<{ factors: BidDecisionFactors; recommendation: BidRecommendation }> {
  const prompt = getBidDecisionPrompt(metadata, complexity, winProbability, complianceCost);

  const result = await callAI(prompt, config);

  if (!result) {
    const revenue = metadata.financial.estimatedValue || 0;
    const estimatedCost = Math.min(revenue * 0.1, 200000); // 10% or max $200K
    const profit = revenue * 0.15; // Assume 15% margin
    const expectedValue = (winProbability / 100) * profit;

    return {
      factors: {
        pWin: winProbability,
        estimatedRevenue: revenue,
        estimatedCost,
        estimatedProfit: profit,
        roi: estimatedCost > 0 ? (profit / estimatedCost) * 100 : 0,
        expectedValue,
        strategicValue: 50,
        riskScore: complexity,
        resourceAvailability: 50,
      },
      recommendation: {
        decision: winProbability >= 60 ? 'go' : winProbability >= 40 ? 'conditional' : 'no-go',
        confidence: 0.5,
        rationale: 'Heuristic decision based on win probability',
        keyFactors: { pros: [], cons: [] },
        strategicFit: 50,
        riskLevel: complexity >= 75 ? 'critical' : complexity >= 50 ? 'high' : 'medium',
      },
    };
  }

  try {
    const parsed = JSON.parse(result);

    const factors: BidDecisionFactors = {
      pWin: parsed.pWin || winProbability,
      estimatedRevenue: parsed.estimatedRevenue || metadata.financial.estimatedValue || 0,
      estimatedCost: parsed.estimatedCost || 0,
      estimatedProfit: parsed.estimatedProfit || 0,
      roi: parsed.roi || 0,
      expectedValue: parsed.expectedValue || 0,
      strategicValue: parsed.strategicValue || 50,
      riskScore: parsed.riskScore || complexity,
      resourceAvailability: parsed.resourceAvailability || 50,
    };

    const recommendation: BidRecommendation = {
      decision: parsed.decision || 'conditional',
      confidence: parsed.confidence || 0.7,
      rationale: parsed.rationale || '',
      keyFactors: parsed.keyFactors || { pros: [], cons: [] },
      conditions: parsed.conditions,
      alternatives: parsed.alternatives,
      strategicFit: parsed.strategicFit || 50,
      riskLevel: parsed.riskLevel || 'medium',
    };

    return { factors, recommendation };
  } catch (error) {
    console.error('[calculateBidDecision] Failed to parse response:', error);

    const revenue = metadata.financial.estimatedValue || 0;
    const estimatedCost = Math.min(revenue * 0.1, 200000);
    const profit = revenue * 0.15;
    const expectedValue = (winProbability / 100) * profit;

    return {
      factors: {
        pWin: winProbability,
        estimatedRevenue: revenue,
        estimatedCost,
        estimatedProfit: profit,
        roi: estimatedCost > 0 ? (profit / estimatedCost) * 100 : 0,
        expectedValue,
        strategicValue: 50,
        riskScore: complexity,
        resourceAvailability: 50,
      },
      recommendation: {
        decision: winProbability >= 60 ? 'go' : winProbability >= 40 ? 'conditional' : 'no-go',
        confidence: 0.5,
        rationale: 'Error parsing AI response, using heuristic decision',
        keyFactors: { pros: [], cons: [] },
        strategicFit: 50,
        riskLevel: complexity >= 75 ? 'critical' : complexity >= 50 ? 'high' : 'medium',
      },
    };
  }
}

/**
 * Call AI model
 */
async function callAI(prompt: string, config: ScoringConfig): Promise<string | null> {
  const aiRequest: AIRequest = {
    prompt,
    systemPrompt: SCORING_SYSTEM_PROMPT,
    temperature: 0.3, // Low temperature for analytical scoring
    maxTokens: 3000,
  };

  try {
    let response;

    switch (config.model) {
      case 'gpt-4':
        response = await Models.OpenAIClient.call(aiRequest);
        break;
      case 'claude':
        response = await Models.AnthropicClient.call(aiRequest);
        break;
      case 'gemini':
        response = await Models.GoogleAIClient.call(aiRequest);
        break;
      default:
        response = await Models.OpenAIClient.call(aiRequest);
    }

    return response.content;
  } catch (error) {
    console.error('[callAI] AI call failed:', error);
    return null;
  }
}

/**
 * Get complexity level description
 */
export function getComplexityLevel(score: number): {
  level: keyof typeof COMPLEXITY_LEVELS;
  description: string;
  characteristics: string[];
} {
  for (const [level, data] of Object.entries(COMPLEXITY_LEVELS)) {
    if (score >= data.range[0] && score <= data.range[1]) {
      return {
        level: level as keyof typeof COMPLEXITY_LEVELS,
        description: data.description,
        characteristics: [...data.characteristics],
      };
    }
  }

  return {
    level: 'medium',
    description: COMPLEXITY_LEVELS.medium.description,
    characteristics: [...COMPLEXITY_LEVELS.medium.characteristics],
  };
}

/**
 * Get scoring summary
 */
export function getScoringsSummary(result: ScoringResult): {
  complexityLevel: string;
  winProbabilityLevel: string;
  recommendation: string;
  keyInsights: string[];
} {
  const complexityLevel = getComplexityLevel(result.complexity.overall);
  const winProb = result.winProbability.overall;

  let winProbabilityLevel: string;
  if (winProb >= 70) winProbabilityLevel = 'High (70-100%)';
  else if (winProb >= 40) winProbabilityLevel = 'Medium (40-69%)';
  else if (winProb >= 20) winProbabilityLevel = 'Low (20-39%)';
  else winProbabilityLevel = 'Very Low (0-19%)';

  const keyInsights: string[] = [];

  if (result.complexity.overall >= 75) {
    keyInsights.push(`⚠️ Very high complexity (${result.complexity.overall}/100) - major challenges expected`);
  }

  if (result.winProbability.overall < 40) {
    keyInsights.push(`⚠️ Low win probability (${winProb}%) - weak competitive position`);
  }

  if (result.recommendation.decision === 'no-go') {
    keyInsights.push(`❌ Recommend NO-BID: ${result.recommendation.rationale}`);
  } else if (result.recommendation.decision === 'go') {
    keyInsights.push(`✅ Recommend BID: ${result.recommendation.rationale}`);
  } else {
    keyInsights.push(`⚠️ Conditional bid: ${result.recommendation.rationale}`);
  }

  return {
    complexityLevel: `${complexityLevel.level} (${result.complexity.overall}/100)`,
    winProbabilityLevel,
    recommendation: result.recommendation.decision.toUpperCase(),
    keyInsights,
  };
}
