/**
 * Aliff AI - SDL Compliance Analyzer
 *
 * AI-powered compliance framework detection and gap analysis.
 */

import { v4 as uuidv4 } from 'uuid';
import type { ParsedDocument } from '../parsing/types';
import type { Requirement, RequirementsExtractionResult } from '../requirements/types';
import type {
  ComplianceAnalysisResult,
  ComplianceChecklist,
  ComplianceConfig,
  ComplianceFramework,
  ComplianceGap,
  ComplianceItem,
  ComplianceStatus,
  FrameworkDetection,
  ImpactLevel,
} from './types';
import { COMPLIANCE_FRAMEWORKS, COMPLIANCE_KEYWORDS } from './types';
import {
  COMPLIANCE_SYSTEM_PROMPT,
  getFrameworkDetectionPrompt,
  getGapAnalysisPrompt,
  getChecklistPrompt,
  getRemediationPrompt,
  getRiskAssessmentPrompt,
} from './prompts';
import * as Models from '../../orchestration/models';
import type { AIRequest } from '../../orchestration/types';

/**
 * Analyze compliance for a solicitation
 */
export async function analyzeCompliance(
  document: ParsedDocument,
  requirements: RequirementsExtractionResult,
  config?: Partial<ComplianceConfig>
): Promise<ComplianceAnalysisResult> {
  const startTime = Date.now();

  const analysisConfig: ComplianceConfig = {
    useAI: config?.useAI ?? true,
    model: config?.model || 'gpt-4', // Use GPT-4 for compliance analysis
    autoDetectFrameworks: config?.autoDetectFrameworks ?? true,
    includeRecommendations: config?.includeRecommendations ?? true,
    estimateCosts: config?.estimateCosts ?? true,
    confidenceThreshold: config?.confidenceThreshold ?? 0.7,
  };

  try {
    // Detect compliance frameworks
    let detectedFrameworks: FrameworkDetection[] = [];
    if (analysisConfig.autoDetectFrameworks) {
      detectedFrameworks = await detectFrameworks(document, analysisConfig);
    }

    // Filter high-confidence frameworks
    const relevantFrameworks = detectedFrameworks.filter(
      (f) => f.confidence >= analysisConfig.confidenceThreshold!
    );

    // Generate compliance checklists for each framework
    const checklists: ComplianceChecklist[] = [];
    const allGaps: ComplianceGap[] = [];

    for (const framework of relevantFrameworks) {
      const checklist = await generateChecklist(
        requirements.requirements,
        framework.framework,
        analysisConfig
      );

      checklists.push(checklist);

      // Extract gaps from checklist
      const frameworkGaps = await analyzeGaps(
        requirements.requirements,
        framework.framework,
        analysisConfig
      );

      allGaps.push(...frameworkGaps);
    }

    // Calculate overall compliance metrics
    const totalRequirements = requirements.requirements.length;
    let compliantCount = 0;
    let partialCount = 0;
    let nonCompliantCount = 0;
    let unknownCount = 0;

    for (const checklist of checklists) {
      compliantCount += checklist.compliantItems;
      partialCount += checklist.partialItems;
      nonCompliantCount += checklist.nonCompliantItems;
      unknownCount += checklist.unknownItems;
    }

    // Average across checklists if multiple
    if (checklists.length > 1) {
      compliantCount = Math.round(compliantCount / checklists.length);
      partialCount = Math.round(partialCount / checklists.length);
      nonCompliantCount = Math.round(nonCompliantCount / checklists.length);
      unknownCount = Math.round(unknownCount / checklists.length);
    }

    const complianceRate =
      totalRequirements > 0
        ? Math.round((compliantCount / totalRequirements) * 100)
        : 0;

    // Determine overall risk level
    const criticalGaps = allGaps.filter((g) => g.impact === 'critical').length;
    const highGaps = allGaps.filter((g) => g.impact === 'high').length;

    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (criticalGaps > 0 || complianceRate < 50) {
      riskLevel = 'critical';
    } else if (highGaps > 3 || complianceRate < 70) {
      riskLevel = 'high';
    } else if (complianceRate < 85) {
      riskLevel = 'medium';
    } else {
      riskLevel = 'low';
    }

    // Generate recommendations if enabled
    const recommendations: ComplianceAnalysisResult['recommendations'] = [];
    if (analysisConfig.includeRecommendations && allGaps.length > 0) {
      const topGaps = allGaps
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 10);

      for (const gap of topGaps) {
        recommendations.push({
          priority: gap.impact,
          action: gap.remediation.actions[0] || 'Address compliance gap',
          rationale: gap.gapDescription,
          impact: `Addressing this gap will improve compliance and reduce ${gap.impact} risk`,
        });
      }
    }

    // Estimate effort and cost
    let totalHours = 0;
    let totalCost = 0;

    for (const gap of allGaps) {
      if (gap.remediation.cost) {
        totalCost += gap.remediation.cost;
      }

      // Estimate hours based on effort
      const effortHours = {
        low: 40,
        medium: 160,
        high: 400,
      };
      totalHours += effortHours[gap.remediation.effort] || 0;
    }

    const timeToCompliance =
      totalHours > 1600
        ? '6+ months'
        : totalHours > 800
          ? '3-6 months'
          : totalHours > 400
            ? '2-3 months'
            : totalHours > 160
              ? '1-2 months'
              : '< 1 month';

    // Generate warnings
    const warnings: string[] = [];

    if (detectedFrameworks.length === 0) {
      warnings.push('No compliance frameworks detected - manual review recommended');
    }

    if (criticalGaps > 0) {
      warnings.push(
        `${criticalGaps} critical compliance gap(s) identified - may be deal-breaker`
      );
    }

    if (complianceRate < 60) {
      warnings.push(
        `Low compliance rate (${complianceRate}%) - significant gaps exist`
      );
    }

    if (totalCost > 500000) {
      warnings.push(
        `High estimated compliance cost ($${(totalCost / 1000).toFixed(0)}K) - assess ROI`
      );
    }

    return {
      checklists,
      detectedFrameworks,
      gaps: allGaps,
      overallCompliance: {
        totalRequirements,
        compliantCount,
        partialCount,
        nonCompliantCount,
        unknownCount,
        complianceRate,
        riskLevel,
      },
      recommendations,
      estimatedEffort: {
        totalHours,
        totalCost,
        timeToCompliance,
      },
      warnings,
      analysisTimeMs: Date.now() - startTime,
    };
  } catch (error) {
    console.error('[analyzeCompliance] Analysis failed:', error);

    return {
      checklists: [],
      detectedFrameworks: [],
      gaps: [],
      overallCompliance: {
        totalRequirements: requirements.requirements.length,
        compliantCount: 0,
        partialCount: 0,
        nonCompliantCount: 0,
        unknownCount: requirements.requirements.length,
        complianceRate: 0,
        riskLevel: 'critical',
      },
      recommendations: [],
      estimatedEffort: {
        totalHours: 0,
        totalCost: 0,
        timeToCompliance: 'unknown',
      },
      warnings: [
        `Compliance analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ],
      analysisTimeMs: Date.now() - startTime,
    };
  }
}

/**
 * Detect compliance frameworks in document
 */
async function detectFrameworks(
  document: ParsedDocument,
  config: ComplianceConfig
): Promise<FrameworkDetection[]> {
  const prompt = getFrameworkDetectionPrompt(document.content);

  const result = await callAI(prompt, config);

  if (!result) {
    // Fallback to keyword-based detection
    return detectFrameworksByKeywords(document.content);
  }

  try {
    const parsed = JSON.parse(result);

    if (!Array.isArray(parsed)) {
      return detectFrameworksByKeywords(document.content);
    }

    return parsed.map((detection: any) => ({
      framework: detection.framework as ComplianceFramework,
      confidence: detection.confidence || 0.8,
      evidence: detection.evidence || [],
      requiredControls: detection.requiredControls || [],
      estimatedComplexity: detection.estimatedComplexity || 5,
    }));
  } catch (error) {
    console.error('[detectFrameworks] Failed to parse response:', error);
    return detectFrameworksByKeywords(document.content);
  }
}

/**
 * Fallback: Detect frameworks by keywords
 */
function detectFrameworksByKeywords(content: string): FrameworkDetection[] {
  const lowerContent = content.toLowerCase();
  const detections: FrameworkDetection[] = [];

  for (const [framework, keywords] of Object.entries(COMPLIANCE_KEYWORDS)) {
    if (framework === 'other') continue;

    const matches = keywords.filter((kw) => lowerContent.includes(kw.toLowerCase()));

    if (matches.length > 0) {
      const frameworkInfo = COMPLIANCE_FRAMEWORKS[framework as keyof typeof COMPLIANCE_FRAMEWORKS];

      detections.push({
        framework: framework as ComplianceFramework,
        confidence: Math.min(0.6 + matches.length * 0.1, 1.0),
        evidence: matches.map((kw) => `Keyword detected: "${kw}"`),
        requiredControls: frameworkInfo?.keyControls ? [...frameworkInfo.keyControls] : [],
        estimatedComplexity: frameworkInfo?.estimatedComplexity || 5,
      });
    }
  }

  return detections;
}

/**
 * Generate compliance checklist
 */
async function generateChecklist(
  requirements: Requirement[],
  framework: ComplianceFramework,
  config: ComplianceConfig
): Promise<ComplianceChecklist> {
  const prompt = getChecklistPrompt(requirements, framework);

  const result = await callAI(prompt, config);

  if (!result) {
    return createEmptyChecklist(framework, requirements);
  }

  try {
    const parsed = JSON.parse(result);
    const checklistData = parsed.checklist || parsed;

    // Count compliance status
    let compliantItems = 0;
    let partialItems = 0;
    let nonCompliantItems = 0;
    let unknownItems = 0;

    for (const item of checklistData.items || []) {
      switch (item.status) {
        case 'compliant':
          compliantItems++;
          break;
        case 'partial':
          partialItems++;
          break;
        case 'non-compliant':
          nonCompliantItems++;
          break;
        default:
          unknownItems++;
      }
    }

    const totalItems = checklistData.items?.length || 0;
    const complianceRate =
      totalItems > 0 ? Math.round((compliantItems / totalItems) * 100) : 0;

    const riskLevel: 'low' | 'medium' | 'high' | 'critical' =
      complianceRate >= 85
        ? 'low'
        : complianceRate >= 70
          ? 'medium'
          : complianceRate >= 50
            ? 'high'
            : 'critical';

    return {
      id: uuidv4(),
      name: checklistData.name || `${framework} Compliance Checklist`,
      description: checklistData.description || '',
      framework,
      items: checklistData.items || [],
      totalItems,
      compliantItems,
      partialItems,
      nonCompliantItems,
      unknownItems,
      complianceRate,
      riskLevel,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error('[generateChecklist] Failed to parse response:', error);
    return createEmptyChecklist(framework, requirements);
  }
}

/**
 * Create empty checklist as fallback
 */
function createEmptyChecklist(
  framework: ComplianceFramework,
  requirements: Requirement[]
): ComplianceChecklist {
  return {
    id: uuidv4(),
    name: `${framework} Compliance Checklist`,
    description: `Compliance checklist for ${framework}`,
    framework,
    items: [],
    totalItems: 0,
    compliantItems: 0,
    partialItems: 0,
    nonCompliantItems: 0,
    unknownItems: requirements.length,
    complianceRate: 0,
    riskLevel: 'critical',
    createdAt: new Date(),
  };
}

/**
 * Analyze compliance gaps
 */
async function analyzeGaps(
  requirements: Requirement[],
  framework: ComplianceFramework,
  config: ComplianceConfig
): Promise<ComplianceGap[]> {
  const prompt = getGapAnalysisPrompt(requirements, framework);

  const result = await callAI(prompt, config);

  if (!result) {
    return [];
  }

  try {
    const parsed = JSON.parse(result);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((gapData: any) => {
        const requirement = requirements.find((r) => r.id === gapData.requirementId);

        if (!requirement) return null;

        const item: ComplianceItem = {
          id: uuidv4(),
          requirement,
          status: gapData.status as ComplianceStatus,
          impact: gapData.impact as ImpactLevel,
          evidence: gapData.evidence || [],
          gaps: gapData.gaps || [],
          recommendations: gapData.recommendations || [],
          effort: gapData.effort,
          cost: gapData.estimatedCost,
          timeframe: gapData.timeframe,
          notes: gapData.notes,
        };

        // Calculate priority (1-10) based on impact
        const priorityMap: Record<ImpactLevel, number> = {
          critical: 10,
          high: 7,
          medium: 4,
          low: 2,
        };

        const gap: ComplianceGap = {
          id: uuidv4(),
          item,
          gapDescription: gapData.gaps?.join('; ') || 'Compliance gap identified',
          impact: gapData.impact as ImpactLevel,
          affectedRequirements: [gapData.requirementId],
          remediation: {
            actions: gapData.recommendations || [],
            effort: gapData.effort || 'medium',
            cost: gapData.estimatedCost,
            timeframe: gapData.timeframe,
            dependencies: [],
          },
          priority: priorityMap[gapData.impact as ImpactLevel] || 5,
        };

        return gap;
      })
      .filter((gap): gap is ComplianceGap => gap !== null);
  } catch (error) {
    console.error('[analyzeGaps] Failed to parse response:', error);
    return [];
  }
}

/**
 * Call AI model
 */
async function callAI(prompt: string, config: ComplianceConfig): Promise<string | null> {
  const aiRequest: AIRequest = {
    prompt,
    systemPrompt: COMPLIANCE_SYSTEM_PROMPT,
    temperature: 0.2, // Low temperature for structured analysis
    maxTokens: 4000,
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
 * Get high-priority gaps
 */
export function getHighPriorityGaps(
  gaps: ComplianceGap[],
  threshold: number = 7
): ComplianceGap[] {
  return gaps.filter((gap) => gap.priority >= threshold);
}

/**
 * Get gaps by impact level
 */
export function getGapsByImpact(
  gaps: ComplianceGap[],
  impact: ImpactLevel
): ComplianceGap[] {
  return gaps.filter((gap) => gap.impact === impact);
}

/**
 * Calculate total remediation cost
 */
export function calculateRemediationCost(gaps: ComplianceGap[]): number {
  return gaps.reduce((total, gap) => total + (gap.remediation.cost || 0), 0);
}

/**
 * Get compliance summary
 */
export function getComplianceSummary(result: ComplianceAnalysisResult): {
  totalFrameworks: number;
  totalGaps: number;
  criticalGaps: number;
  estimatedCost: number;
  riskLevel: string;
  recommendation: string;
} {
  const criticalGaps = result.gaps.filter((g) => g.impact === 'critical').length;

  let recommendation: string;
  if (result.overallCompliance.riskLevel === 'critical') {
    recommendation = 'High risk - significant compliance gaps. Recommend no-bid unless gaps can be closed.';
  } else if (result.overallCompliance.riskLevel === 'high') {
    recommendation = 'Elevated risk - multiple compliance gaps. Assess feasibility of remediation.';
  } else if (result.overallCompliance.riskLevel === 'medium') {
    recommendation = 'Moderate risk - some compliance gaps. Develop remediation plan.';
  } else {
    recommendation = 'Low risk - minimal compliance gaps. Good opportunity.';
  }

  return {
    totalFrameworks: result.detectedFrameworks.length,
    totalGaps: result.gaps.length,
    criticalGaps,
    estimatedCost: result.estimatedEffort.totalCost,
    riskLevel: result.overallCompliance.riskLevel,
    recommendation,
  };
}
