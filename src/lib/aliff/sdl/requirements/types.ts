/**
 * Aliff AI - SDL Requirements Extraction Types
 *
 * Types for extracting and categorizing solicitation requirements.
 */

/**
 * Requirement priority levels
 */
export type RequirementPriority = 'must-have' | 'should-have' | 'nice-to-have';

/**
 * Requirement categories
 */
export type RequirementCategory =
  | 'technical'
  | 'functional'
  | 'security'
  | 'compliance'
  | 'staffing'
  | 'deliverable'
  | 'schedule'
  | 'administrative'
  | 'other';

/**
 * Requirement verification method
 */
export type VerificationMethod =
  | 'demonstration'
  | 'inspection'
  | 'test'
  | 'analysis'
  | 'documentation';

/**
 * Individual requirement
 */
export interface Requirement {
  id: string;
  text: string;
  priority: RequirementPriority;
  category: RequirementCategory;
  source: string; // Section or page where found
  verificationMethod?: VerificationMethod;
  acceptance?: string; // Acceptance criteria
  notes?: string;
  keywords: string[];
  complexity?: number; // 1-10 scale
  confidence: number; // 0.0-1.0
}

/**
 * Requirements by priority
 */
export interface RequirementsByPriority {
  mustHave: Requirement[];
  shouldHave: Requirement[];
  niceToHave: Requirement[];
}

/**
 * Requirements by category
 */
export interface RequirementsByCategory {
  technical: Requirement[];
  functional: Requirement[];
  security: Requirement[];
  compliance: Requirement[];
  staffing: Requirement[];
  deliverable: Requirement[];
  schedule: Requirement[];
  administrative: Requirement[];
  other: Requirement[];
}

/**
 * Evaluation criteria requirement
 */
export interface EvaluationCriterion {
  id: string;
  name: string;
  description: string;
  weight?: number; // Percentage
  subfactors: string[];
  source: string;
}

/**
 * Requirements extraction result
 */
export interface RequirementsExtractionResult {
  requirements: Requirement[];
  byPriority: RequirementsByPriority;
  byCategory: RequirementsByCategory;
  evaluationCriteria: EvaluationCriterion[];
  statistics: {
    total: number;
    mustHave: number;
    shouldHave: number;
    niceToHave: number;
    avgComplexity: number;
    highComplexityCount: number; // Complexity > 7
  };
  warnings: string[];
  extractionTimeMs: number;
}

/**
 * Requirements extraction configuration
 */
export interface RequirementsConfig {
  useAI: boolean;
  model?: 'gemini' | 'gpt-4' | 'claude';
  extractEvaluationCriteria: boolean;
  includeImplicitRequirements: boolean;
  maxRequirements?: number;
  confidenceThreshold?: number;
}

/**
 * Requirement match/mapping
 */
export interface RequirementMatch {
  requirement: Requirement;
  matchScore: number; // 0.0-1.0
  reasons: string[];
}

/**
 * Requirement compliance gap (lightweight version for requirements module)
 */
export interface RequirementComplianceGap {
  requirement: Requirement;
  status: 'missing' | 'partial' | 'unclear';
  impact: 'critical' | 'high' | 'medium' | 'low';
  recommendation: string;
}

/**
 * Requirements compliance analysis
 */
export interface ComplianceAnalysis {
  totalRequirements: number;
  compliantRequirements: number;
  partiallyCompliant: number;
  nonCompliant: number;
  complianceRate: number; // Percentage
  gaps: RequirementComplianceGap[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}
