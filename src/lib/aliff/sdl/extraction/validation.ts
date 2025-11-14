/**
 * Aliff AI - SDL Metadata Validation
 *
 * Validates and scores extracted metadata fields.
 */

import type {
  SolicitationMetadata,
  AdministrativeMetadata,
  TimelineMetadata,
  FinancialMetadata,
  TechnicalMetadata,
  SubmissionMetadata,
  EvaluationMetadata,
  MetadataField,
  SetAsideType,
  ProcurementType,
  ContractType,
  SecurityClearance,
  SubmissionMethod,
  EvaluationMethod,
} from './types';

/**
 * Validation result for a single field
 */
export interface FieldValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
  adjustedConfidence: number;
}

/**
 * Validate solicitation number
 */
export function validateSolicitationNumber(value: string | undefined): FieldValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!value) {
    return { valid: false, errors: ['Solicitation number is required'], warnings: [], adjustedConfidence: 0 };
  }

  // Should contain letters and numbers
  if (!/[A-Z0-9]/.test(value)) {
    errors.push('Invalid solicitation number format');
  }

  // Common patterns: FA8726-25-R-0001, W912L7-25-R-0001, etc.
  if (value.length < 5) {
    warnings.push('Solicitation number seems too short');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    adjustedConfidence: errors.length === 0 ? 1.0 : 0.5,
  };
}

/**
 * Validate date field
 */
export function validateDate(value: Date | undefined, fieldName: string): FieldValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!value) {
    return { valid: true, errors: [], warnings: [`${fieldName} not provided`], adjustedConfidence: 0 };
  }

  // Check if valid date
  if (isNaN(value.getTime())) {
    errors.push(`Invalid date for ${fieldName}`);
    return { valid: false, errors, warnings, adjustedConfidence: 0 };
  }

  // Check if date is in reasonable range (not too far in past/future)
  const now = new Date();
  const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const twoYearsAhead = new Date(now.getFullYear() + 2, now.getMonth(), now.getDate());

  if (value < yearAgo) {
    warnings.push(`${fieldName} is more than 1 year in the past`);
  }

  if (value > twoYearsAhead) {
    warnings.push(`${fieldName} is more than 2 years in the future`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    adjustedConfidence: errors.length === 0 ? 1.0 : 0.3,
  };
}

/**
 * Validate timeline consistency
 */
export function validateTimeline(timeline: TimelineMetadata): FieldValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check date ordering
  if (timeline.issueDate && timeline.responseDeadline) {
    if (timeline.issueDate > timeline.responseDeadline) {
      errors.push('Issue date cannot be after response deadline');
    }
  }

  if (timeline.qaDeadline && timeline.responseDeadline) {
    if (timeline.qaDeadline > timeline.responseDeadline) {
      errors.push('Q&A deadline cannot be after response deadline');
    }
  }

  if (timeline.responseDeadline && timeline.estimatedAwardDate) {
    if (timeline.responseDeadline > timeline.estimatedAwardDate) {
      warnings.push('Response deadline is after estimated award date (unusual)');
    }
  }

  // Check if response deadline is in the past
  if (timeline.responseDeadline) {
    const now = new Date();
    if (timeline.responseDeadline < now) {
      warnings.push('Response deadline has passed - solicitation may be closed');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    adjustedConfidence: errors.length === 0 ? 1.0 : 0.4,
  };
}

/**
 * Validate financial values
 */
export function validateFinancial(financial: FinancialMetadata): FieldValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check value ranges
  if (financial.minimumValue && financial.maximumValue) {
    if (financial.minimumValue > financial.maximumValue) {
      errors.push('Minimum value cannot exceed maximum value');
    }
  }

  if (financial.estimatedValue) {
    // Check if estimated value is within min/max range
    if (financial.minimumValue && financial.estimatedValue < financial.minimumValue) {
      warnings.push('Estimated value is below minimum value');
    }
    if (financial.maximumValue && financial.estimatedValue > financial.maximumValue) {
      warnings.push('Estimated value exceeds maximum value');
    }

    // Check for unrealistic values
    if (financial.estimatedValue < 0) {
      errors.push('Contract value cannot be negative');
    }

    if (financial.estimatedValue > 1000000000) {
      // $1B
      warnings.push('Contract value exceeds $1B (unusual)');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    adjustedConfidence: errors.length === 0 ? 1.0 : 0.5,
  };
}

/**
 * Validate NAICS code
 */
export function validateNAICSCode(value: string | undefined): FieldValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!value) {
    return { valid: true, errors: [], warnings: ['NAICS code not provided'], adjustedConfidence: 0 };
  }

  // Must be 6 digits
  if (!/^\d{6}$/.test(value)) {
    errors.push('NAICS code must be exactly 6 digits');
  }

  // First 2 digits indicate sector (11-99)
  const sector = parseInt(value.substring(0, 2), 10);
  if (sector < 11 || sector > 99) {
    errors.push('Invalid NAICS sector code');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    adjustedConfidence: errors.length === 0 ? 1.0 : 0.3,
  };
}

/**
 * Validate PSC code
 */
export function validatePSCCode(value: string | undefined): FieldValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!value) {
    return { valid: true, errors: [], warnings: ['PSC code not provided'], adjustedConfidence: 0 };
  }

  // Must be 4 characters (letter + 3 digits or 4 letters/digits)
  if (!/^[A-Z0-9]{4}$/.test(value)) {
    errors.push('PSC code must be 4 alphanumeric characters');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    adjustedConfidence: errors.length === 0 ? 1.0 : 0.4,
  };
}

/**
 * Validate enum field
 */
export function validateEnum<T extends string>(
  value: T | undefined,
  allowedValues: readonly T[],
  fieldName: string
): FieldValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!value) {
    return { valid: true, errors: [], warnings: [`${fieldName} not provided`], adjustedConfidence: 0 };
  }

  if (!allowedValues.includes(value)) {
    errors.push(`Invalid ${fieldName}: "${value}". Must be one of: ${allowedValues.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    adjustedConfidence: errors.length === 0 ? 1.0 : 0.2,
  };
}

/**
 * Validate evaluation weights
 */
export function validateEvaluation(evaluation: EvaluationMetadata): FieldValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if weights add up to approximately 100
  const weights = [
    evaluation.priceWeight || 0,
    evaluation.technicalWeight || 0,
    evaluation.pastPerformanceWeight || 0,
  ];

  const total = weights.reduce((sum, w) => sum + w, 0);

  if (total > 0) {
    if (Math.abs(total - 100) > 5) {
      // Allow 5% tolerance
      warnings.push(`Evaluation weights add up to ${total}% (expected ~100%)`);
    }
  }

  // LPTA should have high price weight
  if (evaluation.evaluationMethod === 'LPTA') {
    if (evaluation.priceWeight && evaluation.priceWeight < 80) {
      warnings.push('LPTA typically has very high price weight (>80%)');
    }
  }

  // Validate percentages
  for (const weight of weights) {
    if (weight < 0 || weight > 100) {
      errors.push('Weights must be between 0 and 100');
      break;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    adjustedConfidence: errors.length === 0 ? 1.0 : 0.6,
  };
}

/**
 * Validate complete metadata
 */
export function validateMetadata(metadata: SolicitationMetadata): {
  valid: boolean;
  errors: string[];
  warnings: string[];
  fieldValidations: Record<string, FieldValidation>;
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const fieldValidations: Record<string, FieldValidation> = {};

  // Administrative
  const solNumValidation = validateSolicitationNumber(metadata.administrative.solicitationNumber);
  fieldValidations['solicitationNumber'] = solNumValidation;
  errors.push(...solNumValidation.errors);
  warnings.push(...solNumValidation.warnings);

  if (metadata.administrative.setAsideType) {
    const setAsideValidation = validateEnum(
      metadata.administrative.setAsideType,
      ['none', '8(a)', 'HUBZone', 'SDVOSB', 'WOSB', 'small-business', 'total-small-business', 'partial-small-business', 'other'] as const,
      'setAsideType'
    );
    fieldValidations['setAsideType'] = setAsideValidation;
    errors.push(...setAsideValidation.errors);
    warnings.push(...setAsideValidation.warnings);
  }

  // Timeline
  const timelineValidation = validateTimeline(metadata.timeline);
  fieldValidations['timeline'] = timelineValidation;
  errors.push(...timelineValidation.errors);
  warnings.push(...timelineValidation.warnings);

  // Financial
  const financialValidation = validateFinancial(metadata.financial);
  fieldValidations['financial'] = financialValidation;
  errors.push(...financialValidation.errors);
  warnings.push(...financialValidation.warnings);

  // Technical
  if (metadata.technical.naicsCode) {
    const naicsValidation = validateNAICSCode(metadata.technical.naicsCode);
    fieldValidations['naicsCode'] = naicsValidation;
    errors.push(...naicsValidation.errors);
    warnings.push(...naicsValidation.warnings);
  }

  if (metadata.technical.pscCode) {
    const pscValidation = validatePSCCode(metadata.technical.pscCode);
    fieldValidations['pscCode'] = pscValidation;
    errors.push(...pscValidation.errors);
    warnings.push(...pscValidation.warnings);
  }

  // Evaluation
  const evaluationValidation = validateEvaluation(metadata.evaluation);
  fieldValidations['evaluation'] = evaluationValidation;
  errors.push(...evaluationValidation.errors);
  warnings.push(...evaluationValidation.warnings);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    fieldValidations,
  };
}

/**
 * Calculate confidence score for metadata category
 */
export function calculateCategoryConfidence(
  fields: Record<string, MetadataField<any> | undefined>
): number {
  const entries = Object.entries(fields).filter(([_, field]) => field !== undefined);

  if (entries.length === 0) return 0;

  const totalConfidence = entries.reduce((sum, [_, field]) => {
    return sum + (field?.confidence || 0);
  }, 0);

  return totalConfidence / entries.length;
}

/**
 * Calculate overall confidence score
 */
export function calculateOverallConfidence(metadata: SolicitationMetadata): {
  overall: number;
  byCategory: {
    administrative: number;
    timeline: number;
    financial: number;
    technical: number;
    submission: number;
    evaluation: number;
  };
} {
  // This would need the actual MetadataField wrapped values
  // For now, return placeholder structure
  return {
    overall: 0,
    byCategory: {
      administrative: 0,
      timeline: 0,
      financial: 0,
      technical: 0,
      submission: 0,
      evaluation: 0,
    },
  };
}

/**
 * Count extracted fields
 */
export function countExtractedFields(metadata: SolicitationMetadata): {
  total: number;
  byCategory: Record<string, number>;
} {
  let total = 0;
  const byCategory: Record<string, number> = {};

  // Administrative (8 fields)
  let adminCount = 0;
  if (metadata.administrative.solicitationNumber) adminCount++;
  if (metadata.administrative.title) adminCount++;
  if (metadata.administrative.issuingAgency) adminCount++;
  if (metadata.administrative.agencyOffice) adminCount++;
  if (metadata.administrative.contractingOfficer) adminCount++;
  if (metadata.administrative.contractSpecialist) adminCount++;
  if (metadata.administrative.setAsideType) adminCount++;
  if (metadata.administrative.procurementType) adminCount++;
  byCategory['administrative'] = adminCount;
  total += adminCount;

  // Timeline (7 fields)
  let timelineCount = 0;
  if (metadata.timeline.issueDate) timelineCount++;
  if (metadata.timeline.responseDeadline) timelineCount++;
  if (metadata.timeline.qaDeadline) timelineCount++;
  if (metadata.timeline.preProposalConferenceDate) timelineCount++;
  if (metadata.timeline.estimatedAwardDate) timelineCount++;
  if (metadata.timeline.periodOfPerformance) timelineCount++;
  if (metadata.timeline.optionPeriods && metadata.timeline.optionPeriods.length > 0) timelineCount++;
  byCategory['timeline'] = timelineCount;
  total += timelineCount;

  // Financial (6 fields)
  let financialCount = 0;
  if (metadata.financial.estimatedValue !== undefined) financialCount++;
  if (metadata.financial.minimumValue !== undefined) financialCount++;
  if (metadata.financial.maximumValue !== undefined) financialCount++;
  if (metadata.financial.budgetAvailable !== undefined) financialCount++;
  if (metadata.financial.contractType) financialCount++;
  if (metadata.financial.paymentTerms) financialCount++;
  byCategory['financial'] = financialCount;
  total += financialCount;

  // Technical (10 fields)
  let technicalCount = 0;
  if (metadata.technical.naicsCode) technicalCount++;
  if (metadata.technical.pscCode) technicalCount++;
  if (metadata.technical.securityClearanceRequired) technicalCount++;
  if (metadata.technical.facilityClearanceRequired !== undefined) technicalCount++;
  if (metadata.technical.placeOfPerformance) technicalCount++;
  if (metadata.technical.technicalRequirementsSummary) technicalCount++;
  if (metadata.technical.keyTechnologies && metadata.technical.keyTechnologies.length > 0) technicalCount++;
  if (metadata.technical.deliverablesCount !== undefined) technicalCount++;
  if (metadata.technical.incumbentInformation) technicalCount++;
  if (metadata.technical.protestHistory !== undefined) technicalCount++;
  byCategory['technical'] = technicalCount;
  total += technicalCount;

  // Submission (8 fields)
  let submissionCount = 0;
  if (metadata.submission.submissionMethod) submissionCount++;
  if (metadata.submission.pageLimit !== undefined) submissionCount++;
  if (metadata.submission.formatRequirements) submissionCount++;
  if (metadata.submission.requiredSections && metadata.submission.requiredSections.length > 0) submissionCount++;
  if (metadata.submission.proposalVolumes && metadata.submission.proposalVolumes.length > 0) submissionCount++;
  if (metadata.submission.costPriceRequirements) submissionCount++;
  if (metadata.submission.pastPerformanceRequirements) submissionCount++;
  if (metadata.submission.smallBusinessParticipation) submissionCount++;
  byCategory['submission'] = submissionCount;
  total += submissionCount;

  // Evaluation (8 fields)
  let evaluationCount = 0;
  if (metadata.evaluation.evaluationCriteria && metadata.evaluation.evaluationCriteria.length > 0) evaluationCount++;
  if (metadata.evaluation.evaluationMethod) evaluationCount++;
  if (metadata.evaluation.priceWeight !== undefined) evaluationCount++;
  if (metadata.evaluation.technicalWeight !== undefined) evaluationCount++;
  if (metadata.evaluation.pastPerformanceWeight !== undefined) evaluationCount++;
  if (metadata.evaluation.keyPersonnelRequired !== undefined) evaluationCount++;
  if (metadata.evaluation.corporateExperienceRequired !== undefined) evaluationCount++;
  if (metadata.evaluation.oralPresentationRequired !== undefined) evaluationCount++;
  byCategory['evaluation'] = evaluationCount;
  total += evaluationCount;

  return { total, byCategory };
}

/**
 * Get list of missing fields
 */
export function getMissingFields(metadata: SolicitationMetadata): string[] {
  const missing: string[] = [];

  // Administrative
  if (!metadata.administrative.solicitationNumber) missing.push('administrative.solicitationNumber');
  if (!metadata.administrative.title) missing.push('administrative.title');
  if (!metadata.administrative.issuingAgency) missing.push('administrative.issuingAgency');
  if (!metadata.administrative.agencyOffice) missing.push('administrative.agencyOffice');
  if (!metadata.administrative.contractingOfficer) missing.push('administrative.contractingOfficer');
  if (!metadata.administrative.contractSpecialist) missing.push('administrative.contractSpecialist');
  if (!metadata.administrative.setAsideType) missing.push('administrative.setAsideType');
  if (!metadata.administrative.procurementType) missing.push('administrative.procurementType');

  // Timeline
  if (!metadata.timeline.issueDate) missing.push('timeline.issueDate');
  if (!metadata.timeline.responseDeadline) missing.push('timeline.responseDeadline');
  if (!metadata.timeline.qaDeadline) missing.push('timeline.qaDeadline');
  if (!metadata.timeline.preProposalConferenceDate) missing.push('timeline.preProposalConferenceDate');
  if (!metadata.timeline.estimatedAwardDate) missing.push('timeline.estimatedAwardDate');
  if (!metadata.timeline.periodOfPerformance) missing.push('timeline.periodOfPerformance');
  if (!metadata.timeline.optionPeriods || metadata.timeline.optionPeriods.length === 0)
    missing.push('timeline.optionPeriods');

  // Financial
  if (metadata.financial.estimatedValue === undefined) missing.push('financial.estimatedValue');
  if (metadata.financial.minimumValue === undefined) missing.push('financial.minimumValue');
  if (metadata.financial.maximumValue === undefined) missing.push('financial.maximumValue');
  if (metadata.financial.budgetAvailable === undefined) missing.push('financial.budgetAvailable');
  if (!metadata.financial.contractType) missing.push('financial.contractType');
  if (!metadata.financial.paymentTerms) missing.push('financial.paymentTerms');

  // Technical (and remaining categories...)
  if (!metadata.technical.naicsCode) missing.push('technical.naicsCode');
  if (!metadata.technical.pscCode) missing.push('technical.pscCode');
  if (!metadata.technical.securityClearanceRequired) missing.push('technical.securityClearanceRequired');
  if (metadata.technical.facilityClearanceRequired === undefined)
    missing.push('technical.facilityClearanceRequired');
  if (!metadata.technical.placeOfPerformance) missing.push('technical.placeOfPerformance');
  if (!metadata.technical.technicalRequirementsSummary) missing.push('technical.technicalRequirementsSummary');
  if (!metadata.technical.keyTechnologies || metadata.technical.keyTechnologies.length === 0)
    missing.push('technical.keyTechnologies');
  if (metadata.technical.deliverablesCount === undefined) missing.push('technical.deliverablesCount');
  if (!metadata.technical.incumbentInformation) missing.push('technical.incumbentInformation');
  if (metadata.technical.protestHistory === undefined) missing.push('technical.protestHistory');

  // Submission
  if (!metadata.submission.submissionMethod) missing.push('submission.submissionMethod');
  if (metadata.submission.pageLimit === undefined) missing.push('submission.pageLimit');
  if (!metadata.submission.formatRequirements) missing.push('submission.formatRequirements');
  if (!metadata.submission.requiredSections || metadata.submission.requiredSections.length === 0)
    missing.push('submission.requiredSections');
  if (!metadata.submission.proposalVolumes || metadata.submission.proposalVolumes.length === 0)
    missing.push('submission.proposalVolumes');
  if (!metadata.submission.costPriceRequirements) missing.push('submission.costPriceRequirements');
  if (!metadata.submission.pastPerformanceRequirements) missing.push('submission.pastPerformanceRequirements');
  if (!metadata.submission.smallBusinessParticipation) missing.push('submission.smallBusinessParticipation');

  // Evaluation
  if (!metadata.evaluation.evaluationCriteria || metadata.evaluation.evaluationCriteria.length === 0)
    missing.push('evaluation.evaluationCriteria');
  if (!metadata.evaluation.evaluationMethod) missing.push('evaluation.evaluationMethod');
  if (metadata.evaluation.priceWeight === undefined) missing.push('evaluation.priceWeight');
  if (metadata.evaluation.technicalWeight === undefined) missing.push('evaluation.technicalWeight');
  if (metadata.evaluation.pastPerformanceWeight === undefined) missing.push('evaluation.pastPerformanceWeight');
  if (metadata.evaluation.keyPersonnelRequired === undefined) missing.push('evaluation.keyPersonnelRequired');
  if (metadata.evaluation.corporateExperienceRequired === undefined)
    missing.push('evaluation.corporateExperienceRequired');
  if (metadata.evaluation.oralPresentationRequired === undefined)
    missing.push('evaluation.oralPresentationRequired');

  return missing;
}
