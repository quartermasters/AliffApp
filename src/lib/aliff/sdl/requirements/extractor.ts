/**
 * Aliff AI - SDL Requirements Extractor
 *
 * AI-powered extraction and categorization of solicitation requirements.
 */

import { v4 as uuidv4 } from 'uuid';
import type { ParsedDocument } from '../parsing/types';
import type {
  Requirement,
  RequirementsByPriority,
  RequirementsByCategory,
  RequirementsExtractionResult,
  RequirementsConfig,
  EvaluationCriterion,
  RequirementPriority,
  RequirementCategory,
} from './types';
import {
  REQUIREMENTS_SYSTEM_PROMPT,
  getRequirementsPrompt,
  getEvaluationCriteriaPrompt,
  getImplicitRequirementsPrompt,
} from './prompts';
import * as Models from '../../orchestration/models';
import type { AIRequest } from '../../orchestration/types';

/**
 * Extract requirements from parsed document
 */
export async function extractRequirements(
  document: ParsedDocument,
  config?: Partial<RequirementsConfig>
): Promise<RequirementsExtractionResult> {
  const startTime = Date.now();

  const extractionConfig: RequirementsConfig = {
    useAI: config?.useAI ?? true,
    model: config?.model || 'gpt-4', // Use GPT-4 for accurate requirements extraction
    extractEvaluationCriteria: config?.extractEvaluationCriteria ?? true,
    includeImplicitRequirements: config?.includeImplicitRequirements ?? true,
    maxRequirements: config?.maxRequirements ?? 100,
    confidenceThreshold: config?.confidenceThreshold ?? 0.6,
  };

  try {
    // Extract explicit requirements
    const explicitRequirements = await extractExplicitRequirements(
      document,
      extractionConfig
    );

    // Extract implicit requirements if enabled
    let implicitRequirements: Requirement[] = [];
    if (extractionConfig.includeImplicitRequirements) {
      implicitRequirements = await extractImplicitRequirements(
        document,
        extractionConfig
      );
    }

    // Combine all requirements
    const allRequirements = [...explicitRequirements, ...implicitRequirements];

    // Filter by confidence threshold
    const requirements = allRequirements.filter(
      (req) => req.confidence >= extractionConfig.confidenceThreshold!
    );

    // Limit to max requirements if specified
    const limitedRequirements = extractionConfig.maxRequirements
      ? requirements.slice(0, extractionConfig.maxRequirements)
      : requirements;

    // Extract evaluation criteria
    let evaluationCriteria: EvaluationCriterion[] = [];
    if (extractionConfig.extractEvaluationCriteria) {
      evaluationCriteria = await extractEvaluationCriteria(
        document,
        extractionConfig
      );
    }

    // Organize by priority
    const byPriority: RequirementsByPriority = {
      mustHave: limitedRequirements.filter((r) => r.priority === 'must-have'),
      shouldHave: limitedRequirements.filter((r) => r.priority === 'should-have'),
      niceToHave: limitedRequirements.filter((r) => r.priority === 'nice-to-have'),
    };

    // Organize by category
    const byCategory: RequirementsByCategory = {
      technical: limitedRequirements.filter((r) => r.category === 'technical'),
      functional: limitedRequirements.filter((r) => r.category === 'functional'),
      security: limitedRequirements.filter((r) => r.category === 'security'),
      compliance: limitedRequirements.filter((r) => r.category === 'compliance'),
      staffing: limitedRequirements.filter((r) => r.category === 'staffing'),
      deliverable: limitedRequirements.filter((r) => r.category === 'deliverable'),
      schedule: limitedRequirements.filter((r) => r.category === 'schedule'),
      administrative: limitedRequirements.filter(
        (r) => r.category === 'administrative'
      ),
      other: limitedRequirements.filter((r) => r.category === 'other'),
    };

    // Calculate statistics
    const complexities = limitedRequirements
      .filter((r) => r.complexity !== undefined)
      .map((r) => r.complexity!);

    const avgComplexity =
      complexities.length > 0
        ? complexities.reduce((sum, c) => sum + c, 0) / complexities.length
        : 0;

    const highComplexityCount = limitedRequirements.filter(
      (r) => r.complexity && r.complexity > 7
    ).length;

    const statistics = {
      total: limitedRequirements.length,
      mustHave: byPriority.mustHave.length,
      shouldHave: byPriority.shouldHave.length,
      niceToHave: byPriority.niceToHave.length,
      avgComplexity: Math.round(avgComplexity * 10) / 10,
      highComplexityCount,
    };

    // Generate warnings
    const warnings: string[] = [];

    if (statistics.total === 0) {
      warnings.push('No requirements extracted - document may not contain requirements');
    } else if (statistics.total < 10) {
      warnings.push(`Only ${statistics.total} requirements extracted (expected 20+)`);
    }

    if (statistics.mustHave === 0) {
      warnings.push('No must-have requirements found - verify extraction accuracy');
    }

    if (statistics.highComplexityCount > statistics.total * 0.5) {
      warnings.push(
        `${statistics.highComplexityCount} high-complexity requirements (>${Math.round((statistics.highComplexityCount / statistics.total) * 100)}%) - challenging opportunity`
      );
    }

    if (evaluationCriteria.length === 0 && extractionConfig.extractEvaluationCriteria) {
      warnings.push('No evaluation criteria found - check Section M');
    }

    return {
      requirements: limitedRequirements,
      byPriority,
      byCategory,
      evaluationCriteria,
      statistics,
      warnings,
      extractionTimeMs: Date.now() - startTime,
    };
  } catch (error) {
    console.error('[extractRequirements] Extraction failed:', error);

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
      warnings: [
        `Requirements extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ],
      extractionTimeMs: Date.now() - startTime,
    };
  }
}

/**
 * Extract explicit requirements from document
 */
async function extractExplicitRequirements(
  document: ParsedDocument,
  config: RequirementsConfig
): Promise<Requirement[]> {
  const prompt = getRequirementsPrompt(document.content);

  const result = await callAI(prompt, config);

  if (!result) {
    return [];
  }

  try {
    const parsed = JSON.parse(result);

    if (!Array.isArray(parsed)) {
      console.error('[extractExplicitRequirements] Response is not an array');
      return [];
    }

    return parsed.map((req: any) => ({
      id: req.id || uuidv4(),
      text: req.text,
      priority: req.priority as RequirementPriority,
      category: req.category as RequirementCategory,
      source: req.source,
      verificationMethod: req.verificationMethod,
      acceptance: req.acceptance,
      notes: req.notes,
      keywords: req.keywords || [],
      complexity: req.complexity,
      confidence: req.confidence || 0.8,
    }));
  } catch (error) {
    console.error('[extractExplicitRequirements] Failed to parse response:', error);
    return [];
  }
}

/**
 * Extract implicit requirements
 */
async function extractImplicitRequirements(
  document: ParsedDocument,
  config: RequirementsConfig
): Promise<Requirement[]> {
  const prompt = getImplicitRequirementsPrompt(document.content);

  const result = await callAI(prompt, config);

  if (!result) {
    return [];
  }

  try {
    const parsed = JSON.parse(result);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((req: any) => ({
      id: req.id || `IMP-${uuidv4().substring(0, 8)}`,
      text: req.text,
      priority: req.priority as RequirementPriority,
      category: req.category as RequirementCategory,
      source: req.derivedFrom || 'Implicit requirement',
      keywords: req.keywords || [],
      complexity: req.complexity,
      confidence: req.confidence || 0.7, // Lower confidence for implicit
      notes: `Implicit requirement derived from: ${req.derivedFrom}`,
    }));
  } catch (error) {
    console.error('[extractImplicitRequirements] Failed to parse response:', error);
    return [];
  }
}

/**
 * Extract evaluation criteria
 */
async function extractEvaluationCriteria(
  document: ParsedDocument,
  config: RequirementsConfig
): Promise<EvaluationCriterion[]> {
  const prompt = getEvaluationCriteriaPrompt(document.content);

  const result = await callAI(prompt, config);

  if (!result) {
    return [];
  }

  try {
    const parsed = JSON.parse(result);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((criterion: any) => ({
      id: criterion.id || uuidv4(),
      name: criterion.name,
      description: criterion.description,
      weight: criterion.weight,
      subfactors: criterion.subfactors || [],
      source: criterion.source,
    }));
  } catch (error) {
    console.error('[extractEvaluationCriteria] Failed to parse response:', error);
    return [];
  }
}

/**
 * Call AI model for extraction
 */
async function callAI(
  prompt: string,
  config: RequirementsConfig
): Promise<string | null> {
  const aiRequest: AIRequest = {
    prompt,
    systemPrompt: REQUIREMENTS_SYSTEM_PROMPT,
    temperature: 0.2, // Low temperature for structured extraction
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
        response = await Models.OpenAIClient.call(aiRequest); // Default GPT-4
    }

    return response.content;
  } catch (error) {
    console.error('[callAI] AI call failed:', error);
    return null;
  }
}

/**
 * Filter requirements by priority
 */
export function filterByPriority(
  requirements: Requirement[],
  priority: RequirementPriority
): Requirement[] {
  return requirements.filter((req) => req.priority === priority);
}

/**
 * Filter requirements by category
 */
export function filterByCategory(
  requirements: Requirement[],
  category: RequirementCategory
): Requirement[] {
  return requirements.filter((req) => req.category === category);
}

/**
 * Search requirements by keyword
 */
export function searchRequirements(
  requirements: Requirement[],
  query: string
): Requirement[] {
  const lowerQuery = query.toLowerCase();

  return requirements.filter(
    (req) =>
      req.text.toLowerCase().includes(lowerQuery) ||
      req.keywords.some((kw) => kw.toLowerCase().includes(lowerQuery)) ||
      req.category.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get high-complexity requirements
 */
export function getHighComplexityRequirements(
  requirements: Requirement[],
  threshold: number = 7
): Requirement[] {
  return requirements.filter(
    (req) => req.complexity !== undefined && req.complexity >= threshold
  );
}

/**
 * Get requirements statistics
 */
export function getRequirementsStats(requirements: Requirement[]): {
  total: number;
  byPriority: Record<RequirementPriority, number>;
  byCategory: Record<RequirementCategory, number>;
  avgComplexity: number;
  highComplexity: number;
} {
  const byPriority: Record<RequirementPriority, number> = {
    'must-have': 0,
    'should-have': 0,
    'nice-to-have': 0,
  };

  const byCategory: Record<RequirementCategory, number> = {
    technical: 0,
    functional: 0,
    security: 0,
    compliance: 0,
    staffing: 0,
    deliverable: 0,
    schedule: 0,
    administrative: 0,
    other: 0,
  };

  let totalComplexity = 0;
  let complexityCount = 0;
  let highComplexity = 0;

  for (const req of requirements) {
    byPriority[req.priority]++;
    byCategory[req.category]++;

    if (req.complexity !== undefined) {
      totalComplexity += req.complexity;
      complexityCount++;

      if (req.complexity > 7) {
        highComplexity++;
      }
    }
  }

  return {
    total: requirements.length,
    byPriority,
    byCategory,
    avgComplexity: complexityCount > 0 ? totalComplexity / complexityCount : 0,
    highComplexity,
  };
}
