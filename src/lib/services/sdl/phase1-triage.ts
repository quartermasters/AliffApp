/**
 * SDL Phase 1: Triage Execution
 *
 * Tasks 1-11: AI-Led, Human-Supervised
 * - Document ingestion and parsing
 * - Metadata extraction
 * - Requirements extraction
 * - Complexity scoring (1-10)
 * - Risk flag detection
 *
 * Output: Structured solicitation data ready for human strategist review
 */

import { prisma } from '@/lib/prisma';
import { getAIRouter } from '../ai-router';
import { SDLTaskStatus } from '@prisma/client';
import { readFile } from 'fs/promises';

// ============================================================================
// PHASE 1 TASK PROMPTS
// ============================================================================

const TASK_PROMPTS = {
  // Task 1: Document Ingestion and Parsing
  1: `You are a document parsing expert for government solicitations.

Parse the provided RFP/RFQ document and extract the full text while preserving structure.

Your task:
1. Extract all text content from the document
2. Preserve section headings, numbering, and hierarchy
3. Identify major sections (e.g., Section L, Section M, Statement of Work, etc.)
4. Maintain formatting that indicates document structure

Return a JSON object with:
{
  "fullText": "Complete document text",
  "sections": [
    {
      "sectionNumber": "L",
      "sectionTitle": "Instructions to Offerors",
      "content": "...",
      "pageStart": 10,
      "pageEnd": 25
    }
  ],
  "totalPages": 150,
  "documentType": "RFP" or "RFQ" or "IFB",
  "parsingNotes": "Any issues or observations during parsing"
}`,

  // Task 2: Metadata Extraction
  2: `You are a metadata extraction specialist for government contracts.

Extract all key metadata from this solicitation document.

Your task:
1. Identify agency name and organization
2. Extract solicitation number
3. Find all critical dates (issue date, questions due, proposal due, etc.)
4. Determine contract type (FFP, T&M, CPFF, IDIQ, etc.)
5. Extract estimated contract value or range
6. Identify NAICS code and size standard
7. Determine set-aside type (if any)

Return a JSON object with:
{
  "agencyName": "Department of Veterans Affairs",
  "subAgency": "VA Medical Center - Seattle",
  "solicitationNumber": "VA-250-25-R-0001",
  "dates": {
    "issueDate": "2025-01-15",
    "questionsDue": "2025-02-01",
    "proposalDue": "2025-02-15",
    "contractStart": "2025-03-01"
  },
  "contractType": "FFP",
  "estimatedValue": {
    "min": 500000,
    "max": 1000000,
    "currency": "USD"
  },
  "naicsCode": "541611",
  "sizeStandard": "$25.5M",
  "setAside": "Total Small Business" or "8(a)" or "SDVOSB" or "None",
  "placeOfPerformance": "Seattle, WA"
}`,

  // Task 3: Section Identification and Structure Mapping
  3: `You are an expert at analyzing RFP document structure.

Map the complete structure of this solicitation document.

Your task:
1. Identify all major sections and their purposes
2. Map evaluation criteria sections (typically Section M)
3. Identify technical requirements (typically Section C or SOW)
4. Find instructions to offerors (typically Section L)
5. Locate past performance requirements
6. Identify any amendments or modifications

Return a JSON object with:
{
  "sectionMap": [
    {
      "section": "L",
      "title": "Instructions, Conditions, and Notices to Offerors",
      "purpose": "Proposal submission requirements",
      "pageRange": "10-25",
      "subsections": ["L.1 Proposal Format", "L.2 Past Performance"]
    }
  ],
  "evaluationCriteriaSection": "M",
  "technicalRequirementsSection": "C",
  "contractClausesSection": "I",
  "hasAmendments": false,
  "documentComplexity": "Moderate" or "Simple" or "Complex"
}`,

  // Task 4: Generate Table of Contents
  4: `You are a document organization specialist.

Generate a comprehensive, navigable table of contents for this solicitation.

Your task:
1. Create a hierarchical TOC with all sections
2. Include page numbers
3. Highlight critical sections
4. Organize by importance for proposal writers

Return a JSON object with:
{
  "tableOfContents": [
    {
      "level": 1,
      "section": "Section L",
      "title": "Instructions to Offerors",
      "page": 10,
      "critical": true
    },
    {
      "level": 2,
      "section": "L.1",
      "title": "Proposal Format and Content",
      "page": 11,
      "critical": true
    }
  ],
  "criticalSections": ["L", "M", "C", "SOW"],
  "totalSections": 15
}`,

  // Task 5: Extract All Stated Requirements
  5: `You are a requirements extraction expert for government contracts.

Extract ALL stated requirements from this solicitation.

Your task:
1. Extract every technical requirement
2. Identify every compliance requirement
3. Capture mandatory certifications
4. Note deliverables and timelines
5. Extract personnel qualifications
6. Identify facility/equipment requirements

Be EXHAUSTIVE - missing a requirement can disqualify a proposal.

Return a JSON object with:
{
  "requirements": [
    {
      "id": "REQ-001",
      "category": "Technical" or "Compliance" or "Personnel" or "Deliverable",
      "requirement": "Provide 24/7 helpdesk support",
      "source": "Section C.3.1",
      "mandatory": true,
      "evaluationCriteria": "Section M.2"
    }
  ],
  "totalRequirements": 47,
  "mandatoryCount": 35,
  "preferredCount": 12,
  "requirementsComplexity": "High" or "Medium" or "Low"
}`,

  // Task 6: Extract Evaluation Criteria with Point Values
  6: `You are an evaluation criteria specialist.

Extract the complete evaluation criteria and scoring methodology.

Your task:
1. Extract all evaluation factors
2. Capture point values or weights
3. Understand the evaluation methodology
4. Identify subfactors and their weights
5. Determine what matters most

Return a JSON object with:
{
  "evaluationMethod": "Best Value" or "LPTA" or "Tradeoff",
  "evaluationFactors": [
    {
      "factor": "Technical Approach",
      "weight": 40,
      "points": 400,
      "subfactors": [
        {
          "subfactor": "Understanding of Requirements",
          "weight": 50,
          "points": 200
        }
      ],
      "evaluationStandard": "Adjectival ratings (Outstanding/Good/Acceptable/Marginal/Unacceptable)"
    }
  ],
  "totalPoints": 1000,
  "priceWeight": 30,
  "technicalWeight": 70,
  "mostImportantFactor": "Technical Approach",
  "tiebreaker": "Past Performance"
}`,

  // Task 7: Extract Compliance Requirements
  7: `You are a compliance requirements specialist.

Extract ALL compliance and mandatory submission requirements.

Your task:
1. Identify required certifications (e.g., SAM registration)
2. Extract mandatory representations and certifications
3. Identify security clearance requirements
4. Note insurance requirements
5. Capture proposal format requirements (page limits, fonts, etc.)
6. Identify any special requirements (CMMC, FedRAMP, etc.)

Return a JSON object with:
{
  "complianceRequirements": [
    {
      "requirement": "Active SAM registration",
      "type": "Registration",
      "deadline": "Before proposal submission",
      "mandatory": true,
      "disqualifyingIfMissing": true
    }
  ],
  "proposalFormatRequirements": {
    "pageLimit": 50,
    "fontSize": "12pt",
    "margins": "1 inch",
    "format": "PDF"
  },
  "certifications": ["FAR 52.204-8", "FAR 52.209-5"],
  "securityClearanceRequired": "Secret",
  "specialRequirements": ["CMMC Level 2", "FedRAMP Moderate"],
  "criticalDeadlines": [
    {
      "item": "Questions due",
      "date": "2025-02-01",
      "critical": true
    }
  ]
}`,

  // Task 8: Timeline/Deadline Mapping
  8: `You are a timeline and deadline expert.

Map all critical dates and timeline constraints.

Your task:
1. Extract all dates mentioned in the solicitation
2. Identify critical deadlines
3. Calculate timeline constraints
4. Identify contract period of performance
5. Note any phase-in or transition periods

Return a JSON object with:
{
  "timeline": [
    {
      "milestone": "Solicitation Issue Date",
      "date": "2025-01-15",
      "type": "Informational"
    },
    {
      "milestone": "Questions Due",
      "date": "2025-02-01 5:00 PM EST",
      "type": "Critical",
      "daysFromNow": 17
    }
  ],
  "periodOfPerformance": {
    "start": "2025-03-01",
    "end": "2026-02-28",
    "duration": "12 months",
    "optionPeriods": 4
  },
  "transitionPeriod": {
    "duration": "30 days",
    "critical": true,
    "notes": "Transition from incumbent required"
  },
  "timelinePressure": "High" or "Medium" or "Low",
  "criticalConstraints": ["30-day transition", "Security clearances required"]
}`,

  // Task 9: Generate Initial Compliance Checklist
  9: `You are a compliance checklist specialist.

Create a comprehensive compliance checklist for proposal preparation.

Your task:
1. List all mandatory requirements
2. Organize by category
3. Note deadlines for each item
4. Indicate what's needed before proposal submission

Return a JSON object with:
{
  "checklist": [
    {
      "category": "Registration",
      "items": [
        {
          "item": "Active SAM registration",
          "status": "Required before submission",
          "deadline": "Before 2025-02-15",
          "priority": "Critical"
        }
      ]
    }
  ],
  "totalItems": 25,
  "criticalItems": 12,
  "estimatedCompletionTime": "2 weeks"
}`,

  // Task 10: Complexity Scoring (1-10)
  10: `You are a solicitation complexity assessment expert.

Analyze this solicitation and assign a complexity score from 1-10.

Complexity Factors:
- 1-3: Simple (straightforward requirements, small scope, standard procurement)
- 4-6: Moderate (some complexity, multiple requirements, standard evaluation)
- 7-9: Complex (multiple phases, high technical requirements, complex evaluation)
- 10: Strategic (mission-critical, high competition, significant complexity, multiple option periods)

Consider:
1. Technical complexity of requirements
2. Number of evaluation factors
3. Contract value and risk
4. Compliance requirements
5. Timeline constraints
6. Past performance requirements
7. Security clearance needs
8. Number of deliverables

Return a JSON object with:
{
  "complexityScore": 7,
  "rationale": "High technical requirements, multiple evaluation factors, security clearances required, tight transition timeline",
  "complexityFactors": {
    "technicalComplexity": 8,
    "evaluationComplexity": 7,
    "complianceComplexity": 6,
    "timelineComplexity": 9,
    "overallRisk": "High"
  },
  "recommendedDepthLevel": "Complex" or "Standard" or "Strategic",
  "estimatedProposalEffort": "200-300 hours"
}`,

  // Task 11: Risk Flag Detection
  11: `You are a risk assessment expert for government proposals.

Identify all risk flags and warning signs in this solicitation.

Risk Categories:
1. Red Flags (high risk - may recommend no-bid)
2. Yellow Flags (caution - requires mitigation)
3. Green Flags (opportunities)

Your task:
1. Identify unrealistic timelines
2. Detect budget-requirement mismatches
3. Find incumbent advantage signals
4. Note unclear or ambiguous requirements
5. Identify mandatory requirements that may be difficult to meet
6. Detect potential protest risks

Return a JSON object with:
{
  "riskFlags": [
    {
      "type": "Red" or "Yellow" or "Green",
      "category": "Timeline" or "Budget" or "Requirements" or "Competition",
      "flag": "30-day transition period for complex system migration",
      "impact": "High",
      "mitigation": "Propose phased approach with incumbent support",
      "recommendNoGo": false
    }
  ],
  "redFlagCount": 2,
  "yellowFlagCount": 5,
  "greenFlagCount": 3,
  "overallRiskLevel": "High" or "Medium" or "Low",
  "bidRecommendation": "Bid with caution" or "Strong bid opportunity" or "Consider no-bid"
}`,
};

// ============================================================================
// PHASE 1 TRIAGE EXECUTOR
// ============================================================================

export class Phase1TriageExecutor {
  private projectId: string;
  private aiRouter = getAIRouter();

  constructor(projectId: string) {
    this.projectId = projectId;
  }

  /**
   * Execute all Phase 1 Triage tasks (1-11)
   */
  async executeAll(): Promise<void> {
    console.log(`[Phase 1 Triage] Starting execution for project ${this.projectId}`);

    // Get all Phase 1 tasks
    const tasks = await prisma.sDLTask.findMany({
      where: {
        projectId: this.projectId,
        taskPhase: 'PHASE1_TRIAGE',
        status: 'PENDING',
      },
      orderBy: { taskNumber: 'asc' },
    });

    console.log(`[Phase 1 Triage] Found ${tasks.length} pending tasks`);

    // Get RFP document
    const document = await this.getRFPDocument();

    // Execute tasks sequentially (some depend on previous results)
    for (const task of tasks) {
      try {
        await this.executeTask(task.id, task.taskNumber, task.taskName, document);
      } catch (error) {
        console.error(`[Phase 1 Triage] Task ${task.taskNumber} failed:`, error);

        // Mark task as failed
        await prisma.sDLTask.update({
          where: { id: task.id },
          data: {
            status: SDLTaskStatus.FAILED,
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
            completedAt: new Date(),
          },
        });
      }
    }

    // Check if all tasks completed
    const completedCount = await prisma.sDLTask.count({
      where: {
        projectId: this.projectId,
        taskPhase: 'PHASE1_TRIAGE',
        status: SDLTaskStatus.COMPLETED,
      },
    });

    console.log(`[Phase 1 Triage] Completed ${completedCount}/${tasks.length} tasks`);

    // Update project if all tasks complete
    if (completedCount === tasks.length) {
      await this.completePhase1();
    }
  }

  /**
   * Execute single task
   */
  async executeTask(
    taskId: string,
    taskNumber: number,
    taskName: string,
    document: { filePath: string; content: string }
  ): Promise<void> {
    console.log(`[Phase 1 Triage] Executing Task ${taskNumber}: ${taskName}`);

    // Update status to PROCESSING
    await prisma.sDLTask.update({
      where: { id: taskId },
      data: {
        status: SDLTaskStatus.PROCESSING,
        startedAt: new Date(),
      },
    });

    // Get prompt for this task
    const prompt = TASK_PROMPTS[taskNumber as keyof typeof TASK_PROMPTS];
    if (!prompt) {
      throw new Error(`No prompt defined for task ${taskNumber}`);
    }

    // Route to AI
    const result = await this.aiRouter.routeTask(
      taskNumber,
      taskName,
      prompt,
      document.content
    );

    // Parse result (expecting JSON)
    let parsedResult;
    try {
      parsedResult = typeof result.result === 'string'
        ? JSON.parse(result.result)
        : result.result;
    } catch (error) {
      parsedResult = result.result;
    }

    // Update task with result
    await prisma.sDLTask.update({
      where: { id: taskId },
      data: {
        status: SDLTaskStatus.COMPLETED,
        primaryResult: parsedResult,
        confidenceScore: parsedResult.confidence || 85,
        completedAt: new Date(),
      },
    });

    // Special handling for Task 10 (Complexity Score)
    if (taskNumber === 10 && parsedResult.complexityScore) {
      await prisma.project.update({
        where: { id: this.projectId },
        data: {
          sdlComplexityScore: parsedResult.complexityScore,
        },
      });
    }

    console.log(`[Phase 1 Triage] Task ${taskNumber} completed successfully`);
  }

  /**
   * Get RFP document for the project
   */
  private async getRFPDocument(): Promise<{ filePath: string; content: string }> {
    const document = await prisma.projectDocument.findFirst({
      where: {
        projectId: this.projectId,
        documentType: 'RFP_MAIN',
      },
    });

    if (!document) {
      throw new Error('No RFP document found for project');
    }

    // Read document content
    let content: string;
    try {
      const fileBuffer = await readFile(document.filePath);
      content = fileBuffer.toString('utf-8');
    } catch (error) {
      console.error('[Phase 1 Triage] Error reading document:', error);
      content = 'ERROR: Could not read document file';
    }

    return {
      filePath: document.filePath,
      content,
    };
  }

  /**
   * Complete Phase 1 and update project
   */
  private async completePhase1(): Promise<void> {
    await prisma.project.update({
      where: { id: this.projectId },
      data: {
        sdlStatus: 'PHASE1_TRIAGE',
        currentStage: 'HUMAN_VALIDATION',
      },
    });

    console.log(`[Phase 1 Triage] Phase 1 complete for project ${this.projectId}`);
    console.log(`[Phase 1 Triage] Project status updated to HUMAN_VALIDATION`);
    console.log(`[Phase 1 Triage] Awaiting human strategist to assign depth level and approve Phase 2`);
  }

  /**
   * Get Phase 1 summary
   */
  async getSummary() {
    const tasks = await prisma.sDLTask.findMany({
      where: {
        projectId: this.projectId,
        taskPhase: 'PHASE1_TRIAGE',
      },
      orderBy: { taskNumber: 'asc' },
    });

    const completed = tasks.filter((t) => t.status === SDLTaskStatus.COMPLETED).length;
    const failed = tasks.filter((t) => t.status === SDLTaskStatus.FAILED).length;

    // Extract key results
    const complexityTask = tasks.find((t) => t.taskNumber === 10);
    const riskTask = tasks.find((t) => t.taskNumber === 11);

    return {
      totalTasks: tasks.length,
      completed,
      failed,
      pending: tasks.length - completed - failed,
      complexityScore: (complexityTask?.primaryResult as any)?.complexityScore,
      riskLevel: (riskTask?.primaryResult as any)?.overallRiskLevel,
      readyForPhase2: completed === tasks.length,
    };
  }
}

/**
 * Create Phase 1 Triage Executor
 */
export function createPhase1TriageExecutor(projectId: string): Phase1TriageExecutor {
  return new Phase1TriageExecutor(projectId);
}
