/**
 * Aliff AI - Cost Tracker
 *
 * Tracks AI costs, provides analytics, and monitors budgets.
 */

import { v4 as uuidv4 } from 'uuid';
import type { AIResponse, AIModel } from '../types';
import type {
  CostRecord,
  CostStats,
  CostOptimization,
  CostBudget,
  CostAlert,
} from './types';

/**
 * In-memory cost storage
 * In production, this would use a database
 */
const costRecords: CostRecord[] = [];

/**
 * Cost budget configuration
 */
let currentBudget: CostBudget = {
  daily: 10.0, // $10/day default
  weekly: 50.0,
  monthly: 200.0,
  perRequest: 0.50,
  alertThreshold: 0.8, // Alert at 80%
};

/**
 * Cost alerts
 */
const costAlerts: CostAlert[] = [];

/**
 * Initialize cost tracker with budget
 */
export function initializeCostTracker(budget?: Partial<CostBudget>): void {
  if (budget) {
    currentBudget = {
      ...currentBudget,
      ...budget,
    };
  }

  console.log('[CostTracker] Initialized:', {
    daily: `$${currentBudget.daily}`,
    monthly: `$${currentBudget.monthly}`,
  });
}

/**
 * Get current budget configuration
 */
export function getBudget(): CostBudget {
  return { ...currentBudget };
}

/**
 * Update budget
 */
export function updateBudget(budget: Partial<CostBudget>): void {
  currentBudget = {
    ...currentBudget,
    ...budget,
  };

  console.log('[CostTracker] Budget updated');
}

/**
 * Track a single AI request cost
 */
export function trackCost(
  response: AIResponse,
  options?: {
    taskType?: string;
    userId?: string;
    sessionId?: string;
  }
): CostRecord {
  const record: CostRecord = {
    id: uuidv4(),
    timestamp: response.timestamp,
    model: response.model,
    inputTokens: response.usage.inputTokens,
    outputTokens: response.usage.outputTokens,
    totalTokens: response.usage.totalTokens,
    cost: response.cost,
    latencyMs: response.latencyMs,
    taskType: options?.taskType,
    userId: options?.userId,
    sessionId: options?.sessionId,
  };

  costRecords.push(record);

  // Check budget limits
  checkBudgetLimits(record);

  return record;
}

/**
 * Track multiple AI requests
 */
export function trackCosts(
  responses: AIResponse[],
  options?: {
    taskType?: string;
    userId?: string;
    sessionId?: string;
  }
): CostRecord[] {
  return responses.map((response) => trackCost(response, options));
}

/**
 * Get cost statistics for a time period
 */
export function getCostStats(
  startDate?: Date,
  endDate?: Date
): CostStats {
  let records = [...costRecords];

  // Filter by date range
  if (startDate) {
    records = records.filter((r) => r.timestamp >= startDate);
  }

  if (endDate) {
    records = records.filter((r) => r.timestamp <= endDate);
  }

  // Calculate totals
  const totalCost = records.reduce((sum, r) => sum + r.cost, 0);
  const totalRequests = records.length;
  const totalTokens = records.reduce((sum, r) => sum + r.totalTokens, 0);

  // Calculate averages
  const avgCostPerRequest = totalRequests > 0 ? totalCost / totalRequests : 0;
  const avgTokensPerRequest = totalRequests > 0 ? totalTokens / totalRequests : 0;
  const avgLatencyMs =
    totalRequests > 0
      ? records.reduce((sum, r) => sum + r.latencyMs, 0) / totalRequests
      : 0;

  // Group by model
  const byModel: any = {};

  for (const model of ['gpt-4', 'claude-3.5-sonnet', 'gemini-1.5-pro'] as AIModel[]) {
    const modelRecords = records.filter((r) => r.model === model);

    if (modelRecords.length > 0) {
      byModel[model] = {
        cost: modelRecords.reduce((sum, r) => sum + r.cost, 0),
        requests: modelRecords.length,
        tokens: modelRecords.reduce((sum, r) => sum + r.totalTokens, 0),
        avgLatency:
          modelRecords.reduce((sum, r) => sum + r.latencyMs, 0) /
          modelRecords.length,
      };
    }
  }

  // Group by task type
  const byTaskType: any = {};
  const taskTypeRecords = records.filter((r) => r.taskType);

  for (const record of taskTypeRecords) {
    const taskType = record.taskType!;

    if (!byTaskType[taskType]) {
      byTaskType[taskType] = { cost: 0, requests: 0 };
    }

    byTaskType[taskType].cost += record.cost;
    byTaskType[taskType].requests++;
  }

  // Date range
  const timestamps = records.map((r) => r.timestamp.getTime());
  const dateRange = {
    start: timestamps.length > 0 ? new Date(Math.min(...timestamps)) : new Date(),
    end: timestamps.length > 0 ? new Date(Math.max(...timestamps)) : new Date(),
  };

  return {
    totalCost,
    totalRequests,
    totalTokens,
    avgCostPerRequest,
    avgTokensPerRequest,
    avgLatencyMs,
    byModel,
    byTaskType: Object.keys(byTaskType).length > 0 ? byTaskType : undefined,
    dateRange,
  };
}

/**
 * Get cost for today
 */
export function getTodayCost(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayRecords = costRecords.filter((r) => r.timestamp >= today);
  return todayRecords.reduce((sum, r) => sum + r.cost, 0);
}

/**
 * Get cost for this week
 */
export function getWeeklyCost(): number {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const weekRecords = costRecords.filter((r) => r.timestamp >= weekAgo);
  return weekRecords.reduce((sum, r) => sum + r.cost, 0);
}

/**
 * Get cost for this month
 */
export function getMonthlyCost(): number {
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);

  const monthRecords = costRecords.filter((r) => r.timestamp >= monthAgo);
  return monthRecords.reduce((sum, r) => sum + r.cost, 0);
}

/**
 * Check if budget limits are exceeded
 */
function checkBudgetLimits(record: CostRecord): void {
  const alerts: CostAlert[] = [];

  // Check per-request limit
  if (currentBudget.perRequest && record.cost > currentBudget.perRequest) {
    alerts.push({
      id: uuidv4(),
      timestamp: new Date(),
      type: 'request-exceeded',
      current: record.cost,
      limit: currentBudget.perRequest,
      percentage: (record.cost / currentBudget.perRequest) * 100,
      message: `Request cost $${record.cost.toFixed(4)} exceeds limit $${currentBudget.perRequest}`,
    });
  }

  // Check daily limit
  if (currentBudget.daily) {
    const todayCost = getTodayCost();
    const threshold = currentBudget.daily * (currentBudget.alertThreshold || 0.8);

    if (todayCost >= threshold) {
      alerts.push({
        id: uuidv4(),
        timestamp: new Date(),
        type: 'daily-exceeded',
        current: todayCost,
        limit: currentBudget.daily,
        percentage: (todayCost / currentBudget.daily) * 100,
        message: `Daily cost $${todayCost.toFixed(2)} reached ${((todayCost / currentBudget.daily) * 100).toFixed(0)}% of $${currentBudget.daily} limit`,
      });
    }
  }

  // Check monthly limit
  if (currentBudget.monthly) {
    const monthlyCost = getMonthlyCost();
    const threshold = currentBudget.monthly * (currentBudget.alertThreshold || 0.8);

    if (monthlyCost >= threshold) {
      alerts.push({
        id: uuidv4(),
        timestamp: new Date(),
        type: 'monthly-exceeded',
        current: monthlyCost,
        limit: currentBudget.monthly,
        percentage: (monthlyCost / currentBudget.monthly) * 100,
        message: `Monthly cost $${monthlyCost.toFixed(2)} reached ${((monthlyCost / currentBudget.monthly) * 100).toFixed(0)}% of $${currentBudget.monthly} limit`,
      });
    }
  }

  // Log and store alerts
  for (const alert of alerts) {
    console.warn('[CostTracker] Alert:', alert.message);
    costAlerts.push(alert);
  }
}

/**
 * Get cost optimization recommendations
 */
export function getOptimizationRecommendations(): CostOptimization {
  const stats = getCostStats();
  const recommendations: CostOptimization['recommendations'] = [];

  // Analyze model usage
  if (stats.byModel['gpt-4'] && stats.byModel['gemini-1.5-pro']) {
    const gpt4Cost = stats.byModel['gpt-4'].cost;
    const geminiCost = stats.byModel['gemini-1.5-pro'].cost;

    if (gpt4Cost > geminiCost * 5) {
      // GPT-4 costs 5x more than Gemini
      const potentialSavings = gpt4Cost * 0.3; // Estimate 30% could use Gemini

      recommendations.push({
        type: 'model-switch',
        description: 'Switch simple classification/analysis tasks from GPT-4 to Gemini',
        estimatedSavings: potentialSavings,
        effort: 'low',
      });
    }
  }

  // Check for repeated queries (could be cached)
  const uniqueRequests = new Set(costRecords.map((r) => `${r.userId}-${r.taskType}`)).size;
  const totalRequests = costRecords.length;

  if (totalRequests > 100 && uniqueRequests < totalRequests * 0.3) {
    // Less than 30% unique = lots of repetition
    const potentialSavings = stats.totalCost * 0.2; // 20% savings from caching

    recommendations.push({
      type: 'cache-responses',
      description: 'Implement response caching for frequently repeated queries',
      estimatedSavings: potentialSavings,
      effort: 'medium',
    });
  }

  // Check average tokens per request
  if (stats.avgTokensPerRequest > 5000) {
    const potentialSavings = stats.totalCost * 0.15; // 15% from context reduction

    recommendations.push({
      type: 'reduce-context',
      description: 'Reduce context size by improving prompt engineering',
      estimatedSavings: potentialSavings,
      effort: 'medium',
    });
  }

  const projectedSavings = recommendations.reduce(
    (sum, r) => sum + r.estimatedSavings,
    0
  );

  return {
    currentCost: stats.totalCost,
    projectedSavings,
    recommendations,
  };
}

/**
 * Get recent cost alerts
 */
export function getRecentAlerts(limit: number = 10): CostAlert[] {
  return costAlerts.slice(-limit).reverse();
}

/**
 * Clear all cost records (for testing)
 */
export function clearCostRecords(): void {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('clearCostRecords can only be used in test environment');
  }

  costRecords.length = 0;
  costAlerts.length = 0;
  console.log('[CostTracker] All records cleared');
}

/**
 * Export cost tracker API
 */
export const CostTracker = {
  initialize: initializeCostTracker,
  getBudget,
  updateBudget,
  track: trackCost,
  trackMultiple: trackCosts,
  getStats: getCostStats,
  getTodayCost,
  getWeeklyCost,
  getMonthlyCost,
  getOptimizations: getOptimizationRecommendations,
  getAlerts: getRecentAlerts,
  clearRecords: clearCostRecords,
} as const;

export default CostTracker;
