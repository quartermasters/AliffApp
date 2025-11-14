/**
 * Aliff AI - SDL Metadata Extraction Types
 *
 * Defines schemas for extracting 47 metadata fields from solicitations.
 */

/**
 * Complete solicitation metadata (47 fields)
 */
export interface SolicitationMetadata {
  administrative: AdministrativeMetadata;
  timeline: TimelineMetadata;
  financial: FinancialMetadata;
  technical: TechnicalMetadata;
  submission: SubmissionMetadata;
  evaluation: EvaluationMetadata;
}

/**
 * Administrative metadata (8 fields)
 */
export interface AdministrativeMetadata {
  solicitationNumber?: string;
  title?: string;
  issuingAgency?: string;
  agencyOffice?: string;
  contractingOfficer?: string;
  contractSpecialist?: string;
  setAsideType?: SetAsideType;
  procurementType?: ProcurementType;
}

/**
 * Timeline metadata (7 fields)
 */
export interface TimelineMetadata {
  issueDate?: Date;
  responseDeadline?: Date;
  qaDeadline?: Date;
  preProposalConferenceDate?: Date;
  estimatedAwardDate?: Date;
  periodOfPerformance?: string; // e.g., "12 months", "2 years"
  optionPeriods?: string[];
}

/**
 * Financial metadata (6 fields)
 */
export interface FinancialMetadata {
  estimatedValue?: number; // USD
  minimumValue?: number;
  maximumValue?: number;
  budgetAvailable?: boolean;
  contractType?: ContractType;
  paymentTerms?: string;
}

/**
 * Technical metadata (10 fields)
 */
export interface TechnicalMetadata {
  naicsCode?: string;
  pscCode?: string;
  securityClearanceRequired?: SecurityClearance;
  facilityClearanceRequired?: boolean;
  placeOfPerformance?: string;
  technicalRequirementsSummary?: string;
  keyTechnologies?: string[];
  deliverablesCount?: number;
  incumbentInformation?: string;
  protestHistory?: boolean;
}

/**
 * Submission metadata (8 fields)
 */
export interface SubmissionMetadata {
  submissionMethod?: SubmissionMethod;
  pageLimit?: number;
  formatRequirements?: string;
  requiredSections?: string[];
  proposalVolumes?: string[];
  costPriceRequirements?: string;
  pastPerformanceRequirements?: string;
  smallBusinessParticipation?: string;
}

/**
 * Evaluation metadata (8 fields)
 */
export interface EvaluationMetadata {
  evaluationCriteria?: string[];
  evaluationMethod?: EvaluationMethod;
  priceWeight?: number; // percentage
  technicalWeight?: number; // percentage
  pastPerformanceWeight?: number; // percentage
  keyPersonnelRequired?: boolean;
  corporateExperienceRequired?: boolean;
  oralPresentationRequired?: boolean;
}

/**
 * Set-aside types
 */
export type SetAsideType =
  | 'none'
  | '8(a)'
  | 'HUBZone'
  | 'SDVOSB'
  | 'WOSB'
  | 'small-business'
  | 'total-small-business'
  | 'partial-small-business'
  | 'other';

/**
 * Procurement types
 */
export type ProcurementType =
  | 'RFP' // Request for Proposal
  | 'RFQ' // Request for Quote
  | 'RFI' // Request for Information
  | 'IFB' // Invitation for Bid
  | 'sources-sought'
  | 'other';

/**
 * Contract types
 */
export type ContractType =
  | 'FFP' // Firm Fixed Price
  | 'T&M' // Time and Materials
  | 'CPFF' // Cost Plus Fixed Fee
  | 'CPAF' // Cost Plus Award Fee
  | 'CPIF' // Cost Plus Incentive Fee
  | 'IDIQ' // Indefinite Delivery Indefinite Quantity
  | 'other';

/**
 * Security clearance levels
 */
export type SecurityClearance =
  | 'none'
  | 'public-trust'
  | 'confidential'
  | 'secret'
  | 'top-secret'
  | 'TS-SCI';

/**
 * Submission methods
 */
export type SubmissionMethod =
  | 'electronic'
  | 'physical'
  | 'both'
  | 'SAM.gov'
  | 'email'
  | 'portal';

/**
 * Evaluation methods
 */
export type EvaluationMethod =
  | 'LPTA' // Lowest Price Technically Acceptable
  | 'best-value'
  | 'trade-off'
  | 'competitive-range'
  | 'other';

/**
 * Metadata field with confidence
 */
export interface MetadataField<T> {
  value: T;
  confidence: number; // 0.0-1.0
  source?: string; // Where it was extracted from
  raw?: string; // Raw text that was parsed
}

/**
 * Metadata extraction result
 */
export interface MetadataExtractionResult {
  metadata: SolicitationMetadata;
  confidence: {
    overall: number; // 0.0-1.0
    byCategory: {
      administrative: number;
      timeline: number;
      financial: number;
      technical: number;
      submission: number;
      evaluation: number;
    };
  };
  fieldsExtracted: number; // Out of 47
  missingFields: string[];
  warnings: string[];
  extractionTimeMs: number;
}

/**
 * Extraction configuration
 */
export interface ExtractionConfig {
  useAI: boolean; // Use AI extraction (default: true)
  model?: 'gemini' | 'gpt-4' | 'claude'; // AI model to use
  maxRetries?: number;
  requireHighConfidence?: boolean; // Only return high-confidence results
  confidenceThreshold?: number; // Minimum confidence (0.0-1.0)
}
