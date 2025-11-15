/**
 * Quality Tracker System
 *
 * Monitors and tracks AI performance across all SDL tasks to:
 * 1. Identify which AIs perform best for specific task types
 * 2. Track consensus accuracy and human override patterns
 * 3. Optimize routing decisions based on historical performance
 * 4. Detect quality degradation or API issues
 * 5. Calculate cost-effectiveness metrics
 *
 * This system continuously improves the SDL orchestration by learning
 * from actual performance data.
 */

import { prisma } from '@/lib/prisma';
import { AIProvider, ConsensusType, SDLTaskPhase } from '@prisma/client';

// ============================================================================
// QUALITY METRICS
// ============================================================================

export interface AIPerformanceMetrics {
  provider: AIProvider;
  totalExecutions: number;
  successRate: number; // % successful completions
  avgConfidence: number; // Average confidence score
  avgDuration: number; // Average execution time (ms)
  consensusAgreementRate: number; // % times this AI agreed with consensus
  humanOverrideRate: number; // % times human chose different output
  costEfficiency: number; // Value per dollar spent
  qualityScore: number; // Composite quality score 0-100
}

export interface TaskTypePerformance {
  taskPhase: SDLTaskPhase;
  taskNumbers: number[];
  bestProvider: AIProvider;
  performanceByProvider: Record<AIProvider, number>; // Quality scores
  avgConsensusConfidence: number;
  humanReviewRate: number;
}

export interface QualityTrend {
  date: Date;
  provider: AIProvider;
  qualityScore: number;
  executionCount: number;
}

// ============================================================================
// QUALITY TRACKER CLASS
// ============================================================================

export class QualityTracker {
  /**
   * Get performance metrics for all AI providers
   */
  async getProviderMetrics(projectId?: string): Promise<AIPerformanceMetrics[]> {
    const providers = Object.values(AIProvider);
    const metrics: AIPerformanceMetrics[] = [];

    for (const provider of providers) {
      const metric = await this.calculateProviderMetrics(provider, projectId);
      metrics.push(metric);
    }

    return metrics.sort((a, b) => b.qualityScore - a.qualityScore);
  }

  /**
   * Calculate performance metrics for a single provider
   */
  private async calculateProviderMetrics(
    provider: AIProvider,
    projectId?: string
  ): Promise<AIPerformanceMetrics> {
    // Get all tasks executed by this provider
    const whereClause: any = {
      OR: [{ primaryAIProvider: provider }, { secondaryAIProvider: provider }],
    };
    if (projectId) {
      whereClause.projectId = projectId;
    }

    const tasks = await prisma.sDLTask.findMany({ where: whereClause });

    const totalExecutions = tasks.length;

    if (totalExecutions === 0) {
      return {
        provider,
        totalExecutions: 0,
        successRate: 0,
        avgConfidence: 0,
        avgDuration: 0,
        consensusAgreementRate: 0,
        humanOverrideRate: 0,
        costEfficiency: 0,
        qualityScore: 0,
      };
    }

    // Calculate success rate
    const successfulTasks = tasks.filter(
      (t) => t.status === 'COMPLETED' || t.status === 'ESCALATED_TO_HUMAN'
    ).length;
    const successRate = (successfulTasks / totalExecutions) * 100;

    // Calculate average confidence
    const confidenceScores = tasks
      .map((t) => t.confidenceScore)
      .filter((c): c is number => c !== null);
    const avgConfidence =
      confidenceScores.length > 0
        ? confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length
        : 0;

    // Calculate consensus agreement rate
    const consensusAgreementRate = await this.calculateConsensusAgreementRate(provider, projectId);

    // Calculate human override rate
    const humanOverrideRate = await this.calculateHumanOverrideRate(provider, projectId);

    // Estimate average duration (placeholder - would need to track execution times)
    const avgDuration = 5000; // 5 seconds average

    // Calculate cost efficiency (placeholder)
    const costEfficiency = this.calculateCostEfficiency(provider, avgConfidence);

    // Calculate composite quality score
    const qualityScore = this.calculateQualityScore({
      successRate,
      avgConfidence,
      consensusAgreementRate,
      humanOverrideRate,
      costEfficiency,
    });

    return {
      provider,
      totalExecutions,
      successRate,
      avgConfidence,
      avgDuration,
      consensusAgreementRate,
      humanOverrideRate,
      costEfficiency,
      qualityScore,
    };
  }

  /**
   * Calculate consensus agreement rate for a provider
   */
  private async calculateConsensusAgreementRate(
    provider: AIProvider,
    projectId?: string
  ): Promise<number> {
    const whereClause: any = {};
    if (projectId) {
      whereClause.projectId = projectId;
    }

    const consensusLogs = await prisma.consensusLog.findMany({ where: whereClause });

    if (consensusLogs.length === 0) return 100;

    // Count how many times this provider's output matched the consensus
    let agreementCount = 0;

    for (const log of consensusLogs) {
      const providerOutput =
        provider === AIProvider.OPENAI
          ? log.gpt5Output
          : provider === AIProvider.CLAUDE
            ? log.claudeOutput
            : log.geminiOutput;

      // If provider's output exists and consensus type is FULL_CONSENSUS
      if (providerOutput && log.consensusType === ConsensusType.FULL_CONSENSUS) {
        agreementCount++;
      }
    }

    return (agreementCount / consensusLogs.length) * 100;
  }

  /**
   * Calculate human override rate for a provider
   */
  private async calculateHumanOverrideRate(
    provider: AIProvider,
    projectId?: string
  ): Promise<number> {
    const whereClause: any = {
      humanReviewerId: { not: null },
    };
    if (projectId) {
      whereClause.projectId = projectId;
    }

    const reviewedLogs = await prisma.consensusLog.findMany({ where: whereClause });

    if (reviewedLogs.length === 0) return 0;

    // Count how many times human chose a different output than this provider's
    let overrideCount = 0;

    for (const log of reviewedLogs) {
      const providerOutput =
        provider === AIProvider.OPENAI
          ? log.gpt5Output
          : provider === AIProvider.CLAUDE
            ? log.claudeOutput
            : log.geminiOutput;

      // If human decision exists and differs from provider output
      if (
        log.humanDecision &&
        providerOutput &&
        JSON.stringify(log.humanDecision) !== JSON.stringify(providerOutput)
      ) {
        overrideCount++;
      }
    }

    return (overrideCount / reviewedLogs.length) * 100;
  }

  /**
   * Calculate cost efficiency (quality per dollar)
   */
  private calculateCostEfficiency(provider: AIProvider, avgConfidence: number): number {
    // Cost per 1M tokens (rough estimates)
    const costPerMillion: Record<AIProvider, number> = {
      OPENAI: 20.0, // GPT-4
      CLAUDE: 15.0, // Claude Sonnet
      GEMINI: 2.0, // Gemini Pro
      GROK: 8.0, // Grok
    };

    const cost = costPerMillion[provider];
    return (avgConfidence / cost) * 10; // Normalize to 0-100 scale
  }

  /**
   * Calculate composite quality score
   */
  private calculateQualityScore(metrics: {
    successRate: number;
    avgConfidence: number;
    consensusAgreementRate: number;
    humanOverrideRate: number;
    costEfficiency: number;
  }): number {
    // Weighted average of all metrics
    const weights = {
      successRate: 0.25,
      avgConfidence: 0.25,
      consensusAgreementRate: 0.25,
      humanOverride: 0.15, // Lower weight, inverted (lower is better)
      costEfficiency: 0.1,
    };

    const score =
      metrics.successRate * weights.successRate +
      metrics.avgConfidence * weights.avgConfidence +
      metrics.consensusAgreementRate * weights.consensusAgreementRate +
      (100 - metrics.humanOverrideRate) * weights.humanOverride +
      metrics.costEfficiency * weights.costEfficiency;

    return Math.round(score);
  }

  /**
   * Get performance by task type
   */
  async getTaskTypePerformance(projectId?: string): Promise<TaskTypePerformance[]> {
    const phases = [
      SDLTaskPhase.PHASE1_TRIAGE,
      SDLTaskPhase.PHASE2_STRATEGIC_INTEL,
      SDLTaskPhase.PHASE3_WIN_STRATEGY,
    ];

    const performances: TaskTypePerformance[] = [];

    for (const phase of phases) {
      const performance = await this.calculateTaskTypePerformance(phase, projectId);
      performances.push(performance);
    }

    return performances;
  }

  /**
   * Calculate performance for a task type
   */
  private async calculateTaskTypePerformance(
    taskPhase: SDLTaskPhase,
    projectId?: string
  ): Promise<TaskTypePerformance> {
    const whereClause: any = { taskPhase };
    if (projectId) {
      whereClause.projectId = projectId;
    }

    const tasks = await prisma.sDLTask.findMany({ where: whereClause });

    const taskNumbers = [...new Set(tasks.map((t) => t.taskNumber))];

    // Calculate performance by provider for this task type
    const performanceByProvider: Record<AIProvider, number> = {} as any;

    for (const provider of Object.values(AIProvider)) {
      const providerTasks = tasks.filter(
        (t) => t.primaryAIProvider === provider || t.secondaryAIProvider === provider
      );

      if (providerTasks.length === 0) {
        performanceByProvider[provider] = 0;
        continue;
      }

      const avgConfidence =
        providerTasks
          .map((t) => t.confidenceScore)
          .filter((c): c is number => c !== null)
          .reduce((a, b) => a + b, 0) / providerTasks.length || 0;

      const successRate =
        (providerTasks.filter((t) => t.status === 'COMPLETED').length / providerTasks.length) *
        100;

      performanceByProvider[provider] = (avgConfidence + successRate) / 2;
    }

    // Find best provider
    const bestProvider = (Object.keys(performanceByProvider) as AIProvider[]).reduce((a, b) =>
      performanceByProvider[a] > performanceByProvider[b] ? a : b
    );

    // Calculate consensus metrics
    const consensusLogs = await prisma.consensusLog.findMany({
      where: {
        sdlTask: {
          taskPhase,
          ...(projectId ? { projectId } : {}),
        },
      },
    });

    const avgConsensusConfidence =
      consensusLogs.length > 0
        ? consensusLogs.reduce((sum, l) => sum + (l.consensusConfidence || 0), 0) /
          consensusLogs.length
        : 0;

    const humanReviewRate =
      consensusLogs.length > 0
        ? (consensusLogs.filter((l) => l.humanReviewerId !== null).length / consensusLogs.length) *
          100
        : 0;

    return {
      taskPhase,
      taskNumbers,
      bestProvider,
      performanceByProvider,
      avgConsensusConfidence,
      humanReviewRate,
    };
  }

  /**
   * Get quality trends over time
   */
  async getQualityTrends(
    provider: AIProvider,
    days: number = 30,
    projectId?: string
  ): Promise<QualityTrend[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const whereClause: any = {
      OR: [{ primaryAIProvider: provider }, { secondaryAIProvider: provider }],
      createdAt: { gte: startDate },
    };
    if (projectId) {
      whereClause.projectId = projectId;
    }

    const tasks = await prisma.sDLTask.findMany({
      where: whereClause,
      orderBy: { createdAt: 'asc' },
    });

    // Group by date
    const tasksByDate = new Map<string, typeof tasks>();

    for (const task of tasks) {
      const date = task.createdAt.toISOString().split('T')[0];
      if (!tasksByDate.has(date)) {
        tasksByDate.set(date, []);
      }
      tasksByDate.get(date)!.push(task);
    }

    // Calculate quality score for each date
    const trends: QualityTrend[] = [];

    for (const [dateStr, dateTasks] of tasksByDate) {
      const avgConfidence =
        dateTasks
          .map((t) => t.confidenceScore)
          .filter((c): c is number => c !== null)
          .reduce((a, b) => a + b, 0) / dateTasks.length || 0;

      const successRate =
        (dateTasks.filter((t) => t.status === 'COMPLETED').length / dateTasks.length) * 100;

      const qualityScore = (avgConfidence + successRate) / 2;

      trends.push({
        date: new Date(dateStr),
        provider,
        qualityScore,
        executionCount: dateTasks.length,
      });
    }

    return trends;
  }

  /**
   * Get recommendations for routing optimization
   */
  async getRoutingRecommendations(projectId?: string): Promise<{
    recommendations: string[];
    potentialSavings: number;
    qualityImprovement: number;
  }> {
    const taskTypePerf = await this.getTaskTypePerformance(projectId);
    const providerMetrics = await this.getProviderMetrics(projectId);

    const recommendations: string[] = [];
    let potentialSavings = 0;
    let qualityImprovement = 0;

    // Analyze each task type
    for (const perf of taskTypePerf) {
      const currentBestScore = Math.max(...Object.values(perf.performanceByProvider));
      const currentBestProvider = perf.bestProvider;

      // Check if a cheaper provider has similar performance
      for (const [provider, score] of Object.entries(perf.performanceByProvider)) {
        const providerEnum = provider as AIProvider;
        if (providerEnum === currentBestProvider) continue;

        // If performance is within 5% but cost is lower
        if (score >= currentBestScore - 5) {
          const currentProviderMetrics = providerMetrics.find((p) => p.provider === providerEnum);
          const bestProviderMetrics = providerMetrics.find(
            (p) => p.provider === currentBestProvider
          );

          if (
            currentProviderMetrics &&
            bestProviderMetrics &&
            currentProviderMetrics.costEfficiency > bestProviderMetrics.costEfficiency
          ) {
            recommendations.push(
              `Consider routing ${perf.taskPhase} tasks to ${providerEnum} instead of ${currentBestProvider} for similar quality at lower cost`
            );
            potentialSavings += 10; // Rough estimate
          }
        }
      }

      // Check for high human review rate
      if (perf.humanReviewRate > 50) {
        recommendations.push(
          `${perf.taskPhase} tasks have high human review rate (${Math.round(perf.humanReviewRate)}%). Consider multi-AI consensus for these tasks.`
        );
        qualityImprovement += 15;
      }

      // Check for low consensus confidence
      if (perf.avgConsensusConfidence < 70) {
        recommendations.push(
          `${perf.taskPhase} tasks have low consensus confidence (${Math.round(perf.avgConsensusConfidence)}%). Consider adding more AI providers to consensus.`
        );
        qualityImprovement += 10;
      }
    }

    // Check for underperforming providers
    for (const metric of providerMetrics) {
      if (metric.qualityScore < 60 && metric.totalExecutions > 10) {
        recommendations.push(
          `${metric.provider} is underperforming (quality score: ${metric.qualityScore}). Review routing rules or investigate API issues.`
        );
      }

      if (metric.humanOverrideRate > 40) {
        recommendations.push(
          `${metric.provider} has high human override rate (${Math.round(metric.humanOverrideRate)}%). Humans frequently disagree with this AI's outputs.`
        );
        qualityImprovement += 20;
      }
    }

    return {
      recommendations,
      potentialSavings: Math.round(potentialSavings),
      qualityImprovement: Math.round(qualityImprovement),
    };
  }

  /**
   * Get overall quality dashboard
   */
  async getQualityDashboard(projectId?: string) {
    const providerMetrics = await this.getProviderMetrics(projectId);
    const taskTypePerf = await this.getTaskTypePerformance(projectId);
    const recommendations = await this.getRoutingRecommendations(projectId);

    // Calculate overall metrics
    const totalExecutions = providerMetrics.reduce((sum, p) => sum + p.totalExecutions, 0);
    const avgQualityScore =
      providerMetrics.length > 0
        ? providerMetrics.reduce((sum, p) => sum + p.qualityScore, 0) / providerMetrics.length
        : 0;
    const avgSuccessRate =
      providerMetrics.length > 0
        ? providerMetrics.reduce((sum, p) => sum + p.successRate, 0) / providerMetrics.length
        : 0;

    // Get consensus statistics
    const consensusLogs = await prisma.consensusLog.findMany({
      where: projectId ? { projectId } : {},
    });

    const consensusStats = {
      total: consensusLogs.length,
      fullConsensus: consensusLogs.filter((l) => l.consensusType === ConsensusType.FULL_CONSENSUS)
        .length,
      majorityConsensus: consensusLogs.filter(
        (l) => l.consensusType === ConsensusType.MAJORITY_CONSENSUS
      ).length,
      splitDecisions: consensusLogs.filter((l) => l.consensusType === ConsensusType.SPLIT_DECISION)
        .length,
      lowConfidence: consensusLogs.filter((l) => l.consensusType === ConsensusType.LOW_CONFIDENCE)
        .length,
    };

    return {
      overview: {
        totalExecutions,
        avgQualityScore: Math.round(avgQualityScore),
        avgSuccessRate: Math.round(avgSuccessRate),
        consensusRate:
          consensusLogs.length > 0
            ? Math.round((consensusStats.fullConsensus / consensusLogs.length) * 100)
            : 0,
      },
      providerMetrics,
      taskTypePerformance: taskTypePerf,
      consensusStats,
      recommendations,
    };
  }
}

/**
 * Create Quality Tracker instance
 */
export function createQualityTracker(): QualityTracker {
  return new QualityTracker();
}

/**
 * Get Quality Tracker singleton
 */
let qualityTrackerInstance: QualityTracker | null = null;

export function getQualityTracker(): QualityTracker {
  if (!qualityTrackerInstance) {
    qualityTrackerInstance = new QualityTracker();
  }
  return qualityTrackerInstance;
}
