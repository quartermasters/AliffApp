/**
 * Aliff AI - SDL Triage Orchestrator
 *
 * Main orchestrator for complete RFP/solicitation triage.
 */

import { v4 as uuidv4 } from 'uuid';
import type {
  TriageResult,
  TriageConfig,
  TriageSummary,
  TriagePerformance,
  BatchTriageRequest,
  BatchTriageResult,
} from './types';
import { DETAIL_LEVEL_PRESETS, VIABILITY_WEIGHTS } from './types';
import { parseDocument, type ParseResult } from '../parsing';
import { extractMetadata, type MetadataExtractionResult } from '../extraction';
import { extractRequirements, type RequirementsExtractionResult } from '../requirements';
import { analyzeCompliance, type ComplianceAnalysisResult } from '../compliance';
import { scoreOpportunity, type ScoringResult } from '../scoring';

/**
 * Run complete SDL Triage on a document
 */
export async function runTriage(
  buffer: Buffer,
  filename: string,
  config?: Partial<TriageConfig>
): Promise<TriageResult> {
  const startTime = Date.now();
  const triageId = uuidv4();

  // Merge config with defaults
  const triageConfig: TriageConfig = {
    useAI: true,
    model: config?.model || 'gpt-4',
    parallelProcessing: config?.parallelProcessing ?? true,
    extractMetadata: config?.extractMetadata ?? true,
    extractRequirements: config?.extractRequirements ?? true,
    analyzeCompliance: config?.analyzeCompliance ?? true,
    scoreOpportunity: config?.scoreOpportunity ?? true,
    detailLevel: config?.detailLevel || 'standard',
    organizationProfile: config?.organizationProfile,
    thresholds: config?.thresholds,
    ...DETAIL_LEVEL_PRESETS[config?.detailLevel || 'standard'],
    ...config, // User config overrides presets
  };

  const errors: string[] = [];
  const warnings: string[] = [];
  let status: 'success' | 'partial' | 'failed' = 'success';

  // Performance tracking
  const performance: TriagePerformance = {
    totalTimeMs: 0,
    breakdown: {
      parsing: 0,
      metadata: 0,
      requirements: 0,
      compliance: 0,
      scoring: 0,
      summarization: 0,
    },
    aiCallsMade: 0,
    aiCostUSD: 0,
    tokensUsed: {
      input: 0,
      output: 0,
      total: 0,
    },
  };

  try {
    // STAGE 1: Document Parsing
    console.log(`[SDL Triage ${triageId}] Stage 1/5: Parsing document...`);
    const parseStart = Date.now();
    const parseResult = await parseDocument(buffer, filename);
    performance.breakdown.parsing = Date.now() - parseStart;

    if (!parseResult.success || !parseResult.document) {
      errors.push('Document parsing failed');
      status = 'failed';

      return {
        id: triageId,
        timestamp: new Date(),
        document: {
          id: uuidv4(),
          filename,
          type: 'unknown',
          content: '',
          metadata: { fileSize: buffer.length, wordCount: 0, charCount: 0 },
          structure: { sections: [], headings: [] },
          parseTimeMs: 0,
          timestamp: new Date(),
        },
        metadata: createEmptyMetadata(),
        requirements: createEmptyRequirements(),
        compliance: createEmptyCompliance(),
        scoring: createEmptyScoring(),
        summary: createEmptySummary(),
        performance,
        status: 'failed',
        errors,
        warnings: ['Document parsing failed - cannot proceed with analysis'],
      };
    }

    const document = parseResult.document;

    if (parseResult.warnings) {
      warnings.push(...parseResult.warnings);
    }

    // STAGE 2: Metadata Extraction
    console.log(`[SDL Triage ${triageId}] Stage 2/5: Extracting metadata...`);
    let metadata: MetadataExtractionResult;

    if (triageConfig.extractMetadata) {
      const metadataStart = Date.now();
      try {
        metadata = await extractMetadata(document, {
          useAI: triageConfig.useAI,
          model: triageConfig.model,
        });
        performance.breakdown.metadata = Date.now() - metadataStart;
        performance.aiCallsMade += 6; // 6 categories

        if (metadata.warnings) {
          warnings.push(...metadata.warnings);
        }

        if (metadata.fieldsExtracted < 20) {
          warnings.push(
            `Low metadata extraction rate (${metadata.fieldsExtracted}/47 fields)`
          );
          status = 'partial';
        }
      } catch (error) {
        errors.push(`Metadata extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        metadata = createEmptyMetadata();
        status = 'partial';
      }
    } else {
      metadata = createEmptyMetadata();
    }

    // STAGE 3: Requirements Extraction
    console.log(`[SDL Triage ${triageId}] Stage 3/5: Extracting requirements...`);
    let requirements: RequirementsExtractionResult;

    if (triageConfig.extractRequirements) {
      const reqStart = Date.now();
      try {
        requirements = await extractRequirements(document, {
          useAI: triageConfig.useAI,
          model: triageConfig.model,
        });
        performance.breakdown.requirements = Date.now() - reqStart;
        performance.aiCallsMade += 2; // Explicit + implicit

        if (requirements.warnings) {
          warnings.push(...requirements.warnings);
        }

        if (requirements.statistics.total < 10) {
          warnings.push(`Low requirements extraction (${requirements.statistics.total} found)`);
          status = 'partial';
        }
      } catch (error) {
        errors.push(`Requirements extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        requirements = createEmptyRequirements();
        status = 'partial';
      }
    } else {
      requirements = createEmptyRequirements();
    }

    // STAGE 4: Compliance Analysis
    console.log(`[SDL Triage ${triageId}] Stage 4/5: Analyzing compliance...`);
    let compliance: ComplianceAnalysisResult;

    if (triageConfig.analyzeCompliance) {
      const complianceStart = Date.now();
      try {
        compliance = await analyzeCompliance(document, requirements, {
          useAI: triageConfig.useAI,
          model: triageConfig.model,
        });
        performance.breakdown.compliance = Date.now() - complianceStart;
        performance.aiCallsMade += compliance.detectedFrameworks.length * 2; // Detection + gaps per framework

        if (compliance.warnings) {
          warnings.push(...compliance.warnings);
        }
      } catch (error) {
        errors.push(`Compliance analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        compliance = createEmptyCompliance();
        status = 'partial';
      }
    } else {
      compliance = createEmptyCompliance();
    }

    // STAGE 5: Opportunity Scoring
    console.log(`[SDL Triage ${triageId}] Stage 5/5: Scoring opportunity...`);
    let scoring: ScoringResult;

    if (triageConfig.scoreOpportunity) {
      const scoringStart = Date.now();
      try {
        scoring = await scoreOpportunity(
          metadata.metadata,
          requirements,
          compliance,
          {
            useAI: triageConfig.useAI,
            model: triageConfig.model,
            organizationProfile: triageConfig.organizationProfile,
          }
        );
        performance.breakdown.scoring = Date.now() - scoringStart;
        performance.aiCallsMade += 4; // Complexity, win prob, competitive, bid decision
      } catch (error) {
        errors.push(`Scoring failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        scoring = createEmptyScoring();
        status = 'partial';
      }
    } else {
      scoring = createEmptyScoring();
    }

    // STAGE 6: Generate Summary
    console.log(`[SDL Triage ${triageId}] Generating summary...`);
    const summaryStart = Date.now();
    const summary = generateSummary(
      metadata,
      requirements,
      compliance,
      scoring,
      triageConfig
    );
    performance.breakdown.summarization = Date.now() - summaryStart;

    // Calculate total performance
    performance.totalTimeMs = Date.now() - startTime;

    // Estimate AI costs (rough approximation)
    performance.aiCostUSD = estimateAICost(performance.aiCallsMade, triageConfig.model || 'gpt-4');

    console.log(
      `[SDL Triage ${triageId}] Complete! Viability: ${summary.viability}/100, Recommendation: ${summary.recommendation.toUpperCase()}`
    );

    return {
      id: triageId,
      timestamp: new Date(),
      document,
      metadata,
      requirements,
      compliance,
      scoring,
      summary,
      performance,
      status,
      errors,
      warnings,
    };
  } catch (error) {
    console.error(`[SDL Triage ${triageId}] Fatal error:`, error);

    return {
      id: triageId,
      timestamp: new Date(),
      document: {
        id: uuidv4(),
        filename,
        type: 'unknown',
        content: '',
        metadata: { fileSize: buffer.length, wordCount: 0, charCount: 0 },
        structure: { sections: [], headings: [] },
        parseTimeMs: 0,
        timestamp: new Date(),
      },
      metadata: createEmptyMetadata(),
      requirements: createEmptyRequirements(),
      compliance: createEmptyCompliance(),
      scoring: createEmptyScoring(),
      summary: createEmptySummary(),
      performance,
      status: 'failed',
      errors: [`Fatal error: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings,
    };
  }
}

/**
 * Generate executive summary
 */
function generateSummary(
  metadata: MetadataExtractionResult,
  requirements: RequirementsExtractionResult,
  compliance: ComplianceAnalysisResult,
  scoring: ScoringResult,
  config: TriageConfig
): TriageSummary {
  const meta = metadata.metadata;

  // Calculate overall viability score (0-100)
  const viability = calculateViability(
    scoring.winProbability.overall,
    scoring.complexity.overall,
    compliance.overallCompliance.complianceRate,
    scoring.recommendation.strategicFit
  );

  // Extract key strengths
  const keyStrengths: string[] = [];
  if (scoring.winProbability.strengths.length > 0) {
    keyStrengths.push(...scoring.winProbability.strengths.slice(0, 3));
  }
  if (compliance.overallCompliance.complianceRate > 80) {
    keyStrengths.push('High compliance rate - minimal gaps');
  }

  // Extract key challenges
  const keyChallenges: string[] = [];
  if (scoring.winProbability.weaknesses.length > 0) {
    keyChallenges.push(...scoring.winProbability.weaknesses.slice(0, 3));
  }
  if (scoring.complexity.overall > 70) {
    keyChallenges.push(`High complexity (${scoring.complexity.overall}/100)`);
  }

  // Extract critical gaps
  const criticalGaps: string[] = [];
  const criticalComplianceGaps = compliance.gaps
    .filter((g) => g.impact === 'critical')
    .slice(0, 5);

  for (const gap of criticalComplianceGaps) {
    criticalGaps.push(gap.gapDescription);
  }

  // Determine recommendation
  let recommendation: 'pursue' | 'monitor' | 'pass';
  if (scoring.recommendation.decision === 'go') {
    recommendation = 'pursue';
  } else if (scoring.recommendation.decision === 'no-go') {
    recommendation = 'pass';
  } else {
    recommendation = 'monitor';
  }

  // Apply thresholds if configured
  if (config.thresholds) {
    if (
      config.thresholds.minViability &&
      viability < config.thresholds.minViability
    ) {
      recommendation = 'pass';
    }
    if (
      config.thresholds.minWinProbability &&
      scoring.winProbability.overall < config.thresholds.minWinProbability
    ) {
      recommendation = 'pass';
    }
    if (
      config.thresholds.maxComplexity &&
      scoring.complexity.overall > config.thresholds.maxComplexity
    ) {
      recommendation = 'pass';
    }
  }

  return {
    title: meta.administrative.title || 'Unknown Solicitation',
    agency: meta.administrative.issuingAgency || 'Unknown Agency',
    solicitationNumber: meta.administrative.solicitationNumber,
    estimatedValue: meta.financial.estimatedValue,
    responseDeadline: meta.timeline.responseDeadline,
    viability,
    complexity: scoring.complexity.overall,
    winProbability: scoring.winProbability.overall,
    complianceRate: compliance.overallCompliance.complianceRate,
    keyStrengths,
    keyChallenges,
    criticalGaps,
    recommendation,
    confidence: scoring.recommendation.confidence,
    rationale: scoring.recommendation.rationale,
    stats: {
      fieldsExtracted: metadata.fieldsExtracted,
      requirementsFound: requirements.statistics.total,
      mustHaveRequirements: requirements.statistics.mustHave,
      complianceFrameworks: compliance.detectedFrameworks.length,
      criticalComplianceGaps: criticalComplianceGaps.length,
      estimatedBidCost: scoring.bidDecision.estimatedCost,
      expectedValue: scoring.bidDecision.expectedValue,
    },
  };
}

/**
 * Calculate overall viability score (0-100)
 */
function calculateViability(
  winProbability: number,
  complexity: number,
  complianceRate: number,
  strategicFit: number
): number {
  const viability =
    winProbability * VIABILITY_WEIGHTS.winProbability +
    complexity * VIABILITY_WEIGHTS.complexity + // Negative weight
    complianceRate * VIABILITY_WEIGHTS.complianceRate +
    strategicFit * VIABILITY_WEIGHTS.strategicFit;

  return Math.max(0, Math.min(100, Math.round(viability)));
}

/**
 * Estimate AI cost
 */
function estimateAICost(callsMade: number, model: string): number {
  // Rough estimates per call
  const costPerCall: Record<string, number> = {
    'gpt-4': 0.15, // $0.15 per call average
    claude: 0.10,
    gemini: 0.03,
  };

  return callsMade * (costPerCall[model] || 0.10);
}

/**
 * Run batch triage
 */
export async function runBatchTriage(
  request: BatchTriageRequest
): Promise<BatchTriageResult> {
  const startTime = Date.now();
  const results: TriageResult[] = [];

  console.log(`[SDL Batch Triage] Processing ${request.documents.length} documents...`);

  // Process documents (could be parallelized)
  for (const doc of request.documents) {
    console.log(`[SDL Batch Triage] Processing: ${doc.filename}`);
    try {
      const result = await runTriage(doc.buffer, doc.filename, request.config);
      results.push(result);
    } catch (error) {
      console.error(`[SDL Batch Triage] Failed to process ${doc.filename}:`, error);
    }
  }

  // Calculate summary statistics
  const successful = results.filter((r) => r.status === 'success').length;
  const partial = results.filter((r) => r.status === 'partial').length;
  const failed = results.filter((r) => r.status === 'failed').length;

  const viabilities = results
    .filter((r) => r.status !== 'failed')
    .map((r) => r.summary.viability);

  const averageViability =
    viabilities.length > 0
      ? viabilities.reduce((sum, v) => sum + v, 0) / viabilities.length
      : 0;

  const highPriorityCount = results.filter(
    (r) => r.summary.recommendation === 'pursue'
  ).length;

  const totalCostUSD = results.reduce((sum, r) => sum + r.performance.aiCostUSD, 0);

  // Rank by viability score
  const ranked = [...results].sort((a, b) => b.summary.viability - a.summary.viability);

  console.log(
    `[SDL Batch Triage] Complete! ${successful} successful, ${partial} partial, ${failed} failed. ${highPriorityCount} high priority.`
  );

  return {
    results,
    summary: {
      total: request.documents.length,
      successful,
      partial,
      failed,
      averageViability: Math.round(averageViability),
      highPriorityCount,
      totalTimeMs: Date.now() - startTime,
      totalCostUSD,
    },
    ranked,
  };
}

/**
 * Helper: Create empty metadata result
 */
function createEmptyMetadata(): MetadataExtractionResult {
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
    warnings: [],
    extractionTimeMs: 0,
  };
}

/**
 * Helper: Create empty requirements result
 */
function createEmptyRequirements(): RequirementsExtractionResult {
  return {
    requirements: [],
    byPriority: { mustHave: [], shouldHave: [], niceToHave: [] },
    byCategory: {
      technical: [],
      functional: [],
      security: [],
      compliance: [],
      staffing: [],
      deliverable: [],
      schedule: [],
      administrative: [],
      other: [],
    },
    evaluationCriteria: [],
    statistics: {
      total: 0,
      mustHave: 0,
      shouldHave: 0,
      niceToHave: 0,
      avgComplexity: 0,
      highComplexityCount: 0,
    },
    warnings: [],
    extractionTimeMs: 0,
  };
}

/**
 * Helper: Create empty compliance result
 */
function createEmptyCompliance(): ComplianceAnalysisResult {
  return {
    checklists: [],
    detectedFrameworks: [],
    gaps: [],
    overallCompliance: {
      totalRequirements: 0,
      compliantCount: 0,
      partialCount: 0,
      nonCompliantCount: 0,
      unknownCount: 0,
      complianceRate: 0,
      riskLevel: 'critical',
    },
    recommendations: [],
    estimatedEffort: {
      totalHours: 0,
      totalCost: 0,
      timeToCompliance: 'unknown',
    },
    warnings: [],
    analysisTimeMs: 0,
  };
}

/**
 * Helper: Create empty scoring result
 */
function createEmptyScoring(): ScoringResult {
  return {
    complexity: {
      overall: 50,
      breakdown: { technical: 50, compliance: 50, schedule: 50, team: 50, cost: 50 },
      factors: [],
      riskLevel: 'medium',
      confidence: 0,
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
      rationale: 'Insufficient data',
      confidence: 0,
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
      estimatedRevenue: 0,
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
      confidence: 0,
      rationale: 'Insufficient data',
      keyFactors: { pros: [], cons: [] },
      strategicFit: 50,
      riskLevel: 'medium',
    },
    scoringTimeMs: 0,
  };
}

/**
 * Helper: Create empty summary
 */
function createEmptySummary(): TriageSummary {
  return {
    title: 'Unknown',
    agency: 'Unknown',
    viability: 0,
    complexity: 0,
    winProbability: 0,
    complianceRate: 0,
    keyStrengths: [],
    keyChallenges: [],
    criticalGaps: [],
    recommendation: 'pass',
    confidence: 0,
    rationale: 'Analysis failed',
    stats: {
      fieldsExtracted: 0,
      requirementsFound: 0,
      mustHaveRequirements: 0,
      complianceFrameworks: 0,
      criticalComplianceGaps: 0,
      estimatedBidCost: 0,
      expectedValue: 0,
    },
  };
}
