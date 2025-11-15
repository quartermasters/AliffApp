/**
 * SDL Phase 2: Strategic Intelligence Execution
 *
 * Tasks 12-25: Human-Led, AI-Assisted
 * - Research tasks (12-16): Parallel execution
 * - Critical analysis (17-22): Multi-AI consensus required
 * - Pattern recognition (23-25): Strategic assessment
 *
 * Output: Diagnosis Brief with unstated requirements and real pain points
 */

import { prisma } from '@/lib/prisma';
import { getAIRouter } from '../ai-router';
import { getConsensusEngine } from '../consensus-engine';
import { SDLTaskStatus, AIProvider } from '@prisma/client';

// ============================================================================
// PHASE 2 TASK PROMPTS
// ============================================================================

const TASK_PROMPTS = {
  // ========== RESEARCH TASKS (12-16) - Parallel Execution ==========

  // Task 12: Incumbent Research
  12: `You are a government contracting research specialist.

Research the incumbent contractor for this solicitation.

Your task:
1. Identify the current/incumbent contractor (if mentioned or inferable)
2. Research their contract history with this agency
3. Find their past performance ratings (CPARS if available)
4. Identify any contract modifications or issues
5. Assess incumbent vulnerabilities

Return a JSON object with:
{
  "incumbentName": "ABC Corporation" or "Unknown",
  "currentContractValue": 1500000,
  "contractStartDate": "2023-03-01",
  "contractEndDate": "2025-02-28",
  "performanceRatings": {
    "overall": "Satisfactory" or "Very Good" or "Exceptional",
    "qualityOfService": "Satisfactory",
    "costControl": "Very Good",
    "timeliness": "Satisfactory"
  },
  "contractModifications": 3,
  "issuesIdentified": [
    "2 late deliverables in Q2 2024",
    "Cost overrun of 8% in Year 1"
  ],
  "incumbentVulnerabilities": [
    "Performance issues with timeliness",
    "Agency seeking better cost control"
  ],
  "incumbentStrengths": [
    "Established relationships",
    "Institutional knowledge"
  ],
  "confidence": 75
}`,

  // Task 13: Agency Spending Patterns
  13: `You are a government procurement analyst.

Analyze this agency's spending patterns and procurement preferences.

Your task:
1. Research recent contract awards by this agency
2. Identify typical contract values for similar services
3. Determine preferred contract types (FFP, T&M, CPFF)
4. Identify small business set-aside patterns
5. Note geographic preferences
6. Identify procurement trends

Return a JSON object with:
{
  "agencySpendingProfile": {
    "totalAnnualContracts": 150,
    "averageContractValue": 750000,
    "typicalRange": {
      "min": 250000,
      "max": 2000000
    }
  },
  "preferredContractTypes": [
    {"type": "FFP", "percentage": 65},
    {"type": "T&M", "percentage": 25},
    {"type": "CPFF", "percentage": 10}
  ],
  "smallBusinessPreference": {
    "totalSetAsides": "45%",
    "mostCommon": "Total Small Business",
    "veteranOwned": "25%"
  },
  "geographicPreferences": [
    "Local contractors preferred for on-site work",
    "No preference for remote services"
  ],
  "recentTrends": [
    "Increasing focus on cybersecurity",
    "Preference for Best Value over LPTA",
    "More multi-year contracts with options"
  ],
  "confidence": 80
}`,

  // Task 14: Contracting Officer Background
  14: `You are an intelligence analyst researching contracting officers.

Research the contracting officer for this solicitation.

Your task:
1. Identify the contracting officer name
2. Find their professional background
3. Research other contracts they've managed
4. Identify any public statements or preferences
5. Note procurement style (risk-averse vs innovation-friendly)

Return a JSON object with:
{
  "contractingOfficer": {
    "name": "Jane Smith",
    "title": "Contracting Officer",
    "agency": "VA Medical Center - Seattle",
    "yearsOfExperience": 12
  },
  "otherContracts": [
    {
      "solicitation": "VA-250-24-R-0045",
      "type": "IT Services",
      "value": 1200000,
      "outcome": "Awarded to XYZ Corp"
    }
  ],
  "procurementStyle": "Process-driven, prefers detailed proposals",
  "knownPreferences": [
    "Strong emphasis on past performance",
    "Values compliance over innovation",
    "Prefers established contractors"
  ],
  "publicStatements": [
    "Quoted in VA newsletter: 'Quality and reliability are paramount'"
  ],
  "confidence": 60
}`,

  // Task 15: Recent Similar Awards
  15: `You are a procurement intelligence specialist.

Research recent similar contract awards and outcomes.

Your task:
1. Find similar solicitations in past 2 years
2. Identify who won and at what price
3. Analyze evaluation criteria used
4. Note any protests filed and outcomes
5. Identify winning strategies

Return a JSON object with:
{
  "similarAwards": [
    {
      "solicitation": "VA-250-23-R-0089",
      "title": "Healthcare IT Support Services",
      "value": 1800000,
      "winner": "MedTech Solutions",
      "awardDate": "2023-06-15",
      "evaluationMethod": "Best Value",
      "protestFiled": false
    }
  ],
  "pricingTrends": {
    "averagePrice": 1650000,
    "priceRange": {
      "lowest": 1200000,
      "highest": 2100000
    },
    "averagePricePerHour": 125
  },
  "evaluationTrends": [
    "Technical approach weighted 50-60%",
    "Past performance critical (20-30%)",
    "Price typically 20-30%"
  ],
  "protestActivity": {
    "totalProtests": 2,
    "successfulProtests": 0,
    "commonIssues": ["Evaluation methodology questions"]
  },
  "winningStrategies": [
    "Strong past performance with VA",
    "Detailed technical approach",
    "Competitive pricing (not lowest)"
  ],
  "confidence": 85
}`,

  // Task 16: Competitor Analysis
  16: `You are a competitive intelligence analyst.

Analyze likely competitors for this solicitation.

Your task:
1. Identify likely competitors (incumbents + usual suspects)
2. Analyze their recent wins with this agency
3. Assess their typical approaches
4. Identify their strengths and weaknesses
5. Note teaming partnerships
6. Determine competitive positioning

Return a JSON object with:
{
  "likelyCompetitors": [
    {
      "name": "ABC Corporation (Incumbent)",
      "marketPosition": "Established leader",
      "recentWins": 3,
      "strengths": [
        "Institutional knowledge",
        "Existing relationships",
        "Proven performance"
      ],
      "weaknesses": [
        "Higher pricing",
        "Performance issues noted",
        "Limited innovation"
      ],
      "winProbability": 45
    },
    {
      "name": "TechCorp Solutions",
      "marketPosition": "Aggressive challenger",
      "recentWins": 2,
      "strengths": [
        "Competitive pricing",
        "Modern technology stack",
        "Strong technical team"
      ],
      "weaknesses": [
        "Limited VA experience",
        "No incumbent advantage"
      ],
      "winProbability": 30
    }
  ],
  "teamingActivity": [
    "ABC Corp may team with small business for set-aside",
    "TechCorp known to partner with veteran-owned firms"
  ],
  "competitiveLandscape": "Moderately competitive - 4-6 bidders expected",
  "marketDynamics": [
    "Incumbent vulnerable due to performance issues",
    "Price-conscious environment",
    "Innovation valued but not required"
  ],
  "confidence": 70
}`,

  // ========== CRITICAL ANALYSIS (17-22) - Multi-AI Required ==========

  // Task 17: Why Re-competed NOW?
  17: `You are a strategic analyst for government procurement.

Analyze WHY this contract is being re-competed at this specific time.

This is CRITICAL strategic intelligence. Consider:
1. Is the incumbent's contract ending naturally?
2. Are there performance issues forcing change?
3. Has agency leadership changed?
4. Are there budget pressures or policy changes?
5. Is the agency seeking innovation or just continuity?

Your task: Identify the REAL reason for this re-competition.

Return a JSON object with:
{
  "primaryReason": "Incumbent performance issues" or "Natural contract expiration" or "Budget pressures" or "Policy change" or "Leadership change",
  "supportingEvidence": [
    "Contract ends 2025-02-28",
    "CPARS ratings show declining performance",
    "New VA policy emphasizes cost control"
  ],
  "timingSignificance": "End of fiscal year - budget availability",
  "agencyMotivation": "Seeking better performance at lower cost",
  "strategicImplication": "Agency open to new contractors, not loyal to incumbent",
  "competitiveAdvantage": "Emphasize performance improvement and cost savings",
  "confidence": 85
}`,

  // Task 18: Unstated Requirement Detection (CORE COMPETITIVE ADVANTAGE)
  18: `You are an expert at identifying UNSTATED requirements in government solicitations.

This is THE most critical task. Find requirements that "should be there but aren't explicitly stated."

Real example: US Embassy language instructors solicitation
- Stated: "Provide qualified instructors"
- Unstated: "Security clearance takes 7-8 months, agency can't afford gap"
- Real need: "Keep existing instructors to avoid operational disruption"

Your task: Identify what the agency REALLY needs but didn't write.

Consider:
1. Operational constraints not mentioned (security clearances, facility access)
2. Timeline pressures that force specific approaches
3. Incumbent knowledge requirements
4. Relationship or political considerations
5. Budget realities vs stated requirements

Return a JSON object with:
{
  "unstatedRequirements": [
    {
      "requirement": "Maintain operational continuity during transition",
      "evidence": "30-day transition period + complex system migration",
      "rationale": "Agency cannot afford service disruption",
      "strategicResponse": "Propose incumbent staff retention and phased transition",
      "criticality": "High",
      "confidence": 80
    }
  ],
  "hiddenConstraints": [
    "Security clearance timeline forces incumbent preference",
    "Existing system knowledge required for smooth transition"
  ],
  "realNeed": "Continuity of service with minimal disruption, not necessarily new contractor",
  "proposalImplication": "Emphasize transition plan, staff retention, knowledge transfer",
  "confidence": 75
}`,

  // Task 19: Real Pain Point Identification
  19: `You are a strategic consultant identifying agency pain points.

The solicitation describes symptoms. You must diagnose the DISEASE.

Example:
- Symptom: "Provide 24/7 helpdesk support"
- Pain point: "Current contractor has poor response times causing user frustration"

Your task: Identify what's actually bothering the agency.

Consider:
1. What problems is the current contractor causing?
2. What frustrations do agency staff face?
3. What operational challenges need solving?
4. What are they avoiding saying directly?

Return a JSON object with:
{
  "painPoints": [
    {
      "painPoint": "User frustration with slow helpdesk response times",
      "statedRequirement": "24/7 helpdesk support with 2-hour response SLA",
      "rootCause": "Current contractor understaffed during peak hours",
      "impact": "Mission disruption, user complaints to leadership",
      "solution": "Propose 24/7 staffing with dedicated peak-hour coverage",
      "scoringOpportunity": "Section M: Quality of Service (30 points)",
      "confidence": 80
    }
  ],
  "agencyFrustrations": [
    "Poor communication from incumbent",
    "Cost overruns without value",
    "Slow response to urgent issues"
  ],
  "operationalChallenges": [
    "Aging infrastructure requiring specialized expertise",
    "Budget constraints requiring efficiency"
  ],
  "proposalStrategy": "Position as solution to pain points, not just requirements",
  "confidence": 75
}`,

  // Task 20: Budget Reality Assessment
  20: `You are a financial analyst assessing budget realism.

Analyze whether the stated budget is realistic for the requirements.

Consider:
1. Market rates for required services
2. Scope of work vs budget
3. Historical contract values
4. Required certifications and qualifications

Your task: Determine budget reality and implications.

Return a JSON object with:
{
  "estimatedBudget": 1500000,
  "marketRate": {
    "minimum": 1200000,
    "realistic": 1500000,
    "maximum": 1800000
  },
  "budgetAssessment": "Realistic" or "Underestimated" or "Overestimated",
  "budgetPressure": "Medium - Tight but achievable",
  "implications": [
    "Limited room for expensive solutions",
    "Focus on efficiency and cost control",
    "Competitive pricing required"
  ],
  "pricingStrategy": "Competitive but not LPTA - focus on value",
  "riskFactors": [
    "Scope creep could strain budget",
    "Premium labor rates may not be sustainable"
  ],
  "confidence": 80
}`,

  // Task 21: Timeline Constraint Analysis
  21: `You are an operations analyst assessing timeline feasibility.

Analyze timeline constraints and operational realities.

Consider:
1. Is the timeline realistic for deliverables?
2. Are there hidden time constraints (clearances, approvals)?
3. Does timeline force certain approaches?
4. What operational constraints exist?

Your task: Identify timeline-driven strategic implications.

Return a JSON object with:
{
  "proposalDueDate": "2025-02-15",
  "contractStart": "2025-03-01",
  "transitionPeriod": {
    "duration": "30 days",
    "feasibility": "Challenging",
    "constraints": [
      "Security clearance processing: 6-8 months",
      "System knowledge transfer: 3-4 weeks minimum",
      "Incumbent may not cooperate"
    ]
  },
  "timelineReality": "Aggressive - Favors incumbent or contractors with cleared staff",
  "strategicImplication": "Timeline forces incumbent advantage or requires hiring incumbent staff",
  "proposalApproach": "Emphasize pre-cleared staff or incumbent retention strategy",
  "operationalConstraints": [
    "Cannot afford service gap",
    "Critical system requires continuous operation",
    "Minimal time for training"
  ],
  "confidence": 85
}`,

  // Task 22: Agency Culture Assessment
  22: `You are an organizational analyst assessing agency culture.

Analyze the agency's culture and procurement style.

Consider:
1. Risk-averse vs innovation-friendly
2. Relationship-driven vs process-driven
3. Quality-focused vs price-focused
4. Fast decision vs slow/deliberate
5. Tolerance for new contractors

Your task: Profile the agency's culture to guide proposal tone.

Return a JSON object with:
{
  "agencyCulture": {
    "riskTolerance": "Risk-averse - Prefers proven solutions",
    "decisionStyle": "Deliberate - Values thorough evaluation",
    "priorityFocus": "Quality over price - Best Value preferred",
    "relationshipImportance": "High - Past performance heavily weighted",
    "innovationAppetite": "Low - Prefers established approaches"
  },
  "proposalTone": "Professional, detailed, conservative approach",
  "strategicGuidance": [
    "Emphasize proven track record",
    "Detailed technical approach over innovation",
    "Strong past performance examples critical",
    "Conservative risk mitigation strategies"
  ],
  "languagePreferences": [
    "Use agency terminology",
    "Avoid marketing language",
    "Focus on specifics and evidence"
  ],
  "confidence": 70
}`,

  // ========== PATTERN RECOGNITION (23-25) ==========

  // Task 23: Pattern Matching
  23: `You are a pattern recognition specialist.

Match this solicitation against known successful patterns.

Your task:
1. Identify patterns from historical wins
2. Match characteristics to pattern library
3. Recommend proven approaches

Return a JSON object with:
{
  "matchedPatterns": [
    {
      "pattern": "Incumbent Vulnerability - Performance Issues",
      "match": 85,
      "characteristics": [
        "Declining CPARS ratings",
        "Agency seeking change",
        "Competitive pricing expected"
      ],
      "recommendedStrategy": "Position as performance improvement alternative"
    }
  ],
  "historicalPrecedents": [
    "Similar VA contract in 2023 - New contractor won on quality promise"
  ],
  "confidence": 75
}`,

  // Task 24: Red Flag Identification
  24: `You are a risk assessment expert identifying warning signs.

Identify RED FLAGS that suggest high risk or potential no-bid.

Your task: Find deal-breakers and serious risks.

Return a JSON object with:
{
  "redFlags": [
    {
      "flag": "Wired for incumbent - Unrealistic timeline favors incumbent",
      "severity": "High",
      "evidence": "30-day transition + complex system + clearance requirements",
      "mitigation": "Hire incumbent staff or partner with incumbent",
      "recommendNoGo": false
    }
  ],
  "dealBreakers": [],
  "overallRisk": "Medium-High",
  "bidRecommendation": "Bid with caution - Mitigation required",
  "confidence": 80
}`,

  // Task 25: Green Flag Identification
  25: `You are an opportunity analyst identifying competitive advantages.

Identify GREEN FLAGS that suggest good win opportunity.

Your task: Find advantages and opportunities.

Return a JSON object with:
{
  "greenFlags": [
    {
      "flag": "Incumbent vulnerable - Performance issues documented",
      "opportunity": "Position as quality alternative",
      "evidence": "CPARS ratings declining, agency frustrated",
      "scoringAdvantage": "Past performance and quality factors"
    }
  ],
  "competitiveAdvantages": [
    "Client has strong VA past performance",
    "Modern technology stack vs incumbent legacy",
    "Competitive pricing model"
  ],
  "winOpportunities": "High - Agency open to change",
  "confidence": 80
}`,
};

// ============================================================================
// MULTI-AI CONSENSUS TASKS (17-21)
// ============================================================================

const MULTI_AI_TASKS = [17, 18, 19, 20, 21];

// ============================================================================
// PHASE 2 STRATEGIC INTELLIGENCE EXECUTOR
// ============================================================================

export class Phase2StrategicIntelExecutor {
  private projectId: string;
  private aiRouter = getAIRouter();
  private consensusEngine = getConsensusEngine();

  constructor(projectId: string) {
    this.projectId = projectId;
  }

  /**
   * Execute all Phase 2 Strategic Intelligence tasks (12-25)
   */
  async executeAll(): Promise<void> {
    console.log(`[Phase 2 Strategic Intel] Starting execution for project ${this.projectId}`);

    // Get all Phase 2 tasks
    const tasks = await prisma.sDLTask.findMany({
      where: {
        projectId: this.projectId,
        taskPhase: 'PHASE2_STRATEGIC_INTEL',
        status: 'PENDING',
      },
      orderBy: { taskNumber: 'asc' },
    });

    console.log(`[Phase 2 Strategic Intel] Found ${tasks.length} pending tasks`);

    // Get RFP document
    const document = await this.getRFPDocument();

    // Get Phase 1 results for context
    const phase1Results = await this.getPhase1Results();

    // Execute research tasks (12-16) in parallel
    const researchTasks = tasks.filter((t) => t.taskNumber >= 12 && t.taskNumber <= 16);
    if (researchTasks.length > 0) {
      console.log(`[Phase 2 Strategic Intel] Executing ${researchTasks.length} research tasks in parallel`);
      await Promise.all(
        researchTasks.map((task) =>
          this.executeTask(task.id, task.taskNumber, task.taskName, document, phase1Results)
        )
      );
    }

    // Execute critical analysis tasks (17-22) with multi-AI consensus
    const criticalTasks = tasks.filter((t) => t.taskNumber >= 17 && t.taskNumber <= 22);
    for (const task of criticalTasks) {
      try {
        if (MULTI_AI_TASKS.includes(task.taskNumber)) {
          await this.executeMultiAITask(task.id, task.taskNumber, task.taskName, document, phase1Results);
        } else {
          await this.executeTask(task.id, task.taskNumber, task.taskName, document, phase1Results);
        }
      } catch (error) {
        console.error(`[Phase 2 Strategic Intel] Task ${task.taskNumber} failed:`, error);
        await this.markTaskFailed(task.id, error);
      }
    }

    // Execute pattern recognition tasks (23-25)
    const patternTasks = tasks.filter((t) => t.taskNumber >= 23 && t.taskNumber <= 25);
    for (const task of patternTasks) {
      try {
        await this.executeTask(task.id, task.taskNumber, task.taskName, document, phase1Results);
      } catch (error) {
        console.error(`[Phase 2 Strategic Intel] Task ${task.taskNumber} failed:`, error);
        await this.markTaskFailed(task.id, error);
      }
    }

    // Check if all tasks completed
    await this.checkPhaseCompletion();
  }

  /**
   * Execute single-AI task
   */
  private async executeTask(
    taskId: string,
    taskNumber: number,
    taskName: string,
    document: { content: string },
    phase1Results: any
  ): Promise<void> {
    console.log(`[Phase 2 Strategic Intel] Executing Task ${taskNumber}: ${taskName}`);

    await prisma.sDLTask.update({
      where: { id: taskId },
      data: {
        status: SDLTaskStatus.PROCESSING,
        startedAt: new Date(),
      },
    });

    const prompt = this.buildPrompt(taskNumber, phase1Results);
    const result = await this.aiRouter.routeTask(taskNumber, taskName, prompt, document.content);

    let parsedResult;
    try {
      parsedResult = typeof result.result === 'string' ? JSON.parse(result.result) : result.result;
    } catch (error) {
      parsedResult = result.result;
    }

    await prisma.sDLTask.update({
      where: { id: taskId },
      data: {
        status: SDLTaskStatus.COMPLETED,
        primaryResult: parsedResult,
        confidenceScore: parsedResult.confidence || 75,
        completedAt: new Date(),
      },
    });

    console.log(`[Phase 2 Strategic Intel] Task ${taskNumber} completed`);
  }

  /**
   * Execute multi-AI task with consensus
   */
  private async executeMultiAITask(
    taskId: string,
    taskNumber: number,
    taskName: string,
    document: { content: string },
    phase1Results: any
  ): Promise<void> {
    console.log(`[Phase 2 Strategic Intel] Executing Multi-AI Task ${taskNumber}: ${taskName}`);

    await prisma.sDLTask.update({
      where: { id: taskId },
      data: {
        status: SDLTaskStatus.PROCESSING,
        startedAt: new Date(),
      },
    });

    const prompt = this.buildPrompt(taskNumber, phase1Results);

    // Execute with multiple AIs
    const aiProviders = [AIProvider.OPENAI, AIProvider.CLAUDE];
    if (taskNumber === 20) {
      aiProviders.push(AIProvider.GEMINI); // Budget assessment uses 3 AIs
    }

    const results = await this.aiRouter.executeMultiAI(
      taskNumber,
      taskName,
      prompt,
      document.content,
      aiProviders
    );

    // Analyze consensus
    const consensus = await this.consensusEngine.analyzeConsensus(
      taskId,
      this.projectId,
      taskName,
      results
    );

    // Update task
    const status = consensus.escalateToHuman
      ? SDLTaskStatus.ESCALATED_TO_HUMAN
      : SDLTaskStatus.COMPLETED;

    await prisma.sDLTask.update({
      where: { id: taskId },
      data: {
        status,
        primaryResult: results[0]?.result,
        secondaryResult: results[1]?.result,
        consensusResult: consensus.finalResult,
        confidenceScore: consensus.consensusConfidence,
        completedAt: new Date(),
      },
    });

    console.log(
      `[Phase 2 Strategic Intel] Multi-AI Task ${taskNumber} completed: ${consensus.consensusType}`
    );
  }

  /**
   * Build prompt with Phase 1 context
   */
  private buildPrompt(taskNumber: number, phase1Results: any): string {
    const basePrompt = TASK_PROMPTS[taskNumber as keyof typeof TASK_PROMPTS];

    const context = `
CONTEXT FROM PHASE 1 TRIAGE:
- Complexity Score: ${phase1Results.complexityScore || 'Unknown'}/10
- Risk Level: ${phase1Results.riskLevel || 'Unknown'}
- Contract Type: ${phase1Results.contractType || 'Unknown'}
- Estimated Value: $${phase1Results.estimatedValue || 'Unknown'}
- Agency: ${phase1Results.agencyName || 'Unknown'}

${basePrompt}
`;

    return context;
  }

  /**
   * Get RFP document
   */
  private async getRFPDocument(): Promise<{ content: string }> {
    const document = await prisma.projectDocument.findFirst({
      where: {
        projectId: this.projectId,
        documentType: 'RFP_MAIN',
      },
    });

    if (!document) {
      throw new Error('No RFP document found');
    }

    // In production, read actual file
    return { content: 'RFP document content would be here' };
  }

  /**
   * Get Phase 1 results for context
   */
  private async getPhase1Results(): Promise<any> {
    const phase1Tasks = await prisma.sDLTask.findMany({
      where: {
        projectId: this.projectId,
        taskPhase: 'PHASE1_TRIAGE',
      },
    });

    return {
      complexityScore: phase1Tasks.find((t) => t.taskNumber === 10)?.primaryResult?.complexityScore,
      riskLevel: phase1Tasks.find((t) => t.taskNumber === 11)?.primaryResult?.overallRiskLevel,
      contractType: phase1Tasks.find((t) => t.taskNumber === 2)?.primaryResult?.contractType,
      estimatedValue: phase1Tasks.find((t) => t.taskNumber === 2)?.primaryResult?.estimatedValue,
      agencyName: phase1Tasks.find((t) => t.taskNumber === 2)?.primaryResult?.agencyName,
    };
  }

  /**
   * Mark task as failed
   */
  private async markTaskFailed(taskId: string, error: any): Promise<void> {
    await prisma.sDLTask.update({
      where: { id: taskId },
      data: {
        status: SDLTaskStatus.FAILED,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        completedAt: new Date(),
      },
    });
  }

  /**
   * Check phase completion
   */
  private async checkPhaseCompletion(): Promise<void> {
    const tasks = await prisma.sDLTask.findMany({
      where: {
        projectId: this.projectId,
        taskPhase: 'PHASE2_STRATEGIC_INTEL',
      },
    });

    const completed = tasks.filter(
      (t) => t.status === SDLTaskStatus.COMPLETED || t.status === SDLTaskStatus.ESCALATED_TO_HUMAN
    ).length;

    if (completed === tasks.length) {
      await prisma.project.update({
        where: { id: this.projectId },
        data: {
          sdlStatus: 'PHASE2_STRATEGIC_INTEL',
          currentStage: 'HUMAN_VALIDATION',
        },
      });

      console.log(`[Phase 2 Strategic Intel] Phase 2 complete for project ${this.projectId}`);
      console.log(`[Phase 2 Strategic Intel] Awaiting human validation of critical insights`);
    }
  }

  /**
   * Get Phase 2 summary
   */
  async getSummary() {
    const tasks = await prisma.sDLTask.findMany({
      where: {
        projectId: this.projectId,
        taskPhase: 'PHASE2_STRATEGIC_INTEL',
      },
      orderBy: { taskNumber: 'asc' },
    });

    const completed = tasks.filter((t) => t.status === SDLTaskStatus.COMPLETED).length;
    const escalated = tasks.filter((t) => t.status === SDLTaskStatus.ESCALATED_TO_HUMAN).length;
    const failed = tasks.filter((t) => t.status === SDLTaskStatus.FAILED).length;

    return {
      totalTasks: tasks.length,
      completed,
      escalated,
      failed,
      pending: tasks.length - completed - escalated - failed,
      readyForPhase3: completed + escalated === tasks.length,
      requiresHumanReview: escalated > 0,
    };
  }
}

/**
 * Create Phase 2 Strategic Intel Executor
 */
export function createPhase2StrategicIntelExecutor(projectId: string): Phase2StrategicIntelExecutor {
  return new Phase2StrategicIntelExecutor(projectId);
}
