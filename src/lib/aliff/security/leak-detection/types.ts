/**
 * Aliff AI - Strategy Leak Detection Types
 *
 * Defines schemas for detecting potential competitive intelligence leaks.
 * This is the "crown jewel protection" system for Aliff's competitive advantages.
 */

import type { AliffRole, SensitivityLevel } from '../../types';

/**
 * Types of strategy leaks we're protecting against
 */
export type LeakType =
  | 'pricing' // Pricing formulas, margins, cost calculations
  | 'methodology' // SDL process, multi-AI orchestration details
  | 'competitive' // Competitive advantages, win strategies, moats
  | 'financial' // Revenue, budgets, profit margins
  | 'client-specific' // Client-specific pricing or strategies
  | 'technical' // Technical implementation details
  | 'process' // Internal processes and workflows
  | 'relationship'; // Client relationships, partnerships

/**
 * Leak severity (combines sensitivity + confidence + context)
 */
export type LeakSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * Leak detection result
 */
export interface LeakDetection {
  id: string;
  leakType: LeakType;
  severity: LeakSeverity;
  confidence: number; // 0.0-1.0
  flaggedText: string;
  context: string; // Surrounding text for review
  startIndex: number;
  endIndex: number;
  reason: string;
  indicators: string[]; // Specific indicators that triggered detection
  timestamp: Date;
}

/**
 * Leak alert (for high-severity leaks)
 */
export interface LeakAlert {
  id: string;
  detection: LeakDetection;
  role: AliffRole;
  userId?: string;
  sessionId?: string;
  query: string;
  response: string;
  autoBlocked: boolean;
  requiresReview: boolean;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
  resolution: 'approved' | 'blocked' | 'pending';
  timestamp: Date;
}

/**
 * Protected competitive advantages (crown jewels)
 */
export interface CompetitiveAdvantage {
  id: string;
  name: string;
  description: string;
  category: 'SDL' | 'multi-AI' | 'pricing' | 'methodology' | 'other';
  sensitivity: SensitivityLevel;
  keywords: string[];
  patterns: RegExp[];
  allowedRoles: AliffRole[]; // Roles that can discuss this
  examples: {
    leak: string; // Example of a leak
    safe: string; // Safe way to discuss it
  }[];
}

/**
 * Leak detection configuration
 */
export interface LeakDetectionConfig {
  enabled: boolean;
  confidenceThreshold: number; // Min confidence to trigger alert
  autoBlockThreshold: number; // Auto-block if confidence > this
  alertOnMedium: boolean; // Alert on medium severity leaks
  logAllDetections: boolean; // Log even low-confidence detections
  protectedAdvantages: CompetitiveAdvantage[];
}

/**
 * Leak detection analytics
 */
export interface LeakAnalytics {
  totalDetections: number;
  byType: Record<LeakType, number>;
  bySeverity: Record<LeakSeverity, number>;
  byRole: Record<AliffRole, number>;
  autoBlockedCount: number;
  pendingReviewCount: number;
  falsePositiveRate?: number; // If we have review data
  dateRange: {
    start: Date;
    end: Date;
  };
}

/**
 * Protected competitive advantages for Aliff
 */
export const PROTECTED_ADVANTAGES: Array<
  Omit<CompetitiveAdvantage, 'id'>
> = [
  {
    name: 'SDL (Solicitation Diagnosis Lab)',
    description: 'Multi-AI orchestration system for RFP diagnosis',
    category: 'SDL',
    sensitivity: 'proprietary',
    keywords: [
      'SDL',
      'Solicitation Diagnosis Lab',
      'diagnosis methodology',
      'multi-model consensus',
      'triage algorithm',
    ],
    patterns: [
      /SDL\s*(?:methodology|process|algorithm|workflow)/gi,
      /multi-(?:AI|model)\s*(?:consensus|orchestration|routing)/gi,
      /diagnosis\s*(?:engine|system|framework)/gi,
    ],
    allowedRoles: ['CEO', 'OPS'],
    examples: [
      {
        leak: 'Our SDL uses GPT-4, Claude, and Gemini in a consensus voting system to analyze RFPs.',
        safe: 'We use advanced AI analysis to understand complex solicitations.',
      },
      {
        leak: 'The SDL triage phase extracts 47 different metadata points from RFP documents.',
        safe: 'Our analysis process examines all key aspects of the solicitation.',
      },
    ],
  },
  {
    name: 'Pricing Formula',
    description: 'Hourly rates, margins, and pricing calculation methodology',
    category: 'pricing',
    sensitivity: 'secret',
    keywords: [
      'pricing formula',
      'hourly rate',
      'margin calculation',
      'cost breakdown',
      'pricing tiers',
    ],
    patterns: [
      /\$\d+(?:\.\d{2})?\s*(?:per|\/)\s*(?:hour|page|word)/gi,
      /(?:margin|markup).*?\d+%/gi,
      /pricing\s*(?:formula|calculation|tier)/gi,
    ],
    allowedRoles: ['CEO'],
    examples: [
      {
        leak: 'We charge $175/hour for proposal writing with a 65% margin.',
        safe: 'Our pricing varies based on project scope and complexity.',
      },
      {
        leak: 'Tier 1 pricing is calculated as: (base_rate × complexity_multiplier) + AI_cost',
        safe: 'We offer tiered pricing based on project requirements.',
      },
    ],
  },
  {
    name: 'Multi-AI Orchestration',
    description: 'How we coordinate multiple AI models for consensus',
    category: 'multi-AI',
    sensitivity: 'proprietary',
    keywords: [
      'multi-AI orchestration',
      'model consensus',
      'GPT-4 vs Claude',
      'model routing',
      'disagreement resolution',
    ],
    patterns: [
      /(?:GPT-4|Claude|Gemini).*?(?:consensus|voting|agreement)/gi,
      /model\s*(?:orchestration|routing|selection)/gi,
      /disagreement\s*resolution/gi,
    ],
    allowedRoles: ['CEO', 'OPS'],
    examples: [
      {
        leak: 'When GPT-4 and Claude disagree, we use Gemini as a tiebreaker.',
        safe: 'We leverage multiple AI systems to ensure accuracy.',
      },
      {
        leak: 'We route technical questions to GPT-4 and strategic questions to Claude.',
        safe: 'Different types of analysis are optimized for best results.',
      },
    ],
  },
  {
    name: 'Win Rate Data',
    description: 'Actual win rates, success metrics, client retention',
    category: 'methodology',
    sensitivity: 'proprietary',
    keywords: [
      'win rate',
      'success rate',
      'conversion rate',
      'client retention',
      'closing percentage',
    ],
    patterns: [
      /win\s*rate.*?\d+%/gi,
      /success\s*rate.*?\d+%/gi,
      /\d+%\s*(?:win|success|conversion|retention)/gi,
    ],
    allowedRoles: ['CEO', 'OPS', 'SALES'],
    examples: [
      {
        leak: 'Our win rate with SDL-diagnosed proposals is 73%.',
        safe: 'Clients using our diagnosis service see significantly higher success rates.',
      },
      {
        leak: 'We retain 89% of clients after their first project.',
        safe: 'We have strong client retention and repeat business.',
      },
    ],
  },
  {
    name: 'Client-Specific Strategies',
    description: 'Win strategies developed for specific clients',
    category: 'methodology',
    sensitivity: 'proprietary',
    keywords: [
      'win strategy',
      'competitive positioning',
      'unique value proposition',
      'differentiation strategy',
    ],
    patterns: [
      /win\s*strategy.*?(?:for|regarding)\s*[A-Z][a-z]+/gi,
      /competitive\s*(?:advantage|positioning).*?[A-Z][a-z]+/gi,
    ],
    allowedRoles: ['CEO', 'OPS'],
    examples: [
      {
        leak: 'For Agency X, we position them as low-cost with fast turnaround.',
        safe: 'We develop custom positioning strategies for each client.',
      },
      {
        leak: 'The key to beating Competitor Y is emphasizing technical expertise.',
        safe: 'We help clients identify their unique competitive advantages.',
      },
    ],
  },
];

/**
 * Default leak detection configuration
 */
export const DEFAULT_LEAK_CONFIG: Omit<
  LeakDetectionConfig,
  'protectedAdvantages'
> = {
  enabled: true,
  confidenceThreshold: 0.7,
  autoBlockThreshold: 0.9,
  alertOnMedium: true,
  logAllDetections: true,
};
