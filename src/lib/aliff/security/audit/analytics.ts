/**
 * Aliff AI - Audit Analytics
 *
 * Provides high-level analytics and insights from audit logs.
 * Useful for dashboards, reporting, and continuous improvement.
 */

import type { AliffRole, SensitivityLevel, KnowledgeCategory } from '../../types';
import type { AuditQuery } from './types';
import { queryAuditLogs, getAuditAnalytics } from './storage';

/**
 * Get query activity by role
 */
export async function getQueryActivityByRole(
  startDate?: Date,
  endDate?: Date
): Promise<Record<AliffRole, number>> {
  const query: AuditQuery = {
    eventTypes: ['query'],
    startDate,
    endDate,
    limit: 10000,
  };

  const analytics = await getAuditAnalytics(query);
  return analytics.byRole as Record<AliffRole, number>;
}

/**
 * Get retrieval performance metrics
 */
export async function getRetrievalPerformance(
  startDate?: Date,
  endDate?: Date
): Promise<{
  avgRetrievalTimeMs: number;
  avgEmbeddingTimeMs: number;
  avgDocumentsRetrieved: number;
  avgTopScore: number;
  totalRetrievals: number;
}> {
  const events = await queryAuditLogs({
    eventTypes: ['retrieval'],
    startDate,
    endDate,
    limit: 10000,
  });

  if (events.length === 0) {
    return {
      avgRetrievalTimeMs: 0,
      avgEmbeddingTimeMs: 0,
      avgDocumentsRetrieved: 0,
      avgTopScore: 0,
      totalRetrievals: 0,
    };
  }

  let totalRetrievalTime = 0;
  let totalEmbeddingTime = 0;
  let totalDocuments = 0;
  let totalTopScore = 0;

  events.forEach((event: any) => {
    totalRetrievalTime += event.metadata.retrievalTimeMs || 0;
    totalEmbeddingTime += event.metadata.embeddingTimeMs || 0;
    totalDocuments += event.metadata.documentsRetrieved || 0;
    totalTopScore += event.metadata.topScore || 0;
  });

  return {
    avgRetrievalTimeMs: totalRetrievalTime / events.length,
    avgEmbeddingTimeMs: totalEmbeddingTime / events.length,
    avgDocumentsRetrieved: totalDocuments / events.length,
    avgTopScore: totalTopScore / events.length,
    totalRetrievals: events.length,
  };
}

/**
 * Get security events summary
 */
export async function getSecurityEventsSummary(
  startDate?: Date,
  endDate?: Date
): Promise<{
  totalAccessDenied: number;
  totalFilterTriggers: number;
  totalLeaksDetected: number;
  criticalLeaks: number;
  accessDeniedByRole: Record<string, number>;
}> {
  const analytics = await getAuditAnalytics({
    startDate,
    endDate,
  });

  // Get critical leaks
  const leakEvents = await queryAuditLogs({
    eventTypes: ['leak_detected'],
    severity: ['critical'],
    startDate,
    endDate,
    limit: 10000,
  });

  // Get access denied by role
  const accessDeniedEvents = await queryAuditLogs({
    eventTypes: ['access_denied'],
    startDate,
    endDate,
    limit: 10000,
  });

  const accessDeniedByRole: Record<string, number> = {};
  accessDeniedEvents.forEach((event: any) => {
    accessDeniedByRole[event.role] = (accessDeniedByRole[event.role] || 0) + 1;
  });

  return {
    totalAccessDenied: analytics.totalAccessDenied || 0,
    totalFilterTriggers: analytics.totalFilterTriggers || 0,
    totalLeaksDetected: analytics.totalLeaksDetected || 0,
    criticalLeaks: leakEvents.length,
    accessDeniedByRole,
  };
}

/**
 * Get most accessed knowledge categories
 */
export async function getTopKnowledgeCategories(
  role?: AliffRole,
  limit: number = 10,
  startDate?: Date,
  endDate?: Date
): Promise<Array<{ category: KnowledgeCategory; count: number }>> {
  const events = await queryAuditLogs({
    eventTypes: ['retrieval'],
    roles: role ? [role] : undefined,
    startDate,
    endDate,
    limit: 10000,
  });

  const categoryCount: Record<string, number> = {};

  events.forEach((event: any) => {
    const categories = event.metadata.categories || [];
    categories.forEach((cat: string) => {
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
  });

  return Object.entries(categoryCount)
    .map(([category, count]) => ({ category: category as KnowledgeCategory, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Get most accessed sensitivity levels
 */
export async function getAccessBySensitivity(
  role?: AliffRole,
  startDate?: Date,
  endDate?: Date
): Promise<Record<SensitivityLevel, number>> {
  const events = await queryAuditLogs({
    eventTypes: ['retrieval'],
    roles: role ? [role] : undefined,
    startDate,
    endDate,
    limit: 10000,
  });

  const sensitivityCount: Record<string, number> = {};

  events.forEach((event: any) => {
    const sensitivities = event.metadata.sensitivityLevels || [];
    sensitivities.forEach((sens: string) => {
      sensitivityCount[sens] = (sensitivityCount[sens] || 0) + 1;
    });
  });

  return sensitivityCount as Record<SensitivityLevel, number>;
}

/**
 * Get user session summary
 */
export async function getUserSessionSummary(
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<{
  totalQueries: number;
  totalRetrievals: number;
  avgResponseTimeMs: number;
  accessDeniedCount: number;
  filterTriggeredCount: number;
  topCategories: string[];
  sessionDuration?: number;
}> {
  const allEvents = await queryAuditLogs({
    userId,
    startDate,
    endDate,
    limit: 10000,
  });

  const queries = allEvents.filter((e) => e.eventType === 'query');
  const retrievals = allEvents.filter((e) => e.eventType === 'retrieval');
  const responses = allEvents.filter((e) => e.eventType === 'response');
  const accessDenied = allEvents.filter((e) => e.eventType === 'access_denied');
  const filterTriggered = allEvents.filter((e) => e.eventType === 'filter_triggered');

  // Calculate avg response time
  let avgResponseTimeMs = 0;
  if (responses.length > 0) {
    const totalResponseTime = responses.reduce((sum, e: any) => {
      return sum + (e.metadata.responseTimeMs || 0);
    }, 0);
    avgResponseTimeMs = totalResponseTime / responses.length;
  }

  // Get top categories
  const categoryCount: Record<string, number> = {};
  retrievals.forEach((event: any) => {
    const categories = event.metadata.categories || [];
    categories.forEach((cat: string) => {
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
  });

  const topCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([cat]) => cat);

  // Calculate session duration
  let sessionDuration: number | undefined;
  if (allEvents.length > 1) {
    const timestamps = allEvents.map((e) => e.timestamp.getTime());
    sessionDuration = Math.max(...timestamps) - Math.min(...timestamps);
  }

  return {
    totalQueries: queries.length,
    totalRetrievals: retrievals.length,
    avgResponseTimeMs,
    accessDeniedCount: accessDenied.length,
    filterTriggeredCount: filterTriggered.length,
    topCategories,
    sessionDuration,
  };
}

/**
 * Get daily activity trend
 */
export async function getDailyActivityTrend(
  days: number = 30,
  role?: AliffRole
): Promise<Array<{ date: string; queries: number; leaks: number; accessDenied: number }>> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const events = await queryAuditLogs({
    roles: role ? [role] : undefined,
    startDate,
    endDate,
    limit: 50000,
  });

  // Group by date
  const dailyStats: Record<
    string,
    { queries: number; leaks: number; accessDenied: number }
  > = {};

  events.forEach((event) => {
    const dateKey = event.timestamp.toISOString().split('T')[0];

    if (!dailyStats[dateKey]) {
      dailyStats[dateKey] = { queries: 0, leaks: 0, accessDenied: 0 };
    }

    if (event.eventType === 'query') {
      dailyStats[dateKey].queries++;
    } else if (event.eventType === 'leak_detected') {
      dailyStats[dateKey].leaks++;
    } else if (event.eventType === 'access_denied') {
      dailyStats[dateKey].accessDenied++;
    }
  });

  return Object.entries(dailyStats)
    .map(([date, stats]) => ({ date, ...stats }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Export analytics API
 */
export const AuditAnalytics = {
  getQueryActivityByRole,
  getRetrievalPerformance,
  getSecurityEventsSummary,
  getTopKnowledgeCategories,
  getAccessBySensitivity,
  getUserSessionSummary,
  getDailyActivityTrend,
} as const;
