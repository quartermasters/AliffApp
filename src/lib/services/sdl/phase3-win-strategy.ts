/**
 * SDL Phase 3: Win Strategy Execution (Tasks 26-34)
 *
 * Final phase focused on win strategy development:
 * - Win probability assessment (Multi-AI)
 * - Win theme generation (Multi-AI)
 * - Differentiator identification (Multi-AI)
 * - No-bid recommendation (Multi-AI)
 * - Solution approach recommendations
 * - Risk mitigation strategies
 * - Teaming recommendations
 * - Pricing strategy guidance
 * - Capture plan outline
 *
 * This phase synthesizes all insights from Phases 1 & 2 to create
 * actionable win strategy recommendations.
 */

import { prisma } from '@/lib/prisma';
import { AIProvider, SDLTaskPhase, SDLTaskStatus } from '@prisma/client';
import { getAIRouter } from '../ai-router';
import { getConsensusEngine } from '../consensus-engine';

// ============================================================================
// MULTI-AI CONSENSUS TASKS
// ============================================================================

const MULTI_AI_TASKS = [26, 27, 28, 29]; // Win prob, Win themes, Differentiators, No-bid

// ============================================================================
// PHASE 3 AI PROMPTS
// ============================================================================

const TASK_PROMPTS: Record<number, string> = {
  // TASK 26: Win Probability Assessment (CRITICAL - Multi-AI)
  26: `You are an expert at assessing win probability for government contracts.

Based on all available Phase 1 and Phase 2 analysis, assess the realistic win probability.

Consider:
- Complexity score and risk flags (Phase 1)
- Incumbent position and performance
- Unstated requirements and pain points (Task 18-19)
- Budget reality and timeline constraints (Task 20-21)
- Agency culture and preferences
- Competitive landscape
- Your company's capabilities and past performance
- Red flags vs green flags

Be BRUTALLY HONEST. A 10% win probability is better than wasting resources on a lost cause.

Return a JSON object:
{
  "winProbability": 45, // 0-100% realistic assessment
  "confidenceLevel": "high", // high/medium/low
  "rationale": "Detailed explanation...",
  "keyFactors": {
    "strengths": ["Factor 1", "Factor 2"],
    "weaknesses": ["Factor 1", "Factor 2"],
    "opportunities": ["Opp 1", "Opp 2"],
    "threats": ["Threat 1", "Threat 2"]
  },
  "criticalAssumptions": ["Assumption 1", "Assumption 2"],
  "recommendation": "BID" | "CAUTION" | "NO_BID"
}`,

  // TASK 27: Win Theme Generation (CRITICAL - Multi-AI)
  27: `You are an expert at crafting compelling win themes for government proposals.

Win themes are the 2-5 strategic narratives that will run through your entire proposal.
They must directly address the agency's unstated needs and pain points.

Based on Phase 1 & 2 analysis, generate 2-5 powerful win themes.

Each win theme MUST:
1. Address a real pain point (from Task 19)
2. Connect to unstated requirements (from Task 18)
3. Be provable with past performance
4. Differentiate from competitors
5. Be memorable and repeatable

Real example:
- Stated: "Provide language instruction"
- Unstated: "Can't afford operational gap during security clearance processing"
- Win Theme: "Zero-Day Readiness: Cleared instructors ready to teach from Day 1"

Return a JSON object:
{
  "primaryWinTheme": {
    "theme": "One-sentence memorable statement",
    "addressesPainPoint": "Which pain point from Task 19",
    "addressesUnstated": "Which unstated requirement from Task 18",
    "proofPoints": ["Evidence 1", "Evidence 2"],
    "ghostsCompetitors": "How this makes competitors irrelevant"
  },
  "secondaryWinThemes": [
    {
      "theme": "...",
      "addressesPainPoint": "...",
      "addressesUnstated": "...",
      "proofPoints": ["..."],
      "ghostsCompetitors": "..."
    }
  ],
  "messagingGuidance": "How to weave these themes throughout the proposal"
}`,

  // TASK 28: Differentiator Identification (CRITICAL - Multi-AI)
  28: `You are an expert at identifying competitive differentiators for government proposals.

Differentiators are unique capabilities, approaches, or advantages that competitors cannot easily replicate.

Based on Phase 1 & 2 analysis, identify 3-7 strong differentiators.

Types of differentiators:
1. CAPABILITY: Unique technical capability or certification
2. EXPERIENCE: Specific relevant past performance competitors lack
3. APPROACH: Innovative solution approach
4. RELATIONSHIP: Established relationships or site presence
5. DISCRIMINATOR: Directly mentioned in evaluation criteria
6. SPEED: Faster transition or implementation
7. COST: More cost-effective without sacrificing quality

Each differentiator MUST be:
- PROVABLE (with evidence)
- RELEVANT (to stated or unstated requirements)
- DIFFICULT TO REPLICATE (competitive barrier)

Return a JSON object:
{
  "differentiators": [
    {
      "type": "CAPABILITY" | "EXPERIENCE" | "APPROACH" | "RELATIONSHIP" | "DISCRIMINATOR" | "SPEED" | "COST",
      "differentiator": "Clear one-sentence statement",
      "proofPoints": ["Evidence 1", "Evidence 2"],
      "relevanceToRequirements": "How this addresses stated/unstated needs",
      "competitiveBarrier": "Why competitors can't easily match this",
      "evaluationCriteriaMapping": "Which evaluation criteria this addresses"
    }
  ],
  "ghostingStrategy": "How to present these differentiators to make competitors look weak without naming them"
}`,

  // TASK 29: No-Bid Recommendation (CRITICAL - Multi-AI)
  29: `You are a strategic advisor making NO-BID recommendations for government contracts.

Your job is to protect the company from wasting resources on unwinnable bids.

Based on all Phase 1 & 2 analysis, make a recommendation: BID, CAUTION, or NO-BID.

NO-BID triggers:
- Win probability < 15%
- Incumbent has no performance issues and contract is merely being re-competed for compliance
- Requirements specifically tailored to another company
- Budget reality makes profit impossible
- Past performance gaps are disqualifying
- Timeline constraints make compliant response impossible
- Multiple critical unstated requirements cannot be met
- Evaluation criteria heavily favor competitor strengths

CAUTION triggers:
- Win probability 15-30%
- Significant investment required with uncertain return
- Would need to team with competitor
- Requires capabilities currently lacking

BID triggers:
- Win probability > 30%
- Strategic relationship or market entry value
- Strong alignment with unstated requirements
- Competitive advantages exist

Be BRUTALLY HONEST. Recommend NO-BID if appropriate.

Return a JSON object:
{
  "recommendation": "BID" | "CAUTION" | "NO_BID",
  "winProbability": 25, // from Task 26
  "rationale": "Detailed justification...",
  "dealBreakers": ["Critical issue 1", "Critical issue 2"],
  "mitigatingFactors": ["Factor that could change the calculus"],
  "costToPropose": "Estimated cost/effort",
  "expectedValue": "Win probability × contract value - cost to propose",
  "strategicValue": "Non-financial reasons to bid (market entry, relationship building, etc.)",
  "conditions": "If BID or CAUTION, what conditions must be met to proceed?"
}`,

  // TASK 30: Solution Approach Recommendations
  30: `You are a solution architect for government proposals.

Based on all requirements, constraints, and insights from Phases 1 & 2, recommend the optimal solution approach.

Your solution approach should:
1. Satisfy all stated requirements (from Task 5)
2. Address all unstated requirements (from Task 18)
3. Solve real pain points (from Task 19)
4. Work within budget constraints (from Task 20)
5. Work within timeline constraints (from Task 21)
6. Align with agency culture (from Task 22)
7. Leverage your differentiators (from Task 28)

Return a JSON object:
{
  "overallApproach": "High-level solution strategy",
  "technicalApproach": {
    "approach": "Technical solution overview",
    "keyComponents": ["Component 1", "Component 2"],
    "innovativeElements": ["Innovation 1", "Innovation 2"],
    "riskMitigation": ["How you'll reduce technical risk"]
  },
  "managementApproach": {
    "approach": "Management and oversight strategy",
    "organizationalStructure": "How you'll organize the team",
    "qualityControl": "How you'll ensure quality",
    "communicationPlan": "How you'll keep agency informed"
  },
  "transitionPlan": {
    "approach": "How you'll transition from incumbent (if applicable)",
    "timeline": "Transition timeline",
    "knowledgeTransfer": "How you'll capture institutional knowledge",
    "riskMitigation": "How you'll avoid service disruption"
  },
  "alignmentWithUnstatedNeeds": "How this approach addresses unstated requirements",
  "proofPoints": ["Past performance examples that prove this approach works"]
}`,

  // TASK 31: Risk Mitigation Strategies
  31: `You are a risk management expert for government proposals.

Based on risk flags from Phase 1 (Task 11) and analysis from Phase 2, develop comprehensive risk mitigation strategies.

For each significant risk:
1. Clearly state the risk
2. Assess probability (high/medium/low) and impact (high/medium/low)
3. Provide specific mitigation strategy
4. Identify early warning indicators
5. Define contingency plan

Risk categories:
- TECHNICAL: Solution complexity, technology maturity, integration challenges
- SCHEDULE: Timeline constraints, dependencies, critical path risks
- COST: Budget constraints, cost overrun risk, funding availability
- PERSONNEL: Hiring challenges, clearance timelines, key person dependencies
- COMPLIANCE: Regulatory requirements, certification needs, audit risk
- TRANSITION: Incumbent knowledge transfer, service continuity
- EXTERNAL: Agency reorganization, policy changes, budget cuts

Return a JSON object:
{
  "risks": [
    {
      "category": "TECHNICAL" | "SCHEDULE" | "COST" | "PERSONNEL" | "COMPLIANCE" | "TRANSITION" | "EXTERNAL",
      "risk": "Clear risk statement",
      "probability": "high" | "medium" | "low",
      "impact": "high" | "medium" | "low",
      "mitigationStrategy": "Specific actions to reduce probability or impact",
      "earlyWarningIndicators": ["Indicator 1", "Indicator 2"],
      "contingencyPlan": "What you'll do if the risk materializes",
      "proofOfMitigation": "Past performance example of successfully mitigating this risk"
    }
  ],
  "overallRiskPosture": "AGGRESSIVE" | "BALANCED" | "CONSERVATIVE",
  "residualRiskAssessment": "Remaining risk after mitigation"
}`,

  // TASK 32: Teaming Recommendations
  32: `You are a teaming strategy expert for government proposals.

Based on requirements, gaps in capabilities, and competitive analysis, recommend teaming partners.

Consider:
1. Gaps in your capabilities (from gap analysis)
2. Small business requirements (SBA goals, set-asides)
3. Geographic requirements (local presence, site access)
4. Socioeconomic requirements (SDVOSB, HUBZone, 8(a), WOSB)
5. Technical capability requirements
6. Past performance requirements
7. Security clearance requirements
8. Evaluation criteria preferences

Teaming structures:
- PRIME: You as prime, subcontractors fill gaps
- SUB: You as subcontractor to stronger prime
- JV: Joint venture for risk/reward sharing
- MENTOR_PROTEGE: Leverage SBA Mentor-Protégé program
- TEAMING_AGREEMENT: Non-binding exploration

Return a JSON object:
{
  "teamingRecommendation": "PRIME" | "SUB" | "JV" | "MENTOR_PROTEGE" | "SOLO",
  "rationale": "Why this teaming structure",
  "capabilityGaps": [
    {
      "gap": "Specific capability you're missing",
      "criticality": "CRITICAL" | "IMPORTANT" | "NICE_TO_HAVE",
      "possiblePartners": ["Company 1", "Company 2"],
      "partnerCriteria": "What to look for in a partner for this gap"
    }
  ],
  "smallBusinessStrategy": {
    "setAsideType": "Type of set-aside if applicable",
    "sbGoals": "Required small business percentages",
    "socioeconomicTargets": ["SDVOSB: 10%", "HUBZone: 5%"],
    "recommendedSBPartners": ["SB Company 1", "SB Company 2"]
  },
  "teamingTimeline": "When to reach out, when to finalize agreements",
  "redFlags": ["Companies to avoid and why"]
}`,

  // TASK 33: Pricing Strategy Guidance
  33: `You are a pricing strategist for government proposals.

Based on budget reality (Task 20), competitive analysis, and win strategy, recommend pricing approach.

Consider:
1. Budget reality (from Task 20) - what agency can ACTUALLY afford
2. Incumbent baseline (what they're paying now)
3. IGCE (Independent Government Cost Estimate) if available
4. Competitive pricing intelligence
5. Your cost structure and required margin
6. Price evaluation criteria and weighting
7. LPTA vs Best Value trade-offs

Pricing strategies:
- COMPETITIVE: Price to win in LPTA
- VALUE: Premium price justified by superior value
- PENETRATION: Below-cost to enter market (loss leader)
- BASELINE: Match incumbent pricing
- PREMIUM: Higher price for differentiated solution

Return a JSON object:
{
  "pricingStrategy": "COMPETITIVE" | "VALUE" | "PENETRATION" | "BASELINE" | "PREMIUM",
  "rationale": "Why this strategy",
  "budgetConstraints": {
    "agencyBudget": "What agency has available (from Task 20)",
    "incumbentBaseline": "Current contract value",
    "igceEstimate": "If available",
    "competitivePriceRange": "Expected range from competitors"
  },
  "targetPrice": {
    "minPrice": "Minimum viable price (covers costs)",
    "targetPrice": "Optimal price for win strategy",
    "maxPrice": "Maximum defensible price",
    "confidence": "Confidence in target price"
  },
  "priceToWinAnalysis": {
    "lptaConsiderations": "If LPTA, what's the price to beat?",
    "bestValueConsiderations": "If Best Value, price vs technical trade-offs",
    "priceRationale": "How to justify your price"
  },
  "costReductionOpportunities": ["Opportunity 1", "Opportunity 2"],
  "pricingRisks": ["Risk 1", "Risk 2"]
}`,

  // TASK 34: Capture Plan Outline
  34: `You are a capture manager creating a comprehensive capture plan.

Based on ALL insights from Phases 1, 2, and 3, create a detailed capture plan outline.

A capture plan is the roadmap from "should we bid?" to "contract award."

Include:
1. Opportunity summary (complexity, win probability, strategic value)
2. Win strategy (win themes, differentiators, pricing approach)
3. Competitive assessment (who we're competing against, their strengths/weaknesses)
4. Solution approach (high-level technical and management approach)
5. Teaming strategy (prime/sub structure, partners)
6. Bid decision milestones (go/no-go gates)
7. Proposal timeline and critical path
8. Resource requirements (proposal team, SMEs, costs)
9. Key personnel assignments
10. Risk management (proposal risks, execution risks)
11. Pricing strategy and budget
12. Post-submission activities (orals prep, BAFO strategy)

Return a JSON object:
{
  "executiveSummary": {
    "opportunityName": "...",
    "agency": "...",
    "contractValue": "...",
    "winProbability": 65, // from Task 26
    "bidRecommendation": "BID" | "CAUTION" | "NO_BID",
    "strategicValue": "Why this opportunity matters"
  },
  "winStrategy": {
    "primaryWinTheme": "From Task 27",
    "keyDifferentiators": ["From Task 28"],
    "ghostingStrategy": "How we'll make competitors irrelevant",
    "pricingStrategy": "From Task 33"
  },
  "competitiveAssessment": {
    "primaryCompetitors": [
      {
        "competitor": "Company name",
        "strengths": ["Strength 1", "Strength 2"],
        "weaknesses": ["Weakness 1", "Weakness 2"],
        "ourAdvantages": ["How we beat them"]
      }
    ],
    "competitiveLandscape": "Overall competitive dynamics"
  },
  "solutionApproach": {
    "technicalApproach": "High-level from Task 30",
    "managementApproach": "High-level from Task 30",
    "keyInnovations": ["Innovation 1", "Innovation 2"]
  },
  "teamingStrategy": {
    "structure": "PRIME | SUB | JV",
    "partners": ["Partner 1", "Partner 2"],
    "rationale": "Why this team"
  },
  "captureTimeline": {
    "rfpRelease": "Expected or actual date",
    "proposalDue": "Due date",
    "criticalMilestones": [
      {
        "milestone": "Milestone name",
        "date": "Target date",
        "owner": "Responsible person",
        "status": "NOT_STARTED | IN_PROGRESS | COMPLETED"
      }
    ]
  },
  "resourceRequirements": {
    "proposalManager": "Name or TBD",
    "captureManager": "Name or TBD",
    "solutionArchitect": "Name or TBD",
    "pricingLead": "Name or TBD",
    "smes": ["SME 1", "SME 2"],
    "estimatedCost": "Cost to propose",
    "estimatedLevel": "Level of effort (hours)"
  },
  "riskManagement": {
    "proposalRisks": ["Risk 1", "Risk 2"],
    "executionRisks": ["Risk 1", "Risk 2"],
    "mitigation": "Overall risk mitigation approach"
  },
  "goNoGoGates": [
    {
      "gate": "Gate name (e.g., 'Draft RFP Review')",
      "date": "Target date",
      "criteria": "Criteria for proceeding",
      "decision": "GO | NO_GO | TBD"
    }
  ],
  "nextActions": [
    {
      "action": "Specific next action",
      "owner": "Responsible person",
      "dueDate": "Due date",
      "priority": "HIGH | MEDIUM | LOW"
    }
  ]
}`,
};

// ============================================================================
// PHASE 3 EXECUTOR
// ============================================================================

export class Phase3WinStrategyExecutor {
  constructor(
    private projectId: string,
    private aiRouter = getAIRouter(),
    private consensusEngine = getConsensusEngine()
  ) {}

  /**
   * Execute all Phase 3 tasks
   */
  async executeAll(): Promise<void> {
    console.log(`[Phase 3 Executor] Starting Win Strategy execution for project ${this.projectId}`);

    const tasks = await prisma.sDLTask.findMany({
      where: {
        projectId: this.projectId,
        taskPhase: SDLTaskPhase.PHASE3_WIN_STRATEGY,
      },
      orderBy: { taskNumber: 'asc' },
    });

    if (tasks.length === 0) {
      console.warn('[Phase 3 Executor] No Phase 3 tasks found');
      return;
    }

    // Get document content
    const project = await prisma.project.findUnique({
      where: { id: this.projectId },
      include: {
        documents: {
          where: { documentType: 'RFP_MAIN' },
          take: 1,
        },
      },
    });

    if (!project?.documents[0]) {
      throw new Error('RFP document not found');
    }

    const document = project.documents[0];

    // Execute critical multi-AI tasks first (26-29)
    const criticalTasks = tasks.filter((t) => MULTI_AI_TASKS.includes(t.taskNumber));
    console.log(`[Phase 3 Executor] Executing ${criticalTasks.length} critical multi-AI tasks`);

    for (const task of criticalTasks) {
      await this.executeMultiAITask(task.id, task.taskNumber, task.taskName, document);
    }

    // Execute remaining single-AI tasks (30-34)
    const singleAITasks = tasks.filter((t) => !MULTI_AI_TASKS.includes(t.taskNumber));
    console.log(`[Phase 3 Executor] Executing ${singleAITasks.length} single-AI tasks`);

    for (const task of singleAITasks) {
      await this.executeTask(task.id, task.taskNumber, task.taskName, document);
    }

    console.log('[Phase 3 Executor] Win Strategy execution completed');
  }

  /**
   * Execute single-AI task
   */
  private async executeTask(
    taskId: string,
    taskNumber: number,
    taskName: string,
    document: any
  ): Promise<void> {
    console.log(`[Phase 3 Executor] Executing Task ${taskNumber}: ${taskName}`);

    // Update status to PROCESSING
    await prisma.sDLTask.update({
      where: { id: taskId },
      data: {
        status: SDLTaskStatus.PROCESSING,
        startedAt: new Date(),
      },
    });

    try {
      const prompt = await this.buildPrompt(taskNumber, document);

      // Route to appropriate AI
      const result = await this.aiRouter.routeTask(taskNumber, taskName, prompt, document.content);

      // Save result
      await prisma.sDLTask.update({
        where: { id: taskId },
        data: {
          status: SDLTaskStatus.COMPLETED,
          completedAt: new Date(),
          primaryResult: result.result,
          primaryAIProvider: result.provider,
          primaryAIModel: result.model,
          confidenceScore: result.result?.confidence || 85,
        },
      });

      console.log(
        `[Phase 3 Executor] Task ${taskNumber} completed with ${result.provider} in ${result.duration}ms`
      );
    } catch (error) {
      console.error(`[Phase 3 Executor] Task ${taskNumber} failed:`, error);

      await prisma.sDLTask.update({
        where: { id: taskId },
        data: {
          status: SDLTaskStatus.FAILED,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  }

  /**
   * Execute multi-AI task with consensus validation
   */
  private async executeMultiAITask(
    taskId: string,
    taskNumber: number,
    taskName: string,
    document: any
  ): Promise<void> {
    console.log(
      `[Phase 3 Executor] Executing Multi-AI Task ${taskNumber}: ${taskName} (CRITICAL)`
    );

    // Update status to PROCESSING
    await prisma.sDLTask.update({
      where: { id: taskId },
      data: {
        status: SDLTaskStatus.PROCESSING,
        startedAt: new Date(),
      },
    });

    try {
      const prompt = await this.buildPrompt(taskNumber, document);

      // Get AI providers for this task
      const aiProviders = [AIProvider.OPENAI, AIProvider.CLAUDE, AIProvider.GEMINI];

      // Execute all AIs in parallel
      const results = await this.aiRouter.executeMultiAI(
        taskNumber,
        taskName,
        prompt,
        document.content,
        aiProviders
      );

      if (results.length < 2) {
        throw new Error(
          `Multi-AI task ${taskNumber} requires at least 2 AI providers, got ${results.length}`
        );
      }

      // Analyze consensus
      const consensus = await this.consensusEngine.analyzeConsensus(
        taskId,
        this.projectId,
        taskName,
        results
      );

      // Update task with consensus result
      await prisma.sDLTask.update({
        where: { id: taskId },
        data: {
          status: consensus.escalateToHuman
            ? SDLTaskStatus.ESCALATED_TO_HUMAN
            : SDLTaskStatus.COMPLETED,
          completedAt: new Date(),
          primaryResult: results[0].result,
          secondaryResult: results[1]?.result,
          consensusResult: consensus.finalResult,
          primaryAIProvider: results[0].provider,
          primaryAIModel: results[0].model,
          secondaryAIProvider: results[1]?.provider,
          secondaryAIModel: results[1]?.model,
          confidenceScore: consensus.consensusConfidence,
        },
      });

      console.log(
        `[Phase 3 Executor] Task ${taskNumber} completed: ${consensus.consensusType} (${consensus.consensusConfidence}% confidence)`
      );

      if (consensus.escalateToHuman) {
        console.warn(
          `[Phase 3 Executor] Task ${taskNumber} ESCALATED TO HUMAN: ${consensus.rationale}`
        );
      }
    } catch (error) {
      console.error(`[Phase 3 Executor] Multi-AI Task ${taskNumber} failed:`, error);

      await prisma.sDLTask.update({
        where: { id: taskId },
        data: {
          status: SDLTaskStatus.FAILED,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  }

  /**
   * Build prompt with Phase 1 & 2 context
   */
  private async buildPrompt(taskNumber: number, document: any): Promise<string> {
    const basePrompt = TASK_PROMPTS[taskNumber];

    // Get Phase 1 & 2 results for context
    const phase1Tasks = await prisma.sDLTask.findMany({
      where: {
        projectId: this.projectId,
        taskPhase: SDLTaskPhase.PHASE1_TRIAGE,
        status: SDLTaskStatus.COMPLETED,
      },
    });

    const phase2Tasks = await prisma.sDLTask.findMany({
      where: {
        projectId: this.projectId,
        taskPhase: SDLTaskPhase.PHASE2_STRATEGIC_INTEL,
        status: SDLTaskStatus.COMPLETED,
      },
    });

    // Extract key results
    const complexityScore = phase1Tasks.find((t) => t.taskNumber === 10)?.primaryResult;
    const riskFlags = phase1Tasks.find((t) => t.taskNumber === 11)?.primaryResult;
    const unstatedRequirements = phase2Tasks.find((t) => t.taskNumber === 18)?.primaryResult;
    const painPoints = phase2Tasks.find((t) => t.taskNumber === 19)?.primaryResult;
    const budgetReality = phase2Tasks.find((t) => t.taskNumber === 20)?.primaryResult;
    const timelineConstraints = phase2Tasks.find((t) => t.taskNumber === 21)?.primaryResult;

    return `
${basePrompt}

---
CONTEXT FROM PREVIOUS PHASES:

Phase 1 Triage Results:
- Complexity Score: ${JSON.stringify(complexityScore, null, 2)}
- Risk Flags: ${JSON.stringify(riskFlags, null, 2)}

Phase 2 Strategic Intelligence Results:
- Unstated Requirements (Task 18): ${JSON.stringify(unstatedRequirements, null, 2)}
- Pain Points (Task 19): ${JSON.stringify(painPoints, null, 2)}
- Budget Reality (Task 20): ${JSON.stringify(budgetReality, null, 2)}
- Timeline Constraints (Task 21): ${JSON.stringify(timelineConstraints, null, 2)}

Document Metadata:
- Document Type: ${document.documentType}
- File Name: ${document.fileName}
- Upload Date: ${document.uploadedAt}

Use this context to inform your analysis for Task ${taskNumber}.
    `.trim();
  }

  /**
   * Get Phase 3 summary
   */
  async getSummary() {
    const tasks = await prisma.sDLTask.findMany({
      where: {
        projectId: this.projectId,
        taskPhase: SDLTaskPhase.PHASE3_WIN_STRATEGY,
      },
      orderBy: { taskNumber: 'asc' },
    });

    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === SDLTaskStatus.COMPLETED).length;
    const processing = tasks.filter((t) => t.status === SDLTaskStatus.PROCESSING).length;
    const failed = tasks.filter((t) => t.status === SDLTaskStatus.FAILED).length;
    const escalated = tasks.filter((t) => t.status === SDLTaskStatus.ESCALATED_TO_HUMAN).length;

    return {
      phase: 'PHASE3_WIN_STRATEGY',
      total,
      completed,
      processing,
      failed,
      escalated,
      progress: total > 0 ? Math.round((completed / total) * 100) : 0,
      tasks: tasks.map((t) => ({
        taskNumber: t.taskNumber,
        taskName: t.taskName,
        status: t.status,
        confidenceScore: t.confidenceScore,
        requiresMultiAI: MULTI_AI_TASKS.includes(t.taskNumber),
      })),
    };
  }
}

/**
 * Create Phase 3 Win Strategy Executor
 */
export function createPhase3WinStrategyExecutor(projectId: string): Phase3WinStrategyExecutor {
  return new Phase3WinStrategyExecutor(projectId);
}
