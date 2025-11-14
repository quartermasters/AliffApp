/**
 * Aliff AI - SDL Metadata Extractor
 *
 * AI-powered extraction of 47 metadata fields from solicitations.
 */

import type { ParsedDocument } from '../parsing/types';
import type {
  SolicitationMetadata,
  MetadataExtractionResult,
  ExtractionConfig,
  AdministrativeMetadata,
  TimelineMetadata,
  FinancialMetadata,
  TechnicalMetadata,
  SubmissionMetadata,
  EvaluationMetadata,
  MetadataField,
} from './types';
import {
  EXTRACTION_SYSTEM_PROMPT,
  getCategoryPrompt,
  getQuickExtractionPrompt,
} from './prompts';
import {
  validateMetadata,
  countExtractedFields,
  getMissingFields,
  calculateCategoryConfidence,
} from './validation';
import * as Models from '../../orchestration/models';
import type { AIRequest } from '../../orchestration/types';

/**
 * Extract metadata from parsed document
 */
export async function extractMetadata(
  document: ParsedDocument,
  config?: Partial<ExtractionConfig>
): Promise<MetadataExtractionResult> {
  const startTime = Date.now();

  const extractionConfig: ExtractionConfig = {
    useAI: true,
    model: config?.model || 'gemini', // Default to Gemini (fast & cheap)
    maxRetries: config?.maxRetries ?? 2,
    requireHighConfidence: config?.requireHighConfidence ?? false,
    confidenceThreshold: config?.confidenceThreshold ?? 0.6,
  };

  try {
    // Extract metadata by category (more accurate than all-at-once)
    const [administrative, timeline, financial, technical, submission, evaluation] =
      await Promise.all([
        extractAdministrative(document, extractionConfig),
        extractTimeline(document, extractionConfig),
        extractFinancial(document, extractionConfig),
        extractTechnical(document, extractionConfig),
        extractSubmission(document, extractionConfig),
        extractEvaluation(document, extractionConfig),
      ]);

    const metadata: SolicitationMetadata = {
      administrative,
      timeline,
      financial,
      technical,
      submission,
      evaluation,
    };

    // Validate extracted metadata
    const validation = validateMetadata(metadata);

    // Calculate confidence scores
    const confidence = {
      overall: calculateOverallConfidence(metadata),
      byCategory: {
        administrative: calculateCategoryConfidence(administrative as any),
        timeline: calculateCategoryConfidence(timeline as any),
        financial: calculateCategoryConfidence(financial as any),
        technical: calculateCategoryConfidence(technical as any),
        submission: calculateCategoryConfidence(submission as any),
        evaluation: calculateCategoryConfidence(evaluation as any),
      },
    };

    // Count extracted fields
    const { total: fieldsExtracted } = countExtractedFields(metadata);

    // Get missing fields
    const missingFields = getMissingFields(metadata);

    // Compile warnings
    const warnings: string[] = [...validation.warnings];

    if (fieldsExtracted < 30) {
      warnings.push(`Only ${fieldsExtracted}/47 fields extracted (low extraction rate)`);
    }

    if (confidence.overall < extractionConfig.confidenceThreshold!) {
      warnings.push(
        `Overall confidence ${(confidence.overall * 100).toFixed(1)}% below threshold ${(extractionConfig.confidenceThreshold! * 100).toFixed(1)}%`
      );
    }

    return {
      metadata,
      confidence,
      fieldsExtracted,
      missingFields,
      warnings,
      extractionTimeMs: Date.now() - startTime,
    };
  } catch (error) {
    console.error('[MetadataExtractor] Extraction failed:', error);

    // Return empty metadata on error
    return {
      metadata: {
        administrative: {},
        timeline: {},
        financial: {},
        technical: {},
        submission: {},
        evaluation: {},
      },
      confidence: {
        overall: 0,
        byCategory: {
          administrative: 0,
          timeline: 0,
          financial: 0,
          technical: 0,
          submission: 0,
          evaluation: 0,
        },
      },
      fieldsExtracted: 0,
      missingFields: [],
      warnings: [
        `Extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ],
      extractionTimeMs: Date.now() - startTime,
    };
  }
}

/**
 * Calculate overall confidence from category confidences
 */
function calculateOverallConfidence(metadata: SolicitationMetadata): number {
  const categoryConfidences = [
    calculateCategoryConfidence(metadata.administrative as any),
    calculateCategoryConfidence(metadata.timeline as any),
    calculateCategoryConfidence(metadata.financial as any),
    calculateCategoryConfidence(metadata.technical as any),
    calculateCategoryConfidence(metadata.submission as any),
    calculateCategoryConfidence(metadata.evaluation as any),
  ];

  const total = categoryConfidences.reduce((sum, conf) => sum + conf, 0);
  return total / categoryConfidences.length;
}

/**
 * Extract administrative metadata
 */
async function extractAdministrative(
  document: ParsedDocument,
  config: ExtractionConfig
): Promise<AdministrativeMetadata> {
  const prompt = getCategoryPrompt('administrative', document.content);

  const result = await callAI(prompt, config);

  if (!result) {
    return {};
  }

  // Parse AI response (expected JSON)
  try {
    const parsed = JSON.parse(result);

    return {
      solicitationNumber: parsed.solicitationNumber?.value,
      title: parsed.title?.value,
      issuingAgency: parsed.issuingAgency?.value,
      agencyOffice: parsed.agencyOffice?.value,
      contractingOfficer: parsed.contractingOfficer?.value,
      contractSpecialist: parsed.contractSpecialist?.value,
      setAsideType: parsed.setAsideType?.value,
      procurementType: parsed.procurementType?.value,
    };
  } catch (error) {
    console.error('[extractAdministrative] Failed to parse AI response:', error);
    return {};
  }
}

/**
 * Extract timeline metadata
 */
async function extractTimeline(
  document: ParsedDocument,
  config: ExtractionConfig
): Promise<TimelineMetadata> {
  const prompt = getCategoryPrompt('timeline', document.content);

  const result = await callAI(prompt, config);

  if (!result) {
    return {};
  }

  try {
    const parsed = JSON.parse(result);

    return {
      issueDate: parsed.issueDate?.value ? new Date(parsed.issueDate.value) : undefined,
      responseDeadline: parsed.responseDeadline?.value
        ? new Date(parsed.responseDeadline.value)
        : undefined,
      qaDeadline: parsed.qaDeadline?.value ? new Date(parsed.qaDeadline.value) : undefined,
      preProposalConferenceDate: parsed.preProposalConferenceDate?.value
        ? new Date(parsed.preProposalConferenceDate.value)
        : undefined,
      estimatedAwardDate: parsed.estimatedAwardDate?.value
        ? new Date(parsed.estimatedAwardDate.value)
        : undefined,
      periodOfPerformance: parsed.periodOfPerformance?.value,
      optionPeriods: parsed.optionPeriods?.value,
    };
  } catch (error) {
    console.error('[extractTimeline] Failed to parse AI response:', error);
    return {};
  }
}

/**
 * Extract financial metadata
 */
async function extractFinancial(
  document: ParsedDocument,
  config: ExtractionConfig
): Promise<FinancialMetadata> {
  const prompt = getCategoryPrompt('financial', document.content);

  const result = await callAI(prompt, config);

  if (!result) {
    return {};
  }

  try {
    const parsed = JSON.parse(result);

    return {
      estimatedValue: parsed.estimatedValue?.value,
      minimumValue: parsed.minimumValue?.value,
      maximumValue: parsed.maximumValue?.value,
      budgetAvailable: parsed.budgetAvailable?.value,
      contractType: parsed.contractType?.value,
      paymentTerms: parsed.paymentTerms?.value,
    };
  } catch (error) {
    console.error('[extractFinancial] Failed to parse AI response:', error);
    return {};
  }
}

/**
 * Extract technical metadata
 */
async function extractTechnical(
  document: ParsedDocument,
  config: ExtractionConfig
): Promise<TechnicalMetadata> {
  const prompt = getCategoryPrompt('technical', document.content);

  const result = await callAI(prompt, config);

  if (!result) {
    return {};
  }

  try {
    const parsed = JSON.parse(result);

    return {
      naicsCode: parsed.naicsCode?.value,
      pscCode: parsed.pscCode?.value,
      securityClearanceRequired: parsed.securityClearanceRequired?.value,
      facilityClearanceRequired: parsed.facilityClearanceRequired?.value,
      placeOfPerformance: parsed.placeOfPerformance?.value,
      technicalRequirementsSummary: parsed.technicalRequirementsSummary?.value,
      keyTechnologies: parsed.keyTechnologies?.value,
      deliverablesCount: parsed.deliverablesCount?.value,
      incumbentInformation: parsed.incumbentInformation?.value,
      protestHistory: parsed.protestHistory?.value,
    };
  } catch (error) {
    console.error('[extractTechnical] Failed to parse AI response:', error);
    return {};
  }
}

/**
 * Extract submission metadata
 */
async function extractSubmission(
  document: ParsedDocument,
  config: ExtractionConfig
): Promise<SubmissionMetadata> {
  const prompt = getCategoryPrompt('submission', document.content);

  const result = await callAI(prompt, config);

  if (!result) {
    return {};
  }

  try {
    const parsed = JSON.parse(result);

    return {
      submissionMethod: parsed.submissionMethod?.value,
      pageLimit: parsed.pageLimit?.value,
      formatRequirements: parsed.formatRequirements?.value,
      requiredSections: parsed.requiredSections?.value,
      proposalVolumes: parsed.proposalVolumes?.value,
      costPriceRequirements: parsed.costPriceRequirements?.value,
      pastPerformanceRequirements: parsed.pastPerformanceRequirements?.value,
      smallBusinessParticipation: parsed.smallBusinessParticipation?.value,
    };
  } catch (error) {
    console.error('[extractSubmission] Failed to parse AI response:', error);
    return {};
  }
}

/**
 * Extract evaluation metadata
 */
async function extractEvaluation(
  document: ParsedDocument,
  config: ExtractionConfig
): Promise<EvaluationMetadata> {
  const prompt = getCategoryPrompt('evaluation', document.content);

  const result = await callAI(prompt, config);

  if (!result) {
    return {};
  }

  try {
    const parsed = JSON.parse(result);

    return {
      evaluationCriteria: parsed.evaluationCriteria?.value,
      evaluationMethod: parsed.evaluationMethod?.value,
      priceWeight: parsed.priceWeight?.value,
      technicalWeight: parsed.technicalWeight?.value,
      pastPerformanceWeight: parsed.pastPerformanceWeight?.value,
      keyPersonnelRequired: parsed.keyPersonnelRequired?.value,
      corporateExperienceRequired: parsed.corporateExperienceRequired?.value,
      oralPresentationRequired: parsed.oralPresentationRequired?.value,
    };
  } catch (error) {
    console.error('[extractEvaluation] Failed to parse AI response:', error);
    return {};
  }
}

/**
 * Call AI model for extraction
 */
async function callAI(
  prompt: string,
  config: ExtractionConfig
): Promise<string | null> {
  const aiRequest: AIRequest = {
    prompt,
    systemPrompt: EXTRACTION_SYSTEM_PROMPT,
    temperature: 0.1, // Low temperature for factual extraction
    maxTokens: 2000,
  };

  try {
    let response;

    // Use specified model
    switch (config.model) {
      case 'gemini':
        response = await Models.GoogleAIClient.call(aiRequest);
        break;
      case 'gpt-4':
        response = await Models.OpenAIClient.call(aiRequest);
        break;
      case 'claude':
        response = await Models.AnthropicClient.call(aiRequest);
        break;
      default:
        // Default to Gemini
        response = await Models.GoogleAIClient.call(aiRequest);
    }

    return response.content;
  } catch (error) {
    console.error('[callAI] AI call failed:', error);

    // Retry logic
    if (config.maxRetries && config.maxRetries > 0) {
      console.log(`[callAI] Retrying... (${config.maxRetries} retries left)`);

      const retryConfig = { ...config, maxRetries: config.maxRetries - 1 };
      return callAI(prompt, retryConfig);
    }

    return null;
  }
}

/**
 * Quick extraction (all fields at once - faster but less accurate)
 */
export async function extractMetadataQuick(
  document: ParsedDocument,
  config?: Partial<ExtractionConfig>
): Promise<MetadataExtractionResult> {
  const startTime = Date.now();

  const extractionConfig: ExtractionConfig = {
    useAI: true,
    model: config?.model || 'gemini',
    maxRetries: config?.maxRetries ?? 1, // Fewer retries for quick mode
    requireHighConfidence: false,
    confidenceThreshold: 0.5, // Lower threshold for quick mode
  };

  const prompt = getQuickExtractionPrompt(document.content);

  const result = await callAI(prompt, extractionConfig);

  if (!result) {
    return {
      metadata: {
        administrative: {},
        timeline: {},
        financial: {},
        technical: {},
        submission: {},
        evaluation: {},
      },
      confidence: {
        overall: 0,
        byCategory: {
          administrative: 0,
          timeline: 0,
          financial: 0,
          technical: 0,
          submission: 0,
          evaluation: 0,
        },
      },
      fieldsExtracted: 0,
      missingFields: [],
      warnings: ['Quick extraction failed'],
      extractionTimeMs: Date.now() - startTime,
    };
  }

  try {
    const parsed = JSON.parse(result);

    const metadata: SolicitationMetadata = {
      administrative: parsed.administrative || {},
      timeline: parsed.timeline || {},
      financial: parsed.financial || {},
      technical: parsed.technical || {},
      submission: parsed.submission || {},
      evaluation: parsed.evaluation || {},
    };

    const validation = validateMetadata(metadata);
    const { total: fieldsExtracted } = countExtractedFields(metadata);
    const missingFields = getMissingFields(metadata);

    // Calculate confidence (simplified for quick mode)
    const confidence = {
      overall: 0.7, // Default confidence for quick mode
      byCategory: {
        administrative: 0.7,
        timeline: 0.7,
        financial: 0.7,
        technical: 0.7,
        submission: 0.7,
        evaluation: 0.7,
      },
    };

    return {
      metadata,
      confidence,
      fieldsExtracted,
      missingFields,
      warnings: [...validation.warnings, 'Quick extraction mode used (lower accuracy)'],
      extractionTimeMs: Date.now() - startTime,
    };
  } catch (error) {
    console.error('[extractMetadataQuick] Failed to parse response:', error);

    return {
      metadata: {
        administrative: {},
        timeline: {},
        financial: {},
        technical: {},
        submission: {},
        evaluation: {},
      },
      confidence: {
        overall: 0,
        byCategory: {
          administrative: 0,
          timeline: 0,
          financial: 0,
          technical: 0,
          submission: 0,
          evaluation: 0,
        },
      },
      fieldsExtracted: 0,
      missingFields: [],
      warnings: ['Failed to parse quick extraction response'],
      extractionTimeMs: Date.now() - startTime,
    };
  }
}

/**
 * Extract specific metadata category
 */
export async function extractCategory(
  document: ParsedDocument,
  category: keyof SolicitationMetadata,
  config?: Partial<ExtractionConfig>
): Promise<any> {
  const extractionConfig: ExtractionConfig = {
    useAI: true,
    model: config?.model || 'gemini',
    maxRetries: config?.maxRetries ?? 2,
    requireHighConfidence: config?.requireHighConfidence ?? false,
    confidenceThreshold: config?.confidenceThreshold ?? 0.6,
  };

  switch (category) {
    case 'administrative':
      return extractAdministrative(document, extractionConfig);
    case 'timeline':
      return extractTimeline(document, extractionConfig);
    case 'financial':
      return extractFinancial(document, extractionConfig);
    case 'technical':
      return extractTechnical(document, extractionConfig);
    case 'submission':
      return extractSubmission(document, extractionConfig);
    case 'evaluation':
      return extractEvaluation(document, extractionConfig);
    default:
      throw new Error(`Unknown category: ${category}`);
  }
}
