/**
 * Aliff AI - Leak Detection Alerts
 *
 * Manages alerts for detected strategy leaks.
 * Includes notification, review workflow, and resolution tracking.
 */

import { v4 as uuidv4 } from 'uuid';
import type { AliffRole } from '../../types';
import type {
  LeakDetection,
  LeakAlert,
  LeakAnalytics,
  LeakSeverity,
  LeakType,
} from './types';
import { AuditLogger } from '../audit';

/**
 * In-memory storage for leak alerts
 * In production, this would use a database
 */
const alertStore: LeakAlert[] = [];

/**
 * Create a leak alert
 */
export async function createLeakAlert(
  detection: LeakDetection,
  role: AliffRole,
  query: string,
  response: string,
  autoBlocked: boolean,
  userId?: string,
  sessionId?: string
): Promise<LeakAlert> {
  const alert: LeakAlert = {
    id: uuidv4(),
    detection,
    role,
    userId,
    sessionId,
    query,
    response,
    autoBlocked,
    requiresReview: detection.severity === 'high' || detection.severity === 'medium',
    resolution: autoBlocked ? 'blocked' : 'pending',
    timestamp: new Date(),
  };

  alertStore.push(alert);

  // Log to audit system
  await AuditLogger.logLeakDetected(
    detection.leakType,
    detection.confidence,
    detection.flaggedText,
    autoBlocked,
    role,
    userId,
    sessionId,
    {
      alertSent: true,
    }
  );

  // In production: Send notification to admins
  if (detection.severity === 'critical') {
    await sendCriticalLeakNotification(alert);
  }

  return alert;
}

/**
 * Get all pending alerts (for review)
 */
export async function getPendingAlerts(): Promise<LeakAlert[]> {
  return alertStore.filter((a) => a.resolution === 'pending');
}

/**
 * Get alerts by role
 */
export async function getAlertsByRole(role: AliffRole): Promise<LeakAlert[]> {
  return alertStore.filter((a) => a.role === role);
}

/**
 * Get alerts by severity
 */
export async function getAlertsBySeverity(
  severity: LeakSeverity
): Promise<LeakAlert[]> {
  return alertStore.filter((a) => a.detection.severity === severity);
}

/**
 * Review and resolve an alert
 */
export async function reviewAlert(
  alertId: string,
  resolution: 'approved' | 'blocked',
  reviewerId: string,
  notes?: string
): Promise<LeakAlert | null> {
  const alert = alertStore.find((a) => a.id === alertId);

  if (!alert) {
    return null;
  }

  alert.resolution = resolution;
  alert.reviewedBy = reviewerId;
  alert.reviewedAt = new Date();
  alert.reviewNotes = notes;

  console.log(`[LeakAlert] Alert ${alertId} resolved as ${resolution} by ${reviewerId}`);

  return alert;
}

/**
 * Get leak analytics
 */
export async function getLeakAnalytics(
  startDate?: Date,
  endDate?: Date
): Promise<LeakAnalytics> {
  let alerts = [...alertStore];

  // Filter by date range
  if (startDate) {
    alerts = alerts.filter((a) => a.timestamp >= startDate);
  }

  if (endDate) {
    alerts = alerts.filter((a) => a.timestamp <= endDate);
  }

  // Count by type
  const byType: Record<string, number> = {};
  alerts.forEach((a) => {
    byType[a.detection.leakType] = (byType[a.detection.leakType] || 0) + 1;
  });

  // Count by severity
  const bySeverity: Record<string, number> = {};
  alerts.forEach((a) => {
    bySeverity[a.detection.severity] = (bySeverity[a.detection.severity] || 0) + 1;
  });

  // Count by role
  const byRole: Record<string, number> = {};
  alerts.forEach((a) => {
    byRole[a.role] = (byRole[a.role] || 0) + 1;
  });

  // Count auto-blocked
  const autoBlockedCount = alerts.filter((a) => a.autoBlocked).length;

  // Count pending review
  const pendingReviewCount = alerts.filter((a) => a.resolution === 'pending').length;

  // Calculate false positive rate (if we have reviewed alerts)
  const reviewedAlerts = alerts.filter((a) => a.reviewedAt);
  const falsePositives = reviewedAlerts.filter((a) => a.resolution === 'approved').length;
  const falsePositiveRate =
    reviewedAlerts.length > 0 ? falsePositives / reviewedAlerts.length : undefined;

  // Date range
  const timestamps = alerts.map((a) => a.timestamp.getTime());
  const dateRange = {
    start: timestamps.length > 0 ? new Date(Math.min(...timestamps)) : new Date(),
    end: timestamps.length > 0 ? new Date(Math.max(...timestamps)) : new Date(),
  };

  return {
    totalDetections: alerts.length,
    byType: byType as Record<LeakType, number>,
    bySeverity: bySeverity as Record<LeakSeverity, number>,
    byRole: byRole as Record<AliffRole, number>,
    autoBlockedCount,
    pendingReviewCount,
    falsePositiveRate,
    dateRange,
  };
}

/**
 * Send notification for critical leak
 */
async function sendCriticalLeakNotification(alert: LeakAlert): Promise<void> {
  // In production: Send email/Slack notification
  console.error('[CRITICAL LEAK DETECTED]', {
    alertId: alert.id,
    role: alert.role,
    leakType: alert.detection.leakType,
    confidence: alert.detection.confidence,
    flaggedText: alert.detection.flaggedText.substring(0, 100),
    autoBlocked: alert.autoBlocked,
  });

  // Example notification payload:
  // await sendSlackNotification({
  //   channel: '#security-alerts',
  //   text: `🚨 CRITICAL LEAK DETECTED`,
  //   blocks: [
  //     {
  //       type: 'section',
  //       text: {
  //         type: 'mrkdwn',
  //         text: `*Critical Leak Alert*\n*Type:* ${alert.detection.leakType}\n*Role:* ${alert.role}\n*Confidence:* ${alert.detection.confidence.toFixed(2)}\n*Auto-blocked:* ${alert.autoBlocked ? 'Yes' : 'No'}`,
  //       },
  //     },
  //     {
  //       type: 'section',
  //       text: {
  //         type: 'plain_text',
  //         text: alert.detection.flaggedText,
  //       },
  //     },
  //   ],
  // });
}

/**
 * Get alert statistics by time period
 */
export async function getAlertTrend(
  days: number = 30
): Promise<Array<{ date: string; count: number; critical: number }>> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const alerts = alertStore.filter(
    (a) => a.timestamp >= startDate && a.timestamp <= endDate
  );

  // Group by date
  const dailyStats: Record<string, { count: number; critical: number }> = {};

  alerts.forEach((alert) => {
    const dateKey = alert.timestamp.toISOString().split('T')[0];

    if (!dailyStats[dateKey]) {
      dailyStats[dateKey] = { count: 0, critical: 0 };
    }

    dailyStats[dateKey].count++;

    if (alert.detection.severity === 'critical') {
      dailyStats[dateKey].critical++;
    }
  });

  return Object.entries(dailyStats)
    .map(([date, stats]) => ({ date, ...stats }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Clear all alerts (for testing only)
 */
export async function clearAllAlerts(): Promise<void> {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('clearAllAlerts can only be used in test environment');
  }

  alertStore.length = 0;
  console.log('[LeakAlert] All alerts cleared');
}

/**
 * Export leak alert API
 */
export const LeakAlerts = {
  create: createLeakAlert,
  getPending: getPendingAlerts,
  getByRole: getAlertsByRole,
  getBySeverity: getAlertsBySeverity,
  review: reviewAlert,
  getAnalytics: getLeakAnalytics,
  getTrend: getAlertTrend,
  clearAll: clearAllAlerts,
} as const;
