/**
 * AI Quality Scoring Service
 *
 * Automatically scores deliverables using multi-AI validation
 */

import { prisma } from '@/lib/prisma';
import { orchestrate } from '@/lib/aliff/orchestration/orchestrator';
import { readFile } from 'fs/promises';

/**
 * Score a deliverable using AI
 */
export async function scoreDeliverableQuality(deliverableId: string) {
  console.log(`[Quality Scoring] Starting scoring for deliverable ${deliverableId}`);

  try {
    // Get deliverable with project context
    const deliverable = await prisma.deliverable.findUnique({
      where: { id: deliverableId },
      include: {
        project: {
          include: {
            documents: {
              where: { documentType: 'RFP_MAIN' },
              take: 1,
            },
          },
        },
        assignment: {
          include: {
            teamMember: true,
          },
        },
      },
    });

    if (!deliverable) {
      throw new Error('Deliverable not found');
    }

    // Read deliverable file
    const fileBuffer = await readFile(deliverable.filePath);
    const fileContent = fileBuffer.toString('utf-8');

    // Build scoring prompt
    const prompt = buildQualityScoringPrompt(deliverable, fileContent);

    // Execute multi-AI scoring
    const scoringResult = await orchestrate({
      prompt,
      models: ['gpt-4', 'claude-3.5-sonnet'], // Use multiple AIs for consensus
      strategy: 'dual',
    });

    // Parse scoring results
    const score = parseQualityScore(scoringResult);

    // Store score in database
    await prisma.deliverable.update({
      where: { id: deliverableId },
      data: {
        qualityScore: score.overall,
        aiValidation: score as any, // Store detailed breakdown
      },
    });

    console.log(
      `[Quality Scoring] Scored deliverable ${deliverableId}: ${score.overall}%`
    );

    return score;
  } catch (error) {
    console.error(`[Quality Scoring] Error scoring deliverable ${deliverableId}:`, error);
    throw error;
  }
}

/**
 * Build quality scoring prompt
 */
function buildQualityScoringPrompt(deliverable: any, content: string): string {
  const projectContext = deliverable.project;
  const assignmentType = deliverable.assignment.assignmentType;

  return `
You are an expert quality reviewer for government contract proposals. Score this deliverable on a scale of 0-100.

**Project Context:**
- Project: ${projectContext.title}
- Industry: ${projectContext.industryCategory || 'Government'}
- Contract Value: ${projectContext.contractValue ? `$${projectContext.contractValue}` : 'Not specified'}

**Deliverable Info:**
- Type: ${deliverable.deliverableType}
- Assignment: ${assignmentType}
- Title: ${deliverable.title}
- Description: ${deliverable.description || 'None'}

**Content to Review:**
${content.substring(0, 50000)} ${content.length > 50000 ? '... (truncated)' : ''}

**Scoring Criteria (0-100 for each):**

1. **Completeness (25 points)**: Does it address all requirements?
2. **Clarity (25 points)**: Is it well-written and easy to understand?
3. **Technical Accuracy (25 points)**: Is the information accurate and correct?
4. **Compliance (25 points)**: Does it meet government proposal standards?

**Additional Factors:**
- Grammar and spelling
- Professional formatting
- Logical flow and organization
- Specificity and detail
- Alignment with RFP requirements

**Output Format (JSON):**
\`\`\`json
{
  "overall": 85,
  "completeness": 90,
  "clarity": 85,
  "technicalAccuracy": 80,
  "compliance": 85,
  "strengths": [
    "Clear technical descriptions",
    "Good compliance with requirements"
  ],
  "weaknesses": [
    "Could use more specific examples",
    "Some sections need more detail"
  ],
  "recommendations": [
    "Add 2-3 case studies to strengthen technical approach",
    "Expand section 3 with more quantitative data"
  ],
  "passesQualityGate": true
}
\`\`\`

Provide your assessment:
`;
}

/**
 * Parse quality score from AI response
 */
function parseQualityScore(result: any): QualityScore {
  try {
    // Extract JSON from response
    const content =
      result.consensus?.content || result.primary?.content || result.content;

    // Try to parse JSON
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[1]);
      return {
        overall: parsed.overall || 0,
        completeness: parsed.completeness || 0,
        clarity: parsed.clarity || 0,
        technicalAccuracy: parsed.technicalAccuracy || 0,
        compliance: parsed.compliance || 0,
        strengths: parsed.strengths || [],
        weaknesses: parsed.weaknesses || [],
        recommendations: parsed.recommendations || [],
        passesQualityGate: parsed.passesQualityGate || false,
      };
    }

    // Fallback: try direct JSON parse
    const parsed = JSON.parse(content);
    return {
      overall: parsed.overall || 0,
      completeness: parsed.completeness || 0,
      clarity: parsed.clarity || 0,
      technicalAccuracy: parsed.technicalAccuracy || 0,
      compliance: parsed.compliance || 0,
      strengths: parsed.strengths || [],
      weaknesses: parsed.weaknesses || [],
      recommendations: parsed.recommendations || [],
      passesQualityGate: parsed.passesQualityGate || false,
    };
  } catch (error) {
    console.error('[Quality Scoring] Error parsing score:', error);
    // Return default score on error
    return {
      overall: 50,
      completeness: 50,
      clarity: 50,
      technicalAccuracy: 50,
      compliance: 50,
      strengths: [],
      weaknesses: ['AI scoring failed - manual review required'],
      recommendations: ['Manual review required'],
      passesQualityGate: false,
    };
  }
}

/**
 * Quality score structure
 */
export interface QualityScore {
  overall: number;
  completeness: number;
  clarity: number;
  technicalAccuracy: number;
  compliance: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  passesQualityGate: boolean;
}

/**
 * Validate deliverable against RFP requirements
 */
export async function validateAgainstRFP(
  deliverableId: string,
  rfpDocumentId: string
) {
  console.log(
    `[Quality Scoring] Validating deliverable ${deliverableId} against RFP ${rfpDocumentId}`
  );

  try {
    const deliverable = await prisma.deliverable.findUnique({
      where: { id: deliverableId },
    });

    const rfpDocument = await prisma.projectDocument.findUnique({
      where: { id: rfpDocumentId },
    });

    if (!deliverable || !rfpDocument) {
      throw new Error('Deliverable or RFP not found');
    }

    // Read files
    const deliverableContent = (
      await readFile(deliverable.filePath)
    ).toString('utf-8');
    const rfpContent = (await readFile(rfpDocument.filePath)).toString('utf-8');

    // Build validation prompt
    const prompt = `
You are a compliance expert for government contracts. Validate this deliverable against RFP requirements.

**RFP Requirements:**
${rfpContent.substring(0, 30000)}

**Deliverable Submission:**
${deliverableContent.substring(0, 30000)}

**Validation Tasks:**
1. Identify all mandatory requirements in the RFP
2. Check if the deliverable addresses each requirement
3. Flag any missing or incomplete sections
4. Verify compliance with formatting/structure requirements

**Output Format (JSON):**
\`\`\`json
{
  "complianceScore": 90,
  "mandatoryRequirementsMet": 18,
  "mandatoryRequirementsTotal": 20,
  "missingRequirements": [
    "Section 3.2.1: Past performance examples",
    "Appendix B: Staffing plan"
  ],
  "formattingIssues": [
    "Missing page numbers",
    "Font size should be 12pt"
  ],
  "compliant": false,
  "criticalIssues": [
    "Missing required appendices"
  ]
}
\`\`\`

Provide your compliance validation:
`;

    const result = await orchestrate({
      prompt,
      models: ['gpt-4'],
      strategy: 'single',
    });

    return parseComplianceValidation(result);
  } catch (error) {
    console.error('[Quality Scoring] Error validating against RFP:', error);
    throw error;
  }
}

/**
 * Parse compliance validation result
 */
function parseComplianceValidation(result: any) {
  try {
    const content = result.primary?.content || result.content;
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('[Quality Scoring] Error parsing compliance:', error);
    return {
      complianceScore: 0,
      mandatoryRequirementsMet: 0,
      mandatoryRequirementsTotal: 0,
      missingRequirements: ['Validation failed - manual review required'],
      formattingIssues: [],
      compliant: false,
      criticalIssues: ['AI validation failed'],
    };
  }
}

/**
 * Batch score multiple deliverables
 */
export async function batchScoreDeliverables(deliverableIds: string[]) {
  console.log(
    `[Quality Scoring] Batch scoring ${deliverableIds.length} deliverables`
  );

  const results = [];

  for (const id of deliverableIds) {
    try {
      const score = await scoreDeliverableQuality(id);
      results.push({ id, success: true, score });
    } catch (error) {
      console.error(`[Quality Scoring] Failed to score ${id}:`, error);
      results.push({
        id,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return results;
}

/**
 * Get quality trends for a project
 */
export async function getQualityTrends(projectId: string) {
  const deliverables = await prisma.deliverable.findMany({
    where: {
      projectId,
      qualityScore: { not: null },
    },
    orderBy: { submittedAt: 'asc' },
  });

  const scores = deliverables.map((d) => d.qualityScore || 0);

  return {
    average: scores.reduce((sum, score) => sum + score, 0) / scores.length || 0,
    min: Math.min(...scores) || 0,
    max: Math.max(...scores) || 0,
    trend:
      scores.length > 1
        ? scores[scores.length - 1] - scores[0]
        : 0,
    totalScored: scores.length,
    aboveThreshold: scores.filter((s) => s >= 80).length,
  };
}
