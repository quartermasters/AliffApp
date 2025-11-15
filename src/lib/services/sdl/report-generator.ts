/**
 * SDL Report Generator
 *
 * Generates two critical reports:
 * 1. Diagnosis Brief - After Phase 1 & 2 completion
 * 2. Win Strategy Brief - After all phases complete
 *
 * These reports synthesize all AI outputs and human adjudications
 * into actionable executive summaries.
 */

import { prisma } from '@/lib/prisma';
import { SDLTaskPhase, SDLTaskStatus } from '@prisma/client';

// ============================================================================
// DIAGNOSIS BRIEF (After Phase 1 & 2)
// ============================================================================

export interface DiagnosisBrief {
  // Executive Summary
  executiveSummary: {
    opportunityName: string;
    agency: string;
    contractValue: string;
    solicitationNumber: string;
    dueDate: Date;
    complexityScore: number;
    complexityLevel: 'Simple' | 'Moderate' | 'Complex' | 'Strategic';
    overallRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  };

  // Phase 1 Triage Results
  triage: {
    documentStructure: any;
    statedRequirements: any[];
    evaluationCriteria: any[];
    complianceRequirements: any[];
    timeline: any;
    riskFlags: any[];
  };

  // Phase 2 Strategic Intelligence
  strategicIntel: {
    // Research Findings
    incumbent: {
      name?: string;
      performance?: string;
      vulnerabilities?: string[];
    };
    agencyProfile: {
      spendingPatterns?: string;
      preferences?: string;
      culture?: string;
    };
    competitors: {
      primaryCompetitors: string[];
      competitiveLandscape: string;
    };

    // Critical Insights (Multi-AI Validated)
    whyNow: {
      primaryReason: string;
      timingSignificance: string;
      strategicImplication: string;
      consensus: string;
    };
    unstatedRequirements: {
      requirements: any[];
      hiddenConstraints: any[];
      realNeeds: string;
      consensus: string;
    };
    painPoints: {
      primaryPainPoint: string;
      secondaryPainPoints: string[];
      impact: string;
      consensus: string;
    };
    budgetReality: {
      stated: string;
      actual: string;
      constraints: string;
      consensus: string;
    };
    timelineConstraints: {
      critical: any[];
      implications: string;
      consensus: string;
    };

    // Pattern Analysis
    patterns: {
      matchedPatterns: string[];
      redFlags: any[];
      greenFlags: any[];
    };
  };

  // Recommendations
  recommendations: {
    bidRecommendation: 'PURSUE' | 'CAUTION' | 'NO_BID';
    rationale: string;
    criticalActions: string[];
    nextSteps: string[];
  };

  // Metadata
  metadata: {
    generatedAt: Date;
    phaseProgress: {
      phase1Complete: boolean;
      phase2Complete: boolean;
      phase3Complete: boolean;
    };
    aiAnalysisCount: number;
    humanReviewsCount: number;
  };
}

// ============================================================================
// WIN STRATEGY BRIEF (After All Phases)
// ============================================================================

export interface WinStrategyBrief {
  // Executive Summary
  executiveSummary: {
    opportunityName: string;
    agency: string;
    contractValue: string;
    winProbability: number;
    bidDecision: 'BID' | 'CAUTION' | 'NO_BID';
    strategicValue: string;
  };

  // Win Strategy
  winStrategy: {
    primaryWinTheme: {
      theme: string;
      addressesPainPoint: string;
      addressesUnstated: string;
      proofPoints: string[];
    };
    secondaryWinThemes: any[];
    differentiators: any[];
    ghostingStrategy: string;
  };

  // Solution Approach
  solution: {
    overallApproach: string;
    technicalHighlights: string[];
    managementHighlights: string[];
    innovations: string[];
    alignmentWithUnstated: string;
  };

  // Competitive Strategy
  competitive: {
    primaryCompetitors: any[];
    competitiveLandscape: string;
    ourAdvantages: string[];
    threats: string[];
  };

  // Execution Plan
  execution: {
    teamingStrategy: {
      structure: string;
      partners: string[];
      rationale: string;
    };
    pricingStrategy: {
      strategy: string;
      targetPrice: string;
      rationale: string;
    };
    riskMitigation: {
      topRisks: any[];
      mitigationApproach: string;
    };
  };

  // Capture Plan
  capturePlan: {
    criticalMilestones: any[];
    resourceRequirements: any;
    goNoGoGates: any[];
    nextActions: any[];
  };

  // Diagnosis Context (from Diagnosis Brief)
  diagnosisContext: {
    complexityScore: number;
    unstatedRequirements: any[];
    painPoints: any[];
    budgetReality: string;
  };

  // Metadata
  metadata: {
    generatedAt: Date;
    allPhasesComplete: boolean;
    totalAIAnalyses: number;
    humanReviewsCount: number;
    consensusQuality: number; // Average consensus confidence
  };
}

// ============================================================================
// REPORT GENERATOR CLASS
// ============================================================================

export class ReportGenerator {
  constructor(private projectId: string) {}

  /**
   * Generate Diagnosis Brief (after Phase 1 & 2)
   */
  async generateDiagnosisBrief(): Promise<DiagnosisBrief> {
    console.log(`[Report Generator] Generating Diagnosis Brief for project ${this.projectId}`);

    // Verify Phase 1 & 2 are complete
    const phase1Tasks = await this.getTasksByPhase(SDLTaskPhase.PHASE1_TRIAGE);
    const phase2Tasks = await this.getTasksByPhase(SDLTaskPhase.PHASE2_STRATEGIC_INTEL);

    const phase1Complete = phase1Tasks.every((t) => t.status === SDLTaskStatus.COMPLETED);
    const phase2Complete = phase2Tasks.every((t) => t.status === SDLTaskStatus.COMPLETED);

    if (!phase1Complete || !phase2Complete) {
      throw new Error('Phase 1 and Phase 2 must be complete to generate Diagnosis Brief');
    }

    // Get project details
    const project = await prisma.project.findUnique({
      where: { id: this.projectId },
      include: {
        documents: {
          where: { documentType: 'RFP_MAIN' },
          take: 1,
        },
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    // Extract Phase 1 results
    const metadata = this.getTaskResult(phase1Tasks, 2); // Task 2: Metadata
    const statedRequirements = this.getTaskResult(phase1Tasks, 5); // Task 5: Requirements
    const evaluationCriteria = this.getTaskResult(phase1Tasks, 6); // Task 6: Eval criteria
    const complianceRequirements = this.getTaskResult(phase1Tasks, 7); // Task 7: Compliance
    const timeline = this.getTaskResult(phase1Tasks, 8); // Task 8: Timeline
    const complexityScore = this.getTaskResult(phase1Tasks, 10); // Task 10: Complexity
    const riskFlags = this.getTaskResult(phase1Tasks, 11); // Task 11: Risk flags

    // Extract Phase 2 results
    const incumbent = this.getTaskResult(phase2Tasks, 12); // Task 12: Incumbent
    const agencySpending = this.getTaskResult(phase2Tasks, 13); // Task 13: Agency spending
    const agencyCulture = this.getTaskResult(phase2Tasks, 22); // Task 22: Culture
    const competitors = this.getTaskResult(phase2Tasks, 16); // Task 16: Competitors
    const whyNow = this.getTaskResult(phase2Tasks, 17); // Task 17: Why NOW?
    const unstatedRequirements = this.getTaskResult(phase2Tasks, 18); // Task 18: Unstated
    const painPoints = this.getTaskResult(phase2Tasks, 19); // Task 19: Pain points
    const budgetReality = this.getTaskResult(phase2Tasks, 20); // Task 20: Budget
    const timelineConstraints = this.getTaskResult(phase2Tasks, 21); // Task 21: Timeline
    const patterns = this.getTaskResult(phase2Tasks, 23); // Task 23: Patterns
    const redFlags = this.getTaskResult(phase2Tasks, 24); // Task 24: Red flags
    const greenFlags = this.getTaskResult(phase2Tasks, 25); // Task 25: Green flags

    // Get consensus logs for critical tasks
    const consensusLogs = await prisma.consensusLog.findMany({
      where: {
        projectId: this.projectId,
        sdlTask: {
          taskNumber: { in: [17, 18, 19, 20, 21] }, // Critical multi-AI tasks
        },
      },
    });

    // Determine overall risk level
    const overallRisk = this.determineOverallRisk(
      complexityScore?.complexityScore,
      riskFlags?.risks?.length || 0,
      redFlags?.redFlags?.length || 0
    );

    // Determine bid recommendation
    const bidRecommendation = this.determineBidRecommendation(
      complexityScore?.complexityScore,
      unstatedRequirements,
      budgetReality,
      riskFlags
    );

    const brief: DiagnosisBrief = {
      executiveSummary: {
        opportunityName: project.projectName,
        agency: metadata?.agency || 'Unknown Agency',
        contractValue: metadata?.contractValue || 'TBD',
        solicitationNumber: metadata?.solicitationNumber || 'N/A',
        dueDate: metadata?.dueDate ? new Date(metadata.dueDate) : new Date(),
        complexityScore: complexityScore?.complexityScore || 5,
        complexityLevel: complexityScore?.recommendedDepthLevel || 'Moderate',
        overallRisk,
      },

      triage: {
        documentStructure: this.getTaskResult(phase1Tasks, 3), // Task 3: Structure
        statedRequirements: statedRequirements?.requirements || [],
        evaluationCriteria: evaluationCriteria?.criteria || [],
        complianceRequirements: complianceRequirements?.requirements || [],
        timeline: timeline?.timeline || {},
        riskFlags: riskFlags?.risks || [],
      },

      strategicIntel: {
        incumbent: {
          name: incumbent?.incumbentName,
          performance: incumbent?.performance,
          vulnerabilities: incumbent?.vulnerabilities || [],
        },
        agencyProfile: {
          spendingPatterns: agencySpending?.patterns,
          preferences: agencySpending?.preferences,
          culture: agencyCulture?.culture,
        },
        competitors: {
          primaryCompetitors: competitors?.competitors?.map((c: any) => c.name) || [],
          competitiveLandscape: competitors?.landscape || '',
        },
        whyNow: {
          primaryReason: whyNow?.primaryReason || '',
          timingSignificance: whyNow?.timingSignificance || '',
          strategicImplication: whyNow?.strategicImplication || '',
          consensus: this.getConsensusType(consensusLogs, 17),
        },
        unstatedRequirements: {
          requirements: unstatedRequirements?.unstatedRequirements || [],
          hiddenConstraints: unstatedRequirements?.hiddenConstraints || [],
          realNeeds: unstatedRequirements?.realNeeds || '',
          consensus: this.getConsensusType(consensusLogs, 18),
        },
        painPoints: {
          primaryPainPoint: painPoints?.primaryPainPoint || '',
          secondaryPainPoints: painPoints?.secondaryPainPoints || [],
          impact: painPoints?.impact || '',
          consensus: this.getConsensusType(consensusLogs, 19),
        },
        budgetReality: {
          stated: budgetReality?.statedBudget || '',
          actual: budgetReality?.actualBudget || '',
          constraints: budgetReality?.constraints || '',
          consensus: this.getConsensusType(consensusLogs, 20),
        },
        timelineConstraints: {
          critical: timelineConstraints?.criticalConstraints || [],
          implications: timelineConstraints?.implications || '',
          consensus: this.getConsensusType(consensusLogs, 21),
        },
        patterns: {
          matchedPatterns: patterns?.matchedPatterns || [],
          redFlags: redFlags?.redFlags || [],
          greenFlags: greenFlags?.greenFlags || [],
        },
      },

      recommendations: {
        bidRecommendation,
        rationale: this.getBidRationale(
          bidRecommendation,
          complexityScore,
          unstatedRequirements,
          budgetReality,
          riskFlags
        ),
        criticalActions: this.getCriticalActions(
          unstatedRequirements,
          painPoints,
          timelineConstraints
        ),
        nextSteps: this.getNextSteps(bidRecommendation),
      },

      metadata: {
        generatedAt: new Date(),
        phaseProgress: {
          phase1Complete,
          phase2Complete,
          phase3Complete: false,
        },
        aiAnalysisCount: phase1Tasks.length + phase2Tasks.length,
        humanReviewsCount: consensusLogs.filter((l) => l.humanReviewerId).length,
      },
    };

    // Save brief to database
    await this.saveDiagnosisBrief(brief);

    return brief;
  }

  /**
   * Generate Win Strategy Brief (after all phases)
   */
  async generateWinStrategyBrief(): Promise<WinStrategyBrief> {
    console.log(`[Report Generator] Generating Win Strategy Brief for project ${this.projectId}`);

    // Verify all phases are complete
    const phase1Tasks = await this.getTasksByPhase(SDLTaskPhase.PHASE1_TRIAGE);
    const phase2Tasks = await this.getTasksByPhase(SDLTaskPhase.PHASE2_STRATEGIC_INTEL);
    const phase3Tasks = await this.getTasksByPhase(SDLTaskPhase.PHASE3_WIN_STRATEGY);

    const phase1Complete = phase1Tasks.every((t) => t.status === SDLTaskStatus.COMPLETED);
    const phase2Complete = phase2Tasks.every((t) => t.status === SDLTaskStatus.COMPLETED);
    const phase3Complete = phase3Tasks.every((t) => t.status === SDLTaskStatus.COMPLETED);

    if (!phase1Complete || !phase2Complete || !phase3Complete) {
      throw new Error('All phases must be complete to generate Win Strategy Brief');
    }

    // Get project details
    const project = await prisma.project.findUnique({
      where: { id: this.projectId },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    // Extract Phase 1 & 2 results (for context)
    const metadata = this.getTaskResult(phase1Tasks, 2);
    const complexityScore = this.getTaskResult(phase1Tasks, 10);
    const unstatedRequirements = this.getTaskResult(phase2Tasks, 18);
    const painPoints = this.getTaskResult(phase2Tasks, 19);
    const budgetReality = this.getTaskResult(phase2Tasks, 20);
    const competitors = this.getTaskResult(phase2Tasks, 16);

    // Extract Phase 3 results
    const winProbability = this.getTaskResult(phase3Tasks, 26); // Task 26: Win probability
    const winThemes = this.getTaskResult(phase3Tasks, 27); // Task 27: Win themes
    const differentiators = this.getTaskResult(phase3Tasks, 28); // Task 28: Differentiators
    const noBidRecommendation = this.getTaskResult(phase3Tasks, 29); // Task 29: No-bid
    const solutionApproach = this.getTaskResult(phase3Tasks, 30); // Task 30: Solution
    const riskMitigation = this.getTaskResult(phase3Tasks, 31); // Task 31: Risk mitigation
    const teamingStrategy = this.getTaskResult(phase3Tasks, 32); // Task 32: Teaming
    const pricingStrategy = this.getTaskResult(phase3Tasks, 33); // Task 33: Pricing
    const capturePlan = this.getTaskResult(phase3Tasks, 34); // Task 34: Capture plan

    // Get all consensus logs
    const consensusLogs = await prisma.consensusLog.findMany({
      where: { projectId: this.projectId },
    });

    const avgConsensusConfidence =
      consensusLogs.length > 0
        ? consensusLogs.reduce((sum, l) => sum + (l.consensusConfidence || 0), 0) /
          consensusLogs.length
        : 0;

    const brief: WinStrategyBrief = {
      executiveSummary: {
        opportunityName: project.projectName,
        agency: metadata?.agency || 'Unknown Agency',
        contractValue: metadata?.contractValue || 'TBD',
        winProbability: winProbability?.winProbability || 50,
        bidDecision: noBidRecommendation?.recommendation || 'CAUTION',
        strategicValue: noBidRecommendation?.strategicValue || '',
      },

      winStrategy: {
        primaryWinTheme: winThemes?.primaryWinTheme || {
          theme: '',
          addressesPainPoint: '',
          addressesUnstated: '',
          proofPoints: [],
        },
        secondaryWinThemes: winThemes?.secondaryWinThemes || [],
        differentiators: differentiators?.differentiators || [],
        ghostingStrategy: differentiators?.ghostingStrategy || '',
      },

      solution: {
        overallApproach: solutionApproach?.overallApproach || '',
        technicalHighlights: solutionApproach?.technicalApproach?.keyComponents || [],
        managementHighlights: [
          solutionApproach?.managementApproach?.approach,
          solutionApproach?.managementApproach?.qualityControl,
        ].filter(Boolean),
        innovations: solutionApproach?.technicalApproach?.innovativeElements || [],
        alignmentWithUnstated: solutionApproach?.alignmentWithUnstatedNeeds || '',
      },

      competitive: {
        primaryCompetitors: competitors?.competitors || [],
        competitiveLandscape: competitors?.landscape || '',
        ourAdvantages: differentiators?.differentiators?.map((d: any) => d.differentiator) || [],
        threats: winProbability?.keyFactors?.threats || [],
      },

      execution: {
        teamingStrategy: {
          structure: teamingStrategy?.teamingRecommendation || 'SOLO',
          partners: teamingStrategy?.capabilityGaps?.map((g: any) => g.possiblePartners) || [],
          rationale: teamingStrategy?.rationale || '',
        },
        pricingStrategy: {
          strategy: pricingStrategy?.pricingStrategy || 'COMPETITIVE',
          targetPrice: pricingStrategy?.targetPrice?.targetPrice || 'TBD',
          rationale: pricingStrategy?.rationale || '',
        },
        riskMitigation: {
          topRisks: riskMitigation?.risks?.slice(0, 5) || [],
          mitigationApproach: riskMitigation?.overallRiskPosture || '',
        },
      },

      capturePlan: {
        criticalMilestones: capturePlan?.captureTimeline?.criticalMilestones || [],
        resourceRequirements: capturePlan?.resourceRequirements || {},
        goNoGoGates: capturePlan?.goNoGoGates || [],
        nextActions: capturePlan?.nextActions || [],
      },

      diagnosisContext: {
        complexityScore: complexityScore?.complexityScore || 5,
        unstatedRequirements: unstatedRequirements?.unstatedRequirements || [],
        painPoints: painPoints?.painPoints || [],
        budgetReality: budgetReality?.actualBudget || '',
      },

      metadata: {
        generatedAt: new Date(),
        allPhasesComplete: phase1Complete && phase2Complete && phase3Complete,
        totalAIAnalyses: phase1Tasks.length + phase2Tasks.length + phase3Tasks.length,
        humanReviewsCount: consensusLogs.filter((l) => l.humanReviewerId).length,
        consensusQuality: Math.round(avgConsensusConfidence),
      },
    };

    // Save brief to database
    await this.saveWinStrategyBrief(brief);

    return brief;
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private async getTasksByPhase(phase: SDLTaskPhase) {
    return await prisma.sDLTask.findMany({
      where: {
        projectId: this.projectId,
        taskPhase: phase,
      },
      orderBy: { taskNumber: 'asc' },
    });
  }

  private getTaskResult(tasks: any[], taskNumber: number): any {
    const task = tasks.find((t) => t.taskNumber === taskNumber);
    return task?.consensusResult || task?.primaryResult || null;
  }

  private getConsensusType(logs: any[], taskNumber: number): string {
    const log = logs.find((l) => l.sdlTask?.taskNumber === taskNumber);
    return log?.consensusType || 'N/A';
  }

  private determineOverallRisk(
    complexity: number,
    riskFlagCount: number,
    redFlagCount: number
  ): 'Low' | 'Medium' | 'High' | 'Critical' {
    const riskScore = (complexity || 5) + riskFlagCount * 2 + redFlagCount * 3;

    if (riskScore < 10) return 'Low';
    if (riskScore < 20) return 'Medium';
    if (riskScore < 30) return 'High';
    return 'Critical';
  }

  private determineBidRecommendation(
    complexity: any,
    unstated: any,
    budget: any,
    risks: any
  ): 'PURSUE' | 'CAUTION' | 'NO_BID' {
    // Complex decision logic
    const complexityScore = complexity?.complexityScore || 5;
    const hasUnstated = (unstated?.unstatedRequirements?.length || 0) > 0;
    const budgetMismatch = budget?.actualBudget !== budget?.statedBudget;
    const criticalRisks = (risks?.risks?.filter((r: any) => r.severity === 'CRITICAL')?.length || 0);

    if (criticalRisks > 2) return 'NO_BID';
    if (complexityScore > 8 || budgetMismatch) return 'CAUTION';
    if (hasUnstated && complexityScore < 7) return 'PURSUE';
    return 'CAUTION';
  }

  private getBidRationale(
    recommendation: string,
    complexity: any,
    unstated: any,
    budget: any,
    risks: any
  ): string {
    // Generate rationale based on recommendation
    const reasons: string[] = [];

    if (recommendation === 'PURSUE') {
      reasons.push('Opportunity aligns with capabilities');
      if (unstated?.unstatedRequirements?.length > 0) {
        reasons.push('Identified unstated requirements provide competitive advantage');
      }
    } else if (recommendation === 'CAUTION') {
      reasons.push('Moderate complexity requires careful approach');
      if (budget?.actualBudget !== budget?.statedBudget) {
        reasons.push('Budget reality differs from stated amount');
      }
    } else {
      reasons.push('Critical risk factors identified');
      const criticalRisks = risks?.risks?.filter((r: any) => r.severity === 'CRITICAL') || [];
      if (criticalRisks.length > 0) {
        reasons.push(`${criticalRisks.length} critical risks detected`);
      }
    }

    return reasons.join('. ') + '.';
  }

  private getCriticalActions(unstated: any, painPoints: any, timeline: any): string[] {
    const actions: string[] = [];

    if (unstated?.unstatedRequirements?.length > 0) {
      actions.push(`Address ${unstated.unstatedRequirements.length} unstated requirements`);
    }

    if (painPoints?.primaryPainPoint) {
      actions.push(`Develop solution for primary pain point: ${painPoints.primaryPainPoint}`);
    }

    if (timeline?.criticalConstraints?.length > 0) {
      actions.push('Plan for critical timeline constraints');
    }

    return actions;
  }

  private getNextSteps(recommendation: string): string[] {
    if (recommendation === 'PURSUE') {
      return [
        'Proceed to Phase 3 Win Strategy development',
        'Begin teaming partner outreach',
        'Draft technical approach',
        'Develop pricing strategy',
      ];
    } else if (recommendation === 'CAUTION') {
      return [
        'Conduct internal capability assessment',
        'Validate budget assumptions with agency',
        'Develop risk mitigation strategies',
        'Schedule bid/no-bid decision meeting',
      ];
    } else {
      return [
        'Document lessons learned',
        'Notify stakeholders of no-bid decision',
        'Archive analysis for future opportunities',
      ];
    }
  }

  private async saveDiagnosisBrief(brief: DiagnosisBrief): Promise<void> {
    await prisma.project.update({
      where: { id: this.projectId },
      data: {
        sdlDiagnosisBrief: brief as any,
        sdlComplexityScore: brief.executiveSummary.complexityScore,
      },
    });
  }

  private async saveWinStrategyBrief(brief: WinStrategyBrief): Promise<void> {
    await prisma.project.update({
      where: { id: this.projectId },
      data: {
        sdlWinStrategyBrief: brief as any,
        sdlWinProbability: brief.executiveSummary.winProbability,
        sdlStatus: 'COMPLETED',
      },
    });
  }
}

/**
 * Create Report Generator instance
 */
export function createReportGenerator(projectId: string): ReportGenerator {
  return new ReportGenerator(projectId);
}
