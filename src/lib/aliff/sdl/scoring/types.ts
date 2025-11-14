/**
 * Aliff AI - SDL Scoring Types
 *
 * Types for complexity scoring and win probability analysis.
 */

import type { Requirement } from '../requirements/types';
import type { ComplianceAnalysisResult } from '../compliance/types';
import type { SolicitationMetadata } from '../extraction/types';

/**
 * Complexity score (0-100)
 */
export interface ComplexityScore {
  overall: number; // 0-100
  breakdown: {
    technical: number; // 0-100
    compliance: number; // 0-100
    schedule: number; // 0-100
    team: number; // 0-100
    cost: number; // 0-100
  };
  factors: ComplexityFactor[];
  riskLevel: 'low' | 'medium' | 'high' | 'very-high';
  confidence: number; // 0.0-1.0
}

/**
 * Individual complexity factor
 */
export interface ComplexityFactor {
  name: string;
  category: 'technical' | 'compliance' | 'schedule' | 'team' | 'cost';
  score: number; // 0-100
  weight: number; // 0.0-1.0
  description: string;
  evidence: string[];
}

/**
 * Win probability score (0-100)
 */
export interface WinProbability {
  overall: number; // 0-100, percentage
  breakdown: {
    capability: number; // Do we have the capability? (0-100)
    experience: number; // Do we have relevant experience? (0-100)
    relationships: number; // Do we have agency relationships? (0-100)
    pricing: number; // Are we price competitive? (0-100)
    differentiation: number; // Do we have unique advantages? (0-100)
  };
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  recommendation: 'pursue' | 'monitor' | 'pass';
  rationale: string;
  confidence: number; // 0.0-1.0
}

/**
 * Competitive analysis
 */
export interface CompetitiveAnalysis {
  estimatedCompetitors: number;
  incumbentAdvantage: boolean;
  incumbentName?: string;
  marketPosition: 'leader' | 'challenger' | 'follower' | 'new-entrant';
  competitiveAdvantages: string[];
  competitiveDisadvantages: string[];
  differentiators: string[];
  winThemes: string[];
}

/**
 * Bid decision factors
 */
export interface BidDecisionFactors {
  pWin: number; // Probability of win (0-100)
  estimatedRevenue: number; // USD
  estimatedCost: number; // Cost to pursue (USD)
  estimatedProfit: number; // Expected profit (USD)
  roi: number; // Return on investment (%)
  expectedValue: number; // pWin * profit (USD)
  strategicValue: number; // 0-100
  riskScore: number; // 0-100
  resourceAvailability: number; // 0-100
}

/**
 * Go/No-Go recommendation
 */
export interface BidRecommendation {
  decision: 'go' | 'no-go' | 'conditional';
  confidence: number; // 0.0-1.0
  rationale: string;
  keyFactors: {
    pros: string[];
    cons: string[];
  };
  conditions?: string[]; // For conditional decisions
  alternatives?: string[];
  strategicFit: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Complete scoring result
 */
export interface ScoringResult {
  complexity: ComplexityScore;
  winProbability: WinProbability;
  competitive: CompetitiveAnalysis;
  bidDecision: BidDecisionFactors;
  recommendation: BidRecommendation;
  scoringTimeMs: number;
}

/**
 * Scoring configuration
 */
export interface ScoringConfig {
  useAI: boolean;
  model?: 'gemini' | 'gpt-4' | 'claude';
  includeCompetitive: boolean;
  includeBidDecision: boolean;
  customWeights?: {
    technical?: number;
    compliance?: number;
    schedule?: number;
    team?: number;
    cost?: number;
  };
  organizationProfile?: {
    capabilities: string[];
    pastPerformance: string[];
    teamSize: number;
    certifications: string[];
    financialCapacity: number; // Max contract value
  };
}

/**
 * Complexity level descriptions
 */
export const COMPLEXITY_LEVELS = {
  low: {
    range: [0, 25],
    description: 'Straightforward opportunity with minimal technical or compliance challenges',
    characteristics: [
      'Standard requirements',
      'Minimal compliance frameworks',
      'Adequate timeline',
      'Team readily available',
      'Reasonable budget',
    ],
  },
  medium: {
    range: [26, 50],
    description: 'Moderate complexity with some technical or compliance challenges',
    characteristics: [
      'Mix of standard and advanced requirements',
      '1-2 compliance frameworks',
      'Tight but achievable timeline',
      'Some specialized skills needed',
      'Moderate budget constraints',
    ],
  },
  high: {
    range: [51, 75],
    description: 'Significant complexity requiring specialized expertise and careful planning',
    characteristics: [
      'Advanced technical requirements',
      'Multiple compliance frameworks',
      'Aggressive timeline',
      'Specialized team required',
      'Significant investment needed',
    ],
  },
  'very-high': {
    range: [76, 100],
    description: 'Extremely complex opportunity with major technical, compliance, or resource challenges',
    characteristics: [
      'Cutting-edge or unique requirements',
      'Stringent compliance (e.g., FedRAMP High)',
      'Very aggressive timeline',
      'Rare expertise required',
      'Major investment or risk',
    ],
  },
} as const;

/**
 * Win probability ranges
 */
export const WIN_PROBABILITY_RANGES = {
  high: {
    range: [70, 100],
    description: 'Strong position to win',
    action: 'Full pursuit - allocate resources',
  },
  medium: {
    range: [40, 69],
    description: 'Competitive position',
    action: 'Pursue with caution - develop win strategy',
  },
  low: {
    range: [20, 39],
    description: 'Weak position',
    action: 'Consider partnering or passing',
  },
  'very-low': {
    range: [0, 19],
    description: 'Poor position to win',
    action: 'Recommend no-bid unless strategic',
  },
} as const;

/**
 * Scoring factors and weights
 */
export const DEFAULT_COMPLEXITY_WEIGHTS = {
  technical: 0.3,
  compliance: 0.25,
  schedule: 0.2,
  team: 0.15,
  cost: 0.1,
} as const;

export const DEFAULT_WIN_WEIGHTS = {
  capability: 0.3,
  experience: 0.25,
  relationships: 0.15,
  pricing: 0.2,
  differentiation: 0.1,
} as const;
