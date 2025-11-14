/**
 * Aliff AI - Cost Tracking Types
 *
 * Defines schemas for tracking and analyzing AI costs.
 */

import type { AIModel } from '../types';

/**
 * Cost record for a single request
 */
export interface CostRecord {
  id: string;
  timestamp: Date;
  model: AIModel;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: number; // USD
  latencyMs: number;
  taskType?: string;
  userId?: string;
  sessionId?: string;
}

/**
 * Aggregated cost statistics
 */
export interface CostStats {
  totalCost: number;
  totalRequests: number;
  totalTokens: number;
  avgCostPerRequest: number;
  avgTokensPerRequest: number;
  avgLatencyMs: number;
  byModel: Record<AIModel, {
    cost: number;
    requests: number;
    tokens: number;
    avgLatency: number;
  }>;
  byTaskType?: Record<string, {
    cost: number;
    requests: number;
  }>;
  dateRange: {
    start: Date;
    end: Date;
  };
}

/**
 * Cost optimization recommendation
 */
export interface CostOptimization {
  currentCost: number;
  projectedSavings: number;
  recommendations: Array<{
    type: 'model-switch' | 'batch-requests' | 'cache-responses' | 'reduce-context';
    description: string;
    estimatedSavings: number;
    effort: 'low' | 'medium' | 'high';
  }>;
}

/**
 * Cost budget and alerts
 */
export interface CostBudget {
  daily?: number;
  weekly?: number;
  monthly?: number;
  perRequest?: number;
  alertThreshold?: number; // Percentage (0-1)
}

/**
 * Cost alert
 */
export interface CostAlert {
  id: string;
  timestamp: Date;
  type: 'daily-exceeded' | 'weekly-exceeded' | 'monthly-exceeded' | 'request-exceeded';
  current: number;
  limit: number;
  percentage: number;
  message: string;
}
