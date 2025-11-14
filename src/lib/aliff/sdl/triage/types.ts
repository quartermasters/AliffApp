/**
 * Aliff AI - SDL Triage Types
 *
 * Types for the complete SDL Triage system.
 */

import type { ParsedDocument, ParseResult } from '../parsing/types';
import type { MetadataExtractionResult } from '../extraction/types';
import type { RequirementsExtractionResult } from '../requirements/types';
import type { ComplianceAnalysisResult } from '../compliance/types';
import type { ScoringResult } from '../scoring/types';

/**
 * Complete triage result
 */
export interface TriageResult {
  id: string;
  timestamp: Date;

  // Input
  document: ParsedDocument;

  // Analysis results
  metadata: MetadataExtractionResult;
  requirements: RequirementsExtractionResult;
  compliance: ComplianceAnalysisResult;
  scoring: ScoringResult;

  // Summary
  summary: TriageSummary;

  // Performance metrics
  performance: TriagePerformance;

  // Status
  status: 'success' | 'partial' | 'failed';
  errors: string[];
  warnings: string[];
}

/**
 * Triage summary (executive overview)
 */
export interface TriageSummary {
  // Key facts
  title: string;
  agency: string;
  solicitationNumber?: string;
  estimatedValue?: number;
  responseDeadline?: Date;

  // Analysis scores
  viability: number; // 0-100, overall opportunity viability
  complexity: number; // 0-100
  winProbability: number; // 0-100
  complianceRate: number; // 0-100

  // Key insights
  keyStrengths: string[];
  keyChallenges: string[];
  criticalGaps: string[];

  // Decision
  recommendation: 'pursue' | 'monitor' | 'pass';
  confidence: number; // 0.0-1.0
  rationale: string;

  // Quick stats
  stats: {
    fieldsExtracted: number; // out of 47
    requirementsFound: number;
    mustHaveRequirements: number;
    complianceFrameworks: number;
    criticalComplianceGaps: number;
    estimatedBidCost: number;
    expectedValue: number; // pWin × profit
  };
}

/**
 * Triage performance metrics
 */
export interface TriagePerformance {
  totalTimeMs: number;
  breakdown: {
    parsing: number;
    metadata: number;
    requirements: number;
    compliance: number;
    scoring: number;
    summarization: number;
  };
  aiCallsMade: number;
  aiCostUSD: number;
  tokensUsed: {
    input: number;
    output: number;
    total: number;
  };
}

/**
 * Triage configuration
 */
export interface TriageConfig {
  // AI settings
  useAI: boolean;
  model?: 'gemini' | 'gpt-4' | 'claude';
  parallelProcessing?: boolean; // Run stages in parallel when possible

  // Processing options
  extractMetadata?: boolean;
  extractRequirements?: boolean;
  analyzeCompliance?: boolean;
  scoreOpportunity?: boolean;

  // Detail level
  detailLevel?: 'quick' | 'standard' | 'comprehensive';

  // Organization profile
  organizationProfile?: {
    name: string;
    capabilities: string[];
    pastPerformance: string[];
    teamSize: number;
    certifications: string[];
    complianceStatus: {
      fedramp?: 'none' | 'low' | 'moderate' | 'high';
      cmmc?: 'none' | 'level-1' | 'level-2' | 'level-3';
      other?: string[];
    };
    financialCapacity: number; // Max contract value
    strategicPriorities?: string[];
  };

  // Thresholds
  thresholds?: {
    minViability?: number; // 0-100, don't pursue below this
    minWinProbability?: number; // 0-100
    maxComplexity?: number; // 0-100
    minComplianceRate?: number; // 0-100
  };
}

/**
 * Batch triage request
 */
export interface BatchTriageRequest {
  documents: Array<{
    buffer: Buffer;
    filename: string;
    metadata?: {
      source?: string;
      uploadedBy?: string;
      tags?: string[];
    };
  }>;
  config?: Partial<TriageConfig>;
}

/**
 * Batch triage result
 */
export interface BatchTriageResult {
  results: TriageResult[];
  summary: {
    total: number;
    successful: number;
    partial: number;
    failed: number;
    averageViability: number;
    highPriorityCount: number; // pursue recommendations
    totalTimeMs: number;
    totalCostUSD: number;
  };
  ranked: TriageResult[]; // Sorted by viability score
}

/**
 * Triage status (for async processing)
 */
export interface TriageStatus {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: {
    stage: 'parsing' | 'metadata' | 'requirements' | 'compliance' | 'scoring' | 'done';
    percentage: number; // 0-100
    message: string;
  };
  startedAt: Date;
  completedAt?: Date;
  result?: TriageResult;
  error?: string;
}

/**
 * Detail level presets
 */
export const DETAIL_LEVEL_PRESETS: Record<
  'quick' | 'standard' | 'comprehensive',
  Partial<TriageConfig>
> = {
  quick: {
    extractMetadata: true,
    extractRequirements: false,
    analyzeCompliance: false,
    scoreOpportunity: true,
    model: 'gemini', // Fastest
    parallelProcessing: true,
  },
  standard: {
    extractMetadata: true,
    extractRequirements: true,
    analyzeCompliance: true,
    scoreOpportunity: true,
    model: 'gpt-4',
    parallelProcessing: true,
  },
  comprehensive: {
    extractMetadata: true,
    extractRequirements: true,
    analyzeCompliance: true,
    scoreOpportunity: true,
    model: 'gpt-4',
    parallelProcessing: false, // Sequential for maximum accuracy
  },
};

/**
 * Viability calculation weights
 */
export const VIABILITY_WEIGHTS = {
  winProbability: 0.4, // Most important
  complexity: -0.25, // Negative (higher complexity = lower viability)
  complianceRate: 0.2,
  strategicFit: 0.15,
} as const;
